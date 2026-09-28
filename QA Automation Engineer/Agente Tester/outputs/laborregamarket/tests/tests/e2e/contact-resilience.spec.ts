import { test, expect } from "@playwright/test";
import { ExplorePage } from "./pages/ExplorePage";
import { FruteriaPage } from "./pages/FruteriaPage";

test.describe("E2E CONTACT F6 — US-NOTIFY-10 / US-BRAND-03", () => {
  test("HP-NOT-10: 503 muestra toast distinto de 500 y CTA usable", async ({ page }) => {
    await page.route("**/api/providers/*/contact", (route) =>
      route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({ error: "El aviso a la frutería no está disponible" }),
      })
    );

    const explorePage = new ExplorePage(page);
    await explorePage.goto("Paraíso");
    await explorePage.waitForProvidersLoaded();
    await explorePage.providerCards.first().click();

    const fruteriaPage = new FruteriaPage(page);
    await expect(fruteriaPage.llamarLink().first()).toBeVisible({ timeout: 15_000 });
    await fruteriaPage.llamarLink().first().click();
    await expect(page.getByText(/el aviso a la frutería no está disponible/i)).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByText(/no pudimos avisar a la frutería/i)).toHaveCount(0);
    await expect(fruteriaPage.llamarLink().first()).toBeVisible();
  });

  test("EC-NOT-10: 500 copy distinto; 429 silencioso", async ({ page }) => {
    let contacts = 0;
    await page.route("**/api/providers/*/contact", (route) => {
      contacts += 1;
      if (contacts === 1) {
        return route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify({ error: "Internal" }),
        });
      }
      return route.fulfill({
        status: 429,
        contentType: "application/json",
        body: JSON.stringify({ error: "Demasiados intentos" }),
      });
    });

    const explorePage = new ExplorePage(page);
    await explorePage.goto("Paraíso");
    await explorePage.waitForProvidersLoaded();
    await explorePage.providerCards.first().click();

    const fruteriaPage = new FruteriaPage(page);
    await fruteriaPage.llamarLink().first().click();
    await expect(page.getByText(/no pudimos avisar a la frutería/i)).toBeVisible({ timeout: 10_000 });

    await fruteriaPage.whatsappLink().first().click();
    await expect(page.getByText(/demasiados/i)).toHaveCount(0);
  });
});
