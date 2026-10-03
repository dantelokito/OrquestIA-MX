import { test, expect, type Page } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";
import { ExplorePage } from "./pages/ExplorePage";
import { FruteriaPage } from "./pages/FruteriaPage";
import { CartPage } from "./pages/CartPage";
import { PosPage } from "./pages/PosPage";
import { credentials } from "../../fixtures/auth";

/** Reproduce entornos sin Web Crypto UUID (HTTP no-localhost, navegadores viejos). */
async function stubMissingRandomUUID(page: Page) {
  await page.addInitScript(() => {
    const c = globalThis.crypto;
    if (!c) return;
    Object.defineProperty(c, "randomUUID", {
      value: undefined,
      configurable: true,
      writable: true,
    });
  });
}

function globalErrorHeading(page: Page) {
  return page.getByRole("heading", { name: /algo salió mal/i });
}

test.describe("E2E CART UUID — BUG-015", () => {
  test("EC-CART-015: /carrito sin crypto.randomUUID no muestra global-error", async ({ page }) => {
    await stubMissingRandomUUID(page);

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
    const verCarrito = page.getByRole("link", { name: /ver carrito/i });
    if (await verCarrito.first().isVisible().catch(() => false)) {
      await verCarrito.first().click();
    } else {
      await fruteriaPage.encargarLink().first().click();
    }

    await expect(page).toHaveURL(/\/carrito/);
    await expect(globalErrorHeading(page)).toHaveCount(0);
    await expect(page.getByText(/crypto\.randomUUID is not a function/i)).toHaveCount(0);

    const cartPage = new CartPage(page);
    await expect(cartPage.confirmButton).toBeVisible({ timeout: 15_000 });
  });

  test("HP-POS-015: POS sin crypto.randomUUID no muestra global-error", async ({ page }) => {
    await stubMissingRandomUUID(page);

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.provider.email, credentials.provider.password);
    await expect(page).toHaveURL(/\/proveedor/, { timeout: 15_000 });

    const posPage = new PosPage(page);
    await posPage.goto();

    await expect(globalErrorHeading(page)).toHaveCount(0);
    await expect(page.getByText(/crypto\.randomUUID is not a function/i)).toHaveCount(0);
    await expect(posPage.searchInput).toBeVisible({ timeout: 15_000 });
  });
});
