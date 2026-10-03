# Handoff UX → Frontend — LaBorregaMarket Fase 6 (v0.6.0)

> **Copia de trabajo** para el Agente Frontend. Canónico: `Agente UX UI/Agente UX UI/outputs/laborregamarket/fase-6/handoff-frontend-fase-6.md`  
> **De:** Agente UX/UI Designer  
> **Para:** @Frontend  
> **Fecha:** 16/08/2026  
> **Prioridad:** Cerrar deuda P0/P1 de **experiencia** **antes** de pasarela  
> **No implementar:** pasarela de pagos, CFDI, CI YAML, `/health`, `npm install @upstash/redis`, JWT

---

## Estado: LISTO PARA IMPLEMENTAR (slice confiabilidad)

F5 producto (Leaflet, CAT, brand) tiene QG UX 86/100. QA y DevOps documentaron contacto **500** y checklist Maps que puede deshacer F5. Este handoff cubre **solo lo que Frontend cambia** en `LaBorregaMarket` (UI).

**Punto de entrada:** este archivo + [`../STATUS.md`](../STATUS.md) + [`../comun/integration-readme.md`](../comun/integration-readme.md)

Código: `C:\Users\PC GAMER\LaBorregaMarket`

Tokens Toast 503/500: `Agente UX UI/.../outputs/laborregamarket/comun/design-tokens.md`  
Wireframe: `Agente UX UI/.../outputs/laborregamarket/fase-5/wireframes/WF-contacto-resiliencia.md`  
Addendum F5 (origen): `Agente UX UI/.../outputs/laborregamarket/fase-5/handoff-frontend-deuda.md`

Backend: Arquitecto `fase-6/handoff-backend-fase-6.md` (lockfile Redis, 503 API, migrate). **No hay READY-FOR-QA de pagos** mientras DEV-P0-001 o DEV-P0-002 sigan abiertos.

---

## Impacto si no se cierra

Sin ramificar 503 vs 500, el cliente ve un toast genérico y cree que Llamar “está roto”. Si alguien “completa” el checklist F4, vuelve el mapa gris (OBS-F4-023). Schema ausente → picker 500 leído como bug de colores.

---

## Incidencias de este handoff

| ID | Sev | Frontend hace |
|----|-----|----------------|
| **DEV-P0-001** | P0 | Toasts 500 en `ContactCTA` (el paquete Redis es Backend) |
| **DEV-P1-005** | P1 | Toast **503** distinto de 500 y de 429 |
| **DEV-P1-003** | P1 | Fallback plataforma + ErrorBanner picker; 500 ≠ empty POS |
| **DEV-P1-006** | P1 | No reintroducir Maps JS; OSM opcional |
| **DEV-P2-009** | P2 | Sincronizar `.env.example` **público** |

**No es Frontend (no implementar aquí):**

| ID | Dueño |
|----|--------|
| DEV-P0-001 lockfile `@upstash/redis` | Backend |
| DEV-P0-002 CI workflow | DevOps |
| DEV-P1-003 `migrate deploy` | Backend + DevOps |
| DEV-P1-004 secretos SaaS | DevOps |
| DEV-P1-007 JWT por entorno | DevOps |
| DEV-P2-008 `/health` | No inventar |
| DEV-P2-010 nube/PITR | DevOps |
| DEV-P2-011 `requireRole` | Backend |

---

## Orden de implementación

```
1. ContactCTA: ramificar 429 / 503 / 500  (DEV-P0-001 UI, DEV-P1-005)
2. Invariante Explorar Leaflet/OSM         (DEV-P1-006)
3. Session/colores 500 → plataforma        (DEV-P1-003)
4. POS: 500 ≠ “No hay productos activos”
5. comun/.env.example: OSM opcional; sin Maps Must  (DEV-P2-009)
```

---

### 1 — Contacto (Must)

`tel:` y Encargar **siempre** usables. Un toast; variante **error** en 5xx. Nunca empty de mapa ni “agotado”.

| HTTP | Toast |
|------|-------|
| 200 `notified` | `La frutería fue notificada` (success, F2) |
| 429 | Silencio (F2) |
| **503** | **El aviso a la frutería no está disponible. Puedes llamar igual.** |
| **500** / red | **No pudimos avisar a la frutería. Puedes llamar igual.** |

Hoy 429 se silencia y el resto comparte un solo copy. Ramificar `ApiError.status`.

---

### 2 — Explorar (Must, DEV-P1-006)

- **Prohibido** `@vis.gl/react-google-maps` en `/explorar`.
- **Prohibido** exigir `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` para GEO.
- Leaflet + OSM, attribution, “El mapa no cargó; usa la lista”.
- `NEXT_PUBLIC_OSM_TILE_URL` opcional.
- Embed Google reseñas (`US-REV-03`) intacto.

---

### 3 — Marca y catálogo (Must, DEV-P1-003)

| Superficie | Si API 500 |
|------------|------------|
| `SessionThemeProvider` | Tokens plataforma |
| `BrandColorPicker` | ErrorBanner + Reintentar |
| POS | ErrorBanner; **no** “No hay productos activos” |
| `/explorar` | Lista usable |

---

### 4 — `.env.example` (DEV-P2-009)

| Variable | Must Explorar | Nota |
|----------|---------------|------|
| `NEXT_PUBLIC_OSM_TILE_URL` | No | Default OSM |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | **No** | No reintroducir |

No publicar Upstash/JWT/Resend/Inngest como `NEXT_PUBLIC_*`.

---

## DoD Frontend F6 (confiabilidad)

- [ ] `ContactCTA` ramifica 429 / 503 / 500 con copy de la tabla §1
- [ ] `tel:`, `wa.me` y Encargar no se deshabilitan por fallo de notify
- [ ] Explorar sigue Leaflet/OSM; cero Maps JS
- [ ] Session 500 → plataforma; picker ErrorBanner
- [ ] 500 catálogo ≠ empty POS de “sin activos”
- [ ] `.env.example` FE: OSM opcional; sin Maps key Must
- [ ] Cero pasarela, cero YAML de CI, cero `npm install @upstash/redis`

---

## Fuera de alcance

Pasarela, CFDI, PWA, Places, Distance Matrix, bbox Must, `/health`, clustering Should, parches OBS-UX-F5-001 (ETA contraste) salvo paralelo.

---

## Referencias

- Tokens Toast 503/500: UX `comun/design-tokens.md`
- WF: UX `fase-5/wireframes/WF-contacto-resiliencia.md`
- Arquitecto Backend: `Agente Arquitecto/.../fase-6/handoff-backend-fase-6.md`

---

*Handoff UX → Frontend — LaBorregaMarket v0.6.0 — 16/08/2026.*
