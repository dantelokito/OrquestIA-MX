# Handoff Frontend — LaBorregaMarket Fase 6 reportes + GEO (v0.6.1)

> **De:** Agente UX/UI Designer  
> **Para:** @Frontend  
> **Fecha:** 16/08/2026  
> **Prioridad:** Slices B (reportes PROVIDER) y C (zoom↔radio + loader borrega)  
> **No reescribe:** [`handoff-frontend-fase-6.md`](./handoff-frontend-fase-6.md) (slice A — deuda ContactCTA / Leaflet / marca)

---

## Estado: LISTO PARA IMPLEMENTAR (diseño B + C)

Slice A (toasts 503/500, invariante OSM, fallback marca, `.env.example`) sigue el handoff del 16/08. Este archivo cubre **solo reportes y GEO**. Pagos/CFDI siguen fuera (`CO-F6-001`).

**Punto de entrada:** este archivo + [`../STATUS.md`](../STATUS.md) + [`../comun/design-tokens.md`](../comun/design-tokens.md) v0.6.1

Código: `C:\Users\PC GAMER\LaBorregaMarket`

Backend reportes: Arquitecto `fase-6/handoff-backend-fase-6-reportes.md` + `API-PROVIDER-REPORTS-01` / `API-PROVIDER-REPORTS-PDF-01`.  
GEO: **cero BE** — `API-GEO-01` nota F6; reusar `GET /api/providers`.

Quality Gate UX se emite **cuando FE implemente**. No hay `READY-FOR-QA` de checkout mientras DEV-P0-001 o DEV-P0-002 sigan abiertos.

---

## Impacto si no se cierra

El proveedor solo ve “hoy + 7d” y no puede llevar un mes a papel/PDF. En Explorar, alejar el zoom no mueve la lista: el mapa y el catálogo mienten. Un pulse genérico en la lista se siente a bug, no a búsqueda.

---

## Incidencias / US de este handoff

| ID | Frontend hace |
|----|----------------|
| **US-DASH-04** | Vista Reportes en `/proveedor/dashboard`: grano + fecha, KPIs, split, serie, top productos |
| **US-DASH-05** | Botón Imprimir + CSS `@media print` |
| **US-DASH-06** | Botón Descargar PDF → `GET /api/provider/reports.pdf` |
| **US-GEO-07** | Círculo siempre on; zoom/pan ↔ slider = mismo `radiusKm`; clamp 25 + hint |
| **US-GEO-08** | `BrandLoader` B1–B3 en la lista al refetch; `aria-busy`; reduced-motion = B1 |

**No implementar aquí:** pasarela, CFDI, CSV, email del reporte, ticket térmico, clustering, bbox Must, YAML CI, `@upstash/redis`, rediseño ContactCTA.

---

## Orden de implementación

```
1. DashboardViewSwitcher Resumen | Reportes (default Resumen F3 intacto)
2. GrainSelector + ReportPeriodPicker + GET /api/provider/reports
3. KPIs + split Encargar/POS + serie + top (empty ≠ POS)
4. Imprimir (print CSS) + Descargar PDF
5. Círculo siempre visible; zoom/pan → radiusKm (debounce ~300 ms)
6. Slider → fitBounds; clamp 25 + RadiusClampHint
7. BrandLoader en lista; copiar PNG a public/brand/loader-borrega/
```

---

## Entregables UX (índice)

| Tipo | Archivo |
|------|---------|
| Flow | [`user-flows/UF-DASH-02-reportes-periodo.md`](./user-flows/UF-DASH-02-reportes-periodo.md) |
| WF | [`wireframes/WF-proveedor-reportes.md`](./wireframes/WF-proveedor-reportes.md) |
| WF print | [`wireframes/WF-proveedor-reportes-print.md`](./wireframes/WF-proveedor-reportes-print.md) |
| Flow | [`user-flows/UF-GEO-01-zoom-radio.md`](./user-flows/UF-GEO-01-zoom-radio.md) |
| WF | [`wireframes/WF-explorar-zoom-radio.md`](./wireframes/WF-explorar-zoom-radio.md) |
| Tokens | [`../comun/design-tokens.md`](../comun/design-tokens.md) §6e |
| IA | [`../comun/information-architecture.md`](../comun/information-architecture.md) |
| F5 Explorar (solo lectura) | [`../fase-5/wireframes/WF-explorar-leaflet.md`](../fase-5/wireframes/WF-explorar-leaflet.md) |
| F3 Dashboard (solo lectura) | [`../fase-3/wireframes/WF-proveedor-dashboard.md`](../fase-3/wireframes/WF-proveedor-dashboard.md) |

---

## Design system — componentes nuevos F6

| Componente | Spec en tokens |
|------------|----------------|
| DashboardViewSwitcher | Tabs locales; no 5ª SubNav |
| GrainSelector | Día \| Mes \| Año; min-h 44px |
| ReportPeriodPicker | date / month / year; max = hoy Monterrey |
| DocumentActions | Secondary Imprimir + PDF |
| ReportOriginSplit | Encargar vs Mostrador; no KpiCardAdmin |
| ReportPrint | `.no-print` chrome; encabezado hoja |
| BrandLoader | B1–B3 500 ms; reduced-motion B1 |
| RadiusClampHint | "Máximo 25 km"; no tapa OSM |

