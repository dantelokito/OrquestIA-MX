# F15 · UX — Blindaje legal, consentimiento y aviso de medición

Fecha: 2026-10-03 · Insumo: `fase-15/pm.md` · App: rama `feat/f15-legal-cache` (lectura de `RegisterPageClient`, `BusinessOnboardingClient`, `ProfileCapabilitiesForm`, `ContactCTA`, `FilterBar`, `SaveAddressDialog`, `AdminPageClient`, `page.tsx`)

## Entregables

Solo se describe lo que cambia. Caché (US-CACHE-01/02) y Umami (US-ANALYTICS-01) no tienen UI propia más allá del aviso de cookies; el logout con limpieza de cachés no cambia la pantalla.

**Reglas transversales F15**

- Todo componente legal (footer, aviso, diálogo, casillas, microcopy) usa **paleta de plataforma** fija (slate/neutros), nunca `var(--brand)`: en `/registro/negocio` puede haber override de marca PROVIDER y el texto legal no debe cambiar de color por frutería.
- El aviso de cookies **no** usa CTA de marca: su botón es `bg-slate-900`, así el CTA dominante de cada pantalla sigue siendo el de la página.
- Enlaces a documentos legales desde formularios: `target="_blank" rel="noopener"` + icono `ExternalLink` 14px `aria-hidden` + `sr-only` «(abre en otra pestaña)». Desde footer y páginas legales: misma pestaña.
- Casillas: `<input type="checkbox">` nativo `h-5 w-5 accent-slate-900`, fila clicable `min-h-11`, nunca premarcadas.

---

### UF-LEGAL-01 · Visitante consulta los documentos legales

1. Invitado abre `/`, `/login`, `/registro` o `/registro/negocio`.
2. Hace scroll al final y ve `PublicFooter` (enlaces + bloque del responsable).
3. Pulsa «Aviso de Privacidad» (o Términos / Cookies) → `/legal/privacidad` en la misma pestaña, sin login.
4. Lee versión y fecha de vigencia arriba; navega por el índice (≥1024px) o por scroll (móvil).
5. Desde el pie de la página legal salta a otro documento o vuelve con «Volver al inicio».

### WF-LEGAL-01 · `PublicFooter`

**Dónde:** `/`, `/login`, `/registro`, `/registro/negocio` y `/legal/*`. **No** en `/explorar` (mapa-primero, lista paginada), `/fruteria/[id]`, `/carrito`, `/cuenta`, `/proveedor/*`, `/admin/*`. El acceso a preferencias fuera de estas rutas es `/legal/cookies` (botón en WF-LEGAL-02).

**Layout (orden):**

1. Contenedor `<footer>` `border-t border-gray-200 bg-slate-50 mt-12` · interior `max-w-7xl mx-auto px-4 py-8 sm:px-6`.
2. Fila de enlaces `<nav aria-label="Legal">`: Aviso de Privacidad · Términos y Condiciones · Política de Cookies · **Preferencias de medición** (botón).
3. Bloque responsable `<address class="not-italic">`: título `text-sm font-semibold text-slate-900` «Responsable de tus datos»; líneas `text-sm text-slate-600`: nombre o razón social, domicilio, «Derechos ARCO: {correo}» (`mailto:`), «Teléfono: {tel}» (`tel:`).
4. Línea final `text-xs text-slate-600`: «© {año} LaBorregaMarket. Intermediario entre clientes y fruterías; cada frutería responde por sus productos.»

**Responsive:** `<640px` una columna: enlaces apilados (`flex flex-col gap-1`, cada enlace `min-h-11 flex items-center`), luego responsable. `>=1024px` grid 2 columnas `lg:grid-cols-[1fr_auto]`: enlaces en fila (`flex flex-wrap gap-x-6`) a la izquierda, responsable a la derecha alineado a la izquierda.

**CTA dominante:** ninguno (zona informativa; el CTA de la página manda).

**Estados:**

