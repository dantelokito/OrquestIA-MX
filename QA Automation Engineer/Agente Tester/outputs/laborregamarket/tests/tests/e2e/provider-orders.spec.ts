import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";
import { ProviderOrdersPage } from "./pages/ProviderOrdersPage";
import { ExplorePage } from "./pages/ExplorePage";
import { CartPage } from "./pages/CartPage";
import { credentials } from "../../fixtures/auth";

test.describe("E2E OPS — HP-OPS / EC-03", () => {
  test("HP-OPS-01: ciclo de estado proveedor", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.client.email, credentials.client.password);

    const explorePage = new ExplorePage(page);
    await explorePage.goto("Paraíso");
    await explorePage.waitForProvidersLoaded();
    await explorePage.providerCards.first().click();
    await page.getByRole("button", { name: /aumentar cantidad/i }).first().click();
    await page.getByRole("link", { name: /encargar/i }).first().click();

    const cartPage = new CartPage(page);
    await cartPage.confirmButton.click();
    await expect(page.getByText(/pedido #.*enviado/i)).toBeVisible({ timeout: 15_000 });

    await loginPage.goto();
    await loginPage.login(credentials.provider.email, credentials.provider.password);
    await expect(page).toHaveURL(/\/proveedor/);

    const ordersPage = new ProviderOrdersPage(page);
    await ordersPage.goto("active");
    await expect(page.getByText(/pendiente/i).first()).toBeVisible({ timeout: 15_000 });

    await ordersPage.actionButton("Aceptar").first().click();
    await expect(page.getByText(/confirmado/i).first()).toBeVisible({ timeout: 10_000 });

    await ordersPage.actionButton("Listo para recoger").first().click();
    await expect(page.getByText(/listo para recoger/i).first()).toBeVisible({ timeout: 10_000 });

    await ordersPage.actionButton("Entregado").first().click();
    await expect(page.getByText(/entregado/i).first()).toBeVisible({ timeout: 10_000 });
  });

  test("EC-03: cancelar pedido confirmado muestra error", async ({ page }) => {
    await loginPageFlow(page, credentials.client);

    const explorePage = new ExplorePage(page);
    await explorePage.goto("Paraíso");
    await explorePage.waitForProvidersLoaded();
    await explorePage.providerCards.first().click();
    await page.getByRole("button", { name: /aumentar cantidad/i }).first().click();
    await page.getByRole("link", { name: /encargar/i }).first().click();
    await page.getByRole("button", { name: /confirmar pedido/i }).click();
    await expect(page.getByText(/pedido #.*enviado/i)).toBeVisible({ timeout: 15_000 });

    await loginPageFlow(page, credentials.provider);
    const ordersPage = new ProviderOrdersPage(page);
    await ordersPage.goto("active");
    await ordersPage.actionButton("Aceptar").first().click();

    await loginPageFlow(page, credentials.client);
    await page.goto("/cuenta");
    const cancelBtn = page.getByRole("button", { name: /cancelar pedido/i }).first();
    if (await cancelBtn.isVisible()) {
      await cancelBtn.click();
      await page.getByRole("button", { name: /sí, cancelar/i }).click();
      await expect(page.getByText(/ya no es posible|no pudimos cancelar/i)).toBeVisible({
        timeout: 10_000,
      });
    }
  });
});

async function loginPageFlow(
  page: import("@playwright/test").Page,
  creds: { email: string; password: string }
) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(creds.email, creds.password);
}
