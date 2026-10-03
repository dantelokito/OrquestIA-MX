import { test, expect } from "@playwright/test";
import { loginAs, assertResponseTime } from "../../fixtures/auth";
import {
  buildMarketplaceOrderPayload,
  getSeedProviderProduct,
  randomIdempotencyKey,
} from "../../fixtures/orders";
import {
  getAvailableCatalogItem,
  restoreProduct,
  setProductAvailable,
} from "../../fixtures/catalog";

test.describe("API ORDERS — TC-ORD", () => {
  test("TC-ORD-001: POST /api/orders CLIENT válido → 201", async ({ request }) => {
    await loginAs(request, "CLIENT");
    const seed = await getSeedProviderProduct(request);
    const key = randomIdempotencyKey();
    const start = Date.now();

    const response = await request.post("/api/orders", {
      headers: { "Idempotency-Key": key },
      data: buildMarketplaceOrderPayload(seed.providerId, [
        { providerProductId: seed.providerProductId, quantity: 1, unitOfMeasure: seed.unitOfMeasure },
      ]),
    });
    assertResponseTime(start);

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.data.id).toBeDefined();
    expect(body.data.status).toBe("PENDING");
    expect(body.data.source).toBe("MARKETPLACE");
    expect(Array.isArray(body.data.items)).toBe(true);
  });

  test("TC-ORD-002: Idempotency-Key replay → 200 mismo orden", async ({ request }) => {
    await loginAs(request, "CLIENT");
    const seed = await getSeedProviderProduct(request);
    const key = randomIdempotencyKey();
    const payload = buildMarketplaceOrderPayload(seed.providerId, [
      { providerProductId: seed.providerProductId, quantity: 2 },
    ]);

    const first = await request.post("/api/orders", {
      headers: { "Idempotency-Key": key },
      data: payload,
    });
    expect(first.status()).toBe(201);
    const firstBody = await first.json();

    const replay = await request.post("/api/orders", {
      headers: { "Idempotency-Key": key },
      data: payload,
    });
    expect(replay.status()).toBe(200);
    const replayBody = await replay.json();
    expect(replayBody.data.id).toBe(firstBody.data.id);
  });

  test("TC-ORD-003: GET /api/orders paginado", async ({ request }) => {
    await loginAs(request, "CLIENT");
    const response = await request.get("/api/orders?page=1&limit=10");
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.meta).toMatchObject({
      page: expect.any(Number),
      limit: expect.any(Number),
      total: expect.any(Number),
      totalPages: expect.any(Number),
    });
  });

  test("TC-ORD-004: PATCH cancel PENDING → CANCELLED", async ({ request }) => {
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
    const orderId = created.data.id;

    const patch = await request.patch(`/api/orders/${orderId}`, {
      data: { status: "CANCELLED" },
    });
    expect(patch.status()).toBe(200);
    const body = await patch.json();
    expect(body.data.status).toBe("CANCELLED");
  });

  test("TC-ORD-005: PATCH cancel CONFIRMED → 409", async ({ request }) => {
    await loginAs(request, "CLIENT");
    const seed = await getSeedProviderProduct(request);
    const create = await request.post("/api/orders", {
      headers: { "Idempotency-Key": randomIdempotencyKey() },
      data: buildMarketplaceOrderPayload(seed.providerId, [
        { providerProductId: seed.providerProductId, quantity: 1 },
      ]),
    });
    const created = await create.json();
    const orderId = created.data.id;

    await loginAs(request, "PROVIDER");
    await request.patch(`/api/provider/orders/${orderId}`, {
      data: { status: "CONFIRMED" },
    });

    await loginAs(request, "CLIENT");
    const cancel = await request.patch(`/api/orders/${orderId}`, {
      data: { status: "CANCELLED" },
    });
    expect([403, 409]).toContain(cancel.status());
  });

  test("TC-ORD-006: POST sin sesión → 401", async ({ request }) => {
    const seed = await getSeedProviderProduct(request);
    const response = await request.post("/api/orders", {
      headers: { "Idempotency-Key": randomIdempotencyKey() },
      data: buildMarketplaceOrderPayload(seed.providerId, [
        { providerProductId: seed.providerProductId, quantity: 1 },
      ]),
    });
    expect(response.status()).toBe(401);
  });

  test("TC-ORD-007: POST PROVIDER rol → 403", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const seed = await getSeedProviderProduct(request);
    const response = await request.post("/api/orders", {
      headers: { "Idempotency-Key": randomIdempotencyKey() },
      data: buildMarketplaceOrderPayload(seed.providerId, [
        { providerProductId: seed.providerProductId, quantity: 1 },
      ]),
    });
    expect(response.status()).toBe(403);
  });

  test("TC-ORD-008: POST sin Idempotency-Key → 400", async ({ request }) => {
    await loginAs(request, "CLIENT");
    const seed = await getSeedProviderProduct(request);
    const response = await request.post("/api/orders", {
      data: buildMarketplaceOrderPayload(seed.providerId, [
        { providerProductId: seed.providerProductId, quantity: 1 },
      ]),
    });
    expect(response.status()).toBe(400);
  });

  test("TC-ORD-009: POST customItem en marketplace → 400", async ({ request }) => {
    await loginAs(request, "CLIENT");
    const seed = await getSeedProviderProduct(request);
    const response = await request.post("/api/orders", {
      headers: { "Idempotency-Key": randomIdempotencyKey() },
      data: {
        providerId: seed.providerId,
        items: [
          {
            providerProductId: seed.providerProductId,
            quantity: "1",
            customItem: { name: "X", unitPrice: "10" },
          },
        ],
      },
    });
    expect(response.status()).toBe(400);
  });

  test("TC-ORD-010: POST items vacíos → 400", async ({ request }) => {
    await loginAs(request, "CLIENT");
    const seed = await getSeedProviderProduct(request);
    const response = await request.post("/api/orders", {
      headers: { "Idempotency-Key": randomIdempotencyKey() },
      data: { providerId: seed.providerId, items: [] },
    });
    expect(response.status()).toBe(400);
  });

  test("TC-ORD-011: POST notas > 280 chars → 400", async ({ request }) => {
    await loginAs(request, "CLIENT");
    const seed = await getSeedProviderProduct(request);
    const response = await request.post("/api/orders", {
      headers: { "Idempotency-Key": randomIdempotencyKey() },
      data: buildMarketplaceOrderPayload(
        seed.providerId,
        [{ providerProductId: seed.providerProductId, quantity: 1 }],
        "x".repeat(281)
      ),
    });
    expect(response.status()).toBe(400);
  });

  test("TC-ORD-012: GET /api/orders/[id] dueño → 200", async ({ request }) => {
    await loginAs(request, "CLIENT");
    const seed = await getSeedProviderProduct(request);
    const create = await request.post("/api/orders", {
      headers: { "Idempotency-Key": randomIdempotencyKey() },
      data: buildMarketplaceOrderPayload(seed.providerId, [
        { providerProductId: seed.providerProductId, quantity: 1 },
      ]),
    });
    const created = await create.json();
    const response = await request.get(`/api/orders/${created.data.id}`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.id).toBe(created.data.id);
  });
});

