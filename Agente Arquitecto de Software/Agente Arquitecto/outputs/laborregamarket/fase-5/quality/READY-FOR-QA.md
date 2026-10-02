# READY-FOR-QA — Fase 5

> **Proyecto:** LaBorregaMarket  
> **Fase:** 5 — GEO Leaflet/OSM, catálogo inhabilitado, marca PROVIDER (v0.5.0)  
> **Fecha:** 15/08/2026  
> **De:** Agente Arquitecto de Software  
> **Para:** @QA Tester  
> **Condición:** `REVIEW-ARCH.md` ≥ 80% y **0 P0** (cumplido: 97/100)

---

## Dictámenes previos

| Agente | Archivo | Veredicto | Puntaje |
|--------|---------|-----------|---------|
| Arquitecto (BE) | [`REVIEW-ARCH.md`](./REVIEW-ARCH.md) | APROBADO CON OBSERVACIONES | 97 / 100 · 0 P0 |
| Backend (auto) | `Agente backend/.../fase-5/quality/QR-BE.md` | Listo para QG | 96 / 100 (no es el dictamen) |
| Frontend (auto) | `Agente frontend/.../fase-5/quality/QR-FE.md` | Solicita QG UX | 89 / 100 · 0 P0 |
| UX/UI | `Agente UX UI/.../fase-5/quality/REVIEW-UX.md` | DISEÑO LISTO PARA FRONTEND | n/a — DoD de diseño, no rúbrica de implementación |

`REVIEW-UX.md` F5 cubre **diseño** (UF/WF). Esta estafeta habilita pruebas de **API + UI ya integrada**. Si UX emite después un REVIEW-UX de implementación, QA puede anexar hallazgos de copy/estados.

---

## Alcance de prueba

| Módulo | Rutas UI | Contratos API | US |
|--------|----------|---------------|-----|
| GEO motor | `/explorar` | API-GEO-01 F5 (query F4 intacta) | US-GEO-04 |
| GEO layout | `/explorar` banner + slider | — (FE) | US-GEO-05 |
| CAT inhabilitado | `/explorar`, `/fruteria/[id]`, `/carrito`, POS | API-PROVIDER-PRODUCTS-01 | US-CAT-01 |
| Brand settings | `/proveedor` config | API-PROVIDER-SETTINGS-01 | US-BRAND-01 |
| Tema sesión | panel, POS, órdenes, dashboard, `/explorar` logueado PROVIDER | API-SESSION-THEME-01 | US-BRAND-02 |

**Índice arquitectura:** [`../README.md`](../README.md)  
**Handoff BE→FE:** `Agente backend/.../fase-5/handoff-frontend.md`  
**Código:** `C:\Users\PC GAMER\LaBorregaMarket`

---

## Roles y acceso

| Rol | Rutas principales | Notas |
|-----|-------------------|-------|
| **Invitado / CLIENT** | `/explorar`, `/fruteria/[id]`, `/carrito` | Chrome de **plataforma**; detalle omite productos inhabilitados |
| **PROVIDER** | `/proveedor`, `/proveedor/pos`, `/proveedor/ordenes`, `/explorar` logueado | Tokens CSS de marca si el par es válido |
| **ADMIN** | `/admin` | Puede PATCH colores; `/explorar` = plataforma |

**Entorno:** local `npm run dev` o staging.  
**Precondición:** aplicar migración F5 (`OBS-F5-023`): `npx prisma migrate deploy` con `next dev` detenido. Si F4 no está aplicada, también OBS-F4-020.

Env: **no** exigir `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` para Explorar. Opcional `NEXT_PUBLIC_OSM_TILE_URL`. Attribution OSM visible.

---

## Happy paths obligatorios (100%)

### HP-GEO-04 — Mapa Leaflet sin clave Google

1. Entorno **sin** `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`.
2. Abrir `/explorar`: teselas OSM (o CDN) y markers = mismo result set que la lista.
3. El empty F4 "Mapa no disponible" por falta de key **no** ocurre.
4. Fallo de red de teselas: empty del mapa; **lista usable**.
5. Attribution `© OpenStreetMap contributors` visible.
6. `GET /api/providers?lat&lng&radiusKm` sigue filtrando Haversine (1–25, default 10).

### HP-GEO-05 — Ubicación en banner y radio al pie

