# Handoff Backend Developer — LaBorregaMarket Fase 12 (v0.12.0)

> **De:** Agente Arquitecto de Software  
> **Para:** Backend Developer  
> **Fecha:** 2026-09-14  
> **Timestamp:** 2026-09-14  
> **Prioridad:** Migración Decimal → GET inventario 403 → entradas/ficha → delta POS → delta orders → GET products panel + PATCH me  
> **No implementar:** Kardex, BOM, inventario compartido, Cloudinary/S3, BL-040, `/api/v1/`, usar `stock` Int? o `isAvailable` como existencias, 4xx de stock al vender, código de SubNav (FE)

**Estado:** LISTO PARA IMPLEMENTAR (el orquestador activa Backend; este handoff no lanza el agente).

Código (solo el agente Backend escribe): `C:\Users\PC GAMER\LaBorregaMarket`  
STATUS Arch: [`../STATUS.md`](../STATUS.md)

---

## Orden

```
1. Prisma: onHand Decimal(12,3), capacityMax, alert*, boxContentFactor, posShowImages; índice order_items.providerProductId; NO drop de stock Int?
2. InventoryService + GET/PATCH/POST /api/provider/inventory*
3. Tests 403 Centro ↔ Tecnológico en inventory y PATCH me posShowImages
4. POST pos/sales: descuento blando + conversión UoM; 0/negativo = 2xx; 409 solo ADR-022
5. POST /api/orders + PATCH DELIVERED/CANCELLED (ADR-037)
6. GET /api/provider/products: barra + imageUrl disco; GET público SIN claves de stock
7. GET/PATCH /api/provider/me posShowImages default true
```

No adelantar UI. Paths REST **sin** `/api/v1/` (ADR-002). Envelope ADR-003.

---

## Contratos

| Slice | Archivo |
|-------|---------|
| Inventario | [`api/API-INVENTORY-01.md`](./api/API-INVENTORY-01.md) |
| POS cobro | [`api/API-POS-12.md`](./api/API-POS-12.md) |
| Encargar | [`api/API-ORDERS-12.md`](./api/API-ORDERS-12.md) |
| Panel CAT + público | [`api/API-PROVIDER-PRODUCTS-12.md`](./api/API-PROVIDER-PRODUCTS-12.md) |
| Toggle POS | [`api/API-PROVIDER-PREFS-12.md`](./api/API-PROVIDER-PREFS-12.md) |
| DB oferta | [`data-model/DB-provider-products.md`](./data-model/DB-provider-products.md) |
| DB sucursal | [`data-model/DB-providers.md`](./data-model/DB-providers.md) |
| DB líneas | [`data-model/DB-order-items.md`](./data-model/DB-order-items.md) |
| Diagrama | [`diagrams/ARCH-INV-01.md`](./diagrams/ARCH-INV-01.md) |
| ADRs | [`ADR-036`](../comun/adrs/ADR-036-inventario-blando.md), [`ADR-037`](../comun/adrs/ADR-037-encargar-reserva.md) |

ADR-022 **solo lectura**. F11 ISO aplica a las rutas nuevas (`/api/provider/inventory*`).

---

## Decisiones clave

1. **On-hand** persistido Decimal; **reserved** computed (SUM Encargar activo).
2. **POS** descuenta al cobrar; nunca 4xx de stock.
3. **Encargar** no toca on-hand al crear; DELIVERED commit; CANCELLED restore (sale del SUM).
4. **`stock` Int?** deprecado: no leer/escribir.
5. **Factor caja** fijo en `ProviderProduct.boxContentFactor`.
6. **Público** sin payload de existencias.

---

## Archivos de código a tocar (sugeridos)

| Área | Ruta actual |
|------|-------------|
| Schema | `prisma/schema.prisma` |
| Inventario | `src/lib/services/inventory.service.ts` (nuevo) |
| Routes | `src/app/api/provider/inventory/...` |
| POS | servicio/ruta `pos/sales` |
| Orders | create + status PATCH |
| Products panel | `GET /api/provider/products` |
| Me | `GET/PATCH /api/provider/me` |
| Tests | 403 ISO; cobro onHand 0; Encargar stock 0; público sin claves |

---

## Checklist recepción Backend

- [ ] Contratos con método, path, body, 200, 400/401/403/404/500
- [ ] Decimal kg; `stock` Int? no es fuente de verdad
- [ ] Cero 4xx de stock en venta/pedido
- [ ] 403 IDOR
- [ ] `/fruteria` / GET providers sin existencias
- [ ] Envelope ADR-003; sin `/api/v1/`
- [ ] Tests unit e integración del DoD Backend
- [ ] Evidencia `fase-12/quality/EVIDENCIA-BUG-*` solo si QA abre bugs

## Pendientes

- [ ] SubNav Inventario primero y etiqueta Ventas (Frontend / UX)
- [ ] Cards POS respetan `posShowImages` (Frontend)
- [ ] Miniatura lista CAT (Frontend; URL ya en GET products)

## Validación requerida por el receptor

- [ ] ADR-022 intacto
- [ ] Won't kardex/BOM/compartido

## Checklist de recepción (para el Receptor)

- [ ] Todos los archivos listados existen
- [ ] Formato de plantilla
- [ ] Información completa
- [ ] Sin contradicción con fase 12 / F11 ISO

## Inputs Utilizados

- **Handoff PM:** `Administrador de producto/.../fase-12/handoff-arquitecto.md`
- **PRD / US** fase-12 PM
- **SAD / ADR-002 / 003 / 022 / 034**

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-12/handoff-backend-fase-12.md`
- **Agente Downstream:** Backend Developer
