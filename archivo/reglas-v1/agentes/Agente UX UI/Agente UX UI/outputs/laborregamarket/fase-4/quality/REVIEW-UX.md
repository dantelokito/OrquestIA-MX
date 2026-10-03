# REVIEW-UX — Quality Gate Frontend Fase 4

> **Proyecto:** LaBorregaMarket  
> **Fase:** 4 — Reseñas, Geo, ETA, Admin analytics, POS báscula (v0.4.0)  
> **Fecha:** 14/08/2026  
> **Agente:** UX/UI Designer  
> **Solicitud auditada:** `Agente frontend/.../fase-4/quality/QR-FE.md` (Frontend, 86/100)  
> **Código:** `C:\Users\PC GAMER\LaBorregaMarket\src`  
> **Veredicto:** **APROBADO CON OBSERVACIONES**  
> **Puntaje:** 82 / 100 · **0 P0** · 3 P1 · 6 P2

No se copia el auto-score de QR-FE (86/100). Esta auditoría es independiente contra UF/WF de `fase-4/` + `comun/` v0.4.0.

El dictamen previo de este archivo era **DoD de diseño** (sin código). Queda sustituido por esta rúbrica de implementación.

---

## Alcance auditado

| Ruta | Archivo principal | Wireframe |
|------|-------------------|-----------|
| `/explorar` | `ExplorePageClient.tsx`, `LocationBar`, `ExploreMap`, `RadiusSlider` | `WF-explorar-geo.md` |
| `/fruteria/[id]` | `FruteriaDetailClient.tsx`, `ProviderHero`, `ReviewList` | `WF-fruteria-reviews.md` |
| `/carrito` | `CartPageClient.tsx`, `EtaChip`, `FulfillmentToggle` | `WF-carrito-eta.md` |
| `/cuenta` | `OrdersHistory.tsx`, `ReviewForm` | `WF-cuenta-pedidos-f4.md`, `WF-resena-pedido.md` |
| `/proveedor` | `ProviderSettingsForm.tsx` | `WF-proveedor-google.md` |
| `/proveedor/pos` | `PosPageClient.tsx`, `ScaleStatusBadge`, `usePosScale` | `WF-pos-bascula.md` |
| `/proveedor/ordenes` | `OrdenesPageClient.tsx` | `WF-cuenta-pedidos-f4` copy IN_TRANSIT |
| `/admin`, `/admin/analytics` | `AdminPageClient.tsx`, `AnalyticsPageClient.tsx` | `WF-admin-analytics.md` |

**Referencias de diseño:** [`handoff-frontend.md`](../handoff-frontend.md), [`user-flows/`](../user-flows/), [`wireframes/`](../wireframes/), [`comun/design-tokens.md`](../../comun/design-tokens.md).

QR-FE: `Agente frontend/.../fase-4/quality/QR-FE.md`. Contratos: Arquitecto `API-GEO-01`, `API-ADDRESSES-01`, `API-REVIEWS-01`, `API-PROVIDER-SETTINGS-01`, `API-ADMIN-ANALYTICS-01`.

---

## Rúbrica (10 × 10)

| # | Criterio | Pts | Nota |
|---|----------|-----|------|
| 1 | Fidelidad a wireframes F4 | 8 | LocationBar, radio, Maps JS, reseñas, EtaChip, toggle delivery, analytics, báscula. Gaps: Conectar primary; ops sin copy delivery; admin sin top 5. |
| 2 | Responsive (móvil / tablet / desktop) | 9 | Lista explorar primero; mapa `h-[300px]` móvil; POS split 58/42; analytics grid; carrito sticky Confirmar. ETA no se muestra en barra compacta móvil. |
| 3 | 4 estados UI | 9 | Empty radio + Ampliar; Maps down + lista usable; analytics `empty`; reseña 409; báscula unsupported/needs-driver. |
| 4 | Consumo de API | 9 | Contratos Arquitecto (`lat/lng/radiusKm`, `/eta`, `/provider/me`, `analytics?range=`). Sin rutas UX provisionales. |
| 5 | Validación de formularios | 8 | Radio 1–25, estrellas 1–5, prep 5–120, geocode ≥3, delivery exige dirección. Prep UX decía 5–180 (contrato 120). |
| 6 | Accesibilidad WCAG AA basal | 7 | Lista alternativa, slider teclado, `RatingStars` radiogroup, split sr-only. Disclaimer ETA y labels del slider en `text-slate-400` (12px < 4.5:1). |
| 7 | Regresiones F2/F3 | 9 | `ContactCTA` + Encargar intactos; pickup default; `POST pos/sales` sin campos de báscula. |
| 8 | Change orders F4 | 8 | “Sin reseñas todavía”; ETA canónico; banner `info`; “En camino” en badge CLIENT. Ops proveedor no ramifica DELIVERY. |
| 9 | Idempotencia / 409 | 8 | `Idempotency-Key` en confirmar; ReviewForm 409 → reseña existente; carrito 409 revalida. |
| 10 | Modularidad y tokens | 7 | Componentes F4 extraídos (`lib/ui/eta-copy`, `lib/pos/scale`). Badges IN_TRANSIT/DELIVERED no siguen paleta tokens §6b/6c. |
| | **Total** | **82** | Umbral 80% |

