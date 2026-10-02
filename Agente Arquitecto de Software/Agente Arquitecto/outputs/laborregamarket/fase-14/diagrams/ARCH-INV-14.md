# ARCH-INV-14 — Merma y ajuste vs venta blanda

> **Componente / Flujo:** Inventario aditivo F14 (sin kardex de ventas)

```mermaid
flowchart TD
  subgraph ui [Panel PROVIDER sucursal activa]
    SheetM[Sheet Registrar merma]
    SheetA[Sheet Ajuste conteo]
    ListM[GET movimientos]
    Pos[POS cobrar]
  end

  subgraph api [API Routes]
    PostM["POST .../shrinkage"]
    PostA["POST .../adjustments"]
    GetMov["GET .../movements"]
    PostSale["POST /api/provider/pos/sales"]
    PostEnt["POST .../entries"]
  end

  subgraph svc [inventory.service]
    Tx["Transacción: leer onHand + validar + escribir"]
    Soft["decrementOnHandForLines — NO se toca"]
  end

  subgraph db [(PostgreSQL)]
    PP["ProviderProduct.onHand"]
    IE["InventoryEntry kind ENTRADA MERMA AJUSTE"]
  end

  SheetM --> PostM
  SheetA --> PostA
  ListM --> GetMov
  Pos --> PostSale
  PostEnt --> Tx
  PostM --> Tx
  PostA --> Tx
  Tx -->|si onHandAfter menor 0| E400[400 INVENTORY_NEGATIVE_NOT_ALLOWED]
  Tx -->|ok| PP
  Tx --> IE
  GetMov --> IE
  PostSale --> Soft
  Soft --> PP
  Soft -.->|sin fila movimiento| IE
```

Venta POS puede dejar `onHand` negativo (ADR-036). Merma/ajuste no. Descarte `US-INV-07` no entra a este diagrama.

## Inputs Utilizados

- ADR-040, API-INVENTORY-14

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/diagrams/ARCH-INV-14.md`
- **Agente Downstream:** Backend Developer
