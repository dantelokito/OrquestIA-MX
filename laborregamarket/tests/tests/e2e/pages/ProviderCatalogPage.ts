import type { Page, Locator } from "@playwright/test";

export class ProviderCatalogPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto("/proveedor");
  }

  addProductButton(): Locator {
    return this.page.getByRole("button", { name: /^agregar producto$/i });
  }

  newSectionButton(): Locator {
    return this.page.getByRole("button", { name: /^nueva sección$/i }).first();
  }

  emptySections(): Locator {
    return this.page.getByText(/aún no hay secciones/i);
  }

  sectionNameInput(): Locator {
    return this.page.getByLabel(/nueva sección/i);
  }

  createSectionButton(): Locator {
    return this.page.getByRole("button", { name: /^crear$/i });
  }

  drawer(): Locator {
    return this.page.getByRole("dialog");
  }

  productNameInput(): Locator {
    return this.drawer().getByLabel(/^nombre$/i);
  }

  priceInput(): Locator {
    return this.drawer().getByLabel(/precio/i);
  }

  saveProductButton(): Locator {
    return this.page.getByRole("button", { name: /guardar producto/i });
  }

  scopeBadge(): Locator {
    return this.drawer().getByText("Solo este negocio", { exact: true });
  }

  mediaHint(): Locator {
    return this.page.getByText(/jpeg|png|webp/i).first();
  }

  async createSection(name: string) {
    await this.newSectionButton().click();
    await this.sectionNameInput().fill(name);
    await this.createSectionButton().click();
  }

  async openAddProduct() {
    await this.addProductButton().click();
    await this.drawer().waitFor({ state: "visible" });
  }
}
