import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";
import { FruteriaPage } from "./pages/FruteriaPage";
import { credentials, loginAs, withAuth } from "../../fixtures/auth";
import { createLocalProduct, createSection, f10Suffix } from "../../fixtures/f10";

test.describe("E2E FRUTERIA F10 — HP-CAT-03", () => {
  test("HP-CAT-03: detalle agrupa por heading de sección", async ({ page, request }) => {
    await loginAs(request, "PROVIDER");
    const me = await request.get("/api/provider/me", withAuth(request));
    const providerId = (await me.json()).data.id as string;
    const sectionName = `Grupo UI ${f10Suffix()}`;
    const section = await createSection(request, sectionName);
    expect(section.ok()).toBeTruthy();
    const sectionId = (await section.json()).data.id as string;
    const productName = `Visible UI ${f10Suffix()}`;
    const created = await createLocalProduct(request, {
      name: productName,
      sectionId,
      isAvailable: true,
    });
    expect(created.ok()).toBeTruthy();

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.client.email, credentials.client.password);
    await expect(page).not.toHaveURL(/\/login/, { timeout: 15_000 });

    const fruteria = new FruteriaPage(page);
    await fruteria.goto(providerId);
    await expect(page.getByRole("heading", { name: sectionName })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(productName).first()).toBeVisible();
  });
});
