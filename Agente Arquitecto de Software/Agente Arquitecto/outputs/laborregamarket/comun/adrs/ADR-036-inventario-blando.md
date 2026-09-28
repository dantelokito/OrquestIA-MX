# ADR-036 — Inventario blando Decimal por sucursal

> **Estado:** Aprobado  
> **Fecha:** 2026-09-14  
> **Decisores:** Arquitecto de Software  
> **Fase:** 12 — Inventario / almacén

---

#### 1. Contexto y Problema:

El dueño necesita existencias administrativas por sucursal activa (F11): on-hand, tope, umbral, factor caja y barra. `ProviderProduct.stock` es `Int?` y **no se usa**. KG y fracciones no caben en `Int`. `isAvailable` (ADR-022) es el toggle Activo / vendible: **no** es stock. POS y Encargar deben vender con saldo 0, negativo o desactualizado (D-F12-4). No hay kardex Must (D-F12-10).

---

#### 2. Opciones Consideradas:

* **Opción A — Reusar `stock` Int?:** Pros: cero columnas. Contras: pierde KG; contradice el PRD; riesgo de tratarlo como `isAvailable`.
* **Opción B — Tabla `InventoryLedger` (kardex) como fuente de verdad:** Pros: auditoría. Contras: Won't F12; más complejidad.
* **Opción C — Campos Decimal en `ProviderProduct` + preferencia en `Provider`; `stock` Int? deprecado (no leer/escribir):** Pros: 1:1 con la oferta de sucursal; Decimal(12,3); aislamiento `providerId`; sin kardex. Contras: columna `stock` queda huérfana hasta una fase futura de drop.

---

#### 3. Decisión Elegida:

**Opción C.**

| Campo | Tabla | Semántica |
|-------|--------|-----------|
| `onHand` | `ProviderProduct` | Saldo administrativo. Default `0`. Puede ser negativo. `Decimal(12,3)`. |
| `capacityMax` | `ProviderProduct` | Tope. `NULL` = sin tope (barra omitida). `Decimal(12,3)`. |
| `alertThresholdPercent` | `ProviderProduct` | Entero 1–100. Default **10**. Porcentaje del tope. |
| `alertEnabled` | `ProviderProduct` | Default `true`. Si `false`, no hay alerta de poca existencia. |
| `boxContentFactor` | `ProviderProduct` | Unidades de catálogo por caja. Fijo en la oferta. `NULL` hasta que el dueño lo defina. |
| `posShowImages` | `Provider` | Toggle imágenes POS. Default `true`. Independiente de miniaturas CAT. |
| `stock` | `ProviderProduct` | **Deprecado.** F12 no lo lee ni lo escribe. No migrar valores. No usarlo como `isAvailable`. |

**Entrada:** `POST .../entries` suma a `onHand` en unidad de catálogo, o `quantity * boxContentFactor` si `receiveAs=BOX`. Cantidad `<= 0` → 400. Superar tope **permitido**. Saldo mal **no** bloquea una entrada válida.

**Venta POS:** al cobrar, restar la cantidad convertida a unidad de catálogo. **Nunca** 400/403/409 por `onHand`. 409 solo ADR-022 (`isAvailable` / no vendible). Líneas libres (ADR-013) no tocan inventario.

**Público:** `GET /api/providers`, `GET /api/providers/[id]` y rutas `/fruteria` **no** serializan on-hand, tope, umbral, alerta, reserved ni factor caja.

### Qué NO hacer

- Tratar `onHand === 0` como inhabilitado.
- Responder 4xx de stock en `POST /api/provider/pos/sales` o `POST /api/orders`.
- Inventario compartido entre sucursales.
- Kardex Must. BOM. Cloudinary/S3.

---

#### 4. Consecuencias e Impacto:

* **Positivas:** KG con Decimal; ADR-022 intacto; un SKU = una oferta; factor caja no viaja en cada carga.
* **Riesgos:** `stock` Int? puede confundir; Backend debe ignorarlo en servicios F12. Saldo negativo es estado válido.

## Referencias

- US-INV-01 … US-INV-05, US-CAT-12, US-POS-12
- ADR-022 (solo lectura), ADR-002, ADR-003, ADR-034
