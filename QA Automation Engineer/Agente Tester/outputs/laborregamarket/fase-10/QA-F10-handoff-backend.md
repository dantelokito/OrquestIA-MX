# Handoff QA → Backend — LaBorregaMarket F10

> **Nota 12/09:** F10 **APROBADO CON CONDICIONES**. BE disco 20 MiB **aceptado**. Resto BUG-016 **Diferido** → [DT-F10-002](./deuda-tecnica/DT-F10-002-media-20mib-fe-bodysize.md). Este handoff queda **histórico**; `bodySizeLimit` no es P0 de merge.

> **De:** QA Tester Senior  
> **Para:** @Backend Developer  
> **Proyecto:** LaBorregaMarket v0.10.2  
> **Fecha:** 31/08/2026  
> **Ambiente:** `http://127.0.0.1:8080`  
> **Código:** `C:\Users\PC GAMER\LaBorregaMarket`

---

## Metadata

- **Fase:** 10
- **Agente Emisor:** QA / Tester Senior
- **Agente Receptor:** Backend Developer
- **Frontend:** actúa en la capa cliente de [BUG-016](./bug-reports/BUG-016.md) ([handoff FE](./QA-F10-handoff-frontend.md))
- **BUG-015:** **no** es Backend (`crypto.randomUUID` en carrito/POS)

---

## Estado

Sign-off F10 **APROBADO CON CONDICIONES** (12/09). Cola Backend **histórica** (BE disco aceptado; resto DT-F10-002):

| Prioridad | Ticket | Estado |
|-----------|--------|--------|
| P2 | [BUG-016](./bug-reports/BUG-016.md) — resto FE copy + `bodySizeLimit` | **Diferido** → DT-F10-002 (BE disco 20 MiB aceptado) |

Prompt: [`activation-prompt-backend-BUG-016.txt`](./activation-prompt-backend-BUG-016.txt)

---

## Qué falló (BUG-016)

Stakeholder (instalación local): fotos de alta calidad **hasta 20 MiB** en logo, portada y producto. Hoy el API corta a **5 MiB**.

```ts
// src/lib/storage/local-disk.ts
export const MAX_IMAGE_BYTES = 5_242_880;

// src/lib/services/media.service.ts
throw new MediaValidationError("file", "El archivo supera el límite de 5MB");
```

Rutas (mismo `validateAndStore`):

- `POST /api/provider/media` (`field=logo` \| `cover`)
- `POST /api/provider/products/{id}/image`
- `POST /api/admin/products/{id}/image`

---

## Archivos a tocar

| Ruta | Acción |
|------|--------|
| `src/lib/storage/local-disk.ts` | `MAX_IMAGE_BYTES = 20_971_520` (`20 * 1024 * 1024`) |
| `src/lib/services/media.service.ts` | Mensaje `El archivo supera el límite de 20MB` |
| `src/lib/storage/cloudinary.ts` | Mismo tope y mensaje (no dejar 5 MB oculto) |
| `next.config.ts` | `experimental.serverActions.bodySizeLimit: "21mb"` (o equivalente App Router) para que `formData()` no recorte antes del service |

### Límites

| Regla | Valor |
|-------|-------|
| Max size | `20_971_520` bytes |
| MIME | JPEG / PNG / WebP **sin cambio** (magic bytes) |
| Rate limit | 20 uploads / 10 min / provider **sin cambio** |
| Error > tope | 400, `El archivo supera el límite de 20MB` |

---

## Resultado esperado

- Multipart ≤ 20 MiB + magic JPEG/PNG/WebP → **200**, `data.url` `/api/media/…`
- Multipart 20 MiB + 1 → **400**, URL previa intacta
- Logo, portada y foto de producto (local y GLOBAL admin) usan el mismo tope

---

## No tocar

- BUG-015 / carrito / POS / `Idempotency-Key`
- Cloudinary como storage Must (sigue disco `UPLOADS_DIR`)
- `US-ADMIN-04`, Explorar F8/F9, reportes rango
- Subir el tope por encima de 20 MiB en este ticket

---

## Checklist de recepción

- [ ] Leído [BUG-016.md](./bug-reports/BUG-016.md)
- [ ] Confirmado `MAX_IMAGE_BYTES` en `local-disk.ts`
- [ ] Coordinar con FE el mismo número (`20_971_520`)

---

## DoD

1. Constante única 20 MiB + mensaje 20MB
2. Body limit Next ≥ 21mb verificado en `next dev` local
3. `TC-MED-008` / `TC-MED-009` Pass (`tests/api/media.spec.ts`)
4. Avisar a QA (cierre conjunto con FE)

---

## Pendientes

- [ ] Fix BUG-016 capa BE (responsable: Backend)
- [ ] Re-test QA (responsable: QA)
