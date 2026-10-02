> **Pantalla:** Chrome Explorar compacto + mapa más alto
> **Objetivo Principal:** Una barra horizontal en desktop; recuperar viewport del mapa
> **Historia:** US-GEO-24

```text
DESKTOP ≥ md (768px) — UNA BARRA (~44–52px)
+-----------------------------------------------------------------------+
| [Verif][Fruta]…[Mayoreo][Domicilio]  [GPS]  [📍 Casa ▾]  12 a 5 km   |
+-----------------------------------------------------------------------+
| (errores / hints debajo — no inflan la fila)                           |
| ⚠ Permiso de ubicación denegado…                                      |
+-----------------------------------------------------------------------+
| MAPA  min(520px, 52vh)  sticky                                         |
|  … teselas …                                                           |
|  [==== RadiusOverlayF8 500 m – 10 km ====]                             |
+-----------------------------------------------------------------------+
| LISTA cards                                                            |
+-----------------------------------------------------------------------+

MÓVIL < md — wrap / 2ª fila mínima
+-----------------------------------+
| [chips scroll-x ……………]            |
| [GPS] [📍 Chip ▾]  12 a 5 km      |  ← 2ª fila si no cabe
+-----------------------------------+
| MAPA h-[420px]                    |
| [==== RadiusOverlay ====]         |
+-----------------------------------+
| LISTA                             |
+-----------------------------------+
```

### Tokens de altura

| Viewport | F8 (baseline) | F9 |
|----------|---------------|-----|
| Móvil mapa | 360px | **420px** (~+17%) |
| Desktop mapa | `min(440px, 45vh)` / sticky calc | **`min(520px, 52vh)`** (~+18%) |
| CSS | `--explore-map-min-h-mobile: 360px` | `--explore-map-min-h-mobile: 420px` |

### No regresiones

| ID | Regla |
|----|-------|
| BUG-012 | Chrome fuera del scroll principal del mapa/lista |
| BUG-013 | Colapso FilterBar sigue funcionando |
| CO-F7-001 | Pan/zoom **no** cambian `radiusKm` |
| F8 | LocationChip + panel + overlay radio intactos |

### DoD

- [ ] Una barra en `md+`; errores debajo.
- [ ] Mapa visiblemente más alto (+10–20%).
- [ ] Móvil usable; targets ≥44px.
- [ ] Overlay radio anclado y usable.

### Referencias

`UF-GEO-01-explorar-f9.md`, tokens §6h `ExploreChromeF9` / `ExploreLayoutF9`, Arch `API-EXPLORE-NOTES-01`.
