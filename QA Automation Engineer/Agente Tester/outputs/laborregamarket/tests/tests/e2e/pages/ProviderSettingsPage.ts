import type { Page, Locator } from "@playwright/test";

export class ProviderSettingsPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto("/proveedor");
  }

  verificationBanner(): Locator {
    return this.page.getByText(/requiere verificación de tu negocio/i);
  }

  googlePlaceInput(): Locator {
    return this.page.getByLabel(/google place id/i);
  }

  offersDeliveryCheckbox(): Locator {
    return this.page.getByLabel(/ofrezco entrega a domicilio/i);
  }

  brandHeading(): Locator {
    return this.page.getByRole("heading", { name: /colores de tu marca/i });
  }

  primaryColorInput(): Locator {
    return this.page.locator("#brand-primary");
  }

  secondaryColorInput(): Locator {
    return this.page.locator("#brand-secondary");
  }

  saveColorsButton(): Locator {
    return this.page.getByRole("button", { name: /guardar colores/i });
  }

  resetBrandButton(): Locator {
    return this.page.getByRole("button", { name: /restaurar marca de plataforma/i });
  }

  catalogHint(): Locator {
    return this.page.getByText(/inactivo: no aparece en explorar/i);
  }

  productToggle(name: string): Locator {
    return this.page.getByRole("button", { name: new RegExp(`${name}: (Activo|Inactivo)`) });
  }
}
