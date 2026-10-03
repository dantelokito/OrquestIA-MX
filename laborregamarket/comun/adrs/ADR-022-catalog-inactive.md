# ADR-022 — Producto inhabilitado no se lista ni se vende

> **Estado:** Aceptado  
> **Fecha:** 2026-08-14  
> **Decisores:** Arquitecto de Software  
> **Fase:** 5 — v0.5.0

---

#### 1. Contexto y Problema:

F1 ya modela el toggle de oferta como `ProviderProduct.isAvailable` (T9: la UI puede etiquetarlo "activo"; la API/DB **no** introducen `isActive` en esa tabla). US-CAT-01 exige que un producto inhabilitado **desaparezca** de explorar, detalle, carrito y POS, y que `POST /api/orders` + POS **rechacen** el id. Hoy el detalle público (`getProviderDetail`) filtra `Product.isActive` pero **sigue devolviendo** filas con `isAvailable=false` (el FE las muestra en greyscale). Eso viola el contrato F1 de `GET /api/providers/[id]` y el AC de F5. No es un módulo de stock ni "agotado temporal".

---

#### 2. Opciones Consideradas:

* **Opción A — Endurecer el flag F1 en todas las lecturas públicas y en los comandos de venta; panel proveedor sigue viendo el catálogo completo:** Pros: cero migración de schema; el toggle existente es la fuente de verdad; POS/orders ya lanzan `ProductUnavailableError`. Contras: hay que alinear el detalle público y el ranking de dashboard.
* **Opción B — Nuevo campo `isActive` / tabla de inventario:** Pros: semántica "stock". Contras: D-F5-5 lo prohíbe; duplica el toggle.
* **Opción C — Confiar solo en el FE (ocultar en UI):** Pros: cambio mínimo. Contras: un cliente puede POST el id; el detalle ya filtra mal.

---

#### 3. Decisión Elegida:

**Opción A.** `ProviderProduct.isAvailable=false` (o ausencia de fila, o `Product.isActive=false`) = no listar en canales de venta y no vender. El producto global ADMIN no se borra.

### Matriz

| Superficie | Comportamiento F5 |
|------------|-------------------|
| `GET /api/providers` (`sampleProducts`, `_count`, filtro `q`/`category`) | Solo `isAvailable=true` **y** `Product.isActive=true` |
| `GET /api/providers/[id]` `products[]` | **Omitir** inactivos (no devolverlos con `isAvailable: false`) |
| `GET /api/provider/products` | Catálogo **completo** (el panel necesita el toggle) |
| POS UI | Filtrar `isAvailable`; empty state si el catálogo vigente queda vacío |
| `POST /api/orders` | Si el `providerProductId` no es vendible → **409** `{ "error": "Producto no disponible" }` |
| `POST /api/provider/pos/sales` | Igual 409 en líneas de catálogo. **Líneas libres** (ADR-013) no aplican esta regla |
| Carrito | FE retira o marca no disponible; confirmar pedido → 409 si sigue inhabilitado |
| Dashboard `topProducts` | Ranking de **catálogo vigente**: excluir `isAvailable=false`. KPIs de ventas históricas **no** se reescriben |
| `PATCH /api/provider/products` | Sin cambio de path (F1). Reactivar con precio vigente reaparece en canales |

### Código HTTP

F3 ya mapea `ProductUnavailableError` a **409**. Se conserva (no 400) para no romper clientes. Envelope ADR-003; `details` opcional.

### Qué NO hacer

- Añadir `ProviderProduct.isActive`.
- Tratar `stock` (columna existente nullable) como fuente de verdad de este toggle.
- Borrar `Product` global al inhabilitar la instancia del proveedor.
- Filtrar el GET del panel: el dueño debe poder reactivar.

---

#### 4. Consecuencias e Impacto:

* **Positivas:** Un flag; detalle público alineado al contrato F1; venta imposible por API aunque el FE falle.
* **Riesgos / Compensaciones:** El POS comparte `GET /api/provider/products` con el panel: la omisión en POS es de UI + 409 en POST, no un query param Must. `topProducts` puede dejar de mostrar un SKU que vendió mucho este mes si ahora está apagado (es el AC de "catálogo vigente").

## Referencias

- US-CAT-01, D-F5-5
- Toggle F1: [`../../fase-1/api/API-PROVIDER-01.md`](../../fase-1/api/API-PROVIDER-01.md)
- Delta F5: [`../../fase-5/api/API-PROVIDER-PRODUCTS-01.md`](../../fase-5/api/API-PROVIDER-PRODUCTS-01.md)
- DB: [`../../fase-1/data-model/DB-products.md`](../../fase-1/data-model/DB-products.md)
