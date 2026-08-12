import { test, expect } from "@playwright/test";
import { credentials, uniqueEmail, assertResponseTime } from "../../fixtures/auth";

test.describe("API AUTH — TC-AUTH", () => {
  test("TC-AUTH-001: login CLIENT exitoso con envelope y cookie", async ({ request }) => {
    const start = Date.now();
    const response = await request.post("/api/auth/login", {
      data: credentials.client,
    });
    assertResponseTime(start);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.user.role).toBe("CLIENT");
    expect(body.data.user.email).toBe(credentials.client.email);
    expect(body.token).toBeUndefined();

    const cookies = await request.storageState();
    const jwtCookie = cookies.cookies.find((c) => c.name === "lbm_token");
    expect(jwtCookie).toBeDefined();
    expect(jwtCookie?.httpOnly).toBe(true);
  });

  test("TC-AUTH-002: login PROVIDER exitoso", async ({ request }) => {
    const response = await request.post("/api/auth/login", {
      data: credentials.provider,
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.user.role).toBe("PROVIDER");
  });

  test("TC-AUTH-003: login ADMIN exitoso", async ({ request }) => {
    const response = await request.post("/api/auth/login", {
      data: credentials.admin,
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.user.role).toBe("ADMIN");
  });

  test("TC-AUTH-004: credenciales inválidas retorna 401 genérico", async ({ request }) => {
    const response = await request.post("/api/auth/login", {
      data: { email: credentials.client.email, password: "WrongPass1!" },
    });
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.error).toBe("Credenciales inválidas");
  });

  test("TC-AUTH-005: password menor a 8 caracteres retorna 400", async ({ request }) => {
    const response = await request.post("/api/auth/login", {
      data: { email: credentials.client.email, password: "Demo12!" },
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toMatch(/8 caracteres/i);
  });

  test("TC-AUTH-008: registro CLIENT exitoso 201", async ({ request }) => {
    const email = uniqueEmail("client");
    const response = await request.post("/api/auth/register", {
      data: {
        name: "QA Test Client",
        email,
        password: "Test1234!",
        role: "CLIENT",
      },
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.data.user.role).toBe("CLIENT");
    expect(body.data.user.email).toBe(email);
  });

  test("TC-AUTH-009: registro PROVIDER exitoso 201", async ({ request }) => {
    const email = uniqueEmail("provider");
    const response = await request.post("/api/auth/register", {
      data: {
        name: "QA Test Provider",
        email,
        password: "Test1234!",
        role: "PROVIDER",
      },
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.data.user.role).toBe("PROVIDER");
  });

  test("TC-AUTH-010: email duplicado retorna 409", async ({ request }) => {
    const response = await request.post("/api/auth/register", {
      data: {
        name: "Duplicado",
        email: credentials.client.email,
        password: "Test1234!",
        role: "CLIENT",
      },
    });
    expect(response.status()).toBe(409);
    const body = await response.json();
    expect(body.error).toBe("El email ya está registrado");
  });

  test("TC-AUTH-011: registro password corto retorna 400", async ({ request }) => {
    const response = await request.post("/api/auth/register", {
      data: {
        name: "QA Short",
        email: uniqueEmail("short"),
        password: "Test12!",
        role: "CLIENT",
      },
    });
    expect(response.status()).toBe(400);
  });

  test("TC-AUTH-014: logout elimina sesión", async ({ request }) => {
    await request.post("/api/auth/login", { data: credentials.client });
    const logoutRes = await request.post("/api/auth/logout");
    expect(logoutRes.status()).toBe(200);
    const body = await logoutRes.json();
    expect(body.data.message).toBe("Sesión cerrada");

    const meRes = await request.get("/api/users/me");
    expect(meRes.status()).toBe(401);
  });

  test("TC-AUTH-022: logout sin sesión es idempotente", async ({ request }) => {
    const response = await request.post("/api/auth/logout");
    expect(response.status()).toBe(200);
  });

  test("TC-AUTH-006: email inválido retorna 400", async ({ request }) => {
    const response = await request.post("/api/auth/login", {
      data: { email: "not-valid", password: "Test1234!" },
    });
    expect(response.status()).toBe(400);
  });
});
