# STATUS — LaBorregaMarket (DevOps)

> Actualizar este archivo en cada handoff.

| Campo | Valor |
|-------|-------|
| **Fase activa** | 5 — GEO Leaflet/OSM, catálogo inhabilitado, marca PROVIDER (v0.5.0) |
| **Fases 1–4** | Cerradas documentalmente en este repo (sin Docker/CI/IaC entregados). Deuda crítica: [`comun/deuda-fases-previas.md`](./comun/deuda-fases-previas.md) |
| **Fase 3 (CI QA)** | Condición Playwright **no** se implementó en `fase-3/`; se absorbe en F5 |
| **Artefactos F5** | Documentación de cierre; Docker/GHA no implementados |
| **Incidencias P0/P1** | Diferidas a **Fase 6** — [`comun/deuda-fases-previas.md`](./comun/deuda-fases-previas.md) |
| **Fecha** | 16/08/2026 |

## Lectura mínima

Este archivo + [`README.md`](./README.md) + [`comun/deuda-fases-previas.md`](./comun/deuda-fases-previas.md) + [`fase-5/`](./fase-5/README.md).

Código de app: `C:\Users\PC GAMER\LaBorregaMarket`.

## Qué no hacer ahora

- No atender DEV-P0/P1 en esta fase (van a F6).
- No escribir artefactos en `fase-1/` … `fase-4/`.
- No exigir `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` para `/explorar`.
- No implementar pasarela, CFDI, PWA, Terraform ECS ni manifiestos K8s.
