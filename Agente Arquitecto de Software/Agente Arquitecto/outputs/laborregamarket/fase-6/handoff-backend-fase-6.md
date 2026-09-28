# Handoff Backend Developer — LaBorregaMarket Fase 6 (v0.6.0)

> **De:** Agente Arquitecto de Software  
> **Para:** @Backend Developer  
> **Fecha:** 16/08/2026  
> **Prioridad:** Cerrar deuda P0/P1 de confiabilidad **antes** de pasarela  
> **No implementar:** pasarela de pagos, CFDI, CI YAML (DevOps), `/health`, Leaflet/Maps, copy UX de 500/503

---

## Estado: LISTO PARA IMPLEMENTAR (slice confiabilidad)

F5 producto (Leaflet, CAT, brand) tiene QG BE 97/100. DevOps y QA documentaron que **ADR-015 no es ejecutable** y que **no hay CI**. Este handoff cubre solo lo que Backend cambia en `LaBorregaMarket`.

**Punto de entrada:** este archivo + [`../STATUS.md`](../STATUS.md) + [`../comun/infra-requirements.md`](../comun/infra-requirements.md)

Código: `C:\Users\PC GAMER\LaBorregaMarket`

Fuentes: DevOps `comun/deuda-fases-previas.md` (DEV-P0-001 … DEV-P2-011); QA `fase-5/deuda-tecnica-fases-previas/IMPACTO-NO-ATENDER.md`.

**No hay READY-FOR-QA de pagos** mientras DEV-P0-001 o DEV-P0-002 sigan abiertos.

---

## Impacto si no se cierra

Sin `@upstash/redis` en el lockfile, contacto **500** en clone limpio; el 429 y el **503 fail-closed** de prod nunca se evalúan; cada isolate serverless acepta spam. Sin CI, Encargar/POS (y luego cobro) se regresionan en silencio. Schema F4/F5 ausente en staging → 500 en reviews/colores.

---

## Incidencias de este handoff

| ID | Sev | Backend hace |
|----|-----|----------------|
| **DEV-P0-001** | P0 | `npm install @upstash/redis` + commit lockfile |
| **DEV-P1-003** | P1 | Cadena `migrate deploy` F2→F5 verificable; script opcional |
| **DEV-P1-005** | P1 | Tras el paquete: prod sin `UPSTASH_*` → 503, no 500 |
| **DEV-P2-011** | P2 | Toda ruta API **nueva** con `requireRole` + test RBAC |

**No es Backend (no implementar aquí):**

| ID | Dueño |
|----|--------|
| DEV-P0-002 CI workflow | DevOps — ver infra |
| DEV-P1-004 secretos SaaS | DevOps |
| DEV-P1-006 Maps checklist | Arquitecto (ya alineado en `infra-requirements.md`) + DevOps/FE env |
| DEV-P1-007 JWT por entorno | DevOps |
| DEV-P2-008 `/health` | No inventar; probes a `GET /api/auth/session` |
| DEV-P2-009 `.env.example` FE | Frontend / UX |
| DEV-P2-010 nube/PITR | DevOps |

---

## Orden de implementación

```
1. npm install @upstash/redis  (DEV-P0-001)
2. Tests 503 prod / 429 Redis / contacto ya no 500 por módulo
3. migrate deploy F2→F5 + script opcional db:migrate  (DEV-P1-003)
4. Guardia: rutas nuevas requireRole + test RBAC  (DEV-P2-011)
```

---

### 1 — Lockfile Redis (Must, DEV-P0-001)

```bash
npm install @upstash/redis
```

Commitear `package.json` y `package-lock.json`. `npm ci` en runner limpio debe resolver `import { Redis } from "@upstash/redis"` en `src/lib/rate-limit/contact.ts`.

**Prohibido:** `import()` dinámico para que compile sin el paquete. ADR-015: Redis real en prod.

`inngest` ya está en el manifiesto; no duplicar.

---

### 2 — Fail-closed 503 (Must, DEV-P1-005)

Depende del paso 1. El código ya lanza `ContactRedisUnavailableError` si `NODE_ENV=production` y faltan `UPSTASH_*`. Tras instalar el SDK:

| Entorno | `UPSTASH_*` | Esperado |
|---------|-------------|----------|
| `development` / `test` sin keys | Fallback memoria + log `redis_disabled` | 200/429 in-process |
| `production` sin keys o Redis caído | **503** envelope ADR-003 | no 500 `Can't resolve` |
| staging/prod con keys | Rate limit 5/10 min y 20/h | 429 si se excede |

Tests Must: (a) import resuelve; (b) prod sin Redis → 503; (c) no crear orden/contacto extra en 429.

---

### 3 — Migraciones (Must operativo, DEV-P1-003)

Un `npx prisma migrate deploy` aplica pendientes (F2 audit → F3 orders → F4 reviews/addresses → F5 colores). Windows: **parar `next dev`** antes de `prisma generate` (DLL).

Script opcional en `package.json`: `"db:migrate": "prisma migrate deploy"`. No nueva migración de producto.

Confirmar columnas `providers.primary_color` / `secondary_color` (cierra espíritu OBS-F5-023 en el entorno donde se corra).

---

### 4 — RBAC en rutas nuevas (Must de higiene, DEV-P2-011)

BUG-002 está mitigado con guards. Cada endpoint **nuevo** en este o siguientes slices: `getSession` + `requireRole` (o equivalente) **y** un caso de test 401/403. Sin CI (P0-002) esto es la única red en el repo de la app.

Este slice **no** añade rutas de pago.

---

## DoD Backend F6 (confiabilidad)

- [ ] `@upstash/redis` en lockfile; `npm ci` no falla por ese import
- [ ] Contacto en prod sin Upstash → **503**, no 500 de módulo
- [ ] 429 con Redis configurado (umbrales ADR-015)
- [ ] `migrate deploy` documentado / script; sin schema nuevo
- [ ] Cero pasarela, cero `/health`, cero YAML de GitHub Actions
- [ ] Envelope ADR-003 en 429/503

---

## DevOps (contexto)

Ver [`../comun/infra-requirements.md`](../comun/infra-requirements.md) sección CI. Workflow: Postgres 15 + `npm ci` + `migrate deploy` + `build`/`start` + Playwright. **Prohibido `next dev` en CI.**

---

## Fuera de alcance

Pasarela, CFDI, PWA, Places, Distance Matrix, bbox Must, `/health`, Leaflet, paleta del logo, stock.

---

## Referencias

- ADR-015: [`../comun/adrs/ADR-015-notification-queue.md`](../comun/adrs/ADR-015-notification-queue.md)
- Infra: [`../comun/infra-requirements.md`](../comun/infra-requirements.md)
- Contacto F4: [`../fase-4/api/API-NOTIFY-01.md`](../fase-4/api/API-NOTIFY-01.md)
