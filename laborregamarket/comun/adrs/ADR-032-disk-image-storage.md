# ADR-032 — Almacenamiento de imágenes en disco local

> **Estado:** Aceptado  
> **Fecha:** 2026-08-28  
> **Decisores:** Arquitecto de Software  
> **Fase:** 10 — v0.10.2  
> **US:** US-MEDIA-06, US-MEDIA-03  
> **CO:** CO-F10-002  
> **Reemplaza en Must:** [ADR-006](./ADR-006-image-storage.md) (Aparcado)

---

#### 1. Contexto y Problema:

F2 eligió Cloudinary (ADR-006) para logo, portada e imagen de `Product`. `CO-F10-002` exige disco local del servidor y declara Cloudinary / S3 / CDN como **Won't F10**. Validación MIME/size (`US-MEDIA-03`) **sigue**. El SAD F9 asume deploy Vercel: el filesystem serverless es **efímero**, incompatible con persistir uploads.

---

#### 2. Opciones Consideradas:

* **Opción A — Disco `UPLOADS_DIR` + GET `/api/media/{opaqueId}` + volumen persistente:** Pros: sin tercero; path opaco; mismo origin. Contras: el runtime no puede ser Vercel serverless sin volumen; backup de archivos es responsabilidad de ops.
* **Opción B — Seguir Cloudinary (ADR-006):** Pros: CDN y persistencia. Contras: D-F10-8 / CO-F10-002 lo prohíben.
* **Opción C — S3 / Vercel Blob:** Pros: persiste en serverless. Contras: Won't F10 (cloud de imágenes).
* **Opción D — `bytea` en PostgreSQL:** Pros: backup junto a la DB. Contras: no es “disco”; infla la DB; peor para 5 MB.

---

#### 3. Decisión Elegida:

**Opción A.**

### Layout

| Variable | Default local | Descripción |
|----------|---------------|-------------|
| `UPLOADS_DIR` | `./uploads` (fuera de `public/`) | Raíz absoluta o relativa al cwd del proceso. **Must** en staging/prod con volumen montado |

Nombre de archivo: `{cuid}.{ext}` donde `ext` deriva del **MIME real** (magic bytes), no de la extensión del cliente. Prohibido `..`, `/`, `\`.

### URL persistida

Columnas `Provider.logoUrl`, `Provider.coverUrl`, `Product.imageUrl`, `ProviderProduct.imageUrl` guardan path de aplicación:

```
/api/media/{cuid}.{ext}
```

No se guarda la ruta absoluta del disco. GET público (vitrina / Explorar). `Content-Type` del MIME detectado al subir; `X-Content-Type-Options: nosniff`; `Content-Disposition: inline`. **Prohibido** servir con `application/octet-stream` ejecutable (`image/jpeg|png|webp` only).

### Ownership de imagen

| Quién | Campo | Path upload |
|-------|-------|-------------|
| PROVIDER dueño | `logoUrl` / `coverUrl` | `POST /api/provider/media` (mismo contrato F2, storage nuevo) |
| ADMIN | `Product.imageUrl` GLOBAL | `POST /api/admin/products/[id]/image` + `hasModulePermission(PRODUCTS, edit)` |
| PROVIDER dueño | `ProviderProduct.imageUrl` | `POST /api/provider/products/[providerProductId]/image` — override de vitrina; **no** muta `Product.imageUrl` de un GLOBAL ajeno |
| PROVIDER dueño | Local: `ProviderProduct.imageUrl` y, si se desea, el mismo URL en `Product.imageUrl` del LOCAL | Misma ruta de ítem ofertado |

Resolución de lectura pública: `ProviderProduct.imageUrl ?? Product.imageUrl ?? null`.

### Reemplazo

1. Validar MIME real + size ≤ 5 MB (`US-MEDIA-03`). Fallo → **400**, URL previa intacta.
2. Escribir archivo nuevo.
3. Persistir nueva URL.
4. Borrar archivo anterior **solo si** la URL previa era `/api/media/…` del mismo servidor.
5. URLs Cloudinary históricas: no se hace destroy remoto (SDK no Must); quedan hasta que el operador reemplace.
6. `AuditLog` `MEDIA_UPLOAD` (`details`: `field`, `url`, `bytes`, `mimeType`, `replacedPrevious`). Sin path absoluto de disco.

### IDOR

PROVIDER no escribe logo/cover/ítem de otro `providerId` → **403**. ADMIN no usa la ruta PROVIDER para mutar un negocio ajeno salvo las rutas admin de `Product` GLOBAL.

### Rate limit

Uploads: 20 / 10 min por `providerId` o por ADMIN (`userId`), store Redis existente (mismo patrón contacto). Exceso → **429**.

### Infra

F10 **exige** volumen persistente (Docker bind/volume, VPS, o equivalente). **No** es compatible con filesystem efímero de Vercel serverless. DevOps: ver `comun/infra-requirements.md`. Cloudinary env deja de ser Must.

### Qué NO hacer

- SDK Cloudinary / S3 / Imgix.
- Guardar bajo `public/` (listing y deploys).
- Confiar solo en la extensión del filename.
- Path traversal (`UPLOADS_DIR/../../etc/passwd`).
- Ejecutar o transcodar a video.

---

#### 4. Consecuencias e Impacto:

* **Positivas:** Cero vendor de imágenes en F10; validación F2 intacta; override por negocio.
* **Riesgos / Compensaciones:** Hay que cambiar el supuesto “un deploy Vercel” para media; backups de `UPLOADS_DIR` son Must ops; URLs Cloudinary viejas conviven hasta reemplazo.

## Referencias

- US-MEDIA-06, US-MEDIA-03, D-F10-8
- Contrato: [`../../fase-10/api/API-MEDIA-02.md`](../../fase-10/api/API-MEDIA-02.md)
- ADR-006 aparcado: [ADR-006](./ADR-006-image-storage.md)
- AUDIT: [ADR-007](./ADR-007-contact-audit-action.md)
