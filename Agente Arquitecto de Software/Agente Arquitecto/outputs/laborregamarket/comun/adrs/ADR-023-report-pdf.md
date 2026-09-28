# ADR-023 — PDF del reporte de ventas en servidor

> **Estado:** Aceptado  
> **Fecha:** 2026-08-16  
> **Decisores:** Arquitecto de Software  
> **Fase:** 6 — v0.6.1  
> **US:** US-DASH-06 (mecanismo); US-DASH-05 (print) queda en el cliente

---

#### 1. Contexto y Problema:

El proveedor debe **descargar un archivo PDF** del mismo contenido que el reporte JSON (`US-DASH-04`: KPIs, split Encargar vs POS, serie o tabla, top productos). El AC de QA pide 401/403 sin sesión o de otro rol. Print del navegador (`US-DASH-05`) ya cubre papel; no sustituye la descarga. No es CFDI ni ticket térmico. El PM no prescribe librería.

Hay que elegir dónde se genera el bytes del PDF y cómo se autentica.

---

#### 2. Opciones Consideradas:

* **Opción A — Servidor (`GET` binario, misma agregación que el JSON):** Pros: 401/403 HTTP de primera clase (DEV-P2-011); `Content-Disposition: attachment`; un solo `getProviderReport`; vacío = PDF 200 válido. Contras: CPU en la route serverless; hay que acotar timeout y tamaño.
* **Opción B — Cliente (jspdf / html2canvas / @react-pdf en el browser):** Pros: cero route nueva. Contras: 401/403 solo en el JSON previo; calidad html2canvas irregular; bundle FE; no hay `Content-Disposition` nativo.
* **Opción C — Chromium en la API (Puppeteer / Playwright print):** Pros: fidelidad visual al CSS. Contras: binario pesado, frío de lambda, incompatible con el presupuesto Vercel del monolito.

---

#### 3. Decisión Elegida:

**Opción A.** El PDF lo genera el servidor a partir del **mismo** objeto de reporte que `GET /api/provider/reports`.

### Contrato

| Aspecto | Valor |
|---------|-------|
| Ruta | `GET /api/provider/reports.pdf` |
| Query | Idéntica a [`API-PROVIDER-REPORTS-01`](../../fase-6/api/API-PROVIDER-REPORTS-01.md) (`grain` + `date`) |
| Auth | Cookie JWT + `requireRole(PROVIDER)`; el reporte es **solo** el `Provider` del `session.sub` |
| 200 | `Content-Type: application/pdf`; `Content-Disposition: attachment; filename="reporte-{slug}-{grain}-{date}.pdf"` |
| Vacío | 200 + PDF válido con KPIs en cero / empty (no 500, no archivo corrupto) |
| Librería | Ligera (idea: pdfkit o @react-pdf en Node). **Prohibido** Puppeteer, Playwright o Chrome en esta route |
| Print | `window.print` + `@media print` = Frontend. Cero endpoint de impresión |

### Amenazas y mitigación

| Amenaza | Mitigación |
|---------|------------|
| CPU / timeout serverless | El payload ya viene agregado (máx. ~31 puntos/día en mes, 12 meses en año). Prohibido recorrer órdenes línea a línea para armar el PDF |
| Auth bypass | Mismos guards que el JSON; test 401 sin cookie y 403 CLIENT/ADMIN |
| Tamaño | Un proveedor, un periodo calendario; sin adjuntos ni imágenes de catálogo |
| Periodo vacío | Renderizar encabezado + empty; HTTP 200 |

No enviar el PDF por email (Won't F6). CSV/Excel = Won't.

---

#### 4. Consecuencias e Impacto:

* **Positivas:** Un agregador; QA puede asertar 401/403 y `Content-Disposition`; el FE solo dispara la descarga con la query del periodo visible.
* **Riesgos / Compensaciones:** El look del PDF no clona 1:1 el CSS de pantalla (el print CSS sí lo hace para papel). Hay que mantener layout de PDF a mano (1–2 páginas). Dependencia npm extra en el lockfile de la app.

## Referencias

- US-DASH-04, US-DASH-05, US-DASH-06, D-F6-5, D-F6-6
- Ventanas: [ADR-024](./ADR-024-calendar-windows.md)
- JSON: [`../../fase-6/api/API-PROVIDER-REPORTS-01.md`](../../fase-6/api/API-PROVIDER-REPORTS-01.md)
- PDF: [`../../fase-6/api/API-PROVIDER-REPORTS-PDF-01.md`](../../fase-6/api/API-PROVIDER-REPORTS-PDF-01.md)
