# Fase 5 — GEO Leaflet/OSM, catálogo inhabilitado, marca PROVIDER (v0.5.0)

| Tipo | Ruta |
|------|------|
| Matrices | [test-matrices/](./test-matrices/) |
| Bug reports | [bug-reports/](./bug-reports/) |
| Sign-off | [qa-signoffs/QA-F5-signoff.md](./qa-signoffs/QA-F5-signoff.md) |
| Deuda previa (memo UX + Arquitecto) | [deuda-tecnica-fases-previas/IMPACTO-NO-ATENDER.md](./deuda-tecnica-fases-previas/IMPACTO-NO-ATENDER.md) |

## Alcance

| Módulo | US | Contratos | Happy path |
|--------|-----|-----------|------------|
| GEO motor + layout | US-GEO-04/05 | API-GEO-01 (query F4 intacta) | HP-GEO-04, HP-GEO-05 |
| CAT inhabilitado | US-CAT-01 | API-PROVIDER-PRODUCTS-01 | HP-CAT-01 |
| Brand + sesión | US-BRAND-01/02 | API-PROVIDER-SETTINGS-01, API-SESSION-THEME-01 | HP-BRAND-01, HP-BRAND-02 |
| Regresión F3/F4 | pickup, radio, Google reseñas | — | HP-REG-01 |

**Precondición:** migración Prisma `add_provider_brand_colors` (OBS-F5-023). No exigir `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` para `/explorar`.

**Fuera de alcance:** pagos, CFDI, PWA, flotilla, Google Maps JS en Explorar, clustering Should, stock/agotado.

Upstream: READY-FOR-QA Arquitecto + UX (15/08/2026).
