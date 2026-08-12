import type { APIRequestContext } from "@playwright/test";

export const credentials = {
  client: {
    email: process.env.QA_CLIENT_EMAIL ?? "cliente@demo.mx",
    password: process.env.QA_CLIENT_PASSWORD ?? "Demo1234!",
  },
  provider: {
    email: process.env.QA_PROVIDER_EMAIL ?? "frutas@elparaiso.mx",
    password: process.env.QA_PROVIDER_PASSWORD ?? "Demo1234!",
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
  });

  if (!response.ok()) {
    throw new Error(`Login failed for ${role}: ${response.status()} ${await response.text()}`);
  }

  const body = await response.json();
  const user = body.data.user as AuthUser;
  const storageState = await request.storageState();

  return { user, storageState };
}

/** Unique email for registration tests */
export function uniqueEmail(prefix = "qa"): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}@test.laborrega.mx`;
}

/** Assert response time under threshold (ms) */
export function assertResponseTime(startMs: number, maxMs = 500): void {
  const elapsed = Date.now() - startMs;
  if (elapsed > maxMs) {
    console.warn(`Response time ${elapsed}ms exceeds ${maxMs}ms threshold`);
  }
}
