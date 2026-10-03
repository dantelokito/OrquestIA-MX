# F15 · Arch — Blindaje legal, analítica y caché

Fecha: 2026-10-03 · Insumo: `fase-15/pm.md` · Código: `feat/f15-legal-cache` @ `caaedba` (base `main` @ `1aeac1c`)

## Entregables

### Decisiones

| ADR | Decisión |
|-----|----------|
| [ADR-042](../comun/adrs/ADR-042-documentos-legales-consentimiento.md) | `LegalSettings` fila única + `LegalDocument` inmutable por versión + `UserConsent`; módulo RBAC `LEGAL`; opt-in WhatsApp en `Provider` |
| [ADR-043](../comun/adrs/ADR-043-cache-sw-redis.md) | Serwist con allowlist (precache estáticos y `/brand`, CacheFirst `/api/media`, resto NetworkOnly); Redis cache-aside fail-open en `GET /api/providers` y `GET /api/providers/[id]` |
| [ADR-044](../comun/adrs/ADR-044-analitica-umami.md) | Umami sin cookies, DNT, opt-out en `localStorage`, `track()` con allowlist; CSP en Report-Only (Should) |

**Deltas al PM (`CO-F15-001`…`003`):**

- `CO-F15-001` — `GET /api/catalogs` **no** se cachea en Redis: es solo ADMIN (`requireRole(ADMIN)` + permiso de módulo), no un GET público. US-CACHE-02 queda en `GET /api/providers` y `GET /api/providers/[id]`. TTL final: 30 s listado, 60 s detalle.
- `CO-F15-002` — Con `lat`/`lng`, el servidor redondea a 3 decimales **antes** de calcular; `distanceKm` sale del centro redondeado (error ≤ ~80 m). Sin cambio de shape.
- `CO-F15-003` — Proxy de Nominatim (Should) **no entra en F15**: hoy se llama desde el navegador solo al confirmar una búsqueda (`geocodeAddress`, `limit=1`), volumen bajo y dentro de la política de 1 req/s. Se declara OSM/Nominatim como remisión en el Aviso de Privacidad. Teselas OSM: se mantiene la atribución visible (ADR-020).

### DB (Prisma)

Migraciones sugeridas, **en este orden** (PostgreSQL no permite usar un valor de enum en la misma transacción en que se agrega):

1. `20261003000000_f15_legal_module_enum` — solo `ALTER TYPE "SystemModule" ADD VALUE 'LEGAL';`
2. `20261003000100_f15_legal_consent` — enums, tablas, columnas en `providers`, `INSERT` de `modules` (`LEGAL`, "Legal", "Datos del responsable y documentos legales") + `role_permissions` ADMIN con los 4 permisos en `true` (`ON CONFLICT DO NOTHING`) + `INSERT INTO legal_settings (id) VALUES (1)`.

#### DB-LegalSettings (nueva, `legal_settings`)

| Campo | Tipo | Notas |
|-------|------|-------|
| `id` | `Int @id @default(1)` | `CHECK (id = 1)` en SQL |
| `personType` | `LegalPersonType?` (`FISICA`, `MORAL`) | `person_type` |
| `legalName` | `String?` | Nombre o razón social |
| `rfc` | `String?` | Opcional; 12 (moral) o 13 (física) alfanum., mayúsculas |
| `address` | `String?` | Domicilio completo en **un solo texto** (10–300); no se parte en calle/colonia/CP |
| `arcoEmail` | `String?` | `arco_email` |
| `phone` | `String?` | 10 dígitos |
| `effectiveAt` | `DateTime? @db.Date` | Fecha de vigencia de los datos |
| `updatedById` | `String?` | FK `User` `onDelete: SetNull` |
| `updatedAt` | `DateTime @updatedAt` | |

Obligatorios para `isComplete`: `personType`, `legalName`, `address`, `arcoEmail`, `phone`, `effectiveAt`.

#### DB-LegalDocument (nueva, `legal_documents`)