| Estado | Comportamiento |
|--------|----------------|
| Loading | No aplica: footer server-rendered con la página; no hay skeleton ni spinner |
| Empty (falta un campo obligatorio de `DB-LegalSettings`) | Bloque responsable muestra solo «Datos del responsable en actualización» (`text-sm text-slate-600`, icono `Info` 16px). Enlaces siguen visibles |
| Error (lectura falla) | Igual que Empty; la página no rompe ni muestra error técnico |
| Success | Bloque completo; RFC **no** se muestra en el footer (solo en el Aviso) |

**Interacción:** enlaces `text-sm text-slate-700 underline underline-offset-2 hover:text-slate-900`; focus `focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 rounded`. «Preferencias de medición» se renderiza como `<a href="/legal/cookies#preferencias">` y con JS intercepta el clic para abrir WF-COOKIE-02 (sin JS navega). Contraste: slate-700 sobre slate-50 ≈ 9.9:1; slate-600 ≈ 7.2:1.

### WF-LEGAL-02 · Página legal `/legal/{privacidad|terminos|cookies}`

**Layout (orden):**

1. Header público existente (o autenticado si hay sesión; la ruta es pública).
2. Encabezado: H1 (`text-2xl sm:text-3xl font-bold text-slate-900`) «Aviso de Privacidad» / «Términos y Condiciones» / «Política de Cookies».
3. `LegalVersionMeta`: `text-sm text-slate-600` «Versión {n} · Vigente desde {dd de mes de aaaa}» (fecha en español, TZ Monterrey).
4. Cuerpo: `<article>` `max-w-3xl` con tipografía de lectura (`text-base leading-7 text-slate-800`, H2 `text-xl font-semibold mt-8 scroll-mt-24`, listas con viñeta, párrafos `mt-4`). Datos del responsable insertados desde `DB-LegalSettings`.
5. `>=1024px`: índice lateral `LegalToc` (`aside` sticky `top-24`, `w-64`, enlaces a cada H2, activo `font-medium text-slate-900`, resto `text-slate-600`). `<640px`: índice dentro de `<details>` «Contenido» bajo el meta, cerrado por defecto.
6. Solo en `/legal/cookies`: sección `id="preferencias"` con `MeasurementPreferences` en línea (mismo contenido que WF-COOKIE-02, sin modal) y botón «Guardar preferencia».
7. Pie: enlaces a los otros dos documentos + «Volver al inicio», y `PublicFooter`.

**CTA dominante:** ninguno en privacidad/términos (lectura). En cookies: «Guardar preferencia» (Secondary; no es una acción comercial).

**Estados:**

| Estado | Comportamiento |
|--------|----------------|
| Loading | `loading.tsx`: skeleton `animate-pulse` H1 + meta + 8 líneas de texto (`h-4 bg-slate-200 rounded`) en `max-w-3xl` |
| Empty (sin versión publicada) | `EmptyState`: icono `FileText`, título «Documento en actualización», descripción «Estamos preparando este documento.» + «Para dudas sobre tus datos escribe a {correo ARCO}» si existe. Sin índice ni meta de versión |
| Error (BD no responde) | Mismo `EmptyState` que Empty + «Intenta de nuevo en unos minutos.»; sin stack ni código |
| Success | Documento completo con versión y fecha visibles |
| 404 | `/legal/otra-cosa` → not-found existente del sitio |

**Responsive:** `<640px` `px-4`, una columna, índice en `<details>`. `>=1024px` `grid lg:grid-cols-[16rem_1fr] gap-12`, artículo `max-w-3xl`.

**Impresión:** ocultar header, footer, índice y aviso de cookies (`.no-print`); `@page { margin: 16mm; }`; versión y fecha sí se imprimen.

---

### UF-CONSENT-01 · Registro con aceptación de Términos y Aviso

1. Visitante abre `/registro` (rol Cliente o Proveedor).
2. Llena nombre, correo, contraseña.
3. Lee la casilla de consentimiento (sin marcar); opcionalmente abre Términos o Aviso en otra pestaña.
4. Pulsa «Crear cuenta».
5. Sin casilla: no se envía; error en línea bajo la casilla y foco a la casilla.
6. Con casilla: se envía; éxito → Cliente a su destino actual; Proveedor a `/registro/negocio` (UF-CONSENT-02).
7. Si la API responde 400 por consentimiento (versión inexistente): `ErrorBanner` del formulario «No pudimos registrar tu aceptación. Recarga la página e intenta de nuevo.»

