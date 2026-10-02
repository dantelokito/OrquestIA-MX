# PRD Corto — LaBorregaMarket Fase 3

> **Proyecto:** LaBorregaMarket  
> **Fecha:** 14/08/2026  
> **Versión:** 0.3.0  
> **Agente:** Product Manager  
> **Origen:** consolidación de UF/WF F3, FEAT-ORDERS/POS/DASH y matrices QA (el alcance ya estaba implementado; este PRD cierra el hueco documental del PM).

## Objetivo

Permitir al cliente **encargar pickup** desde el detalle de frutería y al proveedor **cobrar en mostrador**, **operar órdenes activas** y **ver ventas** — sin pasarela, CFDI, hardware POS ni delivery.

## Módulos

| Módulo | US | Rutas |
|--------|-----|-------|
| ORDERS | US-ORDERS-01 … 04 | `/fruteria/[id]`, `/carrito`, `/cuenta` |
| POS | US-POS-01 … 04 | `/proveedor/pos` |
| OPS | US-OPS-01 … 03 | `/proveedor/ordenes` |
| DASH | US-DASH-01 … 03 | `/proveedor/dashboard` |

## Fuera de alcance (Won't)

Pasarela de pagos, CFDI, WebSerial/báscula hardware, delivery, reseñas, PWA, listado ADMIN de órdenes (BL-067 Should diferido).

## Decisiones ya cerradas (UX)

CO-001 carrito página dedicada; CO-002 SubNavProveedor; Encargar CTA dominante; `IN_TRANSIT` = "Listo para recoger"; contacto F2 secundario (D-F3-7).
