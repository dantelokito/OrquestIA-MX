# Matriz de Casos de Prueba: TC-AUTH-matrix (F7)

> **Proyecto:** laborregamarket  
> **Módulo / Feature:** Sesión portable cross-device  
> **Historia / Contrato:** US-AUTH-09, API-AUTH-01, ADR-025  
> **Fecha:** 2026-08-23  
> **Ambiente:** `http://localhost:8080`

---

## Resumen de ejecución

| Métrica | Valor |
|---------|-------|
| Total de casos | 5 |
| Happy path ejecutados | 3/3 auto |
| Negativos / edge ejecutados | 1/2 manual |
| Pass / Fail / Blocked | 4 / 0 / 0 (EC-AUTH-09 parcial) |

---

## Tabla resumen

| ID | Nombre | Tipo | Prioridad | Auto | Estado |
|----|--------|------|-----------|------|--------|
| HP-AUTH-09 | Login API + session authenticated | Positivo | P1 | api/auth.spec.ts | Pass |
| HP-AUTH-09b | Cookies en segundo request context | Positivo | P1 | api/auth.spec.ts | Pass |
| HP-AUTH-09 UI | Login E2E por rol | Positivo | P1 | e2e/auth-login.spec.ts | Pass |
| EC-AUTH-09 | Cookies bloqueadas → SessionPersistBanner | Edge | P1 | manual | Parcial |
| TC-SESS-F7 | Cookie flags prod (QR-BE) | Doc | P2 | manual/revisión | Pass |
