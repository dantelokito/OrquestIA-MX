# Fase 7 — Explorar UX + AUTH (diseño)

> **Producto:** LaBorregaMarket v0.7.1  
> **Fecha diseño:** 18/08/2026  
> **Estado:** Diseño listo para Frontend. Quality Gate pendiente de implementación FE.

`fase-6/` **congelada** (solo lectura). Pagos/CFDI Won't (`CO-F6-001`). **`CO-F7-001` anula** pan/zoom → `radiusKm` (D-F6-9 / US-GEO-07).

## Alcance

| US | Superficie |
|----|------------|
| US-GEO-09…16 | `/explorar` — layout mapa-primero, radio, SN/favorita, lista 20, `total`, favoritas servidor, markers, empty borrega |
| US-EXPLORE-05 | Preview vitrina (horario, flags, 3 reseñas, catálogo activo) |
| US-EXPLORE-06 | `q` unión nombre ∪ producto activo |
| US-AUTH-09 | Login móvil / otro navegador — copy no técnico |

## User flows

| ID | Archivo |
|----|---------|
| UF-GEO-01 | [`user-flows/UF-GEO-01-explorar-f7.md`](./user-flows/UF-GEO-01-explorar-f7.md) |
| UF-EXPLORE-05 | [`user-flows/UF-EXPLORE-05-preview.md`](./user-flows/UF-EXPLORE-05-preview.md) |
| UF-AUTH-09 | [`user-flows/UF-AUTH-09-sesion-movil.md`](./user-flows/UF-AUTH-09-sesion-movil.md) |

## Wireframes

| ID | Archivo |
|----|---------|
| WF-explorar-mapa-primero | [`wireframes/WF-explorar-mapa-primero.md`](./wireframes/WF-explorar-mapa-primero.md) |
| WF-explorar-preview | [`wireframes/WF-explorar-preview.md`](./wireframes/WF-explorar-preview.md) |
| WF-login-sesion | [`wireframes/WF-login-sesion.md`](./wireframes/WF-login-sesion.md) |

## Handoff

[`handoff-frontend-fase-7.md`](./handoff-frontend-fase-7.md)

Contratos Arquitecto (no inventar APIs): `fase-7/api/API-GEO-01.md`, `API-ADDRESSES-01.md`, `API-PROVIDER-PREVIEW-01.md`, `API-AUTH-01.md`.

## Decisiones UX F7

| ID | Decisión |
|----|----------|
| D-F7-UX-1 | Móvil `<=640px`: mapa **arriba**; desktop mapa dominante (~+20% alto vs F5) |
| D-F7-UX-2 | Pan/zoom = vista; **cero** refetch; slider/GPS/favorita = `fitBounds` + GET |
| D-F7-UX-3 | Copy “N fruterías a R km” = `meta.total` + `meta.radiusKm` |
| D-F7-UX-4 | Markers sin label permanente; tooltip hover/tap; icono negocio pequeño |
| D-F7-UX-5 | Empty `total=0`: B1–B3 tamaño empty; Ampliar radio F5; error ≠ empty |
| D-F7-UX-6 | Preview: horario 3 cols (apila `<640px`); flags solo si API true |
| D-F7-UX-7 | Invitado = SN; favorita → login; autenticado = last-used servidor |
| D-F7-UX-8 | Login: copy no técnico; no exponer SameSite/Secure |

## Fuera de alcance

Pasarela, CFDI, PWA, clustering, bbox Must, Google Maps JS, Places, Distance Matrix, reportes DASH F6, deuda Redis/CI.

Baseline solo lectura: F5 `UF-GEO-01` / `WF-explorar-leaflet`. No reimplementar el ciclo F6 zoom→radio.

---

*Índice Fase 7 — Agente UX/UI Designer, LaBorregaMarket v0.7.1.*
