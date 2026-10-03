import { test, expect } from "@playwright/test";
import { ExplorePage } from "./pages/ExplorePage";
import { LoginPage } from "./pages/LoginPage";
import { credentials } from "../../fixtures/auth";
import {
  MONTERREY_FAR_PIN,
  MONTERREY_PIN,
  OUTSIDE_MEXICO_PIN,
  SAN_NICOLAS_PIN,
} from "../../fixtures/geo";

test.describe("E2E EXPLORE F8 — ubicación / radio / MX", () => {
  test("HP-GEO-17: LocationChip único en reposo; sin CompactAddressBar", async ({ page }) => {
    const explorePage = new ExplorePage(page);
    await explorePage.gotoGeo(MONTERREY_PIN.lat, MONTERREY_PIN.lng, 10);
    await explorePage.waitForProvidersLoaded();

    await expect(explorePage.locationChip()).toBeVisible();
    const chipBox = await explorePage.locationChip().boundingBox();
    expect(chipBox?.height ?? 0).toBeGreaterThanOrEqual(44);
    await expect(explorePage.geocodeInput()).toHaveCount(0);
    await expect(explorePage.favoriteSelect()).toHaveCount(0);
    await expect(explorePage.saveAddressButton).toHaveCount(0);
  });

  test("HP-GEO-17b: abrir panel (popover desktop)", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const explorePage = new ExplorePage(page);
    await explorePage.gotoGeo(MONTERREY_PIN.lat, MONTERREY_PIN.lng, 10);
    await explorePage.waitForProvidersLoaded();
    await explorePage.openLocationPanel();
    await expect(explorePage.geocodeInput()).toBeVisible();
    await expect(explorePage.locationChip()).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await expect(explorePage.locationPanel()).toHaveCount(0);
  });

  test("HP-GEO-17c: geocode <3 caracteres muestra error inline", async ({ page }) => {
    const explorePage = new ExplorePage(page);
    await explorePage.gotoGeo(MONTERREY_PIN.lat, MONTERREY_PIN.lng, 10);
    await explorePage.waitForProvidersLoaded();
    await explorePage.openLocationPanel();
    await explorePage.geocodeInput().fill("ab");
    await explorePage.geocodeSearchButton().click();
    await expect(explorePage.locationPanel().getByRole("alert")).toContainText(
      /al menos 3 caracteres/i
    );
  });

  test("HP-GEO-18: favoritas en filas, sin select nativo", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.client.email, credentials.client.password);
    await expect(page).not.toHaveURL(/\/login/, { timeout: 15_000 });

    const explorePage = new ExplorePage(page);
    await explorePage.gotoGeo(MONTERREY_PIN.lat, MONTERREY_PIN.lng, 10);
    await explorePage.waitForProvidersLoaded();
    await explorePage.openLocationPanel();
    await expect(explorePage.favoriteSelect()).toHaveCount(0);
    await expect(explorePage.locationPanel()).toContainText(/guardadas/i);
  });

  test("HP-GEO-21: overlay compacto 500 m–10 km; cero copy 25 km", async ({ page }) => {
    const explorePage = new ExplorePage(page);
    await explorePage.gotoGeo(MONTERREY_PIN.lat, MONTERREY_PIN.lng, 10);
    await explorePage.waitForProvidersLoaded();

    await expect(explorePage.radiusSlider).toBeVisible();
    await expect(page.getByText("500 m").first()).toBeVisible();
    await expect(page.getByText("10 km").first()).toBeVisible();
    await expect(explorePage.clampHint()).toHaveCount(0);
    await expect(page.getByText(/máximo 25 km/i)).toHaveCount(0);
  });

  test("HP-GEO-22: slider min 0.5 max 10 step 0.5", async ({ page }) => {
    const explorePage = new ExplorePage(page);
    await explorePage.gotoGeo(MONTERREY_PIN.lat, MONTERREY_PIN.lng, 10);
    await explorePage.waitForProvidersLoaded();
    await expect(explorePage.radiusSlider).toHaveAttribute("min", "0.5");
    await expect(explorePage.radiusSlider).toHaveAttribute("max", "10");
    await expect(explorePage.radiusSlider).toHaveAttribute("step", "0.5");
  });

  test("HP-GEO-22b: bookmark radiusKm=22 y 0 se clampean", async ({ page }) => {
    const explorePage = new ExplorePage(page);
    await explorePage.gotoGeo(MONTERREY_PIN.lat, MONTERREY_PIN.lng, 22);
    await explorePage.waitForProvidersLoaded();
    await expect(explorePage.radiusSlider).toHaveValue("10");
    await expect(explorePage.radiusCircle()).toBeVisible();

    await explorePage.gotoGeo(MONTERREY_PIN.lat, MONTERREY_PIN.lng, 0);
    await explorePage.waitForProvidersLoaded();
    await expect(explorePage.radiusSlider).toHaveValue("0.5");
  });

  test("HP-GEO-20-F8: copy en metros cuando R < 1 km", async ({ page }) => {
    const explorePage = new ExplorePage(page);
    await explorePage.gotoGeo(MONTERREY_PIN.lat, MONTERREY_PIN.lng, 0.5);
    await explorePage.waitForProvidersLoaded();
    await expect(explorePage.exploreCount()).toContainText(/500 m/i, { timeout: 10_000 });
    await expect(page.getByText(/^Centro:/)).toHaveCount(0);
  });

  test("HP-GEO-22c: Ampliar radio visible lejos; oculto en tope 10", async ({ page }) => {
    const explorePage = new ExplorePage(page);
    await explorePage.gotoGeo(MONTERREY_FAR_PIN.lat, MONTERREY_FAR_PIN.lng, 1);
    await explorePage.waitForProvidersLoaded();
    await expect(explorePage.emptyRadio()).toBeVisible({ timeout: 15_000 });
    await expect(explorePage.enlargeRadiusButton()).toBeVisible();

    await explorePage.gotoGeo(MONTERREY_FAR_PIN.lat, MONTERREY_FAR_PIN.lng, 10);
    await explorePage.waitForProvidersLoaded();
    await expect(explorePage.enlargeRadiusButton()).toHaveCount(0);
  });

  test("HP-GEO-23c: URL fuera de México no adopta el pin", async ({ page }) => {
    const explorePage = new ExplorePage(page);
    const badGets: string[] = [];
    page.on("request", (req) => {
      if (req.method() === "GET" && /\/api\/providers\?/.test(req.url()) && /lat=33/.test(req.url())) {
        badGets.push(req.url());
      }
    });
    await explorePage.gotoGeo(OUTSIDE_MEXICO_PIN.lat, OUTSIDE_MEXICO_PIN.lng, 10);
    await explorePage.waitForProvidersLoaded();

    await expect(explorePage.outOfMexicoBanner()).toBeVisible({ timeout: 10_000 });
    await expect(page).toHaveURL(new RegExp(`lat=${SAN_NICOLAS_PIN.lat}`));
    expect(badGets).toEqual([]);
  });
});

