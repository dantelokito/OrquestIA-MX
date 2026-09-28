# API-DASH-NOTES-01 — Impresión del reporte filtrado (sin API Must)

> **Módulo:** `DASH`  
> **Versión:** 0.10.2  
> **Fecha:** 28/08/2026  
> **US:** US-DASH-09  
> **Estado:** **Sin endpoint nuevo**

## Inputs Utilizados

- **US:** `US-DASH-09`
- **CO:** `CO-F10-003`
- **JSON:** [`API-PROVIDER-REPORTS-02.md`](./API-PROVIDER-REPORTS-02.md)

---

`US-DASH-09` es acción de documento en el cliente: `window.print` (o equivalente) + `@media print` que oculta header de app y SubNavProveedor.

El contenido impreso **es** la vista ya cargada (mismos `from`/`to`, mismos checkboxes / `productIds`). No hay `POST /api/provider/reports/print`.

Must en el documento:

- Nombre de la frutería (`data.provider.businessName`)
- Rango inicio–fin calendario y `timezone: America/Monterrey`
- `generatedAt`
- Leyenda **Todos** si no hay `productIds`, o lista de nombres incluidos
- KPIs + tabla `products[]` iguales a pantalla
- Empty: mensaje de sin ventas, no página en blanco

Should: PDF servidor de **este** corte (no reabre [`../../fase-6/api/API-PROVIDER-REPORTS-PDF-01.md`](../../fase-6/api/API-PROVIDER-REPORTS-PDF-01.md) ni ADR-023).

Won't: ticket térmico, CFDI, CSV, email.

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-10/api/API-DASH-NOTES-01.md`
- **Agente Downstream:** Frontend (tras handoff UX)
