# Handoff de Feature: FEAT-GEO-LOCATION

> **Proyecto:** laborregamarket
> **Feature:** GEO / ubicación (chip + panel; sin `window.prompt`)
> **Stack UI:** Next.js 15 + React 19 + Tailwind 4 + Leaflet
> **Fecha:** 2026-08-24
> **Wireframe:** `WF-explorar-ubicacion`
> **Contrato:** `API-ADDRESSES-01` (F8 inventario; sin ruta nueva) · ADR-027 / ADR-028
> **US:** US-GEO-17 · US-GEO-18 · US-GEO-19 · US-GEO-20

---

## 1. Pantallas y componentes implementados

| Pantalla / Vista | Wireframe | Ruta | Estado |
|------------------|-----------|------|--------|
| Chrome de ubicación | `WF-explorar-ubicacion` | `/explorar` | OK |

**Componentes:**

| Componente | Ubicación | Descripción |
|------------|-----------|-------------|
| `LocationChip` | `src/components/explore/LocationChip.tsx` | Pill ≥44px; MapPin + label + chevron; `aria-expanded` |
| `LocationPanel` | `src/components/explore/LocationPanel.tsx` | Sheet `<md` / popover `≥md`; buscar ≥3 chars; lista label+calle |
| `FavoriteAddressRow` | `src/components/explore/FavoriteAddressRow.tsx` | Sin `<select>` nativo |
| `SaveAddressDialog` | `src/components/explore/SaveAddressDialog.tsx` | In-app; label máx. 40 |
| `DeleteAddressDialog` | `src/components/explore/DeleteAddressDialog.tsx` | “El mapa se queda en este punto.” |
| `LocationBar` | `src/components/explore/LocationBar.tsx` | Orquesta chip + panel + diálogos + banners |

GPS permanece en FilterBar (`ExploreLocationCta`). FilterBar **no** se rediseñó.

---

## 2. Integración API

| Endpoint | Método | Service | Contrato | Estado |
|----------|--------|---------|----------|--------|
| `/api/users/me/addresses` | GET | `listMyAddresses` | API-ADDRESSES-01 | OK |
| `/api/users/me/addresses` | POST | `createAddress` | API-ADDRESSES-01 | OK (coords `isInMexico`) |
| `/api/users/me/addresses/[id]` | DELETE | `deleteAddress` | API-ADDRESSES-01 | OK |
| `/api/users/me/addresses/[id]/use` | POST | `markAddressUsed` | API-ADDRESSES-01 | OK |

- Invitado al guardar → `/login?redirect=/explorar` (pin en `sessionStorage` como cola).
- Tope 20: copy Must en panel y diálogo.
- Tras DELETE de la activa: el pin **permanece**; el chip muestra `formattedAddress`.

---

## 3. Estados UI (4 estados obligatorios)

| Vista | Loading | Empty | Error | Success |
|-------|---------|-------|-------|---------|
| Panel favoritas | — | “Aún no tienes direcciones guardadas” | Geocode inline; tope 20 | Lista `label` + `formattedAddress` |
| Guardar | botón Guardar `loading` | Sin pin → “Elige un punto…” | Límite 20 / red | Chip con el nuevo label |
| GPS denegado | — | — | Copy F5/F7 sin coords crudas | — |

---

## 4. Formularios y validación

| Formulario | Campos | Mensajes inline |
|------------|--------|-----------------|
| Buscar dirección | ≥3 caracteres | “Escribe al menos 3 caracteres” / “No encontramos esa dirección” |
| Guardar ubicación | label 1–40 | Placeholder “Casa, Trabajo” |

---

## 5. Responsive y accesibilidad

- [x] Breakpoint móvil (`<md`): bottom sheet overlay (mapa no se empuja)
- [x] Breakpoint `≥md`: popover anclado al chip
- [x] Chip/filas/diálogos ≥44px; Escape cierra
- [x] `aria-expanded` / `aria-haspopup="dialog"`
- [x] El chip absorbe “Centro: X”

---

## 6. Pruebas

**Comando:** `npx vitest run tests/unit/explore-center.test.ts tests/unit/explore-f8.test.ts`

- [x] Hidratación URL / last-used / SN intacta
- [x] Coords fuera de México no se aceptan como pin (`isInMexico`)

---

## 7. Definition of Done (DoD Frontend)

- [x] **Diseño Pixel-Fidelidad**
- [x] **Responsive Design**
- [x] **Manejo de los 4 Estados UI**
- [x] **Consumo Limpio de APIs**
- [x] **Validación de Formulario**
- [x] **Accesibilidad Basal**

---

## 8. Notas para downstream

### QA Tester

- Reposo: un chip; **no** fila input+select+guardar; **no** `window.prompt`.
- Invitado guardar → login. Borrar activa: el mapa se queda.
- GPS denegado ≠ fuera de México.

### DevOps

Sin variables nuevas. Ver [integration-readme.md](../../comun/integration-readme.md).
