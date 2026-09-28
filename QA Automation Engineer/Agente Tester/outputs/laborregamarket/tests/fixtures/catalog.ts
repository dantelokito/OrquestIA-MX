import type { APIRequestContext } from "@playwright/test";

export interface CatalogToggleTarget {
  providerId: string;
  productId: string;
  providerProductId: string;
  name: string;
  price: number;
}

interface CatalogRow {
  product: { id: string; name: string };
  price: number | null;
  isAvailable: boolean;
  providerProductId: string | null;
}

/** First available catalog SKU for the logged-in PROVIDER (mutates require restore). */
export async function getAvailableCatalogItem(
  request: APIRequestContext
): Promise<CatalogToggleTarget> {
  const me = await request.get("/api/provider/me");
  if (!me.ok()) {
    throw new Error(`GET /api/provider/me failed: ${me.status()} ${await me.text()}`);
  }
  const business = await me.json();

  const products = await request.get("/api/provider/products");
  if (!products.ok()) {
    throw new Error(`GET /api/provider/products failed: ${products.status()}`);
  }
  const body = await products.json();
  const available = (body.data.catalog as CatalogRow[]).filter(
    (row) => row.isAvailable && row.providerProductId && row.price != null
  );
  // Prefer a SKU that is not the first public product (getSeedProviderProduct uses the first).
  const item = available.length > 1 ? available[available.length - 1] : available[0];
  if (!item || !item.providerProductId) {
    throw new Error("No available catalog item with providerProductId");
  }

  return {
    providerId: business.data.id as string,
    productId: item.product.id,
    providerProductId: item.providerProductId,
    name: item.product.name,
    price: item.price ?? 50,
  };
}

export async function findCatalogItemByName(
  request: APIRequestContext,
  name: string
): Promise<CatalogToggleTarget> {
  const me = await request.get("/api/provider/me");
  const business = await me.json();
  const products = await request.get("/api/provider/products");
  const body = await products.json();
  const item = (body.data.catalog as CatalogRow[]).find(
    (row) => row.product.name === name && row.providerProductId
  );
  if (!item || !item.providerProductId) {
    throw new Error(`Catalog item not found: ${name}`);
  }
  return {
    providerId: business.data.id as string,
    productId: item.product.id,
    providerProductId: item.providerProductId,
    name: item.product.name,
    price: item.price ?? 50,
  };
}

export async function setProductAvailable(
  request: APIRequestContext,
  productId: string,
  isAvailable: boolean,
  price: number
) {
  return request.patch("/api/provider/products", {
    data: { productId, isAvailable, price },
  });
}

export async function restoreProduct(
  request: APIRequestContext,
  target: CatalogToggleTarget
) {
  await setProductAvailable(request, target.productId, true, target.price);
}
