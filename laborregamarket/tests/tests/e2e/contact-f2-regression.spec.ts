import { test, expect } from "@playwright/test";
import { ExplorePage } from "./pages/ExplorePage";
import { FruteriaPage } from "./pages/FruteriaPage";

test.describe("E2E REGRESSION F2 — HP-REG", () => {
  test("HP-REG-01: Llamar y WhatsApp visibles en detalle frutería", async ({ page }) => {
    const explorePage = new ExplorePage(page);
    await explorePage.goto("Paraíso");
    await explorePage.waitForProvidersLoaded();
    await explorePage.providerCards.first().click();

    const fruteriaPage = new FruteriaPage(page);
    await expect(fruteriaPage.llamarLink().first()).toBeVisible();
    await expect(fruteriaPage.whatsappLink().first()).toBeVisible();
    await expect(fruteriaPage.encargarLink().first()).toBeVisible();

    await fruteriaPage.llamarLink().first().click();
  });

  test("HP-REG-01 F4: Encargar sigue dominante con ítems", async ({ page }) => {
    const explorePage = new ExplorePage(page);
    await explorePage.goto("Paraíso");
    await explorePage.waitForProvidersLoaded();
    await explorePage.providerCards.first().click();

    const fruteriaPage = new FruteriaPage(page);
    await page.getByRole("button", { name: /aumentar cantidad/i }).first().click();
    await expect(fruteriaPage.encargarLink().first()).toBeVisible();
    await expect(fruteriaPage.llamarLink().first()).toBeVisible();
    await expect(fruteriaPage.whatsappLink().first()).toBeVisible();
  });
});