Loader diseño: `Administrador de producto/Product Manager/outputs/laborregamarket/comun/brand/loader-borrega/`. Runtime: copiar 1:1 a `LaBorregaMarket/public/brand/loader-borrega/`.

---

## Decisiones de diseño F6 (UX)

| ID | Decisión |
|----|----------|
| **D-F6-UX-1** | Reportes en `/proveedor/dashboard?view=reportes`. Sin `/proveedor/reportes` y sin 5ª pestaña SubNav. Resumen F3 = default. |
| **D-F6-UX-2** | Look PROVIDER (`KpiCard`, `OriginBadge`). Prohibido slate `/admin/analytics`. |
| **D-F6-UX-3** | Imprimir / PDF = Button Secondary. Dashboard informativo. |
| **D-F6-UX-4** | Should F5 “sync viewport / clustering” no se implementa. Zoom mueve el **mismo** `radiusKm` Haversine. Clustering = Won't. |
| **D-F6-UX-5** | Loading refetch = BrandLoader en lista, no skeleton Must. Mapa y slider no se bloquean. |

---

## Estados obligatorios (4 por superficie)

| Superficie | Loading | Empty | Success | Error |
|------------|---------|-------|---------|-------|
| Reportes JSON | Skeleton KPIs + chart | KPIs 0 / `—`; copy amigable; print/PDF on | Datos del periodo | ErrorBanner + Reintentar; ≠ empty POS |
| PDF | Spinner en botón | PDF 200 empty | Attachment | ErrorBanner; no blob truncado |
| Print | — | Hoja con empty | Diálogo nativo | Botón disabled si no hay JSON |
| Explorar refetch | BrandLoader + `aria-busy` | Empty radio F5 + Ampliar radio | Lista = markers | Lista previa + Reintentar |
| Clamp 25 | — | — | Hint no bloqueante | — |

---

## APIs a consumir (no inventar rutas)

| Método | Ruta | Uso UI |
|--------|------|--------|
| GET | `/api/provider/reports?grain=&date=` | Vista Reportes |
| GET | `/api/provider/reports.pdf?grain=&date=` | Descargar PDF |
| GET | `/api/provider/dashboard` | Vista Resumen F3 (**sin delta**) |
| GET | `/api/providers?lat=&lng=&radiusKm=` | Explorar Haversine F4 (**sin query nueva**) |
| GET/POST | `/api/users/me/addresses` | Favoritas F4 |

`grain`: `day` \| `month` \| `year`. `date`: `YYYY-MM-DD` \| `YYYY-MM` \| `YYYY`. Periodo futuro → 400 (bloquear en picker). 401/403 según contrato.

Preservar: pickup F3, ContactCTA slice A, Leaflet F5, embed Google `US-REV-03`, POS cobro.

---

## Accesibilidad (Fase 6 B+C)

- [ ] GrainSelector y date picker operables por teclado; labels visibles
- [ ] Imprimir / PDF ≥44px
- [ ] Chart con tabla `sr-only` (o tabla visible en print)
- [ ] Print: Header + SubNav ocultos; encabezado de documento presente
- [ ] Slider radio teclado; círculo no tapa attribution OSM ni CTA ubicación
- [ ] Lista `aria-busy` + sr-only "Buscando fruterías"
- [ ] `prefers-reduced-motion`: BrandLoader = B1 estático; chart instantáneo
- [ ] 500 reportes ≠ "No hay productos activos"
- [ ] Split Encargar/POS nunca color-only

---

## Checklist DoD Frontend F6 (reportes + GEO)

- [ ] Switcher Resumen \| Reportes; Resumen F3 intacto
- [ ] Tres granos + empty amigable + 500 ErrorBanner
- [ ] Imprimir oculta chrome; PDF mismo set (también empty)
- [ ] Círculo siempre visible si hay coords; zoom ↔ slider ↔ lista = mismo `radiusKm`
- [ ] Clamp 25 + hint; cero bbox; cero clustering
- [ ] BrandLoader B1–B3 en lista; mapa visible; reduced-motion B1
- [ ] PNG copiados a `public/brand/loader-borrega/`
- [ ] Cero pasarela, cero rediseño slice A, cero Maps JS

---

## Fuera de alcance

Pasarela, cobros POS nuevos, CFDI, CSV, email del reporte, ticket térmico, PWA, flotilla, Google Maps JS, clustering, bbox Must, analytics ADMIN, comparativa vs periodo anterior (Should), serie horaria en día (Could), Quality Gate (cuando FE cierre).

---

*Handoff UX → Frontend — LaBorregaMarket v0.6.1 — 16/08/2026. Delta reportes + GEO; no sustituye el handoff de deuda.*
