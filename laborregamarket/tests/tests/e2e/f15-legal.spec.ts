import { test, expect } from "../../fixtures/suite";
import { LoginPage } from "./pages/LoginPage";
import { credentials, uniqueEmail } from "../../fixtures/auth";

const SEED_MARKERS: Record<string, RegExp> = {
  "/legal/privacidad": /No recabamos datos patrimoniales/,
  "/legal/terminos": /LaBorregaMarket no vende productos/,
  "/legal/cookies": /Umami no usa cookies/,
};

test.describe("E2E F15 — legal, cookies, footer y logout", () => {
  test("TC-LEGAL-001: footer legal en / y /login", async ({ page }) => {
    for (const path of ["/", "/login"]) {
      await page.goto(path);
      const footer = page.getByRole("contentinfo");
      await expect(footer.getByRole("link", { name: "Aviso de Privacidad" })).toHaveAttribute(
        "href",
        "/legal/privacidad"
      );
      await expect(footer.getByRole("link", { name: "Términos y Condiciones" })).toHaveAttribute(
        "href",
        "/legal/terminos"
      );
      await expect(footer.getByRole("link", { name: "Política de Cookies" })).toHaveAttribute(
        "href",
        "/legal/cookies"
      );
      await expect(footer.getByRole("link", { name: "Preferencias de medición" })).toBeVisible();
      await expect(
        footer.getByText(/Responsable de tus datos|Datos del responsable en actualización/)
      ).toBeVisible();
    }
  });

  test("TC-LEGAL-002: /legal/* público con el markdown del seed", async ({ page }) => {
    for (const [path, marker] of Object.entries(SEED_MARKERS)) {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      expect(new URL(page.url()).pathname).toBe(path);
      await expect(
        page.locator("#legal-document:visible").getByText("BORRADOR — sujeto a revisión legal.")
      ).toBeVisible();
      await expect(page.locator("main").getByText(/Versión \d+/).first()).toBeVisible();
      await expect(page.locator("#legal-document:visible").getByText(marker)).toBeVisible();
    }
  });

  test("TC-LEGAL-005: slug desconocido → 404", async ({ page }) => {
    const response = await page.goto("/legal/otra-cosa");
    expect(response?.status()).toBe(404);
    expect(page.url()).not.toContain("/login");
  });

  test("TC-LEGAL-010: el footer público no está en el panel", async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(credentials.provider.email, credentials.provider.password);
    await expect(page).toHaveURL(/\/proveedor/);
    await expect(page.getByText("Intermediario entre clientes y fruterías")).toHaveCount(0);
  });

  test("TC-CONSENT-010: registro sin casilla muestra el error y con ella entra", async ({ page }) => {
    const current = page.waitForResponse(
      (response) => response.url().includes("/api/legal/current") && response.ok()
    );
    await page.goto("/registro");
    await current;
    const checkbox = page.getByRole("checkbox", { name: /Acepto los Términos/i });
    await expect(checkbox).toBeVisible();
    await expect(checkbox).not.toBeChecked();

    const email = uniqueEmail("ui");
    await page.getByLabel("Nombre").fill("QA Registro F15");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Contraseña").fill("Test1234!");
    await page.getByRole("button", { name: "Crear cuenta" }).click();
    await expect(page.getByText("Debes aceptar los Términos para continuar")).toBeVisible();
    expect(new URL(page.url()).pathname).toBe("/registro");

    await checkbox.check();
    await page.getByRole("button", { name: "Crear cuenta" }).click();
    await expect(page).toHaveURL(/\/explorar/, { timeout: 20_000 });
  });

  test("TC-COOKIE-001: Entendido guarda lbm_measurement=on", async ({ page }) => {
    await page.goto("/");
    const notice = page.getByRole("region", { name: "Aviso de cookies y medición" });
    await expect(notice).toBeVisible();
    await expect(notice.getByRole("link", { name: "Política de Cookies" })).toHaveAttribute(
      "href",
      "/legal/cookies"
    );
    await notice.getByRole("button", { name: "Entendido" }).click();
    await expect(notice).toBeHidden();
    await expect
      .poll(() => page.evaluate(() => localStorage.getItem("lbm_measurement")))
      .toBe("on");
    await page.reload();
    await expect(notice).toHaveCount(0);
  });

  test("TC-COOKIE-002: Desactivar medición guarda off y no carga Umami", async ({ page }) => {
    await page.goto("/");
    const notice = page.getByRole("region", { name: "Aviso de cookies y medición" });
    await notice.getByRole("button", { name: "Desactivar medición" }).click();
    await expect
      .poll(() => page.evaluate(() => localStorage.getItem("lbm_measurement")))
      .toBe("off");
    await page.reload();
    await expect(notice).toHaveCount(0);
    await expect(page.locator('script[src*="umami"], script[data-website-id]')).toHaveCount(0);
  });

  test("TC-COOKIE-003: valor distinto de on/off vuelve a mostrar el aviso", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("lbm_measurement", "quizas"));
    await page.goto("/");
    await expect(page.getByRole("region", { name: "Aviso de cookies y medición" })).toBeVisible();
  });

  test("TC-COOKIE-004: DNT no carga el script de Umami", async ({ page }) => {
    await page.setExtraHTTPHeaders({ DNT: "1" });
    await page.goto("/");
    await expect(page.locator('script[src*="umami"], script[data-website-id]')).toHaveCount(0);
  });

  test("TC-WA-002: avisos de pedidos nacen apagados", async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(credentials.provider.email, credentials.provider.password);
    await expect(page).toHaveURL(/\/proveedor/);
    await page.goto("/proveedor/perfil");
    const toggle = page.getByRole("switch", {
      name: /Recibir avisos de pedidos por WhatsApp/i,
    });
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute("aria-checked", "false");
  });

  test("TC-CACHE-006: logout no sirve HTML ni API de la sesión anterior", async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(credentials.client.email, credentials.client.password);
    const reconsent = page.getByRole("dialog", { name: "Actualizamos nuestros Términos" });
    if (await reconsent.isVisible().catch(() => false)) {
      await reconsent.getByRole("button", { name: "Cerrar sesión" }).click();
    } else {
      await page.getByRole("button", { name: "Menú de usuario" }).click();
      await expect(page.getByText(credentials.client.email)).toBeVisible();
      await page.getByRole("menuitem", { name: "Cerrar sesión" }).click();
    }
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByText(credentials.client.email)).toHaveCount(0);

    const session = await page.request.get("/api/auth/session");
    expect(session.status()).toBe(200);
    expect((await session.json()).data.authenticated).toBe(false);

    const me = await page.request.get("/api/users/me");
    expect(me.status()).toBe(401);
    expect(await me.text()).not.toContain(credentials.client.email);

    const home = await page.goto("/");
    expect(home?.status()).toBe(200);
    expect(home?.headers()["x-cache"]).toBeUndefined();
    expect(await page.content()).not.toContain(credentials.client.email);

    const leaked = await page.evaluate(async () => {
      if (!("caches" in window)) return null;
      const names = await caches.keys();
      for (const name of names) {
        const cache = await caches.open(name);
        for (const req of await cache.keys()) {
          const url = new URL(req.url);
          if (url.pathname.startsWith("/api/") && !url.pathname.startsWith("/api/media/")) {
            return url.pathname;
          }
          if (url.pathname === "/" || url.pathname.startsWith("/cuenta") || url.pathname.startsWith("/login") || url.pathname.startsWith("/proveedor")) {
            return url.pathname;
          }
        }
      }
      return null;
    });
    expect(leaked).toBeNull();
  });
});
