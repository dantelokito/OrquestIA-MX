import { test, expect } from "@playwright/test";
import { loginAs, assertResponseTime } from "../../fixtures/auth";

test.describe("API ADMIN ANALYTICS — TC-ADM-F4", () => {
  test("TC-ADM-F4-001: GET range=7d ADMIN", async ({ request }) => {
    await loginAs(request, "ADMIN");
    const start = Date.now();
    const response = await request.get("/api/admin/analytics?range=7d");
    assertResponseTime(start);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.range).toBe("7d");
    expect(body.data.timezone).toMatch(/Monterrey/i);
    expect(typeof body.data.empty).toBe("boolean");
    if (body.data.empty) {
      expect(body.data.kpis).toBeNull();
    } else {
      expect(body.data.kpis.gmv).toBeGreaterThanOrEqual(0);
      expect(body.data.kpis.bySource.MARKETPLACE).toBeDefined();
      expect(body.data.kpis.bySource.POS).toBeDefined();
    }
  });

  test("TC-ADM-F4-002: range=today y 30d", async ({ request }) => {
    await loginAs(request, "ADMIN");
    for (const range of ["today", "30d"] as const) {
      const response = await request.get(`/api/admin/analytics?range=${range}`);
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.data.range).toBe(range);
    }
  });

  test("TC-ADM-F4-003: range=year → 400", async ({ request }) => {
    await loginAs(request, "ADMIN");
    const response = await request.get("/api/admin/analytics?range=year");
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(JSON.stringify(body)).toMatch(/range/i);
  });

  test("TC-ADM-F4-004: CLIENT → 403", async ({ request }) => {
    await loginAs(request, "CLIENT");
    const response = await request.get("/api/admin/analytics");
    expect(response.status()).toBe(403);
  });

  test("TC-ADM-F4-005: sin token → 401", async ({ request }) => {
    const response = await request.get("/api/admin/analytics");
    expect(response.status()).toBe(401);
  });
});
