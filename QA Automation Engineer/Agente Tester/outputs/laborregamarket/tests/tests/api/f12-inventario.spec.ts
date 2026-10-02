import { test, expect } from "@playwright/test";
import {
  assertResponseTime,
  credentials,
  loginAs,
  loginWithCredentials,
  rememberSessionCookie,
  withAuth,
} from "../../fixtures/auth";
import { createLocalProduct, ensureOwnSection, f10Suffix } from "../../fixtures/f10";
import {
  buildMarketplaceOrderPayload,
  buildPosSalePayload,
  randomIdempotencyKey,
} from "../../fixtures/orders";
const STOCK_KEYS = [
  "onHand",
  "capacityMax",
  "fillPercent",
  "alertThresholdPercent",
  "alertEnabled",
  "lowStockAlert",
  "reserved",
  "boxContentFactor",
];

function hasStockKey(obj: unknown): boolean {
  if (!obj || typeof obj !== "object") return false;
  const rec = obj as Record<string, unknown>;
  if (STOCK_KEYS.some((k) => Object.prototype.hasOwnProperty.call(rec, k))) return true;
  return Object.values(rec).some((v) => (Array.isArray(v) ? v.some(hasStockKey) : hasStockKey(v)));
}

async function createSku(request: Parameters<typeof createLocalProduct>[0], unit = "KG") {
  const sectionId = await ensureOwnSection(request, `Inv F12 ${f10Suffix()}`);
  const name = `QA-INV-${f10Suffix()}`;
  const created = await createLocalProduct(request, { name, sectionId, unit, price: 22 });
  expect(created.status(), await created.text()).toBe(201);
  const row = await created.json();
  const providerProductId = row.data.providerProductId as string;
  expect(providerProductId).toBeTruthy();
  return { name, providerProductId, productId: row.data.productId as string | undefined };
}

async function inventoryItem(
  request: Parameters<typeof createLocalProduct>[0],
  id: string
) {
  const res = await request.get(`/api/provider/inventory/${id}`, withAuth(request));
  return { status: res.status(), body: await res.json() };
}

