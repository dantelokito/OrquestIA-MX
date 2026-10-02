# Matriz de Casos de Prueba: TC-F12-matrix

> **Proyecto:** laborregamarket  
> **Módulo / Feature:** F12 Inventario blando (INV, CAT-12/13, POS-12)  
> **Historia de Usuario / Contrato:** US-INV-01…06, US-CAT-12, US-CAT-13, US-POS-12 · API-INVENTORY-01, API-POS-12, API-ORDERS-12, API-PROVIDER-PRODUCTS-12, API-PROVIDER-PREFS-12  
> **Fecha:** 2026-09-14 (re-prueba BUG-019)  
> **Ambiente:** `http://127.0.0.1:8080` · rama `feat/f12-inventario-blando` · migración F12 aplicada · Prisma client regenerado (evidencia BE)

---

## Resumen de ejecución

| Métrica | Valor |
|---------|-------|
| Total de casos | 21 |
| Happy path ejecutados | 15/15 (objetivo: 100%) |
| Negativos / edge ejecutados | 4/4 (objetivo: ≥ 85%) |
| Seguridad ejecutados | 3/3 |
| Pass | 21 |
| Fail | 0 |
| Blocked | 0 |

Re-prueba post `EVIDENCIA-BUG-019.md`: **21/21 Pass**. GET inventory 200 (aviso NFR: un GET listado ~1648 ms > 500 ms; no es 4xx ni fallo de AC Must).

---

## Tabla resumen

| ID | Nombre | Tipo | Prioridad | Estado |
|----|--------|------|-----------|--------|
| TC-F12-001 | GET listado inventario envelope | Positivo | P1 | Pass |
| TC-F12-002 | Entrada CATALOG incrementa onHand | Positivo | P1 | Pass |
| TC-F12-003 | PATCH tope/umbral/alerta | Positivo | P1 | Pass |
| TC-F12-004 | Entrada BOX con factor | Positivo | P1 | Pass |
| TC-F12-005 | POS cobra con on-hand 0 | Positivo | P1 | Pass |
| TC-F12-006 | Encargar reserva y CANCELLED restore | Positivo | P1 | Pass |
| TC-F12-007 | Encargar DELIVERED commit | Positivo | P1 | Pass |
| TC-F12-008 | CAT barra; público sin existencias | Positivo | P1 | Pass |
| TC-F12-009 | posShowImages persistido e independencia sucursal | Positivo | P1 | Pass |
| TC-F12-016 | POS línea libre sin inventario | Positivo | P1 | Pass |
| TC-F12-101 | SubNav Inventario primero + Ventas | Positivo | P1 | Pass |
| TC-F12-102 | Módulo inventario no spinner eterno | Positivo | P1 | Pass |
| TC-F12-103 | Miniatura CAT + toggle en `/proveedor` no POS | Positivo | P1 | Pass |
| TC-F12-104 | `/fruteria` sin barra ni existencias | Positivo | P1 | Pass |
| TC-F12-105 | POS sin candado de stock | Positivo | P1 | Pass |
| TC-F12-010 | Validación 400 cantidad/BOX/tope | Negativo | P1 | Pass |
| TC-F12-012 | 409 ADR-022 producto inhabilitado | Negativo | P1 | Pass |
| TC-F12-011 | Alerta off y fillPercent >100 | Edge | P1 | Pass |
| TC-F12-010b | Body PATCH vacío 400 | Edge | P2 | Pass (incluido en 010) |
| TC-F12-013 | Sin token 401; CLIENT 403 | Seguridad | P1 | Pass |
| TC-F12-014 | IDOR sucursal A↔B | Seguridad | P1 | Pass |
| TC-F12-015 | ADMIN 403 inventario | Seguridad | P1 | Pass |

---

## 1. Casos Positivos (Happy Path)

