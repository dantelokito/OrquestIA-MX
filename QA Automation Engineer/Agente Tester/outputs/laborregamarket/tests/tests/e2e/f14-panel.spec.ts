import { test, expect } from "@playwright/test";
import { credentials } from "../../fixtures/auth";
import { LoginPage } from "./pages/LoginPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ProviderCatalogPage } from "./pages/ProviderCatalogPage";
import { PosPage } from "./pages/PosPage";
import { InventoryPage } from "./pages/InventoryPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ProviderF11Page } from "./pages/ProviderF11Page";

test.describe("E2E F14 — perfil, catálogo, POS, merma, reportes", () => {
  test("TC-F14-101: Perfil último, 5 bloques, GET me único, Catálogo sin identidad", async ({
    page,
  }) => {
    const login = new LoginPage(page);
    const profile = new ProfilePage(page);
    const cat = new ProviderCatalogPage(page);
    let meGets = 0;
    page.on("request", (req) => {
      if (req.method() === "GET" && /\/api\/provider\/me(?:\?|$)/.test(req.url())) meGets += 1;
    });
    await login.goto("/proveedor/perfil");
    await login.login(credentials.provider.email, credentials.provider.password);
    await expect(page).toHaveURL(/\/proveedor\/perfil/, { timeout: 20_000 });

    const nav = page.getByRole("navigation").filter({ has: page.getByRole("link", { name: /inventario/i }) });
    const hrefs = await nav.getByRole("link").evaluateAll((els) =>
      els.map((el) => ({
        text: (el.textContent ?? "").trim().toLowerCase(),
        href: (el as HTMLAnchorElement).getAttribute("href") ?? "",
      }))
    );
    const last = hrefs[hrefs.length - 1];
    expect(last?.text).toMatch(/perfil/);
    expect(last?.href).toMatch(/\/proveedor\/perfil/);

    await expect(profile.heading()).toBeVisible({ timeout: 20_000 });
    await expect(profile.identityHeading()).toBeVisible();
    await expect(profile.googleHeading()).toBeVisible();
    await expect(profile.businessHeading()).toBeVisible();
    await expect(profile.hoursHeading()).toBeVisible();
    await expect(profile.capabilitiesHeading()).toBeVisible();
    await expect.poll(() => meGets, { timeout: 10_000 }).toBeGreaterThanOrEqual(1);
    const afterVisible = meGets;
    await page.waitForTimeout(800);
    expect(meGets, "no debe seguir pidiendo /me en bucle").toBe(afterVisible);
    expect(afterVisible, "D-F14-19: un GET me (2 si Strict Mode en next dev)").toBeLessThanOrEqual(2);

    await cat.goto();
    await expect(page.getByRole("heading", { name: /identidad visual/i })).toHaveCount(0);
    await expect(page.getByRole("heading", { name: /google maps/i })).toHaveCount(0);
    await expect(page.getByRole("heading", { name: /datos del negocio/i })).toHaveCount(0);
    await expect(page.getByRole("heading", { name: /^horarios$/i })).toHaveCount(0);
    await expect(page.getByText(/eliminados de la vista/i)).toBeVisible({ timeout: 20_000 });
  });

  test("TC-F14-102: posShowImages en POS, no en Catálogo", async ({ page }) => {
    const login = new LoginPage(page);
    const cat = new ProviderCatalogPage(page);
    const pos = new PosPage(page);
    await login.goto();
    await login.login(credentials.provider.email, credentials.provider.password);
    await expect(page).toHaveURL(/\/proveedor/, { timeout: 20_000 });
    await cat.goto();
    await expect(page.getByRole("switch", { name: /mostrar fotos en el pos/i })).toHaveCount(0);
    await pos.goto();
    await expect(page.getByRole("switch", { name: /mostrar fotos en el pos/i })).toBeVisible({
      timeout: 15_000,
    });
  });

  test("TC-F14-103: Inventario merma/ajuste y Movimientos sin ventas", async ({ page }) => {
    const login = new LoginPage(page);
    const inv = new InventoryPage(page);
    await login.goto();
    await login.login(credentials.provider.email, credentials.provider.password);
    await expect(page).toHaveURL(/\/proveedor/, { timeout: 20_000 });
    await inv.goto();
    await expect(inv.heading()).toBeVisible({ timeout: 20_000 });
    await expect(inv.movimientosTab()).toBeVisible();
    await expect(inv.registrarMerma()).toBeVisible({ timeout: 15_000 });
    await expect(inv.ajusteConteo()).toBeVisible();
    await inv.gotoMovements();
    await expect(inv.movimientosCopy()).toBeVisible({ timeout: 20_000 });
    await expect(page.getByText(/kardex/i)).toHaveCount(0);
  });

  test("TC-F14-104: Reportes series unificadas, PDF visible, sin grain UI", async ({ page }) => {
    const login = new LoginPage(page);
    const dash = new DashboardPage(page);
    await login.goto();
    await login.login(credentials.provider.email, credentials.provider.password);
    await expect(page).toHaveURL(/\/proveedor/, { timeout: 20_000 });
    await dash.gotoReports();
    await expect(dash.reportsHeading()).toBeVisible({ timeout: 20_000 });
    await expect(dash.pdfButton()).toBeVisible();
    await expect(dash.grainDay()).toHaveCount(0);
    await expect(dash.grainMonth()).toHaveCount(0);
    await expect(dash.grainYear()).toHaveCount(0);
    await expect(page.getByRole("img").or(page.getByText(/sin ventas en este corte/i)).first()).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText(/ver datos en tabla/i).first()).toBeVisible();

    await page.goto("/proveedor/reportes-generales");
    await expect(page).toHaveURL(/reportes-generales/);
    await expect(
      page.getByRole("heading", { name: /tendencia|mix|top|reportes generales/i }).first()
    ).toBeVisible({ timeout: 20_000 });
  });

  test("TC-F14-105: N=1 reportes-generales 403 redirige a dashboard sucursal", async ({ page }) => {
    const login = new LoginPage(page);
    const panel = new ProviderF11Page(page);
    const dash = new DashboardPage(page);
    await login.goto();
    await login.login(credentials.providerN1.email, credentials.providerN1.password);
    await expect(page).toHaveURL(/\/proveedor/, { timeout: 20_000 });
    await panel.gotoGlobalReports();
    await expect(page).toHaveURL(/view=reportes|\/proveedor\/dashboard/, { timeout: 20_000 });
    await expect(dash.reportsHeading()).toBeVisible({ timeout: 15_000 });
  });

  test("TC-F14-106: no se borra sección con productos (copy visible / 409)", async ({ page }) => {
    const login = new LoginPage(page);
    const cat = new ProviderCatalogPage(page);
    await login.goto();
    await login.login(credentials.provider.email, credentials.provider.password);
    await expect(page).toHaveURL(/\/proveedor/, { timeout: 20_000 });
    await cat.goto();
    const blocked = page.locator('button[title*="Mueve los productos"]');
    const alert = page.getByRole("alert").filter({ hasText: /productos|muévelos|muevelos/i });
    await expect.poll(async () => {
      if ((await blocked.count()) > 0) return "title";
      if ((await alert.count()) > 0) return "alert";
      return "none";
    }, { timeout: 20_000 }).not.toBe("none");
  });
});
