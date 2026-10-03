# Fase 8 — Explorar polish (Backend)

> **Producto:** LaBorregaMarket v0.8.3  
> **Fecha:** 24/08/2026  
> **Estado:** Must clamp + Should MX implementado — listo para Quality Gate

Código: `C:\Users\PC GAMER\LaBorregaMarket`. Contratos: Arquitecto `fase-8/`.

1. `clampGeoRadiusKm` **0.5–10** decimal, sin `Math.round`; `meta.radiusKm` = aplicado  
2. `GET /api/providers`: 400 AMM **revocado**; CDMX 200; `isInMexico` Should  
3. POST/PATCH favoritas: `lat`/`lng` → `isInMexico` (Must); sin ruta nueva  
4. Preview `GET /api/providers/[id]` **sin cambio**

Handoff FE: [`handoff-frontend.md`](./handoff-frontend.md). QR: [`quality/QR-BE.md`](./quality/QR-BE.md).
