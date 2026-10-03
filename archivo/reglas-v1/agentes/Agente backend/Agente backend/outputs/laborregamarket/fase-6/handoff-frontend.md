# Handoff Frontend — LaBorregaMarket Backend v0.6.1

> **De:** Backend Developer  
> **Para:** @Frontend Developer  
> **Fecha:** 16/08/2026

---

## Estado: LISTO PARA INTEGRAR — Must F6 (reportes)

Base URL local: `http://localhost:8080`  
Envelope JSON: `{ data }` / `{ error, details? }` (ADR-003).  
`GET /api/provider/dashboard` **sin cambios** (rolling hoy/7d/30d). Query geo F4 **intacta** (`lat`/`lng`/`radiusKm`); zoom↔radio y loader son FE.

Cliente monolito: `getProviderReport(grain, date)` y `providerReportPdfUrl(grain, date)` en `src/lib/api/provider-ops.ts`.

---

## Mapa pantalla → endpoint (delta F6)

| Tema | Endpoint(s) | Notas |
|------|-------------|-------|
| Reporte calendario | `GET /api/provider/reports?grain=&date=` | Cookie JWT, rol **PROVIDER**. Solo el negocio de `session.sub`. ADMIN/CLIENT → **403** |
| Descarga PDF | `GET /api/provider/reports.pdf?grain=&date=` | Misma query y mismo contenido. **200** `application/pdf` + `Content-Disposition: attachment`. Errores 400/401/403/500 siguen JSON |
| Dashboard rolling | `GET /api/provider/dashboard` | Intacta. No mezclar `series7d` con `series` del reporte |
| Explorar mapa | Query F4 | Sin bbox Must. `radiusKm` lo deriva el FE |
| Contacto 503 | `POST /api/providers/[id]/contact` | Prod sin Upstash → **503** `"Servicio no disponible. Intenta más tarde."` (no empty POS). **429** rate limit |

Print CSS (`US-DASH-05`) = Frontend (`window.print`). No hay endpoint de impresión.

---

## Query

| `grain` | `date` | Ejemplo |
|---------|--------|---------|
| `day` | `YYYY-MM-DD` | `2026-08-16` |
| `month` | `YYYY-MM` | `2026-08` |
| `year` | `YYYY` | `2026` |

Falta alguno, formato inválido o desajuste grano/`date` → **400**. Periodo estrictamente futuro vs hoy Monterrey → **400** (`details[0].field === "date"`). Periodo en curso permitido.

TZ: `America/Monterrey`. `from` / `to` son ISO UTC (medianoche Monterrey = `06:00Z`).

---

## 200 JSON (con ventas)

`bySource` usa claves **`MARKETPLACE`** y **`POS`** (uppercase; distinto del dashboard `marketplace`/`pos`). Dinero: strings `"85.50"`. Cantidades: `"2.000"`.

```http
GET /api/provider/reports?grain=month&date=2026-08
```

```json
{
  "data": {
    "empty": false,
    "timezone": "America/Monterrey",
    "generatedAt": "2026-08-16T23:41:00.000Z",
    "provider": { "id": "clx...", "businessName": "Frutas El Paraíso" },
    "period": {
      "grain": "month",
      "date": "2026-08",
      "from": "2026-08-01T06:00:00.000Z",
      "to": "2026-09-01T06:00:00.000Z"
    },
    "kpis": {
      "gmv": "12500.50",
      "avgTicket": "260.43",
      "orderCount": 48,
      "bySource": {
        "MARKETPLACE": { "gmv": "8200.00", "orderCount": 30 },
        "POS": { "gmv": "4300.50", "orderCount": 18 }
      }
    },
    "series": [
      { "bucket": "2026-08-01", "gmv": "400.00", "orderCount": 2 }
    ],
    "topProducts": [
      {
        "providerProductId": null,
        "name": "Venta rápida",
        "salesTotal": "20.00",
        "quantitySum": "2.000"
      }
    ]
  }
}
```

| Campo | Regla |
|-------|-------|
| `empty` | `true` si `orderCount === 0` (**200**, no 404) |
| `series` | `day` → `[]`. `month` → un punto por día (vacío = todos `"0.00"`). `year` → 12 meses. Buckets futuros del periodo en curso en cero |
| `topProducts` | Top 5; `providerProductId === null` = venta rápida; catálogo `isAvailable=false` omitido |
| `avgTicket` | `"0.00"` si vacío |

Si la API es **500**, ErrorBanner + Reintentar — **no** empty POS de “sin activos”.

---

## PDF

```http
GET /api/provider/reports.pdf?grain=month&date=2026-08
```

| Header | Valor |
|--------|-------|
| `Content-Type` | `application/pdf` |
| `Content-Disposition` | `attachment; filename="reporte-{slug}-{grain}-{date}.pdf"` |

Ejemplo: `reporte-frutas-el-paraiso-month-2026-08.pdf`. Periodo vacío = PDF 200 válido (no 500). Disparar descarga con la misma query del periodo visible (p. ej. `providerReportPdfUrl("month", "2026-08")`).

---

## Errores HTTP usados F6

400 query/periodo futuro · 401 · 403 (rol ≠ PROVIDER) · 429 contacto · 503 contacto sin Redis en prod · 500

400 ejemplo:

```json
{
  "error": "Validation failed",
  "details": [{ "field": "date", "message": "Formato inválido para grain=month" }]
}
```
