import { test, expect } from "@playwright/test";
import { registerUnverifiedProvider, assertResponseTime } from "../../fixtures/auth";
import { getSeedProviderProduct } from "../../fixtures/orders";

test.describe("API NOTIFY — TC-NOT", () => {
  test("TC-NOT-001: POST contact → 200 notified", async ({ request }) => {
    const seed = await getSeedProviderProduct(request);
    const start = Date.now();
    const response = await request.post(`/api/providers/${seed.providerId}/contact`, {
      data: { source: "call_button" },
    });
    assertResponseTime(start);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.notified).toBe(true);
  });

  test("TC-NOT-002: provider inexistente → 404", async ({ request }) => {
    const response = await request.post("/api/providers/nonexistent-id-12345/contact", {
      data: { source: "call_button" },
    });
    expect(response.status()).toBe(404);
  });

  test("TC-NOT-003: sexto contact en 10 min → 429", async ({ request }) => {
    test.setTimeout(90_000);
    const { providerId } = await registerUnverifiedProvider(request, "rate");
    const ip = `203.0.113.${Math.floor(Math.random() * 200) + 1}`;
    const headers = { "x-forwarded-for": ip };

    await request.post(`/api/providers/${providerId}/contact`, {
      headers,
      data: { source: "call_button" },
    });

    let saw429 = false;
    for (let i = 0; i < 8; i++) {
      const response = await request.post(`/api/providers/${providerId}/contact`, {
        headers,
        data: { source: "call_button" },
      });
      if (response.status() === 429) {
        saw429 = true;
        const body = await response.json();
        expect(body.error).toMatch(/demasiados|más tarde/i);
        break;
      }
      expect([200, 429]).toContain(response.status());
    }
    expect(saw429).toBe(true);
  });
});
