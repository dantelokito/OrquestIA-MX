# Fase 9 — Deuda Explorar (Arquitecto)

> **Producto:** LaBorregaMarket v0.9.0  
> **Fecha diseño:** 25/08/2026  
> **Estado:** Contratos cerrados · listo para implementar (BE filtros listing; FE visual espera UX donde aplique)

**Fase 8 solo lectura.** F7 solo lectura. Fase 6 congelada. Pagos/CFDI Won't (`CO-F6-001`). `CO-F7-001` intacto (pan ≠ radio). `CO-F9-001` absorbe DT-F9-001…005.

## Contratos API

| ID | Archivo | Delta |
|----|---------|-------|
| API-GEO-01 | [`api/API-GEO-01.md`](./api/API-GEO-01.md) | `offersWholesale` / `offersDelivery`; typeahead = `q`+geo (sin suggest) |
| API-PROVIDER-PREVIEW-01 | [`api/API-PROVIDER-PREVIEW-01.md`](./api/API-PROVIDER-PREVIEW-01.md) | **Sin API nueva.** Preview in-card (US-EXPLORE-08); NFR F8 vigente |
| API-EXPLORE-NOTES-01 | [`api/API-EXPLORE-NOTES-01.md`](./api/API-EXPLORE-NOTES-01.md) | Notas «sin API Must» 08 / 10 / 24 |

## Diagramas

| ID | Archivo |
|----|---------|
| ARCH-EXPLORE-TYPEAHEAD-01 | [`diagrams/ARCH-EXPLORE-TYPEAHEAD-01.md`](./diagrams/ARCH-EXPLORE-TYPEAHEAD-01.md) |

Sin data-model nuevo (cero migración Prisma). Sin ADR nuevo en `comun/adrs/`.

## Handoff Backend

[`handoff-backend-fase-9.md`](./handoff-backend-fase-9.md) — **obligatorio** por US-EXPLORE-09 / US-EXPLORE-11.

## Notas Frontend

- Preview: animación **dentro** del card; mismos triggers F8 (hover ~300 ms / long-press ~500 ms); cache por `id`; sin botón «Vista rápida». Contenido = `US-EXPLORE-05` (no recortar).
- Typeahead: debounce; `GET /api/providers?q&lat&lng&radiusKm&limit=10` (no filtrar el array paginado en memoria). Filas = `id` + `businessName` + `coverUrl`/`logoUrl`. Sin filas SKU.
- Card: quitar slot visual `minPrice`; mostrar `distanceKm` + ETA cliente (`computeEtaMinutes`, ADR-017). No pintar `sampleProducts`.
- FilterBar: Mayoreo → `offersWholesale=true`; A domicilio → `offersDelivery=true`; URL shareable. Retirar Orgánico y «Filtros».
- Chrome (`US-GEO-24`): una barra horizontal + mapa ~+10–20%; no regresionar BUG-012/013 ni `CO-F7-001`.
- Clamp F8 y `MEXICO_BOUNDS` se conservan.

## Quality

No emitir `quality/REVIEW-ARCH.md` ni `READY-FOR-QA.md` hasta cierre Backend (filtros listing + tests).

## Fuera de alcance

Schema orgánico, typeahead de SKUs, endpoint `/suggest`, Places, Distance Matrix, clustering, Maps JS, bbox Must de lista, pan→radio, pasarela, CFDI, DASH/PDF, Redis lockfile, CI YAML, reopen F7/F8.
