# Matriz de Casos de Prueba: TC-F14-matrix

> **Proyecto:** laborregamarket  
> **Módulo / Feature:** F14 — panel PROVIDER (perfil, catálogo, merma/ajuste, reportes)  
> **Historia de Usuario / Contrato:** US-PROF-01…05, US-CAT-21…23, US-INV-08…10, US-DASH-14…16 · API-*-14  
> **Fecha:** 2026-09-17  
> **Ambiente:** `http://127.0.0.1:8080` · rama `feat/f14-panel-proveedor` (`9f5b875` sobre `92cced6`)

---

## Resumen de ejecución

| Métrica | Valor |
|---------|-------|
| Total de casos | 41 |
| Happy path ejecutados | 17/17 (objetivo: 100%) |
| Negativos / edge ejecutados | 19/19 (objetivo: ≥ 85%) |
| Seguridad ejecutados | 5/5 |
| Pass | 41 |
| Fail | 0 |
| Blocked | 0 |

---

## Tabla resumen

| ID | Nombre | Tipo | Prioridad | Estado |
|----|--------|------|-----------|--------|
| TC-F14-001 | GET me identidad + isVerified | Positivo | P1 | Pass |
| TC-F14-002 | PATCH datos sin reset isVerified | Positivo | P1 | Pass |
| TC-F14-003 | PATCH openingHours válido | Positivo | P1 | Pass |
| TC-F14-004 | PATCH capacidades y prep | Positivo | P1 | Pass |
| TC-F14-005 | PATCH posShowImages | Positivo | P1 | Pass |
| TC-F14-006 | Activar GLOBAL precio > 0 (nunca $50) | Positivo | P1 | Pass |
| TC-F14-007 | DELETE sección vacía | Positivo | P1 | Pass |
| TC-F14-008 | Merma happy path 201 | Positivo | P1 | Pass |
| TC-F14-009 | Ajuste conteo mayor | Positivo | P1 | Pass |
| TC-F14-010 | Movimientos ENTRADA+MERMA+AJUSTE sin POS | Positivo | P1 | Pass |
| TC-F14-011 | Global N>1 series/products/bySource | Positivo | P1 | Pass |
| TC-F14-012 | PDF from/to application/pdf | Positivo | P1 | Pass |
| TC-F14-020 | Geo fuera AMM → 400 | Negativo | P1 | Pass |
| TC-F14-021 | Horario open ≥ close → 400 | Negativo | P1 | Pass |
| TC-F14-022 | Google lock si no isVerified → 403 | Negativo | P1 | Pass |
| TC-F14-023 | Place ID inválido → 400 | Negativo | P2 | Pass |
| TC-F14-024 | Body isVerified → 400 | Negativo | P1 | Pass |
| TC-F14-025 | Activar GLOBAL sin precio → 400 | Negativo | P1 | Pass |
| TC-F14-026 | DELETE sección con productos → 409 | Negativo | P1 | Pass |
| TC-F14-027 | Merma on_hand < 0 → 400 | Negativo | P1 | Pass |
| TC-F14-028 | Ajuste conteo negativo → 400 | Negativo | P1 | Pass |
| TC-F14-029 | Movements from > to → 400 | Negativo | P1 | Pass |
| TC-F14-030 | PDF from > to → 400 | Negativo | P1 | Pass |
| TC-F14-031 | Merma quantity ≤ 0 → 400 | Negativo | P1 | Pass |
| TC-F14-040 | Ajuste conteo 0 válido | Edge Case | P1 | Pass |
| TC-F14-041 | Merma con onHand 0 → 400 | Edge Case | P1 | Pass |
| TC-F14-042 | Movements empty 200 [] | Edge Case | P2 | Pass |
| TC-F14-043 | PATCH parcial no resetea omitidos | Edge Case | P1 | Pass |
| TC-F14-044 | prep time fuera de rango → 400 | Edge Case | P2 | Pass |
| TC-F14-045 | Merma oferta archivada → 409 | Edge Case | P1 | Pass |
| TC-F14-060 | Sin token 401 | Seguridad | P1 | Pass |
| TC-F14-061 | CLIENT 403 | Seguridad | P1 | Pass |
| TC-F14-062 | IDOR merma SKU ajeno → 403 | Seguridad | P1 | Pass |
| TC-F14-063 | IDOR PATCH me providerId ajeno | Seguridad | P1 | Pass |
| TC-F14-064 | N=1 global 403 GLOBAL_REPORTS_NOT_AVAILABLE | Seguridad | P1 | Pass |
| TC-F14-101 | UI Perfil + GET me único + Catálogo sin identidad | Positivo | P1 | Pass |
| TC-F14-102 | posShowImages en POS | Positivo | P1 | Pass |
| TC-F14-103 | UI merma/ajuste/movimientos sin ventas | Positivo | P1 | Pass |
| TC-F14-104 | Series + PDF visible + sin grain | Positivo | P1 | Pass |
| TC-F14-105 | N=1 redirect reportes sucursal | Positivo | P1 | Pass |
| TC-F14-106 | Copy 409 sección con productos | Negativo | P1 | Pass |

