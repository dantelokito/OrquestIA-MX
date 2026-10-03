# F15 · PM — Blindaje legal, analítica y caché

Fecha: 2026-10-03 · Insumo: requerimiento humano + plan aprobado `fase_15_legal_cache` (secciones 2, 3 y 4) · App: `main` @ `1aeac1c`, rama `feat/f15-legal-cache`

## Entregables

### PRD

- **Objetivo:** cumplir lo mínimo exigible en México (LFPDPPP 2025, LFPC art. 76 bis / 7 bis / 32, Código de Comercio) para operar el marketplace en público, medir uso sin cookies y acelerar la experiencia de usuarios recurrentes sin filtrar datos entre sesiones.
- **Must:** footer legal público (home, login, registro); páginas `/legal/privacidad`, `/legal/terminos`, `/legal/cookies`; datos del responsable en BD editables por ADMIN; documentos legales versionados y registro de aceptación; casilla obligatoria en registro de cliente y alta de negocio; aviso simplificado en direcciones, geolocalización y contacto WhatsApp; opt-in de WhatsApp del proveedor; mayoría de edad; aviso informativo de cookies con opción de desactivar la medición; Umami sin cookies; service worker solo para estáticos e imágenes; Redis en GET públicos con invalidación por cambio de precio.
- **Should:** re-aceptación de la nueva versión en el siguiente login; header CSP con el dominio de Umami; corregir copy del home ("precios en tiempo real", "Seguro y auditado"); publicar nueva versión de documento desde `/admin`; purga automática de IP en `AuditLog`.
- **Won't (F15):** autoservicio ARCO (borrar/exportar cuenta; el canal es el correo ARCO); casilla de marketing; PWA offline; cumplimiento RGPD; banner opt-in bloqueante; GA4 / PostHog / Sentry; datos del responsable en variables de entorno; caché de HTML o de `/api/*` autenticado; caché Redis de `GET /api/catalogs` (solo ADMIN, `CO-F15-001`); proxy de Nominatim en servidor (deuda, `CO-F15-003`); pagos, PCI DSS y obligaciones fiscales de plataformas (BL-040, LISR 113-A, LIVA); merge de la rama Dependabot Prisma 7 durante la fase.
- **Módulos afectados:** LEGAL (nuevo), CONSENT (nuevo), COOKIE (nuevo), ANALYTICS (nuevo), CACHE (nuevo), AUTH (registro), PROF (opt-in WhatsApp), ADMIN (RBAC nuevo módulo), NOTIFY (WhatsApp al proveedor), EXPLORE (aviso geolocalización).
- **Gate humano:** los textos legales son borrador generado con IA; ningún despliegue a producción sin revisión de abogado mexicano (DevOps lo bloquea).

### User stories

#### US-LEGAL-01 · Footer legal público

Como visitante, quiero ver en el pie de página los enlaces legales y los datos del responsable, para saber quién trata mis datos y bajo qué condiciones antes de registrarme.

- **Dado** que un invitado abre `/`, `/login` o `/registro`, **cuando** la página carga, **entonces** ve el componente `PublicFooter` con enlaces a Aviso de Privacidad, Términos y Condiciones, Política de Cookies, "Preferencias de medición" y el bloque del responsable (nombre o razón social, domicilio, correo ARCO, teléfono).
- **Dado** que en `DB-LegalSettings` falta cualquier campo obligatorio, **cuando** se renderiza el footer, **entonces** el bloque del responsable muestra "Datos del responsable en actualización" y los enlaces legales siguen funcionando.
- **Dado** que la lectura de `DB-LegalSettings` falla (BD caída), **cuando** se renderiza el footer, **entonces** la página no rompe y se muestra el mismo texto "en actualización".
- Reglas: los enlaces son `<a>` navegables sin JavaScript; el footer no aparece en paneles autenticados (`/proveedor`, `/admin`) salvo decisión UX; contraste y tamaño según tokens vigentes.

#### US-LEGAL-02 · Páginas legales públicas

Como visitante, quiero leer el Aviso de Privacidad, los Términos y la Política de Cookies sin iniciar sesión, para decidir si uso la plataforma.

