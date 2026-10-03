# PRD Corto — Fase 12

> **Proyecto:** LaBorregaMarket
> **Fecha:** 14/09/2026
> **Versión:** discovery PM (inventario blando)
> **Objetivo del Negocio:** Que el dueño de la frutería vea y registre existencias de su catálogo como ayuda visual y administrativa (capacidad, alerta de poca existencia, vínculo Encargar↔órdenes), más miniaturas en la lista proveedor y un toggle de imágenes en POS.
> **Público Objetivo:** Usuario `PROVIDER` con sucursal **activa** (F11). Inventario **no compartido** entre sucursales.

> #### 1. Alcance (MVP)
> * **Incluido:**
>   * Existencias de los **mismos SKUs** del catálogo de la sucursal activa. Sin receta/BOM.
>   * Módulo `/proveedor/inventario` primero en SubNav: Inventario → Catálogo → POS → Órdenes → **Ventas** (ruta sigue `/proveedor/dashboard`) → Reportes generales (solo N>1).
>   * Carga en unidad de catálogo; factor de contenido de caja **fijo** en la oferta (`ProviderProduct` / ficha inventario de esa sucursal) si entra caja y se vende kg/pieza.
>   * Inventario **blando**: POS y Encargar **siempre venden** (saldo 0, negativo o desactualizado). `isAvailable` intacto (ADR-022). Se puede registrar entrada con saldo mal.
>   * Encargar: crear → parcial/reservado visible. Completar (`DELIVERED`) → descuento absoluto. Cancelar (`CANCELLED`) → repone. POS descuenta al cobrar.
>   * Capacidad/tope por producto; barra = %; alerta por producto; default 10%; se puede apagar; dueño sube máximo; se puede superar el tope (barra >100%).
>   * Miniaturas **siempre** en lista catálogo proveedor. Toggle imágenes POS default ON, persistido por sucursal; control en la **parte superior de `/proveedor`** (junto a las listas de secciones), no en la toolbar del POS.
> * **Fuera de Alcance:**
>   * BOM, inventario compartido entre sucursales, Cloudinary/S3, `BL-040`.
>   * Bloquear ventas por stock; usar `stock` como `isAvailable`.
>   * Kardex (historial de movimientos).
>   * Barra / existencias en vitrina cliente `/fruteria`.
>
> #### 2. Módulos Principales
> 1. `[INV/NAV]` `US-INV-01`: Ruta inventario + SubNav (Inventario primero, etiqueta Ventas) + aislamiento sucursal.
> 2. `[INV/CARGA]` `US-INV-02`: Entrada en unidad de catálogo + factor caja fijo en ficha.
> 3. `[INV/CAP]` `US-INV-03`: Tope, barra %, umbral 10%, apagar alerta, sobre-tope.
> 4. `[INV/LISTA]` `US-INV-04`: Listado: productos, barra, alerta, parcial Encargar.
> 5. `[POS/STOCK]` `US-INV-05`: POS descuenta al cobrar; no bloquea por existencias.
> 6. `[ORDERS]` `US-INV-06`: Reserva / commit `DELIVERED` / restore `CANCELLED`.
> 7. `[CAT/BARRA]` `US-CAT-12`: Barra dinámica en lista catálogo proveedor (no vitrina).
> 8. `[CAT/MEDIA]` `US-CAT-13`: Miniatura en lista catálogo proveedor.
> 9. `[POS/IMG]` `US-POS-12`: Imágenes en card POS + toggle persistido por sucursal.

## Decisiones (Dante, 14/09)

