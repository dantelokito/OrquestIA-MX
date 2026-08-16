# Deuda de fases previas — implementaciones críticas

> **Proyecto:** LaBorregaMarket  
> **Audiencia:** DevOps, Backend, QA, Arquitecto  
> **Fecha:** 15/08/2026  
> **Fase activa (este repo):** 5  
> **Código:** `C:\Users\PC GAMER\LaBorregaMarket`

DevOps no entregó artefactos en F1–F4 (esqueleto vacío). QA F1–F5 dejaron la misma condición abierta: **regresión automatizada en CI**. Este documento lista solo lo que bloquea merge/CI/staging o que, si se ignora, se convierte en incidente en el primer entorno compartido.

**Decisión 16/08/2026:** estas incidencias **no se implementan en F5**. Se atienden en **Fase 6**. Este archivo queda como backlog de entrada para F6.

No es un plan de Docker/CI de F5. Es el backlog mínimo para no arrastrar deuda ciega.

---

## Cómo priorizar

| Sev | Significado |
|-----|-------------|
| **P0** | Rompe `npm ci` + `next build` o el gate de QA. No mergear CI/staging sin esto. |
| **P1** | En staging/prod el comportamiento pactado (SAD/ADR) no se cumple, o un checklist viejo reintroduce un error ya cerrado. |
| **P2** | No tumba el build hoy; crece costo operativo o documentación divergente. |

**Dueño** indica quién cambia código o cuentas. DevOps documenta y orquesta; no parchea `package.json` de la app desde este repo.

---

## Resumen

| ID | Sev | Origen | Tema | Dueño | Si no se cierra |
|----|-----|--------|------|-------|-----------------|
| DEV-P0-001 | P0 | F4 (ADR-015) | `@upstash/redis` importado y **ausente** de `package.json` / lockfile | Backend | CI y clone limpio no compilan; contacto 500 |
| DEV-P0-002 | P0 | QA F1–F5 | Pipeline CI: Postgres + `migrate deploy` + **`build`/`start`** + Playwright | DevOps (F5) | Sign-off sigue “APROBADO CON CONDICIONES”; no hay regresión en cada push |
| DEV-P1-003 | P1 | OBS-F3-020, F4-020, F5-023 | Cadena de migraciones Prisma en todo entorno que no sea el laptop de QA | DevOps + Backend | Schema F5 (colores) / F4 (reviews) inexistente → 500 en runtime |
| DEV-P1-004 | P1 | F2 + F4 + OBS-F4-022 | Secretos staging: Resend, Cloudinary, Upstash, Inngest | DevOps | Email/media no-op; contacto 503 en prod; jobs Inngest muertos |
| DEV-P1-005 | P1 | ADR-015 | Prod **fail-closed** sin Redis: 503 en contacto | DevOps (env) + Backend (SDK) | Rate limit de contacto no existe o tumba el endpoint |
| DEV-P1-006 | P1 | CO-F5-001 / ADR-020 | No reexigir Maps JS; teselas OSMF/CDN en prod | DevOps + FE | Checklist F4 reviviría OBS-F4-023 (mapa gris / billing) |
| DEV-P1-007 | P1 | F1 seguridad | `JWT_SECRET` único por entorno; cookie `secure` solo si `NODE_ENV=production` | DevOps | Tokens forjables o cookies inseguras si se copia `.env.example` |
| DEV-P2-008 | P2 | SAD observabilidad | Sin `/health`; Docker HEALTHCHECK debe usar `/` o `/api/auth/session` | DevOps F5 | Probes que apunten a `/health` darán false down |
| DEV-P2-009 | P2 | F2/F4 docs | `comun/.env.example` de Frontend incompleto vs app | Frontend (doc) | Quien lea solo FE omite Upstash/Inngest/OSM |
| DEV-P2-010 | P2 | FinOps / DR | Sin staging real, backups PITR ni handoff de URLs | DevOps | RPO/RTO del skill (15 min / 1 h) son papel |
| DEV-P2-011 | P2 | QA F1 | BUG-002 (middleware API bypass, mitigado) | Backend | Endpoint nuevo sin `requireRole` + test RBAC |

---

## P0 — no mergear CI ni staging sin esto

### DEV-P0-001 — `@upstash/redis` no está en el manifiesto

**Evidencia:** `src/lib/rate-limit/contact.ts` línea 1 importa `Redis` desde `@upstash/redis`. No aparece en `package.json` ni en `package-lock.json`. `dev-server.log` ya registró `Module not found: Can't resolve '@upstash/redis'` al compilar `POST /api/providers/[id]/contact`. QA F5 lo vio como 500 en suite paralela contra `next dev`.

