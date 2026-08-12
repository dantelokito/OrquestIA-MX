# ADR-006 — Almacenamiento de imágenes (Cloudinary)

> **Estado:** Aceptado  
> **Fecha:** 10/08/2026  
> **Decisores:** Arquitecto de Software  
> **Fase:** 2 — Transacciones (v0.2.0)

---

## Contexto

`Provider.logoUrl`, `Provider.coverUrl` y `Product.imageUrl` ya existen en Prisma (nullable) pero no hay pipeline de upload. Fase 2 exige subida de logo/portada (PROVIDER) e imagen de producto catálogo (ADMIN), con validación MIME/size y URLs HTTPS.

`next.config.ts` ya permite `**.cloudinary.com` como remote image host.

## Decisión

Usar **Cloudinary** (upload server-side con SDK/API) en Fase 2.

### Variables de entorno

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| `CLOUDINARY_CLOUD_NAME` | Sí | Cloud name |
| `CLOUDINARY_API_KEY` | Sí | API key |
| `CLOUDINARY_API_SECRET` | Sí | API secret |

### Reglas de validación (autoridad servidor)

| Regla | Valor |
|-------|-------|
| MIME permitidos | `image/jpeg`, `image/png`, `image/webp` |
| Tamaño máximo | **5 MB** |
| Dimensiones | Soft-check documentado (cover sugerido 1200×600, logo 512×512); **rechazo solo** por MIME/size |
| URLs persistidas | Solo `https://` (public delivery URL de Cloudinary) |

### Comportamiento al reemplazar

1. Subir nuevo asset a folder `laborregamarket/{providers|products}/...`.
2. Persistir nueva URL en Prisma.
3. **Purge** (destroy) del `public_id` anterior si la URL previa era Cloudinary del mismo cloud.
4. `AuditLog` con `MEDIA_UPLOAD` (ver [ADR-007](./ADR-007-contact-audit-action.md)).

### Ownership

| Endpoint | Quién | Campo |
|----------|-------|-------|
| `POST /api/provider/media` | PROVIDER — solo su `Provider` | `logoUrl` o `coverUrl` |
| `POST /api/admin/products/[id]/image` | ADMIN | `Product.imageUrl` |

### Ubicación código sugerida

- `src/lib/storage/cloudinary.ts` — upload + destroy
- `src/lib/services/media.service.ts` — validación + persistencia + AUDIT

## Alternativas consideradas

### A) AWS S3 + CloudFront

- **Pros:** Escala, control fino de IAM.
- **Contras:** Más setup (bucket, CORS, CDN, signed URLs); effort mayor para MVP (PM recomienda Cloudinary).

### B) Almacenamiento local / Vercel Blob

- **Pros:** Menos terceros.
- **Contras:** Persistencia y CDN; no alineado a decisión PM D-F2-2.

### C) Upload directo client → Cloudinary (unsigned)

- **Pros:** Menos carga en API.
- **Contras:** Secretos/unsigned presets más frágiles; validación ownership más difícil. Preferimos **server-side**.

## Consecuencias

### Positivas

- Menor esfuerzo MVP; transforms opcionales en URL.
- Compatible con allowlist Next Image existente.
- Purge explícito evita basura y URLs rotas.

### Negativas

- Vendor lock-in de URLs (migración futura requeriría re-host).
- Cuotas Cloudinary free/paid a monitorear.

## Referencias

- Contrato: [`../api/API-MEDIA-01.md`](../api/API-MEDIA-01.md)
- Providers/Products: [`../data-model/DB-providers.md`](../data-model/DB-providers.md), [`../data-model/DB-products.md`](../data-model/DB-products.md)
- Infra: [`../infra-requirements.md`](../infra-requirements.md)
