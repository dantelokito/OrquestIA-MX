import type { Locator, Page } from "@playwright/test";

export class InventoryPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto("/proveedor/inventario");
  }

  heading(): Locator {
    return this.page.getByRole("heading", { name: /inventario/i }).first();
  }

  emptyState(): Locator {
    return this.page.getByText(/no hay productos|ir a catálogo|catálogo vacío/i);
  }

  errorState(): Locator {
    return this.page.getByRole("button", { name: /reintentar/i });
  }

  capacityBars(): Locator {
    return this.page.getByRole("progressbar");
  }

  retryButton(): Locator {
    return this.page.getByRole("button", { name: /reintentar/i });
  }

  registrarEntrada(): Locator {
    return this.page.getByRole("button", { name: /registrar entrada/i }).first();
  }

  subNav(): Locator {
    return this.page.getByRole("navigation").first();
  }

  subNavLink(name: RegExp): Locator {
    return this.page.getByRole("link", { name });
  }

  existenciasTab(): Locator {
    return this.page.getByRole("link", { name: /^existencias$/i });
  }

  movimientosTab(): Locator {
    return this.page.getByRole("link", { name: /^movimientos$/i });
  }

  registrarMerma(): Locator {
    return this.page.getByRole("button", { name: /registrar merma/i }).first();
  }

  ajusteConteo(): Locator {
    return this.page.getByRole("button", { name: /ajuste por conteo/i }).first();
  }

  movimientosCopy(): Locator {
    return this.page.getByText(/las ventas del pos y los pedidos encargar no aparecen aquí/i).first();
  }

  async gotoMovements() {
    await this.page.goto("/proveedor/inventario?tab=movimientos");
  }
}
