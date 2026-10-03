import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";
import { AccountPage } from "./pages/AccountPage";
import { FruteriaPage } from "./pages/FruteriaPage";
import { credentials } from "../../fixtures/auth";
import { createDeliveredMarketplaceOrder } from "../../fixtures/reviews";

test.describe("E2E REVIEWS — HP-REV-01", () => {
  test("HP-REV-01: publicar reseña post-entrega y verla en frutería", async ({ page, request }) => {
    const { orderId, providerId } = await createDeliveredMarketplaceOrder(request);

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.client.email, credentials.client.password);
    await expect(page).not.toHaveURL(/\/login/, { timeout: 15_000 });

    const accountPage = new AccountPage(page);
    await accountPage.goto();
    await expect(accountPage.star(orderId, 5)).toBeVisible({ timeout: 15_000 });
    await accountPage.star(orderId, 5).click();
    await page.locator(`#review-comment-${orderId}`).fill("QA F4 reseña E2E");
    await accountPage.publishButton(orderId).click();
    await expect(page.getByText(/reseña publicada|ya tiene una reseña/i)).toBeVisible({
      timeout: 10_000,
    });

    const fruteriaPage = new FruteriaPage(page);
    await fruteriaPage.goto(providerId);
    await expect(page.getByText(/QA F4 reseña E2E/i)).toBeVisible({ timeout: 15_000 });
  });
});
