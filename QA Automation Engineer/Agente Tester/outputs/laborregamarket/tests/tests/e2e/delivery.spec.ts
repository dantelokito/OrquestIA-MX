import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";
import { ExplorePage } from "./pages/ExplorePage";
import { FruteriaPage } from "./pages/FruteriaPage";
import { CartPage } from "./pages/CartPage";
import { credentials } from "../../fixtures/auth";

test.describe("E2E DELIVERY — HP-ORD-05", () => {
  test("HP-ORD-05: sin delivery solo pickup; con offersDelivery aparece A domicilio", async ({
    page,
    request,
  }) => {
    await request.post("/api/auth/login", {
      data: { email: credentials.provider.email, password: credentials.provider.password },
    });
    const me = await request.get("/api/provider/me");
    const business = await me.json();
    const offers = Boolean(business.data?.offersDelivery);

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.client.email, credentials.client.password);

    const explorePage = new ExplorePage(page);
    await explorePage.goto("Paraíso");
    await explorePage.waitForProvidersLoaded();
    await explorePage.providerCards.first().click();
    await page.getByRole("button", { name: /aumentar cantidad/i }).first().click();
    const fruteriaPage = new FruteriaPage(page);
    await fruteriaPage.encargarLink().first().click();
    await expect(page).toHaveURL(/\/carrito/);

    const cartPage = new CartPage(page);
    if (offers) {
      await expect(cartPage.deliveryButton()).toBeVisible({ timeout: 10_000 });
      await expect(cartPage.pickupButton()).toBeVisible();
    } else {
      await expect(cartPage.deliveryButton()).toHaveCount(0);
      await expect(cartPage.confirmButton).toBeEnabled();
    }
  });
});