test.describe("API F12 — inventario blando, POS, Encargar, CAT, prefs", () => {
  test("TC-F12-001: GET inventory 200 envelope data+meta, decimales string", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const start = Date.now();
    const res = await request.get("/api/provider/inventory", withAuth(request));
    assertResponseTime(start);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBeUndefined();
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.meta).toMatchObject({
      page: expect.any(Number),
      limit: expect.any(Number),
      total: expect.any(Number),
      totalPages: expect.any(Number),
    });
    if (body.data.length > 0) {
      const item = body.data[0];
      expect(item.providerProductId).toBeTruthy();
      expect(typeof item.onHand).toBe("string");
      expect(typeof item.reserved).toBe("string");
    }
  });

  test("TC-F12-002: entrada CATALOG incrementa onHand", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const sku = await createSku(request);
    const before = await inventoryItem(request, sku.providerProductId);
    expect(before.status).toBe(200);
    const onHand0 = Number(before.body.data.onHand);
    const entry = await request.post(
      `/api/provider/inventory/${sku.providerProductId}/entries`,
      withAuth(request, { data: { quantity: "2.500", receiveAs: "CATALOG" } })
    );
    expect(entry.status(), await entry.text()).toBe(200);
    const after = await entry.json();
    expect(Number(after.data.onHand)).toBeCloseTo(onHand0 + 2.5, 3);
  });

  test("TC-F12-003: PATCH tope/umbral/alerta y fillPercent", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const sku = await createSku(request);
    await request.post(
      `/api/provider/inventory/${sku.providerProductId}/entries`,
      withAuth(request, { data: { quantity: "5.000", receiveAs: "CATALOG" } })
    );
    const patch = await request.patch(
      `/api/provider/inventory/${sku.providerProductId}`,
      withAuth(request, {
        data: {
          capacityMax: "10.000",
          alertThresholdPercent: 10,
          alertEnabled: true,
        },
      })
    );
    expect(patch.status(), await patch.text()).toBe(200);
    const body = await patch.json();
    expect(body.data.capacityMax).toBe("10.000");
    expect(body.data.alertThresholdPercent).toBe(10);
    expect(body.data.fillPercent).toBeCloseTo(50, 1);
    expect(body.data.lowStockAlert).toBe(false);
  });

  test("TC-F12-004: entrada BOX con factor fijo", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const sku = await createSku(request);
    const factor = await request.patch(
      `/api/provider/inventory/${sku.providerProductId}`,
      withAuth(request, { data: { boxContentFactor: "10.000" } })
    );
    expect(factor.status()).toBe(200);
    const before = Number((await inventoryItem(request, sku.providerProductId)).body.data.onHand);
    const box = await request.post(
      `/api/provider/inventory/${sku.providerProductId}/entries`,
      withAuth(request, { data: { quantity: "2.000", receiveAs: "BOX" } })
    );
    expect(box.status(), await box.text()).toBe(200);
    expect(Number((await box.json()).data.onHand)).toBeCloseTo(before + 20, 3);
  });

  test("TC-F12-005: POS cobra con on-hand 0 y deja negativo; no 4xx stock", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const sku = await createSku(request, "PIEZA");
    const sale = await request.post(
      "/api/provider/pos/sales",
      withAuth(request, {
        headers: { "Idempotency-Key": randomIdempotencyKey() },
        data: buildPosSalePayload([
          { providerProductId: sku.providerProductId, quantity: 3, unitOfMeasure: "PZA" },
        ]),
      })
    );
    const status = sale.status();
    const text = await sale.text();
    expect(status, text).toBeGreaterThanOrEqual(200);
    expect(status).toBeLessThan(300);
    expect(text.toLowerCase()).not.toMatch(/stock|agotado|existenc/);
    const inv = await inventoryItem(request, sku.providerProductId);
    expect(Number(inv.body.data.onHand)).toBeLessThan(0);
  });

  test("TC-F12-006: Encargar reserva; CANCELLED restore; create con saldo 0", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const sku = await createSku(request, "PIEZA");
    const me = await (await request.get("/api/provider/me", withAuth(request))).json();
    const providerId = me.data.id as string;

    await loginAs(request, "CLIENT");
    const create = await request.post("/api/orders", {
      headers: { "Idempotency-Key": randomIdempotencyKey() },
      data: buildMarketplaceOrderPayload(providerId, [
        { providerProductId: sku.providerProductId, quantity: 4, unitOfMeasure: "PZA" },
      ]),
    });
    expect(create.status(), await create.text()).toBe(201);
    const orderId = (await create.json()).data.id as string;

    await loginAs(request, "PROVIDER");
    const reserved = await inventoryItem(request, sku.providerProductId);
    expect(Number(reserved.body.data.reserved)).toBeGreaterThanOrEqual(4);

    await loginAs(request, "CLIENT");
    const cancel = await request.patch(`/api/orders/${orderId}`, { data: { status: "CANCELLED" } });
    expect(cancel.status(), await cancel.text()).toBeGreaterThanOrEqual(200);
    expect(cancel.status()).toBeLessThan(300);

    await loginAs(request, "PROVIDER");
    const after = await inventoryItem(request, sku.providerProductId);
    expect(Number(after.body.data.reserved)).toBe(0);
    expect(Number(after.body.data.onHand)).toBe(0);
  });

  test("TC-F12-007: Encargar DELIVERED commit onHand", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const sku = await createSku(request, "PIEZA");
    await request.post(
      `/api/provider/inventory/${sku.providerProductId}/entries`,
      withAuth(request, { data: { quantity: "10.000", receiveAs: "CATALOG" } })
    );
    const me = await (await request.get("/api/provider/me", withAuth(request))).json();
    const providerId = me.data.id as string;

    await loginAs(request, "CLIENT");
    const create = await request.post("/api/orders", {
      headers: { "Idempotency-Key": randomIdempotencyKey() },
      data: buildMarketplaceOrderPayload(providerId, [
        { providerProductId: sku.providerProductId, quantity: 2, unitOfMeasure: "PZA" },
      ]),
    });
    expect(create.status()).toBe(201);
    const orderId = (await create.json()).data.id as string;

    await loginAs(request, "PROVIDER");
    const confirmed = await request.patch(
      `/api/provider/orders/${orderId}`,
      withAuth(request, { data: { status: "CONFIRMED" } })
    );
    expect(confirmed.ok(), await confirmed.text()).toBeTruthy();
    const transit = await request.patch(
      `/api/provider/orders/${orderId}`,
      withAuth(request, { data: { status: "IN_TRANSIT" } })
    );
    expect(transit.ok(), await transit.text()).toBeTruthy();
    const delivered = await request.patch(
      `/api/provider/orders/${orderId}`,
      withAuth(request, { data: { status: "DELIVERED" } })
    );
    expect(delivered.ok(), await delivered.text()).toBeTruthy();

    const inv = await inventoryItem(request, sku.providerProductId);
    expect(Number(inv.body.data.onHand)).toBeCloseTo(8, 3);
    expect(Number(inv.body.data.reserved)).toBe(0);
  });

  test("TC-F12-008: GET panel CAT incluye barra; público sin existencias", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const sku = await createSku(request);
    await request.patch(
      `/api/provider/inventory/${sku.providerProductId}`,
      withAuth(request, { data: { capacityMax: "8.000" } })
    );
    const panel = await request.get("/api/provider/products", withAuth(request));
    expect(panel.status()).toBe(200);
    const pbody = await panel.json();
    expect(pbody.data.catalog).toBeDefined();
    const row = (pbody.data.catalog as { providerProductId?: string; fillPercent?: number | null }[]).find(
      (c) => c.providerProductId === sku.providerProductId
    );
    expect(row, "fila CAT debe existir").toBeTruthy();
    expect(row && ("fillPercent" in row || "onHand" in row)).toBeTruthy();

    const me = await (await request.get("/api/provider/me", withAuth(request))).json();
    const publicDetail = await request.get(`/api/providers/${me.data.id}`);
    expect(publicDetail.status()).toBe(200);
    const pub = await publicDetail.json();
    expect(hasStockKey(pub.data.products)).toBe(false);
    const list = await request.get("/api/providers?verified=true&limit=5");
    expect(list.status()).toBe(200);
    expect(hasStockKey(await list.json())).toBe(false);
  });

  test("TC-F12-009: GET/PATCH me posShowImages persistido e independencia sucursal", async ({ request }) => {
    await loginWithCredentials(request, credentials.provider.email, credentials.provider.password);
    const mine = await (await request.get("/api/provider/mine", withAuth(request))).json();
    expect(mine.data.providerCount).toBeGreaterThanOrEqual(2);
    const a = mine.data.providers[0];
    const b = mine.data.providers[1];
    const actA = await request.post("/api/provider/active", withAuth(request, { data: { providerId: a.id } }));
    rememberSessionCookie(request, actA);
    const resetA = await request.patch(
      "/api/provider/me",
      withAuth(request, { data: { posShowImages: true } })
    );
    expect(resetA.status(), await resetA.text()).toBe(200);
    const actB0 = await request.post("/api/provider/active", withAuth(request, { data: { providerId: b.id } }));
    rememberSessionCookie(request, actB0);
    const resetB = await request.patch(
      "/api/provider/me",
      withAuth(request, { data: { posShowImages: true } })
    );
    expect(resetB.status()).toBe(200);
    const actA2 = await request.post("/api/provider/active", withAuth(request, { data: { providerId: a.id } }));
    rememberSessionCookie(request, actA2);
    const off = await request.patch(
      "/api/provider/me",
      withAuth(request, { data: { posShowImages: false } })
    );
    expect(off.status(), await off.text()).toBe(200);
    expect((await off.json()).data.posShowImages).toBe(false);

    const actB = await request.post("/api/provider/active", withAuth(request, { data: { providerId: b.id } }));
    rememberSessionCookie(request, actB);
    const meB = await (await request.get("/api/provider/me", withAuth(request))).json();
    expect(meB.data.posShowImages).toBe(true);

    const backA = await request.post("/api/provider/active", withAuth(request, { data: { providerId: a.id } }));
    rememberSessionCookie(request, backA);
    const meAagain = await (await request.get("/api/provider/me", withAuth(request))).json();
    expect(meAagain.data.posShowImages).toBe(false);
    await request.patch("/api/provider/me", withAuth(request, { data: { posShowImages: true } }));
  });

  test("TC-F12-010: cantidad <=0 y BOX sin factor → 400; tope <=0 → 400", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const sku = await createSku(request);
    const zero = await request.post(
      `/api/provider/inventory/${sku.providerProductId}/entries`,
      withAuth(request, { data: { quantity: "0", receiveAs: "CATALOG" } })
    );
    expect(zero.status()).toBe(400);
    const neg = await request.post(
      `/api/provider/inventory/${sku.providerProductId}/entries`,
      withAuth(request, { data: { quantity: "-1", receiveAs: "CATALOG" } })
    );
    expect(neg.status()).toBe(400);
    const box = await request.post(
      `/api/provider/inventory/${sku.providerProductId}/entries`,
      withAuth(request, { data: { quantity: "1", receiveAs: "BOX" } })
    );
    expect(box.status()).toBe(400);
    const cap = await request.patch(
      `/api/provider/inventory/${sku.providerProductId}`,
      withAuth(request, { data: { capacityMax: "0" } })
    );
    expect(cap.status()).toBe(400);
    const empty = await request.patch(
      `/api/provider/inventory/${sku.providerProductId}`,
      withAuth(request, { data: {} })
    );
    expect(empty.status()).toBe(400);
  });

  test("TC-F12-011: alerta off no dispara lowStockAlert; sobre-tope fill>100", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const sku = await createSku(request);
    await request.patch(
      `/api/provider/inventory/${sku.providerProductId}`,
      withAuth(request, {
        data: { capacityMax: "10.000", alertThresholdPercent: 10, alertEnabled: false },
      })
    );
    await request.post(
      `/api/provider/inventory/${sku.providerProductId}/entries`,
      withAuth(request, { data: { quantity: "0.500", receiveAs: "CATALOG" } })
    );
    const low = await inventoryItem(request, sku.providerProductId);
    expect(low.body.data.lowStockAlert).toBe(false);
    await request.post(
      `/api/provider/inventory/${sku.providerProductId}/entries`,
      withAuth(request, { data: { quantity: "20.000", receiveAs: "CATALOG" } })
    );
    const over = await inventoryItem(request, sku.providerProductId);
    expect(Number(over.body.data.fillPercent)).toBeGreaterThan(100);
  });

  test("TC-F12-012: 409 ADR-022 isAvailable=false; no 4xx de stock", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const sku = await createSku(request, "PIEZA");
    const disable = await request.patch(
      `/api/provider/local-products/${sku.providerProductId}`,
      withAuth(request, { data: { isAvailable: false } })
    );
    expect(disable.status(), await disable.text()).toBe(200);
    const panel = await request.get("/api/provider/products", withAuth(request));
    expect(panel.status()).toBe(200);
    const catalog = (await panel.json()).data.catalog as {
      providerProductId: string;
      isAvailable?: boolean;
    }[];
    const row = catalog.find((c) => c.providerProductId === sku.providerProductId);
    expect(row?.isAvailable).toBe(false);
    const sale = await request.post(
      "/api/provider/pos/sales",
      withAuth(request, {
        headers: { "Idempotency-Key": randomIdempotencyKey() },
        data: buildPosSalePayload([
          { providerProductId: sku.providerProductId, quantity: 1, unitOfMeasure: "PZA" },
        ]),
      })
    );
    const text = await sale.text();
    expect(sale.status(), text).toBe(409);
    expect(text.toLowerCase()).toMatch(/no disponible/);
    expect(text.toLowerCase()).not.toMatch(/stock|agotado|existenc/);
  });

  test("TC-F12-013: GET inventory sin token 401; CLIENT 403", async ({ request }) => {
    const anon = await request.get("/api/provider/inventory");
    expect(anon.status()).toBe(401);
    await loginAs(request, "CLIENT");
    const client = await request.get("/api/provider/inventory", withAuth(request));
    expect(client.status()).toBe(403);
  });

  test("TC-F12-014: IDOR inventario sucursal B con A activa → 403", async ({ request }) => {
    await loginWithCredentials(request, credentials.provider.email, credentials.provider.password);
    const mine = await (await request.get("/api/provider/mine", withAuth(request))).json();
    const a = mine.data.providers[0];
    const b = mine.data.providers[1];
    const actA = await request.post("/api/provider/active", withAuth(request, { data: { providerId: a.id } }));
    rememberSessionCookie(request, actA);
    const skuA = await createSku(request);

    const actB = await request.post("/api/provider/active", withAuth(request, { data: { providerId: b.id } }));
    rememberSessionCookie(request, actB);
    const getCross = await request.get(`/api/provider/inventory/${skuA.providerProductId}`, withAuth(request));
    expect(getCross.status()).toBe(403);
    const patchCross = await request.patch(
      `/api/provider/inventory/${skuA.providerProductId}`,
      withAuth(request, { data: { alertEnabled: false } })
    );
    expect(patchCross.status()).toBe(403);
    const entryCross = await request.post(
      `/api/provider/inventory/${skuA.providerProductId}/entries`,
      withAuth(request, { data: { quantity: "1.000", receiveAs: "CATALOG" } })
    );
    expect(entryCross.status()).toBe(403);

    const listB = await request.get("/api/provider/inventory", withAuth(request));
    const ids = ((await listB.json()).data as { providerProductId: string }[]).map((i) => i.providerProductId);
    expect(ids).not.toContain(skuA.providerProductId);
  });

  test("TC-F12-015: ADMIN no opera inventario como dueño", async ({ request }) => {
    await loginAs(request, "ADMIN");
    const res = await request.get("/api/provider/inventory", withAuth(request));
    expect(res.status()).toBe(403);
  });

  test("TC-F12-016: línea libre POS no exige fila inventario", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const sale = await request.post(
      "/api/provider/pos/sales",
      withAuth(request, {
        headers: { "Idempotency-Key": randomIdempotencyKey() },
        data: buildPosSalePayload([
          { customItem: { name: "Bolsa F12", unitPrice: "3.00" }, quantity: 1, unitOfMeasure: "PZA" },
        ]),
      })
    );
    expect(sale.status(), await sale.text()).toBe(201);
  });
});
