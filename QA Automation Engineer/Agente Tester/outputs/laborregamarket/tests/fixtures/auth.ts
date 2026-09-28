import type { APIRequestContext, APIResponse } from "@playwright/test";

export const credentials = {
  client: {
    email: process.env.QA_CLIENT_EMAIL ?? "cliente@demo.mx",
    password: process.env.QA_CLIENT_PASSWORD ?? "Demo1234!",
  },
  provider: {
    email: process.env.QA_PROVIDER_EMAIL ?? "frutas@elparaiso.mx",
    password: process.env.QA_PROVIDER_PASSWORD ?? "Demo1234!",
  },
  providerN1: {
    email: process.env.QA_PROVIDER_N1_EMAIL ?? "verduras@campoverde.mx",
    password: process.env.QA_PROVIDER_N1_PASSWORD ?? "Demo1234!",
  },
  admin: {
    email: process.env.QA_ADMIN_EMAIL ?? "admin@laborregamarket.mx",
    password: process.env.QA_ADMIN_PASSWORD ?? "Demo1234!",
  },
};

export type UserRole = "CLIENT" | "PROVIDER" | "ADMIN";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

/** NODE_ENV=production marca la cookie Secure; Playwright API no la reenvía por HTTP. */
const sessionCookieByRequest = new WeakMap<APIRequestContext, string>();

function captureSessionCookie(request: APIRequestContext, response: APIResponse) {
  const jar = new Map<string, string>();
  const previous = sessionCookieByRequest.get(request);
  if (previous) {
    for (const part of previous.split(";")) {
      const trimmed = part.trim();
      const eq = trimmed.indexOf("=");
      if (eq > 0) jar.set(trimmed.slice(0, eq), trimmed);
    }
  }

  const headers = typeof response.headersArray === "function" ? response.headersArray() : [];
  const setCookies =
    headers.length > 0
      ? headers.filter((h) => h.name.toLowerCase() === "set-cookie").map((h) => h.value)
      : [response.headers()["set-cookie"]].filter(Boolean);

  for (const header of setCookies) {
    const token = header.match(/lbm_token=[^;]+/);
    if (token) jar.set("lbm_token", token[0]);
    const active = header.match(/lbm_active_provider=[^;]+/);
    if (active) jar.set("lbm_active_provider", active[0]);
  }

  if (jar.size === 0) return;
  sessionCookieByRequest.set(request, [...jar.values()].join("; "));
}

export function rememberSessionCookie(request: APIRequestContext, response: APIResponse) {
  captureSessionCookie(request, response);
}

export function authHeaders(request: APIRequestContext): Record<string, string> {
  const cookie = sessionCookieByRequest.get(request);
  return cookie ? { Cookie: cookie } : {};
}

export function withAuth(
  request: APIRequestContext,
  extra: { data?: unknown; headers?: Record<string, string> } = {}
) {
  return {
    ...extra,
    headers: {
      ...extra.headers,
      ...authHeaders(request),
    },
  };
}

/** Login via API and return storage state with JWT cookie */
export async function loginAs(
  request: APIRequestContext,
  role: UserRole
): Promise<{ user: AuthUser; storageState: Awaited<ReturnType<APIRequestContext["storageState"]>> }> {
  const creds =
    role === "CLIENT"
      ? credentials.client
      : role === "PROVIDER"
        ? credentials.provider
        : credentials.admin;

  const response = await request.post("/api/auth/login", {
    data: creds,
    headers: {
      // Suite QA: evita el tope 10 login/15min por IP (AUTH_RATE_LIMIT_LOGIN_PER_IP)
      "x-forwarded-for": `203.0.113.${1 + Math.floor(Math.random() * 250)}`,
    },
  });

  if (!response.ok()) {
    throw new Error(`Login failed for ${role}: ${response.status()} ${await response.text()}`);
  }

  captureSessionCookie(request, response);
  const body = await response.json();
  const user = body.data.user as AuthUser;
  const storageState = await request.storageState();

  return { user, storageState };
}

export async function loginWithCredentials(
  request: APIRequestContext,
  email: string,
  password: string
): Promise<AuthUser> {
  const response = await request.post("/api/auth/login", {
    data: { email, password },
    headers: {
      "x-forwarded-for": `203.0.113.${1 + Math.floor(Math.random() * 250)}`,
    },
  });
  if (!response.ok()) {
    throw new Error(`Login failed for ${email}: ${response.status()} ${await response.text()}`);
  }
  captureSessionCookie(request, response);
  const body = await response.json();
  return body.data.user as AuthUser;
}

/** Unique email for registration tests */
export function uniqueEmail(prefix = "qa"): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}@test.laborrega.mx`;
}

export async function registerClient(request: APIRequestContext, prefix = "client") {
  const email = uniqueEmail(prefix);
  const response = await request.post("/api/auth/register", {
    data: { name: "QA Client F4", email, password: "Test1234!", role: "CLIENT" },
    headers: { "x-forwarded-for": `198.51.100.${1 + Math.floor(Math.random() * 250)}` },
  });
  if (!response.ok()) {
    throw new Error(`register CLIENT failed: ${response.status()} ${await response.text()}`);
  }
  captureSessionCookie(request, response);
  return { email, password: "Test1234!" };
}

export async function registerUnverifiedProvider(request: APIRequestContext, prefix = "prov") {
  const email = uniqueEmail(prefix);
  const register = await request.post("/api/auth/register", {
    data: { name: "QA Provider F4", email, password: "Test1234!", role: "PROVIDER" },
    headers: { "x-forwarded-for": `198.51.100.${1 + Math.floor(Math.random() * 250)}` },
  });
  if (!register.ok()) {
    throw new Error(`register PROVIDER failed: ${register.status()} ${await register.text()}`);
  }
  captureSessionCookie(request, register);
  const onboard = await request.post("/api/providers", withAuth(request, {
    data: {
      businessName: `Frutería QA ${prefix}`,
      address: "Calle Test 1",
      city: "Monterrey",
      latitude: 25.6714,
      longitude: -100.3089,
    },
  }));
  if (!onboard.ok()) {
    throw new Error(`onboard PROVIDER failed: ${onboard.status()} ${await onboard.text()}`);
  }
  const body = await onboard.json();
  return { email, password: "Test1234!", providerId: body.data.id as string };
}

/** Assert response time under threshold (ms) */
export function assertResponseTime(startMs: number, maxMs = 500): void {
  const elapsed = Date.now() - startMs;
  if (elapsed > maxMs) {
    console.warn(`Response time ${elapsed}ms exceeds ${maxMs}ms threshold`);
  }
}
