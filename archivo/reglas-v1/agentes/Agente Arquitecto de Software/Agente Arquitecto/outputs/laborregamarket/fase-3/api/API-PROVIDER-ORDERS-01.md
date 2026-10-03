# API-PROVIDER-ORDERS-01 — Órdenes del proveedor

> **Fase:** 3 · **US:** US-OPS-01…03 · **Fuente:** FEAT-ORDERS + UF-OPS-01 + REVIEW-ARCH

| Método | Ruta | Rol | Notas |
|--------|------|-----|-------|
| GET | `/api/provider/orders` | PROVIDER | Activas vs historial (query/tab). Ownership `userId` del Provider. |
| PATCH | `/api/provider/orders/[id]` | PROVIDER | Transición: PENDING→CONFIRMED→IN_TRANSIT→COMPLETED. Inválida → 409. |

Copy UI de `IN_TRANSIT`: "Listo para recoger" (enum intacto). Origin ONLINE/POS.
