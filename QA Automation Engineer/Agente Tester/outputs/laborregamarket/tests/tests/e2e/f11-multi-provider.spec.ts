import { test, expect } from "@playwright/test";
import { credentials } from "../../fixtures/auth";
import { LoginPage } from "./pages/LoginPage";
import { ExplorePage } from "./pages/ExplorePage";
import { ProviderF11Page } from "./pages/ProviderF11Page";
import { DashboardPage } from "./pages/DashboardPage";

test.describe("E2E F11 — switcher, módulo global, N=1, explorar, admin, onboarding", () => {
  test("TC-F11-101: El Paraíso ve switcher y Reportes generales", async ({ page }) => {
    const login = new LoginPage(page);
    const panel = new ProviderF11Page(page);
    await login.goto();
    await expect(page.getByText("verduras@campoverde.mx")).toBeVisible();
    await login.login(credentials.provider.email, credentials.provider.password);
    await expect(page).toHaveURL(/\/proveedor/);
    const mine = await page.evaluate(async () => {
      const res = await fetch("/api/provider/mine", { credentials: "include" });
      return { status: res.status, body: await res.json() };
    });
    expect(mine.status, JSON.stringify(mine.body)).toBe(200);
    expect(mine.body.data.providerCount).toBeGreaterThanOrEqual(2);
    await expect(panel.switcher()).toBeVisible();
    await expect(panel.globalReportsNav()).toBeVisible();

    await panel.openSwitcher();
    await expect(page.getByRole("option", { name: /Frutas El Paraíso/i })).toBeVisible();
    await expect(page.getByRole("option", { name: /Paraíso Tecnológico/i })).toBeVisible();

    await panel.gotoGlobalReports();
    await expect(page).toHaveURL(/\/proveedor\/reportes-generales/);
    await expect(page.getByText(/ventas por sucursal|sin ventas consolidadas|todas las sucursales/i)).toBeVisible({
      timeout: 15_000,
    });
  });

  test("TC-F11-102: Campo Verde sin switcher ni módulo global; deep-link a F10", async ({ page }) => {
    const login = new LoginPage(page);
    const panel = new ProviderF11Page(page);
    const dash = new DashboardPage(page);
    await login.goto();
    await login.login(credentials.providerN1.email, credentials.providerN1.password);
    await expect(page).toHaveURL(/\/proveedor/);
    await expect(panel.switcher()).toHaveCount(0);
    await expect(panel.globalReportsNav()).toHaveCount(0);

    await panel.gotoGlobalReports();
    await expect(page).toHaveURL(/view=reportes|\/proveedor\/dashboard/);
    await expect(dash.reportsHeading()).toBeVisible({ timeout: 15_000 });
  });

  test("TC-F11-103: Explorar dos cards El Paraíso", async ({ page }) => {
    const explore = new ExplorePage(page);
    await explore.gotoGeo(25.6714, -100.3089, 25);
    await explore.waitForProvidersLoaded();
    await expect(page).toHaveURL(/lat=25\.6714/);
    await expect(page).toHaveURL(/lng=-100\.3089/);
    await expect(page.getByRole("button", { name: /^san nicolás$/i })).toHaveCount(0);
    const search = page.getByRole("combobox", { name: /buscar fruterías/i }).or(explore.searchInput);
    await search.fill("Paraíso");
    await page.keyboard.press("Enter");
    await explore.waitForProvidersLoaded();
    await expect(page.getByText(/Frutas El Paraíso/i).first()).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(/El Paraíso Tecnológico/i).first()).toBeVisible();
    const hrefs = await page.locator("a[href^='/fruteria/']").evaluateAll((els) =>
      els.map((el) => (el as HTMLAnchorElement).getAttribute("href"))
    );
    const unique = new Set(hrefs.filter(Boolean));
    expect(unique.size).toBeGreaterThanOrEqual(2);
  });

  test("TC-F11-104: Admin tab Proveedores muestra sucursales distintas", async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(credentials.admin.email, credentials.admin.password);
    await expect(page).toHaveURL(/\/admin/);
    await page.locator("div.mb-6.flex.gap-2").getByRole("button", { name: /^proveedores$/i }).click();
    const table = page.locator("table");
    await expect(table).toBeVisible({ timeout: 15_000 });
    await expect(table.getByText(/Paraíso|Campo Verde/i).first()).toBeVisible();
  });

  test("TC-F11-105: /registro/negocio con sesión PROVIDER dice Nueva frutería", async ({ page }) => {
    const login = new LoginPage(page);
    const panel = new ProviderF11Page(page);
    await login.goto();
    await login.login(credentials.provider.email, credentials.provider.password);
    await expect(page).toHaveURL(/\/proveedor/);
    await panel.gotoOnboarding();
    await expect(page.getByRole("heading", { name: /nueva frutería/i })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(/crea tu cuenta/i)).toHaveCount(0);
  });
});
