import { expect, type Locator, type Page } from "@playwright/test";

export class ExplorePage {
  readonly page: Page;
  readonly heading: Locator;
  readonly providerCards: Locator;
  readonly emptyState: Locator;
  readonly errorBanner: Locator;
  readonly useMyLocationButton: Locator;
  readonly radiusSlider: Locator;
  readonly saveAddressButton: Locator;
  readonly mapUnavailable: Locator;
  readonly leafletMap: Locator;
  readonly osmAttribution: Locator;
  readonly tilesErrorBanner: Locator;
  readonly searchOpenButton: Locator;
  readonly searchInput: Locator;
  readonly searchSubmit: Locator;
  readonly previewDialog: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: /explorar|fruterías/i });
    this.providerCards = page.locator("a[href^='/fruteria/']");
    this.emptyState = page.getByText(/no encontramos|sin resultados|no hay fruterías/i);
    this.errorBanner = page.locator('[role="alert"]');
    this.useMyLocationButton = page.getByRole("button", { name: /usar mi ubicación/i }).first();
    this.radiusSlider = page.locator("#radius-km").first();
    this.saveAddressButton = page.getByRole("button", { name: /guardar esta ubicación/i });
    this.mapUnavailable = page.getByText(/mapa no disponible/i);
    this.leafletMap = page.locator(".leaflet-container").first();
    this.osmAttribution = page.getByRole("link", { name: /openstreetmap/i }).or(
      page.getByText(/openstreetmap/i)
    );
    this.tilesErrorBanner = page.getByText(/el mapa no cargó; usa la lista/i).first();
    this.searchOpenButton = page.getByRole("button", { name: /abrir búsqueda/i });
    this.searchInput = page.getByPlaceholder(/buscar fruterías, frutas, verduras/i);
    this.searchSubmit = page.getByRole("button", { name: /^buscar$/i });
    this.previewDialog = page.locator('[role="dialog"]');
  }

  locationChip(): Locator {
    return this.page.locator('button[aria-haspopup="dialog"]').first();
  }

  locationPanel(): Locator {
    return this.page.getByRole("dialog", { name: /dónde buscas/i });
  }

  saveDialog(): Locator {
    return this.page.getByRole("dialog", { name: /guardar ubicación/i });
  }

  deleteDialog(): Locator {
    return this.page.getByRole("dialog", { name: /borrar/i });
  }

  previewPopover(): Locator {
    return this.page.locator('[role="dialog"]').filter({
      has: this.page.getByRole("link", { name: /ver frutería/i }),
    });
  }

  providerCardArticles(): Locator {
    return this.page.locator('article[role="listitem"]');
  }

  outOfMexicoBanner(): Locator {
    return this.page.getByText(/esa ubicación está fuera de méxico/i);
  }

  radiusCircle(): Locator {
    return this.page.locator(".leaflet-overlay-pane path.leaflet-interactive").first();
  }

  clampHint(): Locator {
    return this.page.getByText(/máximo 25 km/i);
  }

  listBusy(): Locator {
    return this.page.locator("[aria-busy='true']").first();
  }

  seekingLabel(): Locator {
    return this.page.getByText(/buscando fruterías/i);
  }

  exploreCount(): Locator {
    return this.page.getByText(/\d+\s+fruterías?\s+a\s+\d+(\.\d+)?\s+(km|m)/i);
  }

  quickViewButtons(): Locator {
    return this.page.getByRole("button", { name: /^vista rápida$/i });
  }

  previewEyeButton(): Locator {
    return this.page.getByRole("button", { name: /vista previa/i });
  }

  resultsPanel(): Locator {
    return this.page.locator(".explore-results-panel");
  }

  mainScroll(): Locator {
    return this.page.locator(".explore-main-scroll");
  }

  filterBarChrome(): Locator {
    return this.page.locator(".explore-filterbar-chrome");
  }

  filterBarLayout(): Locator {
    return this.page.locator(".explore-filterbar-layout");
  }

  expandFiltersTab(): Locator {
    return this.page.getByRole("button", { name: /mostrar filtros/i });
  }

  verifiedChip(): Locator {
    return this.page.getByRole("button", { name: /verificado/i }).first();
  }

  geocodeInput(): Locator {
    return this.page.locator("#geocode-query");
  }

  favoriteSelect(): Locator {
    return this.page.locator("#favorite-address");
  }

  geocodeSearchButton(): Locator {
    return this.page.getByRole("button", { name: /^buscar dirección$/i });
  }

  async openLocationPanel() {
    await this.locationChip().click();
    await expect(this.locationPanel()).toBeVisible({ timeout: 10_000 });
  }

  async getResultsPanelScrollTop(): Promise<number> {
    return this.resultsPanel().evaluate((el) => el.scrollTop);
  }

  async getMainScrollTop(): Promise<number> {
    return this.mainScroll().evaluate((el) => el.scrollTop);
  }

  async scrollResultsPanel(pixels: number) {
    await this.resultsPanel().evaluate((el, px) => {
      el.scrollTop = px;
    }, pixels);
  }

  async scrollMain(pixels: number) {
    await this.mainScroll().evaluate((el, px) => {
      el.scrollTop = px;
      el.dispatchEvent(new Event("scroll", { bubbles: true }));
    }, pixels);
  }

  async waitForFilterBarCollapsed() {
    await expect(this.filterBarLayout()).toHaveClass(/explore-filterbar-layout--collapsed/, {
      timeout: 5_000,
    });
    await expect(this.expandFiltersTab()).toBeVisible({ timeout: 5_000 });
  }

  async isFilterBarInsideMainScroll(): Promise<boolean> {
    return this.filterBarChrome().evaluate((el) => Boolean(el.closest(".explore-main-scroll")));
  }

  async zoomMapOnWheel(ticks = 3) {
    const map = this.leafletMap;
    const box = await map.boundingBox();
    if (!box) throw new Error("Leaflet map has no bounding box");
    const x = box.x + box.width * 0.5;
    const y = box.y + box.height * 0.35;
    await this.page.mouse.move(x, y);
    for (let i = 0; i < ticks; i++) {
      await this.page.mouse.wheel(0, -120);
      await this.page.waitForTimeout(80);
    }
    await this.page.waitForTimeout(400);
  }

  async goto(query?: string) {
    const url = query ? `/explorar?q=${encodeURIComponent(query)}` : "/explorar";
    await this.page.goto(url);
  }

  async gotoGeo(lat: number, lng: number, radiusKm = 10) {
    await this.page.goto(`/explorar?lat=${lat}&lng=${lng}&radiusKm=${radiusKm}`);
  }

  async setRadiusKm(km: number) {
    await this.radiusSlider.evaluate((el, value) => {
      const input = el as HTMLInputElement;
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
      setter?.call(input, String(value));
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }, km);
  }

  async waitForProvidersLoaded() {
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(500);
  }

  emptyRadio(): Locator {
    return this.page.getByText(/no hay fruterías en este radio/i);
  }

  enlargeRadiusButton(): Locator {
    return this.page.getByRole("button", { name: /ampliar radio/i });
  }

  async locationCtaInsideLeaflet(): Promise<boolean> {
    return this.useMyLocationButton.evaluate((el) => Boolean(el.closest(".leaflet-container")));
  }

  async openHeaderSearch() {
    await this.searchOpenButton.click();
    await this.searchInput.waitFor({ state: "visible", timeout: 10_000 });
  }

  async searchFromHeader(query: string) {
    await this.openHeaderSearch();
    await this.searchInput.fill(query);
    await this.searchSubmit.click();
    await this.waitForProvidersLoaded();
  }

  async panMap(dx = 120, dy = 80) {
    const map = this.leafletMap;
    const box = await map.boundingBox();
    if (!box) throw new Error("Leaflet map has no bounding box");
    // Evitar el centro: el pin de usuario es draggable y moverlo dispara refetch (US-GEO-10 escenario 3).
    const startX = box.x + box.width * 0.2;
    const startY = box.y + box.height * 0.75;
    await this.page.mouse.move(startX, startY);
    await this.page.mouse.down();
    await this.page.mouse.move(startX + dx, startY + dy, { steps: 8 });
    await this.page.mouse.up();
    await this.page.waitForTimeout(400);
  }

  trackProviderGets(): { getCount: () => number; stop: () => void } {
    let gets = 0;
    const handler = (req: { url: () => string; method: () => string }) => {
      if (req.method() === "GET" && /\/api\/providers\?/.test(req.url())) {
        gets += 1;
      }
    };
    this.page.on("request", handler);
    return {
      getCount: () => gets,
      stop: () => this.page.off("request", handler),
    };
  }
}
