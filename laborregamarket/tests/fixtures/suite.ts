import { test as base, expect } from "@playwright/test";

export { expect };
export type { APIRequestContext, Page } from "@playwright/test";

/** IP de suite, distinta del bucket que TC-NOT-003 agota a propósito. */
export function forwardedForSuite(testId: string): string {
  const safe = testId.replace(/[^a-zA-Z0-9]/g, "").slice(-40) || "suite";
  return `198.51.100.${safe}`;
}

/**
 * Cada caso que no prueba el rate limit lleva su propio `x-forwarded-for`.
 * El Redis de `npm start` si no, comparte la IP y responde 429.
 */
export const test = base.extend({
  page: async ({ page }, use, testInfo) => {
    await page.setExtraHTTPHeaders({
      "x-forwarded-for": forwardedForSuite(testInfo.testId),
    });
    await use(page);
  },
  request: async ({ playwright }, use, testInfo) => {
    const baseURL = testInfo.project.use.baseURL ?? "http://127.0.0.1:8080";
    const context = await playwright.request.newContext({
      baseURL,
      extraHTTPHeaders: {
        "x-forwarded-for": forwardedForSuite(testInfo.testId),
      },
    });
    await use(context);
    await context.dispose();
  },
});
