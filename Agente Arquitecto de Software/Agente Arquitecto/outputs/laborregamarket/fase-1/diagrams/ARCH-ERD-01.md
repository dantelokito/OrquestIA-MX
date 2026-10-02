# ARCH-ERD-01 — Diagrama entidad-relación

> **Componente / Flujo:** Modelo de datos completo LaBorregaMarket v0.1.0  
> **Fecha:** 05/08/2026

---

## ERD completo

```mermaid
erDiagram
  User ||--o| Provider : "has_one if PROVIDER"
  User ||--o{ Order : "places as client"
  User ||--o{ AuditLog : "performs"
  Provider ||--o{ ProviderProduct : "offers"
  Provider ||--o{ Order : "receives"
  Product ||--o{ ProviderProduct : "instantiated_as"
  Product ||--o{ OrderItem : "referenced_in"
  ProviderProduct ||--o{ OrderItem : "price_snapshot"
  Order ||--o{ OrderItem : "contains"
  Module ||--o{ RolePermission : "grants"

  User {
    string id PK
    string email UK
    string passwordHash
    string name
    string phone
    UserRole role
    boolean isActive
    datetime createdAt
    datetime updatedAt
  }

  Provider {
    string id PK
    string userId FK_UK
    string businessName
    string description
    string address
    string city
    string state
    float latitude
    float longitude
    string phone
    string logoUrl
    string coverUrl
    float rating
    int reviewCount
    boolean isActive
    boolean isVerified
    datetime createdAt
    datetime updatedAt
  }

  Product {
    string id PK
    string name
    string slug UK
    string description
    ProductCategory category
    ProductUnit unit
    string imageUrl
    boolean isActive
    datetime createdAt
    datetime updatedAt
  }

  ProviderProduct {
    string id PK
    string providerId FK
    string productId FK
    decimal price
    boolean isAvailable
    int stock
    datetime createdAt
    datetime updatedAt
  }

  Order {
    string id PK
    string clientId FK
    string providerId FK
    OrderStatus status
    decimal total
    string notes
    datetime createdAt
    datetime updatedAt
  }

  OrderItem {
    string id PK
    string orderId FK
    string productId FK
    string providerProductId FK
    decimal quantity
    decimal unitPrice
    decimal subtotal
  }

  Module {
    string id PK
    SystemModule code UK
    string name
    string description
    boolean isActive
    datetime createdAt
  }

  RolePermission {
    string id PK
    UserRole role
    string moduleId FK
    boolean canView
    boolean canCreate
    boolean canEdit
    boolean canDelete
    datetime createdAt
    datetime updatedAt
  }

  AuditLog {
    string id PK
    SystemModule module
    AuditAction action
    string entityId
    string userId FK
    json details
    string ipAddress
    datetime createdAt
  }
```

---

## Cardinalidades clave

| Relación | Cardinalidad | Regla |
|----------|--------------|-------|
| User → Provider | 1:0..1 | Solo si `role=PROVIDER` |
| Provider → ProviderProduct | 1:N | Un negocio, muchos productos |
| Product → ProviderProduct | 1:N | Un producto global, N instancias por proveedor |
| ProviderProduct | Unique(providerId, productId) | Sin duplicados |
| User → Order | 1:N | Cliente hace múltiples pedidos (Fase 2) |
| Module → RolePermission | 1:N | Permisos por rol y módulo |

---

## Enums del dominio

### UserRole
`CLIENT` | `PROVIDER` | `ADMIN`

### OrderStatus (Fase 2)
`PENDING` | `CONFIRMED` | `IN_TRANSIT` | `DELIVERED` | `CANCELLED`

### AuditAction
`CREATE` | `UPDATE` | `DELETE` | `LOGIN` | `LOGOUT` | `ENABLE` | `DISABLE` | `VIEW`

### SystemModule
`USERS` | `PROVIDERS` | `PRODUCTS` | `ORDERS` | `PERMISSIONS` | `AUTH` | `AUDIT`

---

## Índices propuestos (MVP)

| Tabla | Índice | Propósito |
|-------|--------|-----------|
| `providers` | `(city)` | Filtro explorar por ciudad |
| `providers` | `(business_name)` | Búsqueda `q` por nombre |
| `providers` | `(is_active, is_verified)` | Chip filtro "verificado" |
| `audit_logs` | `(module, created_at)` | Ya existe — paginación admin |
| `audit_logs` | `(user_id)` | Ya existe — filtro por usuario |

---

## Tablas por fase

| Fase | Tablas activas en flujo |
|------|-------------------------|
| MVP Fase 1 | `users`, `providers`, `products`, `provider_products`, `modules`, `role_permissions`, `audit_logs` |
| Fase 2 | + `orders`, `order_items` |

---

## Referencias

- Detalle entidades: [`../data-model/`](../data-model/)
- Schema Prisma: `LaBorregaMarket/prisma/schema.prisma`
- Seed: `LaBorregaMarket/prisma/seed.ts`
