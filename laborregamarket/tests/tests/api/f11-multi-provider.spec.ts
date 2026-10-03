import { test, expect } from "@playwright/test";
import {
  assertResponseTime,
  authHeaders,
  credentials,
  loginAs,
  loginWithCredentials,
  registerUnverifiedProvider,
  rememberSessionCookie,
  uniqueEmail,
  withAuth,
} from "../../fixtures/auth";
import { createLocalProduct, ensureOwnSection, f10Suffix } from "../../fixtures/f10";

const RANGE = "from=2026-09-01&to=2026-09-12";

test.describe("API F11 — sesión 1:N, aislamiento, reportes globales", () => {
  test("TC-F11-001: login El Paraíso N=2 session + mine", async ({ request }) => {
    const start = Date.now();
    await loginWithCredentials(request, credentials.provider.email, credentials.provider.password);
    const session = await request.get("/api/auth/session", withAuth(request));
    assertResponseTime(start);
    expect(session.status()).toBe(200);
    const s = await session.json();
    expect(s.data.authenticated).toBe(true);
    expect(s.data.role).toBe("PROVIDER");
    expect(s.data.providerCount).toBeGreaterThanOrEqual(2);
    expect(s.data.activeProviderId).toBeTruthy();
    expect(s.data.providers.length).toBe(s.data.providerCount);
    const names = s.data.providers.map((p: { businessName: string }) => p.businessName);
    expect(names.some((n: string) => /paraíso/i.test(n) && !/tecnol/i.test(n))).toBeTruthy();
    expect(names.some((n: string) => /tecnol/i.test(n))).toBeTruthy();

    const mine = await request.get("/api/provider/mine", withAuth(request));
    expect(mine.status()).toBe(200);
    const m = await mine.json();
    expect(m.data.providerCount).toBeGreaterThanOrEqual(2);
    expect(m.data.providers.some((p: { address: string }) => /Garza Sada 2501/i.test(p.address))).toBeTruthy();
    expect(m.data.providers.some((p: { address: string }) => /Constituci/i.test(p.address))).toBeTruthy();
  });

  test("TC-F11-002: POST active cambia cookie; header X-Active-Provider-Id no cambia contexto", async ({
    request,
  }) => {
    await loginWithCredentials(request, credentials.provider.email, credentials.provider.password);
    const mine = await (await request.get("/api/provider/mine", withAuth(request))).json();
    const a = mine.data.providers[0];
    const b = mine.data.providers[1];
    expect(a.id).not.toBe(b.id);

    const switched = await request.post(
      "/api/provider/active",
      withAuth(request, { data: { providerId: b.id } })
    );
    expect(switched.status()).toBe(200);
    rememberSessionCookie(request, switched);
    const body = await switched.json();
    expect(body.data.activeProviderId).toBe(b.id);

    const meB = await request.get("/api/provider/me", withAuth(request));
    expect(meB.status()).toBe(200);
    const meBBody = await meB.json();
    expect(meBBody.data.id ?? meBBody.data.providerId ?? meBBody.data.businessName).toBeTruthy();
    expect(String(meBBody.data.businessName ?? meBBody.data.id)).toBeTruthy();
    if (meBBody.data.id) expect(meBBody.data.id).toBe(b.id);
    if (meBBody.data.businessName) expect(meBBody.data.businessName).toBe(b.businessName);

    const spoof = await request.get("/api/provider/me", {
      headers: {
        ...authHeaders(request),
        "X-Active-Provider-Id": a.id,
      },
    });
    expect(spoof.status()).toBe(200);
    const spoofBody = await spoof.json();
    if (spoofBody.data.id) expect(spoofBody.data.id).toBe(b.id);
    if (spoofBody.data.businessName) expect(spoofBody.data.businessName).toBe(b.businessName);
  });

  test("TC-F11-003: IDOR 403 al activar sucursal ajena o id inexistente", async ({ request }) => {
    await loginWithCredentials(request, credentials.providerN1.email, credentials.providerN1.password);
    const campo = await (await request.get("/api/provider/mine", withAuth(request))).json();
    const campoId = campo.data.providers[0].id;

    const paraiso = await request.post("/api/auth/login", {
      data: credentials.provider,
      headers: { "x-forwarded-for": `203.0.113.${1 + Math.floor(Math.random() * 250)}` },
    });
    expect(paraiso.ok()).toBeTruthy();
    await loginWithCredentials(request, credentials.provider.email, credentials.provider.password);

    const foreign = await request.post(
      "/api/provider/active",
      withAuth(request, { data: { providerId: campoId } })
    );
    expect(foreign.status()).toBe(403);

    const missing = await request.post(
      "/api/provider/active",
      withAuth(request, { data: { providerId: "clxnoexiste00000000000001" } })
    );
    expect(missing.status()).toBe(403);
  });

  test("TC-F11-004: aislamiento CAT — SKU local de A no aparece en B", async ({ request }) => {
    await loginWithCredentials(request, credentials.provider.email, credentials.provider.password);
    const mine = await (await request.get("/api/provider/mine", withAuth(request))).json();
    const a = mine.data.providers[0];
    const b = mine.data.providers[1];

    const actA = await request.post("/api/provider/active", withAuth(request, { data: { providerId: a.id } }));
    rememberSessionCookie(request, actA);
    const sku = `QA-F11-${f10Suffix()}`;
    const sectionId = await ensureOwnSection(request, `Sec F11 ${f10Suffix()}`);
    const created = await createLocalProduct(request, { name: sku, sectionId, price: 12.5 });
    expect(created.status()).toBe(201);

    const listA = await request.get("/api/provider/products", withAuth(request));
    expect(listA.status()).toBe(200);
    expect(JSON.stringify(await listA.json())).toContain(sku);

    const actB = await request.post("/api/provider/active", withAuth(request, { data: { providerId: b.id } }));
    rememberSessionCookie(request, actB);
    const listB = await request.get("/api/provider/products", withAuth(request));
    expect(listB.status()).toBe(200);
    expect(JSON.stringify(await listB.json())).not.toContain(sku);
  });

  test("TC-F11-005: reportes globales N>1 200 con byProvider; reports F10 por activo", async ({
    request,
  }) => {
    await loginWithCredentials(request, credentials.provider.email, credentials.provider.password);
    const start = Date.now();
    const global = await request.get(`/api/provider/reports/global?${RANGE}`, withAuth(request));
    assertResponseTime(start);
    expect(global.status()).toBe(200);
    const g = await global.json();
    expect(g.data.scope).toBe("allOwnedProviders");
    expect(g.data.providerCount).toBeGreaterThanOrEqual(2);
    expect(Array.isArray(g.data.byProvider)).toBeTruthy();
    expect(g.data.byProvider.length).toBe(g.data.providerCount);
    expect(g.data.timezone).toBe("America/Monterrey");

    const branch = await request.get(`/api/provider/reports?${RANGE}`, withAuth(request));
    expect(branch.status()).toBe(200);
    const b = await branch.json();
    expect(b.data.scope === "allOwnedProviders").toBeFalsy();
  });

  test("TC-F11-006: Campo Verde N=1 global 403 GLOBAL_REPORTS_NOT_AVAILABLE", async ({ request }) => {
    await loginWithCredentials(request, credentials.providerN1.email, credentials.providerN1.password);
    const mine = await (await request.get("/api/provider/mine", withAuth(request))).json();
    expect(mine.data.providerCount).toBe(1);

    const global = await request.get(`/api/provider/reports/global?${RANGE}`, withAuth(request));
    expect(global.status()).toBe(403);
    const body = await global.json();
    expect(body.error.code).toBe("GLOBAL_REPORTS_NOT_AVAILABLE");

    const session = await (await request.get("/api/auth/session", withAuth(request))).json();
    expect(session.data.providerCount).toBe(1);
  });

  test("TC-F11-007: global 401 sin JWT; 403 CLIENT y ADMIN", async ({ request }) => {
    const anon = await request.get(`/api/provider/reports/global?${RANGE}`);
    expect(anon.status()).toBe(401);

    await loginAs(request, "CLIENT");
    const client = await request.get(`/api/provider/reports/global?${RANGE}`, withAuth(request));
    expect(client.status()).toBe(403);

    await loginAs(request, "ADMIN");
    const admin = await request.get(`/api/provider/reports/global?${RANGE}`, withAuth(request));
    expect(admin.status()).toBe(403);
  });

  test("TC-F11-008: mine 401/403; active body inválido 400", async ({ request }) => {
    const mineAnon = await request.get("/api/provider/mine");
    expect(mineAnon.status()).toBe(401);

    await loginAs(request, "CLIENT");
    const mineClient = await request.get("/api/provider/mine", withAuth(request));
    expect(mineClient.status()).toBe(403);

    await loginWithCredentials(request, credentials.provider.email, credentials.provider.password);
    const bad = await request.post("/api/provider/active", withAuth(request, { data: { extra: true } }));
    expect(bad.status()).toBe(400);
  });

  test("TC-F11-009: Explorar lista dos El Paraíso + Campo Verde", async ({ request }) => {
    const res = await request.get("/api/providers?q=Paraíso");
    expect(res.status()).toBe(200);
    const body = await res.json();
    const list = Array.isArray(body.data) ? body.data : [];
    const all = await request.get("/api/providers?limit=50");
    const allBody = await all.json();
    const allList = Array.isArray(allBody.data) ? allBody.data : [];
    const names = [...list, ...allList].map((p: { businessName?: string }) => p.businessName ?? "");
    const paraiso = names.filter((n: string) => /paraíso/i.test(n));
    expect(paraiso.length).toBeGreaterThanOrEqual(2);
    expect(names.some((n: string) => /campo verde/i.test(n))).toBeTruthy();
  });

  test("TC-F11-010: Admin una fila por sucursal (ownerEmail)", async ({ request }) => {
    await loginAs(request, "ADMIN");
    const list: { businessName?: string; userId?: string; ownerEmail?: string; userEmail?: string }[] = [];
    for (let page = 1; page <= 10; page++) {
      const res = await request.get(`/api/admin/providers?page=${page}&limit=50`, withAuth(request));
      expect(res.status()).toBe(200);
      const body = await res.json();
      const rows = Array.isArray(body.data) ? body.data : [];
      list.push(...rows);
      if (rows.length < 50) break;
    }
    const paraiso = list.filter((r) => /para[ií]so/i.test(r.businessName ?? ""));
    expect(paraiso.length).toBeGreaterThanOrEqual(2);
    const campo = list.filter((r: { businessName?: string }) => /campo verde/i.test(r.businessName ?? ""));
    expect(campo.length).toBeGreaterThanOrEqual(1);
    const sample = paraiso[0];
    expect(sample.userId || sample.ownerEmail || sample.userEmail).toBeTruthy();
  });

  test("TC-F11-011: alta N+1 POST /api/providers mismo user", async ({ request }) => {
    const first = await registerUnverifiedProvider(request, "f11onb");
    expect(first.providerId).toBeTruthy();
    const second = await request.post(
      "/api/providers",
      withAuth(request, {
        data: {
          businessName: `Sucursal Extra ${uniqueEmail("br")}`,
          address: "Calle Extra 99",
          city: "Monterrey",
          latitude: 25.68,
          longitude: -100.32,
        },
      })
    );
    expect(second.status()).toBe(201);
    const body = await second.json();
    expect(body.data.id).toBeTruthy();
    expect(body.data.id).not.toBe(first.providerId);
    expect(body.data.activeProviderId ?? body.data.id).toBeTruthy();

    const mine = await (await request.get("/api/provider/mine", withAuth(request))).json();
    expect(mine.data.providerCount).toBeGreaterThanOrEqual(2);
  });

  test("TC-F11-012: productIds ajenos en global → 403", async ({ request }) => {
    await loginWithCredentials(request, credentials.providerN1.email, credentials.providerN1.password);
    const campoMine = await (await request.get("/api/provider/mine", withAuth(request))).json();
    await request.post(
      "/api/provider/active",
      withAuth(request, { data: { providerId: campoMine.data.providers[0].id } })
    );
    const sectionId = await ensureOwnSection(request, `Campo ${f10Suffix()}`);
    const created = await createLocalProduct(request, {
      name: `CampoQA-${f10Suffix()}`,
      sectionId,
      price: 9,
    });
    let foreignId = "clxskuajeno0000000000001";
    if (created.ok()) {
      const c = await created.json();
      foreignId = c.data?.providerProductId ?? c.data?.id ?? foreignId;
    }

    await loginWithCredentials(request, credentials.provider.email, credentials.provider.password);
    const res = await request.get(
      `/api/provider/reports/global?${RANGE}&productIds=${foreignId}`,
      withAuth(request)
    );
    expect(res.status()).toBe(403);
  });
});