---

## 1. Casos Positivos (Happy Path)

| ID | Nombre | Prerrequisitos | Resultado esperado | Estado |
|----|--------|----------------|-------------------|--------|
| TC-F14-001 | GET me | PROVIDER El Paraíso | 200, identidad, isVerified, posShowImages | Pass |
| TC-F14-002 | PATCH datos | Seed verificado | 200; isVerified intacto | Pass |
| TC-F14-003 | Horarios | openingHoursSchema | 200 | Pass |
| TC-F14-004 | Capacidades | PATCH me | offersWholesale + prep 15 | Pass |
| TC-F14-005 | posShowImages | Sucursal activa | Boolean persiste | Pass |
| TC-F14-006 | Precio > 0 | GLOBAL admin nuevo | Precio 27.5, no 50 | Pass |
| TC-F14-007 | Sección vacía | POST sección | DELETE 2xx | Pass |
| TC-F14-008 | Merma | onHand 10 | 201 MERMA saldo 5 | Pass |
| TC-F14-009 | Ajuste alza | onHand 8 → 12 | 201 delta +4 | Pass |
| TC-F14-010 | Listado | Entrada+merma+ajuste+POS | Solo ENTRADA/MERMA/AJUSTE | Pass |
| TC-F14-011 | Global N>1 | from/to mes | series, products, bySource | Pass |
| TC-F14-012 | PDF rango | from/to | application/pdf %PDF | Pass |
| TC-F14-101 | Perfil UI | Login redirect perfil | 5 bloques; GET me ≤2; Catálogo sin identidad | Pass |
| TC-F14-102 | Toggle POS | Login proveedor | Switch en `/proveedor/pos` | Pass |
| TC-F14-103 | Inventario UI | Login | Merma, ajuste, copy sin ventas | Pass |
| TC-F14-104 | Ventas UI | Login N>1 | PDF visible; 0 grain; details tabla | Pass |
| TC-F14-105 | N=1 redirect | Campo Verde | dashboard?view=reportes | Pass |

---

## 2. Casos Negativos (Unhappy Path)