El fallback in-memory (`redis_disabled`) **no se ejecuta**: el `import` corre antes que `getRedis()`. Arquitecto F4 listó el paquete como dependencia npm Must (`infra-requirements.md`). `inngest` sí quedó instalado; Redis no.

**Implementación (Backend, en `LaBorregaMarket`):**

```bash
npm install @upstash/redis
```

Commitear `package.json` y `package-lock.json`. No cambia reglas de negocio.

**Si se “arregla” mal:** un `npm install` local sin lockfile no basta para CI (`npm ci` usa el lock). No mover el import a dinámico “para que compile”: el contrato prod es Redis real.

**Si se mergea el CI F5 sin esto:** `next build` en runner limpio falla o la ruta contacto queda 500. El pipeline que pide QA no es ejecutable. Staging con keys Upstash tampoco rate-limita.

---

### DEV-P0-002 — Pipeline de regresión (condición abierta F1→F5)

Misma condición en QA-MVP, QA-F3, QA-F4 y QA-F5: gate “Regresión automatizada en staging/QA” = **PENDIENTE DevOps**.

**Implementación (artefactos en `fase-5/.github/workflows/`, copiar al repo de la app cuando haya remoto):**

1. Servicio `postgres:15`.
2. `npm ci` en la app.
3. `npx prisma migrate deploy` (aplica F2→F5 en orden; ver DEV-P1-003).
4. `npx prisma db seed` (credenciales de `tests/.env.test`, no de producción).
5. `npm run build` y `npm start -p 8080` — **prohibido `next dev` en CI** (compile on-demand + workers paralelos → 500; QA-F5).
6. Suite viva: `QA Automation Engineer/.../outputs/laborregamarket/tests/` con `PLAYWRIGHT_BASE_URL=http://127.0.0.1:8080`.
7. `CI=true` (Playwright ya pone `workers: 1` y retries).

Contrato QA: [`env-requirements.md`](../../../../QA%20Automation%20Engineer/Agente%20Tester/outputs/laborregamarket/comun/env-requirements.md). Ojo: el bloque *local* de ese archivo aún sugiere `npm run dev`; **CI no debe copiarlo**.

**Si no se cierra:** cada fase nueva suma tests y el gap de regresión crece. Un merge a `main` no tiene red de seguridad. F6 (pagos) no debería empezar sin este gate.

**Fuera de este ítem:** deploy Vercel real, Trivy/ECS/K8s (SAD = Vercel + managed DB).

---

## P1 — primer entorno compartido

### DEV-P1-003 — Migraciones en cadena

SQL ya está en el repo. El riesgo es **entorno sin `migrate deploy`** (OBS repetida cada fase).

| Fase | Migración | OBS |
|------|-----------|-----|
| F2 | `20260810010000_add_audit_contact_media_upload` | — |
| F3 | `20260813030000_orders_f3_source_pos_uom` | OBS-F3-020 |
| F4 | `20260814040000_add_reviews_addresses_notify_scale` | OBS-F4-020 |
| F5 | `20260814050000_add_provider_brand_colors` | OBS-F5-023 |

También existe `20260805183000_add_provider_search_indexes`.

Un solo `npx prisma migrate deploy` aplica las pendientes. En Windows: **parar `next dev`** antes (DLL del query engine bloquea `prisma generate`).

**Si no se cierra en staging:** F5 (colores) y F4 (reviews/addresses) 500; QA local no equivale a prod.

---

### DEV-P1-004 y DEV-P1-005 — Secretos y fail-closed Redis

| Variable | Fase | Local sin valor | Staging/prod |
|----------|------|-----------------|--------------|
| `RESEND_API_KEY`, `EMAIL_FROM` | F2 | no-op + AUDIT `email_disabled` | Must; dominio verificado |
| `CLOUDINARY_*` | F2 | upload falla | Must si MEDIA activo |
| `UPSTASH_REDIS_REST_URL` + `TOKEN` | F4 | memoria (solo `development`/`test`) | Must; caída → **503** contacto |
| `INNGEST_EVENT_KEY` + `SIGNING_KEY` | F4 | jobs no salen | Must; registrar `{APP_URL}/api/inngest` |
| WhatsApp `WHATSAPP_*` | F4 Should | no-op | No bloquea F5 |

OBS-F4-022: nunca hubo smoke staging de Redis/Inngest/WA.

**Riesgo futuro:** `NODE_ENV=production` **sin** Upstash no usa memoria; lanza `ContactRedisUnavailableError` → 503. Eso es correcto (ADR-015). Lo incorrecto es desplegar “para ver la UI” sin Redis y creer que contacto funciona.

