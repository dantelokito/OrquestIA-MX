# API-ADDRESSES-01 — Inventario favoritas (Fase 8)

> **Endpoint:** `/api/users/me/addresses`  
> **Módulo:** `GEO`, `USERS`  
> **Versión:** 0.8.3  
> **Fecha:** 24/08/2026  
> **US:** US-GEO-17, US-GEO-18, US-GEO-19, US-GEO-20  
> **Base F7:** [`../../fase-7/api/API-ADDRESSES-01.md`](../../fase-7/api/API-ADDRESSES-01.md)  
> **Base F4:** [`../../fase-4/api/API-ADDRESSES-01.md`](../../fase-4/api/API-ADDRESSES-01.md)  
> **ADR:** [`../../comun/adrs/ADR-027-address-last-used.md`](../../comun/adrs/ADR-027-address-last-used.md), [`../../comun/adrs/ADR-028-mexico-bounds.md`](../../comun/adrs/ADR-028-mexico-bounds.md)  
> **Autenticación:** Requerida — Rol `CLIENT` → cookie JWT

Envelope [ADR-003](../../comun/adrs/ADR-003-error-envelope.md). **Sin endpoint nuevo. Sin migración Prisma.**

P1 (chrome de ubicación) **reusa** F4 + F7. Este documento es el inventario y el único delta de validación geo (`isInMexico`).

---

## Inventario (sin gap de envelope)

| Método | Ruta | Estado F8 |
|--------|------|-----------|
| `GET` | `/api/users/me/addresses` | Igual F7 (`lastUsedAt`, orden last-used / default / reciente) |
| `POST` | `/api/users/me/addresses` | Igual F4/F7 **salvo** `lat`/`lng` → `isInMexico` (abajo) |
| `PATCH` | `/api/users/me/addresses/[id]` | Igual; coords nuevas → `isInMexico` |
| `DELETE` | `/api/users/me/addresses/[id]` | Igual F4: `200` `{ "data": { "id", "deleted": true } }` |
| `POST` | `/api/users/me/addresses/[id]/use` | Igual F7 (stamp `lastUsedAt`) |

| Regla | Fuente | ¿Gap? |
|-------|--------|-------|
| Tope 20 → 400 `{ "error": "Límite de 20 direcciones alcanzado" }` | F4 | No |
| `label` 1–40 | F4 | No |
| `formattedAddress` 3–255 | F4 | No |
| Invitado 401; PROVIDER/ADMIN 403; cross-user 404 | F4/F7 | No |
| Duplicados `label` permitidos (IDs distintos) | PM F8 | No — **no** fusionar |
| Geocode | Nominatim cliente (F5); viewbox México (ADR-028) | No — sin Places |

`localStorage` **no** es origen de favoritas (`US-GEO-14`).

---

## Delta geo — `lat`/`lng` (P3, alineación)

El bbox AMM F4 (`lat` 25.4–25.9, `lng` −100.6–−99.8) **ya no aplica** a POST/PATCH de favoritas.

| Caso | Comportamiento F8 |
|------|-------------------|
| `isInMexico(lat, lng)` true (incl. CDMX) | Aceptar (mismas reglas F4 restantes) |
| Fuera de `MEXICO_BOUNDS` (p. ej. `33.0, -99.0`) | **400** envelope; `details[].field` = `lat` o `lng`; copy no técnico: ubicación fuera de México |
| Geocode Nominatim fuera de MX | FE **no** aplica pin ni POST (`US-GEO-23`) |

Helper y constantes: [ADR-028](../../comun/adrs/ADR-028-mexico-bounds.md).

---

## DELETE de la favorita en uso (`US-GEO-18`) — solo FE

El contrato DELETE **no cambia**. Tras `200`:

- El **pin del cliente permanece** en esas coords (no saltar a SN ni a `isDefault`).
- El chip muestra dirección formateada, no un id huérfano.
- Esto **revoca** la nota F7 «si se borra la last-used, FE rehidrata con default o SN».

Backend no remapea el centro. No hay stamp extra.

---

## Referencias

- GEO lista: [`API-GEO-01.md`](./API-GEO-01.md)
- Schema F7: [`../../fase-7/data-model/DB-addresses.md`](../../fase-7/data-model/DB-addresses.md)
- ADR-026 SN: [`../../comun/adrs/ADR-026-explore-default-san-nicolas.md`](../../comun/adrs/ADR-026-explore-default-san-nicolas.md)
