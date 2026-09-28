# Handoff UX/UI — Fase 7

> **De:** Product Manager  
> **Para:** @UX/UI Designer  
> **Fecha:** 18/08/2026 (v0.7.0 — Explorar)

Diseñar el delta de **`/explorar`** (IDs 000–012) y estados de **login** si el fallo de sesión tiene UI (errores, retry). **No** rediseñar DASH F6 ni ContactCTA. **No** Google Maps JS.

Baseline solo lectura: F5 `UF-GEO-01` / `WF-explorar-leaflet`. Modelo de radio: **`CO-F7-001`** (pan ≠ radio). **No** implementar el ciclo F6 zoom/pan → `radiusKm`.

## Flujos a diseñar

| US | Flujo | Notas |
|----|--------|-------|
| US-GEO-09 | Layout mapa-primero | Catálogo no empuja el mapa. Móvil: mapa **arriba**. |
| US-GEO-10 | Interacción radio | Slider 1–25 + círculo siempre visible; encuadre al arrastrar. Pan libre visual. GPS + slider sin estado roto. |
| US-GEO-11 | Primera carga | SN de los Garza vs última favorita. Selector favoritas compacto (banner F5). |
| US-GEO-12 | Mapa +20% | Lista bajo el mapa, máx. 20, paginación. |
| US-GEO-13 | Copy conteo | “N fruterías a R km” con N = total API. Empty 0. |
| US-GEO-14 | Favoritas | Guardar / elegir / borrar; invitado → login. |
| US-AUTH-09 | Login móvil | Si hay pantallas de error de cookie/sesión, mensajes no técnicos. |
| US-EXPLORE-05 | Preview | Horario 3 columnas; iconos envío/tarjeta/WhatsApp; verificado MM/AAAA; 3 reseñas + ancla `#resenas`; preview catálogo; mayoreo/menudeo; abierta/cerrada. |
| US-EXPLORE-06 | Search | Placeholder actual; resultados = proveedores. |
| US-GEO-15 | Markers | Sin label permanente; tooltip hover/tap; icono negocio pequeño. |
| US-GEO-16 | Empty + loading borrega | **Reutilizar** B1→B3. Loading = tamaño base. Empty (`total=0`) = **ligeramente mayor**. Copy/CTA F5 se mantienen. Error ≠ empty. Reduced-motion = B1. |

**DoD UX F7:**

- Mapa no pierde viewport al paginar o al refetch.
- Slider y “Usar mi ubicación” ≥44px; operable teclado.
- Preview scrolleable; horario legible en móvil (3 columnas pueden apilar si no caben — documentar breakpoint).
- Markers: nombre no empalmado en reposo.
- Tokens `loader.size.loading` vs `loader.size.empty` (~+15–25%); mismos frames B1–B3.
- `prefers-reduced-motion` en encuadre del círculo y en el loop borrega (B1 estático).

**Salida esperada:** `Agente UX UI/outputs/laborregamarket/fase-7/` — delta `UF-GEO-01`, `WF-explorar`, preview, IA, `handoff-frontend-fase-7.md`.

**No diseñar:** pasarela, CFDI, PWA, clustering, bbox, reportes proveedor, analytics ADMIN.
