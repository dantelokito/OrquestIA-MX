# Change Order — Registro de Solicitud de Cambio

> **ID:** CO-F5-001
> **Fecha:** 14/08/2026
> **Proyecto:** LaBorregaMarket
> **Solicitante:** Dante (stakeholder)

#### 1. Descripción del Cambio

Revocar **D-F4-2**: Google Maps JS API deja de ser el motor de `/explorar`. El mapa debe funcionar **sin clave de facturación** (Leaflet + teselas OpenStreetMap). El slider de radio (1–25 km) se mueve al **borde inferior del mapa**; el CTA **Usar mi ubicación** pasa al **banner superior** de `/explorar`.

Motivo: no se puede pagar una API de mapas; en local/QA el mapa cae al fallback EC-08 / **OBS-F4-023** ("Mapa no disponible") cuando falta `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`.

**No cambia:** filtro Haversine `lat`/`lng`/`radiusKm` (`US-GEO-02`); direcciones favoritas (`US-GEO-03`); enlace/embed de reseñas Google para verificados (`US-REV-03` / D-F4-1).

#### 2. Evaluación de Impacto

- [x] Arquitectura
- [x] Diseño UI/UX
- [ ] Base de datos

**Detalle del impacto:**

- **Arquitectura:** ADR-016 (Google Maps JS) queda superado. Nuevo ADR-020 (Leaflet/OSM). Deja de ser requisito de infra la Google Maps JS API key para Explorar. Attribution OSM obligatoria.
- **Diseño UI/UX:** delta de `WF-explorar-geo.md` / `UF-GEO-01` — LocationBar ya no concentra ubicación + radio; radio overlay en mapa; ubicación en banner.
- **Base de datos:** sin delta por el motor de mapa. (Colores de proveedor son `US-BRAND-*`, no este CO.)
- **QA:** sustituir EC-08 "sin Maps key → Mapa no disponible" por casos del motor Leaflet; lista sigue siendo alternativa a11y.

#### 3. Matriz de Intercambio (Trade-off)

* **Opción A:** Aumentar tiempo de entrega o presupuesto.
  - Estimación adicional: un sprint extra de mapas pagados + billing Google, incompatibles con la restricción de no pagar API.
* **Opción B:** Intercambiar la nueva función por una del backlog actual de esfuerzo equivalente (*Swap*).
  - Funcionalidad a descartar/intercambiar: **pasarela de pagos in-app (`BL-040`)**, que no entra en Fase 5. El esfuerzo de F5 se destina a Leaflet + layout Explorar + catálogo endurecido + marca proveedor.

#### 4. Decisión

**Opción seleccionada:** B
**Aprobado por:** Dante
**Fecha de aprobación:** 14/08/2026

**Efecto en decisiones previas:** D-F4-2 **revocada**. D-F5-2 (Leaflet + OSM) es la fuente de verdad para `/explorar`.
