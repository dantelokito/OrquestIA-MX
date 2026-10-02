# API-INVENTORY-14 — Merma, ajuste y listado de movimientos

> **Endpoints:** `POST /api/provider/inventory/[providerProductId]/shrinkage` · `POST /api/provider/inventory/[providerProductId]/adjustments` · `GET /api/provider/inventory/movements` · delta `POST .../entries` y reportes inventario  
> **Descripción:** Persistir MERMA y AJUSTE en `InventoryEntry.kind`. 400 si el saldo resultante sería negativo. Listar ENTRADA+MERMA+AJUSTE. Sin ventas.  
> **Autenticación:** Requerida — PROVIDER + sucursal activa  
> **Módulo:** `PRODUCTS`  
> **Versión:** 0.14.0  
> **Fecha:** 2026-09-17  
> **US:** US-INV-08, US-INV-09, US-INV-10  
> **ADR:** ADR-040, ADR-036, ADR-022, ADR-038, ADR-003, ADR-002, ADR-004, ADR-034  
> **Envelope:** ADR-003  
> **Base (solo lectura):** `fase-13/api/API-INVENTORY-13.md`

## Inputs Utilizados

- PRD D-F14-10…12, D-F14-16, D-F14-17, D-F14-21
- DB `fase-14/data-model/DB-inventory-entries.md`

---

## Políticas (no negociables)

1. Merma/ajuste: resultado `onHand < 0` → **400** `INVENTORY_NEGATIVE_NOT_ALLOWED`, **sin** mutar saldo y **sin** fila.
2. Venta POS / `decrementOnHandForLines` / `DELIVERED`: **no se tocan**. Pueden dejar `onHand` negativo.
3. `confirmDiscard` (`US-INV-07`): **intacto**. Sigue sin fila.
4. Unidad = `effectiveSaleUnit`. Merma/ajuste **no** aceptan `receiveAs=BOX`.
5. Oferta archivada → **409** `{ "error": "Oferta oculta" }` (igual entradas F13).
6. IDOR: SKU de otra sucursal → **403**. No filtrar por `providerId` de query ajeno.

Must de transacción: leer saldo, validar, escribir `onHand` + fila. `SELECT FOR UPDATE` = Should (`BL-243`).

---

## POST `/api/provider/inventory/[providerProductId]/shrinkage`

> **Descripción:** Registrar merma. Cantidad mayor que 0 en unidad de catálogo de la oferta.

#### Body de Solicitud:

```json
{
  "quantity": "5.000",
  "reason": "CADUCIDAD",
  "note": "Caja golpeada en frío"
}
```

| Campo | Tipo | Requerido | Validación |
|-------|------|-----------|------------|
| `quantity` | string decimal | Sí | Mayor que 0, máx. 3 decimales. Menor o igual a 0 → 400. |
| `reason` | enum | Sí | `CADUCIDAD` \| `DANO` \| `ROBO` \| `MUESTRA` \| `OTRO` |
| `note` | string | No | Trim; máx. 200. Vacío → persistir null. |

#### 201 Success:

```json
{
  "data": {
    "id": "clxmerma01",
    "providerProductId": "clxpp01",
    "kind": "MERMA",
    "quantity": "5.000",
    "appliedDelta": "-5.000",
    "onHandAfter": "5.000",
    "reason": "CADUCIDAD",
    "note": "Caja golpeada en frío",
    "createdAt": "2026-09-17T18:00:00.000Z",
    "onHand": "5.000"
  }
}
```

`onHand` en `data` = saldo actual de la ficha (igual a `onHandAfter`).

#### 400 saldo insuficiente (`onHand = 3`, merma 4; o `onHand = 0` y merma mayor que 0):

```json
{
  "error": {
    "code": "INVENTORY_NEGATIVE_NOT_ALLOWED",
    "message": "La cantidad supera el saldo disponible"
  },
  "timestamp": "2026-09-17T18:00:00.000Z",
  "details": [
    { "field": "quantity", "message": "La merma dejaría existencias negativas" }
  ]
}
```

El objeto `error.code` sigue el precedente de `GLOBAL_REPORTS_NOT_AVAILABLE`. `details` es opcional ADR-003 para el campo.

AUDIT `PRODUCTS` / `UPDATE`, `details.kind=MERMA`.

---

## POST `/api/provider/inventory/[providerProductId]/adjustments`

> **Descripción:** Fijar `onHand` al **conteo físico**. El dueño no calcula el delta.

#### Body de Solicitud:

```json
{
  "countedOnHand": "5.000",
  "note": "Conteo de anaquel 17/09"
}
```

