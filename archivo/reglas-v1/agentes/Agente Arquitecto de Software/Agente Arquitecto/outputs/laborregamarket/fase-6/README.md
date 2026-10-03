# Fase 6 — Confiabilidad + reportes + GEO zoom↔radio

> **Producto:** LaBorregaMarket v0.6.1  
> **Fecha diseño:** 16/08/2026  
> **Estado:** Contratos cerrados · listo para implementar (tres slices)

**No es pasarela.** Pagos/CFDI siguen Won't (`CO-F6-001`). No emitir READY-FOR-QA de checkout con DEV-P0-001 o DEV-P0-002 abiertos.

## Tres slices

| Slice | Handoff / contrato | Implementa |
|-------|--------------------|------------|
| **A — Deuda** | [`handoff-backend-fase-6.md`](./handoff-backend-fase-6.md) | Backend, DevOps, FE (UX ya entregó) |
| **B — Reportes** | [`handoff-backend-fase-6-reportes.md`](./handoff-backend-fase-6-reportes.md) | Backend + FE |
| **C — GEO** | [`api/API-GEO-01.md`](./api/API-GEO-01.md) | Frontend; **cero BE** |

## Alcance Backend

| ID | Entregable |
|----|------------|
| DEV-P0-001 | `@upstash/redis` en lockfile |
| DEV-P1-003 | `migrate deploy` F2→F5 |
| DEV-P1-005 | 503 fail-closed contacto en prod |
| DEV-P2-011 | `requireRole` + test RBAC en rutas nuevas (reports inclusive) |
| US-DASH-04 | `GET /api/provider/reports` |
| US-DASH-06 | `GET /api/provider/reports.pdf` |

CI (DEV-P0-002), secretos y JWT por entorno: DevOps. Print CSS (`US-DASH-05`) y loader borrega (`US-GEO-08`): Frontend. Checklist Maps F4: ya alineado (DEV-P1-006).

## Contratos API

| ID | Archivo |
|----|---------|
| API-PROVIDER-REPORTS-01 | [`api/API-PROVIDER-REPORTS-01.md`](./api/API-PROVIDER-REPORTS-01.md) |
| API-PROVIDER-REPORTS-PDF-01 | [`api/API-PROVIDER-REPORTS-PDF-01.md`](./api/API-PROVIDER-REPORTS-PDF-01.md) |
| API-GEO-01 (nota F6) | [`api/API-GEO-01.md`](./api/API-GEO-01.md) |

## ADRs (vivos en `comun/adrs/`)

Índice: [`adrs/README.md`](./adrs/README.md). 023 PDF · 024 ventanas calendario · 020 append zoom↔radio. No reabrir ADR-015.

## Diagramas

| ID | Archivo |
|----|---------|
| ARCH-REPORTS-01 | [`diagrams/ARCH-REPORTS-01.md`](./diagrams/ARCH-REPORTS-01.md) |
| ARCH-GEO-03 | [`diagrams/ARCH-GEO-03.md`](./diagrams/ARCH-GEO-03.md) |

Sin `data-model/`: cero migración de producto.

## Docs vivos

- SAD: [`../comun/sad.md`](../comun/sad.md)
- Infra: [`../comun/infra-requirements.md`](../comun/infra-requirements.md)

## Quality

No emitir `quality/REVIEW-ARCH.md` ni `READY-FOR-QA.md` hasta cierre Backend.

## Fuera de alcance

Pasarela, CFDI, `/health`, CI YAML, Leaflet nuevo, copy 500/503 (ya en slice A UX), bbox Must, clustering, CSV, email del reporte, ticket térmico.
