import { test, expect } from "@playwright/test";
import {
  assertResponseTime,
  credentials,
  loginAs,
  loginWithCredentials,
  rememberSessionCookie,
  registerUnverifiedProvider,
  withAuth,
} from "../../fixtures/auth";
import { createLocalProduct, ensureOwnSection, f10Suffix, monterreyYmd } from "../../fixtures/f10";
import { buildPosSalePayload, randomIdempotencyKey } from "../../fixtures/orders";

type Req = Parameters<typeof createLocalProduct>[0];

function errorCode(body: { error?: unknown }): string | undefined {
  const err = body.error;
  if (typeof err === "string") return err;
  if (err && typeof err === "object" && "code" in err) {
    return String((err as { code: string }).code);
  }
  return undefined;
}

function errorText(body: { error?: unknown }): string {
  const err = body.error;
  if (typeof err === "string") return err;
  if (err && typeof err === "object" && "message" in err) {
    return String((err as { message: string }).message);
  }
  return JSON.stringify(err ?? "");
}

async function createSku(request: Req) {
  const sectionId = await ensureOwnSection(request, `F14 ${f10Suffix()}`);
  const name = `QA-F14-${f10Suffix()}`;
  const created = await createLocalProduct(request, { name, sectionId, unit: "KG", price: 18.5 });
  expect(created.status(), await created.text()).toBe(201);
  const row = await created.json();
  return {
    name,
    productId: row.data.productId as string,
    providerProductId: row.data.providerProductId as string,
  };
}

async function getMe(request: Req) {
  const res = await request.get("/api/provider/me", withAuth(request));
  expect(res.status(), await res.text()).toBe(200);
  return (await res.json()).data as Record<string, unknown>;
}

