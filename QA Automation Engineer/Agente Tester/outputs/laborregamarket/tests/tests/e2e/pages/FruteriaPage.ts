import type { Page, Locator } from "@playwright/test";

export class FruteriaPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(providerId: string) {
    await this.page.goto(`/fruteria/${providerId}`);
  }

  increaseQuantity(productName: string) {
    return this.page.getByRole("button", { name: `Aumentar cantidad de ${productName}` });
  }

  encargarLink(): Locator {
    return this.page.getByRole("link", { name: /encargar/i });
  }

  llamarLink(): Locator {
    return this.page.getByRole("link", { name: /llamar/i });
  }

  whatsappLink(): Locator {
    return this.page.getByRole("link", { name: /whatsapp/i });
  }

  emptyReviews(): Locator {
    return this.page.getByText(/sin reseñas todavía/i);
  }

  googleReviewsLink(): Locator {
    return this.page.getByRole("link", { name: /ver reseñas en google/i });
  }

  productName(name: string): Locator {
    return this.page.getByRole("heading", { name: new RegExp(name, "i") }).or(
      this.page.getByText(name, { exact: true })
    );
  }
}
