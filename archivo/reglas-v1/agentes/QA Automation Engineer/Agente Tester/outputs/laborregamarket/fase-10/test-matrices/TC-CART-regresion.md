# Matriz de Casos de Prueba: TC-CART-regresion

> **Proyecto:** laborregamarket  
> **Módulo / Feature:** Encargar / carrito + POS (regresión; cobertura [DT-F10-001](../deuda-tecnica/DT-F10-001-uuid-contexto-inseguro.md))  
> **Historia / Contrato:** `HP-ORDERS-01` (F3, solo lectura) · `API-ORDERS-01` (no se invoca si el cliente crashea)  
> **Fecha:** 2026-08-31 (nota DT 12/09)  
> **Ambiente:** `http://127.0.0.1:8080`  
> **Bug:** [BUG-015](../bug-reports/BUG-015.md) **Diferido** → [DT-F10-001](../deuda-tecnica/DT-F10-001-uuid-contexto-inseguro.md)

No edita matrices de `fase-3/` ni `fase-4/`. IDs nuevos en F10.

---

## Inputs Utilizados

- **BUG-015:** `fase-10/bug-reports/BUG-015.md`
- **Código:** `CartPageClient.tsx` L50 · `PosPageClient.tsx` L54/L154/L227
- **Spec:** `tests/e2e/cart-uuid.spec.ts`

---

## Resumen de ejecución

| Métrica | Valor |
|---------|-------|
| Total de casos | 3 |
| Happy path ejecutados | 2/2 diseñados (HP-CART-015 reporte Fail; HP-POS-015 stub Fail) |
| Negativos / edge ejecutados | 1/1 (EC-CART-015) |
| Seguridad ejecutados | N/A |
| Pass | 0 |
| Fail | 3 |
| Blocked | 0 |

---

## Tabla resumen

| ID | Nombre | Tipo | Prioridad | Estado |
|----|--------|------|-----------|--------|
| HP-CART-015 | Frutería → Ver carrito → chrome Encargar | Positivo | P1 | Fail |
| EC-CART-015 | `/carrito` sin `crypto.randomUUID` | Edge Case | P1 | Fail |
| HP-POS-015 | POS sin `crypto.randomUUID` | Positivo | P1 | Fail |

---

## 1. Casos Positivos (Happy Path)

| ID | Nombre | Prerrequisitos | Resultado esperado | Estado |
|----|--------|----------------|-------------------|--------|
| HP-CART-015 | Ver carrito con ítems | Seed frutería + cantidades > 0 | `/carrito` con líneas y «Confirmar pedido»; cero `global-error` | Fail |
| HP-POS-015 | Abrir POS | Sesión PROVIDER; stub `randomUUID` undefined | `/proveedor/pos` chrome mostrador; cero `global-error` | Fail |

**HP-CART-015 detalle:** reporte stakeholder 31/08 — «Algo salió mal.» / `crypto.randomUUID is not a function`. Chromium Playwright + `127.0.0.1` puede **no** reproducir (secure context). El spec cubre el fallo con stub (`EC-CART-015`). TCs históricos afectados (no reabrir F3): `HP-ORDERS-01`, `EC-08`.

**HP-POS-015 detalle:** misma causa en `PosPageClient`. Spec `cart-uuid.spec.ts`.

---

## 2. Casos Negativos (Unhappy Path)

Ninguno adicional: el TypeError no es un error de negocio (400/validación); es un crash de runtime.

---

## 3. Casos Límite (Edge Cases)

| ID | Nombre | Condición límite | Resultado esperado | Estado |
|----|--------|------------------|-------------------|--------|
| EC-CART-015 | `crypto.randomUUID` ausente | `addInitScript` deja `randomUUID` undefined | Sigue el chrome de carrito; helper UUID de fallback | Fail |

---

## 4. Casos de Seguridad / Permisos

No aplica (crash previo a `POST /api/orders`). RBAC de órdenes permanece en `orders.spec.ts`.

---

## Referencias upstream

- ACs Encargar: `US-ORDERS-*` F3 (matrices F3 solo lectura)
- Contrato API: `API-ORDERS-01` (no alcanzado)
- Handoff Frontend: `fase-10/QA-F10-handoff-frontend.md`

---

## Notas

- Auto: `tests/e2e/cart-uuid.spec.ts`. **Cobertura DT-F10-001:** puede **Fail** (stub `randomUUID` / Explorar). **No bloquea** el dictamen F10 ni el merge.
- En Chrome + `http://127.0.0.1` Encargar es usable (secure context). El Fail del spec cubre LAN / contexto inseguro.
- Tras el fix de DT-F10-001: marcar Pass y entonces sí Verificar BUG-015.
