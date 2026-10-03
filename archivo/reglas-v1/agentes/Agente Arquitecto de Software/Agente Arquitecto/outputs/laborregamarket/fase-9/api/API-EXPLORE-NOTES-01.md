# API-EXPLORE-NOTES-01 — Sin API Must (Fase 9)

> **Módulo:** `EXPLORE`, `GEO`  
> **Versión:** 0.9.0  
> **Fecha:** 25/08/2026  
> **CO:** CO-F9-001  
> **Autenticación:** N/A (notas de arquitectura)

Documenta las US F9 que **no** exigen endpoint, migración ni shape Must nuevo. Backend: **cero trabajo Must** en estos tres ítems.

---

## US-EXPLORE-08 — Preview in-card

| Campo | Valor |
|-------|-------|
| Contrato HTTP | Mismo `GET /api/providers/[id]` F7/F8 |
| Delta BE | Ninguno |
| Delta FE | Animación **dentro** del card (no popover desanclado); triggers F8; debounce/cache F8 |
| Contenido | Shape `US-EXPLORE-05` **sin recortar** |

Ver: [`API-PROVIDER-PREVIEW-01.md`](./API-PROVIDER-PREVIEW-01.md)

---

## US-EXPLORE-10 — Distancia + ETA en card

| Campo | Valor |
|-------|-------|
| Distancia | `distanceKm` ya en listing geo (`GET /api/providers` con `lat`/`lng`) |
| ETA | Cliente: `computeEtaMinutes` ([ADR-017](../../comun/adrs/ADR-017-eta-formula.md)); **sin** Distance Matrix; **sin** `GET …/eta` Must en card |
| UI | Quitar slot visual `minPrice` / «$X MXN desde». No pintar `sampleProducts` en card |
| Delta BE | Ninguno Must |

Should UI: barra relativa distancia/radio (producto; no contrato API).

---

## US-GEO-24 — Chrome barra + altura mapa

| Campo | Valor |
|-------|-------|
| API | **Ninguna** |
| Alcance | Solo FE / tokens de layout: una barra horizontal (breakpoint UX) + mapa ~+10–20% altura |
| Invariantes | No regresionar BUG-012/013; `CO-F7-001` pan ≠ radio intacto; clamp 0.5–10 y `MEXICO_BOUNDS` F8 |

---

## Referencias

- PRD / US PM: `Administrador de producto/.../fase-9/`
- Listing + typeahead / chips: [`API-GEO-01.md`](./API-GEO-01.md)
- Handoff BE: [`../handoff-backend-fase-9.md`](../handoff-backend-fase-9.md)
