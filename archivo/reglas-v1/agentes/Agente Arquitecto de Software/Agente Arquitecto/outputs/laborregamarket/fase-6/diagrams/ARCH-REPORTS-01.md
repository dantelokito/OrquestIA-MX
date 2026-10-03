# ARCH-REPORTS-01 — Reporte calendario PROVIDER

> **Componente / Flujo:** Ventanas day/month/year + JSON + PDF servidor + print cliente  
> **Fecha:** 16/08/2026  
> **Fase:** 6 — v0.6.1

---

## Lectura del reporte

```mermaid
sequenceDiagram
  participant UI as DashboardProveedor
  participant JSON as GET_provider_reports
  participant PDF as GET_provider_reports_pdf
  participant Svc as getProviderReport
  participant DB as PostgreSQL

  UI->>JSON: grain date cookie JWT
  JSON->>JSON: requireRole PROVIDER
  JSON->>Svc: userId grain date
  Svc->>DB: aggregate Order OrderItem TZ Monterrey
  Svc-->>JSON: kpis series topProducts
  JSON-->>UI: envelope data
  UI->>UI: window.print CSS
  UI->>PDF: mismos grain date
  PDF->>Svc: getProviderReport
  Svc-->>PDF: mismo objeto
  PDF-->>UI: application/pdf attachment
```

`GET /api/provider/dashboard` (rolling F3) no aparece: vista por defecto intacta, contrato distinto.

---

## Ventanas (ADR-024)

```mermaid
flowchart TD
  Query[grain_plus_date]
  Query --> Day[day_YYYY-MM-DD]
  Query --> Month[month_YYYY-MM]
  Query --> Year[year_YYYY]
  Day --> Bounds["from_to_half_open_Monterrey"]
  Month --> Bounds
  Year --> Bounds
  Bounds --> Agg[SUM_total_not_CANCELLED]
  Agg --> Own[solo_provider_del_session]
```

Periodo futuro → 400. Periodo en curso → permitido. Sin schema nuevo.

---

## Qué no entra

```mermaid
flowchart LR
  Print[Print_CSS] --> FE[Frontend]
  PDF[PDF_bytes] --> BE[Backend]
  CFDI[CFDI] -.-> Wont[Wont_F6]
  Admin[Admin_analytics] -.-> Other[otro_contrato]
```

---

## Referencias

- [`../api/API-PROVIDER-REPORTS-01.md`](../api/API-PROVIDER-REPORTS-01.md)
- [`../api/API-PROVIDER-REPORTS-PDF-01.md`](../api/API-PROVIDER-REPORTS-PDF-01.md)
- [`../../comun/adrs/ADR-023-report-pdf.md`](../../comun/adrs/ADR-023-report-pdf.md)
- [`../../comun/adrs/ADR-024-calendar-windows.md`](../../comun/adrs/ADR-024-calendar-windows.md)
