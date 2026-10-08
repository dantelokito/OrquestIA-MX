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
    this.submitButton = page.getByRole("button", { name: /ingresar/i });
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
    const dialog = this.page.getByRole("dialog", { name: "Actualizamos nuestros Términos" });
    const appeared = await dialog
      .waitFor({ state: "visible", timeout: 1500 })
      .then(() => true)
      .catch(() => false);
    if (!appeared) return;
    await dialog.getByRole("checkbox").check();
    await dialog.getByRole("button", { name: "Aceptar y continuar" }).click();
    await dialog.waitFor({ state: "hidden", timeout: 8000 });
  }
}
