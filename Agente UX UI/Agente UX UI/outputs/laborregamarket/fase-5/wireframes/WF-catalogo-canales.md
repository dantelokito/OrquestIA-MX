> **Pantalla:** Toggle de catálogo en todos los canales (`/proveedor`, POS, detalle, carrito) — Fase 5 CAT
> **Objetivo Principal:** Inhabilitar un producto para que deje de verse y venderse; empty POS si no queda ninguno activo
> **Base:** Delta de [`../../fase-1/wireframes/WF-proveedor-panel.md`](../../fase-1/wireframes/WF-proveedor-panel.md) y [`../../fase-3/wireframes/WF-pos-mostrador.md`](../../fase-3/wireframes/WF-pos-mostrador.md). No es stock.

### 1. Panel proveedor — columna Activo / Inactivo

```text
+-----------------------------------------------------------------------+
| [Header PROVIDER]                                                     |
| [ Catálogo | POS | Órdenes | Dashboard ]  ← Catálogo activo           |
+-----------------------------------------------------------------------+
|  Mi catálogo — Frutas El Paraíso                                      |
|  … media F2 + colores F5 (WF-proveedor-marca) …                       |
+-----------------------------------------------------------------------+
|  Producto        │ Categoría  │ Precio ($)   │ Estado     │           |
|  ───────────────────────────────────────────────────────────────────  |
|  Mango           │ Frutas     │ [ 45.00 ]    │ [● Activo ] │ ✓        |
|  Aguacate        │ Frutas     │ [ 65.00 ]    │ [○ Inactivo]│           |
|  Jitomate        │ Verduras   │ [ 28.00 ]    │ [● Activo ] │           |
|                                                                       |
|  Hint columna: "Inactivo: no aparece en explorar, pedidos ni POS.     |
|  No es stock."                                                        |
+-----------------------------------------------------------------------+
```

Copy **prohibido** en esta columna: "Agotado", "Sin inventario", "Disponible/agotado temporal".

#### Estados (fila)

| Estado | Comportamiento UI |
|--------|-------------------|
| **Activo** | Switch ON; label "Activo"; `aria-checked="true"` |
| **Inactivo** | Switch OFF; label "Inactivo"; fila permanece en el panel (el dueño sigue viéndola) |
| **Saving** | Toggle disabled + spinner fila |
| **Success** | Check 2s |
| **Error PATCH** | Inline rojo + Reintentar |

---

### 2. POS — empty catálogo (`/proveedor/pos`)

Cuando **cero** productos activos (todos inhabilitados o ninguno activado):

```text
+-----------------------------------------------------------------------+
| [Header PROVIDER]  SubNav POS activo                                  |
+-----------------------------------------------------------------------+
|  CATALOGO (58%)                       |  TICKET (42%)                 |
|                                       |  (vacío — WF-pos-ticket)      |
|         [Icono PackageX 48px]         |                               |
|         No hay productos activos      |  Total: $0.00                 |
|         Activa al menos uno en        |  [ Cobrar ] disabled          |
|         Catálogo para vender.         |                               |
|         [ Ir a Catálogo ]  SECONDARY  |                               |
+-----------------------------------------------------------------------+
```

Distinto del empty del **ticket** ("Agrega productos del catálogo") cuando el grid sí tiene ítems.

| Estado POS catálogo | UI |
|---------------------|-----|
| **Loading** | Skeleton grid 8 |
| **Success** | Solo productos **activos** (F1 + F5) |
| **Empty activos** | Copy de arriba + Ir a Catálogo → `/proveedor` |
| **Error red** | ErrorBanner catálogo |
| **Cobro con id inactivo** | ErrorBanner "Ese producto ya no está a la venta"; no se crea venta |

---

### 3. Detalle frutería y explorar

| Superficie | Producto inactivo |
|------------|-------------------|
| `/fruteria/[id]` | No hay fila; no se puede Encargar ese ítem |
| `/explorar` | No aparece si el listado es por producto; cards de negocio no muestran el ítem |

No hay badge "agotado" en vitrina pública.

---

### 4. Carrito CLIENT — línea retirada

```text
+-----------------------------------------------------------------------+
|  Toast (status): "Aguacate ya no está disponible"                     |
|  La línea desaparece del ticket; total se recalcula.                  |
|  Si era el único ítem → empty carrito F3.                             |
+-----------------------------------------------------------------------+
```

| Momento | UI |
|---------|-----|
| Revalidar al abrir `/carrito` o cambiar cantidad | Retirar línea + toast; no dejar fila tachada |
| `POST /api/orders` con id ya inactivo | Error inline / banner; **no** se crea pedido; pickup F3 intacto para ítems válidos |

#### Componentes Requeridos para Frontend:
* **ProductActiveSwitch:** label Activo/Inactivo; min-h 44px; nunca copy de stock.
* **PosEmptyActiveCatalog:** EmptyState + Button Secondary "Ir a Catálogo".
* **CartUnavailableToast:** `role="status"`; auto-dismiss 3–5s.
* **PriceInput** F1 (OBS-04) sin cambio.

#### Responsividad:
* **Mobile:** Tabla panel scroll-x; toggles ≥44px; empty POS stack; Ir a Catálogo `w-full`.
* **Desktop:** Tabla `max-w-5xl`; POS split 58/42 F3.

#### Accesibilidad:
* Switch con `aria-checked` y nombre accesible "{producto}, {Activo|Inactivo}".
* Hint de columna `aria-describedby`.
* Toast no bloquea teclado; empty POS anuncia el mensaje.

#### API esperada:
* `PATCH /api/provider/products/[id]` — flag activo
* Listados públicos/POS omiten inactivos
* `POST /api/orders` y `POST /api/pos/sales` rechazan inactivo (ADR-003)

#### Referencias:
* Flujo: `../user-flows/UF-CAT-01-inhabilitar-producto.md`
* Panel: `../../fase-1/wireframes/WF-proveedor-panel.md`
* POS: `../../fase-3/wireframes/WF-pos-mostrador.md`
* Carrito F3/F4: `../../fase-3/wireframes/WF-carrito.md`, `../../fase-4/wireframes/WF-carrito-eta.md`
