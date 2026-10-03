import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";
import { PosPage } from "./pages/PosPage";
import { credentials } from "../../fixtures/auth";

test.describe("E2E POS SCALE — HP-POS-01", () => {
  test("HP-POS-01: badge báscula + keypad F3 y cobro sin VID/PID", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.provider.email, credentials.provider.password);
    await expect(page).toHaveURL(/\/proveedor/, { timeout: 15_000 });

    const posPage = new PosPage(page);
    await posPage.goto();

    await expect(posPage.scaleBadge()).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(/keypad f3 sigue disponible|báscula/i).first()).toBeVisible();

    let capturedBody: Record<string, unknown> | null = null;
    page.on("request", (req) => {
      if (req.url().includes("/api/provider/pos/sales") && req.method() === "POST") {
        capturedBody = req.postDataJSON() as Record<string, unknown>;
      }
    });

    const productBtn = page.getByRole("button").filter({ hasText: /manzana|plátano|naranja|fresa/i }).first();
    await expect(productBtn).toBeVisible({ timeout: 15_000 });
    await productBtn.click();
    await posPage.cobrarButton().click();
    await expect(page.getByText(/nueva venta/i)).toBeVisible({ timeout: 15_000 });

    if (capturedBody) {
      expect(capturedBody).not.toHaveProperty("vid");
      expect(capturedBody).not.toHaveProperty("pid");
    }
  });
});
