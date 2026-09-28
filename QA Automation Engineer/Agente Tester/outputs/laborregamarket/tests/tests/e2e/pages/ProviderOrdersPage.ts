import type { Page, Locator } from "@playwright/test";

export class ProviderOrdersPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(tab: "active" | "completed" | "cancelled" = "active") {
    await this.page.goto(`/proveedor/ordenes?tab=${tab}`);
  }

  tab(name: string): Locator {
    return this.page.getByRole("tab", { name: new RegExp(name, "i") });
  }

  actionButton(label: string): Locator {
    return this.page.getByRole("button", { name: new RegExp(label, "i") });
  }
}
