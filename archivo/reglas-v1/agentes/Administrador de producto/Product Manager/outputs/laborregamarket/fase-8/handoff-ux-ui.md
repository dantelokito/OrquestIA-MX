# Handoff UX/UI — Fase 8

> **De:** Product Manager  
> **Para:** @UX/UI Designer  
> **Fecha:** 24/08/2026 (v0.8.3 — P1–P4)

Diseñar **cuatro** deltas de `/explorar`. Baseline F7: `UF-GEO-01`, `WF-explorar-mapa-primero`, `WF-explorar-preview`. Modelo pan ≠ radio **no se toca** (`CO-F7-001`); pan **dentro de México** (`CO-F8-002`). Contenido preview = `US-EXPLORE-05` (no recortar). **No** rediseñar FilterBar.

---

## Parte 1 — Chrome de ubicación

Tres controles en fila + dos líneas de status: input “Buscar dirección”, `<select>` solo `label` (varias “Casa QA F4”), “+ Guardar”, `Centro: Casa Del` redundante, `N fruterías a R km` (Must conservar). Guardar = `window.prompt`. Borrar existe en API, no en UI.

| US | Flujo | Notas |
|----|--------|-------|
| US-GEO-17 | Chip → panel | Reposo = un chip. Abierto = sheet &lt;md / popover ≥md. Buscar, lista, guardar. GPS en FilterBar. |
| US-GEO-18 | Lista favoritas | `label` + `formattedAddress`. Sin `<select>`. Empty. Borrar con confirmación. Pin se queda si se borra la activa. |
| US-GEO-19 | Guardar | Diálogo in-app. Invitado → login. Tope 20. Sin `window.prompt`. |
| US-GEO-20 | Copy | Chip absorbe “Centro: X”. Conteo permanece (unidades: ver Parte 2 si R &lt; 1 km). |

**DoD Parte 1:** reposo sin fila input+select+guardar; ≥44px en chip/filas/diálogo; Escape; mapa no se empuja; tokens `--brand`.

---

## Parte 2 — Overlay de radio (HTML actual)

```
div.absolute.inset-x-0.bottom-0.z-[400]
  label “Radio: 22 km”
  input[type=range] min=1 max=25 step=1.h-11
  span “1 km” … “25 km”
```

Más `RadiusClampHint` “Máximo 25 km” encima. Eso come mapa.

| US | Flujo | Notas |
|----|--------|-------|
| US-GEO-21 | Overlay bajo | Menos alto vertical (fusionar label/extremos; menos padding). **Sigue siendo range**, no presets. Hint de máximo **no** suma una fila extra. |
| US-GEO-22 | 500 m–10 km | Extremos “500 m” y “10 km”. Paso 0.5 km. Valor &lt; 1 km en metros. Conteo “N fruterías a 500 m” / “a 10 km”. CTA Ampliar radio ≤ 10; oculto en el máximo. |

**DoD Parte 2:**

- Overlay visiblemente más bajo que F7; el mapa gana viewport.
- El usuario **ve el valor actual** sin abrir nada.
- Arrastrar el slider sigue encuadrando el círculo y refetch (no cambiar el modelo).
- Copy de tope = 10 km, nunca 25 km.
- Teclado en el range; `prefers-reduced-motion` en encuadre del círculo (paridad F7).

---

## Parte 3 — Mapa México + encuadre

Hoy `ExploreMap` no tiene `maxBounds`: se puede panear a EUA. `FitCircle` ya encuadra al cambiar pin/radio.

| US | Flujo | Notas |
|----|--------|-------|
| US-GEO-23 | Límite MX | Rebote/viscosidad en el borde. No se ve Texas/Guatemala como destino. `minZoom` para no ver el continente. |
| US-GEO-23 | Encuadre | Al cambiar slider/GPS/dirección/favorita el círculo llena la vista (paridad `FitCircle`). Pan **dentro de MX** no mueve lista ni radio. |
| US-GEO-23 | Fuera | GPS, geocode, arrastre del pin o URL fuera de MX: copy no técnico; se conserva SN o último pin. No adoptar Laredo TX. |

**DoD Parte 3:**

- El usuario entiende que no puede salir de México (feedback de borde, no error técnico).
- GPS denegado (F5/F7) ≠ GPS fuera de México (mensaje distinto).
- Encuadre del círculo respeta `prefers-reduced-motion`.
- No diseñar polígono fronterizo fino ni “no ir de MTY a CDMX”.

---

## Parte 4 — Preview hover / long-press

Hoy: botón «Vista rápida» bajo la card abre `ProviderPreviewSheet` (modal). Toda la card es `<Link>` a `/fruteria/[id]`.

| US | Flujo | Notas |
|----|--------|-------|
| US-EXPLORE-07 | Hover | Delay; preview **anclado** a la card (popover scrolleable). Mismo contenido `US-EXPLORE-05`. No instantáneo. Puente mouse card→preview sin cerrar. |
| US-EXPLORE-07 | Long-press | Móvil/tablet. Scroll **no** abre. Tras long-press, el tap sintético **no** navega. |
| US-EXPLORE-07 | Tap corto | Sigue a `/fruteria/[id]`. Botón «Vista rápida» **ausente**. |
| US-EXPLORE-07 | Teclado / mapa | Abrir preview sin el botón (foco + atajo o control revelado). Marker abre el **mismo** preview. Heart y ContactCTA se quedan. |

**DoD Parte 4:**

- Se ve como **opción de previsualizado**, no como ficha completa ni como CTA de texto.
- Un solo preview a la vez. Escape cierra. z-index vs mapa y última fila del grid.
- `prefers-reduced-motion` (delay/animación).
- No recortar horario, catálogo, 3 reseñas, flags, mayoreo/menudeo.

**Salida esperada:** `Agente UX UI/outputs/laborregamarket/fase-8/` — delta `UF-GEO-01` + `WF-explorar-preview-card`, delays, `handoff-frontend-fase-8.md` (**cuatro** partes).

**No diseñar:** FilterBar, recorte de `US-EXPLORE-05`, login (salvo puente invitado→guardar), DASH, clustering, Maps JS, Places, bbox de API, polígono INEGI.
