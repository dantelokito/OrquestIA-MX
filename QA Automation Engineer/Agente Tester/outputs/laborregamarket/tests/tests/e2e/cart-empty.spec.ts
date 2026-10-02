import { test, expect } from "@playwright/test";

test.describe("E2E CART — EC-01", () => {
  test("EC-01: carrito vacío muestra empty + CTA explorar", async ({ page }) => {
    await page.goto("/carrito");
    await expect(page.getByText(/tu carrito está vacío/i)).toBeVisible();
    await expect(page.getByRole("link", { name: /ver fruterías/i })).toBeVisible();
  });
});
