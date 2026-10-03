# User Story — US-GEO-08

> **ID:** US-GEO-08  
> **Título:** Animación breve de carga (loader borrega B1–B3) al actualizar negocios según el mapa  
>
> **Como:** visitante o CLIENT en `/explorar`  
> **Quiero:** ver la borrega cosechando (B1 → B2 → B3) cuando la lista se actualiza por zoom, pan o slider  
> **Para:** entender que la búsqueda se está refrescando, sin una pantalla en blanco  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Loading):** Dado que el mapa o el slider dispara un refetch (`US-GEO-07`), cuando la API aún no responde, entonces la **lista** muestra el loop **B1 → B2 → B3** (PNG transparentes en `comun/brand/loader-borrega/`) con `aria-busy="true"` y texto sr-only “Buscando fruterías”; el mapa y el círculo siguen visibles. No splash a pantalla completa. Skeleton/`animate-pulse` **no** es el Must.
> - [ ] **Escenario 2 (Éxito / vacío):** Dado que llega el result set, cuando termina el fetch, entonces se quita el loader y se muestran cards o el empty “No hay fruterías en este radio” + Ampliar radio (F5).
> - [ ] **Escenario 3 (Error de red):** Dado un fallo de API, cuando el refetch falla, entonces se quita el loader; ErrorBanner + Reintentar; **se conserva la lista previa** si existía (espíritu `UF-GEO-01`).
> - [ ] **Regla de Negocio:** D-F6-10. Componente **reutilizable** (`BrandLoader` / `LoaderBorrega`: tamaño + label). F6 lo exige en Explorar; otros módulos pueden invocarlo después sin rediseñar frames. `prefers-reduced-motion: reduce` → solo **B1**, sin loop. No bloquear slider ni mapa. Filtros F2 siguen en el mismo request. Runtime FE: `public/brand/loader-borrega/B1.png` … `B3.png` (copia 1:1 de `comun/brand/loader-borrega/`).

>
> **UX:** delta `WF-explorar-leaflet` + tokens del loader (intervalo ~400–600 ms). **QA:** `aria-busy`; reduced-motion; lista previa en error; no flash vacío si el refetch es rápido (debounce).
