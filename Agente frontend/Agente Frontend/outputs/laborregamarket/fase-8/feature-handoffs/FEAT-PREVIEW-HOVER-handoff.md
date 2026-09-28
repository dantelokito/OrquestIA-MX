# Handoff de Feature: FEAT-PREVIEW-HOVER

> **Proyecto:** laborregamarket
> **Feature:** EXPLORE / preview hover · long-press · marker (sin «Vista rápida»)
> **Stack UI:** Next.js 15 + React 19 + Tailwind 4
> **Fecha:** 2026-08-24
> **Wireframe:** `WF-explorar-preview-card`
> **Contrato:** `API-PROVIDER-PREVIEW-01` (mismo `GET /api/providers/[id]` F7)
> **US:** US-EXPLORE-07 (contenido = US-EXPLORE-05)

---

## 1. Pantallas y componentes implementados

| Pantalla / Vista | Wireframe | Ruta | Estado |
|------------------|-----------|------|--------|
| Preview anclado a la card | `WF-explorar-preview-card` | `/explorar` | OK |

**Componentes:**

| Componente | Ubicación | Descripción |
|------------|-----------|-------------|
| `ProviderCard` | `src/components/explore/ProviderCard.tsx` | Sin «Vista rápida»; Link = tap corto; Eye `:focus-visible`; Heart + ContactCTA |
| `ProviderPreviewPopover` | `src/components/explore/ProviderPreviewPopover.tsx` | Portal anclado; `max-h-[min(70vh,32rem)]`; flip arriba |
| `ProviderPreviewContent` | `src/components/explore/ProviderPreviewContent.tsx` | Horario, flags, 3 reseñas, catálogo, CTA Ver frutería |
| `previewDelays` | `src/lib/maps/preview-delays.ts` | Open 300 / close 150 / long-press 500; reduced-motion 0 |
| `preview-cache` | `src/lib/maps/preview-cache.ts` | Cache `id → payload`; un GET en vuelo; AbortController |

El sheet 90vh de F7 **ya no** es el disparador. Marker abre el mismo popover.

---

## 2. Integración API

| Endpoint | Método | Service | Contrato | Estado |
|----------|--------|---------|----------|--------|
| `/api/providers/[id]` | GET | `getProviderById` | API-PROVIDER-PREVIEW-01 | OK — **sin** `/preview` |

Debounce/cache = solo FE. 404 → toast “Esta frutería no está disponible” + refetch lista.

---

## 3. Estados UI (4 estados obligatorios)

| Vista | Loading | Empty | Error | Success |
|-------|---------|-------|-------|---------|
| Popover | BrandLoader 64px; sr-only “Cargando frutería” | “Sin reseñas…” / catálogo vacío | ErrorBanner + Reintentar | Contenido US-EXPLORE-05 + Ver frutería |

---

## 4. Formularios y validación

No hay formulario. CTA dominante = **Ver frutería**. Secundario = **Ver todas las reseñas** → `#resenas`.

---

## 5. Responsive y accesibilidad

- [x] Hover 300 ms / puente 150 ms; long-press 500 ms; scroll cancela; post-long-press no navega
- [x] Tap/clic corto → `/fruteria/[id]`; Enter en el Link = detalle; Alt+Enter / Eye = preview
- [x] Escape cierra; un preview a la vez
- [x] `aria-label="Vista previa"` — nunca el texto «Vista rápida»
- [x] z-index sobre overlay radio (`z-[400]`); flip en última fila
- [x] Reduced-motion: delays 0

---

## 6. Pruebas

**Comando:** `npx vitest run tests/unit/format-radius.test.ts`

- [x] `previewDelays(false|true)` 300/150/500 vs 0
- [ ] RTL de hover (no hay Testing Library en el repo; verificado en browser)

---

## 7. Definition of Done (DoD Frontend)

- [x] **Diseño Pixel-Fidelidad**
- [x] **Responsive Design**
- [x] **Manejo de los 4 Estados UI**
- [x] **Consumo Limpio de APIs**
- [x] **Validación de Formulario** (N/A — sin form)
- [x] **Accesibilidad Basal**

---

## 8. Notas para downstream

### QA Tester

- Botón «Vista rápida» **ausente**.
- Hover / long-press abren peek; tap corto navega; scroll no abre.
- Heart y ContactCTA se quedan. Contenido preview **no recortado**.

### DevOps

Sin variables nuevas.
