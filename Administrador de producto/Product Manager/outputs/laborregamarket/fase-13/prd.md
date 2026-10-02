# PRD Corto — Fase 13

> **Proyecto:** LaBorregaMarket
> **Fecha:** 16/09/2026
> **Versión:** cobertura PM completa (admin + ocultar + unidad/caja de **oferta** + precio por oferta + reporte inventario)
> **Objetivo del Negocio:** Que el administrador vea y modere **todos** los SKU; que el dueño oculte filas de **su** catálogo sin borrar evidencia; que alta LOCAL y **Editar** (GLOBAL o LOCAL) capturen unidad de venta (incluye CAJA) y factor caja **de esa sucursal**; que edite el **precio de su oferta** con historial, sin afectar otras fruterías; y que en Reportes vea inventario **actual** más **entradas** (y en reportes generales N>1 solo saldos actuales).
> **Público Objetivo:** `ADMIN` y `PROVIDER` con sucursal **activa** (F11). El `CLIENT` no recibe feature nueva.

> #### 1. Alcance (MVP)
> * **Incluido:**
>   * Admin lista `products` GLOBAL **y** LOCAL; inhabilita con `isActive=false`; DELETE HTTP 405.
>   * Catálogo GLOBAL = base al registrarse. Un GLOBAL **nuevo** del admin **aparece** en fruterías ya operando (se oculta con «Eliminar»). «Eliminar» proveedor = ocultar oferta (`archivedAt`) GLOBAL y LOCAL. Bandeja «Eliminados de la vista» + Restaurar.
>   * Alta LOCAL + **Editar visible en filas GLOBAL y LOCAL**: unidad completa (incl. CAJA) + factor caja. GLOBAL: unidad y factor son de **la oferta de esta sucursal**; nombre y `Product.unit` del maestro **no** se mutan. LOCAL: nombre + `Product.unit` propios + factor de oferta.
>   * Cambio de unidad/factor con existencias: alerta y descarte on-hand (no es una «entrada»); Encargar activo → bloqueo. Ocultar **sí** se permite con Encargar activo (no cancela encargos; ventas nuevas 409).
>   * Precio de venta = `ProviderProduct.price` de **esa** sucursal (GLOBAL o LOCAL). Editable. No SKU nuevo. Otras fruterías intactas.
>   * Historial de cambios de precio de **esa oferta** (catálogo). Reportes de **ventas** usan `OrderItem.unitPrice` (snapshot).
>   * Pestaña Reportes del negocio: inventario **actual** + historial de **entradas/cargas** (no kardex de ventas). Print de esa vista.
>   * Reportes generales (N>1): **solo** inventarios **actuales** de todas las sucursales.
> * **Fuera de Alcance:**
>   * Vista default «solo mis ofertas». `US-ADMIN-04`. DELETE SQL. Rediseñar Explorar.
>   * SKU nuevo por cada cambio de precio **o de unidad**. Mutar `Product.unit` del maestro GLOBAL. Kardex (POS/Encargar/descarte). Backfill de entradas F12 (solo incrementaban `onHand`).
>   * Cloudinary/S3. Foto de producto (sigue F10 `US-MEDIA-06`). `BL-040`. BOM. Cancelar Encargar en automático.
>
> #### 2. Módulos Principales
> 1. `[ADMIN/LIST]` `US-ADMIN-05` — 2. `[ADMIN/MOD]` `US-ADMIN-06`
> 3. `[CAT/OCULTAR]` `US-CAT-14` — 4. `[CAT/BANDEJA]` `US-CAT-15`
> 5. `[DASH/HIST]` `US-DASH-10` — 6. `[CAT/CLIENTE]` `US-CAT-16` — 7. `[SEC]` `US-SEC-04`
> 8. `[CAT/UNIDAD]` `US-CAT-18` — 9. `[INV/UNIDAD]` `US-INV-07`
> 10. `[CAT/PRECIO]` `US-CAT-19` — 11. `[CAT/PRECIO-HIST]` `US-CAT-20`
> 12. `[DASH/INV]` `US-DASH-12` — 13. `[DASH/INV-N]` `US-DASH-13`

## Decisiones cerradas con Dante

| ID | Decisión | Cierre |
|----|----------|--------|
| D-F13-1 | Alta proveedor LOCAL + `ProviderProduct`. No auto-global. | Brief 15/09 |
| D-F13-3 | Ocultar por oferta (`archivedAt`). Unique intacto. | Brief 15/09 |
| D-F13-4 | GLOBAL = base de onboarding. | Dante 15/09 |
| D-F13-5 | «Eliminar» = ocultar GLOBAL y LOCAL. | Dante 15/09 |
| D-F13-6 | Inactivo en lista; oculto en bandeja. | Brief + Dante |
| D-F13-7 | Ocultar en A no oculta en B ni quita el SKU admin. | Dante 15/09 |
| D-F13-10 | Ocultos fuera de inventario/POS vendible; 409 sección F10. | Revisión alcance 16/09 (ya Must en `US-CAT-15/16`) |
| D-F13-13 | Alta/editar: unidad completa (CAJA) **y** factor caja. **Editar** en GLOBAL y LOCAL. | Dante 15/09; unidad-oferta 16/09 |
| D-F13-14 | Cambio unidad/factor: alerta + descarte; Encargar activo → bloqueo. | Dante 15/09 |
| D-F13-15 | Proveedor **no** muta `Product.unit` del maestro GLOBAL. **Sí** edita la **unidad de su oferta** (esta sucursal). Otras fruterías y el maestro intactos. Fallback: unidad del maestro hasta el primer Editar. Primera edición de GLOBAL sin oferta **crea** la `ProviderProduct`. | Dante 16/09 (revisión alcance; enmienda el cierre PM previo) |
| D-F13-17 | Editar precio de **su oferta** (GLOBAL o LOCAL). No SKU nuevo. No afecta otras sucursales. | Dante 16/09 |
| D-F13-18 | Historial de cambios de precio **de catálogo** de esa oferta (además del snapshot del pedido). | Dante 16/09 |
| D-F13-19 | Reporte inventario **por negocio**: saldo actual + **entradas** registradas. Print. | Dante 16/09 |
| D-F13-20 | Reportes generales N>1: **solo** inventarios actuales. Sin historial de entradas ahí. | Dante 16/09 |

