# READY-FOR-QA — Fase 3

> **Proyecto:** LaBorregaMarket  
> **Fase:** 3 — Pedidos, POS, dashboard (v0.3.0)  
> **Fecha:** 14/08/2026  
> **De:** Agente UX/UI Designer  
> **Para:** @QA Tester  
> **Condición:** `REVIEW-UX.md` ≥ 80% y 0 P0 **y** `REVIEW-ARCH.md` ≥ 80% y 0 P0

---

## Dictámenes previos

| Agente | Archivo | Veredicto | Puntaje |
|--------|---------|-----------|---------|
| UX/UI | [`fase-3/quality/REVIEW-UX.md`](./REVIEW-UX.md) | APROBADO CON OBSERVACIONES | 80 / 100 · 0 P0 |
| Arquitecto | `Agente Arquitecto/.../fase-3/quality/REVIEW-ARCH.md` | APROBADO CON OBSERVACIONES | 90 / 100 · 0 P0 |

---

## Alcance de prueba

| Módulo | Rutas | User flows | Wireframes |
|--------|-------|------------|------------|
| ORDERS (cliente) | `/fruteria/[id]`, `/carrito`, `/cuenta` | `UF-ORDERS-01-checkout.md` | `WF-fruteria-encargar`, `WF-carrito`, `WF-cuenta-pedidos` |
| POS | `/proveedor/pos` | `UF-POS-01-mostrador.md` | `WF-pos-mostrador`, `WF-pos-venta-rapida`, `WF-pos-cantidad-unidad`, `WF-pos-ticket` |
| OPS | `/proveedor/ordenes` | `UF-OPS-01-ordenes-activas.md` | `WF-proveedor-ordenes` |
| DASH | `/proveedor/dashboard` | `UF-DASH-01-ventas.md` | `WF-proveedor-dashboard` |

**Índice diseño:** [`fase-3/README.md`](../README.md) · **Handoff FE:** [`handoff-frontend.md`](../handoff-frontend.md)

---

## Roles y acceso

| Rol | Rutas principales | Notas |
|-----|-------------------|-------|
| **CLIENT** | `/fruteria/[id]`, `/carrito`, `/cuenta` | Login requerido solo al confirmar pedido (`/login?next=/carrito`) |
| **PROVIDER** | `/proveedor`, `/proveedor/pos`, `/proveedor/ordenes`, `/proveedor/dashboard` | Sub-nav compartida; catálogo con productos activos para POS |
| **ADMIN** | `/admin` | Fuera del alcance funcional F3 salvo auditoría de órdenes (Should BL-067, diferido) |

**Entorno:** local `npm run dev` o staging según DevOps.  
**Repo código:** `C:\Users\PC GAMER\LaBorregaMarket`  
**Backend:** aplicar migración F3 antes de probar (`OBS-F3-020` Arquitecto).

---

## Happy paths obligatorios (100%)

### HP-ORDERS-01 — Checkout pickup

1. Como CLIENT, abrir `/fruteria/[id]` con productos disponibles.
2. Aumentar cantidades con stepper; ver barra resumen; ir a `/carrito`.
3. Agregar nota opcional (≤280 chars); confirmar pedido.
4. Ver pantalla de éxito con número corto y estado **Pendiente**.
5. En `/cuenta`, ver el pedido en historial con badge correcto.
6. Cancelar mientras **Pendiente** → estado **Cancelado**.

### HP-OPS-01 — Ciclo de estado proveedor

1. Como PROVIDER, abrir `/proveedor/ordenes` tab **Activas**.
2. Sobre pedido App `Pendiente`: **Confirmar** → **Listo para recoger** → **Entregado**.
3. Verificar copy **"Listo para recoger"** (nunca "En camino").
4. Verificar `OriginBadge` App vs POS en una venta de mostrador.

### HP-POS-01 — Venta de mostrador con peso

1. En `/proveedor/pos`, agregar producto por KG; editar cantidad `1.250` con unidad KG.
2. Agregar línea **Venta rápida** (desde botón o empty del buscador).
3. Cobrar con **Efectivo**; ver ticket con badge **Venta rápida** y formato `1.250 KG`.
4. **Nueva venta** vacía el ticket.

### HP-DASH-01 — Dashboard con datos

1. Tras al menos una venta/pedido no cancelado, abrir `/proveedor/dashboard`.
2. Ver 3 KPI cards (hoy / 7d / 30d).
3. Expandir **Ver datos en tabla** bajo el gráfico de 7 días.
4. Ver top 5; si hay ventas rápidas, renglón agrupado **Venta rápida**.

### HP-REG-01 — Contacto F2 intacto

1. En `/fruteria/[id]`, verificar **Llamar** y **WhatsApp** visibles junto a **Encargar**.
2. Clic en Llamar no bloqueado por notify; toast de contacto según F2.

---

## Edge cases recomendados (≥85%)

| ID | Caso | Resultado esperado |
|----|------|-------------------|
| EC-01 | Carrito vacío en `/carrito` | Empty + CTA Explorar |
| EC-02 | Producto no disponible al confirmar | Línea marcada; no crea orden |
| EC-03 | Cancelar pedido ya confirmado (409) | Mensaje de contactar frutería |
| EC-04 | Buscador POS sin resultados | CTA Venta rápida (no callejón) |
| EC-05 | Cantidad 0 o >3 decimales en POS | Error inline; no cobrar |
| EC-06 | Dashboard sin ventas | Empty + CTA Abrir POS |
| EC-07 | Doble clic Confirmar / Cobrar | Una sola orden (idempotencia) |
| EC-08 | Invitado en carrito → confirmar | Redirect `/login?next=/carrito` |

---

## Observaciones conocidas (no bloquean QA)

| ID | Severidad | Descripción |
|----|-----------|-------------|
| OBS-UX-F3-001 | P1 | Drawer órdenes: sin trampa de foco / Escape |
| OBS-UX-F3-002 | P1 | Venta rápida sin NumericKeypad |
| OBS-UX-F3-003 | P1 | Ticket POS pantalla completa vs split wireframe |
| OBS-UX-F3-004 | P1 | Empty órdenes igual en todas las tabs |
| OBS-UX-F3-009 | P2 | Ticket POS se pierde al recargar (spec UX) |
| OBS-F3-020 | P1 (Arch) | Migración Prisma puede no estar aplicada en BD local |

---

## Fuera de alcance QA F3

Pasarela de pagos, CFDI, conexión a báscula/impresora/lector, delivery con mapa, carrito multi-frutería, reseñas, PWA, exportación BI del dashboard, listado ADMIN de órdenes (BL-067 diferido).

---

*Habilitación QA emitida por Agente UX/UI Designer — LaBorregaMarket v0.3.0 — 14/08/2026.*
