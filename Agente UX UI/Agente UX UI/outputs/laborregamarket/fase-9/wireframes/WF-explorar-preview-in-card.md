> **Pantalla:** Preview in-card en `/explorar`
> **Objetivo Principal:** Previsualizar la vitrina expandiendo el card; entrar al detalle con tap/clic corto
> **Historia:** US-EXPLORE-08 (contenido = US-EXPLORE-05; triggers = US-EXPLORE-07 / F8)

```text
+-----------------------------------------------------------------------+
| LISTA  grid 1 / 2 / 3 cols                                             |
|  ┌──────────────┐ ┌────────────────────────────┐ ┌──────────────┐     |
|  │ Cover        │ │ Cover                      │ │ Cover        │     |
|  │ Nombre       │ │ Nombre                     │ │              │     |
|  │ Dist · ETA   │ │ Dist · ETA                 │ │              │     |
|  │ ♥  Contact   │ │ ♥  Contact                 │ │              │     |
|  └──────────────┘ │ ─────────────────────────  │ └──────────────┘     |
|                   │ [ × ]  Frutas El Paraíso   │  ← EXPANDIDO IN-CARD |
|                   │ [Abierta]  verificado      │                      |
|                   │ 🚚 Envío  💳  WA  Mayoreo  │  flags iff true      |
|                   │ Horario  3 cols / stack    │                      |
|                   │ Catálogo activo (minis)    │                      |
|                   │ 3× ReviewCard              │                      |
|                   │ [ Ver todas las reseñas ]  │                      |
|                   │ [     Ver frutería     ]   │  primary             |
|                   └────────────────────────────┘                      |
|  PROHIBIDO: popover/submódulo desplazado respecto al card             |
|  PROHIBIDO: botón texto «Vista rápida»                                |
+-----------------------------------------------------------------------+
```

### Disparadores

| Input | Abre preview in-card | Navega a detalle |
|-------|----------------------|------------------|
| Hover puntero **300 ms** | Sí | No |
| Leave card (close **150 ms**) | Cierra | No |
| Long-press touch **500 ms** | Sí | Click sintético **no** navega |
| Scroll touch | Cancela; **no** abre | — |
| Tap / clic **corto** | No | Sí → `/fruteria/[id]` |
| Enter (foco en card) | No | Sí |
| **Alt+Enter** o icono `Eye` `:focus-visible` | Sí | No |
| Escape | Cierra | No |
| Tap **marker** | Sí (misma card; scroll-into-view) | No (CTA Ver frutería = detalle) |

Control teclado: icono **solo** visible en `:focus-visible`. `aria-label="Vista previa"`. ≥44px.

### Animación

| Estado | Spec |
|--------|------|
| Expand | Altura del card crece; contenido preview fade/slide **dentro** del borde del card |
| Collapse | Reverse; reduced-motion: instant |
| Unicidad | Un solo expandido; abrir otro colapsa el anterior |
| Scroll | Área expandida `max-h-[min(70vh,32rem)] overflow-y-auto` |

### DoD

- [ ] No hay popover desanclado.
- [ ] Campos `US-EXPLORE-05` intactos.
- [ ] Heart / ContactCTA se quedan.
- [ ] Delays F8; reduced-motion 0.
- [ ] Marker → misma experiencia in-card.

### Referencias

`UF-EXPLORE-08-preview-in-card.md`, tokens §6h `ProviderPreviewInCard`, Arch `API-PROVIDER-PREVIEW-01`.
