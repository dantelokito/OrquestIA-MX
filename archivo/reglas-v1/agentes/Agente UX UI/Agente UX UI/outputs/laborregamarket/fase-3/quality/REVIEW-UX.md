# REVIEW-UX — Quality Gate Frontend Fase 3

> **Proyecto:** LaBorregaMarket  
> **Fase:** 3 — Pedidos, POS, dashboard (v0.3.0)  
> **Fecha:** 14/08/2026  
> **Agente:** UX/UI Designer  
> **Solicitud auditada:** `Agente frontend/.../fase-3/quality/QR-FE.md` (Frontend, 13/08/2026)  
> **Código:** `C:\Users\PC GAMER\LaBorregaMarket\src`  
> **Veredicto:** **APROBADO CON OBSERVACIONES**  
> **Puntaje:** 80 / 100 · **0 P0** · 4 P1 · 6 P2

No se copia el auto-score de QR-FE (86/100). Esta auditoría es independiente contra UF/WF de `fase-3/` + `comun/`.

---

## Alcance auditado

Rutas F3 en App Router y componentes asociados:

| Ruta | Archivo principal | Wireframe |
|------|-------------------|-----------|
| `/fruteria/[id]` | `app/fruteria/[id]/FruteriaDetailClient.tsx`, `ProductTable.tsx` | `WF-fruteria-encargar.md` |
| `/carrito` | `app/carrito/CartPageClient.tsx` | `WF-carrito.md` |
| `/cuenta` | `app/cuenta/CuentaPageClient.tsx`, `components/orders/OrdersHistory.tsx` | `WF-cuenta-pedidos.md` |
| `/proveedor/pos` | `components/pos/PosPageClient.tsx` | `WF-pos-*.md` |
| `/proveedor/ordenes` | `app/proveedor/ordenes/OrdenesPageClient.tsx` | `WF-proveedor-ordenes.md` |
| `/proveedor/dashboard` | `app/proveedor/dashboard/DashboardPageClient.tsx` | `WF-proveedor-dashboard.md` |

**Referencias de diseño:** [`handoff-frontend.md`](../handoff-frontend.md), [`user-flows/`](../user-flows/), [`wireframes/`](../wireframes/), [`comun/design-tokens.md`](../../comun/design-tokens.md).

---

## Rúbrica (10 × 10)

| # | Criterio | Pts | Nota |
|---|----------|-----|------|
| 1 | Fidelidad a wireframes F3 | 7 | Encargar, carrito, POS split, órdenes y dashboard presentes. Delta: ticket POS reemplaza toda la vista (no split atenuado); `CartSummaryBar` sin usar. |
| 2 | Responsive (móvil / tablet / desktop) | 8 | Checkout mobile-first; POS `lg:flex-row` 58/42; dashboard grid. Ticket post-cobro pierde split en tablet. |
| 3 | 4 estados UI | 9 | Loading/empty/error/success en las 5 superficies nuevas. Empty de órdenes no varía por tab. |
| 4 | Consumo de API | 9 | Rutas BFF alineadas a contratos (`/api/orders`, `/api/provider/pos/sales`, `/api/provider/orders`, `/api/provider/dashboard`). Sin rutas inventadas. |
| 5 | Validación de formularios | 8 | Notas 280, venta rápida inline, 3 decimales, `ConfirmDialog`. Teléfono en cuenta sin formato. |
| 6 | Accesibilidad WCAG AA basal | 6 | Labels, radiogroups, chart `aria-label` + tabla. Drawer órdenes sin trampa de foco ni Escape; tabs sin `tabpanel`. |
| 7 | Contacto F2 intacto | 9 | `ContactCTA` Llamar/WhatsApp + notify; Encargar dominante con ítems en carrito (D-F3-7). |
| 8 | CO-001 (venta rápida + UoM) | 8 | Badge icono+texto; PZA/KG/GR en línea de catálogo; modal venta rápida sin `NumericKeypad`. |
| 9 | Idempotencia / 409 | 8 | `Idempotency-Key` en confirmar/cobrar; 409 en cancelar y transiciones. POS sin rama 409 explícita. |
| 10 | Modularidad y tokens | 8 | `lib/cart`, `lib/api`, badges, `--brand`. `CartSummaryBar` muerto; algunos clients monolíticos. |
| | **Total** | **80** | Umbral 80% |

