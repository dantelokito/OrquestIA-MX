# DT-F9-004 — FilterBar: habilitar chips bloqueados (Orgánico, Mayoreo, A domicilio, Filtros)

> **ID:** DT-F9-004  
> **Tipo:** Deuda técnica / mejora UX (no bug de producto F8)  
> **Severidad propuesta:** Major UX (no Blocker)  
> **Fase:** 9 (F8 permanece cerrada; F8 **Won't** «FilterBar nuevo»)  
> **Estado:** Abierta — revisión Product Manager  
> **Fecha:** 2026-08-25  
> **Código:** `C:\Users\PC GAMER\LaBorregaMarket`  
> **Relacionados:** [DT-F9-002](./DT-F9-002-header-explorar-busqueda.md) (búsqueda header; independiente)

---

## Incidencia

En `/explorar`, `FILTER_CHIPS` muestra filtros **visibles pero `disabled`**: el usuario los ve (opacidad ~60, `cursor-not-allowed`) y no puede usarlos. Prometen un recorte del catálogo que **no existe**.

Definición: `src/types/index.ts`.

| Chip | Estado hoy | Query / datos |
|------|------------|----------------|
| Verificado | Activo | `verified=true` — `GET /api/providers` |
| Frutas / Verduras / Agrícola | Activo | `category=FRUTA\|VERDURA\|AGRICOLA` |
| **Orgánico** | Bloqueado | **No hay** campo Prisma ni query |
| **Mayoreo** | Bloqueado | `Provider.offersWholesale` existe; **no** hay query de listing |
| **A domicilio** | Bloqueado | `Provider.offersDelivery` existe; **no** hay query de listing |
| **Filtros** | Bloqueado | Chip stub (⚙️); no abre panel ni más criterios |

F8 dejó FilterBar fuera de alcance a propósito. No reabre el sign-off.

---

## Propuesta (para el PM)

Habilitar **todos** los chips pendientes para que filtren de verdad (AND con geo, `q`, verificado y categoría, igual que hoy):

1. **Mayoreo** → listing con `offersWholesale=true` (campo ya en settings/detalle).
2. **A domicilio** → listing con `offersDelivery=true` (idem).
3. **Orgánico** → definir modelo (flag en `Product` / `Provider` / `ProviderProduct`) + query; **hoy no hay dato**. Si no hay US de catálogo orgánico, **quitar el chip** en lugar de dejarlo muerto.
4. **Chip «Filtros»:** o se **elimina** (redundante con la barra) o se convierte en overflow (más criterios: tarjeta en sucursal, WhatsApp, abierta ahora). No dejarlo disabled de adorno.
5. URL shareable (`US-EXPLORE-03`): params nuevos persistentes; tacha/clear alineada con DT-F9-002 si aplica.
6. Empty state si el AND no deja fruterías en radio.

**Backend Must:** sí para mayoreo/domicilio (query en `listProviders` / `buildWhere` + documentar API-PROVIDERS-01). Orgánico: Must de esquema si se conserva el chip.

---

## Criterios de aceptación (borrador para US/CO)

| ID | Criterio |
|----|----------|
| AC-1 | Ningún chip de FilterBar permanece `disabled` «de adorno». O funciona o se retira. |
| AC-2 | Mayoreo y A domicilio filtran el listing geo; URL refleja el estado. |
| AC-3 | Combinación AND con `verified`, `category`, `q` y radio. |
| AC-4 | Orgánico: o filtra con dato real, o el chip desaparece (decisión PM). |
| AC-5 | Chip «Filtros»: panel extra **o** se quita; no stub disabled. |
| AC-6 | Teclado / `aria-pressed`; ≥44px (paridad chips activos). |
| AC-7 | Empty copy si 0 resultados (no lista fantasma). |

---

## Repro (estado actual)

1. Abrir `/explorar` con pin.
2. En FilterBar, pulsar Orgánico, Mayoreo, A domicilio o Filtros.
3. **Observado:** no hay toggle; estilo disabled.
4. **Esperado (deuda):** filtran o no se muestran.

| Rol | Ruta |
|-----|------|
| Chips | `src/types/index.ts` (`FILTER_CHIPS`) |
| UI | `src/components/explore/FilterBar.tsx` |
| URL | `src/app/explorar/ExplorePageClient.tsx` |
| Listado | `GET /api/providers` → `buildWhere` |
| Flags negocio | Prisma `offersWholesale`, `offersDelivery` (detalle/settings; **no** listing) |

---

## Inventario

| Capacidad | En modelo | En GET listing | En detalle/preview |
|-----------|-----------|----------------|---------------------|
| Verificado / categoría | Sí | Sí | — |
| Mayoreo | `offersWholesale` | **No** | Sí |
| Domicilio | `offersDelivery` | **No** | Sí (chip si true) |
| Orgánico | **No** | No | No |
| Tarjeta / WhatsApp / abierta ahora | Detalle | No | Preview |

---

## Fuera de este ticket

- Typeahead header: [DT-F9-002](./DT-F9-002-header-explorar-busqueda.md).
- Preview in-card / distancia card: 001 y 003.
- Rediseño visual completo de FilterBar (colapso F7 se conserva). Chrome una barra + mapa más alto: [DT-F9-005](./DT-F9-005-chrome-barra-mapa.md).
- Checkout delivery (ya F4); este DT solo **filtra quién ofrece** domicilio.

---

## Conclusión para el PM

- Aceptar DT-F9-004: chips bloqueados **funcionan o se quitan**.
- US/CO + Arquitecto (query listing; orgánico = ¿esquema?). Luego UX (chip Filtros) → FE + BE.
- QA no corre gates hasta implementación.
