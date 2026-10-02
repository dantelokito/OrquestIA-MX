# Change Order — Registro de Solicitud de Cambio

> **ID:** CO-F9-001
> **Fecha:** 25/08/2026
> **Proyecto:** LaBorregaMarket
> **Solicitante:** Dante (stakeholder) / QA Tester Senior (deuda documentada)

#### 1. Descripción del Cambio

Fase 9 **absorbe** la cola de deuda técnica Explorar documentada por QA tras el sign-off F8 (`DT-F9-001` … `DT-F9-005`). **No** reabre el sign-off F8 ni las US F7/F8.

| DT QA | US F9 | Cambio |
|-------|-------|--------|
| DT-F9-001 | US-EXPLORE-08 | Preview hover/long-press pasa de popover desanclado a **animación in-card** |
| DT-F9-002 | US-EXPLORE-09 | Header EXPLORAR: typeahead de fruterías (productos activos + nombre), radio completo, aviso + tacha |
| DT-F9-003 | US-EXPLORE-10 | Slot visual `minPrice` → distancia pin→frutería + ETA |
| DT-F9-004 | US-EXPLORE-11 | Chips Mayoreo/Domicilio funcionales; **Orgánico** y **«Filtros»** retirados |
| DT-F9-005 | US-GEO-24 | Chrome en una barra horizontal + mapa ligeramente más alto (~10–20%) |

Decisiones D-F9-1 … D-F9-9 en [`../prd.md`](../prd.md).

#### 2. Evaluación de Impacto

- [x] Arquitectura
- [x] Diseño UI/UX
- [ ] Base de datos (sin schema orgánico; flags mayoreo/domicilio ya existen)

**Detalle del impacto:**

- **Arquitectura:** 008/010/024 sin API Must. 009: Arch decide suggest vs `q`+geo sobre conjunto en radio. 004: query listing `offersWholesale` / `offersDelivery` + params URL; documentar API-PROVIDERS-01.
- **Diseño UI/UX:** animación in-card; typeahead minimalista; copy distancia/ETA; barra chrome + tokens de altura de mapa; retirar chips muertos.
- **Base de datos:** sin migración Must (Orgánico retirado).
- **QA:** gates F9 post-implementación; sign-off F8 **intacto**.

#### 3. Matriz de Intercambio (Trade-off)

* **Opción A:** Reabrir F8 y corregir preview/FilterBar como reopen del sign-off.
* **Opción B:** Fase 9 dedicada a deuda UX Explorar; F8 permanece cerrada.

#### 4. Decisión

**Opción seleccionada:** B  
**Aprobado por:** Dante (plan F9 25/08/2026)  
**Fecha de aprobación:** 25/08/2026

**Efecto en decisiones previas:** F8 Won't «FilterBar nuevo» se **sustituye** solo en el sentido de que F9 habilita Mayoreo/Domicilio y retira stubs — **sin** reabrir US-EXPLORE-07 ni CO-F8-*. `CO-F7-001` (pan ≠ radio) **intacto**. `US-EXPLORE-05` (contenido preview) **sigue**.
