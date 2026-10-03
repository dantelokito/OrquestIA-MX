import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";
import { ExplorePage } from "./pages/ExplorePage";
import { FruteriaPage } from "./pages/FruteriaPage";
import { CartPage } from "./pages/CartPage";
import { credentials } from "../../fixtures/auth";

test.describe("E2E CHECKOUT ETA — HP-ETA-01", () => {
  test("HP-ETA-01: pickup muestra prep y Confirmar no se bloquea", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.client.email, credentials.client.password);
    await expect(page).not.toHaveURL(/\/login/, { timeout: 15_000 });

    const explorePage = new ExplorePage(page);
    await explorePage.goto("Paraíso");
    await explorePage.waitForProvidersLoaded();
    await explorePage.providerCards.first().click();
    await expect(page).toHaveURL(/\/fruteria\//);

    await page.getByRole("button", { name: /aumentar cantidad/i }).first().click();
    const fruteriaPage = new FruteriaPage(page);
    await fruteriaPage.encargarLink().first().click();
    await expect(page).toHaveURL(/\/carrito/);

    const cartPage = new CartPage(page);
    await expect(cartPage.etaPrepCopy().or(cartPage.etaReadyCopy())).toBeVisible({
      timeout: 15_000,
    });
    await expect(cartPage.confirmButton).toBeEnabled();
  });
});
