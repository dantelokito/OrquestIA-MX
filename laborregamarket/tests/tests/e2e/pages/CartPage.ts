import type { Page, Locator } from "@playwright/test";

export class CartPage {
  readonly page: Page;
  readonly confirmButton: Locator;
  readonly notesInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.confirmButton = page.getByRole("button", { name: /confirmar pedido/i });
    this.notesInput = page.locator("#order-notes");
  }

  async goto() {
    await this.page.goto("/carrito");
  }

  etaPrepCopy(): Locator {
    return this.page.getByText(/tiempo de preparación/i);
  }

  etaReadyCopy(): Locator {
    return this.page.getByText(/listo aprox/i);
  }

  pickupButton(): Locator {
    return this.page.getByRole("button", { name: /^recoger$/i });
  }

  deliveryButton(): Locator {
    return this.page.getByRole("button", { name: /a domicilio/i });
  }

  unavailableToast(name?: string): Locator {
    if (name) {
      return this.page.getByRole("status").filter({ hasText: new RegExp(`${name} ya no está disponible`, "i") });
    }
    return this.page.getByText(/ya no está disponible/i);
  }
}
