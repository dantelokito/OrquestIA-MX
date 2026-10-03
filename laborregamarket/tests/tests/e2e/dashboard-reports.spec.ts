import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { credentials } from "../../fixtures/auth";

test.describe("E2E REPORTS F10 — HP-DASH-07/08/09", () => {
  test("HP-DASH-08: tab Reportes, atajo mes y rango", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.provider.email, credentials.provider.password);
    await expect(page).not.toHaveURL(/\/login/, { timeout: 15_000 });

    const dashboardPage = new DashboardPage(page);
    await dashboardPage.gotoReports();
    await expect(page).toHaveURL(/view=reportes/);
    await expect(dashboardPage.reportsHeading()).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(/TZ America\/Monterrey/i)).toBeVisible();
    await expect(dashboardPage.monthShortcut()).toBeVisible();
    await expect(dashboardPage.fromInput()).toBeVisible();
    await expect(dashboardPage.toInput()).toBeVisible();
    await expect(dashboardPage.grainDay()).toHaveCount(0);
    await expect(dashboardPage.grainYear()).toHaveCount(0);
  });

  test("HP-DASH-07: checklist, tabla y empty o KPIs", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.provider.email, credentials.provider.password);
    await expect(page).not.toHaveURL(/\/login/, { timeout: 15_000 });

    const dashboardPage = new DashboardPage(page);
    await dashboardPage.gotoReports("2020-01-01", "2020-01-02");
    await expect(dashboardPage.reportsHeading()).toBeVisible({ timeout: 15_000 });
    await expect(dashboardPage.productChecklist()).toBeVisible();
    await expect(dashboardPage.noneMeansAll()).toBeVisible();
    await expect(page.getByText(/GMV/i).first()).toBeVisible({ timeout: 15_000 });
    await expect(dashboardPage.salesByProduct()).toBeVisible();
    await expect(page.getByText(/sin ventas en este corte/i).first()).toBeVisible();
  });

  test("HP-DASH-09: Imprimir visible; PDF chrome oculto", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.provider.email, credentials.provider.password);
    await expect(page).not.toHaveURL(/\/login/, { timeout: 15_000 });

    const dashboardPage = new DashboardPage(page);
    await dashboardPage.gotoReports();
    await expect(dashboardPage.printButton()).toBeVisible({ timeout: 15_000 });
    await expect(dashboardPage.printRoot()).toBeVisible();
    await expect(dashboardPage.pdfButton()).toHaveCount(0);
  });
});