- **Dado** un invitado sin cookie de sesión, **cuando** abre `/legal/privacidad`, `/legal/terminos` o `/legal/cookies`, **entonces** recibe 200 con el contenido de la versión vigente, su número de versión y la fecha de vigencia, sin redirección a `/login` (`/legal` en `PUBLIC_PATHS` del middleware).
- **Dado** que se abre `/legal/otra-cosa`, **cuando** la ruta no existe, **entonces** se muestra 404.
- **Dado** que no hay versión publicada de un documento, **cuando** se abre su página, **entonces** se muestra "Documento en actualización" y el correo ARCO si existe.
- Reglas de contenido (borrador, sujeto a abogado):
  - **Aviso de Privacidad integral:** identidad y domicilio del responsable (desde `DB-LegalSettings`); datos recabados (identificación, contacto, ubicación aproximada y direcciones, IP en bitácora y rate limit); finalidades primarias y secundarias; que no se recaban datos patrimoniales ni sensibles; transferencias y remisiones a encargados (Neon/hosting, Upstash, Resend, Inngest, Meta WhatsApp, OpenStreetMap/Nominatim, Cloudinary, Umami); medio ARCO (correo) y plazo de respuesta legal; plazo de conservación de la IP (default: 12 meses en `AuditLog`, ventana del rate limit en Redis); mecanismo de cambios al aviso.
  - **Términos y Condiciones:** uso exclusivo por mayores de 18 años o con autorización de su tutor; LaBorregaMarket es intermediario y no vende; la frutería fija precio, calidad, peso e higiene de los perecederos y responde por ellos; identidad, domicilio y teléfono del responsable (LFPC 76 bis); precios mostrados son totales e incluyen impuestos según los publique la frutería (LFPC 7 bis); aceptación electrónica registrada (Código de Comercio).
  - **Política de Cookies:** lista de cookies estrictamente necesarias (`lbm_token`, `lbm_active_provider`), `localStorage` de preferencias, que Umami no usa cookies ni datos personales, cómo desactivar la medición y cómo borrar el almacenamiento del navegador.

#### US-LEGAL-03 · Datos del responsable editables por ADMIN

Como ADMIN, quiero capturar y editar los datos del responsable desde `/admin`, para que las páginas legales y el footer muestren información vigente sin desplegar código.

- **Dado** un ADMIN con permiso en el módulo nuevo `LEGAL`, **cuando** guarda tipo de persona (física/moral), nombre o razón social, RFC (opcional), domicilio (`address`, un solo texto de 10 a 300 caracteres, sin subcampos), correo ARCO, teléfono y fecha de vigencia válidos, **entonces** se actualiza el registro único `DB-LegalSettings`, se escribe `AuditLog` (módulo `LEGAL`, acción `UPDATE`, valores anterior y nuevo) y el footer y las páginas reflejan el cambio en la siguiente carga.
- **Dado** datos inválidos (correo mal formado, teléfono distinto de 10 dígitos, RFC con formato distinto de 12/13 caracteres alfanuméricos, campo obligatorio vacío), **cuando** guarda, **entonces** recibe 400 con envelope ADR-003 y el detalle por campo, y no se modifica nada.
- **Dado** un usuario CLIENT, PROVIDER o ADMIN sin permiso `LEGAL`, **cuando** intenta leer el formulario de edición o guardar, **entonces** recibe 403 (envelope ADR-003).
- **Dado** que faltan campos obligatorios, **cuando** un ADMIN entra a `/admin`, **entonces** ve una alerta "Datos legales incompletos" con enlace al formulario.
- Reglas: existe un único registro (no se crean duplicados); sin variables de entorno para estos datos.

#### US-LEGAL-04 · Versionado de documentos y registro de aceptación

Como responsable de la plataforma, quiero que cada documento legal tenga versión y que cada aceptación quede registrada, para demostrar qué aceptó cada usuario y cuándo.

- **Dado** el despliegue de F15, **cuando** se aplica la migración y el seed, **entonces** existen `DB-LegalDocument` v1 publicados para `PRIVACY`, `TERMS` y `COOKIES` con contenido borrador.
- **Dado** un registro exitoso de cliente, **cuando** se crea el usuario, **entonces** en la misma transacción se crean `DB-UserConsent` para la versión vigente de `TERMS` y de `PRIVACY` con fecha y hora; si falla el consentimiento, no se crea el usuario.
- **Dado** que se publica una versión nueva, **cuando** un visitante abre la página legal, **entonces** ve la versión nueva; las aceptaciones previas conservan su versión original y no se sobrescriben.
- Reglas: una versión publicada no se edita, se publica otra; `UserConsent` no guarda IP.

