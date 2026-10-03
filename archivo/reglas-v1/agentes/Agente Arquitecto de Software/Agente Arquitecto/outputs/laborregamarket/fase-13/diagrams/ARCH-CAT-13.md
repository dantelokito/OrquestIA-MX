# ARCH-CAT-13 — Archivo, unidad de oferta y reportes inventario

> **Componente / Flujo:** Fase 13 — visibilidad admin, archivo de oferta, unidad/precio por sucursal, entradas  
> **Fecha:** 2026-09-16  
> **ADR:** ADR-038

```mermaid
flowchart TD
  Admin[ADMIN JWT] -->|GET PATCH 405| AdminAPI["/api/admin/products"]
  Prov[PROVIDER + cookie activo] -->|panel bandeja upsert archivo| CatAPI["/api/provider/products*"]
  Prov -->|entradas ficha descarte| InvAPI["/api/provider/inventory*"]
  Prov -->|KPI ventas + inventario| RepAPI["/api/provider/reports*"]
  Pub[Cliente / POS] -->|sellableWhere| PubAPI["público / POS / orders"]

  AdminAPI --> Product[(products GLOBAL+LOCAL)]
  CatAPI --> PP[(provider_products archivedAt saleUnit)]
  InvAPI --> PP
  InvAPI --> IE[(inventory_entries)]
  CatAPI --> PH[(price_history)]
  PubAPI --> PP
  RepAPI --> OI[(order_items snapshot)]
  RepAPI --> PP
  RepAPI --> IE
```

Reglas: JWT + IDOR 403. Envelope ADR-003. Sin `/api/v1/` (ADR-002). Público sin `archivedAt`. Reportes ventas no JOIN-filtran archivo.

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-13/diagrams/ARCH-CAT-13.md`
- **Agente Downstream:** Backend, Frontend (notas en handoff)
