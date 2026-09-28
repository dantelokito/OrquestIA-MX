> **Pantalla:** FilterBar — chips vivos Mayoreo / Domicilio; sin Orgánico ni Filtros
> **Objetivo Principal:** Que todo chip visible recorte el catálogo de verdad
> **Historia:** US-EXPLORE-11

```text
+-----------------------------------------------------------------------+
| FILTER BAR (scroll-x en móvil)                                         |
|  [Verificado] [Frutas] [Verduras] [Agrícola] [Mayoreo] [A domicilio]  |
|       ↑ pressed = ring/brand + aria-pressed=true                       |
|                                                                        |
|  AUSENTES:  Orgánico   «Filtros»   (cualquier chip disabled de adorno) |
|  GPS:  [ Usar mi ubicación ]  (sigue en banner / misma barra F9)       |
+-----------------------------------------------------------------------+
```

### Query URL (shareable)

| Chip | Query | Nota |
|------|-------|------|
| Mayoreo ON | `offersWholesale=true` | AND con resto |
| A domicilio ON | `offersDelivery=true` | AND |
| OFF / ausente | param ausente | No enviar `false` (chips solo encienden) |
| Verificado / categoría | Igual F2/F7 | Conservados |

### Estados

| Estado | Spec |
|--------|------|
| Pressed | `aria-pressed=true`; borde/`--brand`; ≥44px |
| Empty AND | Empty borrega + “No hay fruterías con estos filtros” + Limpiar filtros |
| Teclado | Space/Enter toggle; orden tab lógico |

### DoD

- [ ] Orgánico y «Filtros» no se renderizan.
- [ ] Ningún chip `disabled` de adorno.
- [ ] Mayoreo / Domicilio filtran + URL.
- [ ] Empty si AND = 0.

### Referencias

`UF-GEO-01-explorar-f9.md`, Arch `API-GEO-01`, D-F9-2 / D-F9-3, tokens §6h `FilterBarF9`.
