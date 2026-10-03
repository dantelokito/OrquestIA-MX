import type { Locator, Page } from "@playwright/test";

export class ProfilePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto("/proveedor/perfil");
  }

  heading(): Locator {
    return this.page.getByRole("heading", { name: /^perfil/i }).first();
  }

  identityHeading(): Locator {
    return this.page.getByRole("heading", { name: /identidad visual/i });
  }

  googleHeading(): Locator {
    return this.page.getByRole("heading", { name: /google maps/i });
  }

  businessHeading(): Locator {
    return this.page.getByRole("heading", { name: /datos del negocio/i });
  }

  hoursHeading(): Locator {
    return this.page.getByRole("heading", { name: /^horarios$/i });
  }

  capabilitiesHeading(): Locator {
    return this.page.getByRole("heading", { name: /capacidades y operación/i });
  }

  googleLockCopy(): Locator {
    return this.page.getByText(/requieren verificación/i);
  }

  placeIdInput(): Locator {
    return this.page.getByLabel(/google place id/i);
  }

  retryButton(): Locator {
    return this.page.getByRole("button", { name: /reintentar/i });
  }
}
