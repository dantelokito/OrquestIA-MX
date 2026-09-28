import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";
import { ProviderCatalogPage } from "./pages/ProviderCatalogPage";
import { credentials } from "../../fixtures/auth";
import { f10Suffix } from "../../fixtures/f10";

test.describe("E2E CATALOG F10 — HP-CAT-02 / HP-MED-01 / TC-SEC-009", () => {
  test("HP-CAT-02: sección + producto local + badge", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.provider.email, credentials.provider.password);
    await expect(page).toHaveURL(/\/proveedor/, { timeout: 15_000 });

    const catalog = new ProviderCatalogPage(page);
    await catalog.goto();
    await expect(catalog.addProductButton()).toBeVisible({ timeout: 15_000 });
    await expect(catalog.newSectionButton()).toBeVisible();

    const sectionName = `QA UI ${f10Suffix()}`;
    await catalog.createSection(sectionName);
    await expect(page.getByRole("heading", { name: sectionName })).toBeVisible({ timeout: 15_000 });

    await catalog.openAddProduct();
    await expect(catalog.scopeBadge()).toBeVisible();
    const productName = `SKU UI ${f10Suffix()}`;
    await catalog.productNameInput().fill(productName);
    await catalog.priceInput().fill("15.5");
    await catalog.drawer().locator("#local-section").selectOption({ label: sectionName });
    await catalog.saveProductButton().click();
    await expect(catalog.drawer()).toBeHidden({ timeout: 15_000 });
    await expect(page.getByText(productName).first()).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText("Solo este negocio", { exact: true }).first()).toBeVisible();
  });

  test("HP-MED-01: copy disco sin Cloudinary", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.provider.email, credentials.provider.password);
    await expect(page).toHaveURL(/\/proveedor/, { timeout: 15_000 });

    const catalog = new ProviderCatalogPage(page);
    await catalog.goto();
    await catalog.openAddProduct();
    await expect(page.getByText(/jpeg|png|webp/i).first()).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(/cloudinary/i)).toHaveCount(0);
  });

  test("HP-MED-02: copy máx 20MB en logo, portada y producto", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.provider.email, credentials.provider.password);
    await expect(page).toHaveURL(/\/proveedor/, { timeout: 15_000 });

    const catalog = new ProviderCatalogPage(page);
    await catalog.goto();
    await expect(page.getByRole("heading", { name: /imagen del negocio/i })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText(/máx\s*20\s*MB/i).first()).toBeVisible();
    await expect(page.getByText(/máx\s*5\s*MB/i)).toHaveCount(0);

    await catalog.openAddProduct();
    await expect(catalog.drawer().getByText(/máx\s*20\s*MB/i)).toBeVisible();
  });
});
