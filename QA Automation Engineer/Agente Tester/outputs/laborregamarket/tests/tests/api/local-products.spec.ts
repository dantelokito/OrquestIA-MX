import { test, expect } from "@playwright/test";
import { loginAs, registerUnverifiedProvider, withAuth } from "../../fixtures/auth";
import {
  createLocalProduct,
  createSection,
  ensureOwnSection,
  f10Suffix,
} from "../../fixtures/f10";
import {
  buildMarketplaceOrderPayload,
  buildPosSalePayload,
  randomIdempotencyKey,
} from "../../fixtures/orders";

test.describe("API LOCAL PRODUCTS F10 — TC-CAT", () => {
  test("TC-CAT-011/012: POST local + visible en panel y detalle propio", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const me = await request.get("/api/provider/me", withAuth(request));
    const providerId = (await me.json()).data.id as string;
    const sectionId = await ensureOwnSection(request);
    const name = `Papaya QA ${f10Suffix()}`;
    const created = await createLocalProduct(request, { name, sectionId, price: 38.5 });
    expect(created.status()).toBe(201);
    const row = (await created.json()).data;
    expect(row.scope).toBe("LOCAL");
    expect(row.providerProductId).toBeTruthy();

    const panel = await request.get("/api/provider/products", withAuth(request));
    expect(panel.status()).toBe(200);
    const catalog = (await panel.json()).data.catalog as {
      product: { name: string };
      scope?: string;
      providerProductId: string | null;
    }[];
    expect(catalog.some((c) => c.product.name === name && c.scope === "LOCAL")).toBe(true);

    const detail = await request.get(`/api/providers/${providerId}`);
    expect(detail.status()).toBe(200);
    const products = (await detail.json()).data.products as { name: string; scope?: string }[];
    expect(products.some((p) => p.name === name)).toBe(true);
  });

  test("TC-CAT-013: local no aparece en detalle de otra frutería", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const seedMe = await request.get("/api/provider/me", withAuth(request));
    const seedId = (await seedMe.json()).data.id as string;

    await registerUnverifiedProvider(request, "f10iso");
    const otherMe = await request.get("/api/provider/me", withAuth(request));
    expect(otherMe.ok()).toBeTruthy();
    const otherId = (await otherMe.json()).data.id as string;
    const sectionRes = await createSection(request, `Sec ${f10Suffix()}`);
    expect(sectionRes.ok()).toBeTruthy();
    const sectionId = (await sectionRes.json()).data.id as string;
    const localName = `SKU aislado ${f10Suffix()}`;
    const created = await createLocalProduct(request, { name: localName, sectionId });
    expect(created.ok()).toBeTruthy();

    const seedDetail = await request.get(`/api/providers/${seedId}`);
    expect(seedDetail.status()).toBe(200);
    const seedProducts = (await seedDetail.json()).data.products as { name: string }[];
    expect(seedProducts.some((p) => p.name === localName)).toBe(false);

    const otherDetail = await request.get(`/api/providers/${otherId}`);
    if (otherDetail.ok()) {
      const otherProducts = (await otherDetail.json()).data.products as { name: string }[];
      expect(otherProducts.some((p) => p.name === localName)).toBe(true);
    }
  });

  test("TC-CAT-014: name vacío → 400", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const sectionId = await ensureOwnSection(request);
    const response = await createLocalProduct(request, { name: "", sectionId });
    expect(response.status()).toBe(400);
  });

  test("TC-CAT-015: sectionId ajeno → 403", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const seedSection = await ensureOwnSection(request);

    await registerUnverifiedProvider(request, "f10sec");
    const otherSection = await createSection(request, `Other ${f10Suffix()}`);
    expect(otherSection.ok()).toBeTruthy();

    const steal = await createLocalProduct(request, {
      name: `Steal ${f10Suffix()}`,
      sectionId: seedSection,
    });
    expect(steal.status()).toBe(403);
  });

  test("TC-CAT-016: PATCH local ajeno → 403", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const sectionId = await ensureOwnSection(request);
    const created = await createLocalProduct(request, {
      name: `Dueño ${f10Suffix()}`,
      sectionId,
    });
    expect(created.ok()).toBeTruthy();
    const id = (await created.json()).data.providerProductId as string;

    await registerUnverifiedProvider(request, "f10idor");
    const patch = await request.patch(
      `/api/provider/local-products/${id}`,
      withAuth(request, { data: { price: 1 } })
    );
    expect(patch.status()).toBe(403);
  });

  test("TC-CAT-017: PATCH local-products sobre GLOBAL → 400", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const products = await request.get("/api/provider/products", withAuth(request));
    const catalog = (await products.json()).data.catalog as {
      scope?: string;
      providerProductId: string | null;
    }[];
    const globalRow = catalog.find((r) => r.scope === "GLOBAL" && r.providerProductId);
    test.skip(!globalRow?.providerProductId, "sin GLOBAL activado en seed");
    const response = await request.patch(
      `/api/provider/local-products/${globalRow!.providerProductId}`,
      withAuth(request, { data: { price: 9 } })
    );
    expect(response.status()).toBe(400);
  });

  test("TC-CAT-021: local inhabilitado → 409 POS y orders", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const me = await request.get("/api/provider/me", withAuth(request));
    const providerId = (await me.json()).data.id as string;
    const sectionId = await ensureOwnSection(request);
    const created = await createLocalProduct(request, {
      name: `Inactivo ${f10Suffix()}`,
      sectionId,
      isAvailable: true,
    });
    expect(created.ok()).toBeTruthy();
    const ppId = (await created.json()).data.providerProductId as string;

    const disable = await request.patch(
      `/api/provider/local-products/${ppId}`,
      withAuth(request, { data: { isAvailable: false } })
    );
    expect(disable.ok()).toBeTruthy();

    const pos = await request.post(
      "/api/provider/pos/sales",
      withAuth(request, {
        headers: { "Idempotency-Key": randomIdempotencyKey() },
        data: buildPosSalePayload([{ providerProductId: ppId, quantity: 1, unitOfMeasure: "KG" }]),
      })
    );
    expect(pos.status()).toBe(409);

    await loginAs(request, "CLIENT");
    const order = await request.post("/api/orders", {
      headers: { "Idempotency-Key": randomIdempotencyKey() },
      data: buildMarketplaceOrderPayload(providerId, [
        { providerProductId: ppId, quantity: 1, unitOfMeasure: "KG" },
      ]),
    });
    expect(order.status()).toBe(409);
  });
});
