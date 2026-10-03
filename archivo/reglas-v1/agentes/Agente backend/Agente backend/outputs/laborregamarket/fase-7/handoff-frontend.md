# Handoff Frontend — LaBorregaMarket Backend v0.7.1

> **De:** Backend Developer  
> **Para:** @Frontend Developer  
> **Fecha:** 18/08/2026

---

## Estado: LISTO PARA INTEGRAR — Must F7 (Explorar + AUTH)

Base URL local: `http://localhost:8080`  
Envelope JSON: `{ data }` / `{ error, details? }` (ADR-003). Cookie: `credentials: 'include'` (ADR-025).  
F6 DASH/PDF **sin cambios**. El servidor **no** deriva `radiusKm` del viewport (`CO-F7-001`).

---

## Mapa pantalla → endpoint (delta F7)

| Tema | Endpoint(s) | Notas |
|------|-------------|-------|
| Explorar lista | `GET /api/providers` | Clamp `radiusKm` a [1, 25]; `meta.radiusKm` = aplicado. `meta.total` = COUNT del filtro (no `data.length`). Default radio 10 si hay coords. `q` min 2: nombre **o** producto vendible |
| Empty vs error | mismo GET | **200** + `total=0` = empty. 4xx/5xx = error. Sin ruta nueva (`US-GEO-16`) |
| Preview / detalle | `GET /api/providers/[id]` | Campos extra: flags, `hoursPublished`, `isOpenNow` (TZ Monterrey o `null`), `openingHours`, `reviewsPreview` (3), `verifiedAt`. Sin `primaryColor`/`secondaryColor` |
| Favoritas | `GET/POST /api/users/me/addresses` | Incluye `lastUsedAt`. Orden: lastUsed DESC NULLS LAST, default, favorite |
| Uso en mapa | `POST /api/users/me/addresses/[id]/use` | Cookie + rol **CLIENT**. 401/403/404. PATCH label **no** stamp |
| Settings dueño | `PATCH /api/provider/me` | Horario + flags vitrina. `verifiedAt` solo ADMIN |
| Sesión | login / register / logout / session | `HttpOnly` `Path=/` `SameSite=Lax`; `Secure` solo `NODE_ENV=production`. Logout `Max-Age=0` |

Centro SN: **FE** (ADR-026 `25.7475, -100.2830`). BE no expone constante.

Cliente: `markAddressUsed(id)` en `src/lib/api/addresses.ts`.

---

## Query GEO

| Param | Default | Notas |
|-------|---------|-------|
| `lat`+`lng` | — | XOR → 400. Fuera bbox MTY → 400 |
| `radiusKm` | 10 con coords | <1 o >25 → **clamp**, no 400. Sin coords → 400 |
| `q` | — | 1 char → 400. Productos inactivos no matchean |
| `limit` | 20 | Max 50 |

Copy “N fruterías a R km”: `meta.total` y `meta.radiusKm`.

---

## Códigos

| Caso | HTTP |
|------|------|
| Invitado en favoritas / `/use` | 401 |
| PROVIDER/ADMIN en favoritas / `/use` | 403 |
| Dirección de otro usuario | 404 |
| Provider inactivo | 404 |
| Horario PATCH inválido | 400 Zod |

---

## Fuera de alcance BE

Leaflet, pan→radio, loader tokens, Places, clustering, DASH/PDF, CI YAML, pasarela.
