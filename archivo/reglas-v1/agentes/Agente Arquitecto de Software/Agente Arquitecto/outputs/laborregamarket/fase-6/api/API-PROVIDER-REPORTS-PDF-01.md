# API-PROVIDER-REPORTS-PDF-01 — Descarga PDF del reporte

> **Endpoint:** `GET` `/api/provider/reports.pdf`  
> **Módulo:** `DASH`  
> **Versión:** 0.6.1  
> **Fecha:** 16/08/2026  
> **US:** US-DASH-06  
> **ADR:** [`../../comun/adrs/ADR-023-report-pdf.md`](../../comun/adrs/ADR-023-report-pdf.md)  
> **Autenticación:** Requerida — Rol `PROVIDER` → cookie JWT  
> **JSON hermano:** [`API-PROVIDER-REPORTS-01.md`](./API-PROVIDER-REPORTS-01.md)

No es print (`US-DASH-05` = `window.print` + CSS). No es CFDI.

---

## GET `/api/provider/reports.pdf`

> **Descripción:** Devolver un PDF adjunto del **mismo** periodo y contenido que el JSON (KPIs, split, serie o tabla, top productos).  
> **Autenticación:** Requerida — Rol `PROVIDER`. Mismos 401/403 que el JSON.

#### Query Parameters:

Idénticos a API-PROVIDER-REPORTS-01: `grain` + `date` (mismas reglas 400, incluido periodo futuro).

#### 200 Success:

| Header | Valor |
|--------|-------|
| `Content-Type` | `application/pdf` |
| `Content-Disposition` | `attachment; filename="reporte-{slug}-{grain}-{date}.pdf"` |

`slug`: `businessName` ASCII/kebab (sin espacios). Ejemplo: `reporte-frutas-el-paraiso-month-2026-08.pdf`.

Cuerpo: bytes PDF. **No** envelope JSON en 200.

#### Contenido Must del PDF

Encabezado: nombre de frutería, periodo (`grain` + `date`), TZ `America/Monterrey`, `generatedAt` (fecha/hora local Monterrey).

Cuerpo: mismo set que la pantalla — KPIs (GMV, avg ticket, # órdenes), split MARKETPLACE vs POS, serie (o tabla equivalente) y top productos. Periodo vacío: empty visible, archivo válido.

**Prohibido:** Chromium/Puppeteer/Playwright en esta route. Generar desde el objeto de `getProviderReport`, no recorriendo órdenes sueltas.

#### Errores (JSON, envelope ADR-003):

* **400** — misma validación que el JSON  
* **401 Unauthorized**  
* **403 Forbidden**  
* **500** — no devolver PDF a medias; envelope `{ "error": "..." }`

---

## Fuera de alcance

- Envío por email, CSV, watermark fiscal
- Endpoint de impresión
- ADMIN descargando el PDF de otro negocio

---

## Implementación sugerida

| Capa | Archivo |
|------|---------|
| Route | `src/app/api/provider/reports.pdf/route.ts` (App Router: carpeta `reports.pdf`) |
| Service | Reusar `getProviderReport`; helper `renderProviderReportPdf(report) → Buffer` |
| npm | Librería ligera (idea: `pdfkit` o `@react-pdf/renderer` en Node). Commitear lockfile |

Tests Must: 401 sin cookie; 403 CLIENT; 200 `application/pdf` en periodo vacío; query inválida 400.

---

## Referencias

- US-DASH-06, D-F6-5, D-F6-6
- ADR-023, ADR-024
- Diagrama: [`../diagrams/ARCH-REPORTS-01.md`](../diagrams/ARCH-REPORTS-01.md)
