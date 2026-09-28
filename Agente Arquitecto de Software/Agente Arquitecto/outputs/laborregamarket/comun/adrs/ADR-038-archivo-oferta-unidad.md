# ADR-038: Archivo de oferta, visibilidad admin y unidad de venta por sucursal

> **ADR-038:** Archivo vs delete; listado admin GLOBAL+LOCAL; unidad de oferta  
> **Estado:** Aprobado  
> **Fecha:** 2026-09-16  
> **Fase:** 13  
> **US:** US-ADMIN-05/06, US-CAT-14/15/16/18, US-SEC-04, US-INV-07, US-CAT-19/20  
> **CO:** CO-F13-001  

## Inputs Utilizados

- Borrador PM: `Administrador de producto/.../fase-13/adr-draft-038-archivo-vs-delete.md`
- PRD F13, D-F13-3/8/15/24/25
- ADR-002, ADR-003, ADR-022, ADR-029, ADR-036, ADR-037 (solo lectura)

---

#### 1. Contexto y Problema

El panel proveedor lista todos los GLOBAL activos más LOCAL propios. `isAvailable` (ADR-022) no saca filas de la vista. No hay DELETE de producto. El admin lista solo GLOBAL (ADR-029), sin trazabilidad de LOCAL.

Negocio: onboarding con base GLOBAL; el dueño oculta filas de *su* sucursal; el admin ve todos los `Product`; la unidad de venta GLOBAL debe poder diferir por sucursal **sin** mutar `Product.unit`.

#### 2. Opciones consideradas

**Archivo**

* **A — Hard-delete** de `products` / `provider_products`: pierde evidencia y unique. Rechazada.
* **B — Solo `isAvailable=false`:** no libera el dashboard. Rechazada como única palanca.
* **C — `archivedAt` en `provider_products`:** oculta por sucursal; unique intacto. **Elegida.**
* **D — Default «solo mis ofertas»:** contradice onboarding. Won't F13.

**Unidad de venta sucursal**

* **A — Mutar `Product.unit` GLOBAL:** rompe otras fruterías. Rechazada.
* **B — Crear SKU LOCAL al cambiar unidad:** Won't (no SKU nuevo). Rechazada.
* **C — `ProviderProduct.saleUnit` nullable:** fallback a `Product.unit` hasta el primer Editar. **Elegida.**

#### 3. Decisión elegida

**Opción C + C.** Campos en `ProviderProduct`:

| Campo | Tipo | Semántica |
|-------|------|-----------|
| `archivedAt` | `DateTime?` | NULL = visible en panel. No NULL = oculto de esa sucursal. |
| `saleUnit` | `ProductUnit?` | NULL = usar `Product.unit` (fallback). Valor = unidad de **esta** oferta. |

Nombre de producto: **oculto / eliminado de la vista**. Técnico: archivo de oferta.

`effectiveSaleUnit = saleUnit ?? product.unit`. POS, Encargar, inventario y catálogo leen **solo** `effectiveSaleUnit`.

### Reglas de archivo

| Superficie | Comportamiento |
|------------|----------------|
| GET panel (sin `archived`) | Excluir `archivedAt IS NOT NULL`. Incluir GLOBAL no archivados (con o sin oferta) + LOCAL no archivados. GLOBAL **nuevos** del admin **sí** aparecen (D-F13-23). |
| GET `?archived=1` | Solo ofertas de la sucursal activa con `archivedAt`. |
| Ocultar | Set `archivedAt=now()`. GLOBAL sin oferta: **crear** `ProviderProduct` archivado (`price=0`, `isAvailable=false`, `saleUnit=null`). |
| Restaurar | `archivedAt=null`. No recrea SKU. Conserva `isAvailable`, `sectionId`, `saleUnit`, precio. |
| Vendible | `isAvailable` + `product.isActive` + `archivedAt IS NULL`. |
| Inventario listado | Sin filas archivadas. |
| Admin GET | Todos los `Product` (GLOBAL+LOCAL), no cada oferta. PATCH `isActive` LOCAL y GLOBAL. DELETE HTTP **405**. Alta admin sigue solo GLOBAL. |
| Reportes ventas | `OrderItem` snapshot; **no** filtrar por activo/archivado. |
| Encargar vs ocultar | Ocultar con Encargar activo = **2xx**. Cambio `saleUnit`/`boxContentFactor` con Encargar activo = **409**. |

Unique `(providerId, productId)` **intacto**. Prohibido SQL DELETE. `canDelete` PROVIDER sigue false.

Ocultar stub GLOBAL: precio 0 + `isAvailable=false` para que, si se restaura sin editar, no quede vendible accidentalmente a precio 0; Restaurar **no** fuerza `isAvailable=true`.

### Reglas de unidad de oferta

- PROVIDER **no** muta `Product.unit` ni `name` de un GLOBAL (400 si el body lo intenta).
- LOCAL **sí** muta `Product.unit` y nombre propios; `saleUnit` de la oferta se alinea al `Product.unit` LOCAL (misma transacción).
- Primera edición GLOBAL sin oferta **crea** `ProviderProduct` (precio requerido ≥ 0).
- Si `effectiveSaleUnit = CAJA`, `boxContentFactor` obligatorio (`> 0`). Otras unidades: factor null permitido.
- Cambio de `saleUnit` o `boxContentFactor` con `onHand ≠ 0`: exige `confirmDiscard=true`; entonces `onHand=0` **sin** fila `InventoryEntry`.
- Cambio con `reserved > 0` (Encargar activo, ADR-037): **409**, sin mutar.
- Tras descarte, venta sigue blanda F12 (cero 4xx de stock).

### Enmiendas a ADRs vigentes

- **ADR-029:** alta admin solo GLOBAL; **listado y PATCH `isActive` cubren LOCAL**. Comparable / activar-en-otras-fruterías sigue solo GLOBAL.
- **ADR-022:** GET panel ya no incluye ocultos. Inactivos **sí**. Vendible suma `archivedAt IS NULL`. Prohibido usar `isAvailable` como único flag de «quitar de la vista».
- **ADR-036:** unidad de conversión caja/POS = `effectiveSaleUnit`, no siempre `Product.unit`.

#### 4. Consecuencias e impacto

* **Positivas:** onboarding con base; dashboard aligerable; admin con trazabilidad; aislamiento de unidad como el precio.
* **Riesgos:** oferta stub solo para ocultar un GLOBAL nunca vendido (precio 0). Unique ocupado a propósito (restaurar, no recrear).
* **Trade-off:** historial de entradas y de precio son tablas nuevas (no kardex de ventas).

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/comun/adrs/ADR-038-archivo-oferta-unidad.md`
- **Agente Downstream:** Backend Developer