---

## Hallazgos

### OBS-UX-F3-001 (P1) — Drawer detalle órdenes sin a11y de diálogo

`OrdenesPageClient.tsx`: el panel de detalle tiene `role="dialog"` pero **no** trampa de foco, **no** cierre con `Escape` ni foco inicial al abrir. Incumple spec de `WF-proveedor-ordenes.md` y `ConfirmDialog`.

**Acción:** Alinear con patrón de `ConfirmDialog` o extraer `OrderDetailDrawer` reutilizable.

### OBS-UX-F3-002 (P1) — Venta rápida sin teclado numérico táctil

`QuickSaleModal.tsx` usa solo `QuantityInput`; `WF-pos-venta-rapida.md` y CO-001 exigen captura finger-friendly igual que `WF-pos-cantidad-unidad.md`.

**Acción:** Incorporar `NumericKeypad` en el modal de venta rápida.

### OBS-UX-F3-003 (P1) — Ticket POS no conserva layout split

Tras cobrar, `PosPageClient.tsx` sustituye la vista completa por el ticket. El wireframe especifica catálogo atenuado + panel derecho con comprobante.

**Acción:** Mantener split con catálogo `opacity-60` y ticket en panel derecho.

### OBS-UX-F3-004 (P1) — Empty state único en tabs de órdenes

Todas las tabs muestran *"No tienes pedidos activos"* (`OrdenesPageClient.tsx`). `UF-OPS-01` define copy distinto para Completadas y Canceladas.

**Acción:** Empty por tab según wireframe.

### OBS-UX-F3-005 (P2) — `CartSummaryBar` sin usar

Componente definido pero la frutería duplica resumen inline. Código muerto vs tokens.

### OBS-UX-F3-006 (P2) — Teclas `NumericKeypad` sin `aria-label`

`NumericKeypad.tsx`: botones sin etiqueta accesible por tecla.

### OBS-UX-F3-007 (P2) — Tabs órdenes sin `aria-controls` / `tabpanel`

Navegación por flechas OK; falta semántica completa de tabs.

### OBS-UX-F3-008 (P2) — Éxito en `/carrito` se pierde al recargar

Sin `orderId` en URL; comportamiento aceptable en MVP pero documentar en QA.

### OBS-UX-F3-009 (P2) — Ticket POS se pierde al recargar

Coherente con spec UX (`WF-pos-ticket.md`); no es defecto, es decisión documentada.

### OBS-UX-F3-010 (P2) — `window.print` implementado (Should)

Cumple BL-065; verificar en QA con diálogo nativo del navegador.

---

## Cumplimiento DoD F3 (resumen)

| Regla | Resultado |
|-------|-----------|
| `IN_TRANSIT` = "Listo para recoger" | OK (`lib/orders/labels.ts`, badges, acciones) |
| Contacto F2 no eliminado | OK |
| Línea libre solo en POS, badge icono+texto | OK |
| Doble submit bloqueado | OK (idempotency + disabled) |
| Gráfico con alternativa textual | OK (`<details>` tabla) |
| Sin pasarela / hardware POS | OK |

---

## Veredicto

**APROBADO CON OBSERVACIONES** — La implementación F3 cumple el umbral (80%) sin P0. Los cuatro P1 son mejoras de fidelidad y accesibilidad recomendadas antes del sign-off final de QA, pero **no bloquean** la habilitación de pruebas funcionales.

**QA Tester:** contactar vía `READY-FOR-QA.md` (Arquitecto ya en 90/100, 0 P0).

---

*Dictamen UX/UI — LaBorregaMarket v0.3.0 — 14/08/2026.*
