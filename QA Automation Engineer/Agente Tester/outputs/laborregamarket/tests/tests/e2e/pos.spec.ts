import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";
import { PosPage } from "./pages/PosPage";
import { credentials } from "../../fixtures/auth";

test.describe("E2E POS — HP-POS / EC-04 / EC-05", () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.provider.email, credentials.provider.password);
    await expect(page).toHaveURL(/\/proveedor/);
  });

  test("HP-POS-01: venta mostrador con peso y venta rápida", async ({ page }) => {
    const posPage = new PosPage(page);
    await posPage.goto();

    const productBtn = page.getByRole("button").filter({ hasText: /manzana|plátano|naranja|fresa/i }).first();
    await expect(productBtn).toBeVisible({ timeout: 15_000 });
    await productBtn.click();

    await page.getByRole("button").filter({ hasText: /manzana|plátano|naranja|fresa/i }).first().click();
    await page.locator("#pos-qty").fill("1.250");
    await page.getByRole("button", { name: /^guardar$/i }).click();

    await posPage.quickSaleButton.click();
    await page.getByLabel("Producto").fill("Bolsa QA");
    await page.getByLabel("Precio unitario").fill("5");
    await page.getByRole("button", { name: /agregar al ticket/i }).click();

    await posPage.cobrarButton().click();
    await expect(page.getByText(/nueva venta/i)).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(/venta rápida/i).first()).toBeVisible();
    await expect(page.getByText(/1\.250/)).toBeVisible();
  });

  test("EC-04: buscador sin resultados ofrece venta rápida", async ({ page }) => {
    const posPage = new PosPage(page);
    await posPage.goto();
    await posPage.searchInput.fill("zzzzproductoqa999");
    await expect(page.getByRole("button", { name: /\+ venta rápida/i })).toBeVisible({
      timeout: 10_000,
    });
  });

  test("EC-05: cantidad inválida en POS bloquea cobro", async ({ page }) => {
    const posPage = new PosPage(page);
    await posPage.goto();

    const productBtn = page.getByRole("button").filter({ hasText: /manzana|plátano|naranja|fresa/i }).first();
    await productBtn.click();
    await page.getByRole("button").filter({ hasText: /manzana|plátano|naranja|fresa/i }).first().click();
    await page.locator("#pos-qty").fill("0");
    await page.getByRole("button", { name: /^guardar$/i }).click();
    await expect(page.getByText(/cantidad inválida/i)).toBeVisible();
    await page.getByRole("button", { name: /^quitar$/i }).click();
    await expect(posPage.cobrarButton()).toBeDisabled();
  });
});
