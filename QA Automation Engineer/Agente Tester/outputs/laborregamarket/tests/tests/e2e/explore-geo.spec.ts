import { test, expect } from "@playwright/test";
import { ExplorePage } from "./pages/ExplorePage";
import { LoginPage } from "./pages/LoginPage";
import { credentials } from "../../fixtures/auth";
import { MONTERREY_FAR_PIN, MONTERREY_PIN } from "../../fixtures/geo";

test.describe("E2E EXPLORE GEO — HP-GEO", () => {
  test("HP-GEO-01: radio, lista y slider en explorar", async ({ page }) => {
    const explorePage = new ExplorePage(page);
    await explorePage.gotoGeo(MONTERREY_PIN.lat, MONTERREY_PIN.lng, 10);
    await explorePage.waitForProvidersLoaded();

    await expect(explorePage.useMyLocationButton).toBeVisible();
    await expect(explorePage.radiusSlider).toBeVisible();
    await expect(explorePage.radiusSlider).toHaveAttribute("min", "0.5");
    await expect(explorePage.radiusSlider).toHaveAttribute("max", "10");
    await expect(explorePage.providerCards.first()).toBeVisible({ timeout: 15_000 });
  });

  test("HP-GEO-01 empty: radio lejos muestra Ampliar radio", async ({ page }) => {
    const explorePage = new ExplorePage(page);
    await explorePage.gotoGeo(MONTERREY_FAR_PIN.lat, MONTERREY_FAR_PIN.lng, 1);
    await explorePage.waitForProvidersLoaded();

    await expect(explorePage.emptyRadio()).toBeVisible({ timeout: 15_000 });
    await expect(explorePage.enlargeRadiusButton()).toBeVisible();
  });

  test("HP-GEO-03: invitado Guardar dirección → login", async ({ page }) => {
    const explorePage = new ExplorePage(page);
    await explorePage.gotoGeo(MONTERREY_PIN.lat, MONTERREY_PIN.lng, 10);
    await explorePage.waitForProvidersLoaded();
    await explorePage.openLocationPanel();
    await explorePage.saveAddressButton.click();
    await expect(page).toHaveURL(/\/login/);
    expect(page.url()).toMatch(/redirect=/);
  });

  test("HP-GEO-19: CLIENT guarda favorita con diálogo in-app", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.client.email, credentials.client.password);
    await expect(page).not.toHaveURL(/\/login/, { timeout: 15_000 });

    const explorePage = new ExplorePage(page);
    await explorePage.gotoGeo(MONTERREY_PIN.lat, MONTERREY_PIN.lng, 10);
    await explorePage.waitForProvidersLoaded();
    await explorePage.openLocationPanel();
    await explorePage.saveAddressButton.click();
    await expect(explorePage.saveDialog()).toBeVisible({ timeout: 10_000 });
    await explorePage.saveDialog().getByPlaceholder(/casa, trabajo/i).fill("Casa QA F8");
    await explorePage.saveDialog().getByRole("button", { name: /^guardar$/i }).click();
    await expect(explorePage.saveDialog()).toHaveCount(0, { timeout: 10_000 });
    await explorePage.openLocationPanel();
    await expect(explorePage.locationPanel()).toContainText(/casa qa f8/i);
  });
});

