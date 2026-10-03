# ADR-041 — Gráficas SVG unificado (sin librería npm)

> **ADR-041:** Un componente SVG vs librería de charts  
> **Estado:** Aprobado  
> **Fecha:** 2026-09-17  
> **Fase:** 14  
> **US:** US-DASH-14, US-DASH-15  
> **Decisores:** Arquitecto de Software

## Inputs Utilizados

- PRD F14 D-F14-7, D-F14-8
- Código `main` @ `0eda84c`: `BarChartIlustrativo` y `ReportBarChart` (SVG casi idénticos); `pdfkit` ya en lockfile
- ADR-023 (PDF servidor), ADR-033 (`from`/`to`), ADR-035 (global N>1)

---

#### 1. Contexto y Problema:

Reportes generales **ya** calculan `series`, `products` y `kpis.bySource` y la UI no los pinta. Ventas mantiene dos SVG duplicados. PM **no** fija paquete npm; Must = tendencia + mix de canal + top sobre series **existentes**. Obligatorios: `<details>` con tabla (`role="img"` + `aria-label`) y `@media print` (`#report-print-f10` / inventario F13).

No hay endpoint nuevo para pintar. N=1 sigue **403** `GLOBAL_REPORTS_NOT_AVAILABLE`.

---

#### 2. Opciones Consideradas:

* **Opción A — Unificar los SVG actuales en un componente parametrizable (tendencia, mix, top):** Pros: cero npm; print CSS y a11y ya conocidos; React 19 sin hidratación de canvas; empty `max=0` controlable. Contras: no hay tooltips ricos ni animación.
* **Opción B — Librería ligera (p. ej. Recharts) en React 19:** Pros: API de series. Contras: bundle; print impredecible; PM dijo que librería **no** es Must; degradación si el chunk falla.
* **Opción C — Canvas / Chart.js:** Pros: look. Contras: peor a11y y print; no hay tabla nativa.

---

#### 3. Decisión Elegida:

**Opción A.** Ninguna dependencia npm nueva de charts en F14.

### Contrato de implementación (Frontend; sin API nueva)

| Variante | Datos | Superficie |
|----------|-------|------------|
| Tendencia | `series[].bucket` + `gmv` / `orderCount` | Reportes sucursal, Ventas, Reportes generales N>1 |
| Mix canal | `kpis.bySource` MARKETPLACE vs POS | Igual |
| Top / ranking | `products[]` o `topProducts` vigente | Igual |

Un solo componente (nombre sugerido: `ProviderReportChart`) con `variant`. Cada instancia envuelve `<details>` + tabla. Empty: no crash por `max=0`.

`GET /api/provider/reports/global` y `GET /api/provider/reports` **no cambian de shape**. Filtro `productIds` intacto.

### PDF (US-DASH-16)

`GET /api/provider/reports.pdf` acepta el **mismo** discriminador XOR que el JSON F10 (`from`+`to` **o** `grain`+`date`). La UI Must dispara solo `from`/`to`. Modo `grain` permanece en API por compatibilidad; **no** se reactiva `GrainSelector`. Librería PDF = `pdfkit` ya presente (ADR-023). Sin Puppeteer.

### Qué NO hacer

- Semanal, comparativa vs periodo anterior, agrupación por sección, gráficos de margen.
- PDF global Must (N=1 no tiene módulo global).
- `grain` como único path del PDF.

---

#### 4. Consecuencias e Impacto:

* **Positivas:** Cero lockfile de charts; print y a11y conservados; Backend de series no se toca.
* **Riesgos:** Look más austero que Recharts. Si más adelante se adopta librería, el `<details>` sigue siendo fallback.

## Referencias

- `fase-14/api/API-PROVIDER-REPORTS-14.md`
- ADR-023, ADR-033, ADR-035, ADR-003
