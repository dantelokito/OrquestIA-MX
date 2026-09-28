import { test, expect } from "@playwright/test";
import { loginAs, registerUnverifiedProvider, withAuth } from "../../fixtures/auth";
import {
  createLocalProduct,
  createSection,
  ensureOwnSection,
  f10Suffix,
  listSections,
} from "../../fixtures/f10";

test.describe("API SECTIONS F10 — TC-CAT", () => {
  test("TC-CAT-010: POST sección → 201", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const name = `QA Sec ${f10Suffix()}`;
    const response = await createSection(request, name);
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.data.name).toBe(name);
    expect(body.data.productCount).toBe(0);
    expect(body.data.id).toBeTruthy();
  });

  test("TC-CAT-018: DELETE sección con productos → 409", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const created = await createSection(request, `Con SKU ${f10Suffix()}`);
    expect(created.ok()).toBeTruthy();
    const sectionId = (await created.json()).data.id as string;
    const local = await createLocalProduct(request, {
      name: `En sección ${f10Suffix()}`,
      sectionId,
    });
    expect(local.ok()).toBeTruthy();

    const del = await request.delete(`/api/provider/sections/${sectionId}`, withAuth(request));
    expect(del.status()).toBe(409);
  });

  test("TC-CAT-019: DELETE sección vacía", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const created = await createSection(request, `Vacía ${f10Suffix()}`);
    expect(created.ok()).toBeTruthy();
    const sectionId = (await created.json()).data.id as string;
    const del = await request.delete(`/api/provider/sections/${sectionId}`, withAuth(request));
    expect([200, 204]).toContain(del.status());

    const listed = await listSections(request);
    const ids = ((await listed.json()).data as { id: string }[]).map((s) => s.id);
    expect(ids).not.toContain(sectionId);
  });

  test("TC-CAT-020: reorder permutación exacta", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    await createSection(request, `R1 ${f10Suffix()}`);
    await createSection(request, `R2 ${f10Suffix()}`);
    const listed = await listSections(request);
    const ids = ((await listed.json()).data as { id: string }[]).map((s) => s.id);
    test.skip(ids.length < 2, "se necesitan ≥2 secciones");
    const reversed = [...ids].reverse();
    const response = await request.patch(
      "/api/provider/sections/reorder",
      withAuth(request, { data: { ids: reversed } })
    );
    expect(response.status()).toBe(200);
  });

  test("TC-CAT-S03: PATCH sección ajena → 403", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const seedId = await ensureOwnSection(request);
    await registerUnverifiedProvider(request, "f10secid");
    const patch = await request.patch(
      `/api/provider/sections/${seedId}`,
      withAuth(request, { data: { name: "Hack" } })
    );
    expect(patch.status()).toBe(403);
  });

  test("Duplicado de nombre → 409", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const name = `Dup ${f10Suffix()}`;
    const first = await createSection(request, name);
    expect(first.ok()).toBeTruthy();
    const second = await createSection(request, name);
    expect(second.status()).toBe(409);
  });
});
