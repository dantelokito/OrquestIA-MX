# ADRs Fase 3 (009–014)

Los archivos ADR-009…014 **no estaban en `comun/adrs/`**. Quedan registrados aquí según la auditoría `quality/REVIEW-ARCH.md` (código 13/08/2026). No se reescribe el SAD.

| ADR | Decisión |
|-----|----------|
| 009 | `clientId` nullable + `customerName` (POS walk-in) |
| 010 | `source` MARKETPLACE \| POS, seteado por endpoint |
| 011 | `paymentMethod` + `paidAt`; `DELIVERED`+`UNPAID` → 400 |
| 012 | Dashboard: groupBy/SQL, TZ Monterrey, venta rápida, `bySource` |
| 013 | Línea libre: FKs null + `itemName`; no crea ProviderProduct |
| 014 | `Decimal(10,3)` + `UnitOfMeasure` |

Cuando se extraigan los ADR formales, moverlos a `comun/adrs/` y dejar aquí solo enlaces.
