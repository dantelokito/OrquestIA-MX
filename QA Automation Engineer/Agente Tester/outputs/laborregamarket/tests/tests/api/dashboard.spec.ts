import { test, expect } from "@playwright/test";
import { loginAs } from "../../fixtures/auth";
import { buildPosSalePayload, getSeedProviderProduct, randomIdempotencyKey } from "../../fixtures/orders";

test.describe("API DASHBOARD — TC-DASH", () => {
  test("TC-DASH-001: GET /api/provider/dashboard → 200", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const response = await request.get("/api/provider/dashboard");
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data).toBeDefined();
    expect(typeof body.data.empty).toBe("boolean");
    expect(body.data.kpis).toBeDefined();
    expect(Array.isArray(body.data.series7d)).toBe(true);
    expect(Array.isArray(body.data.topProducts)).toBe(true);
  });

  test("TC-DASH-002: kpis.bySource App vs Mostrador", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const response = await request.get("/api/provider/dashboard");
    const body = await response.json();
    if (!body.data.empty) {
      const bySource = body.data.kpis.bySource;
      expect(bySource.MARKETPLACE ?? bySource.marketplace).toBeDefined();
      expect(bySource.POS ?? bySource.pos).toBeDefined();
    }
  });

  test("TC-DASH-003: GET sin token → 401", async ({ request }) => {
    const response = await request.get("/api/provider/dashboard");
    expect(response.status()).toBe(401);
  });

  test("TC-DASH-004: GET CLIENT → 403", async ({ request }) => {
    await loginAs(request, "CLIENT");
    const response = await request.get("/api/provider/dashboard");
    expect(response.status()).toBe(403);
  });

  test("TC-DASH-005: con venta POS refleja datos", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const seed = await getSeedProviderProduct(request);
    await request.post("/api/provider/pos/sales", {
      headers: { "Idempotency-Key": randomIdempotencyKey() },
      data: buildPosSalePayload([{ providerProductId: seed.providerProductId, quantity: 1 }]),
    });

    const response = await request.get("/api/provider/dashboard");
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.empty).toBe(false);
    const todayCount = body.data.kpis.today?.orderCount ?? body.data.kpis.d1?.orderCount;
    expect(todayCount).toBeGreaterThanOrEqual(1);
  });

  test("TC-DASH-006: query range 7d", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const response = await request.get("/api/provider/dashboard?range=7d");
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.series7d.length).toBeGreaterThanOrEqual(1);
  });
});
