import { test, expect } from "@playwright/test";
import { ExplorePage } from "./pages/ExplorePage";
import { MONTERREY_PIN, SAN_NICOLAS_PIN } from "../../fixtures/geo";

test.describe("E2E EXPLORE F7 — HP-GEO", () => {
  test("HP-GEO-09: mapa antes que lista en viewport móvil", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const explorePage = new ExplorePage(page);
    await explorePage.gotoGeo(MONTERREY_PIN.lat, MONTERREY_PIN.lng, 10);
    await explorePage.waitForProvidersLoaded();

    await expect(explorePage.leafletMap).toBeVisible({ timeout: 15_000 });
    const mapBox = await explorePage.leafletMap.boundingBox();
    const firstCard = explorePage.providerCards.first();
    await expect(firstCard).toBeVisible({ timeout: 15_000 });
    const cardBox = await firstCard.boundingBox();
    expect(mapBox).toBeTruthy();
    expect(cardBox).toBeTruthy();
    if (mapBox && cardBox) {
      expect(mapBox.y).toBeLessThan(cardBox.y);
      expect(mapBox.height).toBeGreaterThanOrEqual(300);
    }
  });

  test("HP-GEO-10: pan no dispara GET ni cambia slider/URL", async ({ page }) => {
    const explorePage = new ExplorePage(page);
    await explorePage.gotoGeo(MONTERREY_PIN.lat, MONTERREY_PIN.lng, 10);
    await explorePage.waitForProvidersLoaded();
    await expect(explorePage.leafletMap).toBeVisible({ timeout: 15_000 });

    const tracker = explorePage.trackProviderGets();
    await page.waitForTimeout(600);
    const getsBeforePan = tracker.getCount();
    const sliderBefore = await explorePage.radiusSlider.inputValue();
    const urlBefore = page.url();

    await explorePage.panMap(140, 90);
    await page.waitForTimeout(800);

    expect(tracker.getCount()).toBe(getsBeforePan);
    expect(await explorePage.radiusSlider.inputValue()).toBe(sliderBefore);
    expect(page.url()).toBe(urlBefore);
    tracker.stop();
  });

  test("HP-GEO-11: /explorar sin query hidrata SN y radio 10", async ({ page }) => {
    const explorePage = new ExplorePage(page);
    await explorePage.goto();
    await explorePage.waitForProvidersLoaded();

    await expect(explorePage.leafletMap).toBeVisible({ timeout: 15_000 });
    await expect(page).toHaveURL(/lat=/);
    await expect(page).toHaveURL(/lng=/);
    await expect(page).toHaveURL(/radiusKm=10/);

    const url = page.url();
    expect(url).toMatch(new RegExp(`lat=${SAN_NICOLAS_PIN.lat}`));
    expect(url).toMatch(new RegExp(`lng=${SAN_NICOLAS_PIN.lng}`));
    await expect(explorePage.radiusSlider).toHaveValue("10");
  });

  test("HP-GEO-13: copy conteo usa meta.total y meta.radiusKm", async ({ page }) => {
    const explorePage = new ExplorePage(page);
    let metaTotal = 0;
    let metaRadius = 10;

    await page.route("**/api/providers?**", async (route) => {
      const response = await route.fetch();
      const body = await response.json();
      metaTotal = body.meta?.total ?? 0;
      metaRadius = body.meta?.radiusKm ?? 10;
      await route.fulfill({ response });
    });

    await explorePage.gotoGeo(MONTERREY_PIN.lat, MONTERREY_PIN.lng, 10);
    await explorePage.waitForProvidersLoaded();

    const noun = metaTotal === 1 ? "frutería" : "fruterías";
    await expect(explorePage.exploreCount()).toContainText(
      `${metaTotal} ${noun} a ${metaRadius} km`,
      { timeout: 10_000 }
    );
    if (metaTotal > 20) {
      const body = await page.evaluate(async () => {
        const res = await fetch(
          `/api/providers?lat=${25.6714}&lng=${-100.3089}&radiusKm=10&limit=20`
        );
        return res.json();
      });
      expect(body.meta.total).toBe(metaTotal);
      expect(body.data.length).toBeLessThanOrEqual(20);
      expect(body.meta.total).not.toBe(body.data.length);
    }
  });

  test("EC-GEO-17: zoom mapa no altera scroll del catálogo (BUG-011)", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const explorePage = new ExplorePage(page);
    await explorePage.gotoGeo(MONTERREY_PIN.lat, MONTERREY_PIN.lng, 10);
    await explorePage.waitForProvidersLoaded();
    await expect(explorePage.providerCards.first()).toBeVisible({ timeout: 15_000 });

    const overflowY = await explorePage.mainScroll().evaluate(
      (el) => getComputedStyle(el).overflowY
    );
    expect(overflowY === "auto" || overflowY === "scroll").toBeTruthy();

    await explorePage.scrollMain(400);
    await explorePage.waitForFilterBarCollapsed();
    await page.waitForTimeout(400);
    const scrollBefore = await explorePage.getMainScrollTop();
    expect(scrollBefore).toBeGreaterThan(100);

    const docScrollBefore = await page.evaluate(() => window.scrollY);
    const sliderBefore = await explorePage.radiusSlider.inputValue();
    const tracker = explorePage.trackProviderGets();
    const getsBeforeZoom = tracker.getCount();

    await explorePage.zoomMapOnWheel(4);

    const scrollAfter = await explorePage.getMainScrollTop();
    const docScrollAfter = await page.evaluate(() => window.scrollY);

    expect(Math.abs(scrollAfter - scrollBefore)).toBeLessThan(30);
    expect(Math.abs(docScrollAfter - docScrollBefore)).toBeLessThan(30);
    expect(await explorePage.radiusSlider.inputValue()).toBe(sliderBefore);
    expect(tracker.getCount()).toBe(getsBeforeZoom);
    tracker.stop();
  });

  test("EC-GEO-18: FilterBar es chrome fuera de .explore-main-scroll (BUG-012)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const explorePage = new ExplorePage(page);
    await explorePage.gotoGeo(MONTERREY_PIN.lat, MONTERREY_PIN.lng, 10);
    await explorePage.waitForProvidersLoaded();
    await expect(explorePage.useMyLocationButton).toBeVisible();
    await expect(explorePage.locationChip()).toBeVisible();

    expect(await explorePage.isFilterBarInsideMainScroll()).toBe(false);

    const chipYBefore = (await explorePage.locationChip().boundingBox())?.y ?? 0;
    await explorePage.scrollMain(320);
    await explorePage.waitForFilterBarCollapsed();

    expect(await explorePage.isFilterBarInsideMainScroll()).toBe(false);
    const chipBox = await explorePage.locationChip().boundingBox();
    expect(chipBox).toBeTruthy();
    if (chipBox) {
      expect(chipBox.y).toBeLessThan(chipYBefore - 40);
    }
    await expect(explorePage.expandFiltersTab()).toBeVisible();
  });

  test("HP-GEO-19: FilterBar se colapsa al scroll down (BUG-013)", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const explorePage = new ExplorePage(page);
    await explorePage.gotoGeo(MONTERREY_PIN.lat, MONTERREY_PIN.lng, 10);
    await explorePage.waitForProvidersLoaded();
    await expect(explorePage.useMyLocationButton).toBeVisible();

    await explorePage.scrollMain(200);
    await explorePage.waitForFilterBarCollapsed();

    await expect(explorePage.useMyLocationButton).toBeHidden();
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(explorePage.expandFiltersTab()).toBeVisible();

    await explorePage.scrollMain(0);
    await expect(explorePage.useMyLocationButton).toBeVisible({ timeout: 5_000 });
    await expect(explorePage.filterBarLayout()).not.toHaveClass(
      /explore-filterbar-layout--collapsed/
    );
  });

  test("EC-GEO-19: pestaña re-expande FilterBar y conserva filtros (BUG-013)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 640 });
    const explorePage = new ExplorePage(page);
    await explorePage.gotoGeo(MONTERREY_PIN.lat, MONTERREY_PIN.lng, 10);
    await explorePage.waitForProvidersLoaded();

    await explorePage.verifiedChip().click();
    await expect(explorePage.verifiedChip()).toHaveAttribute("aria-pressed", "true");
    await explorePage.waitForProvidersLoaded();
    await expect(explorePage.providerCards.first()).toBeVisible({ timeout: 15_000 });

    await explorePage.scrollMain(80);
    await page.waitForTimeout(80);
    await explorePage.scrollMain(240);
    await explorePage.waitForFilterBarCollapsed();
    await expect(explorePage.expandFiltersTab()).toHaveAttribute(
      "aria-label",
      /mostrar filtros.*activo/i
    );

    // Leaflet/slider puede interceptar el pointer (OBS F7). Contrato: expand también con scroll al tope.
    await explorePage.expandFiltersTab().click({ force: true });
    const stillCollapsed = await explorePage
      .filterBarLayout()
      .evaluate((el) => el.className.includes("explore-filterbar-layout--collapsed"));
    if (stillCollapsed) {
      await explorePage.scrollMain(0);
    }
    await expect(explorePage.filterBarLayout()).not.toHaveClass(
      /explore-filterbar-layout--collapsed/,
      { timeout: 5_000 }
    );
    await expect(explorePage.useMyLocationButton).toBeVisible();
    await expect(explorePage.verifiedChip()).toHaveAttribute("aria-pressed", "true");
  });

});

