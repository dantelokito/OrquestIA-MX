# ARCH-REPORTS-02 — Rango `from`/`to` y filtro por producto

> **Componente / Flujo:** Modo query F10 sobre `GET /api/provider/reports`  
> **Fecha:** 28/08/2026  
> **Fase:** 10 — v0.10.2  
> **ADR:** ADR-033 (ADR-024 grain intacto)

---

## Discriminación de modo

```mermaid
flowchart TD
  Q[GET_provider_reports]
  Q --> Grain{grain_and_date}
  Q --> Range{from_and_to}
  Grain --> F6[ADR024_half_open]
  Range --> F10[inclusive_calendar]
  F10 --> Sql["createdAt_gte_fromUtc_lt_toExclusive"]
  Q --> Mix[grain_plus_from]
  Mix --> Bad[400]
```

Mes UI: FE setea `from=YYYY-MM-01`, `to=último día`. La API no recibe `month`.

---

## Filtro de productos

```mermaid
sequenceDiagram
  participant UI as Reportes
  participant API as GET_reports
  participant Svc as getProviderReportRange
  participant DB as PostgreSQL

  UI->>API: from to productIds cookie
  API->>API: requireRole PROVIDER
  API->>Svc: own provider plus window
  alt productIds vacio
    Svc->>DB: OrderItem con movimiento en ventana
  else ids
    Svc->>DB: ids propios o 403
  end
  Svc-->>API: kpis products series
  API-->>UI: envelope
  UI->>UI: window.print CSS
```

Sentinel `quickSale` = `providerProductId IS NULL`. Print = FE (`US-DASH-09`). PDF corte F10 = Should.

---

## Qué no entra

- Editar `fase-6/`.
- ADMIN `providerId` ajeno.
- CSV / CFDI / email.

---

## Referencias

- [`../api/API-PROVIDER-REPORTS-02.md`](../api/API-PROVIDER-REPORTS-02.md)
- [`../api/API-DASH-NOTES-01.md`](../api/API-DASH-NOTES-01.md)
- [`../../comun/adrs/ADR-033-report-date-range.md`](../../comun/adrs/ADR-033-report-date-range.md)
