# Handoff de Feature: FEAT-INV-14

> **Proyecto:** laborregamarket  
> **Feature:** INV (US-INV-08/09/10)  
> **Stack UI:** Next.js 15 + React 19 + TypeScript + Tailwind 4  
> **Fecha:** 2026-09-17  
> **Wireframe de referencia:** `WF-INV-08-merma.md`, `WF-INV-09-ajuste.md`, `WF-INV-10-movimientos.md`  
> **Contrato de referencia:** `API-INVENTORY-14`, `MOD-INVENTORY-F14-handoff.md`, ADR-040

## Inputs Utilizados

- JSON Backend merma/ajuste/movimientos (enum `CADUCIDAD|DANO|ROBO|MUESTRA|OTRO`)

---

## 1. Pantallas

| Vista | WF | Ruta | Estado |
|-------|----|------|--------|
| Sheet merma | WF-INV-08 | `/proveedor/inventario` | OK |
| Sheet ajuste conteo ≥ 0 | WF-INV-09 | mismo | OK; delta preview |
| Sub-pestaña Movimientos | WF-INV-10 | `?tab=movimientos` | OK; copy SIN ventas POS |

**Componentes:** `MermaSheet`, `CountAdjustSheet`, `InventorySubTabs`, `MovementsTable`.  
Capa: `postInventoryShrinkage`, `postInventoryAdjustment`, `listInventoryMovements`, `useInventoryMutations`, `useInventoryMovements`.

---

## 2. Integración API

| Endpoint | Método | Service |
|----------|--------|---------|
| `/api/provider/inventory/{id}/shrinkage` | POST | `postInventoryShrinkage` |
| `/api/provider/inventory/{id}/adjustments` | POST | `postInventoryAdjustment` |
| `/api/provider/inventory/movements` | GET | `listInventoryMovements` |

400 `INVENTORY_NEGATIVE_NOT_ALLOWED` se muestra en el sheet (`role="alert"`). Cero en conteo es válido.

---

## 3. Estados UI

| Vista | Loading | Empty | Error | Success |
|-------|---------|-------|-------|---------|
| Sheets | CTA Registrando | cantidad vacía | 400/motivo | cierra; listado actualiza |
| Movimientos | 6 skeletons | copy sin ventas + Ir a Existencias | Reintentar | tabla/cards + paginación |

Tipo: badge texto + color (Entrada/Merma/Ajuste).

---

## 4. Pruebas

`provider-f14-ui.test.ts` (labels merma, delta conteo). Suite **409 passed / 87 files**.

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/feature-handoffs/FEAT-INV-14-handoff.md`
- **Agente Downstream:** QA Tester
