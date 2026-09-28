# Handoff de Feature: FEAT-POS

> **Proyecto:** laborregamarket  
> **Feature:** POS (venta de mostrador)  
> **Stack UI:** Next.js 15 + React 19 + Tailwind 4  
> **Fecha:** 2026-08-13  
> **Wireframe:** `WF-pos-mostrador`, `WF-pos-venta-rapida`, `WF-pos-cantidad-unidad`, `WF-pos-ticket`  
> **Contrato:** `API-POS-01`

---

## 1. Pantallas

| Vista | Ruta | Estado |
|-------|------|--------|
| POS split catálogo/ticket | `/proveedor/pos` | OK |
| Modal Venta rápida | overlay | OK |
| Ticket post-cobro + print | `#pos-ticket` | OK |

**Componentes:** `QuantityInput`, `NumericKeypad`, `UnitSelector`, `PaymentMethodSelector`, `QuickSaleModal`, `QuickSaleBadge`, `PosPageClient`

---

## 2. Integración API

| Endpoint | Método | Service | Estado |
|----------|--------|---------|--------|
| `/api/provider/products` | GET | `getMyProducts` (filtro `isAvailable` en cliente) | OK |
| `/api/provider/pos/sales` | POST | `createPosSale` + `Idempotency-Key` | OK |

XOR catálogo / `customItem`. Status `DELIVERED` (default) o `CONFIRMED` si "Para recoger más tarde".

---

## 3. Estados UI

| Vista | Loading | Empty | Error | Success |
|-------|---------|-------|-------|---------|
| POS catálogo | 8 skeletons | Buscador vacío → + Venta rápida | ErrorBanner; ticket conservado | Grid + total en vivo |
| Modal | — | — | Inline + foco inválido | Línea con QuickSaleBadge |
| Ticket | — | Recargar pierde ticket | ErrorBanner + Reintentar | Comprobante + Nueva venta |

---

## 4. Validación

Cantidad `inputmode="decimal"` máx. 3 decimales. Venta rápida: nombre 1–80, precio > 0 ≤ 99999.99.

---

## 5. A11y / responsive

Split `lg:flex-row` 58/42. Teclas ≥64×56. Badge venta rápida = icono + texto. `@media print` en `#pos-ticket`.

---

## 6. Pruebas

`npx vitest run tests/unit/format.test.ts`

---

## 7. DoD

- [x] 4 estados UI
- [x] APIs vía `lib/api/provider-ops.ts`
- [x] Touch 44px / keypad
- [x] Idempotencia en Cobrar
