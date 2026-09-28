import type { Page, Locator } from "@playwright/test";

export class AdminPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto("/admin");
  }

  catalogsTab(): Locator {
    return this.page.getByRole("button", { name: /^catálogos$/i });
  }

  providersTab(): Locator {
    return this.page.locator("div.mb-6.flex.gap-2.border-b").getByRole("button", { name: /^proveedores$/i });
  }

  productsCatalogCard(): Locator {
    return this.page.getByRole("button", { name: /productos/i }).first();
  }

  globalHeading(): Locator {
    return this.page.getByRole("heading", { name: /catálogo global/i });
  }

  newProductButton(): Locator {
    return this.page.getByRole("button", { name: /^nuevo$/i });
  }

  productNameInput(): Locator {
    return this.page.getByLabel(/^nombre$/i);
  }

  saveButton(): Locator {
    return this.page.getByRole("button", { name: /^guardar$/i });
  }

  verifiedColumn(): Locator {
    return this.page.getByRole("columnheader", { name: /verificado/i });
  }

  wholesaleColumn(): Locator {
    return this.page.getByRole("columnheader", { name: /mayoreo/i });
  }

  deliveryColumn(): Locator {
    return this.page.getByRole("columnheader", { name: /a domicilio/i });
  }

  activeColumn(): Locator {
    return this.page.getByRole("columnheader", { name: /^activo$/i });
  }
}
