# Handoff Backend Developer — LaBorregaMarket Fase 7 (v0.7.1)

> **De:** Agente Arquitecto de Software  
> **Para:** @Backend Developer  
> **Fecha:** 18/08/2026  
> **Prioridad:** Contratos Explorar + sesión cookie; **no** reabrir F6 (DASH/PDF/Redis/CI)  
> **No implementar:** pasarela, CFDI, CI YAML, `/health`, Maps JS, clustering, bbox Must, teselas OSM

---

## Estado: LISTO PARA IMPLEMENTAR

**Punto de entrada:** este archivo + [`../STATUS.md`](../STATUS.md) + [`../comun/sad.md`](../comun/sad.md)

Código: `C:\Users\PC GAMER\LaBorregaMarket`

`CO-F7-001`: el servidor **no** deriva `radiusKm` del viewport. Clamp 1–25. `US-GEO-16` **cero ruta nueva**.

---

## Orden de implementación

```
1. Migración UserAddress.lastUsedAt + POST .../addresses/[id]/use
2. Migración Provider preview (horario, flags, verifiedAt) + PATCH me + GET detalle
3. GET /api/providers: clamp radiusKm; meta.total = COUNT mismo predicado; q unión
4. Cookie JWT flags (ADR-025) en login/register/logout — sin path nuevo
5. Tests: RBAC addresses/use (401/403); total independiente de limit; q mango; isOpenNow TZ
```

---

## Incidencias de este handoff

| Tema | Backend hace |
|------|----------------|
| ADR-027 | Columna `last_used_at`; `markLastUsed`; `requireRole(CLIENT)` |
| ADR-026 | No hay endpoint de constante; FE envía coords. Bbox F4 intacto |
| Preview | Campos Prisma + Zod PATCH + `isOpenNow` calculado |
| GEO | Clamp; count; `q` min 2; productos inactivos no matchean |
| AUTH-09 | `HttpOnly` `Path=/` `SameSite=Lax` `Secure` solo HTTPS |
| DEV-P2-011 | Test RBAC en ruta **nueva** `/use` |

**No es Backend aquí:** CI YAML, lockfile Redis, PDF, Leaflet, tokens loader, copy UX.

---

### 1 — Favoritas last-used

Contrato: [`api/API-ADDRESSES-01.md`](./api/API-ADDRESSES-01.md)  
Schema: [`data-model/DB-addresses.md`](./data-model/DB-addresses.md)

`POST /api/users/me/addresses/[id]/use` stamp `lastUsedAt = now()`. PATCH label **no** stamp.

---

### 2 — Preview vitrina

Contrato: [`api/API-PROVIDER-PREVIEW-01.md`](./api/API-PROVIDER-PREVIEW-01.md)  
Settings: [`api/API-PROVIDER-SETTINGS-01.md`](./api/API-PROVIDER-SETTINGS-01.md)  
Schema: [`data-model/DB-providers.md`](./data-model/DB-providers.md)

`GET /api/providers/[id]`: `reviewsPreview` top 3; `products` solo vendibles; `hoursPublished` + `isOpenNow`. ADMIN setea `verifiedAt` al verificar.

---

### 3 — Lista Explorar

Contrato: [`api/API-GEO-01.md`](./api/API-GEO-01.md)

`radiusKm` fuera de rango → clamp, `meta.radiusKm` = aplicado. `meta.total` no es `data.length`.

---

### 4 — Cookie

Contrato: [`api/API-AUTH-01.md`](./api/API-AUTH-01.md)  
ADR: [`../comun/adrs/ADR-025-session-cookie-mobile.md`](../comun/adrs/ADR-025-session-cookie-mobile.md)

Alinear `setCookie` con la tabla del ADR. No JWT en query.

---

## Fuera de alcance

DASH, PDF, `@upstash/redis`, pipeline CI, Places, Distance Matrix, clustering, Maps JS, `BL-040`.

## Quality

No hay `quality/REVIEW-ARCH.md` hasta cierre de este handoff.
