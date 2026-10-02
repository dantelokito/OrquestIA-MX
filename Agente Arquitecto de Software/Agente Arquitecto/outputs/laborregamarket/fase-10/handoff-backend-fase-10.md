# Handoff Backend Developer — LaBorregaMarket Fase 10 (v0.10.2)

> **De:** Agente Arquitecto de Software  
> **Para:** @Backend Developer  
> **Fecha:** 28/08/2026  
> **Prioridad:** SEC → CAT/MEDIA → DASH. No adelantar DASH ni CAT si SEC no cierra IDOR/401/403 en rutas nuevas  
> **No implementar:** Cloudinary/S3, auto-global, secciones anidadas, chips Explorar de sección, CRUD usuarios, 2FA, impersonation, Maps JS, Places, pan→radio, pasarela/CFDI, editar `fase-6/`, Redis/CI YAML F6, ADMIN DASH ajeno, CSV, reopen F7/F8/F9

---

## Estado: LISTO PARA IMPLEMENTAR

**Punto de entrada:** este archivo + [`../STATUS.md`](../STATUS.md) + [`../comun/sad.md`](../comun/sad.md)

Código: `C:\Users\PC GAMER\LaBorregaMarket`

`CO-F10-001` revoca A5 (SKU local). `CO-F10-002` disco. `CO-F10-003` rango Reportes. `CO-F7-001` y Explorar F9 **no se tocan**. **Migración Prisma Must.**

---

## Orden de implementación

```
1. SEC — requireAdminModule en /api/admin/*; catalogs products solo GLOBAL;
   assertNotLastAdmin + tests unitarios; 401/403 en cada ruta nueva (DEV-P2-011)
2. CAT — migración scope + ProviderSection + sectionId + imageUrl instancia
3. MEDIA — local-disk, GET /api/media, reemplazar Cloudinary en POSTs F2,
   POST imagen de ProviderProduct
4. ADMIN products CRUD + PATCH flags provider (US-REV-04 intacto)
5. PROVIDER local-products + sections CRUD/reorder/delete-vacía
6. DASH — XOR from/to vs grain/date; productIds + quickSale; tests IDOR
```

US-DASH-09: **cero trabajo BE Must.** US-ADMIN-04 promover: **Should**, no bloquea.

---

## Contratos

| Slice | Archivo |
|-------|---------|
| SEC | [`api/API-ADMIN-SEC-01.md`](./api/API-ADMIN-SEC-01.md) |
| CRUD global | [`api/API-ADMIN-PRODUCTS-01.md`](./api/API-ADMIN-PRODUCTS-01.md) |
| Flags | [`api/API-ADMIN-PROVIDERS-01.md`](./api/API-ADMIN-PROVIDERS-01.md) |
| Local | [`api/API-PROVIDER-PRODUCTS-02.md`](./api/API-PROVIDER-PRODUCTS-02.md) |
| Secciones | [`api/API-PROVIDER-SECTIONS-01.md`](./api/API-PROVIDER-SECTIONS-01.md) |
| Disco | [`api/API-MEDIA-02.md`](./api/API-MEDIA-02.md) |
| Reports | [`api/API-PROVIDER-REPORTS-02.md`](./api/API-PROVIDER-REPORTS-02.md) |
| Print | [`api/API-DASH-NOTES-01.md`](./api/API-DASH-NOTES-01.md) — no BE |

ADRs: [`ADR-029`](../comun/adrs/ADR-029-dual-sku.md), [`ADR-030`](../comun/adrs/ADR-030-provider-section.md), [`ADR-031`](../comun/adrs/ADR-031-last-admin.md), [`ADR-032`](../comun/adrs/ADR-032-disk-image-storage.md), [`ADR-033`](../comun/adrs/ADR-033-report-date-range.md). ADR-006 **Aparcado**.

DB: [`data-model/DB-products.md`](./data-model/DB-products.md), [`data-model/DB-provider-sections.md`](./data-model/DB-provider-sections.md).

---

## 1 — SEC (Must primero)

Código hoy: `GET /api/catalogs` ya usa `getCatalogModule` + `hasModulePermission`. Las rutas `src/app/api/admin/**` solo `requireRole(ADMIN)`.

Introducir `requireAdminModule(request, SystemModule.X, "view"|"create"|"edit"|"delete")` y aplicarlo a:

- GET/PATCH providers, GET audit, GET analytics, DELETE reviews, POST product image, y las rutas **nuevas** F10.

Mapa: ver API-ADMIN-SEC-01. Analytics → `ORDERS/view`. Reviews admin → `ORDERS/delete`.

`GET /api/catalogs?catalog=products` → filtrar `scope=GLOBAL`.

