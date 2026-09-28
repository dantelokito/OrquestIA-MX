import { test, expect } from "@playwright/test";
import { credentials } from "../../fixtures/auth";
import { LoginPage } from "./pages/LoginPage";
import { AdminPage } from "./pages/AdminPage";
import { ProviderCatalogPage } from "./pages/ProviderCatalogPage";
import { DashboardPage } from "./pages/DashboardPage";

test.describe("E2E F13 — admin catálogo, bandeja, reportes inventario", () => {
  test("TC-F13-101: admin ve origen GLOBAL/LOCAL e Inhabilitar (no Eliminar SQL)", async ({
    page,
  }) => {
    const login = new LoginPage(page);
    const admin = new AdminPage(page);
    await login.goto();
    await login.login(credentials.admin.email, credentials.admin.password);
    await expect(page).toHaveURL(/\/admin/, { timeout: 20_000 });
    await admin.goto();
    await admin.catalogsTab().click();
    await admin.productsCatalogCard().click();
    await expect(page.getByText(/^origen$/i).or(page.getByRole("columnheader", { name: /origen/i }))).toBeVisible({
      timeout: 20_000,
    });
    await expect(page.getByRole("button", { name: /inhabilitar|reactivar/i }).first()).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByRole("button", { name: /^eliminar$/i })).toHaveCount(0);
  });

  test("TC-F13-102: catálogo proveedor muestra bandeja Eliminados de la vista", async ({ page }) => {
    const login = new LoginPage(page);
    const cat = new ProviderCatalogPage(page);
    await login.goto();
    await login.login(credentials.provider.email, credentials.provider.password);
    await expect(page).toHaveURL(/\/proveedor/, { timeout: 20_000 });
    await cat.goto();
    await expect(page.getByText(/eliminados de la vista/i)).toBeVisible({ timeout: 20_000 });
  });

  test("TC-F13-103: reportes sucursal tab Inventario", async ({ page }) => {
    const login = new LoginPage(page);
    const dash = new DashboardPage(page);
    await login.goto();
    await login.login(credentials.provider.email, credentials.provider.password);
    await expect(page).toHaveURL(/\/proveedor/, { timeout: 20_000 });
    await dash.gotoReports();
    await expect(page.getByRole("tab", { name: /^inventario$/i })).toBeVisible({ timeout: 20_000 });
    await page.getByRole("tab", { name: /^inventario$/i }).click();
    await expect(
      page.getByRole("heading", { name: /inventario actual/i }).or(page.getByText(/inventario actual/i))
    ).toBeVisible({ timeout: 15_000 });
  });

  test("TC-F13-104: reportes generales N>1 bloque inventario actual", async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(credentials.provider.email, credentials.provider.password);
    await expect(page).toHaveURL(/\/proveedor/, { timeout: 20_000 });
    await page.goto("/proveedor/reportes-generales");
    await expect(page).toHaveURL(/reportes-generales/);
    const invTab = page.getByRole("tab", { name: /^inventario$/i });
    if (await invTab.count()) {
      await invTab.click();
    }
    await expect(page.getByText(/inventario actual/i).first()).toBeVisible({ timeout: 20_000 });
  });
});
