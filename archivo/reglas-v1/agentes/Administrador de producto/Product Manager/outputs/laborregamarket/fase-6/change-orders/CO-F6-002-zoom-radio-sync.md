# Change Order — Registro de Solicitud de Cambio

> **ID:** CO-F6-002
> **Fecha:** 16/08/2026
> **Proyecto:** LaBorregaMarket
> **Solicitante:** Dante (stakeholder)

#### 1. Descripción del Cambio

Promover a **Must F6** la homologación del **visualizador del mapa** (zoom y pan) con la **barra de radio** y el **círculo de cobertura** en `/explorar`.

Hoy el slider 1–25 km y `GET /api/providers?lat&lng&radiusKm` funcionan (F5 / `US-GEO-04`, `US-GEO-05`). Hacer zoom **no** mueve el radio ni la lista (Should F5 / `BL-105`, diferido). Dante pide **un solo modelo**:

- El círculo de cobertura **siempre visible**.
- Zoom/pan y slider son el mismo alcance: alejar crece `radiusKm` + slider + lista; acercar lo reduce; mover el slider encuadra el círculo.
- Filtro de negocio **sigue siendo Haversine** (`US-GEO-02`). **No** bbox Must ni clustering.
- Al refrescar negocios: **animación breve de carga** en la lista (`US-GEO-08`).

Tope 1–25 km: viewport > 25 km → clamp a 25, círculo a 25 km, hint no bloqueante. Debounce al terminar pan/zoom.

**No cambia:** Leaflet/OSM (`US-GEO-06`), pagos aparcados (`CO-F6-001`), reportes DASH.

#### 2. Evaluación de Impacto

- [x] Arquitectura
- [x] Diseño UI/UX
- [ ] Base de datos

**Detalle del impacto:**

- **Arquitectura:** sin schema ni bbox Must. FE deriva `radiusKm` del visualizador (distancia centro→borde, clamp) y reusa `GET /api/providers`. Debounce. URL `lat`/`lng`/`radiusKm` hidratada.
- **Diseño UI/UX:** delta `UF-GEO-01` / `WF-explorar-leaflet` — círculo siempre on, slider vivo con zoom, **loader borrega B1–B3** (`aria-busy`) al refetch. No rediseñar deuda ContactCTA ni DASH.
- **Base de datos:** sin delta.
- **QA:** casos zoom↔slider↔lista mismo result set; clamp 25 km; loading no deja lista en blanco permanente.

#### 3. Matriz de Intercambio (Trade-off)

* **Opción A:** Aumentar tiempo de entrega o presupuesto.
  - Estimación adicional: un sprint extra solo de GEO sync, retrasando deuda P0 o reportes.
* **Opción B:** Intercambiar la nueva función por una del backlog actual de esfuerzo equivalente (*Swap*).
  - Funcionalidad a descartar/intercambiar: **clustering de markers** (sigue Won't F6) y **API bbox Must** (sigue Could/Won't). El esfuerzo GEO F6 es sync zoom↔radio + loading, no un motor de mapa nuevo.

#### 4. Decisión

**Opción seleccionada:** B
**Aprobado por:** Dante
**Fecha de aprobación:** 16/08/2026

**Efecto en decisiones previas:** D-F5-3 (viewport/bbox = Should, no Must) se **ajusta en F6**: el visualizador **sí** mueve el radio Haversine (`D-F6-9`). Bbox API **sigue** sin ser contrato Must. `BL-105` queda superado por `US-GEO-07` / `US-GEO-08`.
