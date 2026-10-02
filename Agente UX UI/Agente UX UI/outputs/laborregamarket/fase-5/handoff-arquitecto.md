# Handoff Arquitecto — LaBorregaMarket UX/UI v0.5.0

> **De:** Agente UX/UI Designer  
> **Para:** @Arquitecto de Software  
> **Fecha:** 14/08/2026  
> **Prioridad:** ADR-020 Leaflet/OSM, ADR-021 marca proveedor, ADR-022 catálogo inhabilitado

---

## Estado: DISEÑO LISTO ✅

Flujos y wireframes F5 publicados. No hay código F5. F3–F4 implementados no deben romperse (pickup, Haversine `lat/lng/radiusKm`, embed/enlace Google `US-REV-03`).

**Lee primero:** [`handoff-frontend.md`](./handoff-frontend.md) + [`../comun/information-architecture.md`](../comun/information-architecture.md) v0.4.0.

El PM ya pidió ADR-020/021/022 y contratos en `fase-5/api/`. Este handoff añade **NFR de UI** derivados del diseño.

---

## Requerimientos técnicos derivados del diseño

| # | Requisito | Origen |
|---|-----------|--------|
| R1 | Leaflet + teselas OSM **sustituye** Google Maps JS en `/explorar`. Sin clave de facturación. Cierra OBS-F4-023. | D-F5-2, CO-F5-001, WF-explorar-leaflet |
| R2 | Lista de resultados es **fallback a11y y de resiliencia** si las teselas fallan por **red**. No existe fallback "sin API key". | US-GEO-04, DoD WCAG F5 |
| R3 | `GET /api/providers?lat&lng&radiusKm` **no cambia** (Haversine F4). Bbox/viewport = Should UX, no contrato Must. | D-F5-3 |
| R4 | Attribution OSM visible; overlay de radio no la tapa. | WF-explorar-leaflet |
| R5 | Carga del mapa sin hidratar `window` (dynamic import / `ssr: false`) — **idea de implementación**, no AC de producto. Clustering y debounce pan/zoom = Should. | Handoff PM Arquitecto |
| R6 | `ProviderProduct` inactivo: 0 lecturas en explorar/detalle/POS; `POST /api/orders` y POS rechazan el `productId` (envelope ADR-003). No es stock. | US-CAT-01, ADR-022 |
| R7 | `Provider.primaryColor` / `secondaryColor` (hex o null). PATCH solo dueño o ADMIN. Rechazar contraste insuficiente **en servidor** (texto claro sobre primario ≥ 4.5:1). | US-BRAND-01, ADR-021 |
| R8 | Sesión PROVIDER hidrata tokens CSS; CLIENT/ADMIN/invitado = plataforma. Logout limpia. No pintar cards del marketplace con marca ajena. | US-BRAND-02 |
| R9 | Volumen assets: teselas OSM de terceros; no descargar Maps JS de Google para Explorar. Embed reseñas Google (URL/Place ID) se mantiene. | US-REV-03 intacto |
| R10 | Dejar de exigir `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` para Explorar en local/QA. | CO-F5-001 |

---

## Accesibilidad y NFR UI

- Contraste AA obligatorio para guardar primario (CTA texto blanco).
- Slider radio operable por teclado; CTA ubicación ≥44px.
- Mapa no es la única vía para elegir frutería.
- Estados de pedido siguen tokens F3 (nunca solo color de marca del proveedor).
- Empty POS si el catálogo activo queda en cero.

---

## Fuera de alcance (no diseñar contratos)

Pasarela, CFDI, PWA, flotilla, Google Maps JS en Explorar, Places API, Distance Matrix, bounding-box API Must, paleta derivada del logo.

---

*Handoff UX → Arquitecto — LaBorregaMarket v0.5.0*
