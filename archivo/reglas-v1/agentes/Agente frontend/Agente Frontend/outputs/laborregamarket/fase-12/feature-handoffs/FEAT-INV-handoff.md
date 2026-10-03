# Handoff de Feature: FEAT-INV

> **Proyecto:** laborregamarket  
> **Feature:** INV (inventario sucursal, US-INV-01 a US-INV-06)  
> **Stack UI:** Next.js 15 + React 19 + TypeScript + Tailwind 4  
> **Fecha:** 2026-09-14  
> **Wireframe de referencia:** `WF-INV-01-subnav.md`, `WF-INV-02-entrada.md`, `WF-INV-03-ficha-capacidad.md`, `WF-INV-04-listado.md`, `WF-INV-05-pos-sin-candado.md`  
> **Contrato de referencia:** `API-INVENTORY-01.md`, `API-POS-12.md`, `API-ORDERS-12.md` (reserva Encargar). Sin `MOD-*-handoff.md` F12 al momento de entrega.

---

## 1. Pantallas y componentes implementados

| Pantalla / Vista | Wireframe | Ruta | Estado |
|------------------|-----------|------|--------|
| SubNav Inventario primero + label Ventas | WF-INV-01 | `/proveedor/*` | OK |
| InventoryPage 4 estados | WF-INV-04 | `/proveedor/inventario` | OK |
| StockEntrySheet | WF-INV-02 | drawer | OK |
| InventorySkuSheet | WF-INV-03 | drawer | OK |
| POS sin candado stock | WF-INV-05 | `/proveedor/pos` | OK (no se añadió bloqueo) |

**Componentes reutilizables creados:**

| Componente | Ubicación | Descripción |
|------------|-----------|-------------|
| InventoryCapacityBar | `src/components/inventory/` | Barra %, >100% + texto Sobre tope |
| LowStockBadge | idem | Texto + icono; off si alerta apagada (viene del API) |
| EncargarReserveChip | idem | Reserva Encargar o Sin reserva |
| CatalogRowThumb | idem | Miniatura 48px |
| StockEntrySheet | idem | Entrada en unidad de catálogo |
| InventorySkuSheet | idem | Tope, umbral 10%, alerta, factor caja fijo |
| InventoryPageClient | idem | Listado + sheets |

---

## 2. Integración API

| Endpoint | Método | Hook / Service | Contrato API | Estado |
|----------|--------|----------------|--------------|--------|
| `/api/provider/inventory` | GET | `useInventory` / `inventory.ts` | API-INVENTORY-01 | UI lista; BE paralelo |
| `/api/provider/inventory/[id]` | GET | `getInventoryItem` | API-INVENTORY-01 | Cliente listo |
| `/api/provider/inventory/[id]` | PATCH | `useInventoryMutations` | API-INVENTORY-01 | UI lista |
| `/api/provider/inventory/[id]/entries` | POST | `useInventoryMutations` | API-INVENTORY-01 | receiveAs CATALOG |
| `/api/provider/pos/sales` | POST | vigente F3 | API-POS-12 | FE no bloquea por stock |

- [x] Cliente HTTP con cookie de sesión (`credentials: include`)
- [x] Sin `fetch` embebido en la vista de inventario
- [ ] Refresh token: flujo vigente F7, no tocado

**Alineación:** JSON string Decimal 3 dígitos según Arch. Si Backend aún no publica campos Prisma (`onHand`, etc.), GET devolverá 500/404 y la UI muestra estado Error con Reintentar (no inventa saldos).

---

## 3. Estados UI (4 estados obligatorios)

| Vista | Loading | Empty | Error | Success |
|-------|---------|-------|-------|---------|
| InventoryPage | skeletons ×6 | Ir a Catálogo | Reintentar único primary | tabla desktop / cards móvil |

---

## 4. Formularios y validación

| Formulario | Schema | Campos | Mensajes inline |
|------------|--------|--------|-----------------|
| Entrada | `parseDecimalInput` > 0 | cantidad | Indica una cantidad mayor que cero |
| Ficha | tope > 0; umbral entero 1–100; factor opcional > 0 | capacityMax, threshold, alert, factor | Alineados a API-INVENTORY-01 |

Factor caja **no** se pide en la entrada; hint + enlace a ficha.

---

## 5. Responsive y accesibilidad

- [x] Móvil: cards, CTA `w-full min-h-11`
- [x] Escritorio: tabla `max-w-7xl`
- [x] `main` del layout proveedor; `nav` SubNav; dialogs con título
- [x] SubNav ≥44px, `aria-current`
- [x] Barra `role="progressbar"` + `aria-valuetext` (nunca solo color)
- [x] Miniatura `alt` = nombre

---

## 6. Pruebas

**Comando:** `npm test -- tests/unit/inventory-capacity.test.ts` — 3 passing (sobre-tope, sin tope, reserved).

E2E: QA. Flujos: listado → entrada → ficha → POS cobra con on-hand 0.

---

## 7. Definition of Done (DoD Frontend)

- [x] Pixel-fidelity vs WF-INV-*
- [x] Responsive
- [x] 4 estados UI
- [x] Capa servicios/hooks
- [x] Validación inline
- [x] a11y basal

---

## 8. Notas para downstream

### QA Tester

- Ruta `/proveedor/inventario`; SubNav orden Inventario → Catálogo → POS → Órdenes → Ventas; Reportes generales solo N>1.
- Dashboard sigue en `/proveedor/dashboard`.
- POS no debe mostrar candado/agotado por existencias; 409 solo ADR-022 `isAvailable`.
- Chip Encargar: reserved > 0.
- Won't: BOM, kardex, Cloudinary, BL-040.

### DevOps

Sin variables nuevas. Ver `comun/integration-readme.md`.

## Inputs Utilizados

- Handoff UX `fase-12/handoff-frontend-fase-12.md`
- Contratos Arch API-INVENTORY-01, API-POS-12
- Tokens/IA v0.12.0

## Outputs Generados

- **Archivo:** `fase-12/feature-handoffs/FEAT-INV-handoff.md`
- **Agente Downstream:** QA (tras handoff BE)