### WF-CONSENT-01 · `ConsentCheckbox` en `/registro`

**Ubicación:** después del último campo y antes del `role="alert"` de error general y del botón «Crear cuenta». Aplica a ambos roles.

**Layout:** fila `flex items-start gap-3 min-h-11` · checkbox `id="consent-terms"` `mt-0.5 h-5 w-5` · `<label for="consent-terms" class="text-sm text-slate-700">`:
«Acepto los [Términos y Condiciones], declaro ser mayor de 18 años (o contar con autorización de mi tutor) y he leído el [Aviso de Privacidad].»

**Estados:**

| Estado | Comportamiento |
|--------|----------------|
| Default | Sin marcar; botón «Crear cuenta» **habilitado** (no se deshabilita: el error debe ser descubrible) |
| Error (submit sin marcar) | `aria-invalid="true"`, `aria-describedby="consent-terms-error"`; debajo `text-sm text-red-600 mt-1` con icono `AlertCircle` «Debes aceptar los Términos para continuar»; foco a la casilla; contenedor de errores `aria-live="polite"` |
| Loading | Botón existente «Registrando...»; casilla `disabled` durante el envío |
| Success | Igual que hoy (redirección) |
| Empty | No aplica (formulario) |

El error desaparece al marcar la casilla. Hover de la fila: sin cambio de fondo; focus `ring-2 ring-slate-900 ring-offset-2` en la casilla.

### UF-CONSENT-02 · Alta de frutería con Términos y opt-in de WhatsApp

1. Usuario PROVIDER llega a `/registro/negocio` (primer negocio o «Nueva frutería»).
2. Llena datos del negocio, incluido teléfono.
3. Ve la casilla opcional «Recibir avisos de pedidos por WhatsApp…» (sin marcar); se habilita cuando el teléfono tiene 10 dígitos.
4. Marca la casilla obligatoria de Términos para fruterías.
5. Pulsa «Guardar y continuar» / «Crear frutería».
6. Sin Términos: error en línea, no se crea el `Provider`. Con Términos: éxito como hoy.

### WF-CONSENT-02 · Bloque legal en `/registro/negocio`

**Orden nuevo al final del formulario (antes del botón):**

1. `fieldset` «Avisos de pedidos» (`legend text-sm font-medium text-slate-900`): casilla opt-in `id="whatsapp-optin"`, label «Recibir avisos de pedidos por WhatsApp al teléfono del negocio». Hint `text-xs text-slate-600` «Opcional. Siempre recibirás los avisos por correo.»
   - Teléfono vacío o distinto de 10 dígitos → casilla `disabled` + `aria-describedby` con «Agrega un teléfono de 10 dígitos para activarlo.»; si estaba marcada y el teléfono deja de ser válido, se desmarca.
2. Casilla obligatoria `id="consent-provider-terms"`: «Acepto los [Términos y Condiciones] para fruterías: mi negocio es responsable del precio, calidad, peso e higiene de los productos que publica, y he leído el [Aviso de Privacidad].»
3. Botón existente (texto según `isNewBranch`).

**Estados:** idénticos a WF-CONSENT-01 (error «Debes aceptar los Términos para continuar»; loading con casillas `disabled`). Error 400 de API por consentimiento → `ErrorBanner` existente con el mismo copy que UF-CONSENT-01 paso 7. La casilla de Términos se exige también en «Nueva frutería» (N+1).

**Responsive:** sin cambio de layout; filas `min-h-11` en móvil y escritorio.

### WF-CONSENT-03 · `PrivacyMicrocopy` en puntos de captura

Componente único: `<p class="text-xs text-slate-600 leading-5">` + enlace «Aviso de Privacidad» (`underline`, nueva pestaña). Máximo dos líneas; sin casillas.

