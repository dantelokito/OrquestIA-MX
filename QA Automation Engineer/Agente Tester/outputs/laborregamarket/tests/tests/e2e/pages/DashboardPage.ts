import type { Page, Locator } from "@playwright/test";

export class DashboardPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto("/proveedor/dashboard");
  }

  /** F10 chrome: rango from/to (no grain). */
  async gotoReports(from?: string, to?: string) {
    const params = new URLSearchParams({ view: "reportes" });
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    await this.page.goto(`/proveedor/dashboard?${params.toString()}`);
  }

  kpiCards(): Locator {
    return this.page.locator(".rounded-xl.border.border-gray-200.bg-white.p-5");
  }

  chartTableSummary(): Locator {
    return this.page.getByText("Ver datos en tabla");
  }

  reportsTab(): Locator {
    return this.page.getByRole("tab", { name: /reportes/i });
  }

  reportsHeading(): Locator {
    return this.page.getByRole("heading", { name: /reportes de ventas/i });
  }

  monthShortcut(): Locator {
    return this.page.locator("#report-month");
  }

  fromInput(): Locator {
    return this.page.locator("#report-from");
  }

  toInput(): Locator {
    return this.page.locator("#report-to");
  }

  productChecklist(): Locator {
    return this.page.getByText(/productos del corte/i);
  }

  noneMeansAll(): Locator {
    return this.page.getByText(/ninguno marcado = todos/i);
  }

  salesByProduct(): Locator {
    return this.page.getByRole("heading", { name: /venta por producto/i });
  }

  printRoot(): Locator {
    return this.page.locator("#report-print-f10");
  }

  printButton(): Locator {
    return this.page.getByRole("button", { name: /imprimir/i });
  }

  pdfButton(): Locator {
    return this.page.getByRole("button", { name: /descargar pdf/i });
  }

  grainDay(): Locator {
    return this.page.getByRole("button", { name: /^día$/i });
  }

  grainMonth(): Locator {
    return this.page.getByRole("button", { name: /^mes$/i });
  }

  grainYear(): Locator {
    return this.page.getByRole("button", { name: /^año$/i });
  }
}