## Cierres PM (abiertos a corrección)

| ID | Cierre PM | Nota |
|----|-----------|------|
| D-F13-2 | Admin lista todos los `Product`; PATCH `isActive` LOCAL y GLOBAL. | |
| D-F13-8 | Ocultar GLOBAL sin oferta crea fila archivada. | |
| D-F13-9 | Restaurar no muta `isAvailable`. | |
| D-F13-11 | Ventas = `OrderItem`. Carrito stale → 409. | Reforzado por D-F13-18 |
| D-F13-12 | Paginación admin 50/100; filtro `isActive`. | |
| D-F13-16 | Tras descarte, venta blanda F12. | |
| D-F13-21 | Historial de entradas **desde** que F13 persiste la tabla. Sin backfill F12. | Técnico |
| D-F13-22 | Historial de precio: persistir en tabla o bitácora dedicada por `providerProductId` (Arquitecto). Primera asignación de precio también deja rastro. | Técnico |
| D-F13-23 | Un GLOBAL **nuevo** del admin **aparece** en fruterías ya operando (mismo GET que hoy). Se oculta con `US-CAT-14`. | Cierra el abierto 16/09 |
| D-F13-24 | Ocultar con Encargar **activo** está **permitido**. No cancela encargos. POS/carrito **nuevos** → 409 (`US-CAT-16`). Distinto de `US-INV-07`. | Revisión alcance 16/09 |
| D-F13-25 | Factor caja **obligatorio** si la unidad de venta de la oferta es CAJA; vacío permitido si no usa cajas. | Revisión alcance 16/09 |

**Cerrado (ya no abierto):** si un GLOBAL **nuevo** del admin aparece en fruterías ya operando → **sí** (D-F13-23).

## MoSCoW

| Prioridad | Ítems |
|-----------|--------|
| Must | `US-ADMIN-05/06`, `US-CAT-14/15/16/18/19/20`, `US-DASH-10/12/13`, `US-SEC-04`, `US-INV-07` (`BL-210`–`216`, `219`–`224`) |
| Should | Print consolidado F11 sigue Should. `US-ADMIN-04` Should F10. |
| Could | Badge «N ofertas». |
| Won't | `US-CAT-17`, unificación Mango, DELETE, Explorar, SKU por cambio de precio **o unidad**, mutar maestro GLOBAL, kardex, backfill entradas F12, Cloudinary, foto F13, `BL-040`. |

## Invariantes técnicos

- Precio de venta = `ProviderProduct.price`, no un campo de precio en el maestro GLOBAL para la frutería.
- Unidad de venta de la sucursal = unidad **de la oferta** si existe; si no, `Product.unit` del maestro. POS, Encargar, inventario y catálogo usan esa unidad. Arquitecto elige el campo (`ProviderProduct.unit` o equivalente); el PM **no** fija schema.
- Proveedor **no** muta `Product.unit` ni el nombre de un GLOBAL. LOCAL sí muta su `Product.unit` / nombre.
- Ventas: `OrderItem.unitPrice` / `itemName` no se reescriben al cambiar precio **ni** unidad de catálogo.
- `addInventoryEntry` debe **insertar** una fila de entrada además de incrementar `onHand`. El descarte `US-INV-07` pone `onHand = 0` y **no** crea fila de entrada.
- Reportes generales N>1: endpoint de inventario **actual** por `Provider` del user; **sin** lista de entradas.
- Envelope ADR-003. IDOR F11.

## Stakeholder

Último complemento Dante 16/09: (1) precio por oferta + historial + reporte inventario; (2) revisión de alcance: **Editar** en catálogo proveedor para GLOBAL y LOCAL, unidad de **la oferta** (no del maestro). Cobertura F13 **completa** para que el orquestador abra UX + Arquitecto.

## Inputs Utilizados

- Cierres Dante 15–16/09 y revisión de alcance 16/09. `US-DASH-07`…`09`, `US-DASH-11`. Código: `PriceInput`, `ProviderCatalogF10` (Editar solo LOCAL hoy), `upsertProviderProduct`, `addInventoryEntry` (solo incrementa).

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-13/prd.md`
- **Agente Downstream:** UX/UI y Arquitecto (handoffs del orquestador)