| Punto | Ubicación | Copy |
|-------|-----------|------|
| `SaveAddressDialog` (Explorar) y cualquier formulario de dirección | Bajo el input de nombre/dirección, encima de los botones | «Guardamos esta dirección para calcular distancias y entregas de tus pedidos. Aviso de Privacidad» |
| Geolocalización — `FilterBar` «Usar mi ubicación» | Fila de hints **debajo** del chrome (no dentro de la barra F9) mientras el permiso no esté `granted` (Permissions API; si no existe, mostrar siempre) | «Usamos tu ubicación aproximada solo para mostrar fruterías cercanas. Aviso de Privacidad» |
| Geolocalización — `LocationPanel` (F8) | Pie del panel, bajo la opción GPS | Mismo copy |
| WhatsApp — `ContactCTA` en línea | Bajo la fila de botones, `mt-2` | «Al escribir por WhatsApp compartes tu número con la frutería y con Meta. Aviso de Privacidad» |
| WhatsApp — `ContactCTA` sticky móvil | Una línea **encima** de los botones, `text-xs truncate` | «WhatsApp comparte tu número con la frutería · Privacidad» |

Solo se muestra el microcopy de WhatsApp si hay botón WhatsApp (`wa` no nulo). **Permiso denegado:** el hint pasa a `role="status"` `text-sm text-slate-700` «Sin acceso a tu ubicación. Busca por texto o mueve el mapa.» (estilo info, no error; GPS denegado ≠ fuera de México, regla F8). Estados Loading/Empty/Error no aplican (texto estático).

### WF-CONSENT-04 · Re-aceptación tras nueva versión (Should)

Solo si Arch incluye el contrato. Tras login, si falta aceptación de la versión vigente: `ConfirmDialog` no descartable con Escape, título «Actualizamos nuestros Términos», texto «Revisa los cambios para seguir usando tu cuenta.», enlaces a ambos documentos, misma casilla de WF-CONSENT-01 y CTA primary «Aceptar y continuar» (disabled hasta marcar) + secondary «Cerrar sesión». Error de guardado inline `role="alert"`.

---

### UF-COOKIE-01 · Primera visita: aviso de medición

1. Visitante sin preferencia guardada abre cualquier página pública.
2. Aparece `CookieNotice` en la parte inferior; puede seguir navegando sin cerrarlo.
3a. Pulsa «Entendido» → se guarda `measurement=on`; el aviso se va y no vuelve.
3b. Pulsa «Desactivar medición» → se guarda `measurement=off`; Umami no se carga; toast `role="status"` «Medición desactivada».
3c. Pulsa «Política de Cookies» → `/legal/cookies`; el aviso sigue visible hasta que elija.

### UF-COOKIE-02 · Cambiar la preferencia después

1. En el footer pulsa «Preferencias de medición» (o abre `/legal/cookies#preferencias`).
2. Se abre `MeasurementPreferencesDialog` con el estado actual.
3. Cambia el switch y pulsa «Guardar preferencia».
4. Toast «Preferencia guardada»; el script se carga o deja de cargarse desde la siguiente navegación.

### WF-COOKIE-01 · `CookieNotice` (no bloqueante)

**Layout:** `role="region" aria-label="Aviso de cookies y medición"` (no `dialog`, sin focus trap, sin overlay). Tarjeta `fixed z-50 inset-x-3 bottom-3 sm:inset-x-auto sm:right-4 sm:bottom-4 sm:max-w-md rounded-xl border border-gray-200 bg-white p-4 shadow-lg`.

1. Texto `text-sm text-slate-700`: «Usamos solo cookies necesarias para tu sesión y una medición anónima de uso, sin cookies ni datos personales.» + enlace «Política de Cookies».
2. Botones `flex gap-2 mt-3` (`<640px` `flex-col-reverse`, `w-full`): «Entendido» `min-h-11 px-4 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800`; «Desactivar medición» Ghost `min-h-11 px-4 text-slate-700 hover:bg-gray-100`.

**Coexistencia:** en rutas con barra sticky inferior (`ContactCTA` sticky en `/fruteria/[id]`, CTA sticky de `/carrito`, ticket POS móvil) el aviso se eleva con `bottom-[calc(var(--sticky-cta-h,0px)+0.75rem)]`; la barra sticky expone `--sticky-cta-h`. El aviso nunca tapa el CTA dominante.

**Estados:**

