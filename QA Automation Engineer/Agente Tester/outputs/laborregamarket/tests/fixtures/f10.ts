import type { APIRequestContext } from "@playwright/test";
import { withAuth } from "./auth";

/** Unique suffix for F10 mutations (avoid 409 on slug/name). */
export function f10Suffix(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

/** Minimal 1×1 PNG (magic bytes 89 50 4E 47). */
export function png1x1(): Buffer {
  return Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    "base64"
  );
}

export function fakeJpegNamed(): { name: string; mimeType: string; buffer: Buffer } {
  return {
    name: "fake.jpg",
    mimeType: "image/jpeg",
    buffer: Buffer.from("this-is-not-an-image"),
  };
}

export function realPngNamed(): { name: string; mimeType: string; buffer: Buffer } {
  return {
    name: "qa-f10.png",
    mimeType: "image/png",
    buffer: png1x1(),
  };
}

/** NFR BUG-016: 20 MiB (misma convención que 5_242_880). */
export const MAX_IMAGE_BYTES = 20 * 1024 * 1024;

/** JPEG reconocible por magic bytes (`FF D8 FF`) con tamaño exacto (padding ceros). */
export function jpegNamedOfSize(bytes: number): { name: string; mimeType: string; buffer: Buffer } {
  const buffer = Buffer.alloc(bytes, 0);
  buffer[0] = 0xff;
  buffer[1] = 0xd8;
  buffer[2] = 0xff;
  return { name: `qa-${bytes}.jpg`, mimeType: "image/jpeg", buffer };
}

export async function listSections(request: APIRequestContext) {
  return request.get("/api/provider/sections", withAuth(request));
}

export async function createSection(request: APIRequestContext, name: string) {
  return request.post(
    "/api/provider/sections",
    withAuth(request, { data: { name } })
  );
}

export async function ensureOwnSection(request: APIRequestContext, name?: string): Promise<string> {
  const listed = await listSections(request);
  if (listed.ok()) {
    const body = await listed.json();
    const first = (body.data as { id: string }[] | undefined)?.[0];
    if (first?.id) return first.id;
  }
  const created = await createSection(request, name ?? `QA F10 ${f10Suffix()}`);
  if (!created.ok()) {
    throw new Error(`createSection failed: ${created.status()} ${await created.text()}`);
  }
  const body = await created.json();
  return body.data.id as string;
}

export async function createLocalProduct(
  request: APIRequestContext,
  input: {
    name: string;
    sectionId: string;
    unit?: string;
    price?: number;
    isAvailable?: boolean;
  }
) {
  return request.post(
    "/api/provider/local-products",
    withAuth(request, {
      data: {
        name: input.name,
        unit: input.unit ?? "KG",
        price: input.price ?? 12.5,
        sectionId: input.sectionId,
        isAvailable: input.isAvailable ?? true,
      },
    })
  );
}

export function monterreyYmd(d = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Monterrey",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);
  const year = parts.find((p) => p.type === "year")?.value ?? "2026";
  const month = parts.find((p) => p.type === "month")?.value ?? "08";
  const day = parts.find((p) => p.type === "day")?.value ?? "31";
  return `${year}-${month}-${day}`;
}

export function addDaysYmd(ymd: string, days: number): string {
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  const yy = dt.getUTCFullYear();
  const mm = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(dt.getUTCDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}
