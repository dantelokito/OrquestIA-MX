# Infraestructura — LaBorregaMarket v0.11.0

> **Agente:** Arquitecto de Software  
> **Fecha:** 12/09/2026  
> **Audiencia:** DevOps, Backend Developer, Frontend  
> **Changelog 0.2.0:** Resend + Cloudinary + rate limit contacto  
> **Changelog 0.4.0:** Upstash Redis, Inngest, Google Maps JS, WhatsApp Should; Leaflet deprecado en `/explorar`  
> **Changelog 0.5.0:** Leaflet/OSM vuelve a `/explorar` (ADR-020); `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` **no** requerida para GEO; colores `Provider`; tesela CDN opcional  
> **Changelog 0.6.0:** `@upstash/redis` Must en lockfile (DEV-P0-001); CI `build`/`start` + migrate (DEV-P0-002); checklist F4 Maps **superado** por ADR-020 (DEV-P1-006). Sin pasarela.  
> **Changelog 0.10.2:** Media en **disco** (`UPLOADS_DIR`, ADR-032). Cloudinary **deja de ser Must**. Volumen persistente obligatorio. Sin CI YAML nuevo.  
> **Changelog 0.11.0:** Segunda cookie `lbm_active_provider` (mismos flags que JWT). Sin env nueva. Sin Cloudinary. Migración unique `user_id` **antes** de seed N=2.  
> **Changelog 0.14.0:** Sin variables nuevas. Migración Prisma `InventoryEntry.kind` / `receiveAs` nullable viaja en el PR de app. `pdfkit` ya en lockfile. PDF `from`/`to` reusa el mismo runtime. Sin bucket, sin Redis extra.

---

## Runtime

| Requisito | Versión mínima |
|-----------|----------------|
| Node.js | 20+ |
| PostgreSQL | 15+ |
| npm / pnpm | Según `package-lock.json` del repo |

---

## Variables de entorno

### Core (Fase 1)

| Variable | Requerida | Descripción | Ejemplo |
|----------|-----------|-------------|---------|
| `DATABASE_URL` | Sí | Connection string PostgreSQL | `postgresql://user:pass@localhost:5432/laborregamarket` |
| `JWT_SECRET` | Sí | Secreto para firmar tokens (min 32 chars) | `your-super-secret-key-min-32-chars` |
| `JWT_EXPIRES_IN` | No | Expiración JWT | `7d` |
| `NODE_ENV` | Sí | Entorno de ejecución | `development` / `production` |
| `NEXT_PUBLIC_APP_NAME` | No | Nombre app | `La Borrega Market` |
| `NEXT_PUBLIC_APP_URL` | Sí (Fase 2 email) | URL canónica (links en email) | `https://laborregamarket.mx` |

### Email — Resend (Fase 2, ADR-005)

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| `RESEND_API_KEY` | Sí en staging/prod | API key Resend |
| `EMAIL_FROM` | Sí en staging/prod | Remitente verificado |

Sin `RESEND_API_KEY` en local: no-op + AUDIT `reason: "email_disabled"`.

### Storage — Disco local (Fase 10, ADR-032). Cloudinary F2 **aparcado**

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| `UPLOADS_DIR` | Sí staging/prod | Directorio absoluto o relativo al cwd. Fuera de `public/`. Volumen persistente |
| `CLOUDINARY_CLOUD_NAME` | No F10 | Histórico ADR-006. No Must para uploads nuevos |
| `CLOUDINARY_API_KEY` | No F10 | Idem |
| `CLOUDINARY_API_SECRET` | No F10 | Idem |

Local: default `./uploads` (gitignore). Staging/prod: montar volumen (Docker bind, VPS, NFS). **Incompatible** con filesystem efímero de Vercel serverless. URLs Cloudinary ya persistidas pueden seguir en columnas hasta reemplazo.

`GET /api/media/{cuid}.{ext}` sirve el archivo (`nosniff`).

### Rate limit contacto