| Estado | Comportamiento |
|--------|----------------|
| Loading | No se renderiza en SSR; se monta tras hidratar leyendo `localStorage` (evita parpadeo para quien ya eligió). Sin skeleton |
| Empty (preferencia ya guardada) | No se muestra |
| Error (`localStorage` no disponible) | Se muestra en cada visita; los botones cierran el aviso en la sesión actual y aplican la elección en memoria; sin mensaje de error |
| Success | Tras elegir: el aviso desaparece (fade 150 ms; reduced-motion: instant); con «Desactivar» toast de confirmación |

**Teclado:** el aviso va al final del orden de tabulación del `body` (no roba el foco al cargar). Escape no lo cierra (no es modal). Focus `ring-2 ring-slate-900 ring-offset-2`. Contraste: slate-700/blanco ≈ 10.3:1; blanco/slate-900 ≈ 17.9:1.

### WF-COOKIE-02 · `MeasurementPreferencesDialog`

**Layout:** patrón `ConfirmDialog` F3 (`role="dialog" aria-modal="true"`, overlay `bg-black/40`, panel `max-w-md rounded-xl bg-white p-6`, `<640px` sheet inferior `inset-x-0 bottom-0 rounded-t-xl`).

1. Título `text-lg font-semibold` «Preferencias de medición».
2. Fila fija (no editable): «Cookies necesarias — Siempre activas» con texto `text-sm text-slate-600` «Mantienen tu sesión y la frutería activa (`lbm_token`, `lbm_active_provider`).»
3. Switch `role="switch"` patrón `PosImagesToggle` (`h-11 w-14`): «Medición anónima de uso» + hint «Cuenta visitas y clics sin cookies ni datos personales (Umami).»
4. Enlace «Leer la Política de Cookies».
5. Acciones: «Guardar preferencia» `bg-slate-900 text-white min-h-11` + «Cancelar» Ghost.

**Estados:**

| Estado | Comportamiento |
|--------|----------------|
| Loading | No aplica (lectura síncrona de `localStorage`) |
| Empty (sin preferencia previa) | Switch en ON (medición activa por default, aviso informativo) |
| Error (`localStorage` no disponible) | Banner `bg-amber-50 text-amber-900 text-sm` «Tu navegador no permite guardar esta preferencia; se aplicará solo en esta visita.»; Guardar sigue habilitado |
| DNT=1 | Switch `disabled` en OFF + `aria-describedby` «Tu navegador pide no ser medido (Do Not Track) y lo respetamos.» |
| Success | Cierra, toast `role="status"` «Preferencia guardada», foco vuelve al disparador |

**Teclado:** foco inicial en el switch; focus trap; Escape = Cancelar.

---

### UF-PROF-06 · Proveedor activa avisos de pedidos por WhatsApp

1. PROVIDER entra a `/proveedor/perfil`.
2. Baja al bloque «Avisos de pedidos» (después de «Capacidades y operación»).
3. Activa el switch «Recibir avisos de pedidos por WhatsApp…».
4. Pulsa «Guardar avisos» → toast «Guardado».
5. Para desactivar: apaga el switch y guarda; aplica desde el siguiente pedido.

### WF-PROF-06 · Bloque «Avisos de pedidos» en Perfil

**Layout:** card F14 `rounded-xl border border-gray-200 bg-white p-6`, `id="avisos"`.

1. H2 `text-lg font-semibold` «Avisos de pedidos».
2. `SwitchRow` `id="notify-whatsapp-optin"`: label «Recibir avisos de pedidos por WhatsApp al teléfono del negocio»; hint «Opcional. Siempre recibes los avisos por correo.»
3. Línea de estado `text-sm text-slate-600`: OFF «Hoy recibes los avisos solo por correo.» · ON «Avisos por WhatsApp a {teléfono formateado}.»
4. Botón primary del bloque «Guardar avisos» (regla F14: un primary por bloque).

**Desambiguación en el bloque «Capacidades y operación»:** el switch existente `cap-whatsapp` cambia de copy a label «Contacto por WhatsApp» y hint «Muestra el botón de WhatsApp en tu vitrina para que los clientes te escriban.» (sigue mapeando a `whatsappEnabled`).

**Estados:**

