import { test, expect } from "@playwright/test";
import { loginAs, assertResponseTime } from "../../fixtures/auth";
import {
  buildMarketplaceOrderPayload,
  buildPosSalePayload,
  getSeedProviderProduct,
  randomIdempotencyKey,
} from "../../fixtures/orders";
import { createDeliveredMarketplaceOrder, reviewPayload } from "../../fixtures/reviews";

test.describe("API REVIEWS — TC-REV", () => {
  test("TC-REV-001: POST reseña pedido DELIVERED → 201", async ({ request }) => {
    const { orderId } = await createDeliveredMarketplaceOrder(request);
    const start = Date.now();
    const response = await request.post(`/api/orders/${orderId}/reviews`, {
      data: reviewPayload(5, "Muy fresca la fruta"),
    });
    assertResponseTime(start);

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.data.orderId).toBe(orderId);
    expect(body.data.rating).toBe(5);
    expect(body.data.comment).toMatch(/fresca/i);
    expect(body.data.id).toBeDefined();
  });

  test("TC-REV-002: segundo POST mismo pedido → 409", async ({ request }) => {
    const { orderId } = await createDeliveredMarketplaceOrder(request);
    const first = await request.post(`/api/orders/${orderId}/reviews`, {
      data: reviewPayload(),
    });
    expect(first.status()).toBe(201);

    const second = await request.post(`/api/orders/${orderId}/reviews`, {
      data: reviewPayload(4, "otra"),
    });
    expect(second.status()).toBe(409);
    const body = await second.json();
    expect(body.error).toMatch(/ya tiene una reseña|entregado/i);
  });

  test("TC-REV-003: rating 0 → 400", async ({ request }) => {
    const { orderId } = await createDeliveredMarketplaceOrder(request);
    const response = await request.post(`/api/orders/${orderId}/reviews`, {
      data: { rating: 0, comment: "x" },
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(JSON.stringify(body)).toMatch(/rating/i);
  });

  test("TC-REV-004: rating 6 → 400", async ({ request }) => {
    const { orderId } = await createDeliveredMarketplaceOrder(request);
    const response = await request.post(`/api/orders/${orderId}/reviews`, {
      data: { rating: 6 },
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(JSON.stringify(body)).toMatch(/rating/i);
  });

  test("TC-REV-005: reseña pedido PENDING → 409", async ({ request }) => {
    await loginAs(request, "CLIENT");
    const seed = await getSeedProviderProduct(request);
    const create = await request.post("/api/orders", {
      headers: { "Idempotency-Key": randomIdempotencyKey() },
      data: buildMarketplaceOrderPayload(seed.providerId, [
        { providerProductId: seed.providerProductId, quantity: 1 },
      ]),
    });
    expect(create.status()).toBe(201);
    const created = await create.json();

    const response = await request.post(`/api/orders/${created.data.id}/reviews`, {
      data: reviewPayload(),
    });
    expect(response.status()).toBe(409);
  });

  test("TC-REV-006: reseña venta POS → 403", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const seed = await getSeedProviderProduct(request);
    const sale = await request.post("/api/provider/pos/sales", {
      headers: { "Idempotency-Key": randomIdempotencyKey() },
      data: buildPosSalePayload([{ providerProductId: seed.providerProductId, quantity: 1 }]),
    });
    expect(sale.status()).toBe(201);
    const sold = await sale.json();

    await loginAs(request, "CLIENT");
    const response = await request.post(`/api/orders/${sold.data.id}/reviews`, {
      data: reviewPayload(),
    });
    expect(response.status()).toBe(403);
  });

  test("TC-REV-007: GET reseñas públicas del proveedor", async ({ request }) => {
    const { providerId, orderId } = await createDeliveredMarketplaceOrder(request);
    await request.post(`/api/orders/${orderId}/reviews`, { data: reviewPayload(5) });

    const response = await request.get(`/api/providers/${providerId}/reviews?page=1&limit=10`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.meta.reviewCount).toBeGreaterThanOrEqual(1);
    expect(body.meta.rating).toBeGreaterThan(0);
  });

  test("TC-REV-008: GET reseña del pedido dueño", async ({ request }) => {
    const { orderId } = await createDeliveredMarketplaceOrder(request);
    await request.post(`/api/orders/${orderId}/reviews`, { data: reviewPayload(4, "ok") });

    const response = await request.get(`/api/orders/${orderId}/review`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.rating).toBe(4);
  });

  test("TC-REV-009: DELETE reseña ADMIN → 200", async ({ request }) => {
    const { orderId } = await createDeliveredMarketplaceOrder(request);
    const created = await request.post(`/api/orders/${orderId}/reviews`, {
      data: reviewPayload(3),
    });
    expect(created.status()).toBe(201);
    const review = await created.json();

    await loginAs(request, "ADMIN");
    const response = await request.delete(`/api/admin/reviews/${review.data.id}`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.deleted).toBe(true);
  });

  test("TC-REV-010: DELETE reseña CLIENT → 403", async ({ request }) => {
    const { orderId } = await createDeliveredMarketplaceOrder(request);
    const created = await request.post(`/api/orders/${orderId}/reviews`, {
      data: reviewPayload(2),
    });
    const review = await created.json();

    await loginAs(request, "CLIENT");
    const response = await request.delete(`/api/admin/reviews/${review.data.id}`);
    expect(response.status()).toBe(403);
  });
});