| Variable | Default | Descripción |
|----------|---------|-------------|
| `CONTACT_RATE_LIMIT_PER_PROVIDER` | `5` | Max contactos / provider / 10 min |
| `CONTACT_RATE_LIMIT_PER_IP` | `20` | Max contactos / IP / hora |

Umbrales iguales a ADR-008; el **store** pasa a Redis (ADR-015).

### Redis — Upstash (Fase 4, ADR-015) Must

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| `UPSTASH_REDIS_REST_URL` | Sí staging/prod | URL REST Upstash |
| `UPSTASH_REDIS_REST_TOKEN` | Sí staging/prod | Token REST |

Local: si faltan **y** el paquete está instalado, fallback in-memory (`reason: "redis_disabled"`). Prod: obligatorio; si Redis cae o faltan vars → **503** contacto (fail closed, `ContactRedisUnavailableError`).

**Manifiesto (DEV-P0-001, F6 Must Backend):** `@upstash/redis` debe estar en `package.json` **y** `package-lock.json`. El import en `src/lib/rate-limit/contact.ts` es **estático** (línea 1). Sin el paquete, `npm ci` / `next build` en runner limpio no resuelve el módulo: contacto **500**, el fallback **no corre**, el 503 de prod **nunca se evalúa**. Prohibido “arreglar” con `import()` dinámico para compilar sin Redis: el contrato prod es Redis real. `inngest` ya está en el lock; Redis no (hueco F4).

### Inngest (Fase 4, ADR-015) Must

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| `INNGEST_EVENT_KEY` | Sí staging/prod | Envío de eventos |
| `INNGEST_SIGNING_KEY` | Sí staging/prod | Firma del serve `/api/inngest` |

Registrar la app en Inngest Cloud (o self-host) apuntando a `{NEXT_PUBLIC_APP_URL}/api/inngest`.

### Google Maps JS (Fase 4, ADR-016) — **no requerida para Explorar (F5)**

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | **No** para GEO | Maps JavaScript API. F5 (ADR-020) no la usa en `/explorar`. Embed/URL de reseñas (ADR-018) es Place ID / URL, no JS API. Puede omitirse o dejarse sin usar. |

Si existe en `.env` de F4, **no bloquea** local/QA. QA deja de exigirla para EC-08 / OBS-F4-023.

### Teselas OSM (Fase 5, ADR-020)

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| `NEXT_PUBLIC_OSM_TILE_URL` | No | Template `{z}/{x}/{y}` de un CDN compliant. Default local/QA: `https://tile.openstreetmap.org/{z}/{x}/{y}.png` |

Producción: respetar política OSMF (User-Agent identificable). Attribution `© OpenStreetMap contributors` es Must en UI, no env.

### WhatsApp Cloud API (Fase 4, Should)

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| `WHATSAPP_TOKEN` | Should | Token permanente / sandbox |
| `WHATSAPP_PHONE_NUMBER_ID` | Should | ID del número Meta |
| `WHATSAPP_TEMPLATE_ORDER_NEW` | Should | Nombre plantilla nuevo pedido |
| `WHATSAPP_TEMPLATE_ORDER_READY` | Should | Nombre plantilla listo / en camino |

Sandbox Meta para staging. Sin vars: jobs WA no-op.

### Archivo de referencia

`LaBorregaMarket/.env.example` — extender con `UPLOADS_DIR` y `NEXT_PUBLIC_OSM_TILE_URL` (opcional). Cloudinary histórico opcional. Quitar Maps JS key del checklist Must de Explorar.

### Seguridad

