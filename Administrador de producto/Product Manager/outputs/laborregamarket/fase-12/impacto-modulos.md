# Impacto por módulo — Fase 12

> **Fecha:** 14/09/2026  
> **Código hoy:** `C:\Users\PC GAMER\LaBorregaMarket`  
> **Hecho de modelo:** `ProviderProduct.stock` es `Int?` y **no se usa**. Inventario F12 es blando, por sucursal activa (F11). `isAvailable` ≠ stock (ADR-022).

Este documento es el mapa de impacto para Arquitecto, UX, Backend y Frontend. No sustituye ADRs ni contratos. El PM **no** fija el schema final.

## INV — Inventario (módulo nuevo)

| Hoy | F12 |
|-----|-----|
| No hay ruta `/proveedor/inventario` | Módulo Must: listado de SKUs de la sucursal activa, barra, alerta, parcial Encargar, registrar entrada, editar tope/umbral/alerta/factor caja |
| SubNav: Catálogo, POS, Órdenes, Dashboard, Reportes generales (N>1) | **Inventario primero**; Dashboard se etiqueta **Ventas** (`US-INV-01`, D-F12-2, D-F12-11) |

Riesgo: mezclar saldos entre sucursales. Tests 403 Must (`US-INV-01`).

## CAT — Catálogo proveedor

| Hoy | F12 |
|-----|-----|
| Lista de productos: toggle Activo, precio, unidad; imagen sobre todo en editar | **Miniatura siempre** en cada fila de la lista (`US-CAT-13`) |
| Sin barra de capacidad | **Barra dinámica** % tope en cada producto de la lista proveedor (`US-CAT-12`). No en vitrina `/fruteria` |
| `isAvailable` toggle Activo | **No cambia** (ADR-022). Stock 0 no apaga el producto |

SKU de inventario = misma oferta `ProviderProduct` de la sucursal (D-F12-1). Sin BOM.

## POS

| Hoy | F12 |
|-----|-----|
| Cobra sin tocar existencias | Al **cobrar** descuenta on-hand de la sucursal activa (`US-INV-05`). Si saldo 0 o negativo, **igual cobra**. Nunca 4xx por stock |
| Cards de catálogo en mostrador | Imagen en card cuando el toggle está ON (`US-POS-12`) |
| Sin preferencia de imágenes | Toggle en `/proveedor` (junto a listas de secciones), default ON, persistido **por sucursal**; afecta las cards de POS |

`UnitOfMeasure` POS (PZA, KG, GR) vs `ProductUnit` de catálogo: Arquitecto define conversión; PM exige que la carga sea en unidad de catálogo y el descuento POS sea coherente con esa unidad (o con el factor caja).

## ORDERS / Encargar

| Hoy | F12 |
|-----|-----|
| `OrderStatus`: PENDING, CONFIRMED, IN_TRANSIT, DELIVERED, CANCELLED | Sin nuevos status Must |
| Crear pedido Encargar no reserva stock | Crear (órdenes **activas** Marketplace: no DELIVERED, no CANCELLED) deja cantidad **parcial/reservada** visible (`US-INV-06`) |
| Entregar / cancelar no mueve inventario | `DELIVERED` = descuento absoluto (commit). `CANCELLED` = repone y deja de ser parcial |

Siempre se puede Encargar con saldo 0/negativo (D-F12-4). Completada = `DELIVERED`.

## NAV / chrome proveedor

| Hoy | F12 |
|-----|-----|
| SubNav sin Inventario; ítem Dashboard | Orden D-F12-2; etiqueta **Ventas**; ruta `/proveedor/dashboard` **sin cambio** |
| Reportes generales solo N>1 | **Sin cambio** de regla F11 |

## MEDIA / imágenes

| Hoy | F12 |
|-----|-----|
| Fotos de producto en disco (F10); lista catálogo sin miniatura Must | Reusar URL de media existente en lista CAT y cards POS. **No** Cloudinary/S3 |
| Toggle imágenes POS no existe | Preferencia por `Provider` (`US-POS-12`) |

## ISO — sucursal (F11)

Inventario, factor caja, tope, umbral, alerta y toggle POS son **por sucursal activa**. El Paraíso Centro y El Paraíso Tecnológico no comparten saldos. IDOR = 403.

## Qué NO cambia en F12

- Toggle Activo / `isAvailable` (ADR-022).
- Cloudinary/S3 (`CO-F10-002`).
- Pasarela `BL-040`.
- Kardex.
- Vitrina `/fruteria`: el cliente **no** ve existencias, barra ni parciales (D-F12-12).
- Reportes F10/F11 (salvo etiqueta Ventas en SubNav).
- Switcher N>1, módulo reportes globales, seed F11.

## Nota para Arquitecto (cantidades)

`ProviderProduct.stock` Int? **no** alcanza para KG. F12 exige cantidades Decimal para unidades de peso/volumen. Factor caja: número fijo en la ficha de la oferta (cuántos kg o piezas contiene una caja). El PM no diseña tablas; indica el *qué*.

## QA / DevOps

- Fixtures F11 (El Paraíso ×2, Campo Verde ×1): saldos distintos por sucursal.
- Venta con on-hand 0 y negativo: 2xx de cobro/pedido (salvo ADR-022).
- `/fruteria` no filtra payload de stock.
- Volumen disco F10 sigue DevOps; F12 no pide bucket.

## Inputs Utilizados

- **PRD:** `outputs/laborregamarket/fase-12/prd.md`
- **ADR-022:** `Agente Arquitecto/.../comun/adrs/ADR-022-catalog-inactive.md`
- **Código (solo lectura):** `C:\Users\PC GAMER\LaBorregaMarket`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-12/impacto-modulos.md`
- **Agente Downstream:** Arquitecto, UX/UI
