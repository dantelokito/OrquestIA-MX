# Fase 5 — GEO Leaflet/OSM, catálogo endurecido, marca por proveedor (PM)

**Estado:** discovery cerrado 14/08/2026. Alcance confirmado por Dante: **sin pagos**; motor de mapa sin API de facturación; radio y ubicación recolocados; toggle de producto consistente en todos los canales; colores primario/secundario en sesión PROVIDER. **Sin código todavía** — pendiente diseño UX y contratos de Arquitecto.

**US:** `US-GEO-04`, `US-GEO-05`, `US-CAT-01`, `US-BRAND-01`, `US-BRAND-02`

**Change order:** [`CO-F5-001`](./change-orders/CO-F5-001-revertir-google-maps.md) revoca D-F4-2 (Google Maps JS → Leaflet/OSM).

| Artefacto | Ruta |
|-----------|------|
| PRD | [prd.md](./prd.md) |
| Historias | [user-stories/](./user-stories/) |
| Change orders | [change-orders/](./change-orders/) |
| Handoff UX | [handoff-ux-ui.md](./handoff-ux-ui.md) |
| Handoff Arquitecto | [handoff-arquitecto.md](./handoff-arquitecto.md) |
| Prompt activación UX | [activation-prompt-ux.txt](./activation-prompt-ux.txt) |
| Prompt activación Arquitecto | [activation-prompt-arquitecto.txt](./activation-prompt-arquitecto.txt) |

## Qué no hacer aquí

- No implementar pasarela, CFDI, PWA instalable ni logística de reparto real.
- No reintroducir Google Maps JS API en `/explorar`. El embed/enlace de reseñas (`US-REV-03`) se mantiene.
- No copiar la directiva Leaflet (npm, debounce, rutas de componente) como criterios de aceptación.
- No pintar el marketplace con colores del proveedor cuando el usuario es CLIENT o ADMIN.