| ID | Nombre | Input inválido | Error esperado | Estado |
|----|--------|----------------|----------------|--------|
| TC-F14-020 | Geo AMM | lat 19.43 / lng -99.13 | 400; pin no cambia | Pass |
| TC-F14-021 | Horario | open 18 close 08 | 400 | Pass |
| TC-F14-022 | Google lock | PROVIDER no verificado | 403 verificación | Pass |
| TC-F14-023 | Place ID | `bad` | 400 | Pass |
| TC-F14-024 | isVerified body | `{ isVerified: !actual }` | 400; flag igual | Pass |
| TC-F14-025 | Sin precio | isAvailable true, price 0/ausente | 400; no $50 | Pass |
| TC-F14-026 | Sección llena | DELETE con SKU | 409 copy productos | Pass |
| TC-F14-027 | Merma overflow | 4 sobre 3 | 400 `INVENTORY_NEGATIVE_NOT_ALLOWED` | Pass |
| TC-F14-028 | Conteo < 0 | countedOnHand -1 | 400 | Pass |
| TC-F14-029 | Rango invertido | from > to movimientos | 400 | Pass |
| TC-F14-030 | PDF invertido | from > to | 400 JSON, no PDF | Pass |
| TC-F14-031 | Merma 0 | quantity 0 | 400 | Pass |
| TC-F14-106 | UI sección | botón deshabilitado + title | Copy «Mueve los productos…» | Pass |

---

## 3. Casos Límite (Edge Cases)

| ID | Nombre | Condición límite | Resultado esperado | Estado |
|----|--------|------------------|-------------------|--------|
| TC-F14-040 | Conteo 0 | countedOnHand 0 | 201 saldo 0 | Pass |
| TC-F14-041 | onHand 0 | merma > 0 | 400 | Pass |
| TC-F14-042 | Empty list | negocio nuevo | 200 data [] | Pass |
| TC-F14-043 | PATCH parcial | solo description | nombre/teléfono intactos | Pass |
| TC-F14-044 | Prep 121 | minutes 121 | 400 | Pass |
| TC-F14-045 | Archivado | merma post-archive | 409 | Pass |

---

## 4. Casos de Seguridad / Permisos

| ID | Nombre | Escenario RBAC | Resultado esperado | Estado |
|----|--------|----------------|-------------------|--------|
| TC-F14-060 | Anónimo | me, movements, pdf, shrinkage | 401 | Pass |
| TC-F14-061 | CLIENT | mismos paths | 403 | Pass |
| TC-F14-062 | IDOR SKU | Campo Verde merma SKU Paraíso | 403 | Pass |
| TC-F14-063 | IDOR sucursal | PATCH me `providerId` B | 400/403 | Pass |
| TC-F14-064 | N=1 global | Campo Verde GET global | 403 `GLOBAL_REPORTS_NOT_AVAILABLE` | Pass |

---

## Referencias upstream

- ACs: `Administrador de producto/Product Manager/outputs/laborregamarket/fase-14/user-stories/`
- Contratos: `Agente Arquitecto/.../fase-14/api/API-*-14.md`
- Handoff Backend: `MOD-PROVIDER-SETTINGS-F14`, `MOD-INVENTORY-F14`, `MOD-OFFER-SECTIONS-F14`, `MOD-REPORTS-F14`
- Handoff Frontend: `FEAT-PROF-14`, `FEAT-CAT-14`, `FEAT-INV-14`, `FEAT-DASH-14`

## Inputs Utilizados

- US Must F14, contratos API-*-14, handoff-frontend BE, FEAT-*-14, seed `frutas@elparaiso.mx` / `verduras@campoverde.mx`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/test-matrices/TC-F14-matrix.md`
- **Agente Downstream:** PM (sign-off APROBADO); UX + Arquitecto (`QG-correcciones.md`)

## Notas

- Won't no cubierto a propósito: kardex POS, Explorar rediseño, Cloudinary, BL-040, US-ADMIN-04.
- Migración `20260918010000_f14_inventory_entry_kind` aplicada. Primera corrida merma/ajuste 500 por Prisma client bloqueado por `next dev`; tras reinicio **35/35 API** y **6/6 E2E**.
- Suite viva: `tests/api/f14-panel.spec.ts`, `tests/e2e/f14-panel.spec.ts`. `TC-F12-103` actualizado (toggle fotos vive en POS).
- GET me en next dev: 1–2 (Strict Mode). Login directo a `/proveedor/perfil` para no contar el GET de Catálogo.
- Sin staging remoto.
