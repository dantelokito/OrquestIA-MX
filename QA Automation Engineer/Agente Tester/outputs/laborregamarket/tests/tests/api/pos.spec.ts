import { test, expect } from "@playwright/test";
import { loginAs } from "../../fixtures/auth";
import {
  buildPosSalePayload,
  getSeedProviderProduct,
  randomIdempotencyKey,
} from "../../fixtures/orders";
import {
  getAvailableCatalogItem,
  restoreProduct,
  setProductAvailable,
} from "../../fixtures/catalog";

test.describe("API POS — TC-POS", () => {
  test("TC-POS-001: POST venta catálogo → 201", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const seed = await getSeedProviderProduct(request);
    const response = await request.post("/api/provider/pos/sales", {
      headers: { "Idempotency-Key": randomIdempotencyKey() },
      data: buildPosSalePayload([
        { providerProductId: seed.providerProductId, quantity: 1, unitOfMeasure: seed.unitOfMeasure },
      ]),
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.data.source).toBe("POS");
    expect(body.data.status).toBe("DELIVERED");
    expect(body.data.paymentMethod).toBe("CASH");
  });

  test("TC-POS-002: venta rápida customItem", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const response = await request.post("/api/provider/pos/sales", {
      headers: { "Idempotency-Key": randomIdempotencyKey() },
      data: buildPosSalePayload([
        {
          customItem: { name: "Bolsa extra", unitPrice: "5.00" },
          quantity: 2,
          unitOfMeasure: "PZA",
        },
      ]),
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.data.items[0].itemName).toMatch(/Bolsa extra/i);
    expect(body.data.items[0].providerProductId).toBeNull();
  });

  test("TC-POS-003: cantidad 1.250 KG con 3 decimales", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const seed = await getSeedProviderProduct(request);
    const response = await request.post("/api/provider/pos/sales", {
      headers: { "Idempotency-Key": randomIdempotencyKey() },
      data: buildPosSalePayload([
        {
          providerProductId: seed.providerProductId,
          quantity: "1.250",
          unitOfMeasure: "KG",
        },
      ]),
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.data.items[0].quantity).toBe("1.250");
    expect(body.data.items[0].unitOfMeasure).toBe("KG");
  });

  test("TC-POS-004: XOR ambos providerProductId y customItem → 400", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const seed = await getSeedProviderProduct(request);
    const response = await request.post("/api/provider/pos/sales", {
      headers: { "Idempotency-Key": randomIdempotencyKey() },
      data: {
        paymentMethod: "CASH",
        items: [
          {
            providerProductId: seed.providerProductId,
            customItem: { name: "X", unitPrice: "10" },
            quantity: "1",
            unitOfMeasure: "PZA",
          },
        ],
      },
    });
    expect(response.status()).toBe(400);
  });

  test("TC-POS-005: Idempotency-Key replay → 200", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const seed = await getSeedProviderProduct(request);
    const key = randomIdempotencyKey();
    const payload = buildPosSalePayload([
      { providerProductId: seed.providerProductId, quantity: 1 },
    ]);

    const first = await request.post("/api/provider/pos/sales", {
      headers: { "Idempotency-Key": key },
      data: payload,
    });
    expect(first.status()).toBe(201);
    const firstBody = await first.json();

    const replay = await request.post("/api/provider/pos/sales", {
      headers: { "Idempotency-Key": key },
      data: payload,
    });
    expect(replay.status()).toBe(200);
    const replayBody = await replay.json();
    expect(replayBody.data.id).toBe(firstBody.data.id);
  });

  test("TC-POS-006: UNPAID + DELIVERED → 400", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const seed = await getSeedProviderProduct(request);
    const response = await request.post("/api/provider/pos/sales", {
      headers: { "Idempotency-Key": randomIdempotencyKey() },
      data: buildPosSalePayload(
        [{ providerProductId: seed.providerProductId, quantity: 1 }],
        "UNPAID",
        "DELIVERED"
      ),
    });
    expect(response.status()).toBe(400);
  });

  test("TC-POS-007: POST sin sesión → 401", async ({ request }) => {
    const seed = await getSeedProviderProduct(request);
    const response = await request.post("/api/provider/pos/sales", {
      headers: { "Idempotency-Key": randomIdempotencyKey() },
      data: buildPosSalePayload([{ providerProductId: seed.providerProductId, quantity: 1 }]),
    });
    expect(response.status()).toBe(401);
  });

  test("TC-POS-008: POST CLIENT → 403", async ({ request }) => {
    await loginAs(request, "CLIENT");
    const seed = await getSeedProviderProduct(request);
    const response = await request.post("/api/provider/pos/sales", {
      headers: { "Idempotency-Key": randomIdempotencyKey() },
      data: buildPosSalePayload([{ providerProductId: seed.providerProductId, quantity: 1 }]),
    });
    expect(response.status()).toBe(403);
  });

  test("TC-POS-009: ticket vacío → 400", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const response = await request.post("/api/provider/pos/sales", {
      headers: { "Idempotency-Key": randomIdempotencyKey() },
      data: { paymentMethod: "CASH", items: [] },
    });
    expect(response.status()).toBe(400);
  });

  test("TC-POS-010: cantidad 0 → 400", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const seed = await getSeedProviderProduct(request);
    const response = await request.post("/api/provider/pos/sales", {
      headers: { "Idempotency-Key": randomIdempotencyKey() },
      data: buildPosSalePayload([{ providerProductId: seed.providerProductId, quantity: 0 }]),
    });
    expect(response.status()).toBe(400);
  });

  test("TC-POS-011: status CONFIRMED para recoger más tarde", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const seed = await getSeedProviderProduct(request);
    const response = await request.post("/api/provider/pos/sales", {
      headers: { "Idempotency-Key": randomIdempotencyKey() },
      data: buildPosSalePayload(
        [{ providerProductId: seed.providerProductId, quantity: 1 }],
        "CASH",
        "CONFIRMED"
      ),
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.data.status).toBe("CONFIRMED");
  });

  test("TC-POS-012: sin Idempotency-Key → 400", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const seed = await getSeedProviderProduct(request);
    const response = await request.post("/api/provider/pos/sales", {
      data: buildPosSalePayload([{ providerProductId: seed.providerProductId, quantity: 1 }]),
    });
    expect(response.status()).toBe(400);
  });

  test("TC-POS-013: body venta sin VID/PID báscula", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const seed = await getSeedProviderProduct(request);
    const payload = buildPosSalePayload([
      { providerProductId: seed.providerProductId, quantity: "1.250", unitOfMeasure: "KG" },
    ]);
    expect(payload).not.toHaveProperty("vid");
    expect(payload).not.toHaveProperty("pid");

    const response = await request.post("/api/provider/pos/sales", {
      headers: { "Idempotency-Key": randomIdempotencyKey() },
      data: payload,
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.data).not.toHaveProperty("vid");
    expect(body.data).not.toHaveProperty("pid");
    expect(JSON.stringify(body.data)).not.toMatch(/"vid"|"pid"/);
  });
});

test.describe("API POS F5 — TC-CAT 409", () => {
  test("TC-CAT-004: POS catálogo inactivo → 409", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const target = await getAvailableCatalogItem(request);
    try {
      await setProductAvailable(request, target.productId, false, target.price);
      const response = await request.post("/api/provider/pos/sales", {
        headers: { "Idempotency-Key": randomIdempotencyKey() },
        data: buildPosSalePayload([{ providerProductId: target.providerProductId, quantity: 1 }]),
      });
      expect(response.status()).toBe(409);
      const body = await response.json();
      expect(body.error).toMatch(/producto no disponible/i);
    } finally {
      await restoreProduct(request, target);
    }
  });

  test("TC-CAT-005: POS customItem no dispara 409 de catálogo", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const response = await request.post("/api/provider/pos/sales", {
      headers: { "Idempotency-Key": randomIdempotencyKey() },
      data: buildPosSalePayload([
        {
          customItem: { name: "Línea libre F5", unitPrice: "8.00" },
          quantity: 1,
          unitOfMeasure: "PZA",
        },
      ]),
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.data.items[0].providerProductId).toBeNull();
  });
});
