# Handoff Arquitecto — Fase 5

> **De:** Product Manager  
> **Para:** @Arquitecto de Software  
> **Fecha:** 14/08/2026

## Decisiones a resolver (ADRs)

| ADR | Tema | Detalle |
|-----|------|---------|
| ADR-020 | Motor de mapa | **Supera ADR-016.** Leaflet + teselas OSM (o equivalente Open Source) en `/explorar`. Sin Google Maps JS API. Cierra OBS-F4-023. Documentar attribution OSM y política de uso de tiles. |
| ADR-021 | Marca por proveedor | Persistencia `primaryColor` / `secondaryColor` en `Provider`; validación de hex y contraste CTA (texto claro sobre primario) en servidor; aplicación de tokens a sesión PROVIDER (no a CLIENT). |
| ADR-022 | Catálogo inhabilitado | Regla server-side: `ProviderProduct` inactivo no se lista en APIs públicas/detalle y `POST /api/orders` + POS rechazan el `productId`. No es stock. |

El contrato Haversine `GET /api/providers?lat&lng&radiusKm` (`US-GEO-02` / API-GEO-01 F4) **no se reemplaza** por bounding box. Bbox API es Could.

## Contratos a documentar (`fase-5/api/`)

| Contrato | US |
|----------|----|
| API-GEO-01 (delta motor, no query) | US-GEO-04 — el FE deja de depender de Google Maps JS key; el API de radio no cambia |
| API-PROVIDER-PRODUCTS-01 (delta / endurecer) | US-CAT-01 — listados y comandos de venta filtran/rechazan inactivos |
| API-PROVIDER-SETTINGS-01 (delta brand) | US-BRAND-01 — `primaryColor`, `secondaryColor`; PATCH con validación de contraste |
| API-SESSION-THEME-01 (o incluir en AUTH/me) | US-BRAND-02 — el cliente de sesión PROVIDER recibe los colores para hidratar CSS |

## Delta de schema propuesto (a validar/ajustar por Arquitecto)

- `Provider` (+campos): `primaryColor` (String? hex), `secondaryColor` (String? hex). Null = tokens de plataforma.
- Sin cambio de `Order` / pagos.
- `ProviderProduct.isActive` (o el flag F1 equivalente): documentar que ya es la fuente de verdad y **todas** las lecturas/escrituras de venta la respetan.

## Requerimientos no funcionales

| Categoría | Requerimiento |
|-----------|---------------|
| Costo | Cero claves de facturación Google Maps JS para Explorar. Embed/URL de reseñas (`US-REV-03`) se mantiene. |
| Seguridad | Solo PROVIDER dueño (o ADMIN) escribe colores. Validar hex. Rechazar contraste insuficiente (no fiarse solo del FE). |
| Consistencia | Producto inactivo: 0 lecturas en catálogo público/POS; comandos de venta → error envelope ADR-003. |
| Accesibilidad | Mapa no es la única vía; lista siempre presente. Attribution OSM. |
| Extensibilidad | Viewport/bbox y clustering son Should de UX; si se implementan, debounce y `dynamic import` quedan en el ADR, no en las US del PM. |

## Idea de implementación (no es contrato)

Dante adjunta una directiva de producto como **idea** para FE/Arquitecto. Úsala para el ADR-020, no la copies a las US:

- Stack sugerido: Leaflet + react-leaflet, teselas OSM, clustering, debounce al terminar pan/zoom, carga del mapa sin SSR para evitar hidratar `window`.
- Filtrado por viewport (south/west/north/east) alineado a la lista: **Should de UX**; el filtro Must de negocio sigue siendo radio Haversine.
- No exigir en DoD de producto nombres de paquetes npm ni rutas de archivo (`ExploreMap.tsx`).

## Fuera de alcance F5

Pasarela de pagos, CFDI, PWA, flotilla, Places API, Distance Matrix, Google Maps JS API, bounding-box API Must.

## Dependencia DevOps

Dejar de requerir `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` para Explorar en local/QA. Si F4 la documentó en `infra-requirements.md`, marcarla como no necesaria para GEO (puede quedar para otros usos solo si el embed de reseñas la necesitara — hoy es URL/Place ID, no JS API).

## Entregables esperados

1. `adrs/ADR-020`, `ADR-021`, `ADR-022`
2. Deltas API listados arriba
3. Actualizar `data-model/DB-providers.md` (colores + regla CAT)
4. `handoff-backend-fase-5.md` / `handoff-frontend` según convención del Arquitecto
5. Actualizar `sad.md` (F5 deja de ser "visión pagos") y `OBSERVABILITY.md`