| Estado | Comportamiento |
|--------|----------------|
| Loading | Skeleton del perfil existente (un GET `me`, F14) |
| Empty (sin teléfono válido) | Switch `disabled` + `aria-describedby` «Agrega un teléfono de 10 dígitos en Datos del negocio.» con enlace ancla a ese bloque |
| Error | `role="alert"` `text-sm text-red-600` dentro del bloque; el switch vuelve al valor guardado |
| Success | Toast «Guardado»; línea de estado actualizada |

**Responsive:** igual que bloques F14 (una columna; switch alineado a la derecha `>=640px`).

---

### UF-ADMIN-12 · ADMIN captura los datos del responsable

1. ADMIN con permiso `LEGAL` entra a `/admin`.
2. Si faltan datos obligatorios ve `LegalIncompleteAlert` arriba de las tabs; pulsa «Completar datos legales».
3. Se activa la tab «Legal» (`/admin?tab=legal`) con el formulario precargado.
4. Elige tipo de persona; el label del nombre cambia (Nombre completo / Razón social).
5. Llena domicilio, correo ARCO, teléfono, RFC (opcional) y fecha de vigencia.
6. Pulsa «Guardar datos legales». Error 400 → mensajes por campo. Éxito → toast y la alerta desaparece.

### WF-ADMIN-12 · Tab «Legal» + alerta

**Tabs `/admin`:** Catálogos | Proveedores | Bitácora | **Legal** (nueva, al final; Analítica sigue en su ruta). La tab solo se muestra si el ADMIN tiene permiso `LEGAL`.

**`LegalIncompleteAlert`:** entre el título y las tabs, visible en todas las tabs cuando falten campos. `role="status"` `rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900` + icono `AlertTriangle` `aria-hidden`: «**Datos legales incompletos.** El footer y las páginas legales muestran "en actualización".» + enlace `underline font-medium` «Completar datos legales» (solo con permiso `LEGAL`; sin permiso: «Pide a un administrador con permiso Legal que los complete.»).

**Formulario (orden):** card `rounded-xl border border-slate-200 bg-white p-6`, `grid md:grid-cols-2 gap-4` (patrón `AdminProductForm` F10).

1. `fieldset` radio «Tipo de persona»: Física / Moral (filas `min-h-11`), `md:col-span-2`.
2. «Nombre completo» (física) o «Razón social» (moral) — obligatorio, `md:col-span-2`.
3. «RFC (opcional)» — hint «13 caracteres persona física, 12 persona moral.»; `uppercase`.
4. «Teléfono» — obligatorio, `inputmode="numeric"`, hint «10 dígitos».
5. «Domicilio» — obligatorio, `textarea rows=3`, `md:col-span-2` (si Arch lo parte en campos, mismo orden calle → colonia → municipio → estado → CP en grid 2 cols).
6. «Correo para derechos ARCO» — obligatorio, `type="email"`.
7. «Vigente desde» — obligatorio, `type="date"` `min-h-11`.
8. Meta `text-xs text-slate-500 md:col-span-2`: «Última actualización: {fecha} por {admin}» (si el contrato lo trae).
9. Acciones `md:col-span-2 flex justify-end`: primary «Guardar datos legales» (`w-full` `<640px`).

**CTA dominante:** «Guardar datos legales».

**Estados:**

| Estado | Comportamiento |
|--------|----------------|
| Loading | `SkeletonTable rows={4}` existente dentro de la card; botón `disabled` |
| Empty (registro sin datos) | Formulario vacío + texto `text-sm text-slate-600` arriba «Estos datos aparecen en el footer y en el Aviso de Privacidad.» |
| Error 400 | Errores por campo `text-sm text-red-600` (`aria-invalid`, `aria-describedby`), foco al primer campo inválido; resumen `role="alert"` arriba del form «Revisa los campos marcados.» |
| Error 403 / red | `ErrorBanner` existente; formulario no editable |
| Success | Toast «Datos legales guardados»; alerta desaparece en el siguiente render |

Validación cliente (espejo de la API, la API manda): correo, teléfono 10 dígitos, RFC 12/13 alfanuméricos si no está vacío, obligatorios. Botón «Guardando…» con `disabled` durante el PUT.

---

### Copy del home (Should, US de PM)

