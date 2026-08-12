# OBSERVABILITY — LaBorregaMarket (Agente UX/UI)

> Bitácora de diseño UX/UI, decisiones visuales, seguimiento por agente downstream.  
> **Este archivo es independiente del OBSERVABILITY del PM — no modificar el del PM.**

---

## Metadatos

| Campo | Valor |
|-------|-------|
| **Producto** | LaBorregaMarket |
| **Versión diseño** | 0.2.0 |
| **Fecha** | 12/08/2026 |
| **Agente** | UX/UI Designer |
| **Estado fase diseño** | ✅ Fase 2 diseño + Quality Gate Frontend ejecutado |
| **Estado auditoría Frontend** | 🟡 APROBADO CON OBSERVACIONES — 12/08/2026 (~91%) |
| **Input PM** | `handoff-ux-ui-fase-2.md` + `prd-fase-2.md` + US-NOTIFY/MEDIA/EXPLORE |

---

## Punto de entrada para agentes downstream

**Lee este archivo primero.** Luego abre solo los entregables listados en la matriz de seguimiento para tu rol.

| Agente | Handoff dedicado |
|--------|------------------|
| Arquitecto | `handoff-arquitecto.md` (Fase 1); contratos F2 vía Arquitecto `API-NOTIFY/MEDIA` |
| Frontend | `handoff-frontend.md` **v0.2.0** |
| Backend | `handoff-backend.md` |

---

## Índice de entregables

### Documentos base

| Archivo | Descripción |
|---------|-------------|
| `information-architecture.md` | Mapa rutas, header por rol, jerarquía contenido |
| `design-tokens.md` | Colores, tipografía, componentes (v0.2.0: Toast, ContactCTA, MediaUpload, ImagePlaceholder) |

### User Flows (13)

| ID | Archivo | Módulo |
|----|---------|--------|
| UF-AUTH-01 | `user-flows/UF-AUTH-01-login.md` | AUTH |
| UF-AUTH-02 | `user-flows/UF-AUTH-02-registro.md` | AUTH |
| UF-AUTH-03 | `user-flows/UF-AUTH-03-sesion-expirada.md` | AUTH |
| UF-AUTH-04 | `user-flows/UF-AUTH-04-logout.md` | AUTH |
| UF-CLIENT-01 | `user-flows/UF-CLIENT-01-explorar.md` | EXPLORE |
| UF-CLIENT-02 | `user-flows/UF-CLIENT-02-detalle-fruteria.md` | EXPLORE |
| UF-CLIENT-03 | `user-flows/UF-CLIENT-03-cuenta.md` | CLIENT |
| UF-PROVIDER-01 | `user-flows/UF-PROVIDER-01-onboarding.md` | PROVIDERS |
| UF-PROVIDER-02 | `user-flows/UF-PROVIDER-02-catalogo.md` | PRODUCTS |
| UF-ADMIN-01 | `user-flows/UF-ADMIN-01-operacion.md` | ADMIN |
| UF-NOTIFY-01 | `user-flows/UF-NOTIFY-01-contacto.md` | NOTIFY (F2) |
| UF-MEDIA-01 | `user-flows/UF-MEDIA-01-upload-proveedor.md` | MEDIA (F2) |
| UF-EXPLORE-02 | `user-flows/UF-EXPLORE-02-filtros.md` | EXPLORE (F2) |

### Wireframes (10)

| ID | Archivo | Ruta |
|----|---------|------|
| WF-login | `wireframes/WF-login.md` | `/login` |
| WF-registro | `wireframes/WF-registro.md` | `/registro` |
| WF-header-auth | `wireframes/WF-header-auth.md` | Header global |
| WF-explorar | `wireframes/WF-explorar.md` | `/explorar` (F2 filtros + OBS-01) |
| WF-fruteria-detalle | `wireframes/WF-fruteria-detalle.md` | `/fruteria/[id]` (F2 media) |
| WF-contacto-cta | `wireframes/WF-contacto-cta.md` | ContactCTA + Toast (F2) |
| WF-cuenta-cliente | `wireframes/WF-cuenta-cliente.md` | `/cuenta` |
| WF-proveedor-panel | `wireframes/WF-proveedor-panel.md` | `/proveedor` (OBS-04) |
| WF-proveedor-media | `wireframes/WF-proveedor-media.md` | Media logo/portada (F2) |
| WF-admin-panel | `wireframes/WF-admin-panel.md` | `/admin` (F2 upload + CONTACT) |

