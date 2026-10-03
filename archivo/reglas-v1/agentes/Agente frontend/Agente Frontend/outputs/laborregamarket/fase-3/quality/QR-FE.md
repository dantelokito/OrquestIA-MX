# QR-FE — Informe de calidad Frontend Fase 3

> **Proyecto:** LaBorregaMarket  
> **Fase:** 3 — Pedidos, POS, dashboard (v0.3.0)  
> **Fecha:** 2026-08-13  
> **Agente:** Frontend Developer  
> **Destinatario:** UX/UI Designer (Quality Gate)

Autoevaluación 10 criterios × 10 puntos. Umbral líder: **≥80%** y **0 P0**.

---

## Rúbrica

| # | Criterio | Puntos | Notas |
|---|----------|--------|-------|
| 1 | Fidelidad a wireframes F3 | 8 | Encargar, carrito, POS split, órdenes, dashboard SVG. Print y teclado POS alineados a tokens. |
| 2 | Responsive (móvil / tablet / desktop) | 9 | Checkout mobile-first; POS `lg:flex-row`; SubNav overflow-x. |
| 3 | 4 estados UI | 9 | Loading/empty/error/success en carrito, cuenta, POS, órdenes, dashboard. |
| 4 | Consumo de API | 9 | Contratos Arquitecto (`/api/orders`, `/api/provider/pos/sales`, `/api/provider/orders`, `/api/provider/dashboard`). Idempotency-Key. |
| 5 | Validación de formularios | 8 | Notas 280, venta rápida inline, cantidad 3 decimales, ConfirmDialog. |
| 6 | Accesibilidad WCAG AA basal | 8 | Labels, tabs, dialogs, `IN_TRANSIT` copy, gráfico + tabla, touch 44px. |
| 7 | Contacto F2 intacto | 10 | Llamar/WhatsApp conservados; Encargar es CTA dominante con ítems. |
| 8 | CO-001 (venta rápida + UoM) | 9 | Badge icono+texto; PZA/KG/GR; línea libre no va al catálogo. |
| 9 | Idempotencia / 409 | 8 | UUID en Confirmar/Cobrar; 409 cancela/transición con mensaje. |
| 10 | Código modular | 8 | `lib/api`, `lib/cart`, componentes ui/pos/orders. Tests unitarios de format/cart/labels. |

**Total: 86 / 100**

---

## P0 / P1

Ningún P0. Residual: ticket POS se pierde al recargar (spec UX); print es Should (`window.print`).

---

## Prompt para UX

Revisar implementación F3 en `LaBorregaMarket` (rutas `/fruteria/[id]`, `/carrito`, `/cuenta`, `/proveedor/pos`, `/proveedor/ordenes`, `/proveedor/dashboard`) contra `fase-3/handoff-frontend.md`. Emitir `REVIEW-UX.md` (rúbrica 10×10, umbral 80%, 0 P0).

Handoffs: `fase-3/feature-handoffs/FEAT-ORDERS-handoff.md`, `FEAT-POS-handoff.md`, `FEAT-DASH-handoff.md`.
