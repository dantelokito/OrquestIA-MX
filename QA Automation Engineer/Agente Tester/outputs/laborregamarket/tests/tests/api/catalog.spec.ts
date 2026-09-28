import { test, expect } from "@playwright/test";
import { loginAs } from "../../fixtures/auth";
import {
  getAvailableCatalogItem,
  restoreProduct,
  setProductAvailable,
} from "../../fixtures/catalog";

test.describe("API CATALOG — TC-CAT", () => {
  test.describe.configure({ mode: "serial" });

  test("TC-CAT-001: detalle omite isAvailable=false", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const target = await getAvailableCatalogItem(request);
    try {
      const disable = await setProductAvailable(request, target.productId, false, target.price);
      expect(disable.ok()).toBeTruthy();

      const detail = await request.get(`/api/providers/${target.providerId}`);
      expect(detail.status()).toBe(200);
      const body = await detail.json();
      const ids = (body.data.products as { providerProductId: string; isAvailable: boolean }[]).map(
        (p) => p.providerProductId
      );
      expect(ids).not.toContain(target.providerProductId);
      for (const product of body.data.products) {
        expect(product.isAvailable).toBe(true);
      }
    } finally {
      await restoreProduct(request, target);
    }
  });

  test("TC-CAT-002: samples explorar no incluyen inactivo", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const target = await getAvailableCatalogItem(request);
    try {
      await setProductAvailable(request, target.productId, false, target.price);

      const list = await request.get(`/api/providers?q=${encodeURIComponent("Paraíso")}`);
      expect(list.status()).toBe(200);
      const body = await list.json();
      const card = body.data.find((p: { id: string }) => p.id === target.providerId) ?? body.data[0];
      const samples = (card?.sampleProducts ?? []) as { name: string }[];
      expect(samples.some((s) => s.name === target.name)).toBe(false);
    } finally {
      await restoreProduct(request, target);
    }
  });

  test("TC-CAT-006: reactivar reaparece en detalle", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const target = await getAvailableCatalogItem(request);
    try {
      await setProductAvailable(request, target.productId, false, target.price);
      await restoreProduct(request, target);

      const detail = await request.get(`/api/providers/${target.providerId}`);
      const body = await detail.json();
      const ids = (body.data.products as { providerProductId: string }[]).map(
        (p) => p.providerProductId
      );
      expect(ids).toContain(target.providerProductId);
    } finally {
      await restoreProduct(request, target);
    }
  });

  test("TC-CAT-008: topProducts excluye SKU inhabilitado", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const target = await getAvailableCatalogItem(request);
    try {
      await setProductAvailable(request, target.productId, false, target.price);
      const dash = await request.get("/api/provider/dashboard");
      expect(dash.status()).toBe(200);
      const body = await dash.json();
      const tops = (body.data.topProducts ?? []) as { providerProductId: string | null }[];
      expect(tops.some((row) => row.providerProductId === target.providerProductId)).toBe(false);
    } finally {
      await restoreProduct(request, target);
    }
  });
});
