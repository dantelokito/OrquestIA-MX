import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";
import { AdminAnalyticsPage } from "./pages/AdminAnalyticsPage";
import { DashboardPage } from "./pages/DashboardPage";
import { credentials } from "../../fixtures/auth";

test.describe("E2E ADMIN ANALYTICS — HP-ADMIN-01", () => {
  test("HP-ADMIN-01: analítica plataforma con rangos y distinta de dashboard proveedor", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.admin.email, credentials.admin.password);
    await expect(page).toHaveURL(/\/admin/);

    const analytics = new AdminAnalyticsPage(page);
    await analytics.goto();
    await expect(analytics.heading()).toBeVisible({ timeout: 15_000 });
    await expect(analytics.periodTab("Hoy")).toBeVisible();
    await expect(analytics.periodTab("7 días")).toBeVisible();
    await expect(analytics.periodTab("30 días")).toBeVisible();

    await analytics.periodTab("Hoy").click();
    await expect(
      page.getByRole("paragraph").filter({ hasText: /^GMV$/ }).or(analytics.emptyState())
    ).toBeVisible({ timeout: 15_000 });

    await page.goto("/proveedor/dashboard");
    await expect(page).not.toHaveURL(/\/admin\/analytics/);
  });

  test("HP-ADMIN-01: CLIENT no entra a analytics", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.client.email, credentials.client.password);
    await page.goto("/admin/analytics");
    await expect(page).not.toHaveURL(/\/admin\/analytics/);
  });
});

test.describe("E2E DASH vs ADMIN", () => {
  test("dashboard proveedor sigue en /proveedor/dashboard", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.provider.email, credentials.provider.password);
    await expect(page).toHaveURL(/\/proveedor/, { timeout: 15_000 });
    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    await expect(page).toHaveURL(/\/proveedor\/dashboard/);
  });
});
