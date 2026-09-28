# REVIEW-ARCH — Quality Gate Backend Fase 3

> **De:** Agente Arquitecto de Software  
> **Para:** @Backend Developer (devolución) · Frontend autorizado a seguir contra contratos  
> **Producto:** LaBorregaMarket v0.3.0  
> **Fecha:** 13/08/2026  
> **Código:** `C:\Users\PC GAMER\LaBorregaMarket`  
> **Veredicto:** **APROBADO CON OBSERVACIONES**  
> **Puntaje:** 90 / 100 · **0 P0** · P1 operacional

No se copia el auto-score de QR-BE. No se emite `READY-FOR-QA.md` (no existe `REVIEW-UX.md` ≥80%).

---

## Alcance auditado

Rutas F3, schema `Order`/`OrderItem`, `lib/money.ts`, servicios `order` / `pos` / `dashboard`, validadores Zod, email `after()` (contacto + nuevo pedido), tests Vitest.

Contrato de referencia: ADRs 009–014 y APIs ORDERS/POS/PROVIDER-ORDERS/DASH (diseño F3 13/08). El árbol documental `fase-3/` del Arquitecto y el QR-BE del Backend **no están en disco**; la auditoría es contra **código**.

---

## Rúbrica (10 × 10)

| # | Criterio | Pts | Nota |
|---|----------|-----|------|
| 1 | Schema vs ADR-009–014 | 10 | Una migración, CHECK XOR, índices, unique idempotencia |
| 2 | Contratos HTTP | 10 | Cuatro módulos en rutas pactadas |
| 3 | Envelope ADR-003 | 10 | `ok` / `paginated` / 400–409 |
| 4 | RBAC / ownership | 10 | CLIENT propio; PROVIDER `userId`; ADMIN |
| 5 | Validación Zod | 10 | XOR POS; marketplace rechaza `customItem` |
| 6 | Decimal ROUND_HALF_UP | 10 | `Prisma.Decimal`; JSON `"85.50"` / `"1.250"` |
| 7 | AUDIT ORDERS | 5 | CREATE/UPDATE + `capturedManually`; falta `notificationFailed` si no hay email |
| 8 | Email async | 10 | `after(async () => { await … })`; POS sin email; OBS-F2-003 cerrado |
| 9 | Dashboard ADR-012 | 10 | groupBy/SQL, TZ Monterrey, “Venta rápida”, `bySource` |
| 10 | Pruebas | 5 | Unitarios buenos; integración mockea servicios |
| | **Total** | **90** | Umbral 80% |

---

## Hallazgos

### OBS-F3-020 (P1) — Migración no verificada en runtime

`prisma/migrations/20260813030000_orders_f3_source_pos_uom/` está en el repo. El Backend auto-reportó que la BD local podía no tenerla aplicada. **Acción:** `npx prisma migrate deploy` (o `migrate dev`) en `LaBorregaMarket` y confirmar enums `OrderSource` / `PaymentMethod` / `UnitOfMeasure`.

### OBS-F3-021 (P2) — Integración mockeada

`tests/integration/orders.routes.test.ts` sustituye `order.service` / `pos.service` / `dashboard.service`. No cubre CHECK XOR, unique `(providerId, idempotencyKey)` ni envelope real desde Prisma.

### OBS-F3-022 (P2) — AUDIT email ausente

Si `Provider.user.email` falta, `emailJob` es `null` y no hay `details.notificationFailed`. El CREATE de la orden sí se audita.

### OBS-F3-023 (P2) — Entrega documental incompleta

No hay `Agente backend/.../fase-3/quality/QR-BE.md` ni `handoff-arquitecto-quality-gate.md` en el filesystem actual. Restaurar esos archivos en el repo del Backend.

---

## Cumplimiento (resumen)

| Regla | Resultado |
|-------|-----------|
| `clientId` nullable + `customerName` (ADR-009) | OK |
| `source` MARKETPLACE/POS (ADR-010) | OK · seteado por endpoint |
| `paymentMethod` + `paidAt` (ADR-011) | OK · `DELIVERED`+`UNPAID` → 400 |
| Línea libre FKs null + `itemName` (ADR-013) | OK · no crea ProviderProduct |
| `Decimal(10,3)` + UoM (ADR-014) | OK |
| Idempotency-Key UUID, replay 200 | OK |
| `IN_TRANSIT` = listo para recoger (enum intacto) | OK |
| Sin pasarela / Redis / WebSerial | OK |
| BL-067 ADMIN list | Diferido (Should) — aceptable |

---

## Veredicto

**APROBADO CON OBSERVACIONES.** Frontend puede integrar contra las APIs F3. Backend debe cerrar OBS-F3-020 (migración) y, opcional, 021–023.

**QA Tester:** no contactar. Falta REVIEW-UX y `READY-FOR-QA.md`.

---

*Dictamen Arquitecto — LaBorregaMarket v0.3.0 — 13/08/2026.*
