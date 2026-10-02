# API-PROVIDER-REPORTS-14 — Series existentes, PDF `from`/`to`, gráficas FE

> **Endpoints:** `GET /api/provider/reports/global` (sin shape nuevo) · `GET /api/provider/reports.pdf` (delta query) · `GET /api/provider/reports` (intacto)  
> **Descripción:** Pintar payload ya calculado (FE). N=1 global 403 intacto. PDF de sucursal alineado al corte `from`/`to`.  
> **Autenticación:** Requerida — PROVIDER  
> **Módulo:** `DASH`  
> **Versión:** 0.14.0  
> **Fecha:** 2026-09-17  
> **US:** US-DASH-14, US-DASH-15, US-DASH-16  
> **ADR:** ADR-041, ADR-035, ADR-033, ADR-023, ADR-003, ADR-002, ADR-034  
> **Envelope:** ADR-003 (JSON). PDF 200 = bytes, no envelope.  
> **Base (solo lectura):** `fase-11/api/API-PROVIDER-REPORTS-03.md`, `fase-10/api/API-PROVIDER-REPORTS-02.md`, `fase-6/api/API-PROVIDER-REPORTS-PDF-01.md`

## Inputs Utilizados

- PRD D-F14-7, D-F14-8, D-F14-9, D-F14-14
- Código: `reports.pdf/route.ts` solo parsea `grain`+`date`; JSON ya tiene `parseReportsRequest` con rango

---

## GET `/api/provider/reports/global` (US-DASH-14)

**Sin contrato nuevo Must.** Shape vigente F11 (`series`, `products`, `kpis.bySource`, `byProvider`, filtro `productIds`).

| Caso | HTTP |
|------|------|
| N ≤ 1 | **403** `{ "error": { "code": "GLOBAL_REPORTS_NOT_AVAILABLE", "message": "El reporte global solo está disponible con más de una sucursal" }, "timestamp": "..." }` |
| N mayor que 1 | 200 con series (ceros si empty) |
| `productIds` ajeno | 403 |
| Mezcla grain + from/to | 400 |

Inventario F13 en reportes generales **sigue**. No granularidad semanal, no comparativa, no sección, no margen.

FE Must pintar `series` / `products` / `bySource`. Backend no recalcula.

---

## GET `/api/provider/dashboard` y `GET /api/provider/reports` (US-DASH-15)

Sin delta de JSON. FE unifica SVG (ADR-041). `<details>` + print `#report-print-f10` se conservan. Empty: no crash `max=0`.

---

## GET `/api/provider/reports.pdf` (US-DASH-16)

> **Descripción:** Mismos guards y agregación que `GET /api/provider/reports`. El PDF cubre el **mismo** periodo que la UI visible.

#### Query Parameters (XOR, igual ADR-033):

| Modo | Params requeridos | Prohibidos juntos |
|------|-------------------|-------------------|
| F10 rango (Must UI) | `from`, `to` (`YYYY-MM-DD`) | `grain`, `date` |
| F6 grain (compat API) | `grain`, `date` | `from`, `to` |

Reusar `parseReportsRequest`. Mezcla → **400**. `from > to`, span mayor que 366, futuro → **400**. IDOR: solo sucursal **activa**. CLIENT/ADMIN → **403**. Sin JWT → **401**.

`productIds` opcional: misma semántica que el JSON F10 (403 si ajeno). El PDF Must incluye KPIs, `bySource`, serie del rango y tabla `products` recortada al predicado.

#### 200 Success:

| Header | Valor |
|--------|-------|
| `Content-Type` | `application/pdf` |
| `Content-Disposition` | `attachment; filename="reporte-{slug}-{from}_{to}.pdf"` (modo rango) |

Modo grain conserva filename F6 `reporte-{slug}-{grain}-{date}.pdf`.

Cuerpo: bytes PDF válidos. Periodo vacío → 200 + PDF con KPIs en cero (no 500). **Prohibido** Puppeteer. Generar desde el objeto de `getProviderReport` (ya soporta rango en JSON). `pdfkit` existente.

UI Must: `showPdf` visible; **no** reactivar `GrainSelector`. Print HTML F10 sigue.

#### Errores (JSON ADR-003, no PDF a medias):

* **400** — validación de query  
* **401 Unauthorized**  
* **403 Forbidden**  
* **500** — `{ "error": "Error interno" }`

No CSV, no email, no CFDI. No PDF **global** Must.

---

## Errores (global JSON)

| HTTP | Caso |
|------|------|
| 400 | Fechas, mezcla de modos |
| 401 | Sin sesión |
| 403 | Rol, N=1 global, productIds ajenos |
| 404 | No usado |
| 409 | No usado |
| 500 | Error interno |

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/api/API-PROVIDER-REPORTS-14.md`
- **Agente Downstream:** Backend Developer, Frontend
