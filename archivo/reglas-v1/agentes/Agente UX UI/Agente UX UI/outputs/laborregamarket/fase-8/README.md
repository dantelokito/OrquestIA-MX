# Fase 8 — Explorar polish (diseño)

> **Producto:** LaBorregaMarket v0.8.3  
> **Fecha diseño:** 24/08/2026  
> **Estado:** Diseño listo para Frontend. Quality Gate pendiente de implementación FE.

`fase-7/` **solo lectura**. `fase-6/` **congelada**. Pagos/CFDI Won't (`CO-F6-001`). **`CO-F7-001` intacto** (pan ≠ radio). **`CO-F8-001`** clamp 0.5–10. **`CO-F8-002`** mapa México. **`CO-F8-003`** preview hover/long-press.

## Alcance

| US | Superficie |
|----|------------|
| US-GEO-17…20 | `/explorar` — LocationChip + panel (buscar, favoritas, guardar in-app) |
| US-GEO-21, US-GEO-22 | Overlay radio compacto; 500 m–10 km; copy metros |
| US-GEO-23 | `maxBounds` México; FitCircle; rechazo fuera de MX |
| US-EXPLORE-07 | Preview anclado a card (hover / long-press); sin «Vista rápida» |

## User flows

| ID | Archivo |
|----|---------|
| UF-GEO-01 | [`user-flows/UF-GEO-01-explorar-f8.md`](./user-flows/UF-GEO-01-explorar-f8.md) |
| UF-EXPLORE-07 | [`user-flows/UF-EXPLORE-07-preview-hover.md`](./user-flows/UF-EXPLORE-07-preview-hover.md) |

## Wireframes

| ID | Archivo |
|----|---------|
| WF-explorar-ubicacion | [`wireframes/WF-explorar-ubicacion.md`](./wireframes/WF-explorar-ubicacion.md) |
| WF-explorar-radio | [`wireframes/WF-explorar-radio.md`](./wireframes/WF-explorar-radio.md) |
| WF-explorar-mapa-mexico | [`wireframes/WF-explorar-mapa-mexico.md`](./wireframes/WF-explorar-mapa-mexico.md) |
| WF-explorar-preview-card | [`wireframes/WF-explorar-preview-card.md`](./wireframes/WF-explorar-preview-card.md) |

## Handoff

[`handoff-frontend-fase-8.md`](./handoff-frontend-fase-8.md) — **cuatro partes**.

Contratos Arquitecto (no inventar APIs): `fase-8/api/API-GEO-01.md`, `API-ADDRESSES-01.md`, `API-PROVIDER-PREVIEW-01.md`. ADR-028.

## Decisiones UX F8

| ID | Decisión |
|----|----------|
| D-F8-UX-1 | Reposo = un `LocationChip` (≥44px). Abierto = sheet `<md` / popover `≥md`. GPS en FilterBar. |
| D-F8-UX-2 | Chip absorbe “Centro: X”. `ExploreCount` permanece. R &lt; 1 km en metros. |
| D-F8-UX-3 | Overlay: una fila valor + range + extremos “500 m” / “10 km”; `step=0.5`; sin `RadiusClampHint`. |
| D-F8-UX-4 | “Ampliar radio” +0.5 km; **oculto en 10**. Copy de tope = 10 km, nunca 25. |
| D-F8-UX-5 | `MEXICO_BOUNDS` + viscosidad 1.0 + `minZoom` 5. GPS denegado ≠ GPS fuera de MX. |
| D-F8-UX-6 | DELETE de la favorita activa: pin se queda; chip = `formattedAddress`. |
| D-F8-UX-7 | Preview = popover anclado a la card. Contenido = `US-EXPLORE-05`. Sin botón «Vista rápida». |
| D-F8-UX-8 | Teclado: icono revelado en `:focus-visible` + **Alt+Enter**. Enter/clic corto = detalle. Escape cierra. |
| D-F8-UX-9 | Hover open 300 ms / close 150 ms; long-press 500 ms. Reduced-motion: delays 0. |

## Fuera de alcance

FilterBar, recorte de `US-EXPLORE-05`, login (salvo puente invitado→guardar), DASH, clustering, Maps JS, Places, bbox Must de API, polígono INEGI, pan→radio, pagos/CFDI, PWA.

Baseline solo lectura: F7 `UF-GEO-01` / `WF-explorar-mapa-primero` / `WF-explorar-preview`. Contenido preview F7 `US-EXPLORE-05`.

---

*Índice Fase 8 — Agente UX/UI Designer, LaBorregaMarket v0.8.3.*
