# ADR-037 — Reserva Encargar (computed), commit DELIVERED, restore CANCELLED

> **Estado:** Aprobado  
> **Fecha:** 2026-09-14  
> **Decisores:** Arquitecto de Software  
> **Fase:** 12 — Inventario / almacén

---

#### 1. Contexto y Problema:

Encargar debe mostrar cantidad **parcial/reservada** en inventario mientras el pedido está activo, descontar `onHand` al completar y soltar la reserva al cancelar. No hay status nuevos. Completada = `OrderStatus.DELIVERED`. Activas Encargar = `OrderSource.MARKETPLACE` y status **no** `DELIVERED` y **no** `CANCELLED` (PENDING, CONFIRMED, IN_TRANSIT). Crear Encargar con saldo 0/negativo **sí** crea el pedido.

---

#### 2. Opciones Consideradas:

* **Opción A — Columna `reserved` persistida y mutada en cada transición:** Pros: lectura O(1). Contras: doble escritura; riesgo de drift vs `OrderItem`; sin kardex de compensación.
* **Opción B — `reserved` **computed** = SUM de líneas de órdenes activas Marketplace (cantidad convertida a unidad de catálogo):** Pros: una fuente de verdad (`Order` + `OrderItem`); restore = dejar de contar la orden; commit = restar `onHand` una vez al pasar a DELIVERED. Contras: agregación en listado (índices + una query agrupada, no N+1 por SKU).
* **Opción C — Decrementar `onHand` al crear Encargar y reponer en CANCELLED:** Pros: “disponible” = onHand. Contras: contradice US-INV-06 (“on-hand no pierde Q hasta DELIVERED”).

---

#### 3. Decisión Elegida:

**Opción B.**

| Evento | `onHand` | `reserved` (computed) |
|--------|----------|------------------------|
| `POST /api/orders` Marketplace | Sin cambio | Sube en Q (la orden entra a activas) |
| Transición a `DELIVERED` (primera vez) | `onHand -= Q` (puede quedar negativo) | Q deja de contar |
| Transición a `CANCELLED` desde activa (nunca DELIVERED) | Sin cambio | Q deja de contar |
| Replay / status ya DELIVERED o CANCELLED | Idempotente: no volver a restar ni “reponer” | Sigue fuera de activas |

**POS (`source=POS`):** no entra en `reserved`. El descuento ocurre en `POST /api/provider/pos/sales` (ADR-036), no al PATCH de status.

**Índice:** ya existe `@@index([providerId, status, createdAt])` en `orders`. Agregar `@@index([providerProductId])` en `order_items` para el SUM por SKU.

**IDOR:** mutar orden de sucursal B con activo A → **403** (ADR-034). Crear Encargar de producto no vendible → **409** ADR-022. Crear con stock 0 → **2xx**.

### Qué NO hacer

- Tabla de reservas Must.
- Bloquear `POST /api/orders` por `onHand`.
- Contar POS como Encargar activo.
- Segundo descuento si un pedido POS ya descontó al cobrar y luego se marca DELIVERED.

---

#### 4. Consecuencias e Impacto:

* **Positivas:** restore trivial; listado coherente con órdenes reales; Encargar nunca es candado.
* **Riesgos:** POS y Encargar pueden “sobrecomprometer” el mismo on-hand (aceptable: inventario blando). Commit debe ser transacción atómica status + `onHand`.

## Referencias

- US-INV-04, US-INV-06
- ADR-022, ADR-036, ADR-034
