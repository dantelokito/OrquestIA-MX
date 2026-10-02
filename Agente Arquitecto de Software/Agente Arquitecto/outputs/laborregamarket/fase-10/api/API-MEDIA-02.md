# API-MEDIA-02 — Imágenes en disco local

> **Endpoints:** `POST /api/provider/media`, `POST /api/admin/products/[id]/image`, `POST /api/provider/products/[providerProductId]/image`, `GET /api/media/[filename]`  
> **Módulo:** `PROVIDERS`, `PRODUCTS`  
> **Versión:** 0.10.2  
> **Fecha:** 28/08/2026  
> **US:** US-MEDIA-06, US-MEDIA-03  
> **ADR:** [`../../comun/adrs/ADR-032-disk-image-storage.md`](../../comun/adrs/ADR-032-disk-image-storage.md)  
> **Base F2 (paths):** [`../../fase-2/api/API-MEDIA-01.md`](../../fase-2/api/API-MEDIA-01.md) — **storage reemplazado**; no Cloudinary

## Inputs Utilizados

- **US:** `US-MEDIA-06`
- **CO:** `CO-F10-002`
- **Validación F2:** MIME JPEG/PNG/WebP, 5 MB — intacta

---

## Validación común (`US-MEDIA-03`)

| Regla | Valor | HTTP |
|-------|-------|------|
| MIME **real** (magic bytes) | `image/jpeg`, `image/png`, `image/webp` | 400 |
| Extensión del cliente | Ignorada para aceptar/rechazar | — |
| Max size | 5_242_880 bytes | 400 |
| Path | Solo `[a-zA-Z0-9]+.(jpg\|jpeg\|png\|webp)` en GET | 400 |
| URL persistida | `/api/media/{cuid}.{ext}` | — |

Fallo de validación: **no** mutar URL previa ni dejar archivo huérfano nuevo (escribir temp + rename, o borrar el nuevo si el PATCH a Prisma falla).

---

## POST `/api/provider/media`

Mismos form fields F2: `file` + `field` = `logo` \| `cover`. Auth PROVIDER dueño.

#### 200

```json
{
  "data": {
    "url": "/api/media/clxyzabcd.jpg",
    "field": "logoUrl"
  }
}
```

Side effects: disco (ADR-032), update `logoUrl`/`coverUrl`, unlink anterior si era `/api/media/…`, AUDIT `MEDIA_UPLOAD` módulo `PROVIDERS`. Otro provider → no hay ruta con `providerId` ajeno (403 si se inventa).

401 / 403 / 404 (sin Provider) / 429 (20 uploads / 10 min / provider).

**500:** fallo de disco (volumen ausente, EACCES) — envelope ADR-003, **no** mencionar Cloudinary.

---

## POST `/api/admin/products/[id]/image`

Auth: ADMIN + PRODUCTS/edit. Solo `Product.scope=GLOBAL`. LOCAL → **400** (usar ruta de instancia del dueño).

Form: `file`. Persiste `Product.imageUrl`. AUDIT `PRODUCTS` / `MEDIA_UPLOAD`.

---

## POST `/api/provider/products/[providerProductId]/image`

> **Descripción:** Foto del ítem **ofertado** (override de vitrina).  
> **Autenticación:** PROVIDER dueño del `ProviderProduct`.

Form: `file`. Persiste `ProviderProduct.imageUrl`. Si el producto es LOCAL del dueño, **May** copiar la misma URL a `Product.imageUrl` (mismo archivo). **Prohibido** cambiar `Product.imageUrl` de un GLOBAL (catálogo comparable).

Id ajeno → **403**. 404 si no existe.

Lectura pública: `ProviderProduct.imageUrl ?? Product.imageUrl`.

---

## GET `/api/media/[filename]`

Público (vitrina, Explorar, Next Image). Sin JWT.

1. Validar filename (cuid + ext permitida). `..` / `/` → **400**.
2. Resolver `path.join(UPLOADS_DIR, filename)` y verificar que el realpath queda **dentro** de `UPLOADS_DIR`.
3. No existe → **404**.
4. Headers: `Content-Type` del MIME guardado o por ext; `X-Content-Type-Options: nosniff`; `Cache-Control: public, max-age=86400`.

No listar directorio. No `Content-Disposition: attachment` Must.

---

## NFR

| Área | Requisito |
|------|-----------|
| Seguridad | IDOR 403; magic bytes; no ejecutables; sin path traversal |
| Envelope | ADR-003 en POST; GET binario |
| Observabilidad | AUDIT `MEDIA_UPLOAD` (`field`, `url`, `bytes`, `mimeType`, `replacedPrevious`) |
| Infra | `UPLOADS_DIR` + volumen persistente |

## Fuera de alcance

Cloudinary SDK, S3, galerías multi-imagen, upload CLIENT, transcode.

## Implementación sugerida

| Capa | Archivo |
|------|---------|
| Disk | `src/lib/storage/local-disk.ts` (write, unlink, resolve) |
| Service | `src/lib/services/media.service.ts` (reemplaza cloudinary) |
| Routes | existentes F2 + `src/app/api/media/[filename]/route.ts` + `src/app/api/provider/products/[providerProductId]/image/route.ts` |
| MIME | `file-type` (o equivalente) sobre buffer |

Quitar dependencia Must de `cloudinary` en uploads nuevos. `next.config` remotePatterns Cloudinary puede permanecer por URLs históricas.

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-10/api/API-MEDIA-02.md`
- **Agente Downstream:** Backend Developer, DevOps (`UPLOADS_DIR`)
