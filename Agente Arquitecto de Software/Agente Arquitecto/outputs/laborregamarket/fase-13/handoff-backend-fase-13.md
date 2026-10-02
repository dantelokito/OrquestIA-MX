# Handoff: Arquitecto de Software → Backend Developer

## Metadata

- **Fecha:** 2026-09-16
- **Timestamp:** 2026-09-16
- **Fase:** 13
- **Proyecto:** laborregamarket
- **Agente Emisor:** Arquitecto de Software
- **Agente Receptor:** Backend Developer
- **Prioridad:** ADMIN LIST → ADMIN MOD → ARCHIVO → VENDIBLE → UNIDAD OFERTA → DESCARTE → PRECIO → ENTRADAS → REPORTES INV
- **Estado:** LISTO PARA IMPLEMENTAR (el orquestador activa Backend; este handoff **no** lanza el agente).

Código (solo Backend escribe): `C:\Users\PC GAMER\LaBorregaMarket`  
STATUS Arch: [`../STATUS.md`](../STATUS.md)

Paths REST **sin** `/api/v1/` (ADR-002). Envelope ADR-003. JWT + IDOR 403 (F11). Baseline inventario F12 se **asume en diseño**; no asumas merge de [PR #12](https://github.com/dantelokito/BorregaMarket/pull/12) en `main`.

**No implementar:** kardex, backfill F12, Cloudinary, BL-040, hard-delete, US-CAT-17, mutar `Product.unit` GLOBAL, filtrar ventas por archivo.

---

## Orden de implementación

```
1. Prisma: archivedAt, saleUnit, InventoryEntry, ProviderProductPriceHistory; unique provider_products intacta
2. GET/PATCH admin products GLOBAL+LOCAL; DELETE 405
3. Archive/restore + GET panel ?archived= ; AUDIT details.archived
4. sellableWhere + 409 POS/orders/público
5. PATCH oferta saleUnit/factor + LOCAL alta/editar enum completo; 409 Encargar; confirmDiscard
6. PATCH precio + GET historial
7. POST entries inserta fila; GET reportes inventario sucursal y global N>1
8. Tests unit/integration del QG PM
```

---

## Entregables

| Archivo | Tipo | Estado |
|---------|------|--------|
| [`api/API-ADMIN-PRODUCTS-13.md`](./api/API-ADMIN-PRODUCTS-13.md) | Contrato | Completo |
| [`api/API-PROVIDER-ARCHIVE-13.md`](./api/API-PROVIDER-ARCHIVE-13.md) | Contrato | Completo |
| [`api/API-PROVIDER-OFFER-13.md`](./api/API-PROVIDER-OFFER-13.md) | Contrato | Completo |
| [`api/API-PROVIDER-PRICE-13.md`](./api/API-PROVIDER-PRICE-13.md) | Contrato | Completo |
| [`api/API-INVENTORY-13.md`](./api/API-INVENTORY-13.md) | Contrato | Completo |
| [`api/API-SELLABLE-13.md`](./api/API-SELLABLE-13.md) | Contrato | Completo |
| [`api/API-PROVIDER-REPORTS-INV-13.md`](./api/API-PROVIDER-REPORTS-INV-13.md) | Contrato | Completo |
| [`data-model/DB-provider-products.md`](./data-model/DB-provider-products.md) | Esquema | Completo |
| [`data-model/DB-inventory-entries.md`](./data-model/DB-inventory-entries.md) | Esquema | Completo |
| [`data-model/DB-provider-product-price-history.md`](./data-model/DB-provider-product-price-history.md) | Esquema | Completo |
| [`diagrams/ARCH-CAT-13.md`](./diagrams/ARCH-CAT-13.md) | Diagrama | Completo |
| [`../comun/adrs/ADR-038-archivo-oferta-unidad.md`](../comun/adrs/ADR-038-archivo-oferta-unidad.md) | ADR | Aprobado |

## Notas Frontend (este workspace; no editar el de FE)

Consumir los mismos JSON. Panel: `?archived=1`, `effectiveSaleUnit`, `confirmDiscard`. Print inventario = FE. UX puede seguir en paralelo (UF/WF). Handoff FE lo emite UX cuando existan wireframes.

## Notas DevOps

Sin variables nuevas Must. Sin bucket. Migración Prisma en el PR de app (humano mergea). No push a `main`.

## Archivos de código sugeridos

| Área | Ruta actual |
|------|-------------|
| Schema | `prisma/schema.prisma` |
| Admin | `src/lib/services/admin-product.service.ts`, `src/app/api/admin/products` |
| Panel | `product.service` / `src/app/api/provider/products` |
| Inventario | `inventory.service.ts` |
| POS / orders | rutas F12 |
| Reportes | `src/app/api/provider/reports` |
| Tests | archivo, 405, IDOR, unidad GLOBAL vs maestro, entradas vs descarte |

## Pendientes

- [ ] Wireframes UX F13 (paralelo; no bloquea BE)
- [ ] Merge humano PR #12 si F12 aún no está en `main`
- [ ] Kardex / backfill / Cloudinary / BL-040 = Won't

## Validación requerida por el receptor

- [ ] Contratos con método, path, auth, body, 200, 4xx/5xx, envelope
- [ ] Unique `(providerId, productId)` intacta
- [ ] DELETE 405; `isAvailable` intacto
- [ ] Cero 4xx de stock en venta; 409 Encargar solo unidad/factor
- [ ] Ocultar con Encargar = 2xx
- [ ] Tests 100% del módulo en verde antes de QA

## Checklist de recepción (para el Receptor)

- [ ] Todos los archivos listados existen
- [ ] Formato de plantilla
- [ ] Información completa
- [ ] Sin contradicción con fase 13 / ADR-038
- [ ] No escribir en `fase-12/`

## Inputs Utilizados

- **Handoff PM:** `Administrador de producto/.../fase-13/handoff-arquitecto-fase-13.md`
- **PRD / impacto / US / QG-cobertura-BE / adr-draft-038**
- **SAD / ADR-002 / 003 / 022 / 029 / 036 / 037**
- **Prisma (lectura):** `LaBorregaMarket/prisma/schema.prisma`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-13/handoff-backend-fase-13.md`
- **Agente Downstream:** Backend Developer
