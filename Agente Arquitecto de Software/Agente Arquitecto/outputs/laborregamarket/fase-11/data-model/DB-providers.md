# DB-providers — Delta 1:N (Fase 11)

> **Entidad:** `Provider` / `User`  
> **Fecha:** 12/09/2026  
> **Versión:** 0.11.0  
> **Estado:** Aprobado  
> **US:** US-AUTH-11, US-ONB-01, US-SEED-01  
> **ADR:** [`../../comun/adrs/ADR-034-user-providers-1n-active.md`](../../comun/adrs/ADR-034-user-providers-1n-active.md)  
> **Base (solo lectura):** `fase-7/data-model/DB-providers.md`, `prisma/schema.prisma`

## Inputs Utilizados

- **PRD / seed:** workspace PM `fase-11/`
- **Código:** `LaBorregaMarket/prisma/schema.prisma` (`userId @unique`, `User.provider`)

---

## Cambio de modelo

| Antes (F10) | Después (F11) |
|-------------|----------------|
| `Provider.userId String @unique` | `Provider.userId String` **sin** unique |
| `User.provider Provider?` | `User.providers Provider[]` |
| Un login = una frutería | Un login = N fruterías |

`activeProviderId` **no** es columna de `User`. Vive en cookie `lbm_active_provider` (ADR-034).

---

## Tabla `providers` (campos de relación)

| Campo | Tipo | Restricción | Descripción |
|-------|------|-------------|-------------|
| `id` | String (cuid) | PRIMARY KEY | Identidad de sucursal |
| `userId` | String | NOT NULL, FK → `users.id` ON DELETE CASCADE | Dueño. **Varias filas** por user |
| `businessName` | String | NOT NULL | Nombre público (Explorar / Admin) |
| … | (sin cambio F10) | | Flags, geo, marca, media URLs |

Resto de columnas F5–F10 se conservan. No hay tabla `UserProvider` intermedia.

---

## Índices

| Índice | Tipo | Notas |
|--------|------|-------|
| `providers_pkey` | PK `id` | Igual |
| `providers_user_id_idx` | INDEX no único `user_id` | **Reemplaza** unique `providers_user_id_key` |
| `providers_city_idx` | INDEX | Igual |
| `providers_business_name_idx` | INDEX | Igual |
| `providers_is_active_is_verified_idx` | INDEX compuesto | Igual |

Migración Prisma Must: `drop_provider_userid_unique` (nombre sugerido). SQL: `DROP INDEX IF EXISTS providers_user_id_key;` + `CREATE INDEX providers_user_id_idx ON providers(user_id);`

---

## Relaciones

| Relación | Cardinalidad | Notas |
|----------|--------------|-------|
| User → Provider | 1:N | `onDelete: Cascade` |
| Provider → ProviderProduct / ProviderSection / Order / Review | 1:N | Sin cambio: aislamiento por `providerId` |
| Product LOCAL `ownerProviderId` | N:1 Provider | Sigue por sucursal (ADR-029) |

No unique compuesto `(userId, businessName)`. Dos sucursales pueden llamarse distinto (seed: Frutas El Paraíso vs El Paraíso Tecnológico).

---

## Seed (contrato de datos)

| User | email | Providers |
|------|-------|-----------|
| Carlos Méndez | `frutas@elparaiso.mx` | (1) Frutas El Paraíso — Av. Constitución 1200, Centro; (2) **El Paraíso Tecnológico** — Av. Eugenio Garza Sada 2501, Tecnológico. Coords distintas. Password `Demo1234!` |
| Ana Ruiz | `verduras@campoverde.mx` | Solo Campo Verde Frutería (ya existe). N=1 |

Catálogo, secciones y pedidos **propios** por `providerId`. No compartir `ProviderProduct` entre las dos sucursales de El Paraíso.

---

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-11/data-model/DB-providers.md`
- **Agente Downstream:** Backend Developer
