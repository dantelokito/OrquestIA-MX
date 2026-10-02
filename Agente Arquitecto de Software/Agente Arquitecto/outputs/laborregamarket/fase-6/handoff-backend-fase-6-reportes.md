# Handoff Backend Developer — LaBorregaMarket Fase 6 reportes (v0.6.1)

> **De:** Agente Arquitecto de Software  
> **Para:** @Backend Developer  
> **Fecha:** 16/08/2026  
> **Prioridad:** Reportes calendario PROVIDER (JSON + PDF)  
> **No reescribe:** [`handoff-backend-fase-6.md`](./handoff-backend-fase-6.md) (slice A — deuda)

---

## Estado: LISTO PARA IMPLEMENTAR (slice B)

Slice A (Redis lockfile, 503, migrate, RBAC en rutas nuevas) sigue el handoff del 16/08. Este archivo cubre **solo reportes**. Pagos/CFDI siguen fuera (`CO-F6-001`).

**Punto de entrada:** este archivo + [`../STATUS.md`](../STATUS.md) + [`api/API-PROVIDER-REPORTS-01.md`](./api/API-PROVIDER-REPORTS-01.md)

Código: `C:\Users\PC GAMER\LaBorregaMarket`

UX print/PDF layout puede llegar después; los shapes no esperan wireframes.

---

## Incidencias de este handoff

| ID / US | Backend hace |
|---------|----------------|
| **US-DASH-04** | `GET /api/provider/reports?grain=&date=` |
| **US-DASH-06** | `GET /api/provider/reports.pdf` (misma query) |
| **DEV-P2-011** | `requireRole(PROVIDER)` + tests 401/403 en ambas rutas |
| **US-DASH-05** | Nada (print CSS = Frontend) |
| **US-GEO-07/08** | Nada (nota FE; ver § Slice C) |

---

## Orden de implementación

```
1. Helpers calendario en timezone.ts (mes/año sobre monterreyDayStartUtc)
2. getProviderReport(grain, date) — groupBy/SQL, TZ America/Monterrey
3. GET /api/provider/reports
4. GET /api/provider/reports.pdf (misma función; pdfkit o @react-pdf; no Chromium)
5. Tests: 401/403, empty 200, tres granos, date futura 400, PDF application/pdf
```

No tocar `GET /api/provider/dashboard` (rolling F3). Sin migración Prisma de producto.

---

### 1 — Ventanas (ADR-024)

| `grain` | `date` | `[from, to)` Monterrey |
|---------|--------|-------------------------|
| `day` | `YYYY-MM-DD` | ese día → día siguiente 00:00 |
| `month` | `YYYY-MM` | día 1 → día 1 mes siguiente |
| `year` | `YYYY` | 1 ene → 1 ene año siguiente |

Periodo estrictamente futuro → **400**. Periodo en curso permitido. Reusar `DASHBOARD_TZ` y `monterreyDayStartUtc`.

GMV = `SUM(total)` `status ≠ CANCELLED`. `avgTicket = gmv / orderCount` o `"0.00"`. `bySource` siempre `MARKETPLACE` y `POS`. `topProducts`: venta rápida si FK null; excluir `isAvailable=false` (mismo SQL F5). `series`: day `[]`; month un bucket/día; year un bucket/mes.

Dinero: `formatMoney` strings. Envelope ADR-003.

---

### 2 — PDF (ADR-023)

Misma query y mismo objeto. `Content-Disposition: attachment`. Periodo vacío = PDF 200 válido. **Prohibido** Puppeteer/Playwright en la route.

App Router: `src/app/api/provider/reports.pdf/route.ts`.

---

## DoD Backend F6 (reportes)

- [ ] JSON tres granos + empty con KPIs en `"0.00"`
- [ ] 400 grano/fecha inválidos o futuros
- [ ] 401/403; un PROVIDER no lee a otro (ownership por sesión)
- [ ] PDF 200 `application/pdf` (también vacío)
- [ ] Cero cambio a dashboard rolling; cero schema; cero pasarela
- [ ] Cero YAML CI, cero `/health`, cero bbox

---

## Slice C — GEO (no implementar en Backend)

[`api/API-GEO-01.md`](./api/API-GEO-01.md): el FE deriva `radiusKm` y reusa `GET /api/providers`. Sin `south/west/north/east`. Loader B1–B3 sin API.

---

## Fuera de alcance

Pasarela, CFDI, CSV, email del reporte, ticket térmico, `/admin/analytics` filtrado por proveedor, clustering, Places, Distance Matrix.

---

## Referencias

- ADR-023: [`../comun/adrs/ADR-023-report-pdf.md`](../comun/adrs/ADR-023-report-pdf.md)
- ADR-024: [`../comun/adrs/ADR-024-calendar-windows.md`](../comun/adrs/ADR-024-calendar-windows.md)
- Diagrama: [`diagrams/ARCH-REPORTS-01.md`](./diagrams/ARCH-REPORTS-01.md)
- Deuda: [`handoff-backend-fase-6.md`](./handoff-backend-fase-6.md)
