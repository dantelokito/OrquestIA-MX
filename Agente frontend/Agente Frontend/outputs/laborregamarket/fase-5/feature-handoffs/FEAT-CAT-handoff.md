# Handoff de Feature: FEAT-CAT

> **Proyecto:** laborregamarket  
> **Feature:** CAT (catálogo inhabilitado en todos los canales)  
> **Stack UI:** Next.js 15 + React 19 + Tailwind 4  
> **Fecha:** 2026-08-14  
> **Wireframe:** `WF-catalogo-canales`  
> **Contrato:** `API-PROVIDER-PRODUCTS-01`

---

## 1. Pantallas y componentes implementados

| Pantalla / Vista | Wireframe | Ruta | Estado |
|------------------|-----------|------|--------|
| Toggle Activo/Inactivo | `WF-catalogo-canales` | `/proveedor` | OK |
| Detalle frutería | — | `/fruteria/[id]` | OK (omite inactivos) |
| Carrito | — | `/carrito` | OK (retira línea + toast) |
| POS empty | — | `/proveedor/pos` | OK |

---

## 2. Integración API

| Endpoint | Método | Service | Contrato | Estado |
|----------|--------|---------|----------|--------|
| `/api/provider/products` | GET/PATCH | `getMyProducts` / `updateProduct` | API-PROVIDER-PRODUCTS-01 | OK |
| `/api/providers/[id]` | GET | `getProviderById` | detalle público | OK (filtro FE) |
| `/api/orders` | POST | `createOrder` | 409 `Producto no disponible` | OK |
| `/api/provider/pos/sales` | POST | `createPosSale` | 409 cobro | OK |

---

## 3. Estados UI

| Vista | Loading | Empty | Error | Success |
|-------|---------|-------|-------|---------|
| Toggle fila | spinner | — | inline + Reintentar | check 2s |
| Detalle | — | “Sin productos publicados aún” | — | solo activos |
| Carrito | verificando | carrito F3 si era único | 409 POST | toast `"{nombre} ya no está disponible"` |
| POS catálogo | skeleton 8 | **No hay productos activos** + Ir a Catálogo | 409 cobro | grid activos |

Copy prohibido: agotado / inventario. Hint: “Inactivo: no aparece en explorar, pedidos ni POS. No es stock.”

---

## 4. Formularios y validación

Switch `aria-pressed` + `aria-label` Activo/Inactivo. Líneas libres POS (ADR-013) exentas del 409 de catálogo.

---

## 5. Responsive y accesibilidad

- [x] Switch ≥44px
- [x] Toast `role="status"` (ToastProvider)
- [x] Empty POS distinto del empty de ticket

---

## 6. Pruebas

Flujos manuales: inhabilitar → desaparece detalle/POS; carrito retira línea; POST 409.

---

## 7. DoD Frontend

- [x] Pixel-fidelidad
- [x] Responsive
- [x] 4 estados
- [x] Consumo limpio de APIs
- [x] Accesibilidad basal

---

## 8. Notas para downstream

### QA Tester

- Matriz CAT: explorar/detalle/carrito/`POST /api/orders`/POS. Reactivar reaparece.
- Defensa FE oculta `isAvailable: false` aunque el detalle aún los serialice (hueco BE F5).
