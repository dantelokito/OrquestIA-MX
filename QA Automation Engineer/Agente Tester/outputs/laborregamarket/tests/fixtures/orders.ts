import type { APIRequestContext } from "@playwright/test";

export type UnitOfMeasure = "PZA" | "KG" | "LT";

export interface MarketplaceOrderItem {
  providerProductId: string;
  quantity: string | number;
  unitOfMeasure?: UnitOfMeasure;
}

export interface PosLineItem {
  providerProductId?: string;
  customItem?: { name: string; unitPrice: string | number };
  quantity: string | number;
  unitOfMeasure?: UnitOfMeasure;
}

/** UUID for Idempotency-Key header */
export function randomIdempotencyKey(): string {
  return crypto.randomUUID();
}

export type FulfillmentType = "PICKUP" | "DELIVERY";

export interface MarketplaceOrderExtras {
  fulfillmentType?: FulfillmentType;
  deliveryAddressId?: string;
  clientLat?: number;
  clientLng?: number;
}

export function buildMarketplaceOrderPayload(
  providerId: string,
  items: MarketplaceOrderItem[],
  notes?: string,
  extras?: MarketplaceOrderExtras
) {
  return {
    providerId,
    notes,
    items: items.map((item) => ({
      providerProductId: item.providerProductId,
      quantity: String(item.quantity),
      unitOfMeasure: item.unitOfMeasure ?? "PZA",
    })),
    ...extras,
  };
}

export function buildPosSalePayload(
  items: PosLineItem[],
  paymentMethod: "CASH" | "OTHER" | "UNPAID" = "CASH",
  status: "DELIVERED" | "CONFIRMED" = "DELIVERED"
) {
  return {
    paymentMethod,
    status,
    items: items.map((item) => {
      const line: Record<string, unknown> = {
        quantity: String(item.quantity),
        unitOfMeasure: item.unitOfMeasure ?? "PZA",
      };
      if (item.providerProductId) {
        line.providerProductId = item.providerProductId;
      }
      if (item.customItem) {
        line.customItem = {
          name: item.customItem.name,
          unitPrice: String(item.customItem.unitPrice),
        };
      }
      return line;
    }),
  };
}

export interface SeedProviderProduct {
  providerId: string;
  providerProductId: string;
  unitOfMeasure: UnitOfMeasure;
  name: string;
}

/** Resolve first verified provider with an available product from public API */
export async function getSeedProviderProduct(request: APIRequestContext): Promise<SeedProviderProduct> {
  const listRes = await request.get("/api/providers?verified=true&limit=1");
  if (!listRes.ok()) {
    throw new Error(`providers list failed: ${listRes.status()}`);
  }
  const list = await listRes.json();
  const providerId = list.data[0]?.id;
  if (!providerId) {
    throw new Error("No providers in seed data");
  }

  const detailRes = await request.get(`/api/providers/${providerId}`);
  if (!detailRes.ok()) {
    throw new Error(`provider detail failed: ${detailRes.status()}`);
  }
  const detail = await detailRes.json();
  const product = detail.data.products.find(
    (p: { isAvailable: boolean; providerProductId: string }) => p.isAvailable
  );
  if (!product) {
    throw new Error("No available products for provider");
  }

  return {
    providerId,
    providerProductId: product.providerProductId,
    unitOfMeasure: product.unitOfMeasure as UnitOfMeasure,
    name: product.name,
  };
}

export async function createMarketplaceOrder(
  request: APIRequestContext,
  items: MarketplaceOrderItem[],
  providerId?: string,
  idempotencyKey = randomIdempotencyKey()
) {
  const seed = providerId
    ? null
    : await getSeedProviderProduct(request);
  const pid = providerId ?? seed!.providerId;
  const payload = buildMarketplaceOrderPayload(pid, items);

  const response = await request.post("/api/orders", {
    headers: { "Idempotency-Key": idempotencyKey },
    data: payload,
  });

  return { response, idempotencyKey, providerId: pid };
}

export async function advanceOrderToDelivered(
  request: APIRequestContext,
  orderId: string
): Promise<void> {
  const confirmed = await request.patch(`/api/provider/orders/${orderId}`, {
    data: { status: "CONFIRMED" },
  });
  if (!confirmed.ok()) {
    throw new Error(`CONFIRMED failed: ${confirmed.status()} ${await confirmed.text()}`);
  }
  const transit = await request.patch(`/api/provider/orders/${orderId}`, {
    data: { status: "IN_TRANSIT" },
  });
  if (!transit.ok()) {
    throw new Error(`IN_TRANSIT failed: ${transit.status()} ${await transit.text()}`);
  }
  const delivered = await request.patch(`/api/provider/orders/${orderId}`, {
    data: { status: "DELIVERED" },
  });
  if (!delivered.ok()) {
    throw new Error(`DELIVERED failed: ${delivered.status()} ${await delivered.text()}`);
  }
}
