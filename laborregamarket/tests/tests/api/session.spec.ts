import { test, expect } from "@playwright/test";
import { loginAs, assertResponseTime } from "../../fixtures/auth";

test.describe("API SESSION — TC-SESS", () => {
  test("TC-SESS-001: GET /api/auth/session invitado → 200 brand null", async ({ request }) => {
    const start = Date.now();
    const response = await request.get("/api/auth/session");
    assertResponseTime(start);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.authenticated).toBe(false);
    expect(body.data.role).toBeNull();
    expect(body.data.brand).toBeNull();
  });

  test("TC-SESS-002: CLIENT autenticado → 200 brand null", async ({ request }) => {
    await loginAs(request, "CLIENT");
    const response = await request.get("/api/auth/session");
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.authenticated).toBe(true);
    expect(body.data.role).toBe("CLIENT");
    expect(body.data.brand).toBeNull();
  });

  test("TC-RBAC-024: ADMIN session → 200 brand null", async ({ request }) => {
    await loginAs(request, "ADMIN");
    const response = await request.get("/api/auth/session");
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.authenticated).toBe(true);
    expect(body.data.role).toBe("ADMIN");
    expect(body.data.brand).toBeNull();
  });

  test("TC-SESS-003: PROVIDER sin par válido → brand null", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    await request.patch("/api/provider/me", {
      data: { primaryColor: null, secondaryColor: null },
    });
    const response = await request.get("/api/auth/session");
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.authenticated).toBe(true);
    expect(body.data.role).toBe("PROVIDER");
    expect(body.data.brand).toBeNull();
  });
});