| Hoy | Propuesta |
|-----|-----------|
| «Visualiza fruterías cercanas con precios en tiempo real» | «Visualiza fruterías cercanas y los precios que publica cada una» |
| Título «Seguro y auditado» + desc. técnica JWT | Título «Información clara» · desc. «Cada frutería publica sus datos, precios y horarios; tus datos se tratan según nuestro Aviso de Privacidad.» |

## Para el siguiente rol

**FE:**
- Componentes nuevos: `PublicFooter`, `LegalDocumentPage` (+ `LegalVersionMeta`, `LegalToc`), `ConsentCheckbox`, `PrivacyMicrocopy`, `CookieNotice`, `MeasurementPreferencesDialog` (y variante en línea en `/legal/cookies#preferencias`), `LegalIncompleteAlert`, `AdminLegalSettingsForm`. Modificados: `RegisterPageClient`, `BusinessOnboardingClient`, `ProfilePageClient` (bloque Avisos), `ProfileCapabilitiesForm` (copy), `ContactCTA`, `FilterBar`/`LocationPanel`, `SaveAddressDialog`, `AdminPageClient`, `page.tsx` (Should copy).
- Paleta legal fija slate; nunca `var(--brand)` en estos componentes (override PROVIDER en `/registro/negocio`).
- Preferencia de medición en `localStorage` (llave a definir con Arch/ADR de analítica); el script de Umami solo se inyecta si `measurement !== "off"`, sin DNT y con variables presentes. `CookieNotice` se monta en cliente tras hidratar.
- Barras sticky inferiores exponen `--sticky-cta-h` para que el aviso no tape el CTA.
- Botón de envío **no** se deshabilita por la casilla de Términos; la validación muestra error y mueve el foco.
- Opt-in WhatsApp (`fieldset` en alta, switch en Perfil) es un campo distinto de `whatsappEnabled`; nombre exacto lo fija Arch.
- La tab «Legal» se oculta sin permiso `LEGAL`; `?tab=legal` directo muestra 403 con `ErrorBanner`.
- Fechas legales en español y TZ `America/Monterrey`.

## Pendientes

- Nombre de llave `localStorage`, del campo opt-in y estructura del domicilio (texto único vs. campos) — Arch (en paralelo; UX se ajusta sin rediseño).
- WF-CONSENT-04 (re-aceptación) solo si Arch incluye el Should en contrato — Arch/PM.
- Textos legales del cuerpo de las páginas: borrador sujeto a abogado — Humano (gate DevOps).

## Verificación

- `comun/design-tokens.md`: cabecera v0.15.0 + changelog F15; nueva sección `## 6j. Componentes Fase 15`; filas F15 en `## 7` y `## 8`; bloque `# Fase 15` en `## 9`.
- `comun/information-architecture.md`: cabecera v0.15.0 + changelog F15; rutas públicas `/legal/*`; Perfil con bloque Avisos; `/admin` tab Legal; nueva subsección «Footer público» en `## 5`; jerarquía `/admin`; filas CTA en `## 7`.
- Contrastes verificados (AA): slate-700/slate-50 9.9:1 · slate-600/blanco 7.6:1 · blanco/slate-900 17.9:1 · amber-900/amber-50 9.7:1 · red-600/blanco 4.8:1.

## QG-correcciones

Insumo: `fase-15/qa.md` (Ruteo C, 2 deltas de diseño, 0 bugs). El código no cambia. Destino: QA (aserciones de HP-POS-01 y de explorar en escritorio).

### δ-diseño-1 · Ticket del POS (`TicketLine`)

HP-POS-01 puede capturar `1.250` KG y la venta se guarda. En el ticket la cantidad se muestra con `formatQty`: sin ceros de relleno. Lo esperado es `1.25 KG`, no `1.250`. Un entero se ve sin decimal (`2 KG`).

### δ-diseño-2 · Explorar, filtros en escritorio (`FilterBarF9` / `ExploreChromeF9`)

En escritorio (`>=1024px`) los chips Mayoreo, A domicilio y Verificado ya están visibles en la barra. No hay control «mostrar filtros» ni «abrir búsqueda»; la aserción no los busca. En móvil se mantiene lo ya escrito en ExploreChromeF9 (`< md`: chips en la barra, wrap o segunda fila, `overflow-x-auto`, target ≥44px). No hay rediseño móvil.
