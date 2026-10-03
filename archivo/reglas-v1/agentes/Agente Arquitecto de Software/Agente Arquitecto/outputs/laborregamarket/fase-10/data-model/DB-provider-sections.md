# DB-provider-sections — ProviderSection

> **Entidad:** `provider_sections`  
> **Módulo:** `PRODUCTS`  
> **Fecha:** 28/08/2026  
> **Versión:** 0.10.2  
> **ADR:** [`../../comun/adrs/ADR-030-provider-section.md`](../../comun/adrs/ADR-030-provider-section.md)

## Inputs Utilizados

- **PRD:** `Administrador de producto/.../fase-10/prd.md`
- **US:** `US-CAT-03`
- **CO:** `CO-F10-001`

---

## ProviderSection

| Campo | Tipo de Dato | Restricción | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `String` (cuid) | PRIMARY KEY, NOT NULL | Identificador |
| `provider_id` | `String` | FK → `providers.id`, NOT NULL, `ON DELETE CASCADE` | Negocio dueño |
| `name` | `String` | NOT NULL | Nombre visible (1–40, trim, sin HTML) |
| `name_normalized` | `String` | NOT NULL | `lower(trim(name))` para unique case-insensitive |
| `sort_order` | `Int` | NOT NULL, DEFAULT 0 | Orden de agrupación (menor = primero) |
| `created_at` | `DateTime` | NOT NULL | Alta |
| `updated_at` | `DateTime` | NOT NULL | Última modificación |

```prisma
model ProviderSection {
  id              String   @id @default(cuid())
  providerId      String   @map("provider_id")
  name            String
  nameNormalized  String   @map("name_normalized")
  sortOrder       Int      @default(0) @map("sort_order")
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  provider         Provider          @relation(fields: [providerId], references: [id], onDelete: Cascade)
  providerProducts ProviderProduct[]

  @@unique([providerId, nameNormalized])
  @@index([providerId, sortOrder])
  @@map("provider_sections")
}
```

### Reglas

1. Lista **plana** (sin `parentId`).
2. Unique por negocio en `nameNormalized`. Duplicado → 409.
3. DELETE si `providerProducts.length > 0` → 409. FK `sectionId` en `ProviderProduct` = `ON DELETE RESTRICT`.
4. Reorder: persistir `sortOrder` 0..n-1 según array de ids del dueño.
5. Otro `providerId` → 403.
6. Seed inicial Frutas/Verduras/Agrícolas = Should, no bloquea nombres custom.

### Relación 1:N

Un `ProviderSection` tiene N `ProviderProduct` (globales activados y locales). Un producto del negocio está en **una** sección o en ninguna (`sectionId` null = histórico GLOBAL).

---

## Índices

| Tabla | Índice | Estado |
|-------|--------|--------|
| `provider_sections` | UK `(provider_id, name_normalized)` | Must F10 |
| `provider_sections` | `(provider_id, sort_order)` | Must F10 |
| `provider_products` | `(section_id)` | Implícito FK |

---

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-10/data-model/DB-provider-sections.md`
- **Agente Downstream:** Backend Developer
- **Inputs Requeridos:** ADR-030, `US-CAT-03`
