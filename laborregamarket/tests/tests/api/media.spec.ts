import { test, expect } from "@playwright/test";
import { loginAs, withAuth } from "../../fixtures/auth";
import {
  createLocalProduct,
  ensureOwnSection,
  f10Suffix,
  fakeJpegNamed,
  jpegNamedOfSize,
  MAX_IMAGE_BYTES,
  realPngNamed,
} from "../../fixtures/f10";

test.describe("API MEDIA F10 — TC-MED", () => {
  test("TC-MED-001/002: POST logo PNG + GET público", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const file = realPngNamed();
    const upload = await request.post(
      "/api/provider/media",
      withAuth(request, {
        multipart: {
          file,
          field: "logo",
        },
      })
    );
    expect(upload.status()).toBe(200);
    const body = await upload.json();
    expect(body.data.url).toMatch(/^\/api\/media\/.+\.(png|jpg|jpeg|webp)$/i);
    expect(body.data.field).toMatch(/logoUrl/i);

    const get = await request.get(body.data.url as string);
    expect(get.status()).toBe(200);
    expect(get.headers()["content-type"]).toMatch(/image\//);
    const nosniff = get.headers()["x-content-type-options"];
    if (nosniff) expect(nosniff).toMatch(/nosniff/i);
  });

  test("TC-MED-003: MIME falso .jpg → 400", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const upload = await request.post(
      "/api/provider/media",
      withAuth(request, {
        multipart: {
          file: fakeJpegNamed(),
          field: "logo",
        },
      })
    );
    expect(upload.status()).toBe(400);
  });

  test("TC-MED-004: GET filename con .. → 400", async ({ request }) => {
    const response = await request.get("/api/media/foo..bar.png");
    expect(response.status()).toBe(400);
  });

  test("TC-MED-005: POST imagen ProviderProduct local", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const sectionId = await ensureOwnSection(request);
    const created = await createLocalProduct(request, {
      name: `Con foto ${f10Suffix()}`,
      sectionId,
    });
    expect(created.ok()).toBeTruthy();
    const ppId = (await created.json()).data.providerProductId as string;
    const upload = await request.post(
      `/api/provider/products/${ppId}/image`,
      withAuth(request, { multipart: { file: realPngNamed() } })
    );
    expect(upload.status()).toBe(200);
    const body = await upload.json();
    expect(body.data.url).toMatch(/^\/api\/media\//);
  });

  test("TC-MED-006: ADMIN image sobre Product LOCAL → 400", async ({ request }) => {
    await loginAs(request, "PROVIDER");
    const sectionId = await ensureOwnSection(request);
    const created = await createLocalProduct(request, {
      name: `Local img ${f10Suffix()}`,
      sectionId,
    });
    expect(created.ok()).toBeTruthy();
    const productId = (await created.json()).data.productId as string;

    await loginAs(request, "ADMIN");
    const upload = await request.post(
      `/api/admin/products/${productId}/image`,
      withAuth(request, { multipart: { file: realPngNamed() } })
    );
    expect(upload.status()).toBe(400);
  });

  test("TC-MED-008: JPEG 6 MiB (≤20 MiB) logo → 200", async ({ request }) => {
    test.setTimeout(60_000);
    await loginAs(request, "PROVIDER");
    const sixMib = 6 * 1024 * 1024;
    const upload = await request.post(
      "/api/provider/media",
      withAuth(request, {
        multipart: {
          file: jpegNamedOfSize(sixMib),
          field: "logo",
        },
      })
    );
    expect(upload.status()).toBe(200);
    const body = await upload.json();
    expect(body.data.url).toMatch(/^\/api\/media\/.+\.(jpg|jpeg)$/i);
  });

  test("TC-MED-009: 20 MiB+1 → 400 límite 20MB", async ({ request }) => {
    test.setTimeout(60_000);
    await loginAs(request, "PROVIDER");
    const upload = await request.post(
      "/api/provider/media",
      withAuth(request, {
        multipart: {
          file: jpegNamedOfSize(MAX_IMAGE_BYTES + 1),
          field: "cover",
        },
      })
    );
    expect(upload.status()).toBe(400);
    const body = await upload.json();
    const blob = JSON.stringify(body);
    expect(blob).toMatch(/20\s*MB/i);
    expect(blob).not.toMatch(/límite de 5MB/i);
  });
});
