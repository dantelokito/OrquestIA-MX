import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";
import { ProviderSettingsPage } from "./pages/ProviderSettingsPage";
import { ExplorePage } from "./pages/ExplorePage";
import { credentials, loginAs } from "../../fixtures/auth";
import { MONTERREY_PIN } from "../../fixtures/geo";

const VALID_PRIMARY = "#1B5E20";
const VALID_SECONDARY = "#0D47A1";
const PLATFORM_BRAND = /#e23744|rgb\(\s*226\s*,\s*55\s*,\s*68\s*\)/i;
const PROVIDER_BRAND = /#1[Bb]5[Ee]20|rgb\(\s*27\s*,\s*94\s*,\s*32\s*\)/;

async function cssBrand(page: import("@playwright/test").Page) {
  return page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue("--brand").trim()
  );
}

test.describe("E2E PROVIDER BRAND — HP-BRAND", () => {
  test.afterEach(async ({ request }) => {
    await loginAs(request, "PROVIDER");
    await request.patch("/api/provider/me", {
      data: { primaryColor: null, secondaryColor: null },
    });
  });

  test("HP-BRAND-01: guardar colores actualiza chrome PROVIDER", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.provider.email, credentials.provider.password);
    await expect(page).toHaveURL(/\/proveedor/, { timeout: 15_000 });

    const settings = new ProviderSettingsPage(page);
    await settings.goto();
    await expect(settings.brandHeading()).toBeVisible({ timeout: 15_000 });
    await settings.primaryColorInput().fill(VALID_PRIMARY);
    await settings.secondaryColorInput().fill(VALID_SECONDARY);
    await settings.saveColorsButton().click();
    await expect(page.getByText(/colores de tu marca actualizados/i)).toBeVisible({
      timeout: 10_000,
    });

    const brand = await cssBrand(page);
    expect(brand).toMatch(PROVIDER_BRAND);

    const explorePage = new ExplorePage(page);
    await explorePage.gotoGeo(MONTERREY_PIN.lat, MONTERREY_PIN.lng, 10);
    await explorePage.waitForProvidersLoaded();
    const exploreBrand = await cssBrand(page);
    expect(exploreBrand).toMatch(PROVIDER_BRAND);
  });

  test("HP-BRAND-02: CLIENT Explorar usa marca de plataforma", async ({ page, request }) => {
    await loginAs(request, "PROVIDER");
    await request.patch("/api/provider/me", {
      data: { primaryColor: VALID_PRIMARY, secondaryColor: VALID_SECONDARY },
    });

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.client.email, credentials.client.password);
    await expect(page).not.toHaveURL(/\/login/, { timeout: 15_000 });

    const explorePage = new ExplorePage(page);
    await explorePage.gotoGeo(MONTERREY_PIN.lat, MONTERREY_PIN.lng, 10);
    await explorePage.waitForProvidersLoaded();
    const brand = await cssBrand(page);
    expect(brand).toMatch(PLATFORM_BRAND);
  });

  test("HP-BRAND-02b: logout restaura plataforma", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.provider.email, credentials.provider.password);
    await expect(page).toHaveURL(/\/proveedor/, { timeout: 15_000 });

    const settings = new ProviderSettingsPage(page);
    await settings.goto();
    await settings.primaryColorInput().fill(VALID_PRIMARY);
    await settings.secondaryColorInput().fill(VALID_SECONDARY);
    await settings.saveColorsButton().click();
    await expect(page.getByText(/colores de tu marca actualizados/i)).toBeVisible({
      timeout: 10_000,
    });

    await page.getByRole("button", { name: /menú de usuario/i }).click();
    await page.getByRole("menuitem", { name: /cerrar sesión/i }).click();
    await expect(page).not.toHaveURL(/\/proveedor/, { timeout: 15_000 });

    const explorePage = new ExplorePage(page);
    await explorePage.gotoGeo(MONTERREY_PIN.lat, MONTERREY_PIN.lng, 10);
    await explorePage.waitForProvidersLoaded();
    const brand = await cssBrand(page);
    expect(brand).toMatch(PLATFORM_BRAND);
  });
});
