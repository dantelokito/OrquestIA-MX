# Matriz de Casos de Prueba: TC-ADDRESSES-matrix (F8)

> **Proyecto:** laborregamarket  
> **Módulo / Feature:** Favoritas — delta `isInMexico` (sin endpoint nuevo)  
> **Historia / Contrato:** US-GEO-17 … 19, API-ADDRESSES-01 F8, ADR-028  
> **Fecha:** 2026-08-24  
> **Ambiente:** `http://localhost:8080`

---

## Resumen de ejecución

| Métrica | Valor |
|---------|-------|
| Total de casos | 5 |
| Happy path | 2 |
| Negativos / seguridad | 3 |
| Pass / Fail / Blocked / Pendiente | 5 / 0 / 0 / 0 |

CRUD F4/F7 (`/use`, tope 20, DELETE envelope) **sigue vigente**. Este archivo solo el delta geo + RBAC de humo.

---

## Tabla resumen

| ID | Nombre | Tipo | Prioridad | Auto | Estado |
|----|--------|------|-----------|------|--------|
| TC-ADD-008-F8 | POST coords CDMX → 201 | Positivo | P1 | api/addresses.spec.ts | Pass |
| TC-ADD-008b | POST 33.0,-99.0 → 400 | Negativo | P1 | api/addresses.spec.ts | Pass |
| TC-ADD-F7-001 | POST /use actualiza lastUsedAt | Positivo | P1 | api/addresses.spec.ts | Pass |
| TC-ADD-005 | POST sin sesión → 401 | Seguridad | P1 | api/addresses.spec.ts | Pass |
| TC-ADD-006 | GET PROVIDER → 403 | Seguridad | P1 | api/addresses.spec.ts | Pass |

---

## 1. Casos Positivos (Happy Path)

| ID | Nombre | Prerrequisitos | Resultado esperado | Estado |
|----|--------|----------------|-------------------|--------|
| TC-ADD-008-F8 | CDMX válida | CLIENT registrado | POST `{ lat: 19.43, lng: -99.13 }` → **201** (bbox AMM revocado) | [ ] |
| TC-ADD-F7-001 | /use | Dirección propia | 200; `lastUsedAt` presente; lista ordena last-used primero | [ ] |

## 2. Casos Negativos (Unhappy Path)

| ID | Nombre | Input inválido | Error esperado | Estado |
|----|--------|----------------|----------------|--------|
| TC-ADD-008b | Fuera de México | `33.0, -99.0` | **400** envelope; `details` en lat/lng; «Ubicación fuera de México». No usar Laredo | [ ] |

## 3. Casos Límite (Edge Cases)

Tope 20 y `label` 1–40: paridad F4 (no re-diseñar). DELETE de la activa: comportamiento **FE** (pin permanece) — ver HP-GEO-18b en TC-GEO.

## 4. Casos de Seguridad / Permisos

| ID | Nombre | Escenario RBAC | Resultado esperado | Estado |
|----|--------|----------------|-------------------|--------|
| TC-ADD-005 | Sin cookie | POST /addresses | 401 | [ ] |
| TC-ADD-006 | PROVIDER | GET /addresses | 403 | [ ] |

---

## Referencias upstream

- Contrato: Arquitecto `fase-8/api/API-ADDRESSES-01.md`
- Handoff BE: `MOD-ADDRESSES-handoff.md`
- UX: DELETE pin permanece (`D-F8-UX-6`); revoca rehidratación SN de F7
