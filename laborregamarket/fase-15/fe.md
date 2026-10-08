# F15 · FE — Legal, consentimiento, medición y caché

Fecha: 2026-10-03 · Insumo: `fase-15/ux.md` + `fase-15/be.md`

## Entregables

Rama `feat/f15-legal-cache`. Commits: `77308e1` (Serwist, Umami, CSP Report-Only), `1057046` (UI), `bd61771` (BUG-021 y «Cobrar»), `bdc0301` (BUG-022 «Guardar»), `aa01ff5` (BUG-023 y BUG-029). HEAD `aa01ff5`.

- `PublicFooter` en `/`, `/login`, `/registro`, `/registro/negocio` y `/legal/*` (`dynamic = force-dynamic`). Lee `getPublicLegalSettings()`; si faltan datos o falla la BD: «Datos del responsable en actualización».
- `/legal/[slug]` (`privacidad`, `terminos`, `cookies`): markdown del documento vigente (parser propio, sin `dangerouslySetInnerHTML`). Estados: skeleton (Suspense interno), vacío, error de BD, éxito. Otro slug: HTTP 404 (`not-found.tsx`), sin pasar por `/login`.
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
- Repetir TC-LEGAL-005 (`/legal/otra-cosa` y `/legal/noexiste` → 404, la URL no va a `/login`). En POS, con el aviso visible, el clic de «Cobrar» y el de «Guardar» en el editor de cantidad deben llegar al botón. El aviso es una barra inferior a todo el ancho (`pointer-events-none` salvo su enlace y sus botones) y el `body` reserva su altura. «Ver carrito» debe recibir el clic.
- TC-CONSENT-010: con la casilla, «Crear cuenta» hace navegación dura a `/explorar` (proveedor: `/registro/negocio`).
- Build: `npm run build` sin `--turbopack`. El service worker no se registra en `next dev`.
- Textos legales: los del seed v1, no un cuerpo escrito en el cliente.

## Pendientes

Ninguno para FE. Revisión legal de los textos v1 antes de producción — Humano. Variables Umami y `db:seed:legal` por entorno — DevOps. No hay pantalla para publicar una versión nueva (API-LEGAL-04/05); el flujo de UX no la describe.

## Verificación

- `npx prisma generate` — exit 0 (Prisma Client v6.19.3). El primer intento fue EPERM; se detuvo el node del puerto 8080 y el reintento pasó.
- `npx tsc --noEmit` — exit 0.
- `npm run lint` — exit 0 (warnings previos; 0 errores).
- `npm test` — exit 0. 89 archivos, 446 tests.
- `npm run build` — exit 0 (Next.js 15.5.22, webpack; Serwist empaquetó `/sw.js`). `/legal/[slug]` sigue dinámica.

## Bugs

Ninguno abierto para FE.

## Fixes

| BUG-NNN | archivos | commit | re-prueba local |
|---------|----------|--------|-----------------|
| BUG-021 | `src/app/legal/[slug]/page.tsx`, `src/app/not-found.tsx` (se quitó `loading.tsx`) | `bd61771` | `/legal/otra-cosa` y `/legal/noexiste` responden 404 y no redirigen a `/login` |
| BUG-022 | `src/hooks/useStickyCtaHeight.ts`, `src/components/legal/CookieNotice.tsx`, `src/app/globals.css` | `bd61771` | En POS el aviso no cubre «Cobrar»; el clic no lo intercepta |
| BUG-022 | `src/components/legal/CookieNotice.tsx`, `src/components/pos/PosPageClient.tsx`, `src/app/carrito/CartPageClient.tsx`, `src/app/fruteria/[id]/FruteriaDetailClient.tsx`, `src/components/fruteria/ContactCTA.tsx` | `bdc0301` | Aviso en `z-30` fijo abajo a la derecha; no solapa «Guardar» ni «Cobrar»; el clic de «Guardar» llega |
| BUG-023 | `src/components/legal/CookieNotice.tsx`, `src/app/globals.css` | `aa01ff5` | Barra inferior a todo el ancho. `pointer-events-none` en el aviso; `pointer-events-auto` solo en «Política de Cookies», «Entendido» y «Desactivar medición». El `body` reserva `--cookie-notice-h`. El hit-test de «Ver carrito» no lo recibe el aviso. |
| BUG-024 | — | — | no es regresión F15. Spec HP-POS-015. `PosPageClient` llama `crypto.randomUUID()` al crear el ref; el mismo llamado está en `main` @ `1aeac1c`. El heading es `global-error.tsx` («Algo salió mal»). Esta rama solo añadió el alto del sticky y `z-40`. |
| BUG-027 | — | — | no es regresión F15. HP-DASH-09: el botón `getByRole("button", { name: /descargar pdf/i })` lo pinta `DocumentActions` porque `ReportsView` pasa `showPdf`; ese archivo no está en el diff de la rama. HP-DASH-01: el conteo sale de `DashboardPageClient` (`kpis.*.orderCount`); F15 no lo tocó. |
| BUG-028 | — | — | no es regresión F15. HP-GEO-23c: con `lat=33&lng=-99`, `alreadyHasUrlPin` es true y no corre `router.replace` hacia `25.7475`. Igual en `main` @ `1aeac1c` (`ExplorePageClient`). HP-EXPLORE-07: el diálogo con el enlace «Ver frutería» sigue en `ProviderPreviewPopover`; `ProviderCard` no cambió en esta rama. Si el hover no llegaba, era el hit-test del aviso (BUG-023). |
| BUG-029 | `src/app/registro/RegisterPageClient.tsx` | `aa01ff5` | Con la casilla, «Crear cuenta» hace `window.location.assign("/explorar")`. Si aún no hay versión, reintenta `GET /api/legal/current`. Proveedor va a `/registro/negocio`. |
| BUG-030 | — | — | no es regresión F15. Selectores ausentes también en `main` @ `1aeac1c`: TC-ADM-030 / HP-MED-02 admin — heading `/catálogo global/i` (el formulario dice «Alta de producto GLOBAL»); HP-CAT-02 — texto exacto «Solo este negocio» (`ScopeBadge` dice `LOCAL`); HP-MED-01/02 — `/máx 20 MB/` (el copy es «máx 5MB»); HP-BRAND-01 — `#brand-primary` y heading «Colores de tu marca» están en `/proveedor/perfil`, el spec abre `/proveedor`; HP-REV-04 — «Requiere verificación de tu negocio» está en el perfil, no en `/proveedor`; HP-REG-01 — enlace `/encargar/i` solo con ítems en el carrito; EC-04 — «+ Venta rápida» sí está en el vacío del POS y F15 no lo quitó; HP-CAT-01b — toast `/ya no está disponible/i` en `CartPageClient`, lógica sin cambio; TC-F11-104 — `ProviderTableF10` sigue mostrando `businessName`. HP-CAT-01: `goto /login` con `ERR_ABORTED` porque el logout hace `window.location.assign("/")` tras el POST y el spec no espera la URL `/`. No reescribí esas pantallas. |
