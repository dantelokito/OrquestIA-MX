> **Pantalla:** Chrome de ubicación en `/explorar` — chip + panel
> **Objetivo Principal:** Ver y cambiar el centro de búsqueda sin una fila de input + select + guardar
> **Historia:** US-GEO-17, US-GEO-18, US-GEO-19, US-GEO-20

```text
+-----------------------------------------------------------------------+
| [Header] Logo | Pill "Buscar fruterías, frutas, verduras" | Usuario    |
+-----------------------------------------------------------------------+
| FilterBar (F2, NO rediseñar): chips  [📍 Usar mi ubicación]  ≥44px     |
+-----------------------------------------------------------------------+
| [📍 Casa Del ▾]   ← LocationChip único ≥44px  (absorbe "Centro: X")    |
|  12 fruterías a 10 km     ← ExploreCount (N = meta.total) permanece    |
+-----------------------------------------------------------------------+
| MAPA Leaflet + OSM  (F7 mapa-primero; overlay radio F8 más abajo)      |
+-----------------------------------------------------------------------+
| LISTA ≤20                                                              |
+-----------------------------------------------------------------------+
```

### Reposo (desktop `>= md`)

```text
+-----------------------------------------------------------------------+
| FilterBar … [ Usar mi ubicación ]                                      |
|                                                                        |
|  [ 📍  Casa Del                              ▾ ]   min-h-11  pill      |
|  12 fruterías a 10 km                                                  |
+-----------------------------------------------------------------------+
```

Prohibido en reposo: input “Buscar dirección”, `<select>` nativo, botón “+ Guardar dirección”, `<p>` “Centro: Casa Del”.

### Panel abierto — popover `>= md`

```text
+-----------------------------------------------------------------------+
|  [ 📍  Casa Del                              ▾ ]  (chip pressed)       |
|  +---------------------------------------------------------------+    |
|  | [ × Cerrar ]  Dónde buscas                                    |    |
|  | [🔍 Buscar dirección                    ]  min-h-11           |    |
|  |  hint / error inline (aria-live)                              |    |
|  |---------------------------------------------------------------|    |
|  | Guardadas                                                     |    |
|  | [ Casa QA F4                         🗑 ]  ≥44px              |    |
|  |   Av. Universidad 204, San Nicolás                            |    |
|  | [ Casa QA F4                         🗑 ]                     |    |
|  |   Calle Roble 12, Apodaca                                     |    |
|  |---------------------------------------------------------------|    |
|  | [ + Guardar esta ubicación ]  min-h-11  (si hay pin)          |    |
|  +---------------------------------------------------------------+    |
|  12 fruterías a 10 km                                                  |
+-----------------------------------------------------------------------+
```

Cada fila: **`label`** (`text-slate-900 font-medium`) + **`formattedAddress`** (`text-sm text-slate-500`). Duplicados de label se distinguen por la calle. **No** `<select>`.

### Panel abierto — sheet `< md`

```text
+-----------------------------------------------------------------------+
| FilterBar + LocationChip (pressed) + conteo                            |
| MAPA (viewport NO se empuja; sheet overlay)                            |
| +-------------------------------------------------------------------+ |
| | handle                                                            | |
| | Dónde buscas                                          [ Cerrar ]  | |
| | [🔍 Buscar dirección]                                             | |
| | lista favoritas scrolleable  (label + calle)                      | |
| | [ + Guardar esta ubicación ]  w-full min-h-11                     | |
| +-------------------------------------------------------------------+ |
+-----------------------------------------------------------------------+
```

### Diálogo guardar (in-app, no `window.prompt`)

```text
+-----------------------------------------------------------------------+
| Overlay dimmed                                                         |
|   +-----------------------------------------------------------+       |
|   | Guardar ubicación                                  [ × ]  |       |
|   | Nombre  [ Casa, Trabajo                    ]  máx. 40     |       |
|   | Av. Universidad 204, San Nicolás de los Garza             |       |
|   | [ Cancelar ]              [ Guardar ]  ← CTA dominante    |       |
|   +-----------------------------------------------------------+       |
+-----------------------------------------------------------------------+
```