test.describe("E2E EXPLORE F8 — preview hover", () => {
  test("HP-EXPLORE-07: hover abre preview; no existe Vista rápida", async ({ page }) => {
    const explorePage = new ExplorePage(page);
    await explorePage.gotoGeo(MONTERREY_PIN.lat, MONTERREY_PIN.lng, 10);
    await explorePage.waitForProvidersLoaded();
    await expect(explorePage.providerCardArticles().first()).toBeVisible({ timeout: 15_000 });

    await expect(explorePage.quickViewButtons()).toHaveCount(0);

    await explorePage.providerCardArticles().first().hover();
    await expect(explorePage.previewPopover()).toBeVisible({ timeout: 8_000 });
    await expect(
      explorePage.previewPopover().getByRole("link", { name: /ver frutería/i })
    ).toBeVisible();
  });

  test("HP-EXPLORE-07b: clic corto en la card va al detalle", async ({ page }) => {
    const explorePage = new ExplorePage(page);
    await explorePage.gotoGeo(MONTERREY_PIN.lat, MONTERREY_PIN.lng, 10);
    await explorePage.waitForProvidersLoaded();
    const card = explorePage.providerCards.first();
    await expect(card).toBeVisible({ timeout: 15_000 });
    const href = await card.getAttribute("href");
    await card.click();
    await expect(page).toHaveURL(/\/fruteria\//, { timeout: 15_000 });
    if (href) {
      expect(page.url()).toContain(href);
    }
  });

  test("HP-EXPLORE-07d: teclado Alt+Enter abre el preview", async ({ page }) => {
    const explorePage = new ExplorePage(page);
    await explorePage.gotoGeo(MONTERREY_PIN.lat, MONTERREY_PIN.lng, 10);
    await explorePage.waitForProvidersLoaded();
    const article = explorePage.providerCardArticles().first();
    await expect(article).toBeVisible({ timeout: 15_000 });
    await article.locator("a[href^='/fruteria/']").first().focus();
    await page.keyboard.press("Alt+Enter");
    await expect(page.getByRole("link", { name: /ver frutería/i })).toBeVisible({
      timeout: 10_000,
    });
  });
});
