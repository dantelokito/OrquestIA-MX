import type { Page, Locator } from "@playwright/test";

export class AccountPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto("/cuenta");
  }

  reviewForm(orderId: string): Locator {
    return this.page.locator("form").filter({
      has: this.page.locator(`#review-comment-${orderId}`),
    });
  }

  publishButton(orderId: string): Locator {
    return this.reviewForm(orderId).getByRole("button", { name: /publicar reseña/i });
  }

  star(orderId: string, n: number): Locator {
    return this.reviewForm(orderId).getByRole("radio", {
      name: n === 1 ? "1 estrella" : `${n} estrellas`,
    });
  }
}
