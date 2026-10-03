# Change Order — Registro de Solicitud de Cambio

> **ID:** CO-F8-001
> **Fecha:** 24/08/2026
> **Proyecto:** LaBorregaMarket
> **Solicitante:** Dante (stakeholder)

#### 1. Descripción del Cambio

**Sustituir el clamp de radio 1–25 km por 500 m–10 km** en `/explorar`, y compactar el overlay del slider. El modelo de negocio **no cambia**: el slider (y “Ampliar radio”) siguen siendo la fuente de `radiusKm`; pan/zoom **no** derivan radio (`CO-F7-001` intacto). Filtro = Haversine (`US-GEO-02`).

Dante confirma (24/08/2026):

- Mínimo: **500 m** (`radiusKm=0.5`)
- Máximo: **10 km** (`radiusKm=10`)
- Default primera carga: **10 km** (sigue `US-GEO-11`; ahora coincide con el máximo)
- Param API/URL: sigue `radiusKm` (decimal permitido). **No** `radiusM` nuevo
- Overlay del pie del mapa: menos alto vertical; no tapar el mapa de más
- Búsqueda por radio, círculo y refetch al soltar/arrastrar el slider: **igual** que F7

#### 2. Evaluación de Impacto

- [x] Arquitectura
- [x] Diseño UI/UX
- [ ] Base de datos

**Detalle del impacto:**

- **Arquitectura:** `clampGeoRadiusKm` / `clampRadiusKm` pasan de 1–25 a **0.5–10**. FE **no** puede `Math.round` a entero (rompería 0.5). Bookmark `radiusKm=22` → 10; `radiusKm=0` → 0.5. Sin endpoint nuevo. Sin bbox.
- **Diseño UI/UX:** overlay compacto (`RadiusSlider` + hint “Máximo 25 km” → máximo 10). Copy &lt; 1 km en metros. CTA empty “Ampliar radio” no supera 10.
- **Base de datos:** sin delta.
- **QA:** slider 0.5 y 10; URL fuera de rango; pan no cambia R; lista/markers = Haversine del radio vigente.

#### 3. Matriz de Intercambio (Trade-off)

* **Opción A:** Solo compactar el overlay y dejar 1–25 km.
* **Opción B:** Compactar **y** acotar el mercado a 500 m–10 km (alcance local AMM).

#### 4. Decisión

**Opción seleccionada:** B
**Aprobado por:** Dante
**Fecha de aprobación:** 24/08/2026

**Efecto en decisiones previas:** de `D-F7-3` se **revoca solo el clamp 1–25**. Default SN + 10 km y `CO-F7-001` (pan ≠ radio) **siguen**. Escenario 2 de `US-GEO-10` (“slider 1–25”) queda superado por `US-GEO-22`.