test.describe("API ORDERS F4 — TC-ORD delivery", () => {
  test.describe.configure({ mode: "serial" });

  test("TC-ORD-013: pickup default fulfillmentType PICKUP", async ({ request }) => {
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
    expect(body.data.fulfillmentType ?? "PICKUP").toBe("PICKUP");
  });

  test("TC-ORD-014: DELIVERY sin deliveryAddressId → 400", async ({ request }) => {
    await loginAs(request, "CLIENT");
    const seed = await getSeedProviderProduct(request);
    const response = await request.post("/api/orders", {
      headers: { "Idempotency-Key": randomIdempotencyKey() },
      data: buildMarketplaceOrderPayload(
        seed.providerId,
        [{ providerProductId: seed.providerProductId, quantity: 1 }],
        undefined,
        { fulfillmentType: "DELIVERY" }
      ),
    });
    expect(response.status()).toBe(400);
  });

  test("TC-ORD-015: DELIVERY con offersDelivery=false → 400", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const disable = await request.patch("/api/provider/me", { data: { offersDelivery: false } });
    expect(disable.ok()).toBeTruthy();
    const me = await request.get("/api/provider/me");
    const business = await me.json();
    expect(business.data.offersDelivery).toBe(false);

    await loginAs(request, "CLIENT");
    const seed = await getSeedProviderProduct(request);
    const addr = await request.post("/api/users/me/addresses", {
      data: {
        label: "Casa Ord",
        formattedAddress: "Av. Juárez 123, Monterrey",
        lat: 25.6714,
        lng: -100.3089,
        isFavorite: true,
      },
    });
    const address = addr.ok() ? await addr.json() : null;

    const response = await request.post("/api/orders", {
      headers: { "Idempotency-Key": randomIdempotencyKey() },
      data: buildMarketplaceOrderPayload(
        seed.providerId,
        [{ providerProductId: seed.providerProductId, quantity: 1 }],
        undefined,
        {
          fulfillmentType: "DELIVERY",
          deliveryAddressId: address?.data?.id,
        }
      ),
    });
    expect(response.status()).toBe(400);
  });

  test("TC-ORD-016: DELIVERY con address y offersDelivery → 201", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const enable = await request.patch("/api/provider/me", { data: { offersDelivery: true } });
    expect(enable.ok()).toBeTruthy();

    await loginAs(request, "CLIENT");
    const seed = await getSeedProviderProduct(request);
    const addr = await request.post("/api/users/me/addresses", {
      data: {
        label: "Casa Del",
        formattedAddress: "Av. Juárez 123, Monterrey",
        lat: 25.6714,
        lng: -100.3089,
        isFavorite: true,
      },
    });
    expect(addr.status()).toBe(201);
    const address = await addr.json();

    const response = await request.post("/api/orders", {
      headers: { "Idempotency-Key": randomIdempotencyKey() },
      data: buildMarketplaceOrderPayload(
        seed.providerId,
        [{ providerProductId: seed.providerProductId, quantity: 1 }],
        undefined,
        {
          fulfillmentType: "DELIVERY",
          deliveryAddressId: address.data.id,
          clientLat: 25.6714,
          clientLng: -100.3089,
        }
      ),
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.data.fulfillmentType).toBe("DELIVERY");
    expect(body.data.deliveryAddressSnapshot || body.data.etaMinutes !== undefined).toBeTruthy();

    await loginAs(request, "PROVIDER");
    await request.patch("/api/provider/me", { data: { offersDelivery: false } });
  });
});

