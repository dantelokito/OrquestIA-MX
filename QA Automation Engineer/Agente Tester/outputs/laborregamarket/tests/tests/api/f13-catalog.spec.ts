import { test, expect } from "@playwright/test";
import {
  credentials,
  loginAs,
  loginWithCredentials,
  withAuth,
} from "../../fixtures/auth";
import { createLocalProduct, ensureOwnSection, f10Suffix } from "../../fixtures/f10";
import {
  buildMarketplaceOrderPayload,
  buildPosSalePayload,
  randomIdempotencyKey,
} from "../../fixtures/orders";

async function createSku(request: Parameters<typeof createLocalProduct>[0]) {
  const sectionId = await ensureOwnSection(request, `F13 ${f10Suffix()}`);
  const name = `QA-F13-${f10Suffix()}`;
  const created = await createLocalProduct(request, { name, sectionId, unit: "KG", price: 18.5 });
  expect(created.status(), await created.text()).toBe(201);
  const row = await created.json();
  return {
    name,
    productId: row.data.productId as string,
    providerProductId: row.data.providerProductId as string,
  };
}

async function activeProviderId(request: Parameters<typeof createLocalProduct>[0]) {
  const me = await request.get("/api/provider/me", withAuth(request));
  expect(me.status()).toBe(200);
  const body = await me.json();
  return (body.data.id ?? body.data.providerId ?? body.data.activeProviderId) as string;
}

function catalogRows(body: { data?: unknown }): { product?: { id: string }; productId?: string; archivedAt?: string | null }[] {
  const data = body.data as
    | { catalog?: unknown[] }
    | unknown[]
    | undefined;
  if (Array.isArray(data)) return data as { product?: { id: string } }[];
  if (data && Array.isArray(data.catalog)) {
    return data.catalog as { product?: { id: string }; archivedAt?: string | null }[];
  }
  return [];
}