| Campo | Tipo | Notas |
|-------|------|-------|
| `id` | `String @id @default(cuid())` | |
| `type` | `LegalDocumentType` (`PRIVACY`, `TERMS`, `COOKIES`) | |
| `version` | `Int` | 1, 2, … por `type` |
| `title` | `String` | |
| `content` | `String @db.Text` | Markdown restringido (ADR-042) |
| `effectiveAt` | `DateTime` | Vigente si `<= now()` |
| `publishedAt` | `DateTime @default(now())` | Inmutable |
| `createdById` | `String?` | FK `User` `onDelete: SetNull`; `null` en seed |

`@@unique([type, version])`, `@@index([type, effectiveAt])`. Nunca UPDATE ni DELETE.

#### DB-UserConsent (nueva, `user_consents`)

| Campo | Tipo | Notas |
|-------|------|-------|
| `id` | `String @id @default(cuid())` | |
| `userId` | `String` | FK `User` `onDelete: Cascade` |
| `documentId` | `String` | FK `LegalDocument` `onDelete: Restrict` |
| `documentType` | `LegalDocumentType` | Copia para consulta sin join |
| `version` | `Int` | Copia |
| `source` | `ConsentSource` (`REGISTER`, `PROVIDER_ONBOARDING`, `RELOGIN`) | |
| `acceptedAt` | `DateTime @default(now())` | |

`@@unique([userId, documentId, source])`, `@@index([userId, documentType])`. Sin IP, sin user-agent.

#### DB-Provider (delta)

- `whatsappOrderOptIn Boolean @default(false) @map("whatsapp_order_opt_in")` — distinto de `whatsappEnabled`. Existentes quedan `false` (sin backfill).
- `whatsappOrderOptInAt DateTime? @map("whatsapp_order_opt_in_at")` — evidencia para Meta; `now()` al activar, `null` al desactivar.

#### DB-SystemModule (delta)

- Valor `LEGAL`. `prisma/seed.ts` agrega la fila de `Module` y permisos ADMIN (idempotente).

#### Seed legal

`prisma/seed-legal.ts` (idempotente; crea v1 de `PRIVACY`, `TERMS`, `COOKIES` con `effectiveAt = now()` solo si el `type` no tiene versiones). Script npm `db:seed:legal`. Lo llama `prisma/seed.ts` y DevOps lo corre tras `migrate deploy` (no depende de `demo-guard`). Contenido = reglas de US-LEGAL-02 con el texto "BORRADOR — sujeto a revisión legal" al inicio.

### API

Envelope ADR-003 (`{ data }`, `{ error, details? }` vía `ok`/`apiError`). Sin `/v1` (ADR-002). Validación con Zod en `src/lib/validators/legal.ts`.

#### API-LEGAL-01 · `GET /api/legal/current` (Must)

- **Auth:** pública. No se cachea en Redis ni en el SW.
- **200:** `{ data: { settings: { personType, legalName, address, arcoEmail, phone, effectiveAt, isComplete }, documents: [{ type, version, title, effectiveAt }] } }`. Campos faltantes = `null`. `documents` solo trae los vigentes (0 a 3). Sin `rfc` ni `updatedById`.
- **Errores:** 500 `{ error: "Error interno" }`.
- Uso: el formulario de `/registro` y `/registro/negocio` obtiene `termsVersion`/`privacyVersion`. Footer y páginas `/legal/*` leen los mismos servicios directo en el server component (sin fetch HTTP).

#### Páginas SSR (sin API)

- `/legal/[slug]` con `slug ∈ { privacidad → PRIVACY, terminos → TERMS, cookies → COOKIES }`; otro slug → `notFound()` (404). Sin versión vigente → "Documento en actualización" + `arcoEmail` si existe.
- Servicio `src/lib/services/legal.service.ts`: `getPublicLegalSettings()`, `getCurrentDocument(type)`, `getCurrentVersions()`. Errores de BD se atrapan y devuelven `null` (footer "en actualización", nunca 500).

#### API-LEGAL-02 · `GET /api/admin/legal/settings` (Must)

