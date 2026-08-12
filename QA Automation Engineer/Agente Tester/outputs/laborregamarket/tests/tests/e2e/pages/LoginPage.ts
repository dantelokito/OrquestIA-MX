import type { Page, Locator } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorAlert: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel("Email");
    this.passwordInput = page.getByLabel("Contraseña");
    this.submitButton = page.getByRole("button", { name: /iniciar sesión/i });
    this.errorAlert = page.locator('[role="alert"], [aria-live="polite"]');
  }

  async goto(redirect?: string) {
    const url = redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : "/login";
    await this.page.goto(url);
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
