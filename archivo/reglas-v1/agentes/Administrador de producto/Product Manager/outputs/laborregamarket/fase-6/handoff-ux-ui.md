# Handoff UX/UI — Fase 6

> **De:** Product Manager  
> **Para:** @UX/UI Designer  
> **Fecha:** 16/08/2026 (v0.6.1 — slice C GEO)

F6 tiene **tres slices**. El de **deuda ya está diseñado** (16/08). Este handoff pide diseño de **reportes** y **delta Explorar zoom↔radio**. No rediseñar ContactCTA, invariante Leaflet ni fallback de marca.

## Slice A — Deuda (no rediseñar)

Canónico ya publicado:

`Agente UX UI/Agente UX UI/outputs/laborregamarket/fase-6/handoff-frontend-fase-6.md`

Cubre `US-NOTIFY-10` (toasts), `US-GEO-06` (invariante Leaflet), `US-BRAND-03` (500 ≠ empty), `US-OPS-07` (`.env.example`). Frontend implementa ese archivo. **No volver a WF-contacto-resiliencia.**

## Slice B — Reportes PROVIDER (diseñar)

Delta sobre F3 `/proveedor/dashboard` (`UF-DASH-01`, `WF-proveedor-dashboard`). Distinto de `/admin/analytics` (F4, plataforma).

| US | Flujo a diseñar | Notas |
|----|-----------------|-------|
| US-DASH-04 | `UF-DASH-02` — reportes día / mes / año | Selector de **fecha concreta**: día, mes (MM/AAAA) o año (AAAA). TZ Monterrey. KPIs: GMV, ticket promedio, # órdenes, split Encargar vs POS, serie (mes→días, año→meses), top productos incl. venta rápida. Empty amigable. 500 ≠ empty POS. |
| US-DASH-05 | WF print | Botón **Imprimir**. `@media print`: sin header/subnav; sí nombre de frutería, periodo, TZ, fecha de generación. Mismo contenido que pantalla. |
| US-DASH-06 | CTA Descargar PDF | Junto a Imprimir. Mismo contenido. No diseñar CFDI ni “enviar por email”. Mecanismo PDF = Arquitecto. |

Superficie: mismo panel PROVIDER (`/proveedor/dashboard` o subruta `/proveedor/reportes` — tú decides). Un solo negocio (el del dueño). Dashboard F3 “hoy + 7d” puede quedar como vista por defecto.

**DoD UX F6 (reportes):**

- Selector de grano + fecha operable por teclado; CTAs Imprimir / Descargar ≥44px.
- Print: chrome de app oculto; documento legible en blanco y negro razonable.
- No CTA primary de cobro en el dashboard (sigue informativo; Imprimir/PDF son acciones de documento).
- No copiar look & feel de `/admin/analytics` (slate “plataforma”).

## Slice C — GEO zoom ↔ radio (diseñar)

Delta sobre F5 `UF-GEO-01` / `WF-explorar-leaflet` (solo lectura). `CO-F6-002`.

| US | Flujo a diseñar | Notas |
|----|-----------------|-------|
| US-GEO-07 | Homologar visualizador y slider | Círculo de cobertura **siempre visible**. Zoom/pan y slider 1–25 km son el mismo `radiusKm`. Slider mueve el encuadre del círculo. Clamp 25 km + hint no bloqueante. Lista = markers. No bbox, no clustering. |
| US-GEO-08 | Loading breve al refetch | Loop **B1→B2→B3** (`comun/brand/loader-borrega/`). Componente reutilizable. `aria-busy` + sr-only “Buscando fruterías”. `prefers-reduced-motion` = B1 estático. Mapa y círculo visibles. Error: lista previa + Reintentar. No splash. |

**DoD UX F6 (GEO):**

- Slider operable por teclado; círculo no tapa attribution OSM ni el CTA de ubicación.
- Loading no oculta el mapa ni bloquea el slider; frames oficiales B1–B3 (no skeleton Must).
- Empty radio F5 (“No hay fruterías…” + Ampliar radio) se mantiene.

**Salida esperada:** `Agente UX UI/outputs/laborregamarket/fase-6/` — `UF-DASH-02`, WF reportes + print; delta `UF-GEO-01` / `WF-explorar-leaflet`; `handoff-frontend` **delta reportes y GEO** (no reescribir el de deuda); IA; Quality Gate cuando FE implemente.

**No diseñar:** pasarela, CFDI, PWA, flotilla, Google Maps JS, clustering, bbox Must, analytics ADMIN, deuda ContactCTA/Leaflet/marca (ya cerrada).
