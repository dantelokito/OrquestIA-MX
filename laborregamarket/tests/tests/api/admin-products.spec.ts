import { test, expect } from "@playwright/test";
import { loginAs, withAuth } from "../../fixtures/auth";
import {
  createLocalProduct,
  ensureOwnSection,
  f10Suffix,
} from "../../fixtures/f10";

test.describe("API ADMIN PRODUCTS F10 — TC-ADM / TC-SEC", () => {
  test.describe.configure({ mode: "serial" });

  let createdId: string | undefined;
  let createdName: string;

  test("TC-ADM-020: POST producto GLOBAL → 201", async ({ request }) => {
    await loginAs(request, "ADMIN");
    createdName = `QA F10 Mango ${f10Suffix()}`;
    const slug = `qa-f10-mango-${f10Suffix()}`;
    const response = await request.post(
      "/api/admin/products",
      withAuth(request, {
        data: {
          name: createdName,
          slug,
          category: "FRUTA",
          unit: "KG",
        },
      })
    );
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.data.scope).toBe("GLOBAL");
    expect(body.data.name).toBe(createdName);
    expect(body.data.isActive).toBe(true);
    createdId = body.data.id as string;
    expect(createdId).toBeTruthy();
  });

  test("TC-ADM-022 / TC-SEC-002: GET listado solo GLOBAL", async ({ request }) => {
    await loginAs(request, "ADMIN");
    const response = await request.get("/api/admin/products?page=1&limit=50", withAuth(request));
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.meta).toBeDefined();
    for (const row of body.data as { scope?: string }[]) {
      if (row.scope) expect(row.scope).toBe("GLOBAL");
    }
    if (createdName) {
      expect((body.data as { name: string }[]).some((p) => p.name === createdName)).toBe(true);
    }
  });

  test("TC-SEC-001: catalogs=products no incluye LOCAL", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const sectionId = await ensureOwnSection(request);
    const localName = `Chile QA local ${f10Suffix()}`;
    const created = await createLocalProduct(request, { name: localName, sectionId });
    expect(created.ok()).toBeTruthy();

    await loginAs(request, "ADMIN");
    const response = await request.get("/api/catalogs?catalog=products", withAuth(request));
    expect(response.status()).toBe(200);
    const body = await response.json();
    const rows = Array.isArray(body.data) ? body.data : [];
    const names = rows.map((r: { name?: string; scope?: string }) => r.name);
    expect(names).not.toContain(localName);
    for (const row of rows as { scope?: string }[]) {
      if (row.scope) expect(row.scope).toBe("GLOBAL");
    }
  });

  test("TC-ADM-021: PATCH isActive=false", async ({ request }) => {
    await loginAs(request, "ADMIN");
    test.skip(!createdId, "depende de TC-ADM-020");
    const response = await request.patch(
      `/api/admin/products/${createdId}`,
      withAuth(request, { data: { isActive: false } })
    );
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.isActive).toBe(false);
  });

  test("TC-ADM-023: POST name vacío → 400", async ({ request }) => {
    await loginAs(request, "ADMIN");
    const response = await request.post(
      "/api/admin/products",
      withAuth(request, { data: { name: "", category: "FRUTA", unit: "KG" } })
    );
    expect(response.status()).toBe(400);
  });

  test("TC-ADM-024: category inválida → 400", async ({ request }) => {
    await loginAs(request, "ADMIN");
    const response = await request.post(
      "/api/admin/products",
      withAuth(request, { data: { name: "X", category: "OTRO", unit: "KG" } })
    );
    expect(response.status()).toBe(400);
  });

  test("TC-ADM-025: DELETE HTTP → 405", async ({ request }) => {
    await loginAs(request, "ADMIN");
    test.skip(!createdId, "depende de TC-ADM-020");
    const response = await request.delete(`/api/admin/products/${createdId}`, withAuth(request));
    expect(response.status()).toBe(405);
  });

  test("TC-SEC-008: AUDIT tras alta admin", async ({ request }) => {
    await loginAs(request, "ADMIN");
    const response = await request.get("/api/admin/audit?page=1&limit=20", withAuth(request));
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
  });

  test("TC-ADM-028: PATCH flags mayoreo/domicilio", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const me = await request.get("/api/provider/me", withAuth(request));
    expect(me.ok()).toBeTruthy();
    const providerId = (await me.json()).data.id as string;
    await loginAs(request, "ADMIN");
    const listed = await request.get("/api/admin/providers?page=1&limit=50", withAuth(request));
    expect(listed.status()).toBe(200);
    const listBody = await listed.json();
    const row = (listBody.data as { id: string; offersWholesale?: boolean }[]).find(
      (p) => p.id === providerId
    );
    const nextWholesale = !(row?.offersWholesale ?? false);

    const patch = await request.patch(
      `/api/admin/providers/${providerId}`,
      withAuth(request, {
        data: { offersWholesale: nextWholesale, offersDelivery: false, isActive: true },
      })
    );
    expect(patch.status()).toBe(200);
    const body = await patch.json();
    expect(body.data.offersWholesale).toBe(nextWholesale);
    expect(body.data.offersDelivery).toBe(false);
    expect(body.data.isActive).toBe(true);

    await request.patch(
      `/api/admin/providers/${providerId}`,
      withAuth(request, {
        data: { offersWholesale: row?.offersWholesale ?? false },
      })
    );
  });

  test("TC-ADM-029: isVerified=false apaga Google", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const me = await request.get("/api/provider/me", withAuth(request));
    const providerId = (await me.json()).data.id as string;

    await loginAs(request, "ADMIN");
    const off = await request.patch(
      `/api/admin/providers/${providerId}`,
      withAuth(request, { data: { isVerified: false } })
    );
    expect(off.status()).toBe(200);
    const offBody = await off.json();
    expect(offBody.data.isVerified).toBe(false);
    expect(offBody.data.googleReviewsEnabled).toBe(false);

    const on = await request.patch(
      `/api/admin/providers/${providerId}`,
      withAuth(request, { data: { isVerified: true } })
    );
    expect(on.status()).toBe(200);
    expect((await on.json()).data.isVerified).toBe(true);
  });
});
