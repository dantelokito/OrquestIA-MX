# Handoff QA → Product Manager — LaBorregaMarket F9

> **De:** QA Tester Senior  
> **Para:** @Product Manager  
> **Proyecto:** LaBorregaMarket  
> **Fecha:** 25/08/2026  
> **Fase QA activa:** 9  
> **Fase 8:** cerrada (sign-off APROBADO CON CONDICIONES 24/08) — **no reabrir**

---

## Pedido

Revisar cinco deudas técnicas / mejoras UX (no `BUG-{NNN}`). **Cola F9 cerrada en documentación** (001–005):

| ID | Parte | Prompt |
|----|-------|--------|
| [DT-F9-001](./deuda-tecnica/DT-F9-001-preview-in-card.md) | **1/3** preview in-card | [`activation-prompt-pm-DT-F9-001.txt`](./activation-prompt-pm-DT-F9-001.txt) |
| [DT-F9-002](./deuda-tecnica/DT-F9-002-header-explorar-busqueda.md) | **2/3 + 3/3** header EXPLORAR | [`activation-prompt-pm-DT-F9-002.txt`](./activation-prompt-pm-DT-F9-002.txt) |
| [DT-F9-003](./deuda-tecnica/DT-F9-003-card-distancia-origen.md) | Card: `minPrice` → distancia pin→frutería | [`activation-prompt-pm-DT-F9-003.md`](./activation-prompt-pm-DT-F9-003.md) |
| [DT-F9-004](./deuda-tecnica/DT-F9-004-filterbar-chips-bloqueados.md) | FilterBar chips disabled | [`activation-prompt-pm-DT-F9-004.md`](./activation-prompt-pm-DT-F9-004.md) |
| [DT-F9-005](./deuda-tecnica/DT-F9-005-chrome-barra-mapa.md) | Barra horizontal + mapa más alto | [`activation-prompt-pm-DT-F9-005.md`](./activation-prompt-pm-DT-F9-005.md) |

**No** asignar Frontend ni UX hasta que PM acepte el alcance y emita US/CO F9.

---

## Qué pide QA que decida el PM

### DT-F9-001 (Parte 1/3)

1. Aceptar preview hover/long-press como **animación dentro del mismo card**.
2. Conservar triggers F8; clic/tap corto → `/fruteria/{id}`; un solo abierto; `prefers-reduced-motion`.
3. No recortar US-EXPLORE-05. Reutilizar `GET /api/providers/[id]` — **sin API Must nueva** para esta parte.

### DT-F9-002 (Partes 2/3 + 3/3) — ya no es backlog vacío

1. Aceptar refactor del **header exclusivo de `/explorar`**: búsqueda dinámica por productos activos (índice interno) y nombre similar de frutería.
2. Typeahead **solo fruterías** (portada + nombre). Corpus = **todo el radio**, no la página actual.
3. Al seleccionar: filtro + **aviso ligero** en la barra. Tacha: limpia texto y filtros.
4. Con Arquitecto: listing paginado vs suggest/`q`+geo sobre el conjunto. El modelo de datos ya existe.

### DT-F9-003 (card distancia)

1. Aceptar quitar `minPrice` / «$X MXN desde» del slot semibold de la card.
2. Una fila: distancia Haversine pin→sucursal (`distanceKm` ya en listing geo) + ETA (`computeEtaMinutes`, ADR-017); opcional barra vs radio.
3. Sin pin: no inventar km. **Sin API Must.**

### DT-F9-004 (FilterBar chips)

1. Aceptar: chips **Orgánico, Mayoreo, A domicilio, Filtros** o filtran de verdad o se retiran (nada disabled de adorno).
2. Mayoreo / domicilio: `offersWholesale` / `offersDelivery` ya existen; falta query listing + URL. Arquitecto.
3. Orgánico: no hay campo — esquema o quitar chip. Chip «Filtros»: overflow o quitar.

### DT-F9-005 (chrome + mapa) — último de la cola

1. Aceptar **una barra horizontal** (chips + GPS + LocationChip) para recuperar altura; mapa **ligeramente** más alto (tokens; UX fija delta ~10–20%).
2. No regresionar BUG-012/013 ni `CO-F7-001`. **Sin API Must.**
3. Móvil: wrap o segunda fila mínima; no forzar 8 chips en 320px.

## Clasificación

| Campo | DT-F9-001 | DT-F9-002 | DT-F9-003 | DT-F9-004 | DT-F9-005 |
|-------|-----------|-----------|-----------|-----------|-----------|
| Tipo | Deuda técnica | Deuda técnica | Deuda técnica | Deuda técnica | Deuda técnica |
| Relación F8 | US-EXPLORE-07 / `CO-F8-003`; sign-off F8 **intacto** | Header `q` / HP-EXPLORE-06; sign-off F8 **intacto** | Card listing / `distanceKm`; sign-off F8 **intacto** | FilterBar Won't F8; sign-off F8 **intacto** | Layout mapa-primero; BUG-012/013 F7; sign-off F8 **intacto** |
| Destino siguiente (tras US/CO) | UX → Frontend | UX (typeahead) → Frontend; Arquitecto si hay suggest | UX (copy) → Frontend | Arquitecto (query) → UX → FE + BE | UX (breakpoint + delta altura) → Frontend |
| Backend Must | No para Parte 1/3 | Posible (índice extra-página) — decide PM/Arquitecto | No | Sí (listing mayoreo/domicilio); orgánico si se conserva el chip | No |

## Inventario (resumen)

El aplicativo **sí trae** card (`ProviderListing`, incl. `sampleProducts`) y detalle (`ProviderDetail.products[]`). Header ya filtra con `q` en radio. Falta UX de suggest/chip/tacha y corpus no limitado al paginado. Detalle en cada DT.

## Fuera de esta cola

- Handoff Frontend / Backend (hasta US/CO)
- Specs Playwright / matrices F9
- Reopen de QA-F8-signoff
- Typeahead de artículos (SKU) como filas del desplegable
