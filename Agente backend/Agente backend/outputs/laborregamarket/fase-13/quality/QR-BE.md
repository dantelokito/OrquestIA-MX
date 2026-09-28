# Quality Report Backend — Fase 13

> **Fecha:** 16/09/2026  
> **Proyecto:** laborregamarket  
> **Agente:** Backend Developer

## Inputs Utilizados

- Handoff Arquitecto `fase-13/handoff-backend-fase-13.md`
- Contratos API-ADMIN-PRODUCTS-13, API-PROVIDER-ARCHIVE-13, API-PROVIDER-OFFER-13, API-PROVIDER-PRICE-13, API-INVENTORY-13, API-SELLABLE-13, API-PROVIDER-REPORTS-INV-13
- DB-provider-products, DB-inventory-entries, DB-provider-product-price-history
- ADR-038 (archivo vs delete; saleUnit)

## Checklist recepción 00–01

- [x] Contratos con método, path, auth, body, 200, 4xx/5xx
- [x] Unique `(providerId, productId)` intacta
- [x] DELETE 405; `isAvailable` intacto
- [x] Cero 4xx de stock en venta; 409 Encargar solo unidad/factor
- [x] Ocultar con Encargar = 2xx
- [x] Baseline F12 en `main` (PR #12 mergeado: `ac166e7`)

Sin `API-INCOMPLETOS.md` / retorno al Arquitecto.

## Alcance Must cerrado

| Ítem | Evidencia |
|------|-----------|
| Prisma `archivedAt`, `saleUnit`, `InventoryEntry`, `ProviderProductPriceHistory` | `schema.prisma` + migración `20260916180000_f13_archivo_oferta_unidad` |
| Admin GET GLOBAL+LOCAL, default 50/máx 100, PATCH LOCAL solo `isActive` | `admin-product.service.ts` |
| DELETE 405 admin/provider/local | `method-not-allowed.ts` |
| Archive/restore + stub GLOBAL + `?archived=` | `archiveProviderOffer` / GET panel |
| `sellableProviderProductWhere` + 409 POS/Encargar | `src/lib/catalog/sellable.ts`, `order.service.ts`, `pos.service.ts` |
| PATCH oferta `saleUnit`/factor, 409 Encargar, `confirmDiscard` | `patchOfferByProduct`, inventory PATCH |
| Precio + historial | PATCH `.../price`, GET `.../price-history` |
| POST entries inserta fila; reportes inventario sucursal y global N>1 | `addInventoryEntry`, `inventory-report.service.ts` |
| Ventas sin filtrar archivo/`is_available` | `topProductsQuery` |

Won't: kardex, backfill F12, Cloudinary, BL-040, hard-delete, US-CAT-17, mutar `Product.unit` GLOBAL.

## Tests

```
cd C:\Users\PC GAMER\LaBorregaMarket
npx vitest run
```

Resultado: **376 passed**, 81 files, 16/09/2026 (incluye `tests/integration/inventory-entries.routes.test.ts` BUG-020).

**BUG-020:** import de `inventoryEntrySchema` restaurado; 409 `Oferta oculta` en POST entries. Evidencia: [`EVIDENCIA-BUG-020.md`](./EVIDENCIA-BUG-020.md).

`npx prisma generate` puede fallar con EPERM si el engine DLL está bloqueado (mismo síntoma F12). Los tipos F13 sí quedaron en `node_modules/.prisma/client`.

## Rama

`feat/f13-archivo-oferta-unidad` desde `main` **con F12**. Sin push/merge a `main`.

## Outputs Generados

- `fase-13/quality/QR-BE.md`
- `fase-13/module-handoffs/MOD-CATALOG-F13-handoff.md`
- `fase-13/handoff-frontend.md`
