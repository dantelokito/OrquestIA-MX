# QG cobertura Backend — Fase 13

> **Rol:** Product Manager (gate de cobertura, **no** `QG-correcciones` post-QA).
> **Fecha:** 16/09/2026
> **Implementación:** bloqueada hasta handoff Arquitecto → Backend.

El Arquitecto baja contratos; este QG es el mínimo que Backend debe poder testear cuando implemente.

## Must

- [ ] Migración Prisma: `ProviderProduct.archivedAt` `DateTime?`. Unique `(providerId, productId)` intacto. Persistencia de **unidad de oferta** (campo que defina Arquitecto) **sin** mutar `Product.unit` GLOBAL.
- [ ] `GET` admin productos: GLOBAL **y** LOCAL; filtros `q`, `scope`, `isActive`, dueño; `meta.page/limit/total/totalPages`; default 50, max 100.
- [ ] `PATCH` admin `isActive` en LOCAL y GLOBAL; DELETE admin **405**.
- [ ] Ocultar/restaurar oferta de la sucursal activa (PATCH o POST documentado). GLOBAL sin oferta → **crea** fila archivada. Ocultar con Encargar activo → **2xx** (no 409).
- [ ] GET dashboard proveedor **excluye** archivados. Query/endpoint de bandeja (`?archived=1` o equivalente). GET incluye GLOBAL nuevos del admin (D-F13-23).
- [ ] `sellableProviderProductWhere` (o sucesor) exige no archivado además de `isAvailable` + `product.isActive`.
- [ ] Orders y POS: 409 si la oferta está archivada o el SKU inactivo.
- [ ] Reportes sucursal y globales: GMV/top/series con `OrderItem` aunque `archivedAt` o `isActive=false`.
- [ ] Inventario GET: sin filas archivadas. Unidad expuesta = unidad de oferta o fallback al maestro.
- [ ] IDOR: 403 entre sucursales del mismo user. Rate limit altas F10 intacto.
- [ ] AUDIT PRODUCTS DISABLE/ENABLE con `details.archived`.
- [ ] Tests unit/integration: archivo, restaurar, unique, 405 DELETE, listado admin LOCAL, vendible público, unidad de oferta GLOBAL vs maestro.
- [ ] Alta/PATCH LOCAL acepta `ProductUnit` completo (incl. CAJA) y `boxContentFactor`. PATCH/upsert GLOBAL acepta unidad de **oferta** + `boxContentFactor`; **403/400** si intenta mutar `Product.unit` o nombre del maestro. Factor obligatorio si unidad de venta = CAJA.
- [ ] Primera edición de GLOBAL sin oferta **crea** `ProviderProduct`. Fallback de unidad: maestro hasta el primer Editar.
- [ ] PATCH unidad o factor: si hay Encargar activo → **409** sin mutar. Si on-hand ≠ 0 y confirma (flag de confirmación en contrato) → `onHand = 0` en transacción **sin** insertar fila de entrada.
- [ ] PATCH/upsert precio de oferta GLOBAL y LOCAL por sucursal; **no** mutar precio de `Product` GLOBAL; IDOR entre sucursales.
- [ ] Persistencia de historial de precio por `providerProductId` (alta y cambios); GET historial 403 cruzado.
- [ ] `addInventoryEntry` inserta fila de entrada **y** incrementa `onHand`. GET reporte inventario sucursal: saldos actuales + entradas (descarte no es entrada).
- [ ] GET inventario consolidado N>1: solo on-hand actual por sucursal; **sin** entradas; 403 si N=1.
- [ ] Reportes de ventas siguen leyendo `OrderItem.unitPrice` (no el precio actual de catálogo).
- [ ] 100% tests del módulo en verde antes de handoff QA.

## No hacer

- DELETE de `products` o `provider_products`.
- Filtrar reportes por productos activos.
- Encender `canDelete` PROVIDER.
- Cancelar Encargar en automático al cambiar unidad **ni** al ocultar.
- Permitir al PROVIDER mutar `Product.unit` **o el nombre** de un GLOBAL.
- Crear un `Product` LOCAL nuevo solo porque cambió el precio **o la unidad** de un GLOBAL.
- Backfill de entradas F12. Kardex de POS/Encargar/descarte.
