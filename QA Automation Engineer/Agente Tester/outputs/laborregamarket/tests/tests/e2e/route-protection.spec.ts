import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";
import { credentials } from "../../fixtures/auth";

test.describe("E2E RBAC — TC-RBAC UI", () => {
  test("TC-RBAC-001: sin sesión /admin redirige a login", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login/);
    expect(page.url()).toContain("redirect=");
  });

  test("TC-RBAC-004: rutas públicas accesibles sin sesión", async ({ page }) => {
    for (const path of ["/", "/login", "/registro", "/explorar"]) {
      await page.goto(path);
      await expect(page).not.toHaveURL(/\/login/);
    }
  });

  test("TC-RBAC-005: CLIENT no accede /admin", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.client.email, credentials.client.password);
    await page.goto("/admin");
    await expect(page).toHaveURL(/^\/$|\/$/);
  });

  test("TC-RBAC-003: sin sesión /cuenta redirige a login", async ({ page }) => {
    await page.goto("/cuenta");
    await expect(page).toHaveURL(/\/login/);
  });
});