| Campo | Tipo | Requerido | Validación |
|-------|------|-----------|------------|
| `countedOnHand` | string decimal | Sí | ≥ 0, máx. 3 decimales. Ausente / NaN / negativo → **400**. **0 es válido.** |
| `note` | string | No | Máx. 200. |

No hay `reason` de merma. Persistencia: `kind=AJUSTE`, `quantity=countedOnHand`, `appliedDelta = countedOnHand − onHandPrevio`, `onHandAfter = countedOnHand`.

Ejemplo: previo 8, conteo 5 → delta −3, saldo 5. Previo 8, conteo 12 → delta +4. Previo 5, conteo 0 → saldo 0.

#### 201 Success:

```json
{
  "data": {
    "id": "clxaj01",
    "providerProductId": "clxpp01",
    "kind": "AJUSTE",
    "quantity": "5.000",
    "appliedDelta": "-3.000",
    "onHandAfter": "5.000",
    "reason": null,
    "note": "Conteo de anaquel 17/09",
    "createdAt": "2026-09-17T18:05:00.000Z",
    "onHand": "5.000"
  }
}
```

Si por carrera el cálculo daría `onHandAfter < 0` → **400** `INVENTORY_NEGATIVE_NOT_ALLOWED` (mismo código que merma). Con `countedOnHand ≥ 0` el resultado de este flujo no es negativo salvo bug; el 400 cubre el Should de lock.

---

## GET `/api/provider/inventory/movements`

> **Descripción:** Listado paginado de la sucursal **activa**. Solo `ENTRADA`, `MERMA`, `AJUSTE`.

#### Query Parameters:

| Param | Tipo | Default | Validación |
|-------|------|---------|------------|
| `page` | int | 1 | ≥ 1 |
| `limit` | int | 50 | 1–100 (ADR-004) |
| `kind` | enum | omitido = los tres | `ENTRADA` \| `MERMA` \| `AJUSTE` |
| `from` | `YYYY-MM-DD` | — | Si se envía uno, se exigen ambos. TZ America/Monterrey, reglas ADR-033 (366 días, no futuro, `from ≤ to`). |
| `to` | `YYYY-MM-DD` | — | Igual |
| `providerProductId` | cuid | — | Opcional. Ajeno → **403**. |

`from > to` → **400** `details.field=from`. **Prohibido** query `providerId` de otra sucursal para «ver la B».

#### 200 Success:

```json
{
  "data": [
    {
      "id": "clxmerma01",
      "providerProductId": "clxpp01",
      "productName": "Mango Ataulfo",
      "kind": "MERMA",
      "quantity": "5.000",
      "receiveAs": null,
      "appliedDelta": "-5.000",
      "onHandAfter": "5.000",
      "reason": "CADUCIDAD",
      "note": "Caja golpeada en frío",
      "createdAt": "2026-09-17T18:00:00.000Z"
    },
    {
      "id": "clxent01",
      "providerProductId": "clxpp01",
      "productName": "Mango Ataulfo",
      "kind": "ENTRADA",
      "quantity": "2.000",
      "receiveAs": "CATALOG",
      "appliedDelta": "2.000",
      "onHandAfter": "10.000",
      "reason": null,
      "note": null,
      "createdAt": "2026-09-16T17:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 50,
    "total": 2,
    "totalPages": 1
  }
}
```

Orden: `createdAt DESC`. Empty: `data: []`, `meta.total=0` (200, no 404).

Entradas F13 históricas pueden traer `onHandAfter: null`. F14 no exige backfill. El listado **no** incluye descarte `US-INV-07`, POS ni Encargar.

---

## Delta POST `/api/provider/inventory/[providerProductId]/entries`

Contrato F13 de body **sin cambio**. En la misma transacción: `kind=ENTRADA` (default) y `onHandAfter` = saldo post-incremento. `receiveAs` sigue obligatorio.

---

## Delta reportes inventario F13

`GET /api/provider/reports/inventory`: el arreglo `entries[]` **solo** filas `kind=ENTRADA`. No editar markdown de `fase-13/`. Sin este filtro, US-DASH-12 se rompería.

---

## Errores

| HTTP | Caso |
|------|------|
| 400 | Zod; merma/ajuste que dejaría negativo; conteo negativo; `from > to`; span mayor que 366 |
| 401 | Sin sesión |
| 403 | Rol / IDOR SKU o filtro |
| 404 | No usado para SKU ajeno (403, no filtrar existencia) |
| 409 | Oferta archivada |
| 500 | Error interno |

**Prohibido:** 4xx de stock en `POST /api/provider/pos/sales` o `POST /api/orders`.

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/api/API-INVENTORY-14.md`
- **Agente Downstream:** Backend Developer