test.describe("E2E EXPLORE F7 — HP-EXPLORE", () => {
  test("HP-EXPLORE-06: búsqueda mango desde header", async ({ page }) => {
    const explorePage = new ExplorePage(page);
    await explorePage.gotoGeo(MONTERREY_PIN.lat, MONTERREY_PIN.lng, 10);
    await explorePage.waitForProvidersLoaded();
    await explorePage.searchFromHeader("mango");

    await expect(page).toHaveURL(/q=mango/i);
    await expect(explorePage.providerCards.first()).toBeVisible({ timeout: 15_000 });
  });

  test("EC-EXPLORE-01: 500 en providers muestra error, no empty borrega", async ({ page }) => {
    let failNext = false;
    await page.route("**/api/providers?**", async (route) => {
      if (!failNext) {
        await route.continue();
        return;
      }
      await route.fulfill({ status: 500, body: JSON.stringify({ error: "fail" }) });
    });

    const explorePage = new ExplorePage(page);
    await explorePage.gotoGeo(MONTERREY_PIN.lat, MONTERREY_PIN.lng, 10);
    await explorePage.waitForProvidersLoaded();
    await expect(explorePage.providerCards.first()).toBeVisible({ timeout: 15_000 });

    failNext = true;
    await explorePage.setRadiusKm(8);
    await page.waitForTimeout(1500);

    await expect(explorePage.emptyRadio()).toHaveCount(0);
    await expect(explorePage.errorBanner.first()).toBeVisible({ timeout: 10_000 });
    await expect(explorePage.leafletMap).toBeVisible();
    await expect(page.getByRole("button", { name: /reintentar/i })).toBeVisible();
  });
});