| ID | Decisión |
|----|----------|
| D-F12-1 | Existencias de los **mismos SKUs del catálogo**. No BOM. |
| D-F12-2 | `/proveedor/inventario` primero en SubNav: Inventario → Catálogo → POS → Órdenes → **Ventas** (ruta `/proveedor/dashboard`) → Reportes generales (solo N>1). |
| D-F12-3 | Carga en unidad de catálogo. Factor de contenido de caja si entra caja y se vende kg/pieza. |
| D-F12-4 | Inventario **blando**: POS y Encargar siempre venden (0, negativo, desactualizado). `isAvailable` intacto. Se puede registrar entrada con saldo mal. |
| D-F12-5 | Encargar crea → parcial/reservado visible. Completar (`DELIVERED`) → descuento absoluto. Cancelar (`CANCELLED`) → repone. POS descuenta al cobrar. |
| D-F12-6 | Capacidad/tope por producto; barra = %; alerta por producto; default 10%; se puede apagar; dueño sube máximo. |
| D-F12-7 | Factor caja **fijo** en la oferta (`ProviderProduct` / ficha inventario sucursal), no por cada carga. |
| D-F12-8 | Sí se puede superar el tope (barra >100%); no bloquea. |
| D-F12-9 | Toggle imágenes POS default ON, persistido por sucursal; control en `/proveedor` arriba de las listas de secciones. Miniaturas lista catálogo **siempre** (otro requisito). |
| D-F12-10 | Kardex **Won't F12**. |
| D-F12-11 | Etiqueta SubNav Dashboard → **Ventas**. |
| D-F12-12 | Cliente `/fruteria` **no** ve existencias. |

## MoSCoW

| Prioridad | Ítems |
|-----------|--------|
| Must | `US-INV-01` … `US-INV-06`, `US-CAT-12`, `US-CAT-13`, `US-POS-12` (`BL-200` … `BL-208`) |
| Should | Ninguno en F12. Todo lo validado por Dante es Must o Won't. |
| Could | Ninguno. |
| Won't | BOM, inventario compartido, Cloudinary/S3, `BL-040`, bloquear ventas por stock, stock como `isAvailable`, kardex, barra en vitrina `/fruteria`. |

## Relación con F11 y ADR-022

F11 aísla catálogo, POS, pedidos y media por sucursal activa. F12 **repite** ese aislamiento: el inventario es de la sucursal activa, no del dueño. ADR-022: `isAvailable` es el toggle Activo / vendible; **no** es stock. Columna `ProviderProduct.stock` (`Int?`) existe y **no** se usa como fuente de verdad de F12.

## Definiciones de dominio (congeladas)

| Término | Significado en F12 |
|---------|---------------------|
| Unidad de catálogo | `ProductUnit`: KG, PIEZA, MANOJO, CAJA, LITRO, GRAMO. POS hoy usa `UnitOfMeasure` PZA, KG, GR. |
| Completada (Encargar) | `OrderStatus.DELIVERED`. |
| Órdenes activas Encargar | `OrderSource.MARKETPLACE` y status **no** `DELIVERED` y **no** `CANCELLED`. |
| Parcial / reservado | Cantidad de líneas de órdenes activas Encargar, visible en inventario; no es kardex. |
| On-hand | Saldo administrativo de la sucursal (puede ser 0 o negativo). |

## NFRs (Must para Arquitecto)

- **Aislamiento F11:** lecturas/escrituras de inventario, tope, factor caja y preferencia de imágenes POS filtran por `activeProviderId`. IDOR entre sucursales del mismo user = **403**.
- **Cantidades:** para KG (y unidades fraccionables) el modelo debe usar **Decimal**, no `Int`. `ProviderProduct.stock` Int? no es el diseño final; Arquitecto decide schema (no el PM).
- **Venta blanda:** POS al cobrar y Encargar al crear/confirmar **nunca** responden 4xx/409 por saldo 0, negativo o desactualizado. El único rechazo de vendible sigue siendo ADR-022 (`isAvailable` / producto inactivo) = 409 producto no disponible.
- **Cliente público:** APIs de `/fruteria` no exponen on-hand, tope, umbral ni parciales.
- **Persistencia toggle POS:** por `Provider` (sucursal), default ON.
- Envelope ADR-003. Versionado `/api/v1/...` si el SAD vigente lo exige.

## Stakeholder

Alcance MVP validado por Dante (14/09), incluidas D-F12-1…12. Discovery **cerrado**; no reabrir preguntas.

## Inputs Utilizados

- Discovery 14/09: `outputs/laborregamarket/historial/OBSERVABILITY.md` (sección Discovery Fase 12)
- STATUS PM fase 12
- ADR-022 (solo lectura)
- F11 aislamiento (solo lectura)

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-12/prd.md`
- **Agente Downstream:** UX/UI y Arquitecto (paralelo)
- **Handoffs:** `handoff-ux-ui.md`, `handoff-arquitecto.md`
