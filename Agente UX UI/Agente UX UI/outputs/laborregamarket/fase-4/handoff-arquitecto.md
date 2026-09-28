# Handoff Arquitecto — LaBorregaMarket UX/UI v0.4.0

> **De:** Agente UX/UI Designer  
> **Para:** @Arquitecto de Software  
> **Fecha:** 14/08/2026  
> **Prioridad:** Contratos GEO, REVIEWS, ETA, ADMIN analytics, POS báscula (client-only)

---

## Estado: DISEÑO LISTO ✅

Flujos y wireframes F4 publicados. No hay código F4. F3 implementado no debe romperse.

**Lee primero:** [`handoff-frontend.md`](./handoff-frontend.md) + [`../comun/information-architecture.md`](../comun/information-architecture.md) v0.3.0.

---

## Requerimientos técnicos derivados del diseño

| # | Requisito | Origen |
|---|-----------|--------|
| R1 | Google Maps JS API **reemplaza** Leaflet en `/explorar` (un motor). Lazy load / dynamic import. Clave y quotas en infra, no en UI. | D-F4-2, WF-explorar-geo |
| R2 | Lista de resultados es **fallback a11y y de resiliencia** si Maps falla (adblock, quota, red). | DoD WCAG F4 |
| R3 | `GET /api/providers` acepta `lat`, `lng`, `radiusKm` (1–25; default 10). Bounding box NL; 400 si inválido. | US-GEO-02 |
| R4 | Recurso `UserAddress` (lat/lng/formattedAddress/label/isFavorite/isDefault). Auth requerida para escribir. | US-GEO-03 |
| R5 | `Review` 1:1 con `orderId` en `COMPLETED`. Recalc `Provider.rating` / `reviewCount`. POS walk-in sin `clientId` no reseña. | US-REV-01/02 |
| R6 | Campos Google en Provider: Place ID o URL, `googleReviewsEnabled`. **Solo embed/enlace** — no Places API. Apagar vitrina si se revoca `isVerified` (no borrar dato). PATCH 403/422 si `!isVerified`. | D-F4-1 |
| R7 | `preparationTimeMinutes` + fórmula simple de traslado (no Distance Matrix en Must). Endpoint ETA o campo en checkout. | D-F4-4 |
| R8 | `GET /api/admin/analytics` periodo today/7d/30d. GMV **excluye CANCELLED**. Split MARKETPLACE vs POS. Distinto de analytics de un proveedor. | US-ADMIN-01 |
| R9 | Báscula: **WebSerial/WebHID en cliente**. Sin persistir periférico en BD. Registro de drivers extensible (`drivers/registry.ts`). VID/PID + fallback modelo + `localStorage`. | US-POS-05/06 |
| R10 | Should delivery: `fulfillmentType` + snapshot dirección. Máquina de estados F3 reutilizada. Copy UI "En camino" solo DELIVERY. Sin ruteo ni tracking. | US-ORDERS-05 |
| R11 | Volumen assets: Maps tiles terceros; embed Google iframe lazy; no descargar reseñas Google. | WF-fruteria-reviews |

---

## Accesibilidad y NFR UI

- Contraste AA en banner azul de verificación (`blue-900` sobre `blue-50`).
- Mapa no es la única vía para elegir frutería.
- ETA no bloquea confirmar pedido si el cálculo falla.
- POS F3 (teclado peso) es el fallback si no hay Serial.

---

## Fuera de alcance (no diseñar contratos)

Pasarela, CFDI, PWA, Places Details/reviews sync, Distance Matrix, flotilla, Redis/WA (NOTIFY-06/07/08 — infra, no UI).

---

*Handoff UX → Arquitecto — LaBorregaMarket v0.4.0*
