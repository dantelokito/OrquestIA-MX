import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { PosPage } from "./pages/PosPage";
import { credentials } from "../../fixtures/auth";

test.describe("E2E DASH — HP-DASH / EC-06", () => {
  test("HP-DASH-01: dashboard con KPIs tras venta", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.provider.email, credentials.provider.password);

    const posPage = new PosPage(page);
    await posPage.goto();
    const productBtn = page.getByRole("button").filter({ hasText: /manzana|plátano|naranja|fresa/i }).first();
    await expect(productBtn).toBeVisible({ timeout: 15_000 });
    await productBtn.click();
    await posPage.cobrarButton().click();
    await expect(page.getByText(/nueva venta/i)).toBeVisible({ timeout: 15_000 });

    const dashboardPage = new DashboardPage(page);
    await dashboardPage.goto();
    await expect(dashboardPage.kpiCards().first()).toBeVisible({ timeout: 15_000 });
    expect(await dashboardPage.kpiCards().count()).toBeGreaterThanOrEqual(3);
    await dashboardPage.chartTableSummary().click();
    await expect(page.getByRole("table")).toBeVisible();
  });

  test("EC-06: dashboard sin ventas muestra empty (nuevo proveedor)", async ({ page, request }) => {
    const email = `provider-dash-${Date.now()}@test.laborrega.mx`;
    await request.post("/api/auth/register", {
      data: {
        name: "Provider Dash QA",
        email,
        password: "Test1234!",
        role: "PROVIDER",
      },
    });
    await request.post("/api/providers", {
      data: {
        businessName: "Frutería Dash QA",
        address: "Calle Test 1",
        city: "Monterrey",
        latitude: 25.67,
        longitude: -100.31,
      },
    });

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(email, "Test1234!");
    await expect(page).toHaveURL(/\/proveedor/);

    const dashboardPage = new DashboardPage(page);
    await dashboardPage.goto();
    await expect(page.getByText(/todavía no hay ventas registradas/i)).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole("link", { name: /abrir pos/i })).toBeVisible();
  });
});
