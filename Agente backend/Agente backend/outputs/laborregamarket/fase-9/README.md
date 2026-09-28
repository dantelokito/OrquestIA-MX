# Fase 9 — Deuda Explorar (Backend)

> **Producto:** LaBorregaMarket v0.9.0  
> **Fecha:** 25/08/2026  
> **Estado:** Must listing chips implementado — listo para Quality Gate

Código: `C:\Users\PC GAMER\LaBorregaMarket`. Contratos: Arquitecto `fase-9/`.

1. `GET /api/providers`: query `offersWholesale` / `offersDelivery` (true/1 → filtro; false/0 → ausente; inválido → 400)
2. `buildWhere` AND con geo / `q` / `verified` / `category` / `isActive`
3. Cards serializan `offersWholesale` / `offersDelivery`
4. Typeahead: **cero ruta nueva** — mismo GET con `q`+geo+`limit=10`

Handoff FE: [`handoff-frontend.md`](./handoff-frontend.md). QR: [`quality/QR-BE.md`](./quality/QR-BE.md).