1. CTA **Usar mi ubicación** en el banner (no dentro del mapa). Con permiso: pin + `lat`/`lng` en URL; lista y círculo usan el radio vigente.
2. Slider 1–25 km en el borde inferior del mapa; default 10; sin recargar.
3. Permiso denegado: mapa centrado como hoy (Monterrey / última posición); mensaje no bloqueante; lista no se vacía.
4. Favoritas F4 y filtros `q`/`category`/`verified` no regresionan.

### HP-CAT-01 — Inhabilitar en todos los canales

1. PROVIDER inhabilita un producto en el panel (toggle F1).
2. Desaparece de `/fruteria/[id]`, samples de explorar, carrito (línea retirada o no agregable) y catálogo POS.
3. `POST /api/orders` o POS con ese `providerProductId` → **409** `{ "error": "Producto no disponible" }`; **no** se crea la orden.
4. Reactivar: reaparece con precio vigente.
5. Línea libre POS (custom item) **no** 409 por este toggle.
6. Dashboard `topProducts`: el SKU inhabilitado no entra en el ranking vigente; KPIs de ventas históricas no bajan.

### HP-BRAND-01 — Guardar colores

1. PROVIDER elige primario/secundario hex válido (`#1B5E20` / `#0D47A1`) y guarda.
2. `PATCH /api/provider/me` → 200; GET me muestra `#` + uppercase.
3. Primario sin contraste AA vs blanco (ej. `#F9A825`) → **400**, no persiste.
4. Solo un color o par mixto null/hex → **400** "Debes indicar primario y secundario, o restablecer ambos".
5. Reset ambos `null` → tokens de plataforma.
6. PROVIDER no verificado: PATCH **solo colores** **no** 403 Google.

### HP-BRAND-02 — Tema de sesión

1. Con par válido, navegar panel, POS, órdenes, dashboard y `/explorar` **logueado PROVIDER**: CTAs/acentos usan esos colores.
2. CLIENT, ADMIN o invitado en `/explorar` / `/fruteria/[id]`: marca de **plataforma**, no la de cada frutería.
3. Sin colores o contraste inválido en lectura: plataforma, UI no rota.
4. Logout restaura plataforma. Estados de pedido siguen tokens F3 (no solo `--brand`).
5. `GET /api/auth/session` invitado → **200** (no 401) `{ authenticated: false, brand: null }`.

### HP-REG-01 — Regresión F3/F4

1. Radio Haversine, favoritas, ETA, reseñas nativas, embed Google URL/Place ID (ADR-018).
2. Encargar pickup y POS cobro F3 intactos.
3. Gate Google 403 si se tocan campos Google sin `isVerified`.

---

## Edge cases recomendados (≥85%)

| ID | Caso | Resultado esperado |
|----|------|-------------------|
| EC-F5-01 | Hex `#RGB` o sin `#` | 400 |
| EC-F5-02 | Secundario `#FFFF00` (ratio vs blanco &lt; 3) | 400 `secondaryColor` |
| EC-F5-03 | Session CLIENT autenticado | 200 `brand: null` |
| EC-F5-04 | Detalle con producto `isAvailable=false` | **Omitido** (no greyscale) |
| EC-F5-05 | `Product.isActive=false` en detalle/listado | Omitido |
| EC-F5-06 | Replay `Idempotency-Key` de orden ya creada | 200; no revalida toggle |
| EC-F5-07 | POS custom item con catálogo vacío | 200 si el resto es válido |
| EC-F5-08 | Teselas caídas | Lista usable |
| EC-F5-09 | `radiusKm=30` | 400 (F4) |
| EC-F5-10 | ADMIN PATCH colores + `isVerified=false` | Colores se conservan; Google embed off |

---

## Observaciones conocidas (no bloquean QA)

| ID | Severidad | Descripción |
|----|-----------|-------------|
| OBS-F5-023 | P1 | Aplicar migración `add_provider_brand_colors` en BD local |
| OBS-F5-024 | P2 | Tests de integración BE mockean servicios |
| OBS-F5-025 | P3 | `topProducts` no cruza `Product.isActive` |
| OBS-F4-020 | P1 | Si F4 no está migrada, aplicar también `add_reviews_addresses_notify_scale` |
| QR-FE | — | Clustering de markers (Should) no implementado |

---

## Fuera de alcance QA F5

Pasarela de pagos, CFDI, PWA, flotilla, Google Maps JS API, Places API, Distance Matrix, bbox API Must, paleta derivada del logo, stock / "agotado".

---

*Habilitación QA emitida por Agente Arquitecto de Software — LaBorregaMarket v0.5.0 — 15/08/2026.*
