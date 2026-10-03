# F15 · FE — Legal, consentimiento, medición y caché

Fecha: 2026-10-03 · Insumo: `fase-15/ux.md` + `fase-15/be.md`

## Entregables

Rama `feat/f15-legal-cache`. Commits: `77308e1` (Serwist, Umami, CSP Report-Only), `1057046` (UI). HEAD `1057046`.

- `PublicFooter` en `/`, `/login`, `/registro`, `/registro/negocio` y `/legal/*` (`dynamic = force-dynamic`). Lee `getPublicLegalSettings()`; si faltan datos o falla la BD: «Datos del responsable en actualización».
- `/legal/[slug]` (`privacidad`, `terminos`, `cookies`): markdown del documento vigente (parser propio, sin `dangerouslySetInnerHTML`). Estados: skeleton (`loading.tsx`), vacío, error de BD, éxito. Otro slug: 404.
- `ConsentCheckbox` en registro (`acceptLegal`, `termsVersion`, `privacyVersion`) y alta de negocio (`acceptTerms`, `termsVersion`, `whatsappOrderOptIn`). El envío no se deshabilita por la casilla.
- `PrivacyMicrocopy` en guardar dirección, geolocalización (Explorar y panel) y WhatsApp.
- `CookieNotice` + `MeasurementPreferencesDialog` e inline en `/legal/cookies#preferencias`. Llave `localStorage["lbm_measurement"]` (`on` | `off`; otro valor = ausente). Con `off` también `umami.disabled=1`.
- `UmamiScript` solo si hay `NEXT_PUBLIC_UMAMI_SRC` y `NEXT_PUBLIC_UMAMI_WEBSITE_ID`, la medición no está en `off` y no hay DNT ni GPC. Eventos `explore_search`, `provider_view`, `contact_click`, `cart_add`, `register_success`, `login_success` sin PII.
- Serwist (`src/app/sw.ts`): precache de `/_next/static` y `/brand`; `GET /api/media/*` CacheFirst `lbm-media-v1` (solo 200, 300 entradas, 7 días). HTML y el resto de `/api` sin handler (red). Logout y login con navegación dura; logout borra `lbm-media-*`, el carrito de sesión y el preview en memoria.
- `/admin`: alerta si `isComplete` es falso; tab Legal solo con permiso `LEGAL`; `?tab=legal` sin permiso muestra `ErrorBanner`. Domicilio en un solo `address`.
- Perfil: bloque «Avisos de pedidos» (`whatsappOrderOptIn`). El switch de capacidades pasó a «Contacto por WhatsApp».
- Home: «precios que publica cada una» e «Información clara».
- Should cubiertos por el contrato: diálogo de re-aceptación (`pendingConsents` + `POST /api/auth/consents`) y `Content-Security-Policy-Report-Only` (Umami, OSM, Nominatim, Cloudinary, Unsplash, `worker-src 'self'`).

## Para el siguiente rol

**QA:**
- Cuentas demo de siempre (login). Tras `npm run db:seed:legal`, registro y alta exigen la versión vigente; sin seed el API responde 503.
- Footer solo en `/`, `/login`, `/registro`, `/registro/negocio`, `/legal/*`.
- Casillas nacen sin marcar. Error en línea: «Debes aceptar los Términos para continuar».
- Cookies: sin llave se ve el aviso y la medición sigue activa; «Entendido» guarda `on`; «Desactivar medición» guarda `off` y no debe cargar Umami. DNT o GPC tampoco lo cargan.
- `/admin?tab=legal` con un ADMIN que tenga módulo `LEGAL`. Sin permiso: 403 en el banner, tab oculta.
- Proveedor: Perfil → «Avisos de pedidos». Sin teléfono de 10 dígitos el switch queda deshabilitado.
- Logout vuelve a `/` con navegación dura. Login también.
- Build: `npm run build` sin `--turbopack`. El service worker no se registra en `next dev`.
- Textos legales: los del seed v1, no un cuerpo escrito en el cliente.

## Pendientes

Ninguno para FE. Revisión legal de los textos v1 antes de producción — Humano. Variables Umami y `db:seed:legal` por entorno — DevOps. No hay pantalla para publicar una versión nueva (API-LEGAL-04/05); el flujo de UX no la describe.

## Verificación

- `npx prisma generate` — exit 0 (Prisma Client v6.19.3; sin EPERM).
- `npx tsc --noEmit` — exit 0.
- `npm run lint` — exit 0 (warnings previos; 0 errores).
- `npm test` — exit 0. 89 archivos, 446 tests.
- `npm run build` — exit 0 (Next.js 15.5.22, webpack; Serwist empaquetó `/sw.js`). `/`, `/login`, `/registro`, `/registro/negocio` y `/legal/[slug]` quedaron dinámicas.

## Bugs

Ninguno.

## Fixes

Ninguno.
