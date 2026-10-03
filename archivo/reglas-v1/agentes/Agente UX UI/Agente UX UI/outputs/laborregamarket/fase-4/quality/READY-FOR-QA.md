# READY-FOR-QA — Fase 4

> **Proyecto:** LaBorregaMarket  
> **Fase:** 4 — Reseñas, Geo, ETA, Admin analytics, POS báscula (v0.4.0)  
> **Fecha:** 14/08/2026  
> **De:** Agente UX/UI Designer  
> **Para:** @QA Tester  
> **Condición:** `REVIEW-UX.md` ≥ 80% y 0 P0 **y** `REVIEW-ARCH.md` ≥ 80% y 0 P0

---

## Dictámenes previos

| Agente | Archivo | Veredicto | Puntaje |
|--------|---------|-----------|---------|
| UX/UI | [`fase-4/quality/REVIEW-UX.md`](./REVIEW-UX.md) | APROBADO CON OBSERVACIONES | 82 / 100 · 0 P0 |
| Arquitecto | `Agente Arquitecto/.../fase-4/quality/REVIEW-ARCH.md` | APROBADO CON OBSERVACIONES | 97 / 100 · 0 P0 |
| Frontend (auto) | `Agente frontend/.../fase-4/quality/QR-FE.md` | Insumo, no dictamen | 86 / 100 |

---

## Alcance de prueba

| Módulo | Rutas | User flows | Wireframes |
|--------|-------|------------|------------|
| GEO | `/explorar` | `UF-GEO-01` | `WF-explorar-geo` |
| REVIEWS | `/cuenta`, `/fruteria/[id]`, `/proveedor` | `UF-REV-01`, `UF-REV-02` | `WF-resena-pedido`, `WF-fruteria-reviews`, `WF-proveedor-google` |
| ETA | `/carrito`, `/cuenta` | `UF-NOTIFY-01` | `WF-carrito-eta` |
| ADMIN | `/admin/analytics` | `UF-ADMIN-01` | `WF-admin-analytics` |
| POS báscula | `/proveedor/pos` | `UF-POS-02` | `WF-pos-bascula` |
| Delivery (Should) | `/carrito`, `/proveedor/ordenes` | `UF-ORDERS-02` | `WF-carrito-eta`, `WF-cuenta-pedidos-f4` |
| Regresión F2/F3 | `/fruteria/[id]`, `/carrito` pickup, POS cobro | F3 UF-ORDERS-01 / UF-POS-01 | Encargar + ContactCTA |

**Índice diseño:** [`fase-4/README.md`](../README.md) · **Handoff FE:** [`handoff-frontend.md`](../handoff-frontend.md)

---

## Roles y acceso

| Rol | Rutas principales | Notas |
|-----|-------------------|-------|
| **CLIENT** | `/explorar`, `/fruteria/[id]`, `/carrito`, `/cuenta` | Guardar dirección: 401 → `/login?redirect=/explorar` (pin en sessionStorage) |
| **PROVIDER** | `/proveedor`, `/proveedor/pos`, `/proveedor/ordenes` | Google bloqueado si `isVerified=false` |
| **ADMIN** | `/admin`, `/admin/analytics` | Tab Analítica enlaza a `/admin/analytics` |

**Entorno:** local `npm run dev` o staging.  
**Repo código:** `C:\Users\PC GAMER\LaBorregaMarket`  
**Precondición:** aplicar migración F4 (`OBS-F4-020`): parar `next dev` y `npx prisma migrate deploy`. Confirmar tablas `reviews`, `user_addresses`.

Env: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (sin key: lista usable + “Mapa no disponible”). Local sin Redis: rate limit in-memory.

---

## Happy paths obligatorios (100%)

### HP-GEO-01 — Radio y lista

1. En `/explorar`, lista **arriba** (móvil) / 55% (desktop); mapa visible ~300px o sticky.
2. **Usar mi ubicación** o pin arrastrable + slider 1–25 km (default 10).
3. Lista y markers se filtran sin recargar; empty radio: “No hay fruterías en este radio” + **Ampliar radio**.
4. Sin geolocalización: explorar por chips F2; CTA buscar dirección.
5. Sin API key Maps: listado usable + “Mapa no disponible”.

### HP-GEO-03 — Favorita

1. CLIENT autenticado: **Guardar dirección** con etiqueta.
2. Selector de favoritas reutiliza el pin.
3. Invitado: login; tras volver, el pin se preserva (`lbm.explore.pin`).

