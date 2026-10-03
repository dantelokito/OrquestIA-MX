import { test, expect } from "@playwright/test";
import { loginAs, registerUnverifiedProvider, withAuth } from "../../fixtures/auth";
import { buildPosSalePayload, randomIdempotencyKey } from "../../fixtures/orders";
import {
  addDaysYmd,
  createLocalProduct,
  createSection,
  f10Suffix,
  monterreyYmd,
} from "../../fixtures/f10";

function monterreyToday(): { day: string; month: string; year: string } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Monterrey",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const year = parts.find((p) => p.type === "year")?.value ?? "2026";
  const month = parts.find((p) => p.type === "month")?.value ?? "08";
  const day = parts.find((p) => p.type === "day")?.value ?? "17";
  return { day: `${year}-${month}-${day}`, month: `${year}-${month}`, year };
}

test.describe("API REPORTS F6 — TC-REP", () => {
  test("TC-REP-001: GET reports grain=day → 200 envelope", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const { day } = monterreyToday();
    const response = await request.get(`/api/provider/reports?grain=day&date=${day}`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.timezone).toBe("America/Monterrey");
    expect(body.data.period.grain).toBe("day");
    expect(body.data.period.date).toBe(day);
    expect(body.data.kpis.bySource.MARKETPLACE).toBeDefined();
    expect(body.data.kpis.bySource.POS).toBeDefined();
    expect(body.data.series).toEqual([]);
    expect(typeof body.data.empty).toBe("boolean");
  });

  test("TC-REP-002: GET reports grain=month series por día", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const { month } = monterreyToday();
    const response = await request.get(`/api/provider/reports?grain=month&date=${month}`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.period.grain).toBe("month");
    expect(body.data.series.length).toBeGreaterThanOrEqual(28);
    expect(body.data.series[0].bucket).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  test("TC-REP-003: GET reports grain=year series por mes", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const { year } = monterreyToday();
    const response = await request.get(`/api/provider/reports?grain=year&date=${year}`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.series.length).toBe(12);
    expect(body.data.series[0].bucket).toMatch(/^\d{4}-\d{2}$/);
  });

  test("TC-REP-004: periodo vacío 2020-01-01 empty true no 404", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const response = await request.get("/api/provider/reports?grain=day&date=2020-01-01");
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.empty).toBe(true);
    expect(body.data.kpis.orderCount).toBe(0);
    expect(body.data.kpis.gmv).toMatch(/^0/);
  });

  test("TC-REP-005: grain ausente → 400", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const { day } = monterreyToday();
    const response = await request.get(`/api/provider/reports?date=${day}`);
    expect(response.status()).toBe(400);
  });

  test("TC-REP-006: grain=month date=YYYY-MM-DD → 400", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const response = await request.get("/api/provider/reports?grain=month&date=2026-08-16");
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(JSON.stringify(body)).toMatch(/grain=month|inválido/i);
  });

  test("TC-REP-007: date futura → 400", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const response = await request.get("/api/provider/reports?grain=day&date=2099-01-01");
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(JSON.stringify(body)).toMatch(/futuro/i);
  });

  test("TC-REP-008: PDF 200 application/pdf periodo vacío", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const response = await request.get("/api/provider/reports.pdf?grain=day&date=2020-01-01");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toMatch(/application\/pdf/);
    expect(response.headers()["content-disposition"]).toMatch(/attachment; filename="reporte-.*\.pdf"/);
    const buf = await response.body();
    expect(buf.subarray(0, 4).toString()).toBe("%PDF");
  });

  test("TC-REP-009: PDF query inválida → 400 JSON", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const response = await request.get("/api/provider/reports.pdf?grain=day&date=2099-01-01");
    expect(response.status()).toBe(400);
    expect(response.headers()["content-type"]).toMatch(/json/);
  });

  test("TC-REP-010: POS del día refleja orderCount", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const panel = await request.get("/api/provider/products", withAuth(request));
    const catalog = (await panel.json()).data.catalog as {
      isAvailable: boolean;
      providerProductId: string | null;
    }[];
    const own = catalog.find((r) => r.isAvailable && r.providerProductId);
    test.skip(!own?.providerProductId, "sin SKU propio");
    const pos = await request.post(
      "/api/provider/pos/sales",
      withAuth(request, {
        headers: { "Idempotency-Key": randomIdempotencyKey() },
        data: buildPosSalePayload([{ providerProductId: own.providerProductId as string, quantity: 1 }]),
      })
    );
    expect(pos.ok()).toBeTruthy();
    const { day } = monterreyToday();
    const response = await request.get(`/api/provider/reports?grain=day&date=${day}`, withAuth(request));
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.empty).toBe(false);
    expect(body.data.kpis.orderCount).toBeGreaterThanOrEqual(1);
    expect(body.data.kpis.bySource.POS.orderCount).toBeGreaterThanOrEqual(1);
  });
});

