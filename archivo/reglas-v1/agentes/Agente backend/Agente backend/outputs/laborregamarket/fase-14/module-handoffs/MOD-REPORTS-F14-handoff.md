# Handoff de Módulo: MOD-REPORTS-F14

> **Proyecto:** laborregamarket  
> **Módulo:** Reportes PDF from/to + global N=1  
> **Stack:** Next.js App Router + pdfkit + Zod  
> **Fecha:** 2026-09-17  
> **Contrato de referencia:** API-PROVIDER-REPORTS-14, ADR-033, ADR-041

## Inputs Utilizados

- Handoff Arquitecto `fase-14/handoff-backend-fase-14.md`
- ADR-041 (BE no toca shape de series), ADR-033, ADR-023

## 1. Endpoints implementados

| Método | Ruta | Auth | Contrato | Estado |
|--------|------|------|----------|--------|
| GET | `/api/provider/reports.pdf` | PROVIDER + sucursal | API-PROVIDER-REPORTS-14 | OK `parseReportsRequest` XOR |
| GET | `/api/provider/reports/global` | PROVIDER | API-PROVIDER-REPORTS-14 | OK N=1 403 (sin delta) |
| GET | `/api/provider/reports` | PROVIDER | intacto | OK |

## 2. Validación

- [x] PDF usa `parseReportsRequest`: `from`/`to` XOR `grain`/`date`
- [x] Mezcla → 400; futuro / span > 366 / `from > to` → 400
- [x] Filename rango: `reporte-{slug}-{from}_{to}.pdf`
- [x] Filename grain F6 conservado
- [x] N=1 global → 403 `{ error: { code: "GLOBAL_REPORTS_NOT_AVAILABLE", message: "..." }, timestamp }`
- [x] Sin librería de charts; series JSON intactas

## 3. Base de datos

Sin cambio. `pdfkit` ya en lockfile. Sin env nueva.

## 4. Seguridad

Solo sucursal activa. `productIds` ajeno → 403 (JSON rango vigente). CLIENT/ADMIN → 403.

## 5. Pruebas

PDF rango: `tests/integration/reports.routes.test.ts`, `tests/unit/report-pdf.test.ts`. N=1: `tests/integration/provider-f11.routes.test.ts`.

## 6. DoD Backend

- [x] Validación completa
- [x] Tests en verde

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/module-handoffs/MOD-REPORTS-F14-handoff.md`
- **Agente Downstream:** Frontend, QA
