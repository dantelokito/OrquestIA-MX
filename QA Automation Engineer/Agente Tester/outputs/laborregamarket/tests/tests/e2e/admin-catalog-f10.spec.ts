import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";
import { AdminPage } from "./pages/AdminPage";
import { credentials } from "../../fixtures/auth";
import { f10Suffix } from "../../fixtures/f10";

test.describe("E2E ADMIN F10 — TC-ADM-030/031 / TC-SEC-009", () => {
  test("TC-SEC-009: cuentas demo visibles en development", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await expect(page.getByText(/cuentas demo/i)).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(credentials.admin.email)).toBeVisible();
  });

  test("TC-ADM-030: Catálogos CRUD global", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.admin.email, credentials.admin.password);
    await expect(page).toHaveURL(/\/admin/, { timeout: 15_000 });

    const admin = new AdminPage(page);
    await admin.goto();
    await admin.catalogsTab().click();
    await admin.productsCatalogCard().click();
    await expect(admin.globalHeading()).toBeVisible({ timeout: 15_000 });
    await admin.newProductButton().click();
    const name = `QA UI Global ${f10Suffix()}`;
    await admin.productNameInput().fill(name);
    await admin.saveButton().click();
    await expect(page.getByText(name)).toBeVisible({ timeout: 15_000 });
  });

  test("TC-ADM-031: tabla Proveedores con 4 flags", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.admin.email, credentials.admin.password);
    await expect(page).toHaveURL(/\/admin/, { timeout: 15_000 });

    const admin = new AdminPage(page);
    await admin.goto();
    await admin.providersTab().click();
    await expect(admin.verifiedColumn()).toBeVisible({ timeout: 15_000 });
    await expect(admin.activeColumn()).toBeVisible();
    await expect(admin.wholesaleColumn()).toBeVisible();
    await expect(admin.deliveryColumn()).toBeVisible();
  });

  test("HP-MED-02: copy máx 20MB en formulario producto GLOBAL", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.admin.email, credentials.admin.password);
    await expect(page).toHaveURL(/\/admin/, { timeout: 15_000 });

    const admin = new AdminPage(page);
    await admin.goto();
    await admin.catalogsTab().click();
    await admin.productsCatalogCard().click();
    await expect(admin.globalHeading()).toBeVisible({ timeout: 15_000 });
    await admin.newProductButton().click();
    await expect(page.getByText(/máx\s*20\s*MB/i).first()).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(/máx\s*5\s*MB/i)).toHaveCount(0);
  });
});
