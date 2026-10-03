# Loader borrega (3 frames)

Fuente de diseño para el loading reutilizable de LaBorregaMarket. Originated 16/08/2026 (Dante). Fondo transparente.

| Frame | Archivo | Qué muestra |
|-------|---------|-------------|
| B1 | [B1.png](./B1.png) | Borrega de pie, canasta + manzana en la mano |
| B2 | [B2.png](./B2.png) | Borrega alcanzando una manzana del árbol |
| B3 | [B3.png](./B3.png) | Borrega de perfil caminando con la canasta |

**Loop Must Explorar:** B1 → B2 → B3 (~400–600 ms por frame; UX ajusta).  
**`prefers-reduced-motion`:** solo B1, sin loop.  
**Runtime (Frontend):** copiar 1:1 a `LaBorregaMarket/public/brand/loader-borrega/`. Componente reutilizable (`BrandLoader` / `LoaderBorrega`); F6 lo exige en `/explorar` (`US-GEO-08`). F7 reutiliza el mismo loop en empty de radio (`US-GEO-16`), con tamaño ligeramente mayor (token UX, no PNG nuevos). Otros módulos pueden invocarlo después.

No usar estos PNG como splash a pantalla completa.
