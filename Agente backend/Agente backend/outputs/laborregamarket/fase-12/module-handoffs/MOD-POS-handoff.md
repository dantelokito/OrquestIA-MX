# Handoff de Módulo: MOD-POS (delta F12)

> **Proyecto:** laborregamarket  
> **Módulo:** POS  
> **Stack:** Next.js + Prisma  
> **Fecha:** 2026-09-14  
> **Contrato de referencia:** `API-POS-12`, ADR-022 (solo lectura), ADR-036

## Inputs Utilizados

- `API-POS-12.md`
- Path vigente F3 `POST /api/provider/pos/sales`

## 1. Endpoints

| Método | Ruta | Auth | Estado |
|--------|------|------|--------|
| POST | `/api/provider/pos/sales` | PROVIDER + sucursal activa | OK (delta inventario) |

## 2. Comportamiento

- Tras validar vendible (ADR-022) e idempotencia: crea venta `source=POS` y resta `onHand` convertido en la misma transacción.
- `onHand` 0 o negativo → **2xx**.
- Líneas libres (customItem) no tocan inventario.
- Replay de `Idempotency-Key` no vuelve a restar.
- SKU de otra sucursal → **403** (`OrderForbiddenError`).
- `isAvailable=false` / producto inactivo / id inexistente → **409** `{ "error": "Producto no disponible" }`.
- Prohibido 4xx por stock, saldo o capacidad.

## 3. JSON vs contrato

Respuesta de venta = envelope F3 (`{ data: order }`, 201 o 200 replay). No incluye `onHand`. El panel de inventario reconsulta GET inventario.

## 4. Pruebas

Unit: cobro con onHand 0 decrementa; IDOR sucursal B. Suite `npm test` 352 passed.

## 6. DoD Backend

- [x] DTO F3 vigentes
- [x] Transacción create + decrement
- [x] RBAC / ISO
- [x] Tests pasando

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-12/module-handoffs/MOD-POS-handoff.md`
- **Agente Downstream:** Frontend, QA
