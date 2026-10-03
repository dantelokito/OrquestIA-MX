# User Story — US-GEO-24

> **ID:** US-GEO-24  
> **Título:** Chrome Explorar en una barra horizontal y mapa ligeramente más alto  
>
> **Como:** visitante en `/explorar`  
> **Quiero:** menos bandas de chrome encima del mapa y un mapa un poco más alto  
> **Para:** recuperar prioridad mapa-primero sin perder filtros ni ubicación  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Barra):** Desde el breakpoint que defina UX (p. ej. ≥640px o ≥1024px), chips de filtro + GPS + LocationChip (y conteo si cabe) caben en **una** barra horizontal (`items-center`, ~44–52px). Copy/errores (geo denegado, «2 caracteres») van **debajo**, no inflan la fila.
> - [ ] **Escenario 2 (Mapa):** El mapa es **visiblemente más alto** (~+10–20% vs tokens F8: documentar delta; p. ej. móvil 360→~420px, desktop `min(440px,45vh)` → orden `min(520px,52vh)`). Overlay de radio (`RadiusSlider`) sigue anclado al mapa y usable.
> - [ ] **Escenario 3 (Móvil y no regresiones):** En viewport &lt; breakpoint: usable (wrap o segunda fila mínima; chips scroll-x); targets ≥44px. No regresionar BUG-012 (chrome fuera del scroll principal) ni BUG-013 (colapso FilterBar). `CO-F7-001`: pan/zoom no cambian `radiusKm`. LocationChip/panel F8 intactos.
> - [ ] **Regla de Negocio:** DT-F9-005 / BL-164. `CO-F9-001`. Sin API Must. Sign-off F8 **intacto**.
>
> **UX:** breakpoint + tokens de altura; scroll-x chips. **Arquitecto:** sin delta Must. **QA:** una barra en desktop; mapa más alto; pan no mueve R; colapso FilterBar ok.