- **Nunca** commitear `.env` con valores reales.
- `JWT_SECRET` **único por entorno** (CI, staging, prod), ≥ 32 chars, secret manager / GitHub Secrets — nunca el placeholder de `.env.example` (DEV-P1-007).
- Secretos Resend/Upstash/Inngest/WhatsApp solo server-side. Cloudinary ya no es Must F10.
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` ya no es Must; si se deja, sigue siendo pública (no usarla en Explorar).
- Staging/prod: `NODE_ENV=production` para cookie JWT `secure: true` (ADR-025). Si staging corre como `development`, la cookie viaja sin `Secure` y Safari/Chrome móvil pueden no persistirla (`US-AUTH-09`).
- Cookie: `HttpOnly`, `Path=/`, `SameSite=Lax`; omitir `Domain` salvo subdominio documentado. **No** JWT en querystring.
- Seed QA (`Demo1234!`) solo CI/local. Prohibido en prod.

---

## Base de datos

### Proveedor recomendado MVP

| Entorno | Opción |
|---------|--------|
| Desarrollo local | PostgreSQL Docker o instalación local |
| Staging/Prod | Neon, Supabase, Railway |

### Comandos Prisma

```bash
npx prisma migrate dev    # Aplicar migraciones (dev)
npx prisma db seed        # Datos demo
npx prisma generate       # Regenerar client
npx prisma studio         # UI explorar datos
```

### Migración Fase 2

Extender enum `AuditAction`:

```prisma
enum AuditAction {
  // ... existentes ...
  CONTACT
  MEDIA_UPLOAD
}
```

Nombre sugerido: `add_audit_contact_media_upload`

### Migración Fase 4

Nombre sugerido: `add_reviews_addresses_notify_scale`

- Models `Review`, `UserAddress`
- Campos `Provider`: `preparationTimeMinutes`, `offersDelivery`, `googlePlaceId`, `googleMapsUrl`, `googleReviewsEnabled`
- Campos `Order` (Should): `fulfillmentType`, `deliveryAddressId`, `deliveryAddressSnapshot`, `etaMinutes`
- `User.whatsappOptIn` (Should)
- Backfill `Provider.rating = 0`, `review_count = 0` (dejar de usar seed como dato real)

Índices: `Review(providerId, createdAt)`, `UserAddress(userId)`. Sin PostGIS en F4.

### Migración Fase 5

Nombre sugerido: `add_provider_brand_colors`

- Campos `Provider`: `primaryColor`, `secondaryColor` (nullable hex)
- Sin índices nuevos
- Sin cambio de `Order` / pagos
- Semántica CAT: ninguna columna nueva (`isAvailable` F1)

---

### Migración Fase 10

Nombre sugerido: `add_product_scope_sections_media`

- Enum `ProductScope` (`GLOBAL`, `LOCAL`)
- `Product.scope` default GLOBAL, `ownerProviderId` nullable, `category` nullable
- Índices únicos **parciales** de `slug` (SQL raw)
- Model `ProviderSection` (`name`, `nameNormalized`, `sortOrder`)
- `ProviderProduct.sectionId`, `ProviderProduct.imageUrl`
- Backfill: todos los Product existentes → `scope=GLOBAL`

Ver [`../fase-10/data-model/DB-products.md`](../fase-10/data-model/DB-products.md).

---

## Despliegue sugerido

```mermaid
flowchart LR
  User["Usuario"] --> App["Next.js App + API Routes"]
  App --> PG["PostgreSQL Managed"]
  App --> Redis["Upstash Redis"]
  App --> Inngest["Inngest"]
  App --> Disk["UPLOADS_DIR volumen"]
  Inngest --> Resend["Resend"]
  Inngest --> WA["WhatsApp Cloud Should"]
  User --> OSM["Teselas OSM o CDN"]
