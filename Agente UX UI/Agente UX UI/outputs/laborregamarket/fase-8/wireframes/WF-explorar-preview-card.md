> **Pantalla:** Preview anclado a la card en `/explorar`
> **Objetivo Principal:** Previsualizar la vitrina al hover o long-press y entrar al detalle con tap/clic corto
> **Historia:** US-EXPLORE-07 (contenido = US-EXPLORE-05)

```text
+-----------------------------------------------------------------------+
| LISTA  grid 1 / 2 / 3 cols                                             |
|  ┌──────────┐ ┌──────────┐ ┌──────────┐                               |
|  │ Cover    │ │ Cover    │ │ Cover    │  ← card = Link /fruteria/id   |
|  │ Nombre   │ │ Nombre   │ │          │                               |
|  │ ⭐ · km  │ │ ♥  Contact│ │          │  Heart y ContactCTA se quedan |
|  └──────────┘ └────┬─────┘ └──────────┘                               |
|                    │ ancla                                             |
|                    v                                                   |
|         +--------------------------------------+                       |
|         | [ × ]  Frutas El Paraíso             |  popover scrolleable  |
|         | [Abierta]  verificado a la borrega   |                       |
|         | 🚚 Envío  💳 Tarjeta  WA  Mayoreo    |  flags iff true       |
|         | Horario  3 cols / apilado <640px     |                       |
|         | Catálogo activo (minis)              |                       |
|         | 3× ReviewCard  o “Sin reseñas…”      |                       |
|         | [ Ver todas las reseñas ]  secondary |  → #resenas           |
|         | [     Ver frutería     ]  primary    |                       |
|         +--------------------------------------+                       |
|  PROHIBIDO: botón «Vista rápida» bajo la card                          |
+-----------------------------------------------------------------------+
```

### Disparadores

| Input | Abre preview | Navega a detalle |
|-------|----------------|------------------|
| Hover puntero **300 ms** | Sí (no instantáneo) | No |
| Puente mouse card→preview | Mantiene abierto (**150 ms** close delay) | No |
| Long-press touch **500 ms** | Sí | Click sintético **no** navega |
| Scroll touch | Cancela; **no** abre | — |
| Tap / clic **corto** | No | Sí → `/fruteria/[id]` |
| Enter (foco en card) | No | Sí |
| **Alt+Enter** o icono `Eye` `:focus-visible` | Sí | No |
| Escape / leave conjunto | Cierra | No |
| Tap **marker** | Sí (mismo popover) | No (CTA Ver frutería = detalle) |

Control teclado: icono **solo** visible en `:focus-visible` (o hover del icono). `aria-label="Vista previa"`. ≥44px. **No** texto «Vista rápida».

### Última fila del grid / z-index

```text
Fila superior:     popover abre ABAJO-derecha de la card (default)
Fila inferior:     popover FLIP hacia ARRIBA — no recorta contra footer
                   ni contra RadiusOverlayF8

z-index (alto → bajo):
  LocationPanel / SaveAddressDialog / DeleteAddressDialog
  ProviderPreviewPopover          ← por encima del mapa y del overlay radio
  RadiusOverlayF8  (z-[400])
  markers / tooltips Leaflet
  mapa
```

Un solo preview a la vez. Al abrir otro se cierra el anterior.

### Mobile (`<= 640px`) — long-press

```text
+-----------------------------------------------------------------------+
| Card full-width                                                        |
| long-press 500 ms → popover / sheet compacto anclado (no 90vh F7)      |
|   contenido US-EXPLORE-05 scrolleable                                  |
|   horario apilado                                                      |
|   CTA Ver frutería sticky pie del popover  w-full                      |
| tap corto → /fruteria/[id]                                             |
+-----------------------------------------------------------------------+
```

El preview **no** es el bottom sheet 90vh de F7 como disparador. Puede usar altura `max-h-[min(70vh,32rem)]` para verse como peek, no como ficha completa. Contenido **no se recorta**: el usuario scrollea dentro.

#### Estados de la pantalla

| Estado | Comportamiento UI |
|--------|-------------------|
| **Loading** | Popover abierto; BrandLoader 64px; sr-only “Cargando frutería”. Cache hit = sin spinner. |
| **Success** | Datos API; flags omitidos si false/null. |
| **Horario vacío** | “Horario no publicado”; sin chip Abierta/Cerrada. |
| **Sin reseñas** | “Sin reseñas todavía”; CTA Ver todas sigue (ancla). |
| **Catálogo vacío** | “No hay productos activos en vitrina” — no mock. |
| **Error** | Inline + Reintentar; no cerrar Explorar. |
| **404** | Cerrar popover; toast; lista refetch. |
| **Reduced-motion** | Delays 0; apertura instantánea. |

#### Componentes Requeridos para Frontend:
* **ProviderPreviewPopover:** anclado a la card; `role="dialog"`; Escape; focus trap si se abrió por teclado/long-press (hover puede ser `role="tooltip"` **solo si** el contenido se recortara — **no**: el contenido es el de F7, usar `dialog`). Scrolleable.
* **ProviderCardF8:** `Link` al detalle; **sin** botón «Vista rápida»; Heart + ContactCTA intactos; control `Eye` revelado al foco.
* **OpenNowChip / HoursTable / CapabilityIcons / WholesaleRetailChips / ReviewsPreview:** paridad F7 (`WF-explorar-preview.md`, solo lectura).
* **CTA Ver frutería:** Button Primary. Un CTA dominante.

Reusar el cuerpo de `ProviderPreviewSheet`; cambiar **chrome y disparador**, no el contenido.

#### Responsividad:
* **Mobile:** peek anclado / sheet corto scrolleable; CTA `w-full`. Horario apilado.
* **Desktop:** popover `width: min(24rem, 90vw)` al lado o bajo la card; horario 3 cols `>=640px`.

#### Accesibilidad:
* Título `h2` = `businessName`. Focus inicial en Cerrar o título si apertura no-hover.
* Iconos con `aria-label` F7.
* Hover: no atrapar foco. Teclado/long-press: sí dialog.
* Ancla `#resenas` en detalle.

#### API esperada:
* `GET /api/providers/[id]` (API-PROVIDER-PREVIEW-01 F8 — mismo shape F7). Un GET en vuelo; cache por `id`.

#### Referencias:
* Flujo: `../user-flows/UF-EXPLORE-07-preview-hover.md`
* Contenido F7: `../../fase-7/wireframes/WF-explorar-preview.md` (solo lectura)
* Tokens: `../../comun/design-tokens.md` §6g
* `CO-F8-003`
