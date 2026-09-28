# Fase 6 — Deuda + reportes (Backend)

> **Producto:** LaBorregaMarket v0.6.1  
> **Fecha:** 16/08/2026  
> **Estado:** Must implementado — listo para Quality Gate

Código: `C:\Users\PC GAMER\LaBorregaMarket`. Contratos: Arquitecto `fase-6/`.

Slice A: `@upstash/redis` ya en lockfile; tests 503/429; script `db:migrate:deploy` (F2→F5, sin schema nuevo).  
Slice B: `GET /api/provider/reports` + `GET /api/provider/reports.pdf` (pdfkit). Dashboard rolling F3 sin delta.  
Slice C GEO: cero BE.

Handoff FE: [`handoff-frontend.md`](./handoff-frontend.md). QR: [`quality/QR-BE.md`](./quality/QR-BE.md).