#### US-CONSENT-01 · Casilla obligatoria en registro y alta de negocio

Como visitante que se registra, quiero aceptar expresamente los Términos y conocer el Aviso de Privacidad, para que mi aceptación sea válida.

- **Dado** el formulario de `/registro`, **cuando** se muestra, **entonces** incluye una casilla **sin marcar** con el texto "Acepto los Términos y Condiciones, declaro ser mayor de 18 años (o contar con autorización de mi tutor) y he leído el Aviso de Privacidad", con enlaces que abren las páginas en otra pestaña.
- **Dado** que el usuario no marca la casilla, **cuando** envía, **entonces** el botón no envía y se muestra el error en línea "Debes aceptar los Términos para continuar".
- **Dado** una llamada directa a la API de registro sin aceptación (o con versión inexistente), **cuando** llega, **entonces** responde 400 `VALIDATION_ERROR` con envelope ADR-003 y no crea usuario.
- **Dado** `/registro/negocio` (alta de frutería por un usuario autenticado), **cuando** envía, **entonces** exige la misma casilla para los Términos (cláusulas de la frutería como responsable de precio, calidad e higiene); sin ella la API responde 400 y no crea el `Provider`.
- Reglas: la casilla nunca viene premarcada; la aceptación se registra en `DB-UserConsent`.

#### US-CONSENT-02 · Aviso simplificado en puntos de captura

Como usuario, quiero ver para qué se usan mis datos donde los capturo, para dar un consentimiento informado.

- **Dado** el formulario de direcciones, la solicitud de geolocalización en Explorar y el botón de contacto por WhatsApp de una frutería, **cuando** se muestran, **entonces** incluyen un microcopy de una o dos líneas con la finalidad y un enlace a `/legal/privacidad`.
- **Dado** que el usuario rechaza el permiso de geolocalización del navegador, **cuando** sigue en Explorar, **entonces** puede buscar por texto o mapa sin error.
- Reglas: no se agregan casillas en estos formularios; consentimiento tácito para datos ordinarios.

#### US-CONSENT-03 · Opt-in de WhatsApp del proveedor

Como proveedor, quiero decidir si recibo avisos de pedidos por WhatsApp, para cumplir la política de Meta y no recibir mensajes que no autoricé.

- **Dado** el alta en `/registro/negocio` o la pestaña Perfil, **cuando** el proveedor ve sus notificaciones, **entonces** hay una casilla **sin marcar** "Recibir avisos de pedidos por WhatsApp al teléfono del negocio".
- **Dado** un proveedor sin opt-in, **cuando** entra un pedido nuevo, **entonces** no se envía WhatsApp (`sendNewOrderWhatsApp` se omite), sí se envía el correo y no se registra fallo de notificación por la omisión.
- **Dado** un proveedor con opt-in y teléfono válido, **cuando** entra un pedido, **entonces** se envía WhatsApp como hoy.
- **Dado** que el proveedor desactiva la casilla, **cuando** guarda, **entonces** deja de recibir WhatsApp desde el siguiente pedido.
- Reglas: el opt-in es el campo `Provider.whatsappOrderOptIn` (con fecha de activación como evidencia para Meta), distinto de `whatsappEnabled` (capacidad pública de contacto, F14); los proveedores existentes arrancan **sin** opt-in (default `false`, sin backfill) y lo activan en Perfil; el opt-in del cliente (`User.whatsappOptIn`) no cambia.

#### US-COOKIE-01 · Aviso informativo de cookies

Como visitante, quiero saber la primera vez qué almacenamiento y medición usa el sitio y poder desactivar la medición, para controlar mi privacidad.

- **Dado** un navegador sin preferencia guardada, **cuando** abre cualquier página pública, **entonces** ve un aviso no bloqueante con texto breve, enlace a `/legal/cookies`, botón "Entendido" y opción "Desactivar medición".
- **Dado** que pulsa "Entendido", **cuando** recarga, **entonces** el aviso no vuelve a mostrarse y la medición queda activa.
- **Dado** que pulsa "Desactivar medición", **cuando** navega, **entonces** no se carga el script de Umami ni se envían eventos, y la preferencia persiste en `localStorage`.
- **Dado** el enlace "Preferencias de medición" del footer, **cuando** lo pulsa, **entonces** puede reactivar o desactivar la medición.
- **Dado** que `localStorage` no está disponible (modo privado estricto), **cuando** carga la página, **entonces** el aviso se muestra en cada visita y no rompe la página.
- Reglas: la preferencia vive en una sola llave `localStorage["lbm_measurement"]`: ausente = aviso pendiente y medición activa; `"on"` = aceptado o reactivado; `"off"` = medición desactivada; cualquier otro valor cuenta como ausente. El aviso no impide navegar ni usar el sitio; no hay banner opt-in.

