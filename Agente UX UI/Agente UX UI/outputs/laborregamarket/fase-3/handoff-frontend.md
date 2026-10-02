# Handoff Frontend — LaBorregaMarket UX/UI v0.3.0

> **De:** Agente UX/UI Designer  
> **Para:** @Frontend  
> **Fecha:** 14/08/2026  
> **Prioridad:** F3-A ORDERS → F3-B POS → F3-C OPS → F3-D DASH

---

## Estado: LISTO PARA IMPLEMENTACIÓN ✅

Diseño Fase 3 (Pedidos + POS + Ops + Dashboard) completo. Código base: `LaBorregaMarket/src/`.

**Lee primero:**

- [`../comun/design-tokens.md`](../comun/design-tokens.md) v0.3.0
- [`../comun/information-architecture.md`](../comun/information-architecture.md) v0.2.0
- [`../../historial/OBSERVABILITY.md`](../../historial/OBSERVABILITY.md)

---

## Orden de implementación sugerido

### Sprint F3-A — ORDERS (carrito + checkout)

| Orden | Componente / ruta | Wireframe | User Flow |
|-------|-------------------|-----------|-----------|
| 1 | `QuantityStepper` en tabla productos detalle | `WF-fruteria-encargar.md` | UF-ORDERS-01 |
| 2 | CTA Encargar dominante + carrito header badge | `WF-fruteria-encargar.md` | CO-003 |
| 3 | Página `/carrito` + TicketLine list | `WF-carrito.md` | UF-ORDERS-01 |
| 4 | Auth gate en carrito (redirect login) | `WF-carrito.md` | UF-ORDERS-01 |
| 5 | `POST /api/orders` → estado PENDING | `WF-carrito.md` | UF-ORDERS-01 |
| 6 | Sección pedidos en `/cuenta` + cancel | `WF-cuenta-pedidos.md` | UF-ORDERS-01 |
| 7 | ContactCTA secundario preservado (D-F3-7) | `../../fase-1/wireframes/WF-fruteria-detalle.md` | UF-NOTIFY-01 |

### Sprint F3-B — POS (mostrador)

| Orden | Componente / ruta | Wireframe | User Flow |
|-------|-------------------|-----------|-----------|
| 8 | `SubNavProveedor` en rutas proveedor | `WF-pos-mostrador.md` | IA v0.2 |
| 9 | Layout split `/proveedor/pos` | `WF-pos-mostrador.md` | UF-POS-01 |
| 10 | Grid catálogo + `QuickSaleBadge` | `WF-pos-venta-rapida.md` | UF-POS-01 |
| 11 | `QuantityInput` + `NumericKeypad` + `UnitSelector` | `WF-pos-cantidad-unidad.md` | UF-POS-01 |
| 12 | Panel ticket + `PaymentMethodSelector` | `WF-pos-ticket.md` | UF-POS-01 |
| 13 | CTA Cobrar + `POST /api/pos/sales` | `WF-pos-ticket.md` | UF-POS-01 |
| 14 | `ConfirmDialog` vaciar ticket / eliminar línea | tokens §6b | UF-POS-01 |

### Sprint F3-C — OPS (órdenes activas)

| Orden | Componente / ruta | Wireframe | User Flow |
|-------|-------------------|-----------|-----------|
| 15 | `/proveedor/ordenes` tabs Activas/Historial | `WF-proveedor-ordenes.md` | UF-OPS-01 |
| 16 | `OrderCard` + `OrderStatusBadge` + `OriginBadge` | `WF-proveedor-ordenes.md` | UF-OPS-01 |
| 17 | Transiciones estado (PENDING→…→COMPLETED) | `WF-proveedor-ordenes.md` | UF-OPS-01 |
| 18 | Copy IN_TRANSIT = "Listo para recoger" | tokens §6b | CO-004 |
| 19 | `PATCH /api/orders/[id]/status` | UF-OPS-01 | — |

### Sprint F3-D — DASH (ventas)

| Orden | Componente / ruta | Wireframe | User Flow |
|-------|-------------------|-----------|-----------|
| 20 | `/proveedor/dashboard` layout | `WF-proveedor-dashboard.md` | UF-DASH-01 |
| 21 | `KpiCard` grid (4 métricas) | `WF-proveedor-dashboard.md` | UF-DASH-01 |
| 22 | `BarChartIlustrativo` 7 días | `WF-proveedor-dashboard.md` | UF-DASH-01 |
| 23 | Tabla top 5 venta rápida | `WF-proveedor-dashboard.md` | UF-DASH-01 |
| 24 | `GET /api/provider/analytics/sales` | UF-DASH-01 | — |

---

## Entregables UX Fase 3 (índice)

| Tipo | Archivo |
|------|---------|
| Tokens | `comun/design-tokens.md` v0.3.0 |
| IA | `comun/information-architecture.md` v0.2.0 |
| Flow | `fase-3/user-flows/UF-ORDERS-01-checkout.md` |
| Flow | `fase-3/user-flows/UF-POS-01-mostrador.md` |
| Flow | `fase-3/user-flows/UF-OPS-01-ordenes-activas.md` |
| Flow | `fase-3/user-flows/UF-DASH-01-ventas.md` |
| WF | `fase-3/wireframes/WF-fruteria-encargar.md` |
| WF | `fase-3/wireframes/WF-carrito.md` |
| WF | `fase-3/wireframes/WF-cuenta-pedidos.md` |
| WF | `fase-3/wireframes/WF-pos-mostrador.md` |
| WF | `fase-3/wireframes/WF-pos-venta-rapida.md` |
| WF | `fase-3/wireframes/WF-pos-cantidad-unidad.md` |
| WF | `fase-3/wireframes/WF-pos-ticket.md` |
| WF | `fase-3/wireframes/WF-proveedor-ordenes.md` |
| WF | `fase-3/wireframes/WF-proveedor-dashboard.md` |

