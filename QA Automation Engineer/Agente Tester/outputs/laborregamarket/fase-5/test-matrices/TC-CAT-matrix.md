# Matriz de Casos de Prueba: TC-CAT-matrix

> **Proyecto:** laborregamarket  
> **Módulo / Feature:** Catálogo inhabilitado en todos los canales  
> **Historia / Contrato:** `US-CAT-01`, `API-PROVIDER-PRODUCTS-01`, `UF-CAT-01`  
> **Fecha:** 2026-08-15  
> **Ambiente:** `http://127.0.0.1:8080`

---

## Resumen de ejecución

| Métrica | Valor |
|---------|-------|
| Total de casos | 12 |
| Happy path ejecutados | 7/7 |
| Negativos / edge ejecutados | 4/5 (EC-F5-05 no auto) |
| Seguridad ejecutados | — |

---

## Tabla resumen

| ID | Nombre | Tipo | Prioridad | Auto |
|----|--------|------|-----------|------|
| TC-CAT-001 | Detalle omite `isAvailable=false` (no greyscale) | Positivo | P1 | catalog.spec.ts |
| TC-CAT-002 | Samples explorar no incluyen inactivo | Positivo | P1 | catalog.spec.ts |
| TC-CAT-003 | POST /api/orders con id inactivo → 409 | Negativo | P1 | orders.spec.ts |
| TC-CAT-004 | POST POS catálogo inactivo → 409 | Negativo | P1 | pos.spec.ts |
| TC-CAT-005 | POS customItem no dispara 409 de catálogo | Positivo | P1 | pos.spec.ts |
| TC-CAT-006 | Reactivar: reaparece en detalle | Positivo | P1 | catalog.spec.ts |
| TC-CAT-007 | Replay Idempotency-Key no revalida toggle | Edge Case | P1 | orders.spec.ts |
| TC-CAT-008 | topProducts excluye SKU inhabilitado | Positivo | P2 | catalog.spec.ts |
| HP-CAT-01 | Toggle Inactivo → desaparece frutería/POS | Positivo | P1 | e2e/catalog-channels.spec.ts |
| HP-CAT-01b | Carrito retira línea + toast | Positivo | P1 | e2e/catalog-channels.spec.ts |
| EC-F5-05 | `Product.isActive=false` omitido en detalle | Edge Case | P2 | catalog.spec.ts (si seed lo permite) |
| HP-CAT-POS-EMPTY | Todos inactivos: empty POS + Ir a Catálogo | Edge Case | P2 | e2e/catalog-channels.spec.ts |

---

## 1. Casos Positivos (Happy Path)

| ID | Nombre | Prerrequisitos | Resultado esperado | Estado |
|----|--------|----------------|-------------------|--------|
| TC-CAT-001 | Omitir inactivo en detalle | PATCH `isAvailable=false` | `products[]` sin ese id; ningún `isAvailable:false` | Pass |
| TC-CAT-002 | Samples públicos | mismo toggle | `sampleProducts` no nombra el SKU | Pass |
| TC-CAT-005 | Línea libre POS | catálogo inactivo o no | POST customItem → 201 | Pass |
| TC-CAT-006 | Reactivar | PATCH `isAvailable=true` + precio | Reaparece en detalle | Pass |
| HP-CAT-01 | UI canales | PROVIDER toggle | Hint “no es stock”; producto ausente en detalle/POS | Pass |

---

## 2. Casos Negativos (Unhappy Path)

| ID | Nombre | Input inválido | Error esperado | Estado |
|----|--------|----------------|----------------|--------|
| TC-CAT-003 | Orden con id inactivo | `POST /api/orders` | 409 `{ "error": "Producto no disponible" }`; no crea orden | Pass |
| TC-CAT-004 | POS catálogo inactivo | `POST /api/provider/pos/sales` | 409 mismo error | Pass |

---

## 3. Casos Límite (Edge Cases)

| ID | Nombre | Condición límite | Resultado esperado | Estado |
|----|--------|------------------|-------------------|--------|
| TC-CAT-007 | Replay Idempotency-Key | orden ya 201, luego toggle off | Replay 200 misma orden | Pass |
| TC-CAT-008 | Dashboard top | SKU inhabilitado | No entra en ranking vigente | Pass |
| HP-CAT-01b | Carrito stale | línea en carrito + toggle off | Toast `"{nombre} ya no está disponible"` | Pass |
| HP-CAT-POS-EMPTY | Catálogo vacío POS | proveedor nuevo | “No hay productos activos” + Ir a Catálogo | Pass |

---

## Referencias upstream

- ACs: `US-CAT-01`
- Contrato: Arquitecto `fase-5/api/API-PROVIDER-PRODUCTS-01.md`
- Handoff FE: `FEAT-CAT-handoff.md`
- ADR-022

---

## Notas

- No es stock / “agotado”. Copy POS cobro: “Ese producto ya no está a la venta”.
- Restaurar seed al terminar cada mutación (suite paralela).

*Matriz Fase 5 — LaBorregaMarket v0.5.0*
