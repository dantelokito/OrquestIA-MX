# Change Order — Registro de Solicitud de Cambio

> **ID:** CO-F8-002
> **Fecha:** 24/08/2026
> **Proyecto:** LaBorregaMarket
> **Solicitante:** Dante (stakeholder)

#### 1. Descripción del Cambio

**Acotar el viewport de `/explorar` a territorio mexicano** y conservar la armonía vista ↔ círculo de búsqueda.

Dante confirma (24/08/2026, opción A):

- El mapa **no** se panea ni se aleja hasta EUA u otros países. `maxBounds` = bbox canónico de México (Arquitecto).
- Cuando cambian centro o radio (slider, GPS, dirección, favorita), el mapa **encuadra el círculo** (`FitCircle` / `fitBounds`). Eso ya es F7; se mantiene.
- Pan/zoom **dentro de México** siguen siendo **solo vista**. No cambian `radiusKm`, URL ni lista (`CO-F7-001` **intacto**).
- Filtro de negocio = Haversine (`US-GEO-02`). **No** es bbox Must en `GET /api/providers`.
- Pin arrastrado, geocode o GPS **fuera de México:** se rechaza; se conserva el último centro válido (o SN).

“Pan libre visual” de F7 queda **restringido a México**, no al mundo.

#### 2. Evaluación de Impacto

- [x] Arquitectura
- [x] Diseño UI/UX
- [ ] Base de datos

**Detalle del impacto:**

- **Arquitectura:** constante bbox México + `minZoom` (o equivalente) para no ver el continente. Validar pin/URL/GPS/geocode contra ese bbox. Sin polígono INEGI Must. Sin endpoint nuevo Must. Leaflet/OSM.
- **Diseño UI/UX:** rebote en el borde; copy no técnico si la ubicación está fuera de México.
- **Base de datos:** sin delta.
- **QA:** no se llega a Texas/Guatemala; slider sigue encuadrando; pan en MTY no refetch.

#### 3. Matriz de Intercambio (Trade-off)

* **Opción A:** Límite México + encuadre al círculo al cambiar radio/centro; pan interno no cambia la búsqueda.
* **Opción B:** Impedir alejarse del círculo (no ir de MTY a CDMX). Más estricto.
* **Opción C:** Pan/zoom vuelven a mandar centro/radio (revoca F7). Descartada.

#### 4. Decisión

**Opción seleccionada:** A
**Aprobado por:** Dante
**Fecha de aprobación:** 24/08/2026

**Efecto en decisiones previas:** `CO-F7-001` (pan ≠ radio) **sigue**. Se acota el alcance geográfico del pan. No se reabre `US-GEO-07`. `CO-F8-001` (0.5–10 km) no se toca.
