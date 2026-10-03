# API-ORDERS-01 — Pedidos marketplace (pickup)

> **Fase:** 3 · **US:** US-ORDERS-01…04 · **Fuente:** FEAT-ORDERS + UF-ORDERS-01 + REVIEW-ARCH (código 13/08/2026)

El archivo de diseño original no estaba en disco; este contrato documenta lo **ya implementado y auditado**.

| Método | Ruta | Rol | Notas |
|--------|------|-----|-------|
| POST | `/api/orders` | CLIENT | Body `{ providerId, items[{ productId, quantity, unit }], notes? }`. Header `Idempotency-Key` UUID. Replay → 200. Estado inicial `PENDING`. `source=MARKETPLACE`. |
| GET | `/api/orders` | CLIENT | Historial del dueño, paginado (ADR-004). |
| GET | `/api/orders/[id]` | CLIENT dueño | Detalle. |
| PATCH | `/api/orders/[id]` | CLIENT | `{ status: CANCELLED }` solo si PENDING; si no 409. |

Envelope ADR-003. Sin `customItem`. Email nuevo pedido en `after()`. RBAC: PROVIDER no crea marketplace (TC-ORD-007).
