# API-POS-01 — Ventas de mostrador

> **Fase:** 3 · **US:** US-POS-01…04 · **Fuente:** FEAT-POS + UF-POS-01 + REVIEW-ARCH

| Método | Ruta | Rol | Notas |
|--------|------|-----|-------|
| GET | `/api/provider/products` | PROVIDER | Catálogo propio; FE filtra `isAvailable`. |
| POST | `/api/provider/pos/sales` | PROVIDER | `Idempotency-Key`. Items XOR: catálogo **o** `customItem`/`itemName` (ADR-013). `paymentMethod` + `paidAt` (ADR-011). Default status `DELIVERED` o `CONFIRMED` si “recoger más tarde”. `clientId` nullable + `customerName` (ADR-009). `source=POS` (ADR-010). |

`DELIVERED` + `UNPAID` → 400. Decimal(10,3) + UoM (ADR-014). Sin email.
