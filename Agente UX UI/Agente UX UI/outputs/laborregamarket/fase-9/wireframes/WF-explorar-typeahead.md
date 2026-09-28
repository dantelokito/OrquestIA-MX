> **Pantalla:** Header typeahead exclusivo de `/explorar`
> **Objetivo Principal:** Sugerir fruterías del radio completo (portada + nombre) sin depender de la página de cards
> **Historia:** US-EXPLORE-09

```text
+-----------------------------------------------------------------------+
| HEADER (solo ruta /explorar)                                           |
|  [Logo]  [ 🔍  mango________________ ✕ ]  [Cuenta]                     |
|                 │                                                      |
|                 v  dropdown (debounced)                                 |
|         +--------------------------------------+                       |
|         | [img] Frutas El Paraíso              |  fila ≥44px           |
|         | [img] Mercado La Borrega             |  cover/logo + nombre  |
|         | [img] Don Pepe                       |                       |
|         +--------------------------------------+                       |
|  PROHIBIDO: filas de SKU / "Mango 1kg" como sugerencia                 |
|  PROHIBIDO: typeahead en otras rutas (landing usa redirect ?q=)        |
+-----------------------------------------------------------------------+
| BARRA EXPLORE                                                          |
|  …  [Filtro: mango ✕]  ← aviso ligero / chip cuando hay q activo       |
+-----------------------------------------------------------------------+
```

### Comportamiento

| Estado | Spec |
|--------|------|
| `q` &lt; 2 | Hint “Escribe al menos 2 caracteres”; no GET |
| `q` ≥ 2 + pin | Debounce ~300 ms → `GET /api/providers?q&lat&lng&radiusKm&limit=10&page=1` |
| Sin pin | Empty: “Elige una ubicación para buscar fruterías.” — no inventar |
| Filas | Solo fruterías: `coverUrl`/`logoUrl` 40×40 + `businessName` |
| Match producto | Índice **interno** del predicado `q` (unión F7); UI solo muestra negocios |
| Selección | Aplica filtro; refetch listado; chip/aviso en barra |
| Tacha (✕) | Limpia texto **y** filtros de chips alineados + `q`; listado geo del radio |
| Ranking Should | Priorizar `businessName` que empieza por `q` (FE) |
| A11y | `role="listbox"` / `option`; flechas; Escape cierra; `aria-expanded` |

### DoD

- [ ] Corpus = todo el radio (servidor), no página 1 en memoria.
- [ ] Sin filas SKU.
- [ ] Chip/aviso + tacha limpia.
- [ ] Header enriquecido solo en `/explorar`.

### Referencias

`UF-GEO-01-explorar-f9.md`, Arch `API-GEO-01` + `ARCH-EXPLORE-TYPEAHEAD-01`, tokens §6h `ExploreTypeahead`.