#### US-ANALYTICS-01 · Medición con Umami sin cookies

Como dueño del producto, quiero medir vistas y eventos clave sin datos personales, para entender el uso sin generar obligaciones de consentimiento expreso.

- **Dado** `NEXT_PUBLIC_UMAMI_WEBSITE_ID` y `NEXT_PUBLIC_UMAMI_SRC` configurados y la medición no desactivada, **cuando** el usuario navega, **entonces** se registran vistas de página y los eventos `explore_search`, `provider_view`, `contact_click`, `cart_add`, `register_success` y `login_success`.
- **Dado** que el navegador envía DNT=1 o el usuario desactivó la medición, **cuando** navega, **entonces** no se envía ningún evento.
- **Dado** que faltan las variables de entorno, **cuando** carga la app, **entonces** no se carga el script y no hay error en consola ni en la UI.
- **Dado** que el servidor de Umami no responde, **cuando** el usuario interactúa, **entonces** la app funciona igual.
- Reglas: los eventos no llevan PII (ni correo, teléfono, nombre, `userId`, texto libre de búsqueda ni coordenadas exactas); se permite `providerId` (dato público del negocio) y categorías.

#### US-CACHE-01 · Service worker solo para estáticos

Como usuario recurrente, quiero que los recursos estáticos e imágenes carguen desde caché, para que la app abra más rápido sin ver datos de otra sesión.

- **Dado** un build de producción, **cuando** el usuario vuelve al sitio, **entonces** `_next/static/*`, `/brand/*` y las imágenes GET 200 de `/api/media/*` se sirven desde el service worker (Serwist).
- **Dado** cualquier navegación HTML o cualquier otra ruta `/api/*`, **cuando** se solicita, **entonces** va siempre a la red (NetworkOnly) y nunca se guarda en caché.
- **Dado** el usuario A con sesión, **cuando** hace logout y el usuario B inicia sesión en el mismo navegador, **entonces** B no ve nombre, header, pedidos ni datos de A, y se limpiaron las cachés dependientes de usuario.
- **Dado** un nuevo despliegue, **cuando** el service worker se actualiza, **entonces** se descartan las cachés de la versión anterior.
- Reglas: sin modo offline; el service worker no se registra en desarrollo.

#### US-CACHE-02 · Caché Redis en GET públicos

Como visitante, quiero que el listado y el detalle de fruterías carguen rápido, sin ver precios desactualizados.

- **Dado** `GET /api/providers` o `GET /api/providers/[id]`, **cuando** la respuesta está en Upstash Redis y no expiró, **entonces** se sirve desde caché con el mismo contrato (`CO-F15-001`).
- **Dado** `GET /api/providers` con `lat`/`lng`, **cuando** llega, **entonces** el servidor redondea las coordenadas a 3 decimales **antes** de filtrar y calcular `distanceKm` (error ≤ ~80 m), y la respuesta conserva el mismo shape (`CO-F15-002`).
- **Dado** `GET /api/catalogs`, **cuando** llega, **entonces** no pasa por Redis: es una ruta solo ADMIN.
- **Dado** que un proveedor cambia precio, archiva u oculta un producto, edita su perfil u horarios, o un ADMIN oculta una oferta, **cuando** se confirma el cambio, **entonces** se invalidan las llaves afectadas y la siguiente lectura muestra el dato nuevo.
- **Dado** que Redis no responde, **cuando** llega el GET, **entonces** se lee de la BD y responde 200 (sin 5xx por la caché).
- Reglas: TTL de 30 s en el listado y 60 s en el detalle; solo se cachea la representación anónima; nunca se cachea una respuesta que dependa de la sesión o que lleve `Set-Cookie`.

### Change orders

#### CO-F15-001 · `GET /api/catalogs` fuera de la caché Redis