- **Auth:** `requireAdminModule(request, SystemModule.LEGAL, "view")` → 401 sin sesión, 403 rol/permiso.
- **200:** `{ data: { personType, legalName, rfc, address, arcoEmail, phone, effectiveAt, isComplete, missingFields: string[], updatedAt } }`.

#### API-LEGAL-03 · `PUT /api/admin/legal/settings` (Must)

- **Auth:** `requireAdminModule(..., LEGAL, "edit")`.
- **Body (Zod, `.strict()`):**

  | Campo | Regla |
  |-------|-------|
  | `personType` | `enum FISICA \| MORAL` |
  | `legalName` | `string` trim 2–200 |
  | `rfc` | opcional/`null`; `^[A-ZÑ&0-9]{12,13}$` tras `toUpperCase()`; 12 si `MORAL`, 13 si `FISICA` |
  | `address` | `string` trim 10–300 |
  | `arcoEmail` | `string().email()` ≤ 254 |
  | `phone` | 10 dígitos tras quitar espacios/guiones (`lib/phone.ts`) |
  | `effectiveAt` | `YYYY-MM-DD` válida |

- **200:** mismo shape que API-LEGAL-02.
- **Efecto:** `update` de `id = 1` + `writeAuditLog({ module: LEGAL, action: UPDATE, entityId: "1", userId, details: { before, after } })` en la misma transacción.
- **Errores:** 400 `{ error: "Validation failed", details: [{ field, message }] }` sin escribir nada; 401; 403; 500.

#### API-LEGAL-04 · `POST /api/admin/legal/documents` (Should)

- **Auth:** `requireAdminModule(..., LEGAL, "create")`.
- **Body:** `{ type: PRIVACY|TERMS|COOKIES, title: 2–200, content: 50–100 000, effectiveAt: ISO datetime >= now - 1 min }`.
- **201:** `{ data: { id, type, version, title, effectiveAt, publishedAt } }`. `version = max(version del type) + 1` en transacción; colisión del único → 409 `{ error: "Otra versión se publicó al mismo tiempo; reintenta" }`.
- **Efecto:** `AuditLog` `LEGAL`/`CREATE` con `{ type, version }` (sin contenido).
- **Errores:** 400, 401, 403, 409.

#### API-LEGAL-05 · `GET /api/admin/legal/documents?type=&page=&limit=` (Should)

- **Auth:** `LEGAL` `view`. Paginado ADR-004 (default 20, máx 50), orden `type, version desc`. **200:** `{ data: [{ id, type, version, title, effectiveAt, publishedAt, consentCount }], meta }`.

#### API-AUTH-15-01 · `POST /api/auth/register` (delta Must)

- **Body:** agrega `acceptLegal: z.literal(true)`, `termsVersion: z.number().int().positive()`, `privacyVersion: z.number().int().positive()`. Resto igual.
- **Validación servidor:** las versiones deben ser las **vigentes** de `TERMS` y `PRIVACY`. Si no: 400 `details: [{ field: "termsVersion" | "privacyVersion", message: "La versión ya no está vigente; recarga la página" }]`. `acceptLegal` ausente o `false` → 400 `details: [{ field: "acceptLegal", message: "Debes aceptar los Términos para continuar" }]`.
- **Efecto:** `prisma.$transaction`: `user.create` + `userConsent.createMany` (2 filas, `source: REGISTER`). Si falla cualquiera, no hay usuario.
- **Errores nuevos:** 503 `{ error: "Registro temporalmente no disponible" }` si no hay `TERMS` o `PRIVACY` vigente. Se conservan 409 (email), 429 y 503 (rate limit).
- **201:** sin cambio de shape.

#### API-PROV-15-01 · `POST /api/providers` (delta Must)

