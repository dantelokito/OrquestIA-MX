# Matriz de Casos de Prueba: TC-EXPLORE-matrix (F7)

> **Proyecto:** laborregamarket  
> **Módulo / Feature:** Preview vitrina + búsqueda producto  
> **Historia / Contrato:** US-EXPLORE-05, US-EXPLORE-06, API-PROVIDER-PREVIEW-01  
> **Fecha:** 2026-08-23  
> **Ambiente:** `http://localhost:8080`

---

## Resumen de ejecución

| Métrica | Valor |
|---------|-------|
| Total de casos | 6 |
| Happy path ejecutados | 5/5 |
| Negativos / edge ejecutados | 1/1 |
| Pass / Fail / Blocked | 5 / 0 / 0 (EC-EXPLORE-02 opcional omitido) |

---

## Tabla resumen

| ID | Nombre | Tipo | Prioridad | Auto | Estado |
|----|--------|------|-----------|------|--------|
| HP-EXPLORE-05 | Vista rápida → dialog + Ver frutería | Positivo | P1 | e2e/explore-f7.spec.ts | Pass |
| HP-EXPLORE-05b | API detalle campos preview F7 | Positivo | P1 | api/providers.spec.ts | Pass |
| HP-EXPLORE-06 | UI búsqueda mango (producto) | Positivo | P1 | e2e/explore-f7.spec.ts | Pass |
| HP-EXPLORE-06b | q nombre comercial Paraíso | Positivo | P1 | e2e/explore.spec.ts | Pass |
| EC-EXPLORE-01 | 500 providers → ErrorBanner, no borrega | Edge | P1 | e2e/explore-f7.spec.ts | Pass |
| EC-EXPLORE-02 | 404 preview cierra sheet | Edge | P2 | opcional | Omitido |
