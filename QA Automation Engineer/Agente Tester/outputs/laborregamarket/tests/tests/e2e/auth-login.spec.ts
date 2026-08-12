import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";
import { credentials } from "../../fixtures/auth";

test.describe("E2E AUTH — TC-AUTH UI", () => {
  test("TC-AUTH-001 UI: login CLIENT redirige a /cuenta", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.client.email, credentials.client.password);
    await expect(page).toHaveURL(/\/cuenta/);
  });

  test("TC-AUTH-002 UI: login PROVIDER redirige a /proveedor", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.provider.email, credentials.provider.password);
    await expect(page).toHaveURL(/\/proveedor/);
  });

  test("TC-AUTH-003 UI: login ADMIN redirige a /admin", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.admin.email, credentials.admin.password);
    await expect(page).toHaveURL(/\/admin/);
  });

  test("TC-AUTH-004 UI: credenciales inválidas muestra error", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.client.email, "WrongPass1!");
    await expect(page.getByText(/credenciales inválidas/i)).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test("TC-AUTH-015 UI: redirect param válido para CLIENT", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto("/explorar");
    await loginPage.login(credentials.client.email, credentials.client.password);
    await expect(page).toHaveURL(/\/explorar/);
  });
});
