# ADR-040 — Merma y ajuste aditivos en `InventoryEntry`

> **ADR-040:** Persistencia MERMA/AJUSTE sin kardex de ventas  
> **Estado:** Aprobado  
> **Fecha:** 2026-09-17  
> **Fase:** 14  
> **US:** US-INV-08, US-INV-09, US-INV-10  
> **Decisores:** Arquitecto de Software

## Inputs Utilizados

- PRD F14 D-F14-10, D-F14-11, D-F14-12, D-F14-16, D-F14-17, D-F14-21
- `fase-13/data-model/DB-inventory-entries.md` (solo lectura)
- ADR-036 (inventario blando), ADR-022 (venta sin 4xx de stock), ADR-038 (descarte ≠ entrada)

---

#### 1. Contexto y Problema:

F13 persiste solo **entradas positivas** en `InventoryEntry` (`quantity` > 0, `receiveAs`, `appliedDelta` ≥ 0). F14 pide merma (cantidad + motivo enum + nota) y ajuste por conteo físico, listables junto a las entradas, **sin** instrumentar POS ni `DELIVERED`.

PM dejó abierta la tabla: extender `InventoryEntry` **o** crear `InventoryMovement` acotado a ENTRADA+MERMA+AJUSTE.

Dos políticas de saldo (a propósito):

| Flujo | `onHand` resultante negativo |
|-------|----------------------------|
| Merma / ajuste | **400**, sin fila |
| Venta POS / commit Encargar | **Permitido** (ADR-036 / ADR-022) |

`SELECT FOR UPDATE` = Should (`BL-243`), no Must.

---

#### 2. Opciones Consideradas:

* **Opción A — Extender `InventoryEntry` con discriminador `kind`:** Pros: una tabla; las filas F13 quedan ENTRADA por default; un GET de movimientos; sin dual-write. Contras: el reporte F13 de «entradas» **debe** filtrar `kind=ENTRADA` o mezclaría merma.
* **Opción B — Tabla nueva `InventoryMovement` (ENTRADA+MERMA+AJUSTE):** Pros: semántica de kardex acotado. Contras: duplicar ENTRADA o migrar `InventoryEntry`; dos fuentes de verdad; más migración para el mismo alcance.
* **Opción C — `InventoryMovement` solo MERMA+AJUSTE + UNION con entradas:** Pros: no toca F13. Contras: GET movimientos heterogéneo; paginación frágil; PM pedía un alcance de tres tipos, no dos tablas.

---

#### 3. Decisión Elegida:

**Opción A.** No hay `InventoryMovement` en F14.

### Schema (delta)

| Campo | Tipo | Semántica |
|-------|------|-----------|
| `kind` | enum `ENTRADA` \| `MERMA` \| `AJUSTE` | Default **`ENTRADA`** (filas F13). |
| `quantity` | Decimal(12,3) | ENTRADA = cantidad recibida; MERMA = cantidad descartada (mayor que 0); AJUSTE = **conteo físico** (≥ 0). |
| `receiveAs` | `InventoryReceiveAs?` | Obligatorio en ENTRADA. **NULL** en MERMA/AJUSTE. |
| `appliedDelta` | Decimal(12,3) | Con signo. ENTRADA ≥ 0; MERMA negativo; AJUSTE = conteo − `onHand` previo (puede ser 0, + o −). |
| `onHandAfter` | Decimal(12,3)? | Saldo resultante. **Must** en escrituras F14. Filas F13 históricas: NULL. |
| `reason` | enum nullable | Solo MERMA: `CADUCIDAD` \| `DANO` \| `ROBO` \| `MUESTRA` \| `OTRO`. |
| `note` | String? | Máx. 200. Opcional. |

`ProviderProduct.onHand` sigue siendo la fuente de verdad del saldo (ADR-036). Las filas son **auditoría aditiva**, no un ledger que se recompute.

### Escritura

| Tipo | Path | Efecto |
|------|------|--------|
| ENTRADA | `POST .../entries` (F13) | Igual F13 + `kind=ENTRADA` + `onHandAfter`. |
| MERMA | `POST .../shrinkage` | `onHand := onHand − qty`. Si resultado negativo → **400** `INVENTORY_NEGATIVE_NOT_ALLOWED`, sin fila. |
| AJUSTE | `POST .../adjustments` | `onHand := countedOnHand`. Conteo negativo → **400**. Resultado = conteo (nunca negativo). |

Oferta archivada → **409** (misma semántica que entradas F13). IDOR sucursal ajena → **403**. Unidad = `effectiveSaleUnit`. Merma **no** usa `receiveAs=BOX`.

### Lectura

- `GET /api/provider/inventory/movements`: `kind` ∈ {ENTRADA, MERMA, AJUSTE}. **Sin** VENTA_POS, ENTREGA_PEDIDO ni descarte `US-INV-07`.
- `GET /api/provider/reports/inventory` (F13): `entries[]` **solo** `kind=ENTRADA`. No editar el markdown de `fase-13/`; el filtro es obligación de código F14.

### Concurrencia (Should `BL-243`)

Must: una transacción Prisma que lee `onHand`, valida, escribe saldo + fila.

**Riesgo de carrera:** dos mermas concurrentes pueden leer el mismo `onHand` y ambas pasar el chequeo. Sin `SELECT FOR UPDATE` (o `version` en la fila) el segundo commit puede dejar saldo negativo. F14 **acepta** ese riesgo. Should: `SELECT FOR UPDATE` sobre `provider_products` dentro de la transacción. No es bloqueo Must.

### Qué NO hacer

- Instrumentar `decrementOnHandForLines`.
- Filas de merma en `confirmDiscard` / `US-INV-07`.
- Kardex de POS o `DELIVERED`.
- 4xx de stock al **vender**.
- Backfill de `onHandAfter` en entradas F13.

---

#### 4. Consecuencias e Impacto:

* **Positivas:** Un modelo; ENTRADA F13 intacta con default; listado único; YAGNI vs kardex completo.
* **Riesgos:** Quien consulte `inventory_entries` sin filtrar `kind` verá merma en reportes de entradas — Backend **debe** filtrar. Carrera sin lock (BL-243).

## Referencias

- `fase-14/api/API-INVENTORY-14.md`
- `fase-14/data-model/DB-inventory-entries.md`
- ADR-036, ADR-022, ADR-038, ADR-003, ADR-002
