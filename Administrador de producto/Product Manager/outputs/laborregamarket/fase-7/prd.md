# PRD Corto — LaBorregaMarket Fase 7

> **Proyecto:** LaBorregaMarket
> **Fecha:** 18/08/2026
> **Versión:** 0.7.1
> **Agente:** Product Manager
> **Objetivo del Negocio:** Hacer de `/explorar` la vista principal de descubrimiento: mapa estable, conteo real, favoritas entre dispositivos, preview útil del negocio y búsqueda por producto — sin romper el login en móvil.
> **Público Objetivo:** visitante y CLIENT en `/explorar`; CLIENT autenticado en favoritas y sesión.

## Resumen ejecutivo

F6 quedó **congelada**. El modelo `US-GEO-07` (pan/zoom derivan `radiusKm`) **rompe UX**: al mover el mapa se recalcula el radio y se desplaza el dashboard. F7 corrige el layout (mapa primero), el modelo de interacción, el origen de ubicación (SN o favorita servidor), el copy del conteo, y cierra huecos de producto (preview, `q` por catálogo, markers limpios) más el login cross-device.

Change order: [`CO-F7-001`](./change-orders/CO-F7-001-modelo-radio-mapa.md).

#### 1. Alcance (MVP)

* **Incluido:**
  - Layout mapa-primero; catálogo debajo; mapa arriba en móvil (ID000)
  - Pan/zoom para mirar **sin** cambiar radio; slider y dirección/GPS/favorita sí cambian centro/radio y encuadran (ID001, ID002, ID004)
  - Default San Nicolás de los Garza + 10 km; última favorita servidor si hay sesión (ID003)
  - Mapa +20% de alto; lista ≤20 con paginación (ID005)
  - `total` real en “N fruterías a R km” (ID006)
  - Favoritas solo backend (ID007)
  - Login móvil / otro navegador (ID008)
  - Preview proveedor (horario, flags, 3 reseñas, catálogo, mayoreo/menudeo) (ID009)
  - Búsqueda por nombre de frutería y producto activo (ID010)
  - Markers sin label permanente; icono negocio pequeño (ID011)
  - Empty de radio reutiliza loader borrega B1–B3 a tamaño ligeramente mayor que en carga (ID012)
* **Fuera de Alcance:**
  - Deuda F6 (Redis, CI, DASH reportes)
  - Pasarela, CFDI, PWA, flotilla, clustering, bbox Must, Google Maps JS, Places, Distance Matrix

#### 2. Módulos Principales

1. `[GEO]`: Layout, interacción mapa/radio, default/favorita, lista, markers, empty borrega (`US-GEO-09` … `16`)
2. `[EXPLORE]`: Preview y búsqueda (`US-EXPLORE-05`, `US-EXPLORE-06`)
3. `[AUTH]`: Sesión portable (`US-AUTH-09`)

## Objetivo

Que el usuario vea primero el mapa, ajuste el radio sin que el pan rompa la búsqueda, vea cuántas fruterías hay de verdad, reutilice favoritas en cualquier dispositivo, y entre al detalle con datos reales.

## Fuera de alcance (Won't F7)

Ver “Fuera de Alcance” arriba. `BL-040` sigue aparcado.

## Decisiones cerradas (18/08/2026)

| # | Decisión | Cierre |
|---|----------|--------|
| D-F7-1 | F6 congelada | F7 no incluye reportes ni deuda Redis/CI |
| D-F7-2 | Pan/zoom ≠ radio | Anula `D-F6-9` / `US-GEO-07` (`CO-F7-001`) |
| D-F7-3 | Default geo | San Nicolás de los Garza, NL; radio default **10 km**; clamp **1–25** |
| D-F7-4 | Memoria ubicación | API de usuario (`UserAddress`). Invitado = solo default SN |
| D-F7-5 | Conteo | `GET /api/providers` (o sucesor) devuelve `total` independiente de `page`/`limit` |
| D-F7-6 | Preview | Extender detalle proveedor; no Google Maps JS |
| D-F7-7 | Motor mapa | Leaflet/OSM invariante |
| D-F7-8 | AUTH-09 | Must; causa raíz (cookie/SameSite/Secure) = ADR Arquitecto |

## Priorización MoSCoW

| Prioridad | Items |
|-----------|-------|
| **Must** | US-GEO-09 … 16, US-AUTH-09, US-EXPLORE-05, US-EXPLORE-06 |
| **Should** | — |
| **Could** | — |
| **Won't** | Clustering, bbox Must, DASH F6, pagos |

## Métricas de éxito

| Métrica | Objetivo |
|---------|----------|
| En viewport móvil, el mapa está **arriba** del catálogo | 100% |
| Pan no dispara refetch ni cambia slider | 100% happy path US-GEO-10 |
| Copy “N … a R km” = `total` API, no `items.length` | 100% |
| Favorita en dispositivo A aparece en B con sesión | 100% US-GEO-14 + US-GEO-11 |
| Login en Safari/Chrome móvil y segundo desktop | 100% US-AUTH-09 |
| Búsqueda “mango” lista solo proveedores con producto activo | 100% US-EXPLORE-06 |
| `total=0` muestra borrega (tamaño empty) + copy/CTA; loading usa el mismo loop (tamaño menor) | 100% US-GEO-16 |

## Referencias

- Change order: [`change-orders/CO-F7-001-modelo-radio-mapa.md`](./change-orders/CO-F7-001-modelo-radio-mapa.md)
- Índice: [`../README.md`](../README.md)
- Backlog: [`../comun/backlog.md`](../comun/backlog.md)
- STATUS: [`../STATUS.md`](../STATUS.md)
- F5 layout: `fase-5/user-stories/US-GEO-05` (solo lectura)
- F4 favoritas: `fase-4/user-stories/US-GEO-03` (solo lectura)
- F2 búsqueda: `fase-2/user-stories/US-EXPLORE-02` (promovida por US-EXPLORE-06)
- Loader borrega: [`../comun/brand/loader-borrega/`](../comun/brand/loader-borrega/) (reuso F7 `US-GEO-16`)