test.describe("E2E EXPLORE GEO F5 — HP-GEO-04 / HP-GEO-05", () => {
  test("HP-GEO-04: Leaflet sin Google key, attribution, no empty F4", async ({ page }) => {
    const explorePage = new ExplorePage(page);
    await explorePage.gotoGeo(MONTERREY_PIN.lat, MONTERREY_PIN.lng, 10);
    await explorePage.waitForProvidersLoaded();

    await expect(explorePage.leafletMap).toBeVisible({ timeout: 15_000 });
    await expect(explorePage.osmAttribution.first()).toBeVisible({ timeout: 10_000 });
    await expect(explorePage.mapUnavailable).toHaveCount(0);
    await expect(explorePage.providerCards.first()).toBeVisible({ timeout: 15_000 });
  });

  test("HP-GEO-05: CTA en banner y slider al pie del mapa", async ({ page }) => {
    const explorePage = new ExplorePage(page);
    await explorePage.gotoGeo(MONTERREY_PIN.lat, MONTERREY_PIN.lng, 10);
    await explorePage.waitForProvidersLoaded();

    await expect(explorePage.useMyLocationButton).toBeVisible();
    expect(await explorePage.locationCtaInsideLeaflet()).toBe(false);
    await expect(explorePage.radiusSlider).toBeVisible();
    await expect(explorePage.radiusSlider).toHaveAttribute("min", "0.5");
    await expect(explorePage.radiusSlider).toHaveAttribute("max", "10");
  });

  test("EC-F5-08: teselas caídas — lista usable", async ({ page }) => {
    await page.route("**/*tile.openstreetmap.org/**", (route) => route.abort());
    await page.route("**/tile.openstreetmap.org/**", (route) => route.abort());

    const explorePage = new ExplorePage(page);
    await explorePage.gotoGeo(MONTERREY_PIN.lat, MONTERREY_PIN.lng, 10);
    await explorePage.waitForProvidersLoaded();

    await expect(explorePage.providerCards.first()).toBeVisible({ timeout: 15_000 });
    await expect(explorePage.tilesErrorBanner).toBeVisible({ timeout: 10_000 });
  });

  test("EC-GEO-DENY: geolocalización denegada no vacía la lista", async ({ page, context }) => {
    await context.clearPermissions();
    const explorePage = new ExplorePage(page);
    await explorePage.gotoGeo(MONTERREY_PIN.lat, MONTERREY_PIN.lng, 10);
    await explorePage.waitForProvidersLoaded();
    await explorePage.useMyLocationButton.click();
    await expect(explorePage.providerCards.first()).toBeVisible({ timeout: 15_000 });
  });
});

test.describe("E2E EXPLORE GEO F6 — HP-GEO-07 / HP-GEO-08", () => {
  test("HP-GEO-07: círculo visible y slider hidrata radiusKm en URL", async ({ page }) => {
    const explorePage = new ExplorePage(page);
    await explorePage.gotoGeo(MONTERREY_PIN.lat, MONTERREY_PIN.lng, 10);
    await explorePage.waitForProvidersLoaded();

    await expect(explorePage.leafletMap).toBeVisible({ timeout: 15_000 });
    await expect(explorePage.radiusCircle()).toBeVisible();
    await explorePage.setRadiusKm(5);
    await expect(page).toHaveURL(/radiusKm=5/, { timeout: 10_000 });
    await expect(explorePage.radiusSlider).toHaveValue("5");
  });

  test("HP-GEO-07b: radio 22 km clamp de query (tope slider 10)", async ({ page }) => {
    const explorePage = new ExplorePage(page);
    await explorePage.gotoGeo(MONTERREY_PIN.lat, MONTERREY_PIN.lng, 22);
    await explorePage.waitForProvidersLoaded();
    await expect(explorePage.radiusSlider).toHaveValue("10");
    await expect(explorePage.radiusCircle()).toBeVisible();
  });

  test("HP-GEO-08: refetch lista con aria-busy / Buscando fruterías", async ({ page }) => {
    let first = true;
    await page.route("**/api/providers?**", async (route) => {
      if (first) {
        first = false;
        await route.continue();
        return;
      }
      await new Promise((r) => setTimeout(r, 1500));
      await route.continue();
    });

    const explorePage = new ExplorePage(page);
    await explorePage.gotoGeo(MONTERREY_PIN.lat, MONTERREY_PIN.lng, 10);
    await explorePage.waitForProvidersLoaded();
    await explorePage.setRadiusKm(8);
    await expect(explorePage.seekingLabel().first()).toBeVisible({
      timeout: 5_000,
    });
    await expect(explorePage.leafletMap).toBeVisible();
  });
});
