import { test, expect } from "@playwright/test";
import { getSeedProviderProduct } from "../../fixtures/orders";
import { MONTERREY_PIN } from "../../fixtures/geo";

test.describe("API ETA — TC-ETA", () => {
  test("TC-ETA-001: sin coords → copyKey eta_prep_only", async ({ request }) => {
    const seed = await getSeedProviderProduct(request);
    const response = await request.get(`/api/providers/${seed.providerId}/eta`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.copyKey).toBe("eta_prep_only");
    expect(body.data.travelMinutes).toBe(0);
    expect(body.data.preparationTimeMinutes).toBeGreaterThan(0);
    expect(body.data.fulfillmentType).toBe("PICKUP");
  });

  test("TC-ETA-002: con pin → copyKey eta_ready_approx", async ({ request }) => {
    const seed = await getSeedProviderProduct(request);
    const response = await request.get(
      `/api/providers/${seed.providerId}/eta?lat=${MONTERREY_PIN.lat}&lng=${MONTERREY_PIN.lng}`
    );
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.copyKey).toBe("eta_ready_approx");
    expect(body.data.etaMinutes).toBeGreaterThanOrEqual(body.data.preparationTimeMinutes);
    expect(body.data.travelMinutes).toBeGreaterThanOrEqual(1);
  });

  test("TC-ETA-003: lat sin lng → 400", async ({ request }) => {
    const seed = await getSeedProviderProduct(request);
    const response = await request.get(
      `/api/providers/${seed.providerId}/eta?lat=${MONTERREY_PIN.lat}`
    );
    expect(response.status()).toBe(400);
  });

  test("TC-ETA-004: DELIVERY si offersDelivery=false → 400", async ({ request }) => {
    const seed = await getSeedProviderProduct(request);
    const me = await request.get(`/api/providers/${seed.providerId}`);
    const detail = await me.json();
    test.skip(Boolean(detail.data.offersDelivery), "Seed already offers delivery");

    const response = await request.get(
      `/api/providers/${seed.providerId}/eta?fulfillmentType=DELIVERY&lat=${MONTERREY_PIN.lat}&lng=${MONTERREY_PIN.lng}`
    );
    expect(response.status()).toBe(400);
  });
});
