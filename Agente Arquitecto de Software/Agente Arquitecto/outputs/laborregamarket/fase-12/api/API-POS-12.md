# API-POS-12 — Delta cobro POS e inventario blando

> **Endpoint:** `POST` `/api/provider/pos/sales` (path F3 **sin cambio**)  
> **Descripción:** Al cobrar, descontar `onHand` de la sucursal activa. Nunca 4xx por existencias.  
> **Autenticación:** Requerida PROVIDER + sucursal activa  
> **Versión:** 0.12.0  
> **Fecha:** 2026-09-14  
> **US:** US-INV-05  
> **ADR:** ADR-013 (líneas libres), ADR-022, ADR-036  
> **Base (solo lectura):** `fase-3/api/API-POS-01.md`, `fase-5/api/API-PROVIDER-PRODUCTS-01.md`

## Inputs Utilizados

- Contratos POS F3/F5 (no editar esas fases)

---

## Comportamiento F12 (delta)

Tras validar vendible (ADR-022) e idempotencia F3:

1. Crear la venta como hoy (`source=POS`).
2. Por cada línea de **catálogo** (`providerProductId` de la sucursal activa): convertir cantidad POS → unidad de catálogo y `onHand -= qtyCatalog` **en la misma transacción**.
3. Si `onHand` queda 0 o negativo: **igual 2xx**.
4. Líneas libres (`customItem` / `itemName` sin `providerProductId`): **no** tocan inventario.
5. Replay de `Idempotency-Key` conocido: **no** volver a restar.

### Conversión POS → catálogo

`UnitOfMeasure` POS: `PZA`, `KG`, `GR`. `Product.unit`: `KG`, `PIEZA`, `MANOJO`, `CAJA`, `LITRO`, `GRAMO`.

| ProductUnit | POS UoM | Cantidad a restar de `onHand` |
|-------------|---------|--------------------------------|
| KG | KG | `quantity` |
| KG | GR | `quantity / 1000` |
| GRAMO | GR | `quantity` |
| GRAMO | KG | `quantity * 1000` |
| PIEZA, MANOJO, CAJA, LITRO | PZA | `quantity` |
| Cualquier otro par | — | Identidad (`quantity` tal cual) |

Redondeo: `Decimal(12,3)` hacia el vecino par (Prisma Decimal).

---

## Respuestas

### 200 / 201

Envelope F3 de la venta. **No** es obligatorio devolver `onHand` en el payload de venta. El FE de inventario reconsulta GET inventario.

### 409 Conflict (solo ADR-022)

Línea de catálogo no vendible (`isAvailable=false`, producto inactivo, id ajeno):

```json
{
  "error": "Producto no disponible"
}
```

**Prohibido:** 400, 403 o 409 con mensaje de stock, saldo, agotado o capacidad.

### Otros

| HTTP | Uso |
|------|-----|
| 400 | Validación F3 (pago, XOR ítems, UNPAID+DELIVERED, etc.). No stock. |
| 401 | Sin sesión |
| 403 | IDOR sucursal / rol |
| 500 | Error interno |

Si un `providerProductId` es de sucursal B → **403** (ISO), no 409 de catálogo.

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-12/api/API-POS-12.md`
- **Agente Downstream:** Backend Developer
