import { test, expect } from "@playwright/test";
import { loginAs, registerUnverifiedProvider } from "../../fixtures/auth";

const SAMPLE_PLACE_ID = "ChIJN1t_tDeuEmsRUsoyG83frY4";

test.describe("API PROVIDER SETTINGS — TC-SET", () => {
  test("TC-SET-001: GET /api/provider/me campos F4", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const response = await request.get("/api/provider/me");
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data).toHaveProperty("preparationTimeMinutes");
    expect(body.data).toHaveProperty("offersDelivery");
    expect(body.data).toHaveProperty("googleReviewsLocked");
    expect(typeof body.data.isVerified).toBe("boolean");
  });

  test("TC-SET-002: PATCH preparationTimeMinutes verificado → 200", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const current = await request.get("/api/provider/me");
    const me = await current.json();
    const next = me.data.preparationTimeMinutes === 20 ? 25 : 20;

    const response = await request.patch("/api/provider/me", {
      data: { preparationTimeMinutes: next },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.preparationTimeMinutes).toBe(next);

    await request.patch("/api/provider/me", {
      data: { preparationTimeMinutes: me.data.preparationTimeMinutes },
    });
  });

  test("TC-SET-003: PATCH Google si no verificado → 403", async ({ request }) => {
    await registerUnverifiedProvider(request, "gateg");
    const response = await request.patch("/api/provider/me", {
      data: {
        googlePlaceId: SAMPLE_PLACE_ID,
        googleReviewsEnabled: true,
      },
    });
    expect(response.status()).toBe(403);
    const body = await response.json();
    expect(body.error).toMatch(/verificación/i);
  });

  test("TC-SET-004: PATCH prep fuera de 5–120 → 400", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const response = await request.patch("/api/provider/me", {
      data: { preparationTimeMinutes: 3 },
    });
    expect(response.status()).toBe(400);
  });

  test("TC-SET-005: GET offersDelivery es boolean", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const response = await request.get("/api/provider/me");
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(typeof body.data.offersDelivery).toBe("boolean");
  });
});

const VALID_PRIMARY = "#1B5E20";
const VALID_SECONDARY = "#0D47A1";

async function resetBrand(request: Parameters<typeof loginAs>[0]) {
  await request.patch("/api/provider/me", {
    data: { primaryColor: null, secondaryColor: null },
  });
}

test.describe("API PROVIDER SETTINGS F5 — TC-BRAND", () => {
  test("TC-BRAND-001: GET me incluye primaryColor y secondaryColor", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const response = await request.get("/api/provider/me");
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data).toHaveProperty("primaryColor");
    expect(body.data).toHaveProperty("secondaryColor");
  });

  test("TC-BRAND-002: PATCH par válido → canonical uppercase + session brand", async ({
    request,
  }) => {
    await loginAs(request, "PROVIDER");
    try {
      const response = await request.patch("/api/provider/me", {
        data: { primaryColor: "#1b5e20", secondaryColor: "#0d47a1" },
      });
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.data.primaryColor).toBe(VALID_PRIMARY);
      expect(body.data.secondaryColor).toBe(VALID_SECONDARY);

      const session = await request.get("/api/auth/session");
      expect(session.status()).toBe(200);
      const sess = await session.json();
      expect(sess.data.brand).toMatchObject({
        primaryColor: VALID_PRIMARY,
        secondaryColor: VALID_SECONDARY,
        source: "provider",
      });
    } finally {
      await resetBrand(request);
    }
  });

  test("TC-BRAND-003: primario #F9A825 → 400 contraste", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const response = await request.patch("/api/provider/me", {
      data: { primaryColor: "#F9A825", secondaryColor: VALID_SECONDARY },
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(JSON.stringify(body)).toMatch(/primaryColor|contraste/i);
    const after = await request.get("/api/provider/me");
    const next = await after.json();
    expect(next.data.primaryColor).not.toBe("#F9A825");
  });

  test("TC-BRAND-004: secundario #FFFF00 → 400", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const response = await request.patch("/api/provider/me", {
      data: { primaryColor: VALID_PRIMARY, secondaryColor: "#FFFF00" },
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(JSON.stringify(body)).toMatch(/secondaryColor|contraste|acento/i);
  });

  test("TC-BRAND-005: solo un color del par → 400", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const response = await request.patch("/api/provider/me", {
      data: { primaryColor: VALID_PRIMARY },
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(JSON.stringify(body)).toMatch(/primario y secundario|restablecer ambos/i);
  });

  test("TC-BRAND-006: hex inválido #RGB → 400", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const response = await request.patch("/api/provider/me", {
      data: { primaryColor: "#1B5", secondaryColor: VALID_SECONDARY },
    });
    expect(response.status()).toBe(400);
  });

  test("TC-BRAND-007: reset ambos null", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    await request.patch("/api/provider/me", {
      data: { primaryColor: VALID_PRIMARY, secondaryColor: VALID_SECONDARY },
    });
    const response = await request.patch("/api/provider/me", {
      data: { primaryColor: null, secondaryColor: null },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.primaryColor).toBeNull();
    expect(body.data.secondaryColor).toBeNull();
  });

  test("TC-BRAND-008: PROVIDER no verificado PATCH solo colores → 200", async ({ request }) => {
    await registerUnverifiedProvider(request, "brand");
    const response = await request.patch("/api/provider/me", {
      data: { primaryColor: VALID_PRIMARY, secondaryColor: VALID_SECONDARY },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.primaryColor).toBe(VALID_PRIMARY);
  });

  test("TC-RBAC-026: ADMIN PATCH colores → 200", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const me = await request.get("/api/provider/me");
    const business = await me.json();
    const providerId = business.data.id as string;
    await resetBrand(request);

    await loginAs(request, "ADMIN");
    try {
      const response = await request.patch(`/api/admin/providers/${providerId}`, {
        data: { primaryColor: VALID_PRIMARY, secondaryColor: VALID_SECONDARY },
      });
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.data.primaryColor ?? body.data.provider?.primaryColor).toBe(VALID_PRIMARY);
    } finally {
      await loginAs(request, "PROVIDER");
      await resetBrand(request);
    }
  });

  test("TC-RBAC-027: Google gate 403 intacto; colores-only no 403", async ({ request }) => {
    await registerUnverifiedProvider(request, "gbrand");
    const google = await request.patch("/api/provider/me", {
      data: {
        googlePlaceId: SAMPLE_PLACE_ID,
        googleReviewsEnabled: true,
      },
    });
    expect(google.status()).toBe(403);

    const colors = await request.patch("/api/provider/me", {
      data: { primaryColor: VALID_PRIMARY, secondaryColor: VALID_SECONDARY },
    });
    expect(colors.status()).toBe(200);
  });

  test("TC-RBAC-028: ADMIN isVerified=false conserva colores", async ({ request }) => {
    const { providerId } = await registerUnverifiedProvider(request, "keepc");
    const painted = await request.patch("/api/provider/me", {
      data: { primaryColor: VALID_PRIMARY, secondaryColor: VALID_SECONDARY },
    });
    expect(painted.status()).toBe(200);

    await loginAs(request, "ADMIN");
    const unverify = await request.patch(`/api/admin/providers/${providerId}`, {
      data: { isVerified: false },
    });
    expect(unverify.ok()).toBeTruthy();
    const body = await unverify.json();
    const primary = body.data.primaryColor ?? body.data.provider?.primaryColor;
    const secondary = body.data.secondaryColor ?? body.data.provider?.secondaryColor;
    expect(primary).toBe(VALID_PRIMARY);
    expect(secondary).toBe(VALID_SECONDARY);
  });
});
