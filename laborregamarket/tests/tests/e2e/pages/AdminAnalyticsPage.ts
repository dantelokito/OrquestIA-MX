import type { Page, Locator } from "@playwright/test";

export class AdminAnalyticsPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto("/admin/analytics");
  }

  heading(): Locator {
    return this.page.getByRole("heading", { name: /analítica de plataforma/i });
  }

  periodTab(label: string): Locator {
    return this.page.getByRole("tab", { name: new RegExp(label, "i") });
  }

  emptyState(): Locator {
    return this.page.getByText(/no hay actividad en este periodo/i);
  }

  gmvCard(): Locator {
    return this.page.getByText(/^GMV$/);
  }
}
