import type { Page, Locator } from "@playwright/test";

export class ExplorePage {
  readonly page: Page;
  readonly heading: Locator;
  readonly providerCards: Locator;
  readonly emptyState: Locator;
  readonly errorBanner: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: /explorar|fruterías/i });
    this.providerCards = page.locator("a[href^='/fruteria/']");
    this.emptyState = page.getByText(/no encontramos|sin resultados/i);
    this.errorBanner = page.locator('[role="alert"]');
  }

  async goto(query?: string) {
    const url = query ? `/explorar?q=${encodeURIComponent(query)}` : "/explorar";
    await this.page.goto(url);
  }

  async waitForProvidersLoaded() {
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(500);
  }
}
