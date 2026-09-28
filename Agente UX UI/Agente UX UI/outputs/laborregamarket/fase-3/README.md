# LaBorregaMarket — Entregables UX Fase 3

> **Agente:** UX/UI Designer  
> **Fecha:** 14/08/2026  
> **Estado diseño:** Completo — Quality Gate UX emitido (14/08/2026)  
> **Versión:** 0.3.0

Fase 3 introduce **pedidos en línea (carrito/checkout)**, **POS mostrador**, **operaciones de órdenes** y **dashboard de ventas** para proveedores.

---

## Índice de entregables

### Documentación compartida (`comun/`)

| Archivo | Versión | Descripción |
|---------|---------|-------------|
| [design-tokens.md](../comun/design-tokens.md) | v0.3.0 | Tokens + componentes F3 (badges, POS, stepper) |
| [information-architecture.md](../comun/information-architecture.md) | v0.2.0 | Rutas, SubNavProveedor, jerarquía F3 |

### Handoff

| Archivo | Descripción |
|---------|-------------|
| [handoff-frontend.md](./handoff-frontend.md) | Sprint plan F3-A→D, APIs, DoD, a11y |

### User flows

| ID | Archivo | Alcance |
|----|---------|---------|
| UF-ORDERS-01 | [UF-ORDERS-01-checkout.md](./user-flows/UF-ORDERS-01-checkout.md) | Carrito, auth gate, PENDING, cancel en cuenta |
| UF-POS-01 | [UF-POS-01-mostrador.md](./user-flows/UF-POS-01-mostrador.md) | Venta rápida, cantidad/unidad, ticket, cobro |
| UF-OPS-01 | [UF-OPS-01-ordenes-activas.md](./user-flows/UF-OPS-01-ordenes-activas.md) | Tabs órdenes, IN_TRANSIT copy, transiciones |
| UF-DASH-01 | [UF-DASH-01-ventas.md](./user-flows/UF-DASH-01-ventas.md) | KPIs, chart, top 5 venta rápida |

### Wireframes

| ID | Archivo | Pantalla |
|----|---------|----------|
| WF-fruteria-encargar | [WF-fruteria-encargar.md](./wireframes/WF-fruteria-encargar.md) | Delta detalle frutería — Encargar dominante |
| WF-carrito | [WF-carrito.md](./wireframes/WF-carrito.md) | `/carrito` |
| WF-cuenta-pedidos | [WF-cuenta-pedidos.md](./wireframes/WF-cuenta-pedidos.md) | Sección pedidos en `/cuenta` |
| WF-pos-mostrador | [WF-pos-mostrador.md](./wireframes/WF-pos-mostrador.md) | Layout POS split |
| WF-pos-venta-rapida | [WF-pos-venta-rapida.md](./wireframes/WF-pos-venta-rapida.md) | Grid catálogo + quick sale |
| WF-pos-cantidad-unidad | [WF-pos-cantidad-unidad.md](./wireframes/WF-pos-cantidad-unidad.md) | Stepper, keypad, UnitSelector |
| WF-pos-ticket | [WF-pos-ticket.md](./wireframes/WF-pos-ticket.md) | Ticket, pago, Cobrar |
| WF-proveedor-ordenes | [WF-proveedor-ordenes.md](./wireframes/WF-proveedor-ordenes.md) | `/proveedor/ordenes` |
| WF-proveedor-dashboard | [WF-proveedor-dashboard.md](./wireframes/WF-proveedor-dashboard.md) | `/proveedor/dashboard` |

### Referencias Fase 1–2

| Tipo | Ruta |
|------|------|
| User flows F1 | [`../fase-1/user-flows/`](../fase-1/user-flows/) |
| Wireframes F1 | [`../fase-1/wireframes/`](../fase-1/wireframes/) |
| User flows F2 | [`../fase-2/user-flows/`](../fase-2/user-flows/) |
| Wireframes F2 | [`../fase-2/wireframes/`](../fase-2/wireframes/) |
| Handoff F2 | [`../fase-2/handoff-frontend.md`](../fase-2/handoff-frontend.md) |
| Observabilidad | [`../historial/OBSERVABILITY.md`](../historial/OBSERVABILITY.md) |

---

## Decisiones de diseño Fase 3

| ID | Decisión | Rationale |
|----|----------|-----------|
| **CO-001** | Página dedicada `/carrito` (no drawer) | Claridad en checkout multi-ítem; URL compartible; auth gate explícito |
| **CO-002** | SubNavProveedor con 4 rutas | Separar catálogo, POS, ops y analytics sin sobrecargar `/proveedor` |
| **CO-003** | **Encargar** CTA dominante en `/fruteria/[id]` | Priorizar conversión pedido in-app sobre contacto telefónico |
| **D-F3-7** | Contacto F2 preservado como secundario | Llamar/WhatsApp/notify siguen disponibles; no romper F2 |
| **CO-004** | `IN_TRANSIT` → copy **"Listo para recoger"** | Alineado a modelo pickup frutería; evita confusión "en camino" |
| **CO-005** | Nunca color-only en badges estado/origen/VR | WCAG + operación mostrador con pantallas al sol |

---

## Quality Gate

| Documento | Estado |
|-----------|--------|
| [REVIEW-UX.md](./quality/REVIEW-UX.md) | APROBADO CON OBSERVACIONES — 80/100, 0 P0 |
| [READY-FOR-QA.md](./quality/READY-FOR-QA.md) | Emitido — QA habilitado |

Entrada Frontend: `Agente frontend/.../fase-3/quality/QR-FE.md`. Arquitecto: `REVIEW-ARCH.md` (90/100).

Ver también [`../STATUS.md`](../STATUS.md).

---

*Índice generado por Agente UX/UI Designer — LaBorregaMarket Fase 3*