- **Body (`createProviderSchema`):** agrega `acceptTerms: z.literal(true)`, `termsVersion: int positivo`, `whatsappOrderOptIn: z.boolean().default(false)`.
- **Efecto:** transacción: `provider.create` (con `whatsappOrderOptIn` y `whatsappOrderOptInAt = now()` si `true`) + `userConsent.createMany({ skipDuplicates: true })` para `TERMS` con `source: PROVIDER_ONBOARDING`. Luego `invalidateProviderCache([id])`.
- **Errores:** 400 por `acceptTerms` o versión no vigente (mismos mensajes que API-AUTH-15-01); 503 si no hay `TERMS` vigente; resto sin cambio (401, 403, 409).
- **201:** agrega `whatsappOrderOptIn`.

#### API-PROV-15-02 · `PATCH /api/provider/me` (delta Must) y `GET` de perfil

- **Body (`patchProviderSettingsSchema`):** agrega `whatsappOrderOptIn: z.boolean().optional()`. `true` → `whatsappOrderOptInAt = now()` (solo si antes era `false`); `false` → `null`.
- **200:** el DTO de perfil (el mismo que hoy lee `whatsappEnabled`) agrega `whatsappOrderOptIn`. Activar el opt-in sin teléfono válido no es error: se guarda, y el envío se omite como hoy.

#### API-NOTIFY-15-01 · worker `notify-order-created` (delta Must, sin ruta)

- Antes de `sendNewOrderWhatsApp`: si `!order.provider.whatsappOrderOptIn` → no llamar y **no** escribir `notificationFailed`. Correo sin cambio.

#### API-CACHE-15-01 · `GET /api/providers` y `GET /api/providers/[id]` (delta Must)

- Contrato de respuesta idéntico (+ `CO-F15-002`). Header `X-Cache: HIT | MISS | BYPASS`.
- Llaves, TTL, fail-open e invalidación según ADR-043. Validación de query **antes** de leer caché (un 400 nunca se cachea).

#### API-CONSENT-15-01 · re-aceptación (Should)

- `GET /api/auth/session` agrega `pendingConsents: [{ type, version, title }]` para cualquier rol autenticado (TERMS/PRIVACY vigentes sin `UserConsent` del usuario). Vacío si está al día.
- `POST /api/auth/consents` — sesión requerida (401). Body `{ documents: [{ type: TERMS|PRIVACY, version }] }` (1–2, versiones vigentes) → 201 `{ data: { pendingConsents: [] } }`; `source: RELOGIN`, `skipDuplicates`. 400 si la versión no es vigente.
- FE muestra un diálogo bloqueante solo en zonas autenticadas mientras haya pendientes.

#### API-AUDIT-15-01 · purga de IP (Should, sin ruta)

- Función Inngest `audit-ip-purge`, cron diario `0 9 * * *` UTC: `auditLog.updateMany({ where: { createdAt: { lt: now - 365 días }, ipAddress: { not: null } }, data: { ipAddress: null } })`. Sin índice nuevo (volumen bajo). El rate limit ya expira por TTL en Redis (15 min / 1 h).

## Para el siguiente rol

**BE (orden):**
1. Migración 1 (enum) → migración 2 (tablas, columnas, `Module`/`RolePermission`, fila `legal_settings`) → `prisma generate` → `seed-legal.ts` + `db:seed:legal`.
2. `legal.service.ts` + validators + API-LEGAL-01…03; `/legal` en `PUBLIC_PATHS` de `src/middleware.ts`.
3. API-AUTH-15-01 y API-PROV-15-01 en transacción; API-PROV-15-02; API-NOTIFY-15-01.
4. `src/lib/cache/public-cache.ts` + API-CACHE-15-01 + llamadas a `invalidateProviderCache` (lista abajo).
5. Should: API-LEGAL-04/05, API-CONSENT-15-01, `audit-ip-purge`, CSP Report-Only.

