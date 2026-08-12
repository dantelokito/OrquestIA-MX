import { test, expect } from "@playwright/test";
import { ExplorePage } from "./pages/ExplorePage";

test.describe("E2E EXPLORE — TC-PROV UI", () => {
  test("TC-PROV-016: explorar carga fruterías desde API", async ({ page }) => {
    const explorePage = new ExplorePage(page);
    await explorePage.goto();
    await explorePage.waitForProvidersLoaded();

    const cards = explorePage.providerCards;
    await expect(cards.first()).toBeVisible({ timeout: 15_000 });
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("TC-PROV-004 UI: búsqueda q filtra en explorar", async ({ page }) => {
    const explorePage = new ExplorePage(page);
    await explorePage.goto("Paraíso");
    await explorePage.waitForProvidersLoaded();

    await expect(page.getByText(/Paraíso/i).first()).toBeVisible({ timeout: 15_000 });
  });

  test("TC-PROV-017: detalle frutería muestra productos", async ({ page }) => {
    const explorePage = new ExplorePage(page);
    await explorePage.goto();
    await explorePage.waitForProvidersLoaded();

    const firstCard = explorePage.providerCards.first();
    await firstCard.click();
    await expect(page).toHaveURL(/\/fruteria\//);
    await expect(page.getByRole("heading").first()).toBeVisible();
  });

  test("TC-PROV-007 UI: frutería inexistente muestra error", async ({ page }) => {
    await page.goto("/fruteria/nonexistent-id-12345");
    await expect(page.getByText(/no encontrada|error/i)).toBeVisible({ timeout: 10_000 });
  });
});
