import { test, expect } from "@playwright/test";
import { loginAs } from "../../fixtures/auth";

test.describe("API ADMIN — TC-ADM", () => {
  test("TC-ADM-002: GET catalog=users como ADMIN", async ({ request }) => {
    await loginAs(request, "ADMIN");
    const response = await request.get("/api/catalogs?catalog=users");
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
  });

  test("TC-ADM-007: GET admin/providers paginado", async ({ request }) => {
    await loginAs(request, "ADMIN");
    const response = await request.get("/api/admin/providers?page=1&limit=10");
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data).toBeDefined();
    expect(body.meta.total).toBeGreaterThanOrEqual(1);
  });

  test("TC-ADM-009: GET admin/audit", async ({ request }) => {
    await loginAs(request, "ADMIN");
    const response = await request.get("/api/admin/audit?page=1&limit=20");
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.meta).toBeDefined();
  });

  test("TC-ADM-005: GET catalogs sin sesión → 401", async ({ request }) => {
    const response = await request.get("/api/catalogs");
    expect(response.status()).toBe(401);
  });

  test("TC-ADM-012: GET catalogs default — envelope inconsistente (known bug)", async ({ request }) => {
    await loginAs(request, "ADMIN");
    const response = await request.get("/api/catalogs");
    expect(response.status()).toBe(200);
    const body = await response.json();
    // Documents current behavior; update assertion when BUG-003 is fixed
    const hasEnvelope = body.data?.catalogs !== undefined;
    const hasLegacy = body.catalogs !== undefined;
    expect(hasEnvelope || hasLegacy).toBe(true);
  });
});
