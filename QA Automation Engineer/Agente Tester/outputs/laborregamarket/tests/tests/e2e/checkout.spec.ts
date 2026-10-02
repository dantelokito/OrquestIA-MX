import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";
import { ExplorePage } from "./pages/ExplorePage";
import { FruteriaPage } from "./pages/FruteriaPage";
import { CartPage } from "./pages/CartPage";
import { credentials } from "../../fixtures/auth";

test.describe("E2E CHECKOUT — HP-ORDERS", () => {
  test("HP-ORDERS-01: checkout pickup completo", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.client.email, credentials.client.password);
    await expect(page).not.toHaveURL(/\/login/, { timeout: 15_000 });

    const explorePage = new ExplorePage(page);
    await explorePage.goto("Paraíso");
    await explorePage.waitForProvidersLoaded();
    await explorePage.providerCards.first().click();
    await expect(page).toHaveURL(/\/fruteria\//);

    const increaseBtn = page.getByRole("button", { name: /aumentar cantidad/i }).first();
    await increaseBtn.click();

    const fruteriaPage = new FruteriaPage(page);
    await fruteriaPage.encargarLink().first().click();
    await expect(page).toHaveURL(/\/carrito/);

    const cartPage = new CartPage(page);
    await cartPage.notesInput.fill("Pedido QA F3");
    await cartPage.confirmButton.click();

    await expect(page.getByText(/pedido #.*enviado/i)).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(/pendiente/i)).toBeVisible();

    await page.goto("/cuenta");
    await expect(page.getByText(/pendiente/i).first()).toBeVisible({ timeout: 10_000 });

    const cancelBtn = page.getByRole("button", { name: /cancelar pedido/i }).first();
    if (await cancelBtn.isVisible()) {
      await cancelBtn.click();
      await page.getByRole("button", { name: /sí, cancelar/i }).click();
      await expect(page.getByText(/cancelado/i).first()).toBeVisible({ timeout: 10_000 });
    }
  });

  test("EC-08: invitado en carrito → login al confirmar", async ({ page }) => {
    const explorePage = new ExplorePage(page);
    await explorePage.goto("Paraíso");
    await explorePage.waitForProvidersLoaded();
    await explorePage.providerCards.first().click();

    await page.getByRole("button", { name: /aumentar cantidad/i }).first().click();
    await page.getByRole("link", { name: /encargar/i }).first().click();

    const cartPage = new CartPage(page);
    await cartPage.confirmButton.click();
    await expect(page).toHaveURL(/\/login/);
    expect(page.url()).toContain("next=%2Fcarrito");
  });
});