test.describe("API REPORTS F10 — TC-REP rango", () => {
  test("TC-REP-011: GET from+to → 200 modo range", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const today = monterreyYmd();
    const from = `${today.slice(0, 7)}-01`;
    const response = await request.get(
      `/api/provider/reports?from=${from}&to=${today}`,
      withAuth(request)
    );
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.timezone).toBe("America/Monterrey");
    expect(body.data.period.mode).toBe("range");
    expect(body.data.period.from).toBe(from);
    expect(body.data.period.to).toBe(today);
    expect(Array.isArray(body.data.products)).toBe(true);
    expect(Array.isArray(body.data.series)).toBe(true);
  });

  test("TC-REP-012: periodo vacío 2020 → empty true", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const response = await request.get(
      "/api/provider/reports?from=2020-01-01&to=2020-01-02",
      withAuth(request)
    );
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.empty).toBe(true);
    expect(body.data.products).toEqual([]);
  });

  test("TC-REP-013: mezcla grain+from → 400", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const today = monterreyYmd();
    const response = await request.get(
      `/api/provider/reports?grain=day&date=${today}&from=${today}&to=${today}`,
      withAuth(request)
    );
    expect(response.status()).toBe(400);
  });

  test("TC-REP-014: from>to → 400", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const response = await request.get(
      "/api/provider/reports?from=2026-08-20&to=2026-08-01",
      withAuth(request)
    );
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(JSON.stringify(body)).toMatch(/from|inicio|posterior/i);
  });

  test("TC-REP-015: span 367 días → 400", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const to = monterreyYmd();
    const from = addDaysYmd(to, -367);
    const response = await request.get(
      `/api/provider/reports?from=${from}&to=${to}`,
      withAuth(request)
    );
    expect(response.status()).toBe(400);
  });

  test("TC-REP-016: productIds ajeno → 403", async ({ request }) => {
    await registerUnverifiedProvider(request, "f10rep");
    const section = await createSection(request, `Rep ${f10Suffix()}`);
    expect(section.ok()).toBeTruthy();
    const sectionId = (await section.json()).data.id as string;
    const local = await createLocalProduct(request, {
      name: `Ajeno ${f10Suffix()}`,
      sectionId,
    });
    expect(local.ok()).toBeTruthy();
    const foreignId = (await local.json()).data.providerProductId as string;

    await loginAs(request, "PROVIDER");
    const today = monterreyYmd();
    const response = await request.get(
      `/api/provider/reports?from=${today}&to=${today}&productIds=${foreignId}`,
      withAuth(request)
    );
    expect(response.status()).toBe(403);
  });

  test("TC-REP-017/018: productIds recorta y products[] completo", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const panel = await request.get("/api/provider/products", withAuth(request));
    expect(panel.ok()).toBeTruthy();
    const catalog = (await panel.json()).data.catalog as {
      isAvailable: boolean;
      providerProductId: string | null;
    }[];
    const own = catalog.find((r) => r.isAvailable && r.providerProductId);
    test.skip(!own?.providerProductId, "sin SKU propio disponible");
    const ppId = own.providerProductId as string;

    const pos = await request.post(
      "/api/provider/pos/sales",
      withAuth(request, {
        headers: { "Idempotency-Key": randomIdempotencyKey() },
        data: buildPosSalePayload([{ providerProductId: ppId, quantity: 1 }]),
      })
    );
    expect(pos.ok()).toBeTruthy();

    const today = monterreyYmd();
    const all = await request.get(
      `/api/provider/reports?from=${today}&to=${today}`,
      withAuth(request)
    );
    expect(all.status()).toBe(200);
    const allBody = await all.json();
    expect(Array.isArray(allBody.data.products)).toBe(true);

    const filtered = await request.get(
      `/api/provider/reports?from=${today}&to=${today}&productIds=${ppId}`,
      withAuth(request)
    );
    expect(filtered.status()).toBe(200);
    const filtBody = await filtered.json();
    if (!filtBody.data.empty) {
      const ids = (filtBody.data.products as { providerProductId: string | null }[]).map(
        (p) => p.providerProductId
      );
      expect(ids.every((id) => id === ppId || id === null)).toBe(true);
    }
  });
});
