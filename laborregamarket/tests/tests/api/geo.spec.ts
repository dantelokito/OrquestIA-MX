import { test, expect } from "@playwright/test";
import { assertResponseTime } from "../../fixtures/auth";
import { CDMX_PIN, MONTERREY_PIN, OUTSIDE_MEXICO_PIN } from "../../fixtures/geo";

test.describe("API GEO — TC-GEO", () => {
  test("TC-GEO-001: lat+lng aplica radio default 10 y distanceKm", async ({ request }) => {
    const start = Date.now();
    const response = await request.get(
      `/api/providers?lat=${MONTERREY_PIN.lat}&lng=${MONTERREY_PIN.lng}`
    );
    assertResponseTime(start, 2000);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.meta.radiusKm).toBe(10);
    if (body.data.length > 0) {
      expect(typeof body.data[0].distanceKm).toBe("number");
    }
    const distances = body.data.map((p: { distanceKm: number }) => p.distanceKm);
    const sorted = [...distances].sort((a, b) => a - b);
    expect(distances).toEqual(sorted);
  });

  test("TC-GEO-002: radiusKm=5 en meta y combinable con verified", async ({ request }) => {
    const response = await request.get(
      `/api/providers?lat=${MONTERREY_PIN.lat}&lng=${MONTERREY_PIN.lng}&radiusKm=5&verified=true`
    );
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.meta.radiusKm).toBe(5);
    for (const provider of body.data) {
      expect(provider.isVerified).toBe(true);
      expect(provider.distanceKm).toBeLessThanOrEqual(5);
    }
  });

  test("TC-GEO-003: lat sin lng → 400", async ({ request }) => {
    const response = await request.get(`/api/providers?lat=${MONTERREY_PIN.lat}`);
    expect(response.status()).toBe(400);
  });

  test("TC-GEO-004-F8: radiusKm=30 → clamp 10 en meta", async ({ request }) => {
    const response = await request.get(
      `/api/providers?lat=${MONTERREY_PIN.lat}&lng=${MONTERREY_PIN.lng}&radiusKm=30`
    );
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.meta.radiusKm).toBe(10);
  });

  test("TC-GEO-004b: radiusKm=0 → clamp 0.5; 22 → 10", async ({ request }) => {
    const zero = await request.get(
      `/api/providers?lat=${MONTERREY_PIN.lat}&lng=${MONTERREY_PIN.lng}&radiusKm=0`
    );
    expect(zero.status()).toBe(200);
    expect((await zero.json()).meta.radiusKm).toBe(0.5);

    const bookmark = await request.get(
      `/api/providers?lat=${MONTERREY_PIN.lat}&lng=${MONTERREY_PIN.lng}&radiusKm=22`
    );
    expect(bookmark.status()).toBe(200);
    expect((await bookmark.json()).meta.radiusKm).toBe(10);
  });

  test("TC-GEO-004c: 0.5 / 0.7 / 10 se aceptan sin redondear", async ({ request }) => {
    for (const km of [0.5, 0.7, 10]) {
      const response = await request.get(
        `/api/providers?lat=${MONTERREY_PIN.lat}&lng=${MONTERREY_PIN.lng}&radiusKm=${km}`
      );
      expect(response.status()).toBe(200);
      expect((await response.json()).meta.radiusKm).toBe(km);
    }
  });

  test("TC-GEO-005-F8: coords CDMX → 200", async ({ request }) => {
    const response = await request.get(
      `/api/providers?lat=${CDMX_PIN.lat}&lng=${CDMX_PIN.lng}`
    );
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.meta.radiusKm).toBe(10);
  });

  test("TC-GEO-005b: coords fuera de México → 400", async ({ request }) => {
    const response = await request.get(
      `/api/providers?lat=${OUTSIDE_MEXICO_PIN.lat}&lng=${OUTSIDE_MEXICO_PIN.lng}`
    );
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(JSON.stringify(body)).toMatch(/fuera de México/i);
  });

  test("TC-GEO-006: radiusKm sin coords → 400", async ({ request }) => {
    const response = await request.get("/api/providers?radiusKm=10");
    expect(response.status()).toBe(400);
  });

  test("TC-GEO-007: geo AND q=Paraíso", async ({ request }) => {
    const response = await request.get(
      `/api/providers?lat=${MONTERREY_PIN.lat}&lng=${MONTERREY_PIN.lng}&q=${encodeURIComponent("Paraíso")}`
    );
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.length).toBeGreaterThanOrEqual(1);
    expect(body.data[0].businessName).toMatch(/Paraíso/i);
  });

  test("TC-GEO-008: sin geo no envía distanceKm", async ({ request }) => {
    const response = await request.get("/api/providers");
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.meta.radiusKm).toBeUndefined();
    for (const provider of body.data) {
      expect(provider.distanceKm).toBeUndefined();
    }
  });

  test("TC-GEO-009: meta.total independiente de data.length con limit=2", async ({ request }) => {
    const response = await request.get(
      `/api/providers?lat=${MONTERREY_PIN.lat}&lng=${MONTERREY_PIN.lng}&radiusKm=10&limit=2`
    );
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.meta.limit).toBe(2);
    expect(body.data.length).toBeLessThanOrEqual(2);
    expect(body.meta.total).toBeGreaterThanOrEqual(body.data.length);
    if (body.meta.total > 2) {
      expect(body.meta.total).not.toBe(body.data.length);
    }
  });

  test("TC-GEO-009b: q de 1 carácter → 400", async ({ request }) => {
    const response = await request.get(
      `/api/providers?lat=${MONTERREY_PIN.lat}&lng=${MONTERREY_PIN.lng}&q=a`
    );
    expect(response.status()).toBe(400);
  });

  test("TC-GEO-009c: q=mango match producto activo en radio", async ({ request }) => {
    const response = await request.get(
      `/api/providers?lat=${MONTERREY_PIN.lat}&lng=${MONTERREY_PIN.lng}&radiusKm=10&q=mango`
    );
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.length).toBeGreaterThanOrEqual(1);
  });

  test("TC-GEO-012: limit default 20 en explorar con geo", async ({ request }) => {
    const response = await request.get(
      `/api/providers?lat=${MONTERREY_PIN.lat}&lng=${MONTERREY_PIN.lng}&radiusKm=10`
    );
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.meta.limit).toBe(20);
    expect(body.data.length).toBeLessThanOrEqual(20);
  });
});
