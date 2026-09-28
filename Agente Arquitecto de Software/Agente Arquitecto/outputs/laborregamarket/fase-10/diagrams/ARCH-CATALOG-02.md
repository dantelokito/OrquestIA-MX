# ARCH-CATALOG-02 — Dual SKU y secciones (Fase 10)

> **Componente / Flujo:** Alta local, aislamiento entre fruterías, agrupación por sección  
> **Fecha:** 28/08/2026  
> **Fase:** 10 — v0.10.2  
> **ADR:** ADR-029, ADR-030

---

## Alta de producto local

```mermaid
sequenceDiagram
  participant UI as PanelProveedor
  participant API as POST_local_products
  participant Svc as catalogService
  participant DB as PostgreSQL

  UI->>API: name unit price sectionId cookie JWT
  API->>API: requireRole PROVIDER
  API->>Svc: session.sub plus payload
  Svc->>DB: resolveProviderByUserId
  Svc->>DB: sectionId belongs to provider
  Svc->>DB: tx Product LOCAL plus ProviderProduct
  Svc->>DB: AuditLog PRODUCTS CREATE
  Svc-->>API: providerProduct plus product
  API-->>UI: 201 envelope
```

---

## Aislamiento

```mermaid
flowchart TD
  LocalSku[Product_scope_LOCAL]
  LocalSku --> Owner[ownerProviderId]
  Owner --> PP[ProviderProduct_mismo_provider]
  PP --> OwnStore[fruteria_dueño_si_vendible]
  PP --> OwnPOS[POS_Encargar_dueño]
  LocalSku -.-> OtherList[otras_fruterias_activacion]
  OtherList --> Blocked[no_aparece]
  LocalSku -.-> OtherIdor[POST_ajeno]
  OtherIdor --> Forbidden[403]
```

---

## Detalle público agrupado

```mermaid
flowchart LR
  Detail[GET_providers_id]
  Detail --> Vendible[isAvailable_and_Product_isActive]
  Vendible --> GlobalAct[GLOBAL_activado]
  Vendible --> LocalOwn[LOCAL_del_dueño]
  GlobalAct --> Section[sectionId_sortOrder]
  LocalOwn --> Section
  Section --> FE[FE_agrupa]
```

`category` de Explorar **no** lee secciones. FilterBar F9 intacto.

---

## Qué no entra

- Auto-global.
- Secciones anidadas.
- Hard-delete de `Product` con ventas.

---

## Referencias

- [`../api/API-PROVIDER-PRODUCTS-02.md`](../api/API-PROVIDER-PRODUCTS-02.md)
- [`../api/API-PROVIDER-SECTIONS-01.md`](../api/API-PROVIDER-SECTIONS-01.md)
- [`../../comun/adrs/ADR-029-dual-sku.md`](../../comun/adrs/ADR-029-dual-sku.md)
- [`../../comun/adrs/ADR-030-provider-section.md`](../../comun/adrs/ADR-030-provider-section.md)
