import type { APIRequestContext } from "@playwright/test";
import { loginAs } from "./auth";
import {
  advanceOrderToDelivered,
  buildMarketplaceOrderPayload,
  getSeedProviderProduct,
  randomIdempotencyKey,
} from "./orders";

export async function createDeliveredMarketplaceOrder(request: APIRequestContext) {
  await loginAs(request, "CLIENT");
  const seed = await getSeedProviderProduct(request);
  const create = await request.post("/api/orders", {
    headers: { "Idempotency-Key": randomIdempotencyKey() },
    data: buildMarketplaceOrderPayload(seed.providerId, [
      { providerProductId: seed.providerProductId, quantity: 1, unitOfMeasure: seed.unitOfMeasure },
    ]),
  });
  if (create.status() !== 201) {
    throw new Error(`create order failed: ${create.status()} ${await create.text()}`);
  }
  const created = await create.json();
  const orderId = created.data.id as string;

  await loginAs(request, "PROVIDER");
  await advanceOrderToDelivered(request, orderId);
  await loginAs(request, "CLIENT");

  return { orderId, providerId: seed.providerId, seed };
}

export function reviewPayload(rating = 5, comment = "Muy fresca la fruta QA") {
  return { rating, comment };
}
