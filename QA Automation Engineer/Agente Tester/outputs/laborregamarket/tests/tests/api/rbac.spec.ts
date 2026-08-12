import { test, expect } from "@playwright/test";
import { loginAs } from "../../fixtures/auth";

test.describe("API RBAC — TC-RBAC", () => {
  test("TC-RBAC-008: /api/users/me sin token → 401", async ({ request }) => {
    const response = await request.get("/api/users/me");
    expect(response.status()).toBe(401);
  });

  test("TC-RBAC-009: /api/catalogs con CLIENT → 403", async ({ request }) => {
    await loginAs(request, "CLIENT");
    const response = await request.get("/api/catalogs");
    expect(response.status()).toBe(403);
  });

  test("TC-RBAC-010: /api/provider/me con CLIENT → 403", async ({ request }) => {
    await loginAs(request, "CLIENT");
    const response = await request.get("/api/provider/me");
    expect(response.status()).toBe(403);
  });

  test("TC-RBAC: /api/catalogs con ADMIN → 200", async ({ request }) => {
    await loginAs(request, "ADMIN");
    const response = await request.get("/api/catalogs?catalog=modules");
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data).toBeDefined();
  });

  test("TC-RBAC: /api/provider/products con PROVIDER → 200", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const response = await request.get("/api/provider/products");
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.catalog).toBeDefined();
  });

  test("TC-RBAC: /api/admin/providers sin token → 401", async ({ request }) => {
    const response = await request.get("/api/admin/providers");
    expect(response.status()).toBe(401);
  });

  test("TC-RBAC: /api/admin/providers con CLIENT → 403", async ({ request }) => {
    await loginAs(request, "CLIENT");
    const response = await request.get("/api/admin/providers");
    expect(response.status()).toBe(403);
  });

  test("TC-RBAC: POST /api/providers con CLIENT → 403", async ({ request }) => {
    await loginAs(request, "CLIENT");
    const response = await request.post("/api/providers", {
      data: {
        businessName: "Hack",
        address: "X",
        city: "Monterrey",
        latitude: 25.67,
        longitude: -100.31,
      },
    });
    expect(response.status()).toBe(403);
  });
});
