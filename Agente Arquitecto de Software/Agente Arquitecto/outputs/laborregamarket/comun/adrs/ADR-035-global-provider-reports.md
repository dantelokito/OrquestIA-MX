# ADR-035 — Módulo de reportes globales (todas las sucursales)

> **Estado:** Aprobado  
> **Fecha:** 12/09/2026  
> **Decisores:** Arquitecto de Software  
> **Fase:** 11 — v0.11.0  
> **US:** US-DASH-11  
> **Relacionado:** ADR-033 (rango F10), API-PROVIDER-REPORTS-02 (solo lectura)

---

## 1. Contexto y problema

`GET /api/provider/reports` (F6 grain y F10 `from`/`to`) agrega **un** `providerId` (ahora el activo). F11 pide un **módulo distinto** que sume todas las sucursales del user, visible y autorizado solo si N>1. Reutilizar el mismo path con un query `scope=all` mezclaría contratos y haría que Campo Verde (N=1) “tenga” el módulo a nivel API.

---

## 2. Opciones consideradas

* **A — Path nuevo `GET /api/provider/reports/global`:** contrato propio; 403 si N≤1 o no PROVIDER dueño. Reportes F10 intactos.
* **B — Query `aggregate=all` en el path F10:** un solo handler; riesgo de que FE/QA traten el módulo como pestaña del mismo endpoint; N=1 podría devolver 200 idéntico al F10.
* **C — ADMIN analytics reusado:** viola Won't F10 (ADMIN no ve DASH de un proveedor) y mezcla RBAC.

---

## 3. Decisión

**Opción A.** Path nuevo. Autorización:

| Condición | HTTP |
|-----------|------|
| Sin cookie JWT | 401 |
| Rol ≠ PROVIDER | 403 |
| PROVIDER con N = 0 o N = 1 | **403** (`error.code` = `GLOBAL_REPORTS_NOT_AVAILABLE`) — no 404, no 200 vacío que simule el módulo |
| PROVIDER con N > 1 | 200; agrega **todas** las sucursales del `session.sub`, **sin** filtrar por `activeProviderId` |

Reglas de ventana, TZ America/Monterrey, `status ≠ CANCELLED`, tope 366 días y XOR `from`/`to` vs `grain`/`date`: **iguales a F10/ADR-033**. Print consolidado = Should (FE, sin API Must). Sin CSV, email, CFDI.

Breakdown Must: KPI globales + arreglo `byProvider[]` (un objeto por sucursal).

---

## 4. Consecuencias

- FE oculta nav si `providerCount <= 1` (dato de sesión); el API es la autoridad si alguien llama el path a mano.
- Índices: `Order(providerId, createdAt)` existentes; consulta `providerId IN (ids del user)` — una query, no N+1 por sucursal.
- No se edita `fase-10/api/API-PROVIDER-REPORTS-02.md`.

## Inputs Utilizados

- **US-DASH-11** y PRD F11
- **ADR-033**, contrato F10 reports

## Outputs Generados

- **Archivo:** `comun/adrs/ADR-035-global-provider-reports.md`
- **Contrato:** `fase-11/api/API-PROVIDER-REPORTS-03.md`
