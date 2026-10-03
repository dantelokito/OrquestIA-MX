# READY-FOR-QA — Fase 5

> **Proyecto:** LaBorregaMarket  
> **Fase:** 5 — GEO Leaflet/OSM, catálogo endurecido, marca por proveedor (v0.5.0)  
> **Fecha:** 15/08/2026  
> **De:** Agente UX/UI Designer  
> **Para:** @QA Tester  
> **Condición:** `REVIEW-UX.md` ≥ 80% y 0 P0 **y** `REVIEW-ARCH.md` ≥ 80% y 0 P0

---

## Dictámenes previos

| Agente | Archivo | Veredicto | Puntaje |
|--------|---------|-----------|---------|
| UX/UI | [`fase-5/quality/REVIEW-UX.md`](./REVIEW-UX.md) | APROBADO CON OBSERVACIONES | 86 / 100 · 0 P0 |
| Arquitecto | `Agente Arquitecto/.../fase-5/quality/REVIEW-ARCH.md` | APROBADO CON OBSERVACIONES | 97 / 100 · 0 P0 |
| Frontend (auto) | `Agente frontend/.../fase-5/quality/QR-FE.md` | Insumo, no dictamen | 89 / 100 |

---

## Alcance de prueba

| Módulo | Rutas | User flows | Wireframes |
|--------|-------|------------|------------|
| GEO | `/explorar` | `UF-GEO-01` | `WF-explorar-leaflet` |
| CAT | `/proveedor`, `/fruteria/[id]`, `/carrito`, `/proveedor/pos` | `UF-CAT-01` | `WF-catalogo-canales` |
| BRAND | `/proveedor`, chrome sesión, `/explorar` PROVIDER | `UF-BRAND-01` | `WF-proveedor-marca` |
| Regresión F3/F4 | `/fruteria/[id]`, `/carrito` pickup, embed Google, radio Haversine | F3 UF-ORDERS-01 · F4 US-REV-03 · US-GEO-02 | Encargar + ContactCTA |

**Índice diseño:** [`fase-5/README.md`](../README.md) · **Handoff FE:** [`handoff-frontend.md`](../handoff-frontend.md)

---

## Roles y acceso

| Rol | Rutas principales | Notas |
|-----|-------------------|-------|
| **CLIENT** / invitado | `/explorar`, `/fruteria/[id]`, `/carrito` | Marca **plataforma** en Explorar. Guardar dirección: 401 → login + pin sessionStorage |
| **PROVIDER** | `/proveedor`, `/proveedor/pos`, `/explorar` logueado | Tema propio si hay par válido; toggle catálogo |
| **ADMIN** | `/explorar`, `/admin` | Marca plataforma (no colores de cada frutería) |

**Entorno:** local `npm run dev` o staging.  
**Repo código:** `C:\Users\PC GAMER\LaBorregaMarket`  
**Precondición:** migración F5 (`OBS-F5-023`): parar `next dev` y `npx prisma migrate deploy`. Confirmar `providers.primary_color` / `secondary_color`.

**No exigir** `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` para Explorar (`CO-F5-001`).

---

## Happy paths obligatorios (100%)

### HP-GEO-04 — Leaflet sin clave Google

1. Abrir `/explorar` **sin** `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`.
2. El mapa renderiza teselas OSM; attribution visible; lista usable.
3. **No** aparece “Mapa no disponible” por falta de API key (cierra OBS-F4-023).
4. Markers = mismo result set que la lista (salvo recorte viewport Should).

### HP-GEO-05 — Layout ubicación y radio

1. **Usar mi ubicación** está en el banner (FilterBar), no en el mapa; target ≥44px; móvil `w-full`.
2. Slider 1–25 km (default 10) en el **borde inferior del mapa**; lista + círculo se actualizan sin recargar.
3. Favoritas / buscar dirección viven en la barra compacta (sin slider ni CTA geo).
4. Empty radio: “No hay fruterías en este radio” + Ampliar radio.
5. Permiso denegado: lista no se vacía; hint de buscar dirección / favorita.

### HP-CAT-01 — Inhabilitar en todos los canales

1. PROVIDER apaga un producto (**Inactivo**). Hint visible: no es stock.
2. Desaparece de `/fruteria/[id]`, POS y no se puede Encargar.
3. Carrito con esa línea: se **retira** + toast `"{nombre} ya no está disponible"`.
4. `POST /api/orders` o cobro POS con id inactivo → 409; no se crea venta. POS copy: “Ese producto ya no está a la venta”.
5. Reactivar: reaparece con precio vigente.
6. Todos inactivos en POS: “No hay productos activos” + Ir a Catálogo.

### HP-BRAND-01 — Colores y contraste

1. `/proveedor`: picker primario + secundario + preview CTA texto blanco.
2. Primario `#FFFF00` (o similar ilegible): no persiste; mensaje de contraste.
3. Guardar par válido → toast “Colores de tu marca actualizados”; chrome (CTAs, focus) usa esos colores.
4. Restaurar marca de plataforma → tokens `#e23744` / `#c13515`.

### HP-BRAND-02 — Tema por sesión

1. PROVIDER con colores: panel, POS, órdenes, dashboard y `/explorar` logueado usan el par.
2. CLIENT / ADMIN / invitado en `/explorar` y `/fruteria/[id]`: marca plataforma. Cards **no** se pintan por frutería.
3. Logout restaura plataforma.
4. Badges de pedido / origen / venta rápida **no** usan el primario del proveedor.

### HP-REG-01 — Regresión pickup, radio, Google reseñas

1. Checkout pickup F3: Confirmar pedido sigue funcionando.
2. Query `lat`/`lng`/`radiusKm` filtra Haversine (no bbox).
3. Proveedor verificado: “Ver reseñas en Google” (enlace/embed) intacto. Encargar + Llamar/WhatsApp presentes.

---

## Edge cases recomendados (≥85%)

- Teselas OSM caídas (red): banner “El mapa no cargó; usa la lista”; lista usable.
- Radio 1 km vs 25 km; empty + Ampliar.
- Guest guarda favorita → login; pin preservado.
- Hex inválido en picker.
- Un solo color del par (sin el otro) → no guarda.
- POS líneas libres (venta rápida) **no** disparan 409 de catálogo.
- Session/colores sin migrar: chrome plataforma; picker puede error de API (OBS-F5-023).

---

## Observaciones conocidas (no bloquean QA)

| ID | Severidad | Descripción |
|----|-----------|-------------|
| OBS-F5-023 | P1 | Migración Prisma F5 en BD local antes de probar marca |
| OBS-UX-F5-001 | P1 | Disclaimer ETA `text-slate-400` (contraste) — arrastre F4-011 |
| OBS-UX-F5-002 | P2 | Switch Activo `green-100` vs `--brand` |
| OBS-UX-F5-003 | P2 | Ampliar radio es secondary |
| OBS-UX-F5-004 | P2 | Markers `title`; preview marca sin `aria-live` |
| OBS-UX-F5-005 | P2 | Arrastre F4: Conectar báscula primary; ops sin “En camino”; badge IN_TRANSIT |
| OBS-UX-F5-006 | P2 | Clustering Should no implementado |
| OBS-UX-F5-007 | P2 | Círculo del mapa no rehidrata tema PROVIDER |

---

## Fuera de alcance QA F5

Pasarela de pagos, CFDI, PWA, flotilla, Google Maps JS en Explorar, Places API, Distance Matrix, bounding-box API Must, stock/agotado, paleta derivada del logo, clustering de markers (Should).

---

*Habilitación QA emitida por Agente UX/UI Designer — LaBorregaMarket v0.5.0 — 15/08/2026.*
