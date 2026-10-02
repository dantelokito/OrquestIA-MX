# ADR-018 — Reseñas nativas y vínculo Google (verificados)

> **Estado:** Aceptado  
> **Fecha:** 2026-08-14  
> **Decisores:** Arquitecto de Software  
> **Fase:** 4 — v0.4.0

---

#### 1. Contexto y Problema:

`Provider.rating` / `reviewCount` son placeholders de seed. US-REV-01…04 piden reseña nativa post-`DELIVERED` (una por pedido) y, solo si `isVerified=true`, enlace/embed a Google Maps. PM (D-F4-1): **no** importar reseñas vía Places API. El PATCH de campos Google debe rechazarse server-side si el negocio no está verificado (no basta ocultar en UI).

---

#### 2. Opciones Consideradas:

* **Opción A — Tabla `Review` + campos Google en `Provider` + agregado síncrono:** Pros: integridad transaccional; `rating` denormalizado para listados rápidos. Contras: hay que mantener el agregado.
* **Opción B — Agregado on-read (`AVG` en cada listado):** Pros: siempre fresco. Contras: p95 explorar; no reutiliza columnas ya indexadas en cards.
* **Opción C — Sincronizar reseñas Google vía Places API:** Pros: reputación externa rica. Contras: Won't F4 / D-F4-1.

---

#### 3. Decisión Elegida:

**Opción A.**

### Reseña nativa

- Una fila `Review` por `orderId` (UNIQUE).
- Solo `Order.status=DELIVERED` + `source=MARKETPLACE` + `clientId` = usuario autenticado.
- POS walk-in (`clientId` null) **no** puede reseñar.
- Must: la reseña es **de solo lectura** tras crear (sin PATCH). Should (no F4 Must): edición.
- `DELETE` solo ADMIN (moderación). Tras create/delete: **misma transacción Prisma** recalcula:

```
rating = AVG(Review.rating)  -- 0 si count=0
reviewCount = COUNT(*)
```

Seed deja de ser dato de producción: backfill a 0 o a AVG real en la migración.

### Campos Google en `Provider`

| Campo | Tipo | Notas |
|-------|------|-------|
| `googlePlaceId` | String? | Formato `ChIJ…` (min 10 chars, prefix típico) |
| `googleMapsUrl` | String? | URL `google.com/maps` / `maps.app.goo.gl` / `maps.google.com` |
| `googleReviewsEnabled` | Boolean default false | Vitrina en `/fruteria/[id]` |

**Gate escritura (US-REV-04):** si `isVerified=false`, cualquier `PATCH` que toque esos tres campos → **403** `{ "error": "Requiere verificación de tu negocio" }`. No 200 silencioso.

**Pérdida de verificación:** `PATCH /api/admin/providers/[id]` con `isVerified: false` pone `googleReviewsEnabled=false` en la misma transacción. No se borran Place ID ni URL.

**Lectura pública:** el embed/enlace solo se serializa si `isVerified && googleReviewsEnabled && (googlePlaceId \|\| googleMapsUrl)`.

Al menos uno de Place ID o URL es requerido para activar el toggle.

### Qué NO hacer

- Importar ratings de Google.
- Confiar solo en UI disabled.
- Recalcular `rating` en un job asíncrono (US-REV-02 permite sync; se elige sync).

---

#### 4. Consecuencias e Impacto:

* **Positivas:** Cards de explorar siguen usando `rating`/`reviewCount` sin JOIN. Gate de verificación es enforceable. Embed no contaminan el promedio nativo.
* **Riesgos / Compensaciones:** Agregado denormalizado (mitigado por transacción). Place ID mal formado se rechaza en Zod, no se verifica contra Google.

## Referencias

- US-REV-01…04
- API: [`../../fase-4/api/API-REVIEWS-01.md`](../../fase-4/api/API-REVIEWS-01.md), [`../../fase-4/api/API-PROVIDER-SETTINGS-01.md`](../../fase-4/api/API-PROVIDER-SETTINGS-01.md)
- Schema: [`../../fase-4/data-model/DB-reviews.md`](../../fase-4/data-model/DB-reviews.md)
- Diagrama: [`../../fase-4/diagrams/ARCH-REVIEWS-01.md`](../../fase-4/diagrams/ARCH-REVIEWS-01.md)