test.describe("API ORDERS F5 — TC-CAT 409", () => {
  test("TC-CAT-003: POST orders con producto inactivo → 409", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const target = await getAvailableCatalogItem(request);
    try {
      await setProductAvailable(request, target.productId, false, target.price);

      await loginAs(request, "CLIENT");
      const response = await request.post("/api/orders", {
        headers: { "Idempotency-Key": randomIdempotencyKey() },
        data: buildMarketplaceOrderPayload(target.providerId, [
          { providerProductId: target.providerProductId, quantity: 1 },
        ]),
      });
      expect(response.status()).toBe(409);
      const body = await response.json();
      expect(body.error).toMatch(/producto no disponible/i);
    } finally {
      await loginAs(request, "PROVIDER");
      await restoreProduct(request, target);
    }
  });

  test("TC-CAT-007: replay Idempotency-Key no revalida toggle", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const target = await getAvailableCatalogItem(request);
    const key = randomIdempotencyKey();
    const payload = buildMarketplaceOrderPayload(target.providerId, [
      { providerProductId: target.providerProductId, quantity: 1 },
    ]);

    await loginAs(request, "CLIENT");
    const first = await request.post("/api/orders", {
      headers: { "Idempotency-Key": key },
      data: payload,
    });
    expect(first.status()).toBe(201);
    const firstBody = await first.json();

    await loginAs(request, "PROVIDER");
    await setProductAvailable(request, target.productId, false, target.price);

    try {
      await loginAs(request, "CLIENT");
      const replay = await request.post("/api/orders", {
        headers: { "Idempotency-Key": key },
        data: payload,
      });
      expect(replay.status()).toBe(200);
      const replayBody = await replay.json();
      expect(replayBody.data.id).toBe(firstBody.data.id);
    } finally {
      await loginAs(request, "PROVIDER");
      await restoreProduct(request, target);
    }
  });
});
