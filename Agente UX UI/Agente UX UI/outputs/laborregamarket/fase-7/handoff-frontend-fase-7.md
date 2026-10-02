# Handoff Frontend Developer — LaBorregaMarket Fase 7 (v0.7.1)

> **De:** Agente UX/UI Designer  
> **Para:** @Frontend  
> **Fecha:** 18/08/2026  
> **Prioridad:** Explorar mapa-primero + AUTH cookie portable  
> **No implementar:** pasarela, CFDI, PWA, clustering, bbox Must, Google Maps JS, DASH F6, deuda Redis/CI

---

## Estado: LISTO PARA IMPLEMENTAR

Fase 6 de diseño está **congelada**. Este handoff **revoca** el ciclo F6 pan/zoom → `radiusKm` (`CO-F7-001` / D-F6-9 / US-GEO-07). Leaflet/OSM **invariante**.

**Punto de entrada:** este archivo + [`../STATUS.md`](../STATUS.md) + [`../comun/design-tokens.md`](../comun/design-tokens.md) v0.7.1

Código: `C:\Users\PC GAMER\LaBorregaMarket`

Backend: Arquitecto `fase-7/handoff-backend-fase-7.md` + `API-GEO-01`, `API-ADDRESSES-01`, `API-PROVIDER-PREVIEW-01`, `API-AUTH-01`.

Quality Gate UX se emite **cuando FE implemente**. No `READY-FOR-QA` de checkout/pagos.

---

## Impacto si no se cierra

Al panear el mapa, el radio “baila” y el dashboard se desplaza. El copy “12 fruterías” miente si hay 35. Las favoritas mueren en `localStorage`. El empty de radio se siente a bug. Login en Safari no deja usar Explorar en el teléfono.

---

## US de este handoff

| ID | Frontend hace |
|----|----------------|
| **US-GEO-09** | Layout mapa-primero; móvil mapa **arriba**; lista no empuja el mapa |
| **US-GEO-10** | Pan/zoom **sin** refetch; slider/GPS/dirección/favorita → círculo + `fitBounds` + GET |
| **US-GEO-11** | Default SN `25.7475, -100.2830` + 10 km; CLIENT = last-used API |
| **US-GEO-12** | Mapa ~+20% alto; `limit=20`; paginar sin reset de mapa/radio |
| **US-GEO-13** | Copy N/R = `meta.total` / `meta.radiusKm` |
| **US-GEO-14** | CRUD favoritas servidor; `POST .../use`; API gana a localStorage |
| **US-GEO-15** | Markers sin nombre permanente; tooltip; icono `Store` ~28px |
| **US-GEO-16** | BrandLoader 64px loading / 80px empty; error ≠ empty |
| **US-EXPLORE-05** | Preview sheet; horario 3 cols; flags iff true; 3 reseñas; `#resenas` |
| **US-EXPLORE-06** | `q` ≥2 unión nombre ∪ producto activo |
| **US-AUTH-09** | `credentials: 'include'`; banner no técnico si sesión no persiste |

**No implementar aquí:** pasarela, CFDI, clustering, Maps JS, reportes proveedor, Redis, CI YAML.

---

## Orden de implementación

```
1. Quitar derivación viewport → radiusKm (CO-F7-001)
2. Layout mapa-primero + alto +20%; lista debajo; móvil mapa arriba
3. Constante SN + hidratación last-used (GET addresses)
4. Copy meta.total; limit=20; paginación sin mover mapa
5. Markers sin label + tooltip; BrandLoader loading vs empty
6. Preview GET /api/providers/[id] + ancla #resenas en detalle
7. q min 2; POST addresses/[id]/use
8. Login credentials + SessionPersistBanner
```

---

## Entregables UX (índice)

