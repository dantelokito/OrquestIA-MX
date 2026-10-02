# Handoff de Feature: FEAT-PREVIEW

> **Proyecto:** laborregamarket
> **Feature:** PREVIEW (vitrina en sheet desde Explorar)
> **Stack UI:** Next.js 15 + React 19 + Tailwind 4 + Lucide
> **Fecha:** 2026-08-18
> **Wireframe:** `WF-explorar-preview`
> **Contrato:** `API-PROVIDER-PREVIEW-01` + `MOD-PROVIDER-PREVIEW-handoff`
> **US:** US-EXPLORE-05

---

## 1. Pantallas y componentes implementados

| Pantalla / Vista | Wireframe | Ruta | Estado |
|------------------|-----------|------|--------|
| Preview vitrina | `WF-explorar-preview` | `/explorar` (sheet) | OK |
| Ancla de reseñas | F4 detalle | `/fruteria/[id]#resenas` | OK |

**Componentes:**

| Componente | Ubicación | Descripción |
|------------|-----------|-------------|
| `ProviderPreviewSheet` | `src/components/explore/ProviderPreviewSheet.tsx` | `role="dialog"`, Escape, focus trap, CTA Ver frutería |
| `OpenNowChip` | dentro de `ProviderPreviewSheet` | Oculto si `isOpenNow === null` |
| `HoursTable` | `src/components/explore/HoursTable.tsx` | 3 columnas `>=640px`, apilado `<640px`, `max-h-48` |
| `CapabilityIcons` / `WholesaleRetailChips` | `src/components/explore/ProviderCapabilities.tsx` | Flags solo si el contrato dice `true` |
| `buildHoursRows` / `formatVerifiedSince` | `src/lib/providers/hours-format.ts` | Lógica pura de horario y copy de verificación |

Apertura: segundo tap/click en un marker o botón **Vista rápida** de la card. Reseñas reutilizan `ReviewCard` de F4.

---

## 2. Integración API

| Endpoint | Método | Service | Contrato | Estado |
|----------|--------|---------|----------|--------|
| `/api/providers/[id]` | GET | `getProviderById` | API-PROVIDER-PREVIEW-01 | OK |

`ProviderDetail` extendido en `src/lib/api/types.ts`: `verifiedAt`, `hoursPublished`, `isOpenNow`, `openingHours[]`, `reviewsPreview[]`, `whatsappEnabled`, `acceptsCardAtStore`, `offersWholesale`, `offersRetail`.

Reglas de render: WhatsApp exige `whatsappEnabled === true` **y** `phone`; envío y tarjeta solo con `true`; catálogo solo productos `isAvailable`.

---

## 3. Estados UI

| Vista | Loading | Empty | Error | Success |
|-------|---------|-------|-------|---------|
| Sheet | `BrandLoader size="loading"` + sr-only "Cargando frutería" | Horario: "Horario no publicado" · Catálogo: "No hay productos activos en vitrina" · Reseñas: "Sin reseñas todavía" | Inline + Reintentar sin cerrar Explorar | Nombre, chip abierto/cerrado, flags, horario, catálogo, 3 reseñas |

404: el sheet se cierra y la lista de Explorar refresca.

---

## 4. Formularios y validación

No hay formularios en el preview (vista de lectura).

---

## 5. Responsive y accesibilidad

- [x] Móvil bottom sheet `max-h-[90vh]` con CTA al pie; desktop `max-w-lg` centrado
- [x] `role="dialog"` + `aria-modal` + `aria-labelledby` = nombre del negocio
- [x] Foco inicial en Cerrar; Escape cierra; Tab circula dentro del diálogo
- [x] Flags con icono **y** texto (`aria-label` descriptivo), nunca solo color
- [x] CTA dominante "Ver frutería"; secundario "Ver todas las reseñas" → `#resenas`

---

## 6. Pruebas

**Comando:** `npx vitest run tests/unit/hours-format.test.ts`

- [x] Orden lunes→domingo
- [x] Día cerrado sin inventar horas
- [x] Horario no publicado → sin filas
- [x] "verificado a la borrega desde MM/AAAA" y fallback sin fecha

---

## 7. Definition of Done (DoD Frontend)

- [x] **Diseño Pixel-Fidelidad**
- [x] **Responsive Design**
- [x] **Manejo de los 4 Estados UI**
- [x] **Consumo Limpio de APIs**
- [x] **Validación de Formulario** (N/A — vista de lectura)
- [x] **Accesibilidad Basal**

---

## 8. Notas para downstream

### QA Tester

- Frutería sin horario: no aparece chip Abierta/Cerrada y el bloque dice "Horario no publicado".
- Frutería con `whatsappEnabled=false`: no debe aparecer el icono de WhatsApp.
- "Ver todas las reseñas" debe aterrizar en la sección de reseñas del detalle.
- Sheet abierto en móvil: se puede hacer scroll y el CTA queda visible al pie.

### DevOps

Sin variables nuevas.
