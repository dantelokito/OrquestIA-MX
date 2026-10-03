import { test, expect } from "@playwright/test";
import { loginAs } from "../../fixtures/auth";
import {
  buildMarketplaceOrderPayload,
  getSeedProviderProduct,
  randomIdempotencyKey,
} from "../../fixtures/orders";

async function createPendingOrder(request: import("@playwright/test").APIRequestContext) {
  await loginAs(request, "CLIENT");
  const seed = await getSeedProviderProduct(request);
  const response = await request.post("/api/orders", {
    headers: { "Idempotency-Key": randomIdempotencyKey() },
    data: buildMarketplaceOrderPayload(seed.providerId, [
      { providerProductId: seed.providerProductId, quantity: 1 },
    ]),
  });
  expect(response.status()).toBe(201);
  const body = await response.json();
  return body.data.id as string;
}

test.describe("API PROVIDER ORDERS — TC-OPS", () => {
  test("TC-OPS-001: GET /api/provider/orders tab active", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const response = await request.get("/api/provider/orders?tab=active");
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.meta).toBeDefined();
  });

  test("TC-OPS-002: GET tab completed", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const response = await request.get("/api/provider/orders?tab=completed");
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body.data)).toBe(true);
  });

  test("TC-OPS-003: GET tab cancelled", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const response = await request.get("/api/provider/orders?tab=cancelled");
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body.data)).toBe(true);
  });

  test("TC-OPS-004: PATCH PENDING → CONFIRMED", async ({ request }) => {
    const orderId = await createPendingOrder(request);
    await loginAs(request, "PROVIDER");
    const response = await request.patch(`/api/provider/orders/${orderId}`, {
      data: { status: "CONFIRMED" },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.status).toBe("CONFIRMED");
  });

  test("TC-OPS-005: ciclo CONFIRMED → IN_TRANSIT → DELIVERED", async ({ request }) => {
    const orderId = await createPendingOrder(request);
    await loginAs(request, "PROVIDER");
    await request.patch(`/api/provider/orders/${orderId}`, { data: { status: "CONFIRMED" } });
    const transit = await request.patch(`/api/provider/orders/${orderId}`, {
      data: { status: "IN_TRANSIT" },
    });
    expect(transit.status()).toBe(200);
    const delivered = await request.patch(`/api/provider/orders/${orderId}`, {
      data: { status: "DELIVERED" },
    });
    expect(delivered.status()).toBe(200);
    const body = await delivered.json();
    expect(body.data.status).toBe("DELIVERED");
  });

  test("TC-OPS-006: GET provider orders sin token → 401", async ({ request }) => {
    const response = await request.get("/api/provider/orders");
    expect(response.status()).toBe(401);
  });

  test("TC-OPS-007: GET provider orders CLIENT → 403", async ({ request }) => {
    await loginAs(request, "CLIENT");
    const response = await request.get("/api/provider/orders");
    expect(response.status()).toBe(403);
  });

  test("TC-OPS-008: filtro source MARKETPLACE", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const response = await request.get("/api/provider/orders?tab=active&source=MARKETPLACE");
    expect(response.status()).toBe(200);
    const body = await response.json();
    for (const row of body.data) {
      expect(row.source).toBe("MARKETPLACE");
    }
  });

  test("TC-OPS-009: PATCH transición inválida → 409", async ({ request }) => {
    const orderId = await createPendingOrder(request);
    await loginAs(request, "PROVIDER");
    const response = await request.patch(`/api/provider/orders/${orderId}`, {
      data: { status: "DELIVERED" },
    });
    expect(response.status()).toBe(409);
  });

  test("TC-OPS-010: GET source POS", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const response = await request.get("/api/provider/orders?tab=completed&source=POS");
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body.data)).toBe(true);
  });
});
