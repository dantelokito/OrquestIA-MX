# Matriz de Casos de Prueba: TC-ADDRESSES-matrix

> **Proyecto:** laborregamarket  
> **Módulo / Feature:** Direcciones CLIENT  
> **Historia / Contrato:** `US-GEO-03`, `API-ADDRESSES-01`  
> **Fecha:** 2026-08-14  
> **Ambiente:** `http://127.0.0.1:8080`

---

## Resumen de ejecución

| Métrica | Valor |
|---------|-------|
| Total de casos | 10 |
| Happy path | 3/3 |
| Negativos / edge | 4/5 |
| Seguridad | 3/3 |

---

## Tabla resumen

| ID | Nombre | Tipo | Prioridad | Auto |
|----|--------|------|-----------|------|
| TC-ADD-001 | POST favorita → 201 | Positivo | P1 | addresses.spec.ts |
| TC-ADD-002 | GET listado + una isDefault | Positivo | P1 | addresses.spec.ts |
| TC-ADD-003 | PATCH etiqueta | Positivo | P2 | addresses.spec.ts |
| TC-ADD-004 | DELETE propia | Positivo | P2 | addresses.spec.ts |
| TC-ADD-005 | POST invitado → 401 | Seguridad | P1 | addresses.spec.ts |
| TC-ADD-006 | GET PROVIDER → 403 | Seguridad | P1 | addresses.spec.ts |
| TC-ADD-007 | DELETE ajena → 404 | Seguridad | P1 | addresses.spec.ts |
| TC-ADD-008 | coords CDMX → 400 | Negativo | P2 | addresses.spec.ts |
| HP-GEO-03 | Invitado → login redirect | Positivo | P1 | e2e/explore-geo.spec.ts |
| EC-03 | 21ª dirección → 400 | Edge Case | P2 | Manual (límite 20) |

*Matriz Fase 4 — LaBorregaMarket v0.4.0*
