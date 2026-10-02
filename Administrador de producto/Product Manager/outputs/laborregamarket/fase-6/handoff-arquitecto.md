# Handoff Arquitecto — Fase 6

> **De:** Product Manager  
> **Para:** @Arquitecto de Software  
> **Fecha:** 16/08/2026 (v0.6.1 — slice C GEO)

F6 tiene **tres slices**. El de **deuda ya tiene contratos** (16/08). Este handoff pide ADRs/API de **reportes** y una **nota de contrato GEO** (sin bbox Must). No reabrir ADR-015 ni el checklist Maps (DEV-P1-006 ya alineado).

## Slice A — Deuda (no rediseñar)

Canónico ya publicado:

`Agente Arquitecto de Software/Agente Arquitecto/outputs/laborregamarket/fase-6/handoff-backend-fase-6.md`

Backend implementa: `DEV-P0-001` lockfile, `DEV-P1-005` 503, `DEV-P1-003` migrate, `DEV-P2-011` RBAC en rutas nuevas. CI YAML = DevOps (`US-OPS-04`).

**No hay READY-FOR-QA de pagos** — y pagos están **fuera hasta nuevo aviso** (`CO-F6-001`).

## Slice B — Reportes PROVIDER (diseñar)

### Decisiones a resolver (ADRs)

| ADR | Tema | Detalle |
|-----|------|---------|
| ADR-023 (nº a confirmar) | PDF del reporte | Must: archivo descargable del mismo contenido que `US-DASH-04`. Servidor vs cliente = **tu decisión**; documentar amenazas (CPU, auth, tamaño). No CFDI. |
| Extensión ADR-012 | Ventanas calendario | Grano `day` \| `month` \| `year` + fecha concreta. TZ **America/Monterrey**. No rolling 7d/30d de ADMIN. |

### Contratos a documentar (`fase-6/api/`)

| Contrato | US |
|----------|----|
| API-PROVIDER-DASH-01 (delta) o API-PROVIDER-REPORTS-01 | US-DASH-04 — query sugerida `grain=day\|month\|year` + `date=` (ISO fecha o `YYYY-MM` / `YYYY`). Shape: `empty`, `kpis` (gmv, avgTicket, orderCount, `bySource` MARKETPLACE/POS), `series` (puntos día o mes), `topProducts` (incl. venta rápida, mismo criterio F3) |
| API-PROVIDER-REPORTS-PDF-01 (si el PDF es servidor) | US-DASH-06 — mismo periodo; `Content-Disposition` attachment; 401/403 |

Si el PDF es 100% cliente, no inventes endpoint; el ADR lo deja explícito y el FE usa los JSON de DASH.

### Delta de schema propuesto (DASH)

- **Ninguno de producto.** Agregación sobre `Order` / `OrderItem` existentes (`status ≠ CANCELLED`, `providerId` del dueño).
- Ruta nueva ⇒ `requireRole` PROVIDER + test 401/403 (**DEV-P2-011**).

## Slice C — GEO zoom ↔ radio (`CO-F6-002`)

**Sin endpoint nuevo esperado.** FE deriva `radiusKm` del visualizador (distancia centro del pin → borde del viewport, clamp 1–25) y reusa `GET /api/providers?lat&lng&radiusKm` (API-GEO-01 F4/F5). Debounce al terminar pan/zoom.

| Contrato | US |
|----------|----|
| API-GEO-01 (nota F6, no bbox) | US-GEO-07 — documentar que el cliente hidrata `radiusKm` desde el mapa; el servidor **no** cambia a `south/west/north/east`. Clustering Won't. |
| — | US-GEO-08 — sin API; UI = loop B1–B3 (`comun/brand/loader-borrega/`); FE copia a `public/brand/loader-borrega/` |

Documentar en ADR-020 (append) o nota corta: fórmula centro→borde, clamp 25 km, no N requests por frame.

### Requerimientos no funcionales

| Categoría | Requerimiento |
|-----------|---------------|
| Seguridad | Un PROVIDER solo lee **su** negocio en DASH. ADMIN no espía a otro (Won't F6). |
| Consistencia | GMV = `SUM(total)` no canceladas. GEO: mismo Haversine que F4. |
| Rendimiento | Año DASH: groupBy SQL. GEO: debounce pan/zoom. |
| Impresión | Print CSS = FE (`US-DASH-05`). PDF = ADR (`US-DASH-06`). |
| Envelope | ADR-003 en 4xx/5xx. |

### Fuera de alcance F6

Pasarela, cobros POS nuevos, pago en línea, CFDI, `/health`, CI YAML, Places, Distance Matrix, CSV, email del reporte, ticket térmico, **bbox Must**, **clustering**.

## Entregables esperados

**Slice B:** ADR PDF + ventanas calendario; delta API dashboard/reportes (+ PDF si servidor); `handoff-backend` delta reportes.

**Slice C:** nota/ADR append (derivación `radiusKm`, clamp, debounce); confirmar que API-GEO-01 no cambia.

**Ambos:** append `sad.md` / `OBSERVABILITY.md` (F6 = confiabilidad + reportes + GEO sync; pagos aparcados).

## Entregables ya cubiertos (slice A)

Backend sigue el handoff del 16/08. Infra CI: `comun/infra-requirements.md`.
