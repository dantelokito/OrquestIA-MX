# ARCH-INV-01 — Inventario blando y reservas Encargar

> **Componente / Flujo:** Existencias por sucursal activa, entrada, POS cobro, Encargar  
> **Fecha:** 2026-09-14  
> **Fase:** 12  
> **US:** US-INV-01 … US-INV-06

```mermaid
graph TD
    FE[Panel PROVIDER sucursal activa] -->|HTTPS REST sin /api/v1| API[API Routes Next.js]
    FE2[Cliente /fruteria] -->|GET providers sin stock| API
    API -->|JWT + cookie lbm_active_provider| Auth[resolveActiveProvider]
    Auth -->|403 IDOR si B| API
    API --> InvSvc[InventoryService]
    InvSvc --> PP[(ProviderProduct onHand Decimal)]
    InvSvc --> Ord[(Order MARKETPLACE)]
    InvSvc -->|reserved computed SUM| Ord
    POS[POST pos/sales] -->|onHand -= qty nunca 4xx stock| PP
    ENT[POST entries] -->|onHand += qty o qty*factor| PP
    MK[POST /api/orders] -->|409 solo ADR-022| Ord
    DEL[PATCH DELIVERED] -->|commit onHand -= Q| PP
    CAN[PATCH CANCELLED] -->|sale del SUM reserved| Ord
```

## Límites

- Disco media F10: GET `/api/media/{opaque}` sin existencias.
- Sin cola nueva. Sin Cloudinary. Sin kardex.

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-12/diagrams/ARCH-INV-01.md`
- **Agente Downstream:** Backend, Frontend
