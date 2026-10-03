import type { Page } from "@playwright/test";
import { CART_STORAGE_KEY, type SessionCart } from "./cart-types";

export { CART_STORAGE_KEY };

/** Populate session cart before navigating to /carrito (E2E) */
export async function seedSessionCart(page: Page, cart: SessionCart): Promise<void> {
  await page.addInitScript(
    ({ key, value }) => {
      sessionStorage.setItem(key, JSON.stringify(value));
    },
    { key: CART_STORAGE_KEY, value: cart }
  );
}

export function buildSessionCart(
  providerId: string,
  providerName: string,
  items: SessionCart["items"],
  providerAddress?: string
): SessionCart {
  return {
    providerId,
    providerName,
    providerAddress,
    items,
  };
}
