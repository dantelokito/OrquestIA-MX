# Handoff de Feature: FEAT-CAT-13

> **Proyecto:** laborregamarket  
> **Feature:** CAT (US-CAT-14/15/16/18/19/20, US-INV-07, US-SEC-04)  
> **Stack UI:** Next.js 15 + React 19 + TypeScript + Tailwind 4  
> **Fecha:** 2026-09-16  
> **Wireframe de referencia:** `WF-CAT-14-15-fila-bandeja.md`, `WF-CAT-18-drawer-editar.md`, `WF-INV-07-modal-descarte.md`, `WF-CAT-19-20-precio-historial.md`, `WF-CAT-16-ausencia-cliente.md`  
> **Contrato de referencia:** `API-PROVIDER-ARCHIVE-13.md`, `API-PROVIDER-OFFER-13.md`, `API-PROVIDER-PRICE-13.md`, `API-SELLABLE-13.md`

## Inputs Utilizados

- Handoff UX F13 + tokens v0.13.0
- Contratos Arch listados arriba
- **JSON real:** `Agente backend/.../fase-13/handoff-frontend.md` + `MOD-CATALOG-F13-handoff.md` (2026-09-16)

---

## 1. Pantallas y componentes

| Vista | WF | Ruta | Estado |
|-------|----|------|--------|
| Fila Editar GLOBAL+LOCAL, Eliminar=ocultar | WF-CAT-14-15 | `/proveedor` | OK |
| Bandeja Restaurar | WF-CAT-14-15 | `/proveedor` | OK 4 estados |
| Drawer oferta GLOBAL / alta LOCAL enum CAJA | WF-CAT-18 | drawer | OK |
| Modal descarte + alerta Encargar | WF-INV-07 | modal | OK |
| Precio de tu frutería + historial | WF-CAT-19-20 | fila | OK |
| Cliente/POS sin pantallas nuevas | WF-CAT-16 | `/carrito`, POS | copy 409; no rediseño Explorar |

**Componentes:** `ArchivedTray`, `OfferUnitSelect`, `BoxFactorField`, `UnitChangeConfirmDialog`, `ActiveOrderBlockAlert`, `PriceHistoryList`. Capa: `src/lib/api/provider-f13.ts`, `src/lib/catalog/f13.ts`, `src/lib/validators/catalog-f13.ts`.

---

## 2. Integración API (JSON real Backend F13)

Paths y envelope alineados a `handoff-frontend.md` / MOD-CATALOG-F13. GET panel: `page=1&limit=100` (+ `archived=1` en bandeja). Filas: `archivedAt`, `saleUnit`, `effectiveSaleUnit`, `boxContentFactor`, `canEditMaster`, `onHand`, `reserved`. PATCH oferta `confirmDiscard`; 409 Encargar (`details.field=saleUnit`); 400 `confirmDiscard`. Precio string 2 decimales. Historial `data[]` + `meta`. LOCAL PATCH por `Product.id`.

| Endpoint | Método | Service |
|----------|--------|---------|
| `/api/provider/products?archived=1` | GET | `getMyProducts` |
| `/api/provider/products/by-product/[productId]/archive` | POST | `archiveProviderProduct` |
| `.../restore` | POST | `restoreProviderProduct` |
| `.../by-product/[productId]` | PATCH | `patchOfferByProduct` |
| `.../by-product/[productId]/price` | PATCH | `patchOfferPrice` |
| `/api/provider/products/[providerProductId]/price-history` | GET | `getPriceHistory` |
| `/api/provider/local-products` | POST/PATCH | vigente + `boxContentFactor` / `confirmDiscard` |

LOCAL PATCH usa `Product.id` según Arch. Encargar 409 no se muestra al ocultar.

---

## 3. Estados UI

| Vista | Loading | Empty | Error | Success |
|-------|---------|-------|-------|---------|
| Catálogo operativo | skeleton existente panel | secciones F10 + GLOBAL | ErrorBanner panel | filas sin archivados |
| Bandeja | 3 skeletons | «No hay productos eliminados de la vista.» | Reintentar | Restaurar ≥44px |
| Historial | pulse | «Aún no hay cambios de precio.» | Reintentar | lista DESC |

---

## 4. Formularios

`offerPatchSchema` (Zod): CAJA exige factor; precio 2 decimales. GLOBAL no envía `name` ni `unit` maestro.

---

## 5. Won't

No se tocó layout Explorar, mapa, reseñas, WhatsApp, existencias `/fruteria`. No DELETE. No mutación maestro GLOBAL.

---

## 6. Pruebas

`npx vitest run` → **373 passed / 80 files**. Módulo FE: `catalog-f13.test.ts` 11/11. `provider-catalog` (sellableWhere + `archivedAt`) verde.

Verificación browser con sesión: **no** (sin login en el navegador del agente). Sustituto: suite vitest.

## Outputs Generados

- **Archivo:** `fase-13/feature-handoffs/FEAT-CAT-13-handoff.md`