```

F10 media **requiere** proceso Node con disco persistente (Docker/VPS). Un deploy Vercel **sin** volumen no cumple ADR-032.

| Componente | Servicio sugerido |
|------------|-------------------|
| Frontend + API | Docker / VPS Node 20+ (Vercel serverless **no** para uploads F10) |
| Base de datos | Neon / Supabase / Railway / Postgres Docker |
| Archivos | Volumen `UPLOADS_DIR` |
| Rate limit | Upstash Redis |
| Jobs | Inngest Cloud |
| Email | Resend |
| Imágenes | Disco local (ADR-032). Cloudinary histórico no Must |
| Mapas | OpenStreetMap tiles (local/QA) o CDN `NEXT_PUBLIC_OSM_TILE_URL` |
| WhatsApp | Meta Cloud API (Should, sandbox) |
| DNS | Cloudflare o registrar del dominio |

### Build

```bash
npm run build    # next build
npm start        # next start (producción)
```

Dependencias npm Fase 2 históricas: `resend`, `cloudinary` (esta última **no** Must F10 para uploads nuevos; `file-type` o equivalente para magic bytes).  
Dependencias npm Fase 4: `@upstash/redis` (**Must en lockfile F6**, DEV-P0-001), `inngest` (ya instalado).  
Dependencias npm Fase 5 (FE mapa): `leaflet`, `react-leaflet` (idea ADR-020; cluster opcional Should). **Retirar** `@vis.gl/react-google-maps` / loader Google JS de `/explorar`.

### CI / regresión (Fase 6, DEV-P0-002) Must — dueño DevOps

Sin este gate **no hay READY-FOR-QA de pagos** (F6+ producto). Backend no escribe el YAML.

1. Servicio `postgres:15`.
2. `npm ci` (falla si falta `@upstash/redis` en lock — P0-001).
3. `npx prisma migrate deploy` (cadena F2→F5; DEV-P1-003). Windows: parar `next dev` antes de `prisma generate`.
4. `npx prisma db seed` (credenciales de test, no prod).
5. `npm run build` y `npm start` (puerto de QA, p. ej. 8080). **Prohibido `next dev` en CI** (compile on-demand + workers → 500).
6. Playwright contra `PLAYWRIGHT_BASE_URL` del `start`; `CI=true`.

Probes (si hay Compose/K8s): `GET /` o `GET /api/auth/session` (200 invitado). **No** inventar `/health` (SAD = roadmap; DEV-P2-008).

---

## Servicios externos

| Servicio | Uso | Fase |
|----------|-----|------|
| OpenStreetMap / Leaflet | `/explorar` teselas + SDK | 1, **restablecido F5** (ADR-020) |
| Google Maps JS | Histórico Explorar F4; **no** Must GEO. Embed reseñas = URL/Place ID | 4 (superado en mapa) |
| Resend | Email contacto y pedido | 2–4 |
| Cloudinary | Upload logo/cover/product | 2 (histórico; **aparcado** F10) |
| Disco local | `UPLOADS_DIR` logo/portada/productos | **10** |
| Upstash Redis | Rate limit contacto distribuido | 4 |
| Inngest | Worker notificaciones ≤3 retries | 4 |
| WhatsApp Cloud API | Pedido nuevo / listo (Should) | 4 |
| `wa.me` Frontend | CTA manual | 2+ (permanece) |

---

## Observabilidad

| Capacidad | Implementación | Notas |
|-----------|----------------|-------|
| Audit trail | `AuditLog` + CONTACT / MEDIA_UPLOAD / `notificationFailed` | ADR-007, ADR-015 |
| Application logs | `console` / Vercel logs / Inngest dashboard | Fallos Resend y WA |
| Rate limiting | Upstash Redis **si** el paquete está en lockfile | ADR-015, DEV-P0-001 |
| Maps | Attribution OSM; política teselas OSMF / CDN | ADR-020 |
| Health check | No dedicado; sondear session | Roadmap / DEV-P2-008 |

---

## CORS

**No requerido** — monolito same-origin.

---

## Backup y recuperación

| Aspecto | Recomendación |
|---------|---------------|
| Backups DB | Automáticos managed |
| Retención | 7 días mínimo |
| Imágenes | Backup de `UPLOADS_DIR` (rsync/snapshot del volumen) | Cloudinary ya no es Must |
| Seed | `prisma/seed.ts` |

---

## Checklist pre-deploy Fase 2 (histórico)

- [x] `DATABASE_URL`, `JWT_SECRET`, `NODE_ENV=production`
- [x] `NEXT_PUBLIC_APP_URL` correcta
- [x] `RESEND_API_KEY` + `EMAIL_FROM` (dominio verificado)
- [x] `CLOUDINARY_*` configuradas
- [x] Migración `CONTACT` / `MEDIA_UPLOAD` aplicada
- [x] `next.config` remotePatterns incluye Cloudinary
- [x] Cookie `secure` activa

## Checklist pre-deploy Fase 4

- [ ] Migración `add_reviews_addresses_notify_scale` aplicada
- [ ] Backfill `rating`/`reviewCount` reales o 0
- [ ] `UPSTASH_REDIS_REST_URL` + `TOKEN` en staging/prod
- [ ] `INNGEST_EVENT_KEY` + `SIGNING_KEY`; app registrada
- [x] ~~`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` Must~~ — **superado ADR-020 / CO-F5-001** (DEV-P1-006). No reexigir para Explorar.
- [x] ~~Leaflet retirado de `/explorar`~~ — **superado ADR-020**. Leaflet **es** el motor F5.
- [ ] Should: credenciales WhatsApp sandbox
- [ ] `.env.example` actualizado (sin secretos)

## Checklist pre-deploy Fase 5

- [ ] Migración `add_provider_brand_colors` aplicada
- [ ] `/explorar` renderiza **sin** `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- [ ] Attribution OSM visible
- [ ] Prod: teselas con política OSMF o `NEXT_PUBLIC_OSM_TILE_URL` CDN
- [ ] Leaflet / `react-leaflet` en bundle de Explorar; Google JS Maps **fuera** de esa ruta
- [ ] `.env.example` actualizado (tile URL opcional; Maps JS key no Must)
- [ ] Contraste de colores validado en servidor (no solo FE)

