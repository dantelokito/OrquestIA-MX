# ADR-024 — Ventanas calendario del reporte PROVIDER

> **Estado:** Aceptado  
> **Fecha:** 2026-08-16  
> **Decisores:** Arquitecto de Software  
> **Fase:** 6 — v0.6.1  
> **Extiende:** espíritu ADR-012 (dashboard F3: TZ Monterrey, groupBy/SQL, no mock). El archivo ADR-012 no está en `comun/adrs/`; esta ADR es la fuente de las ventanas **concretas**.
> **US:** US-DASH-04

---

#### 1. Contexto y Problema:

El dashboard F3 (`GET /api/provider/dashboard`) usa ventanas **rolling**: hoy, 7 días, 30 días (`rollingWindowUtc` + `series7d`). El proveedor necesita un reporte de un **día, mes (MM/AAAA) o año (AAAA) concreto** (D-F6-4), no “últimos N días”. Copiar `range=7d|30d` de ADMIN (`API-ADMIN-ANALYTICS-01`) mezclaría granos y dueños. ADMIN no ve el reporte de otro negocio (Won't F6).

---

#### 2. Opciones Consideradas:

* **Opción A — Query `grain=day\|month\|year` + `date=` en un endpoint nuevo `/api/provider/reports`:** Pros: no rompe el shape F3 (`kpis.d1/d7/d30`); US-DASH-04 permite dejar “hoy + 7d” como vista por defecto. Contras: dos rutas de lectura de ventas.
* **Opción B — Extender `GET /api/provider/dashboard` con query opcional:** Pros: una sola route. Contras: unión discriminada de dos shapes; riesgo de romper el FE F3.
* **Opción C — Reusar `GET /api/admin/analytics?range=` filtrado por proveedor:** Pros: menos código. Contras: D-F6-3 lo prohíbe; ADMIN analytics es plataforma, no un negocio.

---

#### 3. Decisión Elegida:

**Opción A.** El dashboard rolling F3 **no cambia**. El reporte calendario es `GET /api/provider/reports`.

### Zona horaria

`America/Monterrey` (`DASHBOARD_TZ`). México sin DST desde 2022; reutilizar `monterreyDayStartUtc` / `[from, to)` semiabierto (inicio inclusive, fin exclusive) como F3.

### Query

| `grain` | `date` | Ventana `[from, to)` |
|---------|--------|----------------------|
| `day` | `YYYY-MM-DD` | 00:00 de ese día → 00:00 del día siguiente |
| `month` | `YYYY-MM` | 00:00 del día 1 → 00:00 del día 1 del mes siguiente |
| `year` | `YYYY` | 00:00 del 1 ene → 00:00 del 1 ene del año siguiente |

Desajuste grano/formato → **400**. Periodo **estrictamente futuro** respecto a hoy Monterrey (día / mes / año) → **400**. El periodo **en curso** (parcial) está permitido.

### Métricas (Must)

| Campo | Definición |
|-------|------------|
| GMV | `SUM(total)` de `Order` con `providerId` del dueño y `status ≠ CANCELLED` |
| `orderCount` | Conteos de esas órdenes |
| `avgTicket` | `gmv / orderCount`; `"0.00"` si `orderCount = 0` |
| `bySource` | Mismo filtro, split `MARKETPLACE` vs `POS` (ceros si no hay) |
| `topProducts` | Criterio F3/F5: venta rápida si `providerProductId === null`; omitir catálogo `isAvailable=false` |
| `series` | `day` → `[]` (serie horaria = Could). `month` → un punto por día del mes. `year` → un punto por mes. Buckets futuros del periodo en curso van en `"0.00"` / 0 |

Agregación **SQL / Prisma groupBy** (no mock en prod). Sin migración de schema. Comparativa vs periodo anterior = Should, fuera de este contrato.

Ownership: `requireRole(PROVIDER)` + `resolveProviderByUserId(session.sub)`. Un PROVIDER no lee a otro.

---

#### 4. Consecuencias e Impacto:

* **Positivas:** F3 intacto; granos calendario explícitos; misma TZ que dashboard y ADMIN analytics.
* **Riesgos / Compensaciones:** Dos lecturas de ventas (rolling vs calendario). El FE debe no mezclar `series7d` con `series` del reporte. Año completo es 12 buckets, no 365.

## Referencias

- US-DASH-04, D-F6-3, D-F6-4, D-F6-8
- JSON: [`../../fase-6/api/API-PROVIDER-REPORTS-01.md`](../../fase-6/api/API-PROVIDER-REPORTS-01.md)
- Dashboard F3: [`../../fase-3/api/API-PROVIDER-DASH-01.md`](../../fase-3/api/API-PROVIDER-DASH-01.md)
- PDF: [ADR-023](./ADR-023-report-pdf.md)
