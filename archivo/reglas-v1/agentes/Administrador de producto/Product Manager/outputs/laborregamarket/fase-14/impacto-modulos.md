# Impacto por módulo — Fase 14

> **Fecha:** 17/09/2026  
> **Código hoy (solo lectura):** `C:\Users\PC GAMER\LaBorregaMarket` rama **`main`** @ `0eda84c` (F13 mergeada vía PR #13; F14 **no** implementada)  
> **Hecho de panel:** Catálogo (`/proveedor`) mezcla identidad visual + productos + «Operación y Google». `patchProviderSettingsSchema` **no** acepta nombre/dirección/coords. `InventoryEntry` solo entradas positivas. Reportes generales **descartan** `series`/`products`/`bySource`.

Este documento es el mapa de impacto para Arquitecto, UX, Backend y Frontend. No sustituye ADRs ni contratos. El PM **no** fija el schema final.

## PROF — Perfil (nuevo)

| Hoy | F14 |
|-----|-----|
| No existe pestaña Perfil | Ruta `/proveedor/perfil` en `SubNavProveedor` (extremo derecho, después de Ventas; orden exacto = UX) |
| Logo, portada, colores en `/proveedor` | Mismos componentes (`MediaUpload`, `BrandColorPicker`) **en Perfil**. Contratos `POST /api/provider/media` y `PATCH /api/provider/me` de colores **sin cambio de semántica** |
| Google Maps al final de Catálogo, lock si `isVerified === false` | Sub-módulo en Perfil. Gate **intacto**. Campos `googlePlaceId`, `googleMapsUrl`, `googleReviewsEnabled` |
| `businessName`, `address`, `city`, `phone`, `description`, `latitude`, `longitude` solo en onboarding | PATCH proveedor los acepta. Geo Monterrey/AMM. **No** reset `isVerified` |
| `openingHours` y capacidades en API, **sin** UI | UI en Perfil. Prep time y `offersDelivery` se **mueven** aquí (salen de Catálogo) |
| `getMyBusiness()` 4 veces al cargar `/proveedor` | Un fetch compartido al cargar Perfil (D-F14-19) |

Admin PATCH de los mismos datos de negocio: **Should**, no Must.

## CAT — Catálogo proveedor

| Hoy | F14 |
|-----|-----|
| Bloques A/B/D (imagen, colores, operación/Google) + productos | **Solo** productos: secciones, altas LOCAL, precios, unidades de oferta F13, archivados, Foto F10 |
| Toggle `posShowImages` en Catálogo (`PosImagesToggle` vive en `inventory/`) | El toggle **sale** de Catálogo (`US-CAT-21`) |
| Activar GLOBAL sin precio: `price ?? 50` | **Prohibido.** Exige precio válido > 0 o no activa (`US-CAT-22`) |
| `sectionError` 409 solo dentro del form «Nueva sección» cerrado | Error **visible** al borrar sección con productos (`US-CAT-23`) |
| `archivedAt`, Editar GLOBAL/LOCAL, bandeja F13 | **Intactos.** No reabrir `US-CAT-14`…`20` |

## POS — Configuración (no el cobro)

| Hoy | F14 |
|-----|-----|
| `posShowImages` se edita desde Catálogo | Control **en** `/proveedor/pos` (junto a la venta). Semántica F12 (`US-POS-12`) intacta: default ON, persistido por sucursal |
| Cobro, inventario blando, `decrementOnHandForLines` | **Sin cambio.** No kardex de venta. Saldos negativos de POS **siguen permitidos** |

## INV — Inventario

| Hoy | F14 |
|-----|-----|
| Listado on-hand + entrada (`StockEntrySheet`) + ficha | Se **añade** registrar merma y ajuste por conteo. Sub-pestaña o listado **Movimientos** |
| `InventoryEntry` solo `quantity` positiva | Persistir `MERMA` y `AJUSTE` (Arch elige tabla). Entradas F13 **siguen** |
| `onHand` puede quedar negativo por POS | Merma/ajuste → **400** si el resultado sería < 0. Conteo físico ≥ 0; saldo = conteo |
| Descarte unidad `confirmDiscard` → `onHand=0` sin traza | **No** se rediseña (`US-INV-07`). El listado Movimientos **no** exige fila de descarte |
| POS / `DELIVERED` decrementan sin movimiento | **No** se instrumentan (Won't) |

SKU = `ProviderProduct` de la sucursal activa. Sin BOM. Sin lotes.

## DASH — Reportes y Ventas

| Hoy | F14 |
|-----|-----|
| Reportes generales: 3 KPIs + tabla sucursal + snapshot inventario; **no** pinta `series`/`products`/`bySource` | Pinta las tres series + filtro `productIds` (`US-DASH-14`). N=1: 403 + redirect **intactos** |
| Ventas: dos SVG casi idénticos (`BarChartIlustrativo`, `ReportBarChart`) | Un componente (SVG unificado **o** librería: Arch decide). Tendencia, mix canal, top productos. `<details>` + print **se conservan** |
| PDF `showPdf={false}`; endpoint solo modo `grain` | Descarga del corte `from`/`to` visible (`US-DASH-16`). Sin `grain` en UI |
| Inventario en reportes F13 (actual + entradas) | **Intacto.** El listado Movimientos de INV es **otra** superficie (incluye merma/ajuste) |

## AUTH / settings

| Hoy | F14 |
|-----|-----|
| `patchProviderSettingsSchema` `.strict()` sin datos de negocio | Ampliar con campos de `US-PROF-03`. Reusar `monterreyLatSchema` / `monterreyLngSchema` |
| `whatsappEnabled`, `acceptsCardAtStore`, `offersWholesale`, `offersRetail`, `openingHours` ya en schema | Sin cambio de contrato; falta UI |
| `isVerified` gate de Google | **No** se muta al PATCH de dirección/coords |

## EXPLORE / cliente

| Hoy | F14 |
|-----|-----|
| Horarios, capacidades, pin, ETA, filtro mayoreo | **Consumen** datos nuevos cuando el proveedor los edita. **Sin** rediseño de mapa, reseñas ni WhatsApp cliente |
| Sello verificado | Sigue si `isVerified` era true, aunque mude el pin (D-F14-5) |

## ISO — sucursal (F11)

Perfil, merma, ajuste, reportes y toggle POS son **por sucursal activa**. El Paraíso Centro y El Paraíso Tecnológico no comparten settings ni movimientos. IDOR = 403.

## Qué NO cambia en F14

- Inventario blando al **vender** (ADR-022). Encargar reserva/commit/restore F12.
- Ocultar/restaurar, unidad de oferta, precio de oferta, historial de precio (F13).
- Foto de producto disco (`US-MEDIA-06`). Cloudinary/S3 (`CO-F10-002`).
- Pasarela `BL-040`. BOM. Auto-global. `US-ADMIN-04`.
- Vitrina `/fruteria` sin existencias (D-F12-12).
- Descarte por cambio de unidad (`US-INV-07`).
- Mutar `Product.unit` o el nombre de un maestro GLOBAL.

## Nota para Arquitecto (merma aditiva)

El diagnóstico proponía kardex completo (`InventoryMovement` para **toda** mutación de `on_hand`). F14 **rechaza** ese alcance. El *qué*: persistir merma y ajuste con motivo/nota/delta/saldo resultante, listarlos junto a entradas, **sin** tocar POS ni `DELIVERED`. Tabla = decisión Arch (`InventoryEntry` extendido vs `InventoryMovement` acotado). Concurrencia fila = Should (`BL-243`).

## QA / DevOps (cuando implementen; no ahora)

- Perfil: mover bloques no duplica logo en Catálogo.
- Google lock si `isVerified === false`; 403 si se fuerza PATCH de reseñas.
- Coords fuera de AMM → 400; `isVerified` sigue true.
- Merma > on_hand → 400; POS puede dejar negativo después.
- Conteo −1 → 400; conteo 0 con on_hand 5 → saldo 0 y movimiento AJUSTE.
- N=1 no entra a reportes generales. PDF = mismo rango que la UI.
- Activar GLOBAL sin precio: no aparece $50 en `/fruteria`.
- Borrar sección con productos: toast/banner 409, sección intacta.
- No-regresión F13 ocultar/unidad/precio; F12 inventario/POS; F11 aislamiento.

## Inputs Utilizados

- **PRD:** `outputs/laborregamarket/fase-14/prd.md`
- **Diagnóstico:** `comun/MEJORA-PANEL-PROVEEDOR.md`
- **Código (solo lectura, vía diagnóstico):** `SubNavProveedor.tsx`, `ProveedorPageClient.tsx`, `provider-settings.ts`, `inventory.service.ts`, `GlobalReportsPageClient.tsx`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/impacto-modulos.md`
- **Agente Downstream:** Arquitecto, UX/UI
