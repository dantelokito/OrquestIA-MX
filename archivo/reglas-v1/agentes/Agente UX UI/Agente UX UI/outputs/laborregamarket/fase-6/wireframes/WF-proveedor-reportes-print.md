> **Pantalla:** Vista de impresión / PDF del reporte PROVIDER
> **Objetivo Principal:** Llevar el mismo resumen de `US-DASH-04` a papel o archivo, sin chrome de la app
> **Disparadores:** Botón **Imprimir** (`window.print`) · Botón **Descargar PDF** (`GET /api/provider/reports.pdf`)

### Print — `@media print` (US-DASH-05)

```text
+-----------------------------------------------------------------------+
|  Frutas El Paraíso                                                    |
|  Reporte de ventas · Agosto 2026                                      |
|  Zona horaria: America/Monterrey · Generado: 16/08/2026 17:41         |
+-----------------------------------------------------------------------+
|  GMV $12,500.50   Ticket prom. $260.43   Órdenes 48                   |
|  Encargar (pedido en línea): $8,200.00 · 30 órdenes                   |
|  Mostrador (POS): $4,300.50 · 18 órdenes                              |
+-----------------------------------------------------------------------+
|  Ventas por día                                                       |
|  (mismas barras o tabla equivalente — Must: mismos buckets)           |
+-----------------------------------------------------------------------+
|  Top productos                                                        |
|  Producto · Cantidad · Ingreso   (incl. Venta rápida)                 |
+-----------------------------------------------------------------------+
```

**Ocultar en print (`display: none` / clase `no-print`):**

- Header global (logo, pill, avatar)
- SubNavProveedor
- `DashboardViewSwitcher`
- `GrainSelector` + `ReportPeriodPicker`
- Botones Imprimir / Descargar PDF
- Toasts, ErrorBanner de sesión, skip-links de app

**Mostrar en print (clase `print-only` si no está en pantalla):**

- Nombre de frutería (`provider.businessName`)
- Periodo legible según grano (ej. "16 de agosto de 2026" / "Agosto 2026" / "2026")
- TZ `America/Monterrey`
- Fecha/hora de generación en local Monterrey (`generatedAt`)

### PDF — mismo contenido (US-DASH-06)

El archivo **no** es un screenshot del DOM. Backend genera PDF desde el mismo objeto JSON (`ADR-023`). UX exige **paridad de set**:

| Bloque | Pantalla | Print CSS | PDF |
|--------|----------|-----------|-----|
| Encabezado negocio + periodo + TZ + generado | Toolbar / print-only | Sí | Sí |
| KPIs GMV, ticket, # órdenes | Sí | Sí | Sí |
| Split Encargar vs POS | Sí | Sí | Sí |
| Serie (mes/año) o su tabla | Sí | Sí | Sí |
| Top productos + venta rápida | Sí | Sí | Sí |
| Empty amigable | Sí | Sí | Sí (archivo 200 válido) |

Filename: `reporte-{slug}-{grain}-{date}.pdf` (ej. `reporte-frutas-el-paraiso-month-2026-08.pdf`).

**Prohibido en print/PDF:** CFDI, ticket térmico POS, CSV, enviar por email, watermark fiscal, look slate de `/admin/analytics`.

#### Estados

| Estado | Print | PDF |
|--------|-------|-----|
| **Success con ventas** | Diálogo nativo del navegador | Attachment `application/pdf` |
| **Empty periodo** | Hoja con KPIs 0 y copy "Sin ventas en este periodo" | PDF 200 con el mismo empty |
| **Sin payload (500 JSON)** | Botón Imprimir disabled | Botón PDF disabled |
| **PDF 500** | — | ErrorBanner; no blob truncado |
| **400 query** | No se llega: picker bloquea | API 400 JSON; UI no descarga |

#### Componentes Requeridos para Frontend:
* **ReportPrintRoot:** wrapper del contenido imprimible (`id="report-print"`).
* **ReportPrintHeader:** `print-only` (o visible en print via CSS); H1 nombre; subtítulo periodo; meta TZ + generado.
* **`@media print`:** `body *` chrome `no-print`; `@page { margin: 16mm; }`; fondos blancos; texto `slate-900`; barras del chart en gris oscuro (legible B/N razonable — no depender solo de `--brand`).
* **PDF trigger:** `GET` con credenciales cookie; `Content-Disposition: attachment`. Loading en el botón, no navegación a JSON crudo.

#### Accesibilidad:
* Botones ≥44px en pantalla (no aplican en papel).
* Print: contraste texto sobre blanco ≥ 4.5:1; no ocultar la tabla sr-only si el chart no imprime bien — **preferir tabla visible en print** si el chart se degrada.
* PDF: contenido textual seleccionable (generado en servidor; no imagen única).

#### API esperada:
* Print: cero endpoint (CSS + `window.print`)
* PDF: `GET /api/provider/reports.pdf?grain=&date=`

#### Referencias:
* Flujo: `../user-flows/UF-DASH-02-reportes-periodo.md`
* Pantalla: `WF-proveedor-reportes.md`
* Tokens: `ReportPrint`, `DocumentActions`
* Contratos: API-PROVIDER-REPORTS-01, API-PROVIDER-REPORTS-PDF-01