## Checklist pre-deploy Fase 6 (confiabilidad — antes de pagos)

- [ ] `@upstash/redis` en `package.json` **y** lockfile; `npm ci` resuelve el import (DEV-P0-001)
- [ ] CI: Postgres 15 + `migrate deploy` + `build`/`start` + Playwright; **no** `next dev` (DEV-P0-002)
- [ ] Cadena de migraciones F2→F5 aplicada en staging (DEV-P1-003 / OBS-F5-023)
- [ ] Secretos staging: Resend, Upstash, Inngest (DEV-P1-004). Cloudinary no Must F10
- [ ] Prod/staging sin Redis → contacto **503**, no 500 de módulo (DEV-P1-005)
- [ ] `JWT_SECRET` distinto por entorno; staging `NODE_ENV=production` (DEV-P1-007)
- [ ] Rutas API nuevas: `requireRole` + test RBAC (DEV-P2-011)
- [ ] **No** READY-FOR-QA de pasarela mientras P0-001 o P0-002 estén abiertos

## Checklist pre-deploy Fase 10

- [ ] Migración `add_product_scope_sections_media` aplicada (índices parciales de slug)
- [ ] `UPLOADS_DIR` definido; volumen montado en staging/prod; proceso **no** ephemeral
- [ ] `GET /api/media/...` sirve JPEG de prueba; `nosniff`
- [ ] `.env.example` incluye `UPLOADS_DIR`; Cloudinary marcado opcional/histórico
- [ ] Rutas admin envueltas en `hasModulePermission`; tests 401/403/IDOR (DEV-P2-011)
- [ ] `uploads/` en `.gitignore`
- [ ] **No** CI YAML nuevo; **no** reopen Redis F6

---

## Referencias

- SAD: [`sad.md`](./sad.md)
- Hub: [`../historial/OBSERVABILITY.md`](../historial/OBSERVABILITY.md)
- ADR-015…033: [`adrs/`](./adrs/)
- Handoff F10: [`../fase-10/handoff-backend-fase-10.md`](../fase-10/handoff-backend-fase-10.md)
- Handoff F6: [`../fase-6/handoff-backend-fase-6.md`](../fase-6/handoff-backend-fase-6.md)
- Deuda DevOps: `Agente DevOps/.../comun/deuda-fases-previas.md`
- Repo: `LaBorregaMarket/README.md`, `.env.example`
