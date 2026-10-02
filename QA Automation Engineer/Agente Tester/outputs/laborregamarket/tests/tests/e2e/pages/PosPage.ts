import type { Page, Locator } from "@playwright/test";

export class PosPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly quickSaleButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByPlaceholder("Buscar producto");
    this.quickSaleButton = page.getByRole("button", { name: /venta rápida/i });
  }

  async goto() {
    await this.page.goto("/proveedor/pos");
  }

  productButton(name: string): Locator {
    return this.page.getByRole("button", { name: new RegExp(name, "i") });
  }

  cobrarButton(): Locator {
    return this.page.getByRole("button", { name: /cobrar/i });
  }

  qtyInput(): Locator {
    return this.page.locator("#pos-qty");
  }

  scaleBadge(): Locator {
    return this.page.getByText(/báscula (conectada|desconectada|no disponible)/i);
  }

  emptyCatalog(): Locator {
    return this.page.getByText(/no hay productos activos/i);
  }

  goToCatalogLink(): Locator {
    return this.page.getByRole("link", { name: /ir a catálogo/i });
  }
}
