# Matriz de Casos de Prueba: TC-EXPLORE-matrix (F8)

> **Proyecto:** laborregamarket  
> **Módulo / Feature:** Preview hover / long-press (sin «Vista rápida»)  
> **Historia / Contrato:** US-EXPLORE-07, US-EXPLORE-05 (contenido), API-PROVIDER-PREVIEW-01 F8, CO-F8-003  
> **Fecha:** 2026-08-24  
> **Ambiente:** `http://localhost:8080`

---

## Resumen de ejecución

| Métrica | Valor |
|---------|-------|
| Total de casos | 9 |
| Happy path | 7 |
| Negativos / edge | 2 |
| Pass / Fail / Blocked / Pendiente | 6 Pass / 0 Fail / 0 / 3 smoke |

**Supersedido F7:** HP-EXPLORE-05 clic en botón «Vista rápida».

---

## Tabla resumen

| ID | Nombre | Tipo | Prioridad | Auto | Estado |
|----|--------|------|-----------|------|--------|
| HP-EXPLORE-07 | Hover abre preview anclado; cero «Vista rápida» | Positivo | P1 | e2e/explore-f8.spec.ts | Pass |
| HP-EXPLORE-07b | Clic/tap corto → `/fruteria/[id]` | Positivo | P1 | e2e/explore-f8.spec.ts | Pass |
| HP-EXPLORE-07c | Long-press abre; scroll no abre | Positivo | P1 | e2e (parcial) + smoke móvil | Pendiente smoke |
| HP-EXPLORE-07d | Teclado Alt+Enter / Eye focus-visible | Positivo | P2 | e2e/explore-f8.spec.ts | Pass (Alt+Enter) |
| HP-EXPLORE-07e | Marker abre el mismo preview | Positivo | P1 | manual / e2e si estable | Pendiente smoke |
| HP-EXPLORE-05b | API detalle campos preview F7 intactos | Positivo | P1 | api/providers.spec.ts | Pass |
| HP-EXPLORE-06 | Búsqueda mango (producto) | Positivo | P1 | e2e/explore-f7.spec.ts | Pass |
| EC-EXPLORE-01 | 500 providers → ErrorBanner, no borrega | Edge | P1 | e2e/explore-f7.spec.ts | Pass |
| EC-EXPLORE-03 | Un GET en vuelo; cache por id | Edge | P2 | Should (NFR FE) | Pendiente |

---

## 1. Casos Positivos (Happy Path)

| ID | Nombre | Prerrequisitos | Resultado esperado | Estado |
|----|--------|----------------|-------------------|--------|
| HP-EXPLORE-07 | Hover | Lista con cards; puntero | Tras ~300 ms, `role=dialog` anclado con «Ver frutería»; **cero** botón «Vista rápida» | [ ] |
| HP-EXPLORE-07b | Clic corto | Card visible | Navega a `/fruteria/{id}` | [ ] |
| HP-EXPLORE-07c | Long-press | Touch / pointer down 500 ms | Mismo preview; click sintético no navega; scroll cancela | [ ] |
| HP-EXPLORE-07d | Teclado | Foco en card | Alt+Enter o botón Eye (`aria-label=Vista previa`) abre preview | [ ] |
| HP-EXPLORE-07e | Marker | Mapa con pins | Tap marker abre el mismo popover | [ ] |
| HP-EXPLORE-05b | Shape API | GET `/api/providers/[id]` | Campos F7 (horario, flags, reviewsPreview, catálogo) **sin recorte** | [ ] |
| HP-EXPLORE-06 | q=mango | Header búsqueda | URL `q=mango`; cards visibles | [ ] |

## 2. Casos Negativos (Unhappy Path)

| ID | Nombre | Input inválido | Error esperado | Estado |
|----|--------|----------------|----------------|--------|
| EC-EXPLORE-01 | 500 lista | GET providers 500 en refetch | ErrorBanner + Reintentar; no empty borrega | [ ] |

## 3. Casos Límite (Edge Cases)

| ID | Nombre | Condición límite | Resultado esperado | Estado |
|----|--------|------------------|-------------------|--------|
| EC-EXPLORE-03 | Spam hover | Cruzar varias cards | Máximo un GET en vuelo por id; cache sesión; un preview a la vez | [ ] |

## 4. Casos de Seguridad / Permisos

Preview y listado son públicos. 404 inactivo → toast «Esta frutería no está disponible» (FE).

---

## Referencias upstream

- PM: `US-EXPLORE-07`, `CO-F8-003`; contenido = `US-EXPLORE-05` (solo lectura F7)
- Contrato: `API-PROVIDER-PREVIEW-01` F8 (NFR debounce/cache; cero API nueva)
- Handoff FE: `FEAT-PREVIEW-HOVER-handoff.md`

## Notas

- Long-press en iOS real = smoke Should (igual criterio que EC-AUTH-09: no bloquea diseño).
- Heart y ContactCTA de la card se mantienen.