### Confirmación borrar

```text
+-----------------------------------------------------------------------+
| ¿Quitar “Casa QA F4”?                                                  |
| Av. Universidad 204, San Nicolás                                       |
| El mapa se queda en este punto.                                        |
| [ Cancelar ]                          [ Quitar ]  (destructive)        |
+-----------------------------------------------------------------------+
```

#### Estados de la pantalla

| Estado | Comportamiento UI |
|--------|-------------------|
| **Reposo** | Un chip; etiqueta o dirección corta; conteo visible. |
| **Abierto** | Sheet `<md` / popover `≥md`. Mapa no pierde viewport. Escape cierra. |
| **Empty favoritas / invitado** | “Aún no tienes direcciones guardadas”. Invitado: CTA **Iniciar sesión para guardar**. CLIENT sin filas: CTA guardar si hay pin. Chip sigue mostrando SN o pin. |
| **Geocode corto** | “Escribe al menos 3 caracteres” inline en el panel. No GET. No `alert()`. |
| **Geocode vacío** | “No encontramos esa dirección” inline. |
| **Geocode fuera de MX** | “Esa ubicación está fuera de México. Seguimos donde estabas.” Pin intacto. |
| **Guardar invitado** | `/login?redirect=/explorar`; pin en sessionStorage (cola, no origen). |
| **Sin pin** | Guardar `disabled` + “Elige un punto en el mapa primero”. |
| **Tope 20** | “Llegaste al límite de 20 direcciones. Quita una para guardar otra.” No estado a medias. |
| **Etiqueta vacía** | Error en diálogo; no POST. |
| **Borrar activa** | Pin permanece; chip = `formattedAddress`. |
| **GPS denegado** | Aviso F5/F7 en FilterBar; **no** sustituye el chip por coords crudas. |

#### Componentes Requeridos para Frontend:
* **LocationChip:** pill `min-h-11`; icono `MapPin`; chevron; `aria-expanded`; `aria-haspopup="dialog"`. Tokens `--brand` en pressed/focus.
* **LocationPanel:** sheet (`< md`) o popover anclado (`≥ md`); `role="dialog"`; focus trap; Escape.
* **FavoriteAddressRow:** `label` + `formattedAddress`; hit ≥44px; botón borrar ≥44px `aria-label="Quitar {label}"`.
* **SaveAddressDialog:** `ConfirmDialog` F3 reusado; input máx. 40; preview dirección; CTA **Guardar**.
* **DeleteAddressDialog:** copy “El mapa se queda en este punto.”
* **ExploreCount:** permanece; ver `WF-explorar-radio.md` para metros.
* **ExploreLocationCta:** GPS sigue en FilterBar (F5). **No** duplicar en el panel (Could: GPS en panel = Won't F8).

#### Responsividad:
* **Mobile (`<= 768px` / `< md`):** bottom sheet; CTA guardar `w-full`; filas full-width.
* **Desktop (`>= md`):** popover `min-w-80 max-w-md` bajo el chip; no tapa el mapa entero.

#### Accesibilidad:
* Chip y filas ≥44px; Tab: FilterBar → GPS → chip → (panel) buscar → filas → guardar.
* Focus inicial al abrir: campo buscar o título “Dónde buscas”.
* Errores `aria-live="polite"` **dentro del panel**.
* Reduced-motion: sheet/popover instantáneos.

#### API esperada:
* `GET/POST/PATCH/DELETE /api/users/me/addresses` — inventario F8, **sin ruta nueva**.
* `POST /api/users/me/addresses/[id]/use`
* Nominatim cliente + `MEXICO_VIEWBOX` (ADR-028). No Places.

#### Referencias:
* Flujo: `../user-flows/UF-GEO-01-explorar-f8.md`
* Tokens: `../../comun/design-tokens.md` §6g
* Baseline F7 (solo lectura): `../../fase-7/wireframes/WF-explorar-mapa-primero.md`
