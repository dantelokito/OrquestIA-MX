import { test, expect } from "@playwright/test";
import { loginAs } from "../../fixtures/auth";

test.describe("API USERS — TC-USER", () => {
  test("TC-USER-001: GET perfil CLIENT autenticado", async ({ request }) => {
    const { user } = await loginAs(request, "CLIENT");
    const response = await request.get("/api/users/me");
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.email).toBe(user.email);
    expect(body.data.role).toBe("CLIENT");
  });

  test("TC-USER-002: PATCH actualizar nombre", async ({ request }) => {
    await loginAs(request, "CLIENT");
    const newName = `QA User ${Date.now()}`;
    const response = await request.patch("/api/users/me", {
      data: { name: newName },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.name).toBe(newName);
  });

  test("TC-USER-003: PATCH actualizar teléfono", async ({ request }) => {
    await loginAs(request, "CLIENT");
    const response = await request.patch("/api/users/me", {
      data: { phone: "+528119999999" },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.phone).toBe("+528119999999");
  });

  test("TC-USER-005: GET sin sesión retorna 401", async ({ request }) => {
    const response = await request.get("/api/users/me");
    expect(response.status()).toBe(401);
  });

  test("TC-USER-006: GET con rol PROVIDER retorna 403", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const response = await request.get("/api/users/me");
    expect(response.status()).toBe(403);
  });
});
