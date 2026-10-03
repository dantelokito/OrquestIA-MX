import { test, expect } from "@playwright/test";
import { credentials } from "../../fixtures/auth";
import { LoginPage } from "./pages/LoginPage";
import { InventoryPage } from "./pages/InventoryPage";
import { ProviderCatalogPage } from "./pages/ProviderCatalogPage";
import { PosPage } from "./pages/PosPage";
import { FruteriaPage } from "./pages/FruteriaPage";

test.describe("E2E F12 — inventario, catálogo, POS toggle, vitrina", () => {
  test("TC-F12-101: SubNav Inventario primero y etiqueta Ventas", async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(credentials.provider.email, credentials.provider.password);
    await expect(page).toHaveURL(/\/proveedor/);
    const nav = page.getByRole("navigation").filter({ has: page.getByRole("link", { name: /inventario/i }) });
    await expect(nav.getByRole("link", { name: /^inventario$/i })).toBeVisible();
    const hrefs = await nav.getByRole("link").evaluateAll((els) =>
      els.map((el) => ({
        text: (el.textContent ?? "").trim().toLowerCase(),
        href: (el as HTMLAnchorElement).getAttribute("href") ?? "",
      }))
    );
    const inv = hrefs.find((h) => h.text.includes("inventario"));
    expect(inv?.href).toMatch(/\/proveedor\/inventario/);
    const firstMeaningful = hrefs.find((h) =>
      /inventario|catálogo|catalogo|pos|órdenes|ordenes|ventas|dashboard|reportes/.test(h.text)
    );
    expect(firstMeaningful?.text).toMatch(/inventario/);
    await expect(nav.getByRole("link", { name: /^ventas$/i })).toBeVisible();
    await expect(nav.getByRole("link", { name: /^dashboard$/i })).toHaveCount(0);
    await nav.getByRole("link", { name: /^ventas$/i }).click();
    await expect(page).toHaveURL(/\/proveedor\/dashboard/);
  });

  test("TC-F12-102: módulo inventario 4 estados (success o empty, no spinner eterno)", async ({ page }) => {
    const login = new LoginPage(page);
    const inv = new InventoryPage(page);
    await login.goto();
    await login.login(credentials.provider.email, credentials.provider.password);
    await expect(page).toHaveURL(/\/proveedor/, { timeout: 15_000 });
    await inv.goto();
    await expect(page).toHaveURL(/\/proveedor\/inventario/);
    await expect(inv.heading()).toBeVisible({ timeout: 15_000 });
    const error = inv.retryButton();
    const empty = inv.emptyState();
    const bars = inv.capacityBars();
    const table = page.getByRole("table");
    await expect
      .poll(async () => {
        if (await error.count()) return "error";
        if (await empty.count()) return "empty";
        if ((await bars.count()) || (await table.count())) return "success";
        return "loading";
      }, { timeout: 15_000 })
      .not.toBe("loading");
  });

  test("TC-F12-103: lista CAT miniatura y barra; toggle fotos POS vive en POS (F14 US-CAT-21)", async ({ page }) => {
    const login = new LoginPage(page);
    const cat = new ProviderCatalogPage(page);
    const pos = new PosPage(page);
    await login.goto();
    await login.login(credentials.provider.email, credentials.provider.password);
    await expect(page).toHaveURL(/\/proveedor/, { timeout: 15_000 });
    await cat.goto();
    await expect(page).toHaveURL(/\/proveedor$/);
    const thumbs = page.locator("img").or(page.getByRole("img"));
    await expect(thumbs.first()).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole("switch", { name: /mostrar fotos en el pos/i })).toHaveCount(0);
    await pos.goto();
    await expect(page).toHaveURL(/\/proveedor\/pos/);
    await expect(page.getByRole("switch", { name: /mostrar fotos en el pos/i })).toBeVisible({
      timeout: 15_000,
    });
  });

  test("TC-F12-104: /fruteria sin barra ni existencias", async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(credentials.provider.email, credentials.provider.password);
    await expect(page).toHaveURL(/\/proveedor/, { timeout: 15_000 });
    const me = await page.evaluate(async () => {
      const res = await fetch("/api/provider/me", { credentials: "include" });
      return { status: res.status, body: await res.json() };
    });
    expect(me.status).toBe(200);
    const id = me.body.data.id as string;
    const fruteria = new FruteriaPage(page);
    await page.context().clearCookies();
    await fruteria.goto(id);
    await expect(page).toHaveURL(new RegExp(`/fruteria/${id}`));
    await expect(page.getByRole("progressbar")).toHaveCount(0);
    await expect(page.getByText(/on-hand|poca existencia|reservad/i)).toHaveCount(0);
  });

  test("TC-F12-105: POS no muestra candado por stock", async ({ page }) => {
    const login = new LoginPage(page);
    const pos = new PosPage(page);
    await login.goto();
    await login.login(credentials.provider.email, credentials.provider.password);
    await pos.goto();
    await expect(page.getByText(/agotado por existencias|sin stock|stock insuficiente/i)).toHaveCount(0);
  });
});
