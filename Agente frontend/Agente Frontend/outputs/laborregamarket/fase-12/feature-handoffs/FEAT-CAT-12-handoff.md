# Handoff de Feature: FEAT-CAT-12

> **Proyecto:** laborregamarket  
> **Feature:** CAT-12 / CAT-13 (barra + miniatura lista proveedor)  
> **Stack UI:** Next.js 15 + React 19 + TypeScript + Tailwind 4  
> **Fecha:** 2026-09-14  
> **Wireframe de referencia:** `WF-CAT-12-13-fila-catalogo.md`, `WF-FRUTERIA-12-sin-existencias.md`  
> **Contrato de referencia:** `API-PROVIDER-PRODUCTS-12.md`. Sin MOD-handoff F12.

---

## 1. Pantallas y componentes implementados

| Pantalla / Vista | Wireframe | Ruta | Estado |
|------------------|-----------|------|--------|
| Fila catálogo proveedor | WF-CAT-12-13 | `/proveedor` | OK |
| Vitrina sin existencias | WF-FRUTERIA-12 | `/fruteria/[id]` | OK (no se pintó barra) |

**Componentes:** `CatalogRowThumb` 48px siempre; `InventoryCapacityBar` compact en fila CAT si hay `providerProductId`. Toggle POS **no** oculta thumbs.

---

## 2. Integración API

| Endpoint | Método | Hook / Service | Contrato | Estado |
|----------|--------|----------------|----------|--------|
| `/api/provider/products` | GET | `getMyProducts` | API-PROVIDER-PRODUCTS-12 | Consume `fillPercent`/`imageUrl` opcionales |

Si el BE aún no serializa `fillPercent`, la barra muestra «Sin tope» (null). Precio y Activo siguen funcionando.

Público `/api/providers*`: FE de `/fruteria` no lee ni pinta `onHand`/`fillPercent`.

- [x] Sin fetch en la vista

---

## 3. Estados UI

Hereda 4 estados del catálogo F10 (loading panel, empty secciones, error banner, success filas).

---

## 4. Formularios

No aplica (delta visual de fila).

---

## 5. Responsive y accesibilidad

- Miniatura 48×48 `object-cover rounded-lg`; `alt` = nombre; placeholder no es botón.
- Barra compacta `h-2` min 80px desktop; en móvil en el flujo de la fila.
- `/fruteria` ProductTable sin barra de capacidad.

---

## 6. Pruebas

Unit capacidad: `tests/unit/inventory-capacity.test.ts`.

---

## 7. DoD Frontend

- [x] Pixel-fidelity CAT-12/13
- [x] Responsive
- [x] Thumbs independientes de `posShowImages`
- [x] Capa API existente + campos delta
- [x] a11y basal thumbs

---

## 8. Notas QA

- Lista `/proveedor`: thumb siempre + barra compacta.
- `/fruteria`: fotos de producto sí; **nunca** barra de existencias.
- Toggle POS OFF no apaga miniaturas CAT.

## Inputs Utilizados

- WF-CAT-12-13, WF-FRUTERIA-12, API-PROVIDER-PRODUCTS-12, US-CAT-12, US-CAT-13

## Outputs Generados

- **Archivo:** `fase-12/feature-handoffs/FEAT-CAT-12-handoff.md`
- **Agente Downstream:** QA
