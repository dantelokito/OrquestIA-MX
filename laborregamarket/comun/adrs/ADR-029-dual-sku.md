# ADR-029 — Dual SKU: Producto global vs local

> **Estado:** Aceptado  
> **Fecha:** 2026-08-28  
> **Decisores:** Arquitecto de Software  
> **Fase:** 10 — v0.10.2  
> **US:** US-CAT-02, US-ADMIN-02, US-ADMIN-04 (Should)  
> **CO:** CO-F10-001 (revoca A5 para el catálogo del negocio)

---

#### 1. Contexto y Problema:

Hasta F9, `Product` es el catálogo **comparable** de plataforma (solo ADMIN crea) y `ProviderProduct` es la instancia del negocio (`@@unique([providerId, productId])`). `CO-F10-001` permite que el PROVIDER cree un SKU **solo de su frutería**: no comparable, no visible en otra tienda, vendible en Encargar/POS del dueño. Si ese local **no** es un `Product`, el unique actual no alcanza y `OrderItem.productId` / `providerProductId` se vuelven polimórficos.

---

#### 2. Opciones Consideradas:

* **Opción A — `Product.scope` GLOBAL \| LOCAL + `ownerProviderId` nullable:** Pros: `ProviderProduct` y `OrderItem` no cambian de forma; el unique `[providerId, productId]` sigue; vendible reusa ADR-022. Contras: `slug` deja de ser único global (índices parciales); `category` del enum de plataforma no aplica a locales.
* **Opción B — Tabla `LocalProduct` aparte + XOR en `ProviderProduct`:** Pros: el catálogo global queda limpio. Contras: `productId` nullable, unique dual, `OrderItem` polimórfico, más joins y deuda.
* **Opción C — Campos locales colgados de `ProviderProduct` sin fila `Product`:** Pros: una tabla menos. Contras: rompe FKs de pedido; unique `[providerId, productId]` no modela el local.

---

#### 3. Decisión Elegida:

**Opción A.** El SKU local **es** un `Product` con `scope=LOCAL` y `ownerProviderId` = el `Provider` dueño.

### Reglas

| Regla | GLOBAL | LOCAL |
|-------|--------|-------|
| Quién crea | ADMIN (`POST /api/admin/products`) | PROVIDER dueño (`POST /api/provider/local-products`) |
| `ownerProviderId` | `null` | NOT NULL = ese negocio |
| `category` | Requerida `FRUTA\|VERDURA\|AGRICOLA` | `null` (agrupa por sección, ADR-030) |
| `slug` | Unique **parcial** `WHERE scope=GLOBAL` | Unique **parcial** `(ownerProviderId, slug) WHERE scope=LOCAL` |
| Activación ajena | Otras fruterías crean `ProviderProduct` | **Prohibido.** Solo existe `ProviderProduct` del dueño (misma transacción de alta) |
| Explorar `category=` | Sí | No (no es taxonomía de plataforma) |
| Explorar `q` | Nombre comparable | Puede matchear el nombre **de esa** frutería (descubrimiento, no precio comparable) |
| Vendible | `ProviderProduct.isAvailable` + `Product.isActive` (ADR-022) | Igual. Inhabilitar oculta y 409 en orden/POS |

### Alta local (transacción)

1. Insertar `Product` (`scope=LOCAL`, `ownerProviderId`, `isActive=true`, `category=null`).
2. Insertar `ProviderProduct` (precio, `isAvailable`, `sectionId` del mismo `providerId`).
3. `AuditLog` `PRODUCTS` / `CREATE`.

Si el paso 2 falla, rollback: no queda un local huérfano.

### Listados

- `GET /api/provider/products` (panel): todos los GLOBAL `isActive=true` (con o sin instancia) **más** los LOCAL del dueño. **No** locales ajenos.
- `GET /api/providers/[id]` `products[]`: vendibles de **ese** provider (globales activados + locales propios).
- `GET /api/catalogs?catalog=products` y CRUD admin: **solo** `scope=GLOBAL`.

### Unique `ProviderProduct`

Se **conserva** `@@unique([providerId, productId])`. Un local no puede activarse en otra frutería porque no aparece en su listado de activación y el POST de instancia ajena sobre un `Product` LOCAL → **403**.

### Promover (Should, US-ADMIN-04)

Transacción ADMIN: el `Product` LOCAL pasa a `scope=GLOBAL`, `ownerProviderId=null`, `category` de plataforma + `slug` único global. El `ProviderProduct` del origen **permanece** (sigue vendiéndolo). Otras fruterías ya pueden crear instancia. Conflicto de slug → **409**. No es Must F10.

### Qué NO hacer

- Tabla `LocalProduct`.
- Auto-promoción al crear.
- `ProviderProduct.isActive` (sigue `isAvailable`, T9).
- Schema orgánico.
- Chips FilterBar de secciones custom.

---

#### 4. Consecuencias e Impacto:

* **Positivas:** Pedidos y unique actuales siguen; aislamiento por `ownerProviderId` + filtro de listados; A5 revocada solo para locales.
* **Riesgos / Compensaciones:** Índices únicos parciales vía SQL en la migración (Prisma no expresa `WHERE` en `@@unique`). Queries de panel y explorar deben filtrar `scope` de forma explícita.

## Referencias

- US-CAT-02, US-ADMIN-02, D-F10-5
- Delta DB: [`../../fase-10/data-model/DB-products.md`](../../fase-10/data-model/DB-products.md)
- API local: [`../../fase-10/api/API-PROVIDER-PRODUCTS-02.md`](../../fase-10/api/API-PROVIDER-PRODUCTS-02.md)
- Vendible: [ADR-022](./ADR-022-catalog-inactive.md)