| ID | Nombre | Prerrequisitos | Resultado esperado | Estado |
|----|--------|----------------|-------------------|--------|
| TC-F12-001 | GET `/api/provider/inventory` | PROVIDER El Paraíso | 200 `{ data[], meta }`, sin `success`, decimales string | Pass |
| TC-F12-002 | Entrada CATALOG | SKU local creado | onHand += quantity | Pass |
| TC-F12-003 | PATCH ficha tope 10, umbral 10 | SKU + entrada 5 | fillPercent ~50 | Pass |
| TC-F12-004 | BOX × factor 10 | factor persistido | onHand += 20 | Pass |
| TC-F12-005 | POS 3 PZA con on-hand 0 | SKU PIEZA | 2xx, onHand negativo, sin 4xx stock | Pass |
| TC-F12-006 | Encargar Q=4 y cancelar | CLIENT + PROVIDER | reserved 4 luego 0; onHand 0 | Pass |
| TC-F12-007 | Encargar DELIVERED | onHand 10, Q=2 | onHand 8, reserved 0 | Pass |
| TC-F12-008 | Panel CAT + público | SKU con tope | panel con fillPercent; `/api/providers*` sin claves stock | Pass |
| TC-F12-009 | PATCH posShowImages A vs B | N≥2 | A OFF persiste; B ON independiente | Pass |
| TC-F12-016 | Venta rápida customItem | PROVIDER | 201, no toca inventario | Pass |
| TC-F12-101 | SubNav D-F12-2 | Login proveedor | Inventario primero; Ventas → dashboard | Pass |
| TC-F12-102 | UI inventario | Login | `/proveedor/inventario` h1; empty/error/success | Pass |
| TC-F12-103 | CAT thumbs + toggle | Login | Switch en `/proveedor`; ausente en POS | Pass |
| TC-F12-104 | Vitrina D-F12-12 | `/fruteria/{id}` | Sin progressbar ni existencias | Pass |
| TC-F12-105 | POS sin candado | `/proveedor/pos` | Sin copy agotado por existencias | Pass |

---

## 2. Casos Negativos (Unhappy Path)

| ID | Nombre | Input inválido | Error esperado | Estado |
|----|--------|----------------|----------------|--------|
| TC-F12-010 | Entrada 0, negativa, BOX sin factor, tope 0, PATCH vacío | payloads Zod | 400 | Pass |
| TC-F12-012 | POS SKU local `isAvailable=false` | cobro inhabilitado | 409 ADR-022, no stock | Pass |

---

## 3. Casos Límite (Edge Cases)

| ID | Nombre | Condición límite | Resultado esperado | Estado |
|----|--------|------------------|-------------------|--------|
| TC-F12-011 | Alerta off + sobre-tope | alertEnabled false; onHand > capacityMax | lowStockAlert false; fillPercent > 100 | Pass |
| TC-F12-016 | Línea libre | customItem | 201 | Pass |

---

## 4. Casos de Seguridad / Permisos

| ID | Nombre | Escenario RBAC | Resultado esperado | Estado |
|----|--------|----------------|-------------------|--------|
| TC-F12-013 | Anónimo y CLIENT | GET inventory | 401 / 403 | Pass |
| TC-F12-014 | Cookie sucursal B + id de A | GET/PATCH/POST cruzado | 403; listado B sin SKU de A | Pass |
| TC-F12-015 | ADMIN | GET inventory | 403 | Pass |

---

## Ambiente y comandos

```text
App: C:\Users\PC GAMER\LaBorregaMarket  (feat/f12-inventario-blando) http://127.0.0.1:8080
Evidencia BE: Agente backend/.../fase-12/quality/EVIDENCIA-BUG-019.md

cwd: QA Automation Engineer/Agente Tester/outputs/laborregamarket/tests
npx playwright test tests/api/f12-inventario.spec.ts tests/e2e/f12-inventario.spec.ts --reporter=list
```

Resultado re-prueba: **21 passed** (API 16 + E2E 5).

---

## Referencias upstream

- US fase-12 PM, contratos Arch, MOD-INVENTORY/POS/ORDERS, FEAT-INV/CAT-12/POS-12
- Evidencia BUG-019 Backend

## Notas

- Inhabilitar SKU local Must: `PATCH /api/provider/local-products/{id}` `{ isAvailable: false }` (alineado TC-CAT-021), no el PATCH catálogo global sin cookie.
- TC-F12-009 resetea A/B a `posShowImages: true` para ser idempotente entre corridas.
- Won't: BOM, kardex, Cloudinary, BL-040, bloquear ventas.
- BUG-017/018 F11 no reabiertos.

## Inputs Utilizados

- Evidencia BE BUG-019, matriz previa F12, contratos Arch

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-12/test-matrices/TC-F12-matrix.md`
- **Agente Downstream:** PM (sign-off)
