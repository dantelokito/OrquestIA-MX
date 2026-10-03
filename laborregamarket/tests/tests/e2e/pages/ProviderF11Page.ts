import type { Locator, Page } from "@playwright/test";

export class ProviderF11Page {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  switcher(): Locator {
    return this.page.getByRole("combobox", { name: /frutería activa/i });
  }

  globalReportsNav(): Locator {
    return this.page.getByRole("link", { name: /reportes generales/i });
  }

  f10ReportsHeading(): Locator {
    return this.page.getByRole("heading", { name: /reportes de ventas/i });
  }

  globalHeading(): Locator {
    return this.page.getByRole("heading", { name: /reportes generales|ventas consolidadas|todas las sucursales/i });
  }

  branchTableCaption(): Locator {
    return this.page.getByText(/ventas por sucursal/i);
  }

  addBranchNav(): Locator {
    return this.page.getByRole("link", { name: /agregar frutería/i });
  }

  onboardingHeading(): Locator {
    return this.page.getByRole("heading", { name: /nueva frutería/i });
  }

  demoCampoVerde(): Locator {
    return this.page.getByText("verduras@campoverde.mx");
  }

  async gotoPanel() {
    await this.page.goto("/proveedor");
  }

  async gotoGlobalReports() {
    await this.page.goto("/proveedor/reportes-generales");
  }

  async gotoOnboarding() {
    await this.page.goto("/registro/negocio");
  }

  async openSwitcher() {
    await this.switcher().click();
    return this.page.getByRole("listbox", { name: /tus fruterías/i });
  }

  optionByName(name: string): Locator {
    return this.page.getByRole("option", { name: new RegExp(name, "i") });
  }
}