`assertNotLastAdmin`: unit tests Must. Sin ruta de usuarios (Won't).

---

## 2 — Migración

Nombre: `add_product_scope_sections_media`.

- Enum `ProductScope`. Backfill GLOBAL.
- `Product.ownerProviderId`, `category` opcional.
- Drop unique global de `slug`; índices parciales SQL (ADR-029).
- `ProviderSection` + unique `(providerId, nameNormalized)`.
- `ProviderProduct.sectionId` (Restrict) + `imageUrl`.

CHECK de aplicación en servicios (GLOBAL sin owner + category; LOCAL con owner sin category).

---

## 3 — CAT / ADMIN

| Trabajo | Notas |
|---------|--------|
| `POST/GET/PATCH /api/admin/products` | Solo GLOBAL. Hard-delete → 409 si PP u OrderItem. Sin DELETE HTTP (405) |
| `PATCH /api/admin/providers/[id]` | Añadir `isActive`, `offersWholesale`, `offersDelivery` a `patchAdminProviderSchema`. `isVerified=false` → `googleReviewsEnabled=false` misma tx |
| `POST /api/provider/local-products` | Tx Product LOCAL + ProviderProduct. `sectionId` propio. Rate 30/h |
| `PATCH /api/provider/local-products/[id]` | IDOR 403. No usar para GLOBAL |
| `GET /api/provider/products` | GLOBAL activos + LOCAL propios. `scope`, `sectionId`, `imageUrl` resuelto |
| `GET /api/providers/[id]` products | Vendibles + `section*`. LOCAL solo de ese id |
| Listing `q` | Puede matchear nombre LOCAL de esa frutería; `category=` solo GLOBAL |
| Sections CRUD | Delete solo vacía 409. Reorder permutación exacta |

Vendible = ADR-022 (`isAvailable` + `Product.isActive`). Encargar/POS 409.

Activar GLOBAL ajeno sobre un Product LOCAL → **403**.

---

## 4 — MEDIA

Reemplazar `src/lib/storage/cloudinary.ts` en el flujo de upload (no hace falta borrar el archivo si URLs viejas siguen). Nuevo `local-disk.ts`.

- `UPLOADS_DIR` (default `./uploads`, gitignore).
- Magic bytes (`file-type` o equiv.). Extensión del cliente no decide.
- POST F2 paths **siguen**; URL persistida `/api/media/{cuid}.{ext}`.
- `GET /api/media/[filename]` público + realpath dentro del dir.
- `POST /api/provider/products/[providerProductId]/image` → `ProviderProduct.imageUrl`. No mutar `Product.imageUrl` GLOBAL.
- Unlink solo si URL previa era `/api/media/…`.
- ADMIN image solo GLOBAL.
- Rate 20 / 10 min. AUDIT `MEDIA_UPLOAD`.
- 500 si el volumen no existe — no mencionar Cloudinary.

---

## 5 — DASH

`GET /api/provider/reports`: parse XOR. Modo grain = F6 intacto.

Modo F10: `from`/`to` `YYYY-MM-DD`, tope 366, futuro → 400, `from>to` → 400. SQL `[fromUtc, toExclusiveUtc)` Monterrey.

`productIds` repetible = `ProviderProduct.id` o `quickSale`. Vacío = todos con movimiento. Id ajeno → **403**.

GMV filtrado por ítems = `SUM(subtotal)` de líneas incluidas (no inflar `Order.total`). `orderCount` = órdenes distintas con ≥1 línea incluida.

`products[]` completo (no top 5). `series` diaria. Empty 200.

No tocar `GET /api/provider/reports.pdf` F6. No path print.

---

## Tests Must

| Caso | Esperado |
|------|----------|
| Cada ruta nueva sin cookie | 401 |
| CLIENT en `/api/admin/*` nueva | 403 |
| ADMIN sin PRODUCTS/view en catalogs=products | 403 |
| PROVIDER PATCH sección / local-product ajeno | 403 |
| Alta local + GET detalle otra frutería | no aparece |
| `isAvailable=false` local en POST orders/POS | 409 |
| Hard-delete Product con PP | 409 |
| Delete sección con productos | 409 |
| MIME falso (ext .jpg, body no imagen) | 400, URL previa intacta |
| GET media `../` | 400 |
| Reports `grain` + `from` | 400 |
| Reports `from>to` / span 367 | 400 |
| Reports `productIds` ajeno | 403 |
| Reports GMV excluye CANCELLED | |
| `assertNotLastAdmin` último | throw/409 |
| PATCH admin `isVerified=false` | `googleReviewsEnabled=false` |

No reabrir suite Explorar F8/F9 salvo regresión accidental.

---

## Env

| Variable | Must F10 |
|----------|----------|
| `UPLOADS_DIR` | Sí staging/prod |
| `CLOUDINARY_*` | **No** |

Ver [`../comun/infra-requirements.md`](../comun/infra-requirements.md). Volumen persistente (no Vercel ephemeral).

---

## Notas Frontend (no implementar aquí)

Print CSS, demo copy en prod, agrupación por sección, atajo mes → `from`/`to`, checkboxes → `productIds`. Esperar handoff UX.

---

## Fuera de alcance

Promover LOCAL→GLOBAL (Should US-ADMIN-04), PDF corte F10, Cloudinary, S3, CI YAML, `/health`, `BL-040`, pan→radio, schema orgánico, reopen sign-off F8/F9.

## Quality

No hay `quality/REVIEW-ARCH.md` hasta cierre de SEC + CAT (+ tests de esta lista).
