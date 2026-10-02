import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";
import { ProviderSettingsPage } from "./pages/ProviderSettingsPage";
import { FruteriaPage } from "./pages/FruteriaPage";
import { registerUnverifiedProvider, credentials } from "../../fixtures/auth";
import { getSeedProviderProduct } from "../../fixtures/orders";

test.describe("E2E GOOGLE GATE — HP-REV-04", () => {
  test("HP-REV-04: PROVIDER no verificado ve banner y Place ID disabled", async ({ page, request }) => {
    const { email, password } = await registerUnverifiedProvider(request, "ui-g");

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(email, password);
    await expect(page).toHaveURL(/\/proveedor/);

    const settings = new ProviderSettingsPage(page);
    await settings.goto();
    await expect(settings.verificationBanner()).toBeVisible({ timeout: 15_000 });
    await expect(settings.googlePlaceInput()).toBeDisabled();
  });

  test("HP-REV-04: Encargar y contacto siguen en detalle (regresión D-F3-7)", async ({ page, request }) => {
    const seed = await getSeedProviderProduct(request);
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.client.email, credentials.client.password);
    await expect(page).not.toHaveURL(/\/login/, { timeout: 15_000 });

    const fruteriaPage = new FruteriaPage(page);
    await fruteriaPage.goto(seed.providerId);
    await page.getByRole("button", { name: /aumentar cantidad/i }).first().click();
    await expect(fruteriaPage.encargarLink().first()).toBeVisible({ timeout: 15_000 });
    await expect(fruteriaPage.llamarLink().first()).toBeVisible();
    await expect(fruteriaPage.whatsappLink().first()).toBeVisible();
  });
});