Depende de DEV-P0-001: sin el paquete, ni el 503 ni el Redis real cargan.

---

### DEV-P1-006 — Mapas: no seguir el checklist F4

El checklist pre-deploy F4 en `infra-requirements.md` todavía dice:

- exigir `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` con restricción de dominio  
- “Leaflet retirado de `/explorar`”

Eso quedó **superado** por ADR-020 / CO-F5-001. QA cerró OBS-F4-023: Explorar es Leaflet + OSM **sin** key.

**Implementación DevOps:**

- `.env` de CI/staging **sin** Maps JS como Must.
- `NEXT_PUBLIC_OSM_TILE_URL` opcional; default OSM. Prod: CDN compliant + User-Agent identificable (política OSMF). Attribution es UI, no env.
- No reintroducir `@vis.gl/react-google-maps` en Explorar.

**Si se ignora:** alguien “completa” el checklist F4, gasta billing o el mapa vuelve al empty state F4.

---

### DEV-P1-007 — Secretos de auth

- `JWT_SECRET` del `.env.example` es placeholder. Cada entorno (CI, staging, prod) debe tener uno distinto, ≥ 32 chars, en secret manager / GitHub Secrets — nunca en YAML.
- Cookie JWT ya usa `secure: process.env.NODE_ENV === "production"` (login/register). Si staging corre con `NODE_ENV=development`, la cookie viaja sin `Secure`.
- Seed QA (`Demo1234!` / `cliente@demo.mx`) **solo** CI/local. Prohibido en prod.

---

## P2 — no bloquea F5; documentar para no pisarlas

### DEV-P2-008 — Health

SAD: health dedicado = roadmap. No inventar `/health` en DevOps. Compose/K8s (si se hace) debe sondear `GET /` o `GET /api/auth/session` (200 invitado, contrato F5).

### DEV-P2-009 — Drift de `.env.example`

La app (`LaBorregaMarket/.env.example`) está al día (OSM, Upstash, Inngest, WA). El de Frontend `comun/.env.example` se corta en Cloudinary/rate-limit: falta F4/F5. Quien genere staging solo con el de FE deja Redis/Inngest/tiles fuera.

### DEV-P2-010 — No hay nube todavía

Sin remoto GitHub del workflow, sin URL staging, sin PITR de Postgres managed, sin registro Inngest Cloud. El skill DevOps (RPO 15 min / RTO 1 h) no aplica hasta provisionar (SAD: Vercel + Neon/Supabase/Railway + Upstash + Inngest Cloud). No sustituir eso por ECS/K8s en F5.

### DEV-P2-011 — BUG-002 (producto, no infra)

Middleware API bypass mitigado con guards + `rbac.spec.ts`. Riesgo futuro: ruta nueva sin `requireRole` y sin caso RBAC. CI (DEV-P0-002) es la red que lo detecta; no lo “arregla” Docker.

**No crítico para este documento:** clustering Should, Places/Distance Matrix, pasarela/CFDI/PWA (F6+), Prometheus/Grafana, WhatsApp sandbox, `package.json` versionado `0.3.0` vs producto `0.5.0`.

---

## Orden de cierre recomendado

```text
1. Backend: npm install @upstash/redis + lockfile     (DEV-P0-001)
2. DevOps F5: workflow CI build/start + Playwright    (DEV-P0-002)
3. Mismo workflow: migrate deploy + seed              (DEV-P1-003)
4. Staging (cuando existan cuentas): secretos F2/F4   (DEV-P1-004/005)
5. Env mapas F5; ignorar Must Maps del checklist F4   (DEV-P1-006)
6. JWT/cookie/secret manager                          (DEV-P1-007)
```

Pasos 2–3 son artefactos en `outputs/laborregamarket/fase-5/`. El paso 1 es cambio en `LaBorregaMarket` (fuera de este output).

---

## Referencias

| Fuente | Ruta |
|--------|------|
| Sign-off F5 | QA `fase-5/qa-signoffs/QA-F5-signoff.md` |
| Env QA | QA `comun/env-requirements.md` |
| Infra SAD | Arquitecto `comun/infra-requirements.md` |
| ADR Redis/Inngest | Arquitecto `comun/adrs/ADR-015-notification-queue.md` |
| ADR mapas F5 | Arquitecto `comun/adrs/ADR-020-maps-engine-leaflet.md` |
| Rate limit | `LaBorregaMarket/src/lib/rate-limit/contact.ts` |
| App env | `LaBorregaMarket/.env.example` |
