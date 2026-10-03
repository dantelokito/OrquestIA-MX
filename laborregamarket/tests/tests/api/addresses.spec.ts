import { test, expect } from "@playwright/test";
import { loginAs, registerClient, assertResponseTime, withAuth } from "../../fixtures/auth";
import { addressPayload, CDMX_PIN, OUTSIDE_MEXICO_PIN } from "../../fixtures/geo";

test.describe("API ADDRESSES — TC-ADD", () => {
  test("TC-ADD-001: POST dirección CLIENT → 201", async ({ request }) => {
    await registerClient(request, "add");
    const start = Date.now();
    const response = await request.post(
      "/api/users/me/addresses",
      withAuth(request, { data: addressPayload("Casa") })
    );
    assertResponseTime(start);

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.data.label).toBe("Casa");
    expect(body.data.lat).toBeDefined();
    expect(body.data.id).toBeDefined();
  });

  test("TC-ADD-002: GET listado ordenado", async ({ request }) => {
    await registerClient(request, "addlist");
    await request.post(
      "/api/users/me/addresses",
      withAuth(request, { data: { ...addressPayload("Trabajo"), isDefault: false } })
    );
    await request.post(
      "/api/users/me/addresses",
      withAuth(request, { data: { ...addressPayload("Casa"), isDefault: true } })
    );

    const response = await request.get("/api/users/me/addresses", withAuth(request));
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThanOrEqual(2);
    const defaults = body.data.filter((a: { isDefault: boolean }) => a.isDefault);
    expect(defaults.length).toBe(1);
  });

  test("TC-ADD-003: PATCH etiqueta", async ({ request }) => {
    await registerClient(request, "addpatch");
    const created = await request.post(
      "/api/users/me/addresses",
      withAuth(request, { data: addressPayload("Temp") })
    );
    const addr = await created.json();

    const response = await request.patch(
      `/api/users/me/addresses/${addr.data.id}`,
      withAuth(request, { data: { label: "Oficina" } })
    );
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.label).toBe("Oficina");
  });

  test("TC-ADD-004: DELETE propia → 200", async ({ request }) => {
    await registerClient(request, "adddel");
    const created = await request.post(
      "/api/users/me/addresses",
      withAuth(request, { data: addressPayload("Borrar") })
    );
    const addr = await created.json();

    const response = await request.delete(
      `/api/users/me/addresses/${addr.data.id}`,
      withAuth(request)
    );
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.deleted).toBe(true);
  });

  test("TC-ADD-005: POST sin sesión → 401", async ({ request }) => {
    const response = await request.post("/api/users/me/addresses", {
      data: addressPayload(),
    });
    expect(response.status()).toBe(401);
  });

  test("TC-ADD-006: GET PROVIDER → 403", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const response = await request.get("/api/users/me/addresses", withAuth(request));
    expect(response.status()).toBe(403);
  });

  test("TC-ADD-007: DELETE dirección ajena → 404", async ({ request }) => {
    await registerClient(request, "addowner");
    const created = await request.post(
      "/api/users/me/addresses",
      withAuth(request, { data: addressPayload("Ajena") })
    );
    const addr = await created.json();

    await registerClient(request, "addthief");
    const response = await request.delete(
      `/api/users/me/addresses/${addr.data.id}`,
      withAuth(request)
    );
    expect(response.status()).toBe(404);
  });

  test("TC-ADD-008-F8: coords CDMX → 201", async ({ request }) => {
    await registerClient(request, "addcdmx");
    const response = await request.post(
      "/api/users/me/addresses",
      withAuth(request, { data: addressPayload("CDMX", CDMX_PIN) })
    );
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.data.lat).toBeCloseTo(CDMX_PIN.lat, 3);
  });

  test("TC-ADD-008b: coords fuera de México → 400", async ({ request }) => {
    await registerClient(request, "addoutmx");
    const response = await request.post(
      "/api/users/me/addresses",
      withAuth(request, { data: addressPayload("Fuera MX", OUTSIDE_MEXICO_PIN) })
    );
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(JSON.stringify(body)).toMatch(/fuera de México/i);
  });

  test("TC-ADD-F7-001: POST /use actualiza lastUsedAt", async ({ request }) => {
    await registerClient(request, "adduse");
    const created = await request.post(
      "/api/users/me/addresses",
      withAuth(request, { data: addressPayload("Casa F7") })
    );
    const addr = await created.json();

    const useRes = await request.post(
      `/api/users/me/addresses/${addr.data.id}/use`,
      withAuth(request, { data: {} })
    );
    expect(useRes.status()).toBe(200);
    const useBody = await useRes.json();
    expect(useBody.data.lastUsedAt).toBeTruthy();

    const listRes = await request.get("/api/users/me/addresses", withAuth(request));
    const list = await listRes.json();
    expect(list.data[0].id).toBe(addr.data.id);
  });

  test("TC-ADD-F7-002: POST /use sin sesión → 401", async ({ request }) => {
    const response = await request.post("/api/users/me/addresses/fake-id/use", { data: {} });
    expect(response.status()).toBe(401);
  });

  test("TC-ADD-F7-003: POST /use PROVIDER → 403", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const response = await request.post(
      "/api/users/me/addresses/fake-id/use",
      withAuth(request, { data: {} })
    );
    expect(response.status()).toBe(403);
  });
});