test.describe("API F14 — perfil, catálogo, inventario, reportes, RBAC", () => {
  test("TC-F14-001: GET /api/provider/me 200 con identidad y isVerified", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const start = Date.now();
    const res = await request.get("/api/provider/me", withAuth(request));
    assertResponseTime(start);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.data.id).toBeTruthy();
    expect(typeof body.data.businessName).toBe("string");
    expect(typeof body.data.isVerified).toBe("boolean");
    expect(body.data).toHaveProperty("posShowImages");
    expect(body.data).toHaveProperty("latitude");
    expect(body.data).toHaveProperty("longitude");
  });

  test("TC-F14-002: PATCH datos de negocio no resetea isVerified", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const before = await getMe(request);
    const verified = before.isVerified;
    const originalName = before.businessName as string;
    const patch = await request.patch(
      "/api/provider/me",
      withAuth(request, {
        data: {
          businessName: `${originalName}`.slice(0, 60),
          address: (before.address as string) || "Av. Juárez 123, Centro",
          city: "Monterrey",
          latitude: 25.6714,
          longitude: -100.3089,
        },
      })
    );
    expect(patch.status(), await patch.text()).toBe(200);
    const after = await patch.json();
    expect(after.data.isVerified).toBe(verified);
    await request.patch(
      "/api/provider/me",
      withAuth(request, {
        data: {
          businessName: originalName,
          address: before.address,
          city: before.city,
          latitude: before.latitude,
          longitude: before.longitude,
        },
      })
    );
  });

  test("TC-F14-003: PATCH openingHours válido", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const before = await getMe(request);
    const hours = [
      { day: 1, open: "08:00", close: "18:00", closed: false },
      { day: 0, open: null, close: null, closed: true },
    ];
    const res = await request.patch("/api/provider/me", withAuth(request, { data: { openingHours: hours } }));
    expect(res.status(), await res.text()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.data.openingHours)).toBe(true);
    if (before.openingHours) {
      await request.patch("/api/provider/me", withAuth(request, { data: { openingHours: before.openingHours } }));
    }
  });

  test("TC-F14-004: PATCH capacidades y prep time", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const before = await getMe(request);
    const res = await request.patch(
      "/api/provider/me",
      withAuth(request, {
        data: {
          whatsappEnabled: true,
          offersWholesale: true,
          offersRetail: true,
          offersDelivery: Boolean(before.offersDelivery),
          preparationTimeMinutes: 15,
        },
      })
    );
    expect(res.status(), await res.text()).toBe(200);
    const body = await res.json();
    expect(body.data.offersWholesale).toBe(true);
    expect(body.data.preparationTimeMinutes).toBe(15);
    await request.patch(
      "/api/provider/me",
      withAuth(request, {
        data: {
          whatsappEnabled: before.whatsappEnabled,
          offersWholesale: before.offersWholesale,
          offersRetail: before.offersRetail,
          offersDelivery: before.offersDelivery,
          preparationTimeMinutes: before.preparationTimeMinutes,
        },
      })
    );
  });

  test("TC-F14-005: PATCH posShowImages por sucursal", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const before = await getMe(request);
    const next = !(before.posShowImages !== false);
    const res = await request.patch("/api/provider/me", withAuth(request, { data: { posShowImages: next } }));
    expect(res.status(), await res.text()).toBe(200);
    expect((await res.json()).data.posShowImages).toBe(next);
    await request.patch(
      "/api/provider/me",
      withAuth(request, { data: { posShowImages: before.posShowImages !== false } })
    );
  });

  test("TC-F14-006: activar GLOBAL con precio > 0 (nunca $50)", async ({ request }) => {
    await loginAs(request, "ADMIN");
    const name = `QA-F14-G-${f10Suffix()}`;
    const created = await request.post(
      "/api/admin/products",
      withAuth(request, {
        data: { name, slug: `qa-f14-g-${f10Suffix()}`, category: "FRUTA", unit: "KG" },
      })
    );
    expect(created.status(), await created.text()).toBe(201);
    const productId = (await created.json()).data.id as string;
    await loginAs(request, "PROVIDER");
    const ok = await request.patch(
      `/api/provider/products/by-product/${productId}`,
      withAuth(request, { data: { isAvailable: true, price: 27.5 } })
    );
    expect(ok.status(), await ok.text()).toBeGreaterThanOrEqual(200);
    expect(ok.status()).toBeLessThan(300);
    const row = await ok.json();
    const price = Number(row.data.price ?? row.data.offerPrice);
    expect(price).toBeCloseTo(27.5, 2);
    expect(price).not.toBe(50);
  });

  test("TC-F14-007: DELETE sección vacía 2xx", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const section = await request.post(
      "/api/provider/sections",
      withAuth(request, { data: { name: `Vacía F14 ${f10Suffix()}` } })
    );
    expect(section.status(), await section.text()).toBe(201);
    const id = (await section.json()).data.id as string;
    const del = await request.delete(`/api/provider/sections/${id}`, withAuth(request));
    expect([200, 204]).toContain(del.status());
  });

  test("TC-F14-008: merma happy path 201 y saldo", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const sku = await createSku(request);
    const entry = await request.post(
      `/api/provider/inventory/${sku.providerProductId}/entries`,
      withAuth(request, { data: { quantity: "10.000", receiveAs: "CATALOG" } })
    );
    expect(entry.status(), await entry.text()).toBeGreaterThanOrEqual(200);
    expect(entry.status()).toBeLessThan(300);
    const merma = await request.post(
      `/api/provider/inventory/${sku.providerProductId}/shrinkage`,
      withAuth(request, { data: { quantity: "5.000", reason: "CADUCIDAD", note: "QA merma" } })
    );
    expect(merma.status(), await merma.text()).toBe(201);
    const body = await merma.json();
    expect(body.data.kind).toBe("MERMA");
    expect(Number(body.data.onHandAfter)).toBeCloseTo(5, 3);
    expect(body.data.reason).toBe("CADUCIDAD");
  });

  test("TC-F14-009: ajuste conteo mayor que saldo", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const sku = await createSku(request);
    await request.post(
      `/api/provider/inventory/${sku.providerProductId}/entries`,
      withAuth(request, { data: { quantity: "8.000", receiveAs: "CATALOG" } })
    );
    const adj = await request.post(
      `/api/provider/inventory/${sku.providerProductId}/adjustments`,
      withAuth(request, { data: { countedOnHand: "12.000", note: "QA conteo alto" } })
    );
    expect(adj.status(), await adj.text()).toBe(201);
    const body = await adj.json();
    expect(body.data.kind).toBe("AJUSTE");
    expect(Number(body.data.onHandAfter)).toBeCloseTo(12, 3);
    expect(Number(body.data.appliedDelta)).toBeCloseTo(4, 3);
  });

  test("TC-F14-010: movimientos ENTRADA+MERMA+AJUSTE sin ventas POS", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const sku = await createSku(request);
    await request.post(
      `/api/provider/inventory/${sku.providerProductId}/entries`,
      withAuth(request, { data: { quantity: "6.000", receiveAs: "CATALOG" } })
    );
    await request.post(
      `/api/provider/inventory/${sku.providerProductId}/shrinkage`,
      withAuth(request, { data: { quantity: "1.000", reason: "OTRO", note: "muestra" } })
    );
    await request.post(
      `/api/provider/inventory/${sku.providerProductId}/adjustments`,
      withAuth(request, { data: { countedOnHand: "4.000" } })
    );
    const sale = await request.post(
      "/api/provider/pos/sales",
      withAuth(request, {
        headers: { "Idempotency-Key": randomIdempotencyKey() },
        data: buildPosSalePayload([
          { providerProductId: sku.providerProductId, quantity: 1, unitOfMeasure: "KG" },
        ]),
      })
    );
    expect(sale.status(), await sale.text()).toBeGreaterThanOrEqual(200);
    expect(sale.status()).toBeLessThan(300);

    const list = await request.get(
      `/api/provider/inventory/movements?page=1&limit=50&providerProductId=${sku.providerProductId}`,
      withAuth(request)
    );
    expect(list.status(), await list.text()).toBe(200);
    const body = await list.json();
    expect(Array.isArray(body.data)).toBe(true);
    const kinds = (body.data as { kind: string }[]).map((r) => r.kind);
    expect(kinds).toEqual(expect.arrayContaining(["ENTRADA", "MERMA", "AJUSTE"]));
    expect(kinds.every((k) => k === "ENTRADA" || k === "MERMA" || k === "AJUSTE")).toBe(true);
    expect(kinds).not.toContain("VENTA_POS");
    expect(kinds).not.toContain("VENTA");
    expect(kinds).not.toContain("DELIVERED");
  });

  test("TC-F14-011: GET reports/global N>1 pinta series, products, bySource", async ({ request }) => {
    await loginWithCredentials(request, credentials.provider.email, credentials.provider.password);
    const today = monterreyYmd();
    const from = today.slice(0, 8) + "01";
    const start = Date.now();
    const res = await request.get(
      `/api/provider/reports/global?from=${from}&to=${today}`,
      withAuth(request)
    );
    assertResponseTime(start);
    expect(res.status(), await res.text()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.data.series)).toBe(true);
    expect(Array.isArray(body.data.products)).toBe(true);
    const bySource = body.data.kpis?.bySource ?? body.data.bySource;
    expect(bySource).toBeTruthy();
    expect(bySource.MARKETPLACE ?? bySource.POS).toBeDefined();
  });

  test("TC-F14-012: PDF reports from/to application/pdf", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const today = monterreyYmd();
    const from = today.slice(0, 8) + "01";
    const res = await request.get(`/api/provider/reports.pdf?from=${from}&to=${today}`, withAuth(request));
    expect(res.status(), await res.text()).toBe(200);
    expect(res.headers()["content-type"]).toMatch(/application\/pdf/);
    const cd = res.headers()["content-disposition"] ?? "";
    expect(cd).toMatch(/attachment/);
    expect(cd).toMatch(/\.pdf/i);
    expect(cd.toLowerCase()).not.toMatch(/grain/);
    const buf = await res.body();
    expect(buf.slice(0, 4).toString()).toBe("%PDF");
  });

  test("TC-F14-020: geo fuera de AMM → 400", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const before = await getMe(request);
    const res = await request.patch(
      "/api/provider/me",
      withAuth(request, { data: { latitude: 19.4326, longitude: -99.1332 } })
    );
    expect(res.status(), await res.text()).toBe(400);
    const body = await res.json();
    expect(errorText(body).toLowerCase() + JSON.stringify(body.details ?? [])).toMatch(
      /monterrey|validat|latitud|área/i
    );
    const after = await getMe(request);
    expect(after.latitude).toBe(before.latitude);
    expect(after.longitude).toBe(before.longitude);
  });

  test("TC-F14-021: openingHours open >= close → 400", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const res = await request.patch(
      "/api/provider/me",
      withAuth(request, {
        data: { openingHours: [{ day: 1, open: "18:00", close: "08:00", closed: false }] },
      })
    );
    expect(res.status(), await res.text()).toBe(400);
  });

  test("TC-F14-022: Google lock si no isVerified → 403", async ({ request }) => {
    await registerUnverifiedProvider(request, "f14g");
    const me = await getMe(request);
    expect(me.isVerified).toBe(false);
    const res = await request.patch(
      "/api/provider/me",
      withAuth(request, {
        data: {
          googlePlaceId: "ChIJN1t_tDeuEmsRUsoyG83frY4",
          googleMapsUrl: "https://maps.google.com/?cid=1",
          googleReviewsEnabled: true,
        },
      })
    );
    expect(res.status(), await res.text()).toBe(403);
    expect(errorText(await res.json())).toMatch(/verific/i);
  });

  test("TC-F14-023: Place ID inválido en verificado → 400", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const me = await getMe(request);
    test.skip(me.isVerified !== true, "El Paraíso seed debe estar verificado");
    const res = await request.patch("/api/provider/me", withAuth(request, { data: { googlePlaceId: "bad" } }));
    expect(res.status(), await res.text()).toBe(400);
  });

  test("TC-F14-024: PATCH body con isVerified → 400 y no muta", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const before = await getMe(request);
    const res = await request.patch(
      "/api/provider/me",
      withAuth(request, { data: { isVerified: !before.isVerified } })
    );
    expect(res.status(), await res.text()).toBe(400);
    const after = await getMe(request);
    expect(after.isVerified).toBe(before.isVerified);
  });

  test("TC-F14-025: activar GLOBAL sin precio → 400, no $50", async ({ request }) => {
    await loginAs(request, "ADMIN");
    const created = await request.post(
      "/api/admin/products",
      withAuth(request, {
        data: {
          name: `QA-F14-NOPRICE-${f10Suffix()}`,
          slug: `qa-f14-np-${f10Suffix()}`,
          category: "FRUTA",
          unit: "KG",
        },
      })
    );
    expect(created.status(), await created.text()).toBe(201);
    const productId = (await created.json()).data.id as string;
    await loginAs(request, "PROVIDER");
    const noPrice = await request.patch(
      `/api/provider/products/by-product/${productId}`,
      withAuth(request, { data: { isAvailable: true } })
    );
    expect(noPrice.status(), await noPrice.text()).toBe(400);
    const body = await noPrice.json();
    expect(errorText(body).toLowerCase()).toMatch(/precio/);
    const zero = await request.patch(
      `/api/provider/products/by-product/${productId}`,
      withAuth(request, { data: { isAvailable: true, price: 0 } })
    );
    expect(zero.status(), await zero.text()).toBe(400);
    const catalog = await request.get("/api/provider/products", withAuth(request));
    const cat = await catalog.json();
    const rows = (cat.data?.catalog ?? cat.data ?? []) as { product?: { id: string }; price?: number }[];
    const hit = rows.find((r) => r.product?.id === productId || (r as { productId?: string }).productId === productId);
    if (hit) {
      expect(Number(hit.price)).not.toBe(50);
      expect(hit).not.toMatchObject({ isAvailable: true, price: 50 });
    }
  });

  test("TC-F14-026: DELETE sección con productos → 409 visible", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const section = await request.post(
      "/api/provider/sections",
      withAuth(request, { data: { name: `Con SKU F14 ${f10Suffix()}` } })
    );
    expect(section.status(), await section.text()).toBe(201);
    const sectionId = (await section.json()).data.id as string;
    const local = await createLocalProduct(request, {
      name: `En sección ${f10Suffix()}`,
      sectionId,
      price: 9,
    });
    expect(local.ok(), await local.text()).toBeTruthy();
    const del = await request.delete(`/api/provider/sections/${sectionId}`, withAuth(request));
    expect(del.status()).toBe(409);
    const body = await del.json();
    expect(errorText(body)).toMatch(/productos|muévelos|muevelos|reasigna/i);
  });

  test("TC-F14-027: merma que deja on_hand < 0 → 400 INVENTORY_NEGATIVE_NOT_ALLOWED", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const sku = await createSku(request);
    await request.post(
      `/api/provider/inventory/${sku.providerProductId}/entries`,
      withAuth(request, { data: { quantity: "3.000", receiveAs: "CATALOG" } })
    );
    const merma = await request.post(
      `/api/provider/inventory/${sku.providerProductId}/shrinkage`,
      withAuth(request, { data: { quantity: "4.000", reason: "DANO" } })
    );
    expect(merma.status(), await merma.text()).toBe(400);
    const body = await merma.json();
    expect(errorCode(body)).toBe("INVENTORY_NEGATIVE_NOT_ALLOWED");
    const inv = await request.get(`/api/provider/inventory/${sku.providerProductId}`, withAuth(request));
    expect(Number((await inv.json()).data.onHand)).toBeCloseTo(3, 3);
  });

  test("TC-F14-028: ajuste conteo negativo → 400", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const sku = await createSku(request);
    const adj = await request.post(
      `/api/provider/inventory/${sku.providerProductId}/adjustments`,
      withAuth(request, { data: { countedOnHand: "-1.000" } })
    );
    expect(adj.status(), await adj.text()).toBe(400);
  });

  test("TC-F14-029: movements from > to → 400", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const res = await request.get(
      "/api/provider/inventory/movements?from=2026-09-17&to=2026-09-01",
      withAuth(request)
    );
    expect(res.status(), await res.text()).toBe(400);
  });

  test("TC-F14-030: PDF from > to → 400 JSON no PDF", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const res = await request.get("/api/provider/reports.pdf?from=2026-09-17&to=2026-09-01", withAuth(request));
    expect(res.status(), await res.text()).toBe(400);
    expect(res.headers()["content-type"] ?? "").not.toMatch(/application\/pdf/);
  });

  test("TC-F14-031: merma quantity <= 0 → 400", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const sku = await createSku(request);
    const merma = await request.post(
      `/api/provider/inventory/${sku.providerProductId}/shrinkage`,
      withAuth(request, { data: { quantity: "0", reason: "ROBO" } })
    );
    expect(merma.status(), await merma.text()).toBe(400);
  });

  test("TC-F14-040: ajuste conteo 0 es válido", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const sku = await createSku(request);
    await request.post(
      `/api/provider/inventory/${sku.providerProductId}/entries`,
      withAuth(request, { data: { quantity: "5.000", receiveAs: "CATALOG" } })
    );
    const adj = await request.post(
      `/api/provider/inventory/${sku.providerProductId}/adjustments`,
      withAuth(request, { data: { countedOnHand: "0.000" } })
    );
    expect(adj.status(), await adj.text()).toBe(201);
    expect(Number((await adj.json()).data.onHandAfter)).toBe(0);
  });

  test("TC-F14-041: merma con onHand 0 → 400", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const sku = await createSku(request);
    const merma = await request.post(
      `/api/provider/inventory/${sku.providerProductId}/shrinkage`,
      withAuth(request, { data: { quantity: "0.001", reason: "MUESTRA" } })
    );
    expect(merma.status(), await merma.text()).toBe(400);
    expect(errorCode(await merma.json())).toBe("INVENTORY_NEGATIVE_NOT_ALLOWED");
  });

  test("TC-F14-042: GET movements empty 200 data[]", async ({ request }) => {
    await registerUnverifiedProvider(request, "f14empty");
    const res = await request.get("/api/provider/inventory/movements?page=1&limit=50", withAuth(request));
    expect(res.status(), await res.text()).toBe(200);
    const body = await res.json();
    expect(body.data).toEqual([]);
    expect(body.meta.total).toBe(0);
  });

  test("TC-F14-043: PATCH parcial no resetea campos omitidos", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const before = await getMe(request);
    const res = await request.patch(
      "/api/provider/me",
      withAuth(request, { data: { description: before.description ?? "QA F14 desc" } })
    );
    expect(res.status(), await res.text()).toBe(200);
    const after = await res.json();
    expect(after.data.businessName).toBe(before.businessName);
    expect(after.data.phone).toBe(before.phone);
  });

  test("TC-F14-044: preparationTimeMinutes fuera de rango → 400", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const res = await request.patch(
      "/api/provider/me",
      withAuth(request, { data: { preparationTimeMinutes: 121 } })
    );
    expect(res.status(), await res.text()).toBe(400);
  });

  test("TC-F14-045: merma sobre oferta archivada → 409", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const sku = await createSku(request);
    await request.post(
      `/api/provider/inventory/${sku.providerProductId}/entries`,
      withAuth(request, { data: { quantity: "2.000", receiveAs: "CATALOG" } })
    );
    const arch = await request.post(
      `/api/provider/products/by-product/${sku.productId}/archive`,
      withAuth(request)
    );
    expect(arch.status(), await arch.text()).toBeGreaterThanOrEqual(200);
    expect(arch.status()).toBeLessThan(300);
    const merma = await request.post(
      `/api/provider/inventory/${sku.providerProductId}/shrinkage`,
      withAuth(request, { data: { quantity: "1.000", reason: "CADUCIDAD" } })
    );
    expect(merma.status(), await merma.text()).toBe(409);
  });

  test("TC-F14-060: sin token GET me / shrinkage / movements / pdf → 401", async ({ request }) => {
    const me = await request.get("/api/provider/me");
    expect(me.status()).toBe(401);
    const mov = await request.get("/api/provider/inventory/movements");
    expect(mov.status()).toBe(401);
    const pdf = await request.get("/api/provider/reports.pdf?from=2026-09-01&to=2026-09-17");
    expect(pdf.status()).toBe(401);
    const shrink = await request.post("/api/provider/inventory/clx000000000000000000001/shrinkage", {
      data: { quantity: "1.000", reason: "ROBO" },
    });
    expect(shrink.status()).toBe(401);
  });

  test("TC-F14-061: CLIENT 403 en me, merma, movimientos, global", async ({ request }) => {
    await loginAs(request, "CLIENT");
    expect((await request.get("/api/provider/me", withAuth(request))).status()).toBe(403);
    expect((await request.get("/api/provider/inventory/movements", withAuth(request))).status()).toBe(403);
    expect((await request.get("/api/provider/reports/global?from=2026-09-01&to=2026-09-17", withAuth(request))).status()).toBe(
      403
    );
    const shrink = await request.post(
      "/api/provider/inventory/clx000000000000000000001/shrinkage",
      withAuth(request, { data: { quantity: "1.000", reason: "ROBO" } })
    );
    expect(shrink.status()).toBe(403);
  });

  test("TC-F14-062: IDOR merma SKU de otra sucursal → 403", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const sku = await createSku(request);
    await request.post(
      `/api/provider/inventory/${sku.providerProductId}/entries`,
      withAuth(request, { data: { quantity: "2.000", receiveAs: "CATALOG" } })
    );
    await loginWithCredentials(request, credentials.providerN1.email, credentials.providerN1.password);
    const merma = await request.post(
      `/api/provider/inventory/${sku.providerProductId}/shrinkage`,
      withAuth(request, { data: { quantity: "1.000", reason: "ROBO" } })
    );
    expect(merma.status(), await merma.text()).toBe(403);
  });

  test("TC-F14-063: IDOR PATCH me con providerId ajeno → 403", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const mine = await (await request.get("/api/provider/mine", withAuth(request))).json();
    const a = mine.data.providers[0];
    const b = mine.data.providers[1];
    expect(a.id).not.toBe(b.id);
    const switched = await request.post(
      "/api/provider/active",
      withAuth(request, { data: { providerId: a.id } })
    );
    expect(switched.status()).toBe(200);
    rememberSessionCookie(request, switched);
    const patch = await request.patch(
      "/api/provider/me",
      withAuth(request, { data: { providerId: b.id, businessName: "Hack sucursal B" } })
    );
    expect([400, 403]).toContain(patch.status());
    if (patch.status() === 200) {
      throw new Error("IDOR: PATCH me aceptó providerId de otra sucursal");
    }
  });

  test("TC-F14-064: N=1 GET reports/global 403 GLOBAL_REPORTS_NOT_AVAILABLE", async ({ request }) => {
    await loginWithCredentials(request, credentials.providerN1.email, credentials.providerN1.password);
    const today = monterreyYmd();
    const res = await request.get(
      `/api/provider/reports/global?from=${today.slice(0, 8)}01&to=${today}`,
      withAuth(request)
    );
    expect(res.status(), await res.text()).toBe(403);
    const body = await res.json();
    expect(errorCode(body)).toBe("GLOBAL_REPORTS_NOT_AVAILABLE");
  });
});