test.describe("API F13 — admin, archivo, unidad, precio, inventario, reportes, RBAC", () => {
  test("TC-F13-001: GET admin products incluye GLOBAL y LOCAL, meta real, default limit 50", async ({
    request,
  }) => {
    await loginAs(request, "PROVIDER");
    const sku = await createSku(request);

    await loginAs(request, "ADMIN");
    const res = await request.get("/api/admin/products?page=1", withAuth(request));
    expect(res.status(), await res.text()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.meta.limit).toBe(50);
    expect(body.meta.total).toBeGreaterThanOrEqual(body.data.length);
    const scopes = new Set((body.data as { scope: string }[]).map((r) => r.scope));
    expect(scopes.has("GLOBAL") || scopes.has("LOCAL")).toBe(true);
    const local = (body.data as { id: string; scope: string }[]).find((r) => r.id === sku.productId);
    if (!local) {
      const q = await request.get(
        `/api/admin/products?q=${encodeURIComponent(sku.name)}&limit=50`,
        withAuth(request)
      );
      expect(q.status()).toBe(200);
      const qBody = await q.json();
      expect((qBody.data as { id: string }[]).some((r) => r.id === sku.productId)).toBe(true);
    }
  });

  test("TC-F13-002: PATCH admin isActive en LOCAL y DELETE 405", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const sku = await createSku(request);
    await loginAs(request, "ADMIN");
    const patch = await request.patch(
      `/api/admin/products/${sku.productId}`,
      withAuth(request, { data: { isActive: false } })
    );
    expect(patch.status(), await patch.text()).toBe(200);
    const del = await request.delete(`/api/admin/products/${sku.productId}`, withAuth(request));
    expect(del.status()).toBe(405);
    const err = await del.json();
    expect(String(err.error)).toMatch(/eliminar/i);
  });

  test("TC-F13-010: page/limit inválidos admin → 400", async ({ request }) => {
    await loginAs(request, "ADMIN");
    const res = await request.get("/api/admin/products?page=0&limit=101", withAuth(request));
    expect(res.status()).toBe(400);
  });

  test("TC-F13-003: archive + bandeja + restore; GET visible sin archivado", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const sku = await createSku(request);
    const arch = await request.post(
      `/api/provider/products/by-product/${sku.productId}/archive`,
      withAuth(request)
    );
    expect(arch.status(), await arch.text()).toBe(200);
    const aBody = await arch.json();
    expect(aBody.data.archivedAt).toBeTruthy();

    const visible = await request.get("/api/provider/products?page=1&limit=100", withAuth(request));
    expect(visible.status()).toBe(200);
    const vBody = await visible.json();
    const visIds = catalogRows(vBody).map((r) => r.product?.id ?? r.productId);
    expect(visIds).not.toContain(sku.productId);

    const tray = await request.get(
      "/api/provider/products?archived=1&page=1&limit=100",
      withAuth(request)
    );
    expect(tray.status()).toBe(200);
    const tBody = await tray.json();
    const trayHit = catalogRows(tBody).find((r) => r.product?.id === sku.productId);
    expect(trayHit?.archivedAt).toBeTruthy();

    const inv = await request.get("/api/provider/inventory?page=1&limit=100", withAuth(request));
    expect(inv.status()).toBe(200);
    const invBody = await inv.json();
    expect(
      (invBody.data as { providerProductId: string }[]).some(
        (r) => r.providerProductId === sku.providerProductId
      )
    ).toBe(false);

    const rest = await request.post(
      `/api/provider/products/by-product/${sku.productId}/restore`,
      withAuth(request)
    );
    expect(rest.status(), await rest.text()).toBe(200);
    expect((await rest.json()).data.archivedAt).toBeNull();
  });

  test("TC-F13-004: DELETE provider products/local 405; restore sin oferta 404", async ({
    request,
  }) => {
    await loginAs(request, "PROVIDER");
    const delList = await request.delete("/api/provider/products", withAuth(request));
    expect(delList.status()).toBe(405);
    const fake = `clx${"0".repeat(22)}`;
    const rest = await request.post(
      `/api/provider/products/by-product/${fake}/restore`,
      withAuth(request)
    );
    expect([404, 403]).toContain(rest.status());
  });

  test("TC-F13-005: 409 Encargar/POS/vitrina tras archivo; entrada sobre oculta 409", async ({
    request,
  }) => {
    await loginAs(request, "PROVIDER");
    const sku = await createSku(request);
    const providerId = await activeProviderId(request);
    await request.post(
      `/api/provider/products/by-product/${sku.productId}/archive`,
      withAuth(request)
    );

    const pos = await request.post(
      "/api/provider/pos/sales",
      withAuth(request, {
        data: buildPosSalePayload([{ providerProductId: sku.providerProductId, quantity: 1 }]),
        headers: { "Idempotency-Key": randomIdempotencyKey() },
      })
    );
    expect(pos.status(), await pos.text()).toBe(409);

    await loginAs(request, "CLIENT");
    const order = await request.post(
      "/api/orders",
      withAuth(request, {
        data: buildMarketplaceOrderPayload(providerId, [
          { providerProductId: sku.providerProductId, quantity: "1" },
        ]),
        headers: { "Idempotency-Key": randomIdempotencyKey() },
      })
    );
    expect(order.status(), await order.text()).toBe(409);

    const shop = await request.get(`/api/providers/${providerId}`);
    expect(shop.status()).toBe(200);
    const shopBody = await shop.json();
    const products = shopBody.data.products ?? shopBody.data.provider?.products ?? [];
    const ids = (products as { providerProductId?: string; id?: string }[]).map(
      (p) => p.providerProductId ?? p.id
    );
    expect(ids).not.toContain(sku.providerProductId);
  });

  test("TC-F13-011: POST entries sobre oferta oculta → 409 (no 500)", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const sku = await createSku(request);
    await request.post(
      `/api/provider/products/by-product/${sku.productId}/archive`,
      withAuth(request)
    );
    const entry = await request.post(
      `/api/provider/inventory/${sku.providerProductId}/entries`,
      withAuth(request, { data: { quantity: "1.000", receiveAs: "CATALOG" } })
    );
    expect(entry.status(), await entry.text()).toBe(409);
  });

  test("TC-F13-006a: PATCH oferta CAJA sin factor → 400", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const sku = await createSku(request);
    const bad = await request.patch(
      `/api/provider/products/by-product/${sku.productId}`,
      withAuth(request, { data: { saleUnit: "CAJA" } })
    );
    expect(bad.status(), await bad.text()).toBe(400);
  });

  test("TC-F13-006b: PATCH unidad con onHand exige confirmDiscard", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const sku = await createSku(request);
    const seeded = await request.post(
      `/api/provider/inventory/${sku.providerProductId}/entries`,
      withAuth(request, { data: { quantity: "2.000", receiveAs: "CATALOG" } })
    );
    expect(seeded.status(), await seeded.text()).toBe(200);

    const noFlag = await request.patch(
      `/api/provider/products/by-product/${sku.productId}`,
      withAuth(request, {
        data: { saleUnit: "PIEZA", confirmDiscard: false },
      })
    );
    expect(noFlag.status(), await noFlag.text()).toBe(400);

    const ok = await request.patch(
      `/api/provider/products/by-product/${sku.productId}`,
      withAuth(request, {
        data: { saleUnit: "PIEZA", confirmDiscard: true },
      })
    );
    expect(ok.status(), await ok.text()).toBe(200);
    const body = await ok.json();
    expect(body.data.effectiveSaleUnit ?? body.data.saleUnit).toBe("PIEZA");
    if (body.data.onHand != null) {
      expect(Number(body.data.onHand)).toBe(0);
    }
  });

  test("TC-F13-007: PATCH precio + GET historial", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const sku = await createSku(request);
    const price = await request.patch(
      `/api/provider/products/by-product/${sku.productId}/price`,
      withAuth(request, { data: { price: "33.50" } })
    );
    expect(price.status(), await price.text()).toBe(200);
    const pBody = await price.json();
    expect(String(pBody.data.price)).toMatch(/33\.5/);

    const hist = await request.get(
      `/api/provider/products/${sku.providerProductId}/price-history?page=1&limit=50`,
      withAuth(request)
    );
    expect(hist.status(), await hist.text()).toBe(200);
    const hBody = await hist.json();
    expect(Array.isArray(hBody.data)).toBe(true);
    expect(hBody.data.length).toBeGreaterThan(0);
    expect(hBody.meta).toBeTruthy();
  });

  test("TC-F13-008: POST entries persiste y aparece en reporte sucursal", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const sku = await createSku(request);
    const entry = await request.post(
      `/api/provider/inventory/${sku.providerProductId}/entries`,
      withAuth(request, { data: { quantity: "1.250", receiveAs: "CATALOG" } })
    );
    expect(entry.status(), await entry.text()).toBe(200);

    const report = await request.get("/api/provider/reports/inventory?page=1&limit=50", withAuth(request));
    expect(report.status(), await report.text()).toBe(200);
    const rBody = await report.json();
    expect(rBody.data.timezone).toBe("America/Monterrey");
    expect(Array.isArray(rBody.data.balances)).toBe(true);
    expect(Array.isArray(rBody.data.entries)).toBe(true);
    const bal = (rBody.data.balances as { providerProductId: string }[]).find(
      (b) => b.providerProductId === sku.providerProductId
    );
    expect(bal).toBeTruthy();
    const ent = (rBody.data.entries as { providerProductId: string; quantity: string }[]).find(
      (e) => e.providerProductId === sku.providerProductId
    );
    expect(ent).toBeTruthy();
  });

  test("TC-F13-009: reportes global inventario N>1 200; N=1 403", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const multi = await request.get("/api/provider/reports/global/inventory", withAuth(request));
    expect(multi.status(), await multi.text()).toBe(200);
    const mBody = await multi.json();
    expect(mBody.data.scope).toBe("allOwnedProviders");
    expect(mBody.data.entries).toBeUndefined();

    await loginWithCredentials(
      request,
      credentials.providerN1.email,
      credentials.providerN1.password
    );
    const n1 = await request.get("/api/provider/reports/global/inventory", withAuth(request));
    expect(n1.status(), await n1.text()).toBe(403);
  });

  test("TC-F13-020: sin JWT 401; CLIENT 403 en admin y archive", async ({ request }) => {
    const naked = await request.get("/api/admin/products");
    expect(naked.status()).toBe(401);
    await loginAs(request, "CLIENT");
    const admin = await request.get("/api/admin/products", withAuth(request));
    expect(admin.status()).toBe(403);
    const arch = await request.post(
      "/api/provider/products/by-product/clx000000000000000000001/archive",
      withAuth(request)
    );
    expect(arch.status()).toBe(403);
  });

  test("TC-F13-021: IDOR archive LOCAL ajeno → 403", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const sku = await createSku(request);
    await loginWithCredentials(
      request,
      credentials.providerN1.email,
      credentials.providerN1.password
    );
    const arch = await request.post(
      `/api/provider/products/by-product/${sku.productId}/archive`,
      withAuth(request)
    );
    expect(arch.status(), await arch.text()).toBe(403);
  });

  test("TC-F13-022: PROVIDER GET admin products → 403", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const res = await request.get("/api/admin/products", withAuth(request));
    expect(res.status()).toBe(403);
  });
});