### HP-REV-01 — Reseña post-entrega

1. Pedido marketplace propio **Entregado** sin reseña → formulario 1–5 + comentario.
2. Publicar → aparece en `/fruteria/[id]`; hero/cards muestran promedio real (no seed).
3. Proveedor sin reseñas: **“Sin reseñas todavía”** (no ☆☆☆☆☆ con 0.0).
4. Segundo intento → 409 / reseña existente solo lectura.
5. PENDING / POS walk-in: sin CTA Calificar.

### HP-REV-04 — Google verificado / bloqueado

1. PROVIDER `isVerified=false`: banner azul **“Requiere verificación de tu negocio”**; inputs disabled (no rojo punitivo).
2. Verificado: guarda Place ID/URL + toggle → detalle muestra “Ver reseñas en Google”.
3. Encargar y Llamar/WhatsApp siguen presentes (D-F3-7).

### HP-ETA-01 — Checkout

1. Pickup sin pin: “Tiempo de preparación: ~Y min”.
2. Con pin o delivery: “Listo aprox. en ~X min” + disclaimer.
3. Confirmar **no** se bloquea si falla el ETA.
4. CTA dominante: **Confirmar pedido**.

### HP-ADMIN-01 — Analítica plataforma

1. ADMIN `/admin/analytics` (o tab Analítica).
2. Hoy / 7d / 30d: GMV (sin canceladas), órdenes, proveedores activos, cancelación, split Marketplace vs POS.
3. Periodo vacío: “No hay actividad en este periodo” (no KPIs $0 fingidos).
4. Distinto de `/proveedor/dashboard`.

### HP-POS-01 — Báscula no rompe F3

1. Cobrar igual que F3; body de venta **sin** VID/PID.
2. Badge conectada/desconectada/unsupported; keypad manual sigue disponible.
3. Peso KG/GR autollenado y **editable**.

### HP-ORD-05 — Delivery Should

1. Proveedor `offersDelivery`: toggle Recoger / A domicilio + dirección.
2. Sin delivery: solo pickup (F3).
3. CLIENT: badge IN_TRANSIT + DELIVERY = **“En camino”**; pickup = **“Listo para recoger”**.
4. Documentar OBS-UX-F4-012: ops proveedor puede seguir diciendo “Listo para recoger” en el CTA.

### HP-REG-01 — Contacto y Encargar

1. `/fruteria/[id]`: Encargar dominante con ítems; Llamar/WhatsApp visibles.

---

## Edge cases recomendados (≥85%)

- Radio fuera de 1–25 o coords fuera de NL → 400 API; UI no debe romper la lista.
- Reseña rating 0: inline “Elige una calificación”.
- Delivery sin dirección: Confirmar disabled + mensaje.
- `offersDelivery=false` + intentar DELIVERY → 400.
- Maps / WebSerial ausentes: fallback lista / keypad.
- Doble publicar reseña → 409.
- Contacto >5/10 min → 429.

---

## Observaciones conocidas (no bloquean QA)

| ID | Severidad | Descripción |
|----|-----------|-------------|
| OBS-F4-020 | P1 | Migración F4 en BD local antes de probar |
| OBS-UX-F4-010 | P1 | Conectar báscula es primary (compite con Cobrar) |
| OBS-UX-F4-011 | P1 | Disclaimer ETA `text-slate-400` (contraste) |
| OBS-UX-F4-012 | P1 | Ops proveedor no usa copy “En camino” |
| OBS-UX-F4-013 | P2 | Colores/icono badge vs tokens |
| OBS-UX-F4-014 | P2 | Banner Google sin “cómo solicitar” |
| OBS-UX-F4-015 | P2 | Analytics sin top 5; extra borrar reseña por ID |
| OBS-UX-F4-016 | P2 | Toast reseña / CTA dirección |
| OBS-UX-F4-017 | P2 | ETA no visible en sticky móvil del carrito |

---

## Fuera de alcance QA F4

Pasarela de pagos, CFDI, PWA, importación Places API, Distance Matrix, rutas/flotilla, impresora térmica, lector de barras, fotos en reseña, edición de reseña (Should).

WhatsApp Business (US-NOTIFY-08): no-op sin keys; no bloquear el pedido.

---

*Habilitación QA emitida por Agente UX/UI Designer — LaBorregaMarket v0.4.0 — 14/08/2026.*