| Tipo | Archivo |
|------|---------|
| Flow GEO | [`user-flows/UF-GEO-01-explorar-f7.md`](./user-flows/UF-GEO-01-explorar-f7.md) |
| Flow preview | [`user-flows/UF-EXPLORE-05-preview.md`](./user-flows/UF-EXPLORE-05-preview.md) |
| Flow AUTH | [`user-flows/UF-AUTH-09-sesion-movil.md`](./user-flows/UF-AUTH-09-sesion-movil.md) |
| WF Explorar | [`wireframes/WF-explorar-mapa-primero.md`](./wireframes/WF-explorar-mapa-primero.md) |
| WF Preview | [`wireframes/WF-explorar-preview.md`](./wireframes/WF-explorar-preview.md) |
| WF Login | [`wireframes/WF-login-sesion.md`](./wireframes/WF-login-sesion.md) |
| Tokens | [`../comun/design-tokens.md`](../comun/design-tokens.md) §6f |
| IA | [`../comun/information-architecture.md`](../comun/information-architecture.md) |
| F5 Explorar (solo lectura) | [`../fase-5/wireframes/WF-explorar-leaflet.md`](../fase-5/wireframes/WF-explorar-leaflet.md) |

---

## Design system — componentes F7

| Componente | Spec en tokens |
|------------|----------------|
| ExploreLayoutF7 | Mapa primero; `--explore-map-min-h-mobile: 360px`; desktop `calc(100vh-200px)` |
| ExploreCount | `{N} fruterías a {R} km` |
| ExploreMarker | 28px; tooltip; no label permanente |
| ProviderPreviewSheet | dialog; HoursTable; flags; CTA Ver frutería |
| BrandLoader sizes | `loading` 64px / `empty` 80px |
| SessionPersistBanner | copy no técnico |

Círculo, slider, CTA ubicación, CompactAddressBar: F5. **Desconectar** sync zoom→slider.

---

## Contratos (no inventar)

| Uso | API |
|-----|-----|
| Lista | `GET /api/providers?lat&lng&radiusKm&q&category&verified&page&limit=20` → `meta.total`, `meta.radiusKm` |
| Preview | `GET /api/providers/[id]` (campos F7) |
| Favoritas | `GET/POST/PATCH/DELETE /api/users/me/addresses` |
| Last-used | `POST /api/users/me/addresses/[id]/use` |
| Auth | `POST /api/auth/login`, `GET /api/auth/session` — cookie first-party; **sin** Bearer Must |

`q` 1 carácter → no GET (hint UI) o 400. Clamp radio 1–25 en servidor; FE envía slider.

`localStorage` **no** es origen de centro Explorar.

---

## Copy Must

| Situación | Copy |
|-----------|------|
| Conteo | `{N} fruterías a {R} km` |
| Empty radio | “No hay fruterías en este radio” + **Ampliar radio** + Limpiar filtros |
| Empty q | + **Limpiar búsqueda** |
| Horario vacío | “Horario no publicado” |
| Verificación | “verificado a la borrega desde MM/AAAA” |
| Sin reseñas | “Sin reseñas todavía” |
| Mapa caído | “El mapa no cargó; usa la lista” |
| Clamp | “Máximo 25 km” |
| Loader | sr-only “Buscando fruterías” |
| q corto | “Escribe al menos 2 caracteres” |
| Sesión | “No pudimos mantener tu sesión en este navegador. Revisa que las cookies estén permitidas e intenta de nuevo.” |

Flags: **no afirmar** envío, tarjeta ni WhatsApp si el campo no es true.

---

## DoD UX F7 (checklist FE)

- [ ] Mapa no pierde viewport al paginar o refetch.
- [ ] Slider y “Usar mi ubicación” ≥44px; operable teclado.
- [ ] Preview scrolleable; horario 3 cols `>=640px`, apilado debajo.
- [ ] Markers: nombre no empalmado en reposo.
- [ ] `loader.size.loading` vs `empty` (~+25%); mismos B1–B3.
- [ ] `prefers-reduced-motion`: encuadre instantáneo; loader B1.
- [ ] Pan no dispara GET ni cambia slider/copy.
- [ ] CTA dominante preview = **Ver frutería**. Login = **Ingresar**.

---

## Fuera de alcance

Pasarela, CFDI, PWA, flotilla, clustering, bbox Must, Places, Distance Matrix, reportes DASH, lockfile Redis, CI YAML, seed QA en prod.

---

*Handoff UX/UI → Frontend — LaBorregaMarket v0.7.1 — 18/08/2026.*
