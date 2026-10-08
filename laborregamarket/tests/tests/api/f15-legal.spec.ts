import { test, expect } from "../../fixtures/suite";
import {
  credentials,
  forwardedFor,
  legalVersions,
  loginAs,
  rememberSessionCookie,
  uniqueEmail,
  withAuth,
} from "../../fixtures/auth";

const PRIVATE_KEYS = ["email", "userId", "ownerEmail", "userEmail", "password", "passwordHash", "whatsappOrderOptIn"];

function expectAdr003(
  body: { error?: unknown; details?: { field: string; message: string }[] },
  field: string,
  message?: string
) {
  expect(typeof body.error).toBe("string");
  expect(Array.isArray(body.details)).toBe(true);
  const detail = body.details?.find((item) => item.field === field);
  expect(detail).toBeTruthy();
  if (message) expect(detail?.message).toBe(message);
}

test.describe("API F15 — legal, consentimiento y caché", () => {
  test("TC-LEGAL-003: GET /api/legal/current público, sin store", async ({ request }) => {
    const response = await request.get("/api/legal/current");
    expect(response.status()).toBe(200);
    expect(response.headers()["cache-control"] ?? "").toMatch(/no-store/);
    const body = await response.json();
    const types = (body.data.documents as { type: string; version: number; title: string }[]).map(
      (doc) => doc.type
    );
    expect(types).toEqual(expect.arrayContaining(["PRIVACY", "TERMS", "COOKIES"]));
    for (const doc of body.data.documents) {
      expect(doc.version).toBeGreaterThan(0);
      expect(doc.title).toBeTruthy();
      expect(doc.effectiveAt).toBeTruthy();
    }
  });

  test("TC-CONSENT-003: registro sin casilla → 400 ADR-003 y no crea usuario", async ({ request }) => {
    const email = uniqueEmail("noconsent");
    const response = await request.post("/api/auth/register", {
      data: { name: "Sin Casilla", email, password: "Test1234!", role: "CLIENT" },
      headers: forwardedFor(),
    });
    expect(response.status()).toBe(400);
    expectAdr003(await response.json(), "acceptLegal", "Debes aceptar los Términos para continuar");

    const login = await request.post("/api/auth/login", {
      data: { email, password: "Test1234!" },
      headers: forwardedFor(),
    });
    expect(login.status()).toBe(401);
  });

  test("TC-CONSENT-004: acceptLegal false o versión inexistente → 400", async ({ request }) => {
    const versions = await legalVersions(request);
    const rejected = await request.post("/api/auth/register", {
      data: {
        name: "Casilla Off",
        email: uniqueEmail("off"),
        password: "Test1234!",
        role: "CLIENT",
        acceptLegal: false,
        ...versions,
      },
      headers: forwardedFor(),
    });
    expect(rejected.status()).toBe(400);
    expectAdr003(await rejected.json(), "acceptLegal", "Debes aceptar los Términos para continuar");

    const stale = await request.post("/api/auth/register", {
      data: {
        name: "Version Vieja",
        email: uniqueEmail("stale"),
        password: "Test1234!",
        role: "CLIENT",
        acceptLegal: true,
        termsVersion: 9999,
        privacyVersion: versions.privacyVersion,
      },
      headers: forwardedFor(),
    });
    expect(stale.status()).toBe(400);
    expectAdr003(await stale.json(), "termsVersion", "La versión ya no está vigente; recarga la página");
  });

  test("TC-CONSENT-001: registro con casilla y versión vigente → 201", async ({ request }) => {
    const versions = await legalVersions(request);
    const email = uniqueEmail("okreg");
    const response = await request.post("/api/auth/register", {
      data: {
        name: "Con Casilla",
        email,
        password: "Test1234!",
        role: "CLIENT",
        acceptLegal: true,
        ...versions,
      },
      headers: forwardedFor(),
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.data.user.email).toBe(email);
    expect(body.data.user.role).toBe("CLIENT");
  });

  test("TC-CONSENT-006: alta sin casilla → 400 ADR-003 y no crea frutería", async ({ request }) => {
    const versions = await legalVersions(request);
    const email = uniqueEmail("alta-no");
    const register = await request.post("/api/auth/register", {
      data: {
        name: "Alta Sin Casilla",
        email,
        password: "Test1234!",
        role: "PROVIDER",
        acceptLegal: true,
        ...versions,
      },
      headers: forwardedFor(),
    });
    expect(register.status()).toBe(201);
    rememberSessionCookie(request, register);

    const rejected = await request.post(
      "/api/providers",
      withAuth(request, {
        data: {
          businessName: "No Debió Crearse",
          address: "Calle Rechazo 1",
          city: "Monterrey",
          latitude: 25.67,
          longitude: -100.31,
        },
        headers: forwardedFor(),
      })
    );
    expect(rejected.status()).toBe(400);
    expectAdr003(await rejected.json(), "acceptTerms", "Debes aceptar los Términos para continuar");

    const me = await request.get("/api/provider/me", withAuth(request));
    expect(me.status()).toBe(404);
  });

  test("TC-CONSENT-002: alta con casilla persiste whatsappOrderOptIn false", async ({ request }) => {
    const versions = await legalVersions(request);
    const email = uniqueEmail("alta-ok");
    const register = await request.post("/api/auth/register", {
      data: {
        name: "Alta Con Casilla",
        email,
        password: "Test1234!",
        role: "PROVIDER",
        acceptLegal: true,
        ...versions,
      },
      headers: forwardedFor(),
    });
    expect(register.status()).toBe(201);
    rememberSessionCookie(request, register);

    const created = await request.post(
      "/api/providers",
      withAuth(request, {
        data: {
          businessName: `Frutería Opt ${Date.now()}`,
          address: "Calle Aceptada 10",
          city: "Monterrey",
          latitude: 25.671,
          longitude: -100.309,
          phone: "8180001122",
          acceptTerms: true,
          termsVersion: versions.termsVersion,
          whatsappOrderOptIn: false,
        },
        headers: forwardedFor(),
      })
    );
    expect(created.status()).toBe(201);
    const body = await created.json();
    expect(body.data.whatsappOrderOptIn).toBe(false);

    const me = await request.get("/api/provider/me", withAuth(request));
    expect(me.status()).toBe(200);
    expect((await me.json()).data.whatsappOrderOptIn).toBe(false);
  });

  test("TC-WA-001: proveedor demo no tiene opt-in de pedidos", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const me = await request.get("/api/provider/me", withAuth(request));
    expect(me.status()).toBe(200);
    const body = await me.json();
    expect(body.data.whatsappOrderOptIn).toBe(false);
    expect(body.data.user?.email ?? body.data.email).not.toBe(credentials.client.email);
  });

  test("TC-LEGAL-007: CLIENT y anónimo no editan datos del responsable", async ({ request }) => {
    const anon = await request.get("/api/admin/legal/settings");
    expect(anon.status()).toBe(401);

    await loginAs(request, "CLIENT");
    const client = await request.get("/api/admin/legal/settings", withAuth(request));
    expect(client.status()).toBe(403);
    const body = await client.json();
    expect(typeof body.error).toBe("string");

    const put = await request.put(
      "/api/admin/legal/settings",
      withAuth(request, {
        data: { legalName: "No Debió" },
      })
    );
    expect(put.status()).toBe(403);
  });

  test.describe("settings admin", () => {
    test.describe.configure({ mode: "serial" });

  test("TC-LEGAL-008: ADMIN lee settings; payload inválido 400 y no persiste", async ({ request }) => {
    await loginAs(request, "ADMIN");
    const before = await request.get("/api/admin/legal/settings", withAuth(request));
    expect(before.status()).toBe(200);
    const beforeBody = await before.json();
    expect(beforeBody.data).toBeTruthy();

    const invalid = await request.put(
      "/api/admin/legal/settings",
      withAuth(request, {
        data: {
          personType: "FISICA",
          legalName: "X",
          address: "corto",
          arcoEmail: "no-es-correo",
          phone: "123",
          effectiveAt: "1999-01-01",
        },
      })
    );
    expect(invalid.status()).toBe(400);
    const errorBody = await invalid.json();
    expect(typeof errorBody.error).toBe("string");
    expect(errorBody.details?.length).toBeGreaterThan(0);

    const after = await request.get("/api/admin/legal/settings", withAuth(request));
    expect(await after.json()).toEqual(beforeBody);
  });

  test("TC-LEGAL-009: ADMIN guarda responsable válido", async ({ request }) => {
    await loginAs(request, "ADMIN");
    const payload = {
      personType: "MORAL",
      legalName: "LaBorregaMarket QA",
      rfc: "LBM260101AB1",
      address: "Av. Constitución 100, Monterrey",
      arcoEmail: "arco@laborregamarket.mx",
      phone: "8110000000",
      effectiveAt: new Date().toISOString().slice(0, 10),
    };
    const saved = await request.put("/api/admin/legal/settings", withAuth(request, { data: payload }));
    expect(saved.status()).toBe(200);
    const body = await saved.json();
    expect(body.data.legalName).toBe(payload.legalName);
    expect(body.data.address).toBe(payload.address);
    expect(body.data.isComplete).toBe(true);
  });
  });

  test("TC-CACHE-001: listado público trae X-Cache y no filtra ni filtra datos ajenos", async ({ request }) => {
    await request.get("/api/providers?limit=20");
    const first = await request.get("/api/providers?limit=20");
    const second = await request.get("/api/providers?limit=20");
    expect(first.status()).toBe(200);
    expect(second.status()).toBe(200);

    const h1 = first.headers()["x-cache"];
    const h2 = second.headers()["x-cache"];
    expect(["HIT", "MISS", "BYPASS"]).toContain(h1);
    expect(["HIT", "MISS", "BYPASS"]).toContain(h2);
    if (h1 === "BYPASS") expect(h2).toBe("BYPASS");
    else expect(h2).toBe("HIT");

    const anon = await first.json();
    expect(anon.data.length).toBeGreaterThan(1);
    for (const row of anon.data as Record<string, unknown>[]) {
      for (const key of PRIVATE_KEYS) expect(row[key]).toBeUndefined();
      expect(JSON.stringify(row)).not.toContain("@");
    }

    await loginAs(request, "CLIENT");
    const asClient = await request.get("/api/providers?limit=20", withAuth(request));
    expect(asClient.status()).toBe(200);
    expect(asClient.headers()["x-cache"]).toBeTruthy();
    const clientBody = await asClient.json();
    expect(clientBody.data).toEqual(anon.data);

    await loginAs(request, "PROVIDER");
    const asProvider = await request.get("/api/providers?limit=50", withAuth(request));
    expect(asProvider.status()).toBe(200);
    const names = ((await asProvider.json()).data as { businessName: string }[]).map((row) => row.businessName);
    const listed = await request.get("/api/providers?q=Para%C3%ADso&limit=20");
    expect(listed.status()).toBe(200);
    const listedNames = ((await listed.json()).data as { businessName: string }[]).map((row) => row.businessName);
    expect(names.length + listedNames.length).toBeGreaterThan(0);
    expect([...names, ...listedNames].some((name) => /para[ií]so/i.test(name))).toBe(true);
  });

  test("TC-CACHE-003: q de 1 carácter → 400 sin X-Cache; catalogs no se cachea", async ({ request }) => {
    const short = await request.get("/api/providers?q=a");
    expect(short.status()).toBe(400);
    expect(short.headers()["x-cache"]).toBeUndefined();
    const shortBody = await short.json();
    expect(typeof shortBody.error).toBe("string");
    expect(shortBody.details?.[0]?.field).toBe("q");

    const catalogs = await request.get("/api/catalogs");
    expect([401, 403]).toContain(catalogs.status());
    expect(catalogs.headers()["x-cache"]).toBeUndefined();
  });

  test("TC-CACHE-004: logout no deja la API de la sesión anterior", async ({ request }) => {
    await loginAs(request, "CLIENT");
    const me = await request.get("/api/users/me", withAuth(request));
    expect(me.status()).toBe(200);
    const mine = await me.json();
    expect(mine.data.email).toBe(credentials.client.email);

    const logout = await request.post("/api/auth/logout", withAuth(request));
    expect(logout.status()).toBe(200);

    const after = await request.get("/api/users/me", { headers: { Cookie: "" } });
    expect(after.status()).toBe(401);
    const afterText = await after.text();
    expect(afterText).not.toContain(credentials.client.email);

    const publicList = await request.get("/api/providers?limit=5");
    expect(publicList.status()).toBe(200);
    expect(await publicList.text()).not.toContain(credentials.client.email);
  });
});
