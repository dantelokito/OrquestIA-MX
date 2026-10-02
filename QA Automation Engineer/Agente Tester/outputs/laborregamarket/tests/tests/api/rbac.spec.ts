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

test.describe("API RBAC F3 — TC-RBAC", () => {
  test("TC-RBAC-011: GET /api/orders sin token → 401", async ({ request }) => {
    const response = await request.get("/api/orders");
    expect(response.status()).toBe(401);
  });

  test("TC-RBAC-012: POST /api/orders PROVIDER → 403", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const response = await request.post("/api/orders", {
      headers: { "Idempotency-Key": crypto.randomUUID() },
      data: { providerId: "x", items: [] },
    });
    expect(response.status()).toBe(403);
  });

  test("TC-RBAC-013: GET /api/provider/dashboard sin token → 401", async ({ request }) => {
    const response = await request.get("/api/provider/dashboard");
    expect(response.status()).toBe(401);
  });

  test("TC-RBAC-014: POST /api/provider/pos/sales CLIENT → 403", async ({ request }) => {
    await loginAs(request, "CLIENT");
    const response = await request.post("/api/provider/pos/sales", {
      headers: { "Idempotency-Key": crypto.randomUUID() },
      data: { paymentMethod: "CASH", items: [] },
    });
    expect(response.status()).toBe(403);
  });

  test("TC-RBAC-015: GET /api/provider/orders CLIENT → 403", async ({ request }) => {
    await loginAs(request, "CLIENT");
    const response = await request.get("/api/provider/orders");
    expect(response.status()).toBe(403);
  });

  test("TC-RBAC-016: GET /api/provider/dashboard CLIENT → 403", async ({ request }) => {
    await loginAs(request, "CLIENT");
    const response = await request.get("/api/provider/dashboard");
    expect(response.status()).toBe(403);
  });
});

test.describe("API RBAC F4 — TC-RBAC", () => {
  test("TC-RBAC-017: GET /api/admin/analytics sin token → 401", async ({ request }) => {
    const response = await request.get("/api/admin/analytics");
    expect(response.status()).toBe(401);
  });

  test("TC-RBAC-018: GET /api/admin/analytics PROVIDER → 403", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const response = await request.get("/api/admin/analytics");
    expect(response.status()).toBe(403);
  });

  test("TC-RBAC-019: GET /api/users/me/addresses PROVIDER → 403", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const response = await request.get("/api/users/me/addresses");
    expect(response.status()).toBe(403);
  });

  test("TC-RBAC-020: POST /api/orders/:id/reviews PROVIDER → 403", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const response = await request.post("/api/orders/clxnotanorder/reviews", {
      data: { rating: 5 },
    });
    expect([403, 404]).toContain(response.status());
  });

  test("TC-RBAC-021: PATCH /api/provider/me CLIENT → 403", async ({ request }) => {
    await loginAs(request, "CLIENT");
    const response = await request.patch("/api/provider/me", {
      data: { preparationTimeMinutes: 20 },
    });
    expect(response.status()).toBe(403);
  });

  test("TC-RBAC-022: DELETE /api/admin/reviews/:id sin token → 401", async ({ request }) => {
    const response = await request.delete("/api/admin/reviews/clxfakeid");
    expect(response.status()).toBe(401);
  });
});

test.describe("API RBAC F5 — TC-RBAC", () => {
  test("TC-RBAC-023: GET /api/auth/session sin token → 200", async ({ request }) => {
    const response = await request.get("/api/auth/session");
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.authenticated).toBe(false);
    expect(body.data.brand).toBeNull();
  });

  test("TC-RBAC-025: PATCH colores CLIENT → 403", async ({ request }) => {
    await loginAs(request, "CLIENT");
    const response = await request.patch("/api/provider/me", {
      data: { primaryColor: "#1B5E20", secondaryColor: "#0D47A1" },
    });
    expect(response.status()).toBe(403);
  });
});

test.describe("API RBAC F6 — TC-RBAC", () => {
  test("TC-RBAC-026: GET /api/provider/reports sin token → 401", async ({ request }) => {
    const response = await request.get("/api/provider/reports?grain=day&date=2026-08-16");
    expect(response.status()).toBe(401);
  });

  test("TC-RBAC-027: GET /api/provider/reports CLIENT → 403", async ({ request }) => {
    await loginAs(request, "CLIENT");
    const response = await request.get("/api/provider/reports?grain=day&date=2026-08-16");
    expect(response.status()).toBe(403);
  });

  test("TC-RBAC-028: GET /api/provider/reports ADMIN → 403", async ({ request }) => {
    await loginAs(request, "ADMIN");
    const response = await request.get("/api/provider/reports?grain=day&date=2026-08-16");
    expect(response.status()).toBe(403);
  });

  test("TC-RBAC-029: GET /api/provider/reports.pdf CLIENT → 403", async ({ request }) => {
    await loginAs(request, "CLIENT");
    const response = await request.get("/api/provider/reports.pdf?grain=day&date=2026-08-16");
    expect(response.status()).toBe(403);
  });

  test("TC-RBAC-030: GET /api/provider/reports.pdf sin token → 401", async ({ request }) => {
    const response = await request.get("/api/provider/reports.pdf?grain=day&date=2026-08-16");
    expect(response.status()).toBe(401);
  });
});

test.describe("API RBAC F10 — TC-SEC / TC-ADM", () => {
  test("TC-SEC-003: GET /api/admin/products sin token → 401", async ({ request }) => {
    const response = await request.get("/api/admin/products");
    expect(response.status()).toBe(401);
  });

  test("TC-SEC-004: GET /api/admin/products CLIENT → 403", async ({ request }) => {
    await loginAs(request, "CLIENT");
    const response = await request.get("/api/admin/products");
    expect(response.status()).toBe(403);
  });

  test("TC-ADM-027: POST /api/admin/products PROVIDER → 403", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const response = await request.post("/api/admin/products", {
      data: { name: "Hack", category: "FRUTA", unit: "KG" },
    });
    expect(response.status()).toBe(403);
  });

  test("TC-SEC-005: POST /api/provider/local-products ADMIN → 403", async ({ request }) => {
    await loginAs(request, "ADMIN");
    const response = await request.post("/api/provider/local-products", {
      data: { name: "X", unit: "KG", price: 1, sectionId: "clxfake" },
    });
    expect(response.status()).toBe(403);
  });

  test("TC-CAT-S01: POST /api/provider/local-products sin token → 401", async ({ request }) => {
    const response = await request.post("/api/provider/local-products", {
      data: { name: "X", unit: "KG", price: 1, sectionId: "clxfake" },
    });
    expect(response.status()).toBe(401);
  });

  test("TC-CAT-S02: POST /api/provider/local-products CLIENT → 403", async ({ request }) => {
    await loginAs(request, "CLIENT");
    const response = await request.post("/api/provider/local-products", {
      data: { name: "X", unit: "KG", price: 1, sectionId: "clxfake" },
    });
    expect(response.status()).toBe(403);
  });

  test("TC-MED-007: POST /api/provider/media sin token → 401", async ({ request }) => {
    const response = await request.post("/api/provider/media", {
      multipart: {
        file: { name: "x.png", mimeType: "image/png", buffer: Buffer.from("x") },
        field: "logo",
      },
    });
    expect(response.status()).toBe(401);
  });

  test("TC-RBAC-032: GET reports from/to CLIENT → 403", async ({ request }) => {
    await loginAs(request, "CLIENT");
    const response = await request.get("/api/provider/reports?from=2026-08-01&to=2026-08-31");
    expect(response.status()).toBe(403);
  });
});

