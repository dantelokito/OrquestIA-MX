import { test, expect } from "@playwright/test";
import { loginAs, uniqueEmail, assertResponseTime } from "../../fixtures/auth";

test.describe("API PROVIDERS — TC-PROV", () => {
  test("TC-PROV-001: listar proveedores con envelope paginado", async ({ request }) => {
    const start = Date.now();
    const response = await request.get("/api/providers");
    assertResponseTime(start);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.meta).toMatchObject({
      page: expect.any(Number),
      limit: expect.any(Number),
      total: expect.any(Number),
      totalPages: expect.any(Number),
    });
    expect(body.providers).toBeUndefined();
  });

  test("TC-PROV-002: paginación page y limit", async ({ request }) => {
    const response = await request.get("/api/providers?page=1&limit=2");
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.length).toBeLessThanOrEqual(2);
    expect(body.meta.limit).toBe(2);
  });

  test("TC-PROV-004: búsqueda q filtra resultados", async ({ request }) => {
    const response = await request.get("/api/providers?q=Paraíso");
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.length).toBeGreaterThanOrEqual(1);
    expect(body.data[0].businessName).toMatch(/Paraíso/i);
  });

  test("TC-PROV-005: filtro verified=true", async ({ request }) => {
    const response = await request.get("/api/providers?verified=true");
    expect(response.status()).toBe(200);
    const body = await response.json();
    for (const provider of body.data) {
      expect(provider.isVerified).toBe(true);
    }
  });

  test("TC-PROV-006: detalle proveedor por id", async ({ request }) => {
    const listRes = await request.get("/api/providers?limit=1");
    const list = await listRes.json();
    const id = list.data[0].id;

    const response = await request.get(`/api/providers/${id}`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.id).toBe(id);
    expect(body.data.businessName).toBeDefined();
    expect(Array.isArray(body.data.products)).toBe(true);
  });

  test("TC-PROV-007: detalle 404 para id inexistente", async ({ request }) => {
    const response = await request.get("/api/providers/nonexistent-id-12345");
    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body.error).toMatch(/no encontrada/i);
  });

  test("TC-PROV-008: limit > 50 rechazado", async ({ request }) => {
    const response = await request.get("/api/providers?limit=51");
    expect(response.status()).toBe(400);
  });

  test("TC-PROV-011: crear Provider onboarding paso 2", async ({ request }) => {
    const email = uniqueEmail("onboard");
    await request.post("/api/auth/register", {
      data: { name: "Onboard Test", email, password: "Test1234!", role: "PROVIDER" },
    });

    const response = await request.post("/api/providers", {
      data: {
        businessName: "Frutería QA Test",
        address: "Av. Test 100",
        city: "Monterrey",
        latitude: 25.6714,
        longitude: -100.3095,
        description: "Test onboarding",
      },
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.data.businessName).toBe("Frutería QA Test");
    expect(body.data.isVerified).toBe(false);
  });

  test("TC-PROV-012: POST providers sin sesión retorna 401", async ({ request }) => {
    const response = await request.post("/api/providers", {
      data: {
        businessName: "Sin Auth",
        address: "Calle 1",
        city: "Monterrey",
        latitude: 25.67,
        longitude: -100.31,
      },
    });
    expect(response.status()).toBe(401);
  });

  test("TC-PROV-014: Provider duplicado retorna 409", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const response = await request.post("/api/providers", {
      data: {
        businessName: "Duplicado Test",
        address: "Calle 2",
        city: "Monterrey",
        latitude: 25.67,
        longitude: -100.31,
      },
    });
    expect(response.status()).toBe(409);
  });
});
