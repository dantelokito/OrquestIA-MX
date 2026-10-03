# Impacto por módulo — Fase 13

> **Fecha:** 16/09/2026  
> **Código hoy:** `C:\Users\PC GAMER\LaBorregaMarket` (versión `0.12.0`; F13 **no** implementada)  
> **Hecho de modelo:** unidad vive en `Product.unit`; precio y factor caja en la oferta (`ProviderProduct`). Editar catálogo proveedor hoy **solo** si `scope === "LOCAL"`.

Este documento es el mapa de impacto para Arquitecto, UX, Backend y Frontend. No sustituye ADRs ni contratos. El PM **no** fija el schema final.

## CAT — Catálogo proveedor

| Hoy | F13 |
|-----|-----|
| GET lista todos los GLOBAL activos + LOCAL propios | Excluye `archivedAt`. GLOBAL **nuevo** del admin **sigue apareciendo**. Inactivos sí. Bandeja `?archived=1` + Restaurar |
| Toggle Activo / `isAvailable` | Intactos. Tercer flag: oculto (`archivedAt`) |
| Precio inline `PriceInput` GLOBAL y LOCAL | Must explícito (`US-CAT-19`); historial por oferta (`US-CAT-20`) |
| **Editar** solo LOCAL; GLOBAL: precio + Foto, sin unidad | **Editar en GLOBAL y LOCAL.** GLOBAL: unidad y factor de **la oferta**; no nombre ni `Product.unit` del maestro. LOCAL: nombre + `Product.unit` + factor. Enum completo (CAJA). Foto F10 intacta |
| Alta LOCAL: unidad KG/PIEZA | Enum completo + factor caja en el mismo alta (`US-CAT-18`) |
| Sin «Eliminar» de producto | «Eliminar» = ocultar. Copy no dice borrar de la base. Encargar activo **no** bloquea ocultar |

SKU de inventario = misma oferta `ProviderProduct` de la sucursal. Sin BOM. No SKU nuevo para cambiar precio **ni** unidad GLOBAL.

## INV — Inventario

| Hoy | F13 |
|-----|-----|
| Listado de SKUs de la sucursal activa | **Sin** filas ocultas |
| Factor caja solo en ficha `InventorySkuSheet` | Misma fuente; también se captura/edita en catálogo. D-F12-7 intacto |
| Cambio de unidad LOCAL sin alerta | `US-INV-07`: alerta + `onHand = 0`; **409** si Encargar activo. Aplica a unidad de **oferta** GLOBAL y a LOCAL. Descarte **no** es entrada |
| `addInventoryEntry` solo incrementa `onHand` | Además **inserta** fila de entrada (para `US-DASH-12`) |

Unidad mostrada en inventario = unidad de venta de la oferta o fallback al maestro.

## POS / ORDERS / Encargar

| Hoy | F13 |
|-----|-----|
| POS cobra y descuenta on-hand (blando) | Intactos F12. No lista ocultos. Usa unidad de **oferta** (o fallback) |
| Encargar reserva/commit/restore | Intactos. Cambio de unidad/factor con Encargar activo → **409**. Ocultar con Encargar activo → **permitido**; líneas ya hechas siguen; cobros/encargos **nuevos** → 409 (`US-CAT-16`) |
| `OrderItem` snapshot | No se reescribe al ocultar, inhabilitar, ni al cambiar precio **o unidad** de catálogo (`US-DASH-10`) |

## DASH — Reportes

| Hoy | F13 |
|-----|-----|
| Ventas sucursal F10 + generales N>1 F11 | KPIs **no** filtran por activo/archivado. Snapshot `OrderItem` |
| Sin pestaña inventario | Sucursal: saldos **actuales** + **entradas** (`US-DASH-12`). N>1: **solo** actuales (`US-DASH-13`). Sin kardex. Sin backfill F12 |

## ADMIN

| Hoy | F13 |
|-----|-----|
| Listado productos **solo GLOBAL**; `limit: 100` silencioso | GLOBAL **y** LOCAL; origen/dueño; páginas reales 50/100 (`US-ADMIN-05`) |
| PATCH `isActive` / DELETE 405 en GLOBAL | `isActive` también en LOCAL. DELETE **sigue** 405. Admin **no** CRUD de nombre/precio de LOCAL ajeno |

## EXPLORE / cliente

| Hoy | F13 |
|-----|-----|
| Vendible = `isAvailable` + `product.isActive` | Suma **sin** `archivedAt`. Sin pantallas nuevas. Sin rediseño mapa/reseñas |

## ISO — sucursal (F11)

Ocultar, restaurar, precio, **unidad de oferta** y factor son **por sucursal activa**. El Paraíso Centro y El Paraíso Tecnológico no comparten ofertas. IDOR = 403.

## Qué NO cambia en F13

- Toggle Activo / `isAvailable` como palanca de «no vender pero sigue en lista» (ADR-022).
- Foto de producto en disco (`US-MEDIA-06`). Cloudinary/S3 (`CO-F10-002`).
- Pasarela `BL-040`. Kardex. BOM. Auto-global. `US-ADMIN-04` / `US-CAT-17`.
- Vitrina `/fruteria` sin existencias (D-F12-12).
- Inventario blando: POS/Encargar no 4xx por stock (D-F12-4) **después** de un descarte.
- Mutar `Product.unit` o el nombre de un maestro GLOBAL.

## Nota para Arquitecto (unidad de oferta)

Hoy `Product.unit` es del maestro. F13 exige unidad de venta **por sucursal** en GLOBAL, espejo del precio. El PM no diseña tablas; indica el *qué*: persistir unidad de oferta, fallback al maestro, no mutar GLOBAL, POS/inventario/catálogo coherentes. Factor caja ya está en la oferta (F12).

## QA / DevOps

- Editar GLOBAL: sucursal A cambia unidad; maestro y sucursal B intactos.
- CAJA exige factor; otras unidades permiten factor vacío.
- Ocultar con Encargar activo: 2xx; unidad con Encargar activo: 409.
- Descarte: on-hand 0 y **cero** fila nueva en historial de entradas.
- Fixtures F11: aislamiento de oferta (precio **y** unidad).
- Volumen disco F10 sigue DevOps; F13 no pide bucket.

## Inputs Utilizados

- **PRD:** `outputs/laborregamarket/fase-13/prd.md`
- **Código (solo lectura):** `ProviderCatalogF10.tsx`, `ProductFormDrawer.tsx`, `product.service.ts`, `InventorySkuSheet.tsx`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-13/impacto-modulos.md`
- **Agente Downstream:** Arquitecto, UX/UI
