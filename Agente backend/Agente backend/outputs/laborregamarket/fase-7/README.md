# Fase 7 — Explorar + sesión cookie (Backend)

> **Producto:** LaBorregaMarket v0.7.1  
> **Fecha:** 18/08/2026  
> **Estado:** Must implementado — listo para Quality Gate

Código: `C:\Users\PC GAMER\LaBorregaMarket`. Contratos: Arquitecto `fase-7/`.

1. `UserAddress.lastUsedAt` + `POST /api/users/me/addresses/[id]/use`  
2. Preview vitrina (horario, flags, `verifiedAt`, `isOpenNow`)  
3. GEO: clamp `radiusKm` 1–25; `meta.total` del predicado; `q` nombre ∪ producto vendible  
4. Cookie JWT ADR-025 (sin path nuevo)

Handoff FE: [`handoff-frontend.md`](./handoff-frontend.md). QR: [`quality/QR-BE.md`](./quality/QR-BE.md).
