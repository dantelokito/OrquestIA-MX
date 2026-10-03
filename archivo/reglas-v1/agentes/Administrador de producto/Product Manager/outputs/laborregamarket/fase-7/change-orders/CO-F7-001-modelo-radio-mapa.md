# Change Order — Registro de Solicitud de Cambio

> **ID:** CO-F7-001
> **Fecha:** 18/08/2026
> **Proyecto:** LaBorregaMarket
> **Solicitante:** Dante (stakeholder)

#### 1. Descripción del Cambio

**Anular D-F6-9 / `US-GEO-07`:** el pan y el zoom del visualizador **ya no** derivan `radiusKm`.

El modelo F6 (zoom/pan = mismo alcance que el slider) provoca que al desplazarse el mapa se actualice el radio, se refetch la lista y se rompa el layout (prioridad del catálogo sobre el mapa). Dante confirma:

- Pan/zoom: **solo vista**. No cambian radio, slider, URL `radiusKm` ni lista.
- Slider de radio (1–25 km): actualiza círculo, **encuadra** el mapa, refetch Haversine.
- Nueva dirección (buscar), GPS (“Usar mi ubicación”) o favorita: cambian **centro**; radio vigente (default 10 km salvo ajuste) se mantiene o se aplica según US-GEO-11.
- Filtro de negocio sigue siendo Haversine (`US-GEO-02`). Sin bbox Must. Sin clustering.
- Leaflet/OSM intacto.

#### 2. Evaluación de Impacto

- [x] Arquitectura
- [x] Diseño UI/UX
- [ ] Base de datos

**Detalle del impacto:**

- **Arquitectura:** dejar de documentar derivación centro→borde del viewport. El cliente envía `radiusKm` del slider. Si F6 llegó a código pan→radio, revertir.
- **Diseño UI/UX:** delta `UF-GEO-01` — mapa primero; círculo visible; slider vivo; pan libre visual.
- **Base de datos:** sin delta por este CO (favoritas = US-GEO-14, otro ítem).
- **QA:** pan no cambia N ni R; slider sí; GPS + slider no crashea.

#### 3. Matriz de Intercambio (Trade-off)

* **Opción A:** Mantener F6 pan→radio y solo arreglar layout.
* **Opción B:** Swap — el modelo de producto es slider/dirección como única fuente de radio; se descarta el Must de pan→radio.

#### 4. Decisión

**Opción seleccionada:** B
**Aprobado por:** Dante
**Fecha de aprobación:** 18/08/2026

**Efecto en decisiones previas:** `D-F6-9` y el escenario 1 de `US-GEO-07` quedan **revocados**. `BL-123` superado por `US-GEO-10`. F6 permanece congelada (DASH/deuda no se tocan).