**Invalidación obligatoria** (después del commit, `try/catch` sin propagar): `POST /api/providers`; `PATCH /api/provider/me`; `PATCH /api/provider/products`; `PATCH /api/provider/products/by-product/[productId]` y `/price`, `/archive`, `/restore`; `POST /api/provider/products/[providerProductId]/image`; `POST /api/provider/local-products`, `PATCH /api/provider/local-products/[id]`; `POST /api/provider/sections`, `PATCH|DELETE /api/provider/sections/[id]`, `PATCH /api/provider/sections/reorder`; `POST /api/provider/media`; `PATCH /api/admin/providers/[id]`; `PATCH /api/admin/products/[id]` y `POST .../image` (ids = `providerId` distintos con ese `productId`); `DELETE /api/admin/reviews/[id]` y `POST /api/orders/[id]/reviews` (rating). **No** invalidan: inventario, pedidos, POS, `provider/active`.

**FE:**
- `/`, `/login`, `/registro`, `/registro/negocio`, `/legal/[slug]`: `export const dynamic = "force-dynamic"` (si se prerenderiza, el footer quedaría congelado en "en actualización").
- `PublicFooter` = server component con `getPublicLegalSettings()`; enlaces `<a>`; "Preferencias de medición" abre el diálogo cliente.
- Casillas sin marcar; enviar `acceptLegal`/`acceptTerms` + versiones de API-LEGAL-01; mostrar `details` por campo.
- Serwist según ADR-043 (**prohibido** `defaultCache`); logout y login con navegación dura y limpieza de cachés/almacenamiento.
- Umami y `track()` según ADR-044; eventos sin PII (nunca `q`, coords, `userId`). No se inyecta con DNT=1 ni con `navigator.globalPrivacyControl === true`.
- Preferencia de medición = **una sola llave** `localStorage["lbm_measurement"]`: ausente → aviso pendiente y medición activa; `"on"` → «Entendido» o reactivada (aviso no vuelve); `"off"` → desactivada (aviso no vuelve, sin script). Con `"off"` escribir también `localStorage["umami.disabled"] = "1"`; con `"on"` borrarla. Otro valor = ausente. Todo acceso en `try/catch` (sin `localStorage`: aviso en cada visita, elección solo en memoria).
- Opt-in WhatsApp del proveedor: campo `whatsappOrderOptIn` (boolean) en `POST /api/providers`, `PATCH /api/provider/me` y el DTO de perfil. No confundir con `whatsappEnabled`.
- Domicilio del responsable en `/admin`: un solo campo `address` (textarea), sin subcampos.
- Markdown legal con parser propio (sin `dangerouslySetInnerHTML`, sin dependencia nueva).

**Invariantes:** nunca 5xx por Redis; nunca cachear 4xx/5xx ni respuestas con `Set-Cookie`; `LegalDocument` nunca se edita; `UserConsent` nunca guarda IP; registro sin consentimiento = sin usuario; `whatsappEnabled` no cambia de significado.

**No tocar:** `User.whatsappOptIn`, rate limit de auth (sigue fail-closed en prod), `/api/admin/analytics`, `GET /api/catalogs`, rama Dependabot Prisma 7.

## Pendientes

- Textos legales v1 son borrador IA: revisión de abogado antes de producción — Humano (gate DevOps).
- `db:seed:legal` tras `migrate deploy` en cada entorno; sin él el registro responde 503 — DevOps.
- `NEXT_PUBLIC_UMAMI_SRC`, `NEXT_PUBLIC_UMAMI_WEBSITE_ID` (y opcional `NEXT_PUBLIC_UMAMI_DOMAINS`) por entorno — DevOps.
- Confirmar `CO-F15-001`…`003` — PM/Humano (no bloquean a BE).
- `LaBorregaMarket/.env.example`: agregar `NEXT_PUBLIC_UMAMI_*` y `PUBLIC_CACHE_DISABLED` (bypass de caché, ADR-043) — BE.

## Verificación

- `comun/adrs/`: nuevos ADR-042, ADR-043, ADR-044.
- `comun/sad.md`: versión 0.15.0 (diseño), §1 resumen F15, §3 stack (Serwist, Umami), §5 módulos `LEGAL`/`CACHE`/`ANALYTICS`, §6.23, §7 entidades nuevas, §8 fila F15, §9 filas Privacidad/Caché, §10 ADR-042…044, §12 F15.