---

## Design system — componentes nuevos F3

| Componente | Spec en tokens |
|------------|----------------|
| SubNavProveedor | `nav` tabs, `aria-current="page"` |
| OrderStatusBadge | 5 estados; IN_TRANSIT = "Listo para recoger" |
| OriginBadge | ONLINE / POS — icono + texto |
| QuickSaleBadge | Zap + "Venta rápida" |
| QuantityStepper | ± 44px, `aria-valuenow` |
| QuantityInput + NumericKeypad | POS cantidad manual |
| UnitSelector | KG, PIEZA, MANOJO, CAJA |
| PaymentMethodSelector | Efectivo, Tarjeta, Transferencia |
| TicketLine | línea ticket con subtotal |
| OrderCard | resumen orden + acciones |
| KpiCard | métrica + delta |
| BarChartIlustrativo | barras 7d + tabla sr-only |
| ConfirmDialog | `role="alertdialog"`, focus trap |

```text
Encargar CTA:  py-3 bg-[var(--brand)] text-white rounded-lg font-semibold w-full sm:w-auto
POS split:     flex flex-col lg:flex-row; catálogo 58% / ticket 42%
Cobrar:        w-full py-4 bg-[var(--brand)] text-white font-semibold rounded-lg
Badge status:  inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
Stepper btn:   h-11 w-11 hover:bg-gray-50 focus:ring-2 focus:ring-[var(--brand)]
```

---

## Estados obligatorios (5 columnas)

| Superficie | Loading | Empty | Success | Error | Disabled |
|------------|---------|-------|---------|-------|----------|
| Detalle Encargar | skeleton productos | sin productos + contacto | stepper + Encargar | ErrorBanner | producto no disponible |
| `/carrito` | skeleton líneas | "Tu carrito está vacío" + explorar | resumen + Confirmar | validación / red | auth gate login |
| `/cuenta` pedidos | skeleton cards | "Aún no tienes pedidos" | OrderCard list | ErrorBanner | — |
| POS catálogo | skeleton grid | "Sin productos activos" | grid + add | ErrorBanner | — |
| POS ticket | — | "Agrega productos" | líneas + Cobrar | pago fallido | Cobrar sin ítems |
| `/proveedor/ordenes` | skeleton cards | "No hay órdenes activas" | tabs + acciones | ErrorBanner | acción inválida estado |
| Dashboard | skeleton KPIs+chart | "Sin ventas en el período" | KPIs + chart + tabla | ErrorBanner | — |

---

## APIs a consumir (no inventar rutas)

| Método | Ruta | Uso UI |
|--------|------|--------|
| POST | `/api/orders` | Confirmar pedido desde carrito |
| GET | `/api/orders` | Lista pedidos CLIENT / PROVIDER |
| GET | `/api/orders/[id]` | Detalle pedido |
| PATCH | `/api/orders/[id]/status` | Transiciones ops proveedor |
| DELETE | `/api/orders/[id]` | Cancelar (solo PENDING, CLIENT) |
| POST | `/api/pos/sales` | Cobrar ticket POS |
| GET | `/api/provider/analytics/sales` | Dashboard KPIs + chart + top VR |
| POST | `/api/providers/[id]/contact` | ContactCTA F2 (preservado) |

Contratos: handoff Arquitecto Fase 3 (`API-ORDERS-01`, `API-POS-01`, `API-ANALYTICS-01`).

---

## Accesibilidad (Fase 3)

- [ ] Badges estado/origen/VR: texto + icono (nunca solo color)
- [ ] `IN_TRANSIT` anunciado como "Listo para recoger"
- [ ] QuantityStepper: `aria-valuenow`, labels en ±
- [ ] NumericKeypad: `aria-label` por tecla
- [ ] PaymentMethodSelector: radio group con labels visibles
- [ ] ConfirmDialog: `role="alertdialog"`, focus trap, Escape
- [ ] SubNavProveedor: `aria-current="page"` en tab activo
- [ ] BarChartIlustrativo: tabla `sr-only` equivalente
- [ ] Auth gate carrito: foco en mensaje + CTA login
- [ ] Touch targets ≥44px (POS, stepper, Cobrar)
- [ ] `prefers-reduced-motion` en animaciones chart/ticket

---

## Checklist DoD UX Fase 3

- [ ] WCAG AA en badges, POS, carrito
- [ ] Un CTA dominante: Encargar (detalle), Confirmar (carrito), Cobrar (POS)
- [ ] Contacto F2 secundario intacto (D-F3-7)
- [ ] Carrito requiere auth antes de confirmar
- [ ] Pedido creado en PENDING
- [ ] Cancel solo en PENDING desde cuenta
- [ ] POS split funcional tablet/desktop; stack móvil
- [ ] Órdenes: transiciones válidas por estado
- [ ] Dashboard: KPIs + chart + top 5 VR
- [ ] Sin inventar endpoints fuera de tabla APIs

---

## Fuera de alcance Fase 3

Pagos en línea (Stripe/OpenPay), entrega a domicilio / tracking GPS, inventario en tiempo real, impresión térmica ticket, multi-tienda POS, notificaciones push/SMS pedido listo, export CSV dashboard, carrito multi-proveedor.

---

*Handoff generado por Agente UX/UI Designer — LaBorregaMarket v0.3.0*