---

## Hallazgos

### OBS-UX-F4-010 (P1) — Conectar báscula compite con Cobrar

`ScaleStatusBadge.tsx`: el botón **Conectar** usa `bg-[var(--brand)]` (primary). `WF-pos-bascula.md` y tokens §6c especifican Button **Secondary**; el CTA dominante de la pantalla sigue siendo **Cobrar**.

**Acción:** Variante secondary / outline; reservar `--brand` a Cobrar.

### OBS-UX-F4-011 (P1) — Disclaimer ETA y extremos del slider sin contraste AA

`EtaChip.tsx`: microcopy “Es una estimación…” en `text-slate-400` a `text-xs`. Tokens: `text-slate-500`. Ratio slate-400 sobre blanco ≈ 2.5:1 (falla 4.5:1 en texto normal). Mismo token en labels 1–25 km de `RadiusSlider.tsx` y en “Estimación de tiempo no disponible” del carrito.

**Acción:** `text-slate-500` o más oscuro (`text-slate-600`).

### OBS-UX-F4-012 (P1) — Ops proveedor no ramifica “En camino”

`OrdenesPageClient.tsx` `NEXT_ACTIONS`: CONFIRMED → IN_TRANSIT siempre **“Listo para recoger”**. UF-ORDERS-02 / D-F4-5: si `fulfillmentType=DELIVERY`, CTA y badge deben decir **“En camino”**. El badge CLIENT sí ramifica (`OrderStatusBadge` + `inTransitLabel`).

**Acción:** Pasar `fulfillmentType` al label de la acción y al badge en la lista proveedor.

### OBS-UX-F4-013 (P2) — Colores e icono de `OrderStatusBadge` vs tokens

`IN_TRANSIT` usa `emerald-50` (tokens: `blue-50`). `DELIVERED` usa icono `Truck` y fondo slate (tokens: `CircleCheck` + emerald; Truck queda para DELIVERY + IN_TRANSIT).

### OBS-UX-F4-014 (P2) — Banner Google sin “cómo solicitar verificación”

`VerificationRequiredBanner.tsx`: copy y paleta `info` correctos. Falta el link/texto de WF-proveedor-google (“Cómo solicitar verificación”, sin plazos).

### OBS-UX-F4-015 (P2) — Analytics: sin top 5; extra moderar por ID

`AnalyticsPageClient.tsx` cubre KPIs, periodo, empty real y split. No implementa tabla top 5 del WF. Incluye formulario “Eliminar reseña por ID” no wireframed (aceptable como extra ADMIN; no sustituye el top 5).

### OBS-UX-F4-016 (P2) — Toast de reseña y CTA de dirección

`ReviewForm`: toast “Reseña publicada” ≠ “Gracias por tu reseña”. Delivery sin favoritas: copy a Explorar sin link CTA (`WF-carrito-eta`).

### OBS-UX-F4-017 (P2) — ETA oculto en barra compacta móvil

`CartSummary` `compact`: solo Total + Confirmar. El `EtaChip` vive en el aside desktop. WF-carrito-eta pide el chip encima del CTA sticky.

### OBS-UX-F4-018 (P2) — Mini-mapa detalle ya es Google Maps

Cierra el OBS de diseño (Leaflet en detalle). `MiniMap.tsx` usa Maps JS. Sin acción.

---

## Cumplimiento DoD F4 (resumen)

| Regla | Resultado |
|-------|-----------|
| Lista alternativa al mapa (WCAG) | OK · `role="list"` primero; mapa 300px / sticky |
| Empty / error / carga en 6 superficies | OK |
| F3 intacto (pickup, Encargar, ContactCTA, Cobrar) | OK |
| “Requiere verificación” informativo | OK paleta; falta link (P2) |
| ETA “Listo aprox. en ~X min” / prep-only | OK (`eta-copy.ts`) |
| “En camino” solo DELIVERY | OK en CLIENT; **parcial** en ops proveedor (P1) |
| “Sin reseñas todavía” (no estrellas 0.0) | OK hero + cards + lista |
| Sin pasarela / Places import / flotilla | OK |

---

## Veredicto

**APROBADO CON OBSERVACIONES** — La implementación F4 cumple el umbral (82%) sin P0. Los tres P1 (jerarquía báscula, contraste ETA, copy ops delivery) no bloquean pruebas funcionales; QA debe incluirlos en la matriz.

**QA Tester:** contactar vía [`READY-FOR-QA.md`](./READY-FOR-QA.md). Arquitecto ya en 97/100, 0 P0.

---

*Dictamen UX/UI — LaBorregaMarket v0.4.0 — 14/08/2026.*