---

## Decisiones de diseño

| # | Decisión | Justificación | Referencia |
|---|----------|---------------|------------|
| D1 | Wizard onboarding proveedor obligatorio (paso 2) | Evita panel `/proveedor` roto sin entidad `Provider` | UF-PROVIDER-01, WF-registro |
| D2 | Header con variante autenticada + logout | Gap BL-007; US-AUTH-05 | WF-header-auth |
| D3 | Password mínimo 8 caracteres en UI (unificado) | Resolver inconsistencia 6 vs 8 (BL-009) | WF-login, WF-registro |
| D4 | Errores inline en formularios (no toast genérico) | Seguridad + accesibilidad `aria-live` | WF-login, design-tokens |
| D5 | Cuentas demo en login solo dev/staging | Mantener utilidad demo sin exponer en prod | WF-login |
| D6 | Búsqueda header → `/explorar?q=` | Resolver búsqueda decorativa (BL-012) | WF-header-auth |
| D7 | `/cuenta` pedidos como placeholder Fase 2 | Pedidos fuera de alcance MVP | WF-cuenta-cliente |
| D8 | Un CTA dominante por pantalla | DoD UX/UI — jerarquía visual | information-architecture.md |
| D9 | Split view Airbnb en explorar | Consistencia con UI existente | WF-explorar |
| D10 | Contacto vía `tel:` sin checkout | Decisión PM Fase 1/2; sin pagos in-app | WF-fruteria-detalle |
| D11 | Toast no bloqueante post-contacto | Feedback US-NOTIFY-03; `aria-live="polite"`; no espera email | WF-contacto-cta, UF-NOTIFY-01 |
| D12 | WhatsApp = CTA secundario (`wa.me`) | Should; Llamar permanece dominante (D8) | WF-contacto-cta |
| D13 | Filtros explorar persisten en URL | Shareable links; hidratar chips desde query | UF-EXPLORE-02, WF-explorar |
| D14 | `ImagePlaceholder` único, dims fijas | Anti-CLS; variantes negocio/categoría; sin emoji stickers | design-tokens, US-MEDIA-05 |
| D15 | Rate limit no bloquea `tel:` | Anti-spam solo en email; UX siempre permite llamar | UF-NOTIFY-01 |
| D16 | Pedidos en `/cuenta` siguen placeholder | Checkout = Fase 3 (Won't F2) | WF-cuenta-cliente, D7 |

---

## Patrones visuales

| Patrón | Especificación |
|--------|----------------|
| Estilo general | Inspirado Airbnb — limpio, cards, pill search |
| Brand | `--brand: #e23744`, `--brand-dark: #c13515` |
| Tipografía | Inter, system-ui |
| Grid | 8pt spacing; Tailwind utilities |
| Mapa | Leaflet + OpenStreetMap; price bubbles `.price-bubble` |
| Formularios | `rounded-lg`, `focus:ring-2 ring-[var(--brand)]` |
| Loading | SkeletonCard (no spinners full-page excepto botones) |
| Empty states | Icono + título + descripción + CTA opcional |
| Toast F2 | Feedback contacto 3–5s; no sustituye errores de formulario (D4) |
| Media F2 | Upload con preview + error inline; lazy images en cards |

---

## Matriz de seguimiento por agente

| Backlog | Prioridad | Agente(s) | Entregable UX | Acción esperada |
|---------|-----------|-----------|---------------|-----------------|
| BL-002 | P0 | Backend + Frontend | UF-PROVIDER-01, WF-registro, WF-proveedor-panel | Crear `Provider` en registro/wizard |
| BL-003 | P0 | Frontend | WF-proveedor-panel (estado sin Provider) | EmptyState + CTA wizard |
| BL-004 | P1 | Backend + Frontend | UF-CLIENT-01, WF-explorar | Conectar `/explorar` a API real |
| BL-005 | P1 | Backend + Frontend | UF-CLIENT-02, WF-fruteria-detalle | Crear página `/fruteria/[id]` |
| BL-006 | P1 | Backend + Frontend | UF-CLIENT-03, WF-cuenta-cliente | Crear `/cuenta` + API perfil |
| BL-007 | P1 | Frontend | UF-AUTH-04, WF-header-auth | Header autenticado + logout UI |
| BL-008 | P2 | Backend + Arquitecto | UF-AUTH-03 | Guards en API routes |
| BL-009 | P2 | Backend | WF-login, design-tokens | Unificar password min 8 en API login |
| BL-010 | P2 | Backend | UF-AUTH-03 | Validar `redirect` param |
| BL-011 | P2 | Backend + Frontend | UF-CLIENT-01, WF-explorar | Filtros `city`, `q` en API |
| BL-012 | P3 | Frontend | WF-header-auth | Búsqueda funcional → `/explorar?q=` |
| F2-NOTIFY | P0/P1 | Frontend + Backend | UF-NOTIFY-01, WF-contacto-cta | Contact + toast + wa.me |
| F2-MEDIA | P0/P1 | Frontend + Backend | UF-MEDIA-01, WF-proveedor-media | Logo/portada + placeholder |
| F2-EXPLORE | P0/P1 | Frontend + Backend | UF-EXPLORE-02, WF-explorar | Chips URL + empty + mapa móvil |
| F2-ADMIN-MEDIA | Should | Frontend + Backend | WF-admin-panel | Upload imagen producto |
| Sprint0-OBS | P0/P1 | Frontend | OBS-01…06 | Cerrar antes de features F2 |

---

## Gaps diseño vs implementación (post-auditoría 08/08/2026)

| Gap original | Estado post-Frontend | Pendiente |
|--------------|---------------------|-----------|
| Header siempre público | ✅ Resuelto — `HeaderWrapper` + `UserMenu` | Rol en subtítulo menú (OBS-09) |
| PROVIDER sin `Provider` | ✅ Resuelto — `OnboardingCTA` + `/registro/negocio` | Copy CTA (OBS-11) |
| Explorar usa mock | ✅ Resuelto — API `getProviders` | Mapa móvil (OBS-01), filtros chips (OBS-02) |
| `/cuenta` no existe | ✅ Resuelto — `CuentaPageClient` | — |
| `/fruteria/[id]` no existe | ✅ Resuelto — `FruteriaDetailClient` | Empty productos (OBS-10) |
| Búsqueda decorativa | ✅ Resuelto — `handleSearch` → `/explorar?q=` | — |
| Password hint login | ⚠️ Parcial — `minLength={8}` sin hint visible | OBS-03 |
| Edición precio proveedor | 🔴 No implementado | OBS-04 (P0) |
| Demo accounts en prod | 🔴 Siempre visibles | OBS-05 |
| Redirect CLIENT post-login | 🔴 Va a `/cuenta` en vez de `/` | OBS-06 |

---

## Accesibilidad y NFR UI

| Requisito | Especificación | Agente responsable |
|-----------|----------------|-------------------|
| WCAG 2.1 AA | Contraste 4.5:1, focus visible, labels | Frontend |
| `aria-live` errores | Contenedor errores formulario | Frontend |
| Mapa accesible | Lista alternativa en explorar | Frontend |
| Lazy load mapa | Leaflet dynamic import | Frontend + Arquitecto |
| Skeleton screens | Explorar, detalle, proveedor, cuenta | Frontend |
| Paginación API | Explorar, bitácora admin | Backend + Arquitecto |
| Tiempo carga explorar | < 2s en 4G | Backend (índices) + Frontend (skeleton) |
| Cookie JWT server-side | Header lee sesión en server component | Frontend + Backend |

---

## Checklist DoD UX/UI

### Fase 1 (histórico)

- [x] Legibilidad y contraste WCAG AA
- [x] Un CTA dominante por pantalla
- [x] Estados hover, focus, active, disabled en componentes
- [x] Empty, Loading, Success, Error por pantalla principal
- [x] Responsividad móvil (<=640px) y desktop (>=1024px)
- [x] Handoffs generados para Arquitecto, Frontend, Backend

### Fase 2 (10/08/2026)

- [x] User flows NOTIFY / MEDIA / EXPLORE
- [x] Wireframes WF-contacto-cta, WF-proveedor-media + updates explorar/detalle/proveedor/admin
- [x] Tokens Toast, ContactCTA, MediaUpload, ImagePlaceholder, FilterChip
- [x] OBS-01 especificado en WF-explorar (mapa móvil)
- [x] OBS-04 reafirmado en WF-proveedor-panel (PriceInput)
- [x] Sin diseño de checkout
- [x] Handoff Frontend v0.2.0 listo
- [x] Re-auditoría post-implementación Frontend — 12/08/2026 (APROBADO CON OBSERVACIONES)

---

## Auditoría de Diseño y UX (Frontend)

### A) Fase 1 — histórica (08/08/2026) — RECHAZADO ~78%

> Conservada como referencia. OBS-01–06 re-validados en sección B (Sprint 0).

Veredicto original: 🔴 RECHAZADO CON OBSERVACIONES. Detalle OBS-01–12 en log 08/08; no repetir aquí.

---

### B) Fase 2 + Sprint 0 — Quality Gate (12/08/2026)

> **Fecha auditoría:** 12/08/2026  
> **Auditor:** Agente UX/UI Designer  
> **Código revisado:** `LaBorregaMarket/src/`  
> **Evidencia Frontend:** `feature-handoffs/FEAT-SPRINT0|NOTIFY|MEDIA|EXPLORE-handoff.md`  
> **Referencia UX:** `handoff-frontend.md` v0.2.0, `design-tokens.md` v0.2.0, UF/WF Fase 2

#### 1. Veredicto

## 🟡 APROBADO CON OBSERVACIONES

Fidelidad estimada **~91%** respecto a wireframes y tokens Fase 2.

Sprint 0 cierra OBS-02…06 y restaura mapa móvil (OBS-01 funcional). NOTIFY, MEDIA y EXPLORE cumplen estados críticos, DoD de CTA/toast/upload/filtros URL y **no hay checkout**. Quedan desalineaciones **P1/P2** (altura mapa móvil, copy chips/badge, targets paginación, favorito decorativo) — **ningún P0 bloqueante**.

**@Frontend_Developer:** atender OBS-F2-01 (P1) y P2 listados; re-auditar solo si se requiere cierre 100% o si OBS-F2-01 no se corrige antes de release.

---

#### 2. Fidelidad de interfaz por pantalla

| Pantalla | Wireframe | Cumplimiento | Notas |
|----------|-----------|:------------:|-------|
| `/login` | WF-login | 🟢 95% | Hint 8 chars; demo gate `NODE_ENV`; CLIENT → `/` |
| `/explorar` | WF-explorar | 🟡 88% | Chips API+URL+empty OK; mapa móvil visible pero `min-h-[400px]` pelea `h-[300px]` (OBS-F2-01); labels chip “Verificado”/“Agrícola” |
| `/fruteria/[id]` | WF-fruteria-detalle + WF-contacto-cta | 🟢 95% | Cover/logo, ContactCTA Llamar+WA, toast, sticky móvil |
| `/proveedor` | WF-proveedor-panel + WF-proveedor-media | 🟢 94% | PriceInput editable (OBS-04); MediaUpload logo/portada; preview blob + persistencia |
| `/admin` | WF-admin-panel | 🟢 92% | Upload producto; badge email; filtro CONTACT; copy “Sin email válido” |
| Header | WF-header-auth | 🟢 95% | Búsqueda → `/explorar?q=` (≥2) |
| Global tokens | design-tokens v0.2.0 | 🟢 93% | `--brand`, Toast, chips activos, MediaUpload, ImagePlaceholder |

**Sin UI de checkout / carrito / pedidos in-app** — conforme alcance F2.

---

#### 3. Matriz de estados UI (Fase 2)

| Superficie | Loading | Empty | Success | Error | Veredicto |
|------------|:-------:|:-----:|:-------:|:-----:|-----------|
| ContactCTA / Toast | — | — | toast “La frutería fue notificada” 4s | soft “No pudimos…”; **429 silencioso** | 🟢 |
| Media proveedor | overlay spinner | ImagePlaceholder + Subir | preview URL / blob | inline formato/tamaño + aria-live | 🟢 |
| Admin producto img | overlay | placeholder | thumb actualizado | inline | 🟢 |
| Explorar filtros | SkeletonCard | “No encontramos fruterías” + Limpiar | grid + mapa | ErrorBanner solo red | 🟢 |

**Reglas críticas:** Empty filtrado ≠ ErrorBanner ✅ · `tel:` nunca bloqueado por notify/429 ✅

---

#### 4. Sprint 0 — re-auditoría OBS-01…06

| ID | Pri | Resultado | Evidencia |
|----|-----|-----------|-----------|
| OBS-01 | P0 | 🟡 Parcial | Contenedor móvil `h-[300px] lg:hidden` OK; `ExploreMap` fuerza `min-h-[400px]` → fidelidad altura (ver OBS-F2-01) |
| OBS-02 | P1 | ✅ Cerrado | Chips → `category`/`verified` server-side + URL |
| OBS-03 | P1 | ✅ Cerrado | Hint “Mínimo 8 caracteres” en login |
| OBS-04 | P0 | ✅ Cerrado | `PriceInput` editable + PATCH |
| OBS-05 | P1 | ✅ Cerrado | Demo solo si `NODE_ENV !== "production"` |
| OBS-06 | P1 | ✅ Cerrado | CLIENT post-login → `/` |

---

#### 5. Usabilidad y accesibilidad (DoD F2)

| Criterio | Estado | Detalle |
|----------|:------:|---------|
| Toast `aria-live="polite"` / `role="status"` | 🟢 | `Toast.tsx` |
| Chips `aria-pressed`; min-h 44px | 🟢 | `FilterBar.tsx` |
| Labels file input MediaUpload | 🟢 | `aria-label` + botón visible |
| CTA dominante Llamar; WA secundario | 🟢 | `ContactCTA.tsx` |
| Mapa móvil + lista alternativa | 🟡 | Visible; altura imperfecta (OBS-F2-01) |
| Placeholders dims fijas | 🟢 | `ImagePlaceholder` |
| Lazy load cards | 🟢 | `loading="lazy"` / next/image |
| Sin UI checkout | 🟢 | Confirmado |
| Touch 44px general | 🟡 | CTAs/chips OK; paginación `h-8 w-8` (OBS-F2-03) |

---

#### 6. Observaciones nuevas Fase 2 (OBS-F2-XX)

| ID | Pri | Pantalla | Observación | Acción requerida | Referencia |
|----|-----|----------|-------------|------------------|------------|
| **OBS-F2-01** | P1 | `/explorar` | `ExploreMap` usa `min-h-[400px]` y no aplica `className` del section móvil → mapa rompe presupuesto ~300px | Pasar `className` a mapa cargado o `min-h-0` / `min-h-full` en móvil | WF-explorar, OBS-01 |
| **OBS-F2-02** | P2 | `/explorar` | Labels “Verificado” / “Agrícola” vs wireframe “Verificadas” / “Agrícolas”; chips disabled extra (Orgánico…) | Alinear copy; ocultar o marcar roadmap chips disabled | UF-EXPLORE-02, WF-explorar |
| **OBS-F2-03** | P2 | `/explorar` | Paginación `h-8 w-8` (menos de 44px) | Subir a min 44×44 en touch | design-tokens touch |
| **OBS-F2-04** | P2 | ProviderCard | Corazón favorito parece interactivo pero solo `preventDefault` | Quitar control o implementar favoritos (fuera F2 → quitar) | WF-explorar |
| **OBS-F2-05** | P2 | `/admin` | Badge “Sin email válido” (OK semántico) vs “Sin email” del WF | Unificar copy a “Sin email válido” en WF o acortar UI | US-NOTIFY-04, WF-admin |
| **OBS-F2-06** | P2 | MEDIA | Copy formato “Usa…” vs US “Use…”; CTAs “Subir/Reemplazar” vs “Cambiar logo/portada” | Aceptable ES; opcional alinear labels WF | US-MEDIA-03, WF-proveedor-media |
| **OBS-F2-07** | P2 | Toast | Sin botón ✕ dismiss manual (solo auto 4s) | Añadir cerrar opcional | WF-contacto-cta |
| **OBS-F2-08** | P2 | ExploreMap | Markers omiten providers sin `minPrice` | Mostrar pin sin bubble de precio | WF-explorar |

**Nota entorno:** MEDIA/NOTIFY dependen de `CLOUDINARY_*` / `RESEND_API_KEY`. Sin ellas, errores inline/toast soft son **aceptables** si el mensaje es claro (hoy MediaUpload muestra detalle API o “Error al subir la imagen”).

---

#### 7. Elementos aprobados (Fase 2)

- `ContactCTA`: Llamar primary `--brand`, WhatsApp secondary, sticky móvil, fire-and-forget POST contact
- Toast éxito/error con copy US-NOTIFY-03; 429 sin spam; `tel:` siempre usable
- `MediaUpload` + blob preview + cache-bust + re-fetch negocio; validación 5MB / JPEG|PNG|WebP
- `ImagePlaceholder` anti-CLS en logo/cover/product
- Admin upload imagen producto + bitácora filtro CONTACT + badge email
- Explorar: chips `aria-pressed`, URL `category`/`q`/`verified`, empty + Limpiar ≠ ErrorBanner
- Sprint 0: PriceInput, hint password, demo gate, redirect CLIENT `/`
- Brand `--brand` / `--brand-dark`; sin checkout

---

#### 8. Criterio de re-aprobación / cierre

Cerrar Quality Gate al **100%** cuando:

- [ ] **OBS-F2-01** (P1) corregido — mapa móvil ≈300px sin `min-h-[400px]` conflictivo
- [ ] Al menos 4 de 7 observaciones P2 (OBS-F2-02…08) abordadas **o** aceptadas explícitamente por PM

**Para release Fase 2 con observaciones menores:** el veredicto actual **APROBADO CON OBSERVACIONES** es suficiente si OBS-F2-01 queda en backlog cercano.

---

## Log de actividad UX

| Fecha | Actividad | Entregable | Agente destino |
|-------|-----------|------------|----------------|
| 05/08/2026 | Arquitectura de información + design tokens | `information-architecture.md`, `design-tokens.md` | Frontend |
| 05/08/2026 | User flows AUTH (4) + wireframes AUTH (3) | `user-flows/UF-AUTH-*`, `wireframes/WF-login/registro/header` | Frontend, Backend |
| 05/08/2026 | User flows CLIENT (3) + wireframes (3) | `UF-CLIENT-*`, `WF-explorar/fruteria/cuenta` | Frontend, Backend |
| 05/08/2026 | User flows PROVIDER/ADMIN + wireframes (2) | `UF-PROVIDER-*`, `UF-ADMIN-01`, `WF-proveedor/admin` | Frontend, Backend |
| 05/08/2026 | Observabilidad + handoffs downstream | Este archivo + `handoff-*.md` | Arquitecto, Frontend, Backend |
| 08/08/2026 | **Auditoría Quality Gate Frontend Fase 1** | Sección A — RECHAZADO ~78% | **@Frontend_Developer** |
| 10/08/2026 | **Fase 2 diseño** — NOTIFY, MEDIA, EXPLORE | UF/WF F2 + tokens + handoff-frontend v0.2.0 | **@Frontend_Developer** |
| 12/08/2026 | **Quality Gate Fase 2 + Sprint 0** | Sección B — APROBADO CON OBSERVACIONES ~91%; OBS-F2-01…08 | **@Frontend_Developer** |

---

## Referencias externas (solo si necesitas contexto adicional)

| Documento | Ubicación | Cuándo leer |
|-----------|-----------|-------------|
| Handoff PM → UX Fase 2 | `Administrador de producto/.../handoff-ux-ui-fase-2.md` | Entrada Fase 2 |
| PRD Fase 2 | `Administrador de producto/.../prd-fase-2.md` | Alcance NOTIFY/MEDIA/EXPLORE |
| User stories F2 | `.../user-stories/US-NOTIFY-*`, `US-MEDIA-*`, `US-EXPLORE-*` | Criterios aceptación |
| Handoff Arquitecto F2 | `.../handoff-arquitecto-fase-2.md` | Contratos API |
| Handoff Frontend → UX QG | `Agente Frontend/.../handoff-ux-quality-gate-fase-2.txt` | Solicitud auditoría 12/08 |
| Feature handoffs FE | `Agente Frontend/.../feature-handoffs/FEAT-*.md` | Evidencia implementación |
| Código UI actual | `LaBorregaMarket/src/` | Auditoría fidelidad |

---

*Generado por Agente UX/UI Designer — LaBorregaMarket v0.2.0. Actualizar con cada iteración de diseño.*
