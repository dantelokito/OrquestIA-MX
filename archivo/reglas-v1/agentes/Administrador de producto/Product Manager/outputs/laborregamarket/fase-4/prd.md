# PRD Corto — LaBorregaMarket Fase 4

> **Proyecto:** LaBorregaMarket
> **Fecha:** 14/08/2026
> **Versión:** 0.4.0
> **Agente:** Product Manager
> **Origen:** ajuste de alcance confirmado por Dante sobre la visión F4 (reseñas, geo, notify-scale, admin analytics, báscula). Discovery formal — nada de esto tiene código todavía.

## Objetivo

Ganar confianza del cliente (reseñas reales + vínculo a Google Maps para negocios verificados), mejorar el descubrimiento geográfico (mapa interactivo con radio ajustable y direcciones guardadas), dar visibilidad de tiempos de entrega (ETA por preparación + distancia), escalar notificaciones (Redis + WhatsApp Business) y dar analítica de plataforma al ADMIN. El POS gana lectura de báscula digital con detección de modelo.

## Módulos

| Módulo | US | Notas |
|--------|-----|-------|
| REVIEWS | US-REV-01…04 | Reseña nativa post-`DELIVERED` + enlace/embed Google exclusivo de proveedores `isVerified=true` |
| GEO | US-GEO-01…03 | Google Maps en `/explorar` (sustituye Leaflet), radio 1–25 km, direcciones favoritas del cliente |
| NOTIFY-SCALE | US-NOTIFY-06…09 | Cola Redis (cierra ADR-008), WhatsApp Business API, ETA en checkout/notificaciones |
| ADMIN-ANALYTICS | US-ADMIN-01 | Dashboard de plataforma (GMV, órdenes, proveedores activos) — distinto del DASH ilustrativo de F3 |
| POS (extensión) | US-POS-05…06 | Báscula digital WebSerial/WebHID con autodetección de modelo |
| ORDERS (extensión, Should) | US-ORDERS-05 | Checkout con entrega a domicilio usando dirección guardada — depende de GEO |

## Fuera de alcance (Won't F4)

Pasarela de pagos, CFDI, PWA instalable, sincronización de reseñas vía Google Places API (solo enlace/embed), logística de reparto real (rutas, flotilla), impresora térmica, lector de código de barras, expansión fuera de Nuevo León.

## Decisiones cerradas (14/08/2026)

| # | Decisión | Cierre |
|---|----------|--------|
| D-F4-1 | Reseñas Google | Embed/enlace (URL o Place ID), **no** importación vía API. Exclusivo `isVerified=true`; los no verificados ven el control **bloqueado** con copy "Requiere verificación" |
| D-F4-2 | Motor de mapa | Google Maps JS API sustituye Leaflet en `/explorar` (Arquitecto confirma reemplazo total vs coexistencia temporal — recomendación PM: reemplazo único) |
| D-F4-3 | Direcciones | El cliente guarda ubicación/pin como favorita desde `/explorar`; requiere sesión |
| D-F4-4 | ETA | `preparationTimeMinutes` (config proveedor) + tiempo de traslado estimado por distancia; visible en checkout, detalle de pedido y notificaciones (email/WA) |
| D-F4-5 | Delivery | **Should**, no Must — MVP de entrega a domicilio solo después de cerrar GEO (US-GEO-*); pickup se mantiene como flujo principal de F3 |
| D-F4-6 | Báscula | Must incluye autodetección de modelo (VID/PID) con fallback de selección manual; catálogo de drivers acotado al hardware piloto disponible |

## Priorización MoSCoW

| Prioridad | Items |
|-----------|-------|
| **Must** | US-REV-01, 02, 03, 04 · US-GEO-01, 02, 03 · US-NOTIFY-06, 07 · US-ADMIN-01 · US-POS-05, 06 |
| **Should** | US-NOTIFY-08, 09 (WhatsApp + ETA en mensajes) · US-ORDERS-05 (delivery MVP) |
| **Could** | Fotos en reseña, importación Places API, Distance Matrix real para ETA |
| **Won't** | Ver "Fuera de alcance" |

## Métricas de éxito

| Métrica | Objetivo |
|---------|----------|
| Proveedores verificados con Google vinculado | > 60% de verificados en 30 días |
| Uso de filtro por radio en `/explorar` | > 30% de sesiones con ubicación activada |
| Reseñas nativas por pedido entregado | > 20% en 30 días post-lanzamiento |
| Emails perdidos por cold start (ADR-008) | 0 tras migrar a Redis |

## Referencias

- Índice de fases: [`../README.md`](../README.md)
- Backlog: [`../comun/backlog.md`](../comun/backlog.md) (sección Fase 4, BL-080+)
- Schema base: `LaBorregaMarket/prisma/schema.prisma` (`Provider`, `Order`, `OrderItem`)
- ADR previo: `Agente Arquitecto de Software/Agente Arquitecto/outputs/laborregamarket/adrs/ADR-008-notification-async.md`

---

*PRD Fase 4 — Agente Product Manager, LaBorregaMarket v0.4.0.*
