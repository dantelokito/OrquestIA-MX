import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";
import { ProviderSettingsPage } from "./pages/ProviderSettingsPage";
import { FruteriaPage } from "./pages/FruteriaPage";
import { PosPage } from "./pages/PosPage";
import { CartPage } from "./pages/CartPage";
import { credentials, loginAs, registerUnverifiedProvider } from "../../fixtures/auth";
import {
  getAvailableCatalogItem,
  findCatalogItemByName,
  restoreProduct,
  setProductAvailable,
} from "../../fixtures/catalog";

test.describe("E2E CATALOG CHANNELS — HP-CAT-01", () => {
  test("HP-CAT-01: inhabilitar desaparece de detalle y POS", async ({ page, request }) => {
    await loginAs(request, "PROVIDER");
    const target = await getAvailableCatalogItem(request);

    try {
      const disable = await setProductAvailable(request, target.productId, false, target.price);
      expect(disable.ok()).toBeTruthy();

      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(credentials.provider.email, credentials.provider.password);
      await expect(page).toHaveURL(/\/proveedor/, { timeout: 15_000 });

      const settings = new ProviderSettingsPage(page);
      await settings.goto();
      await expect(settings.catalogHint()).toBeVisible({ timeout: 10_000 });

      const posPage = new PosPage(page);
      await posPage.goto();
      await expect(posPage.productButton(target.name)).toHaveCount(0);

      await page.getByRole("button", { name: /menú de usuario/i }).click();
      await page.getByRole("menuitem", { name: /cerrar sesión/i }).click();

      await loginPage.goto();
      await loginPage.login(credentials.client.email, credentials.client.password);
      await expect(page).not.toHaveURL(/\/login/, { timeout: 15_000 });

      const fruteriaPage = new FruteriaPage(page);
      await fruteriaPage.goto(target.providerId);
      await expect(
        page.getByRole("button", { name: new RegExp(`Aumentar cantidad de ${target.name}`) })
      ).toHaveCount(0);
    } finally {
      await loginAs(request, "PROVIDER");
      await restoreProduct(request, target);
    }
  });

  test("HP-CAT-01b: carrito retira línea + toast", async ({ page, request }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.client.email, credentials.client.password);
    await expect(page).not.toHaveURL(/\/login/, { timeout: 15_000 });

    await loginAs(request, "PROVIDER");
    const me = await request.get("/api/provider/me");
    const business = await me.json();
    const fruteriaPage = new FruteriaPage(page);
    await fruteriaPage.goto(business.data.id);

    const increaseBtn = page.getByRole("button", { name: /aumentar cantidad de /i }).first();
    await expect(increaseBtn).toBeVisible({ timeout: 15_000 });
    const label = (await increaseBtn.getAttribute("aria-label")) ?? "";
    const name = label.replace(/^Aumentar cantidad de /i, "").trim();
    await increaseBtn.click();
    await fruteriaPage.encargarLink().first().click();
    await expect(page).toHaveURL(/\/carrito/);

    await loginAs(request, "PROVIDER");
    const target = await findCatalogItemByName(request, name);
    try {
      await setProductAvailable(request, target.productId, false, target.price);
      const cartPage = new CartPage(page);
      await cartPage.goto();
      await expect(cartPage.unavailableToast()).toBeVisible({ timeout: 15_000 });
    } finally {
      await loginAs(request, "PROVIDER");
      await restoreProduct(request, target);
    }
  });

  test("HP-CAT-POS-EMPTY: proveedor nuevo sin SKUs activos", async ({ page, request }) => {
    const { email, password } = await registerUnverifiedProvider(request, "posempty");
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(email, password);
    await expect(page).toHaveURL(/\/proveedor/, { timeout: 15_000 });

    const posPage = new PosPage(page);
    await posPage.goto();
    await expect(posPage.emptyCatalog()).toBeVisible({ timeout: 15_000 });
    await expect(posPage.goToCatalogLink()).toBeVisible();
  });
});