- **Motivo:** la ruta es solo ADMIN (rol + permiso de módulo), no un GET público; cachearla contradice la regla "nunca `/api` autenticado".
- **Impacto:** UX ninguno. Arch: US-CACHE-02 se limita a `GET /api/providers` y `GET /api/providers/[id]`, con TTL de 30 s en el listado y 60 s en el detalle. Datos: ninguno.
- **Opción elegida:** swap de alcance sin tiempo extra; se acepta.

#### CO-F15-002 · Redondeo de coordenadas antes de calcular

- **Motivo:** la llave de caché y el cálculo deben usar las mismas coordenadas; si no, dos usuarios con la misma llave verían distancias distintas.
- **Impacto:** UX ninguno (shape idéntico; `distanceKm` con error ≤ ~80 m). Arch: redondeo a 3 decimales en el servidor antes de filtrar y calcular. Datos: ninguno.
- **Opción elegida:** se acepta sin tiempo extra.

#### CO-F15-003 · Proxy de Nominatim fuera de F15

- **Motivo:** hoy el navegador llama a Nominatim solo al confirmar una búsqueda (`limit=1`); el volumen es bajo y respeta la política de 1 req/s.
- **Impacto:** UX ninguno. Arch: sin proxy; las teselas OSM mantienen la atribución visible (ADR-020). Legal: el Aviso de Privacidad declara OpenStreetMap/Nominatim como remisión. Pasa de Should a Won't/deuda (BL-296).
- **Opción elegida:** swap; se acepta y se reevalúa si se agrega autocompletado o crece el volumen.

## Para el siguiente rol

**UX:**
- `PublicFooter` en `/`, `/login`, `/registro` y `/registro/negocio`; páginas `/legal/*` (lectura larga, versión y fecha visibles, estado "en actualización").
- Aviso de cookies no bloqueante + diálogo "Preferencias de medición" desde el footer; 4 estados en móvil y escritorio.
- Casilla de consentimiento en registro y alta de negocio (error en línea); casilla opt-in WhatsApp en alta de negocio y Perfil.
- Microcopy de aviso simplificado en direcciones, permiso de geolocalización de Explorar y botón de contacto WhatsApp.
- `/admin`: formulario de datos del responsable y alerta "Datos legales incompletos".

**Arch:**
- Entidades nuevas `DB-LegalSettings` (registro único), `DB-LegalDocument` (tipo, versión, contenido, publicado, fecha), `DB-UserConsent` (usuario, documento, versión, fecha, sin IP); `Provider.whatsappOrderOptIn` distinto de `whatsappEnabled`; domicilio del responsable como texto único `address`; valor `LEGAL` en `SystemModule`.
- API: lectura pública de settings y documento vigente; PUT admin de settings con RBAC y `AuditLog`; contrato de registro y de `POST /api/providers` con aceptación (400 ADR-003). Sin versionar API (ADR-002).
- ADR de caché (Serwist con allowlist; NetworkOnly para HTML y `/api/*` autenticado; limpieza en logout; llaves, TTL e invalidación Redis; fail-open) y ADR de analítica (Umami, DNT, opt-out, CSP).
- Nominatim y tiles OSM: sin proxy en F15 (`CO-F15-003`); se declaran como remisión en el Aviso.
- Retención: declarar IP en `AuditLog` (default 12 meses) y rate limit; purga automática es Should.

## Pendientes

- Revisión de los textos legales por abogado mexicano antes de producción — Humano (gate en DevOps).
- Captura de los datos reales del responsable en `/admin` tras el despliegue — Humano/ADMIN.
- Crear sitio en Umami y definir `NEXT_PUBLIC_UMAMI_*` por entorno — DevOps.
- No mergear la rama Dependabot (Prisma 6.19 → 7.10) durante F15 — DevOps.
- Avisar a proveedores existentes que deben activar el opt-in de WhatsApp en Perfil para seguir recibiendo avisos — Humano.

## Verificación

- `comun/backlog.md`: nueva sección "Fase 15" (BL-280…BL-299) y cabecera sin "sin F15".
- `STATUS.md`: fase activa 15, actúa UX + Arch, fila PM.
- 2026-10-03: aceptados `CO-F15-001`…`003` de Arch; US-CACHE-02 ajustada; nombres alineados (`whatsappOrderOptIn`, `lbm_measurement`, `address`); backlog BL-292 y BL-296 actualizados; actúa BE.
