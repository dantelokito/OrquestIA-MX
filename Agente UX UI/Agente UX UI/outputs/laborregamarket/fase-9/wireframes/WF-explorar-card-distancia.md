> **Pantalla:** ProviderCard — distancia + ETA (sin minPrice visual)
> **Objetivo Principal:** Comparar cercanía pin→sucursal sin precio mínimo genérico
> **Historia:** US-EXPLORE-10

```text
+---------------------------+
| [======== Cover ========] |
| Frutas El Paraíso         |
| ⭐ 4.6 · verificado       |
| A 1.2 km de tu búsqueda   |  ← font-semibold slate-900
| ~8 min en auto            |  ← text-sm slate-600 (misma unidad visual)
| [████░░░░]  (Should)      |  ← distanceKm / radiusKm
| ♥              ContactCTA |
+---------------------------+

PROHIBIDO en slot:
  "$45 MXN desde" / "Consultar precios" / minPrice visual
  segundo "1.2 km" gris aparte
  sampleProducts / chips de frutas
```

### Copy

| Condición | Copy |
|-----------|------|
| `distanceKm` ≥ 1 | «A {n} km de tu búsqueda» (≤1 decimal) |
| `distanceKm` &lt; 1 | «A {m} m de tu búsqueda» (enteros, p. ej. 500 m) |
| ETA auto | «~{min} min en auto» (`computeEtaMinutes` ADR-017) |
| ETA pie | Si caminata 5 km/h &lt; 15 min → «~{min} min a pie» (preferir) |
| Sin pin / sin dato | Ocultar fila **o** «Elige una ubicación para ver la distancia.» |

### DoD

- [ ] Sin `minPrice` visual.
- [ ] Una fila de distancia (+ ETA); no km duplicado.
- [ ] Sin pin no inventa.
- [ ] Should: barra proporcional documentada.

### Referencias

`UF-EXPLORE-10-card-distancia.md`, Arch `API-EXPLORE-NOTES-01`, ADR-017, tokens §6h `ProviderCardDistance`.
