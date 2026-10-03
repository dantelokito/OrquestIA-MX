/** Mirrors LaBorregaMarket session cart shape (client-only) */
export const CART_STORAGE_KEY = "lbm-cart-f3";

export interface CartItem {
  providerProductId: string;
  name: string;
  unitPrice: number;
  unitOfMeasure: "PZA" | "KG" | "LT";
  quantity: number;
  imageUrl?: string | null;
}

export interface SessionCart {
  providerId: string;
  providerName: string;
  providerAddress?: string;
  items: CartItem[];
}
