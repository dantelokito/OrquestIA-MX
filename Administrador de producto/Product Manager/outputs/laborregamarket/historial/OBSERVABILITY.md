# OBSERVABILITY — LaBorregaMarket

> Bitácora de análisis de producto, módulos identificados, asunciones y seguimiento entre agentes.

---

## Metadatos

| Campo | Valor |
|-------|-------|
| **Producto** | LaBorregaMarket |
| **Versión** | 0.2.0 (Fase 2 en discovery) |
| **Fecha de análisis** | 05/08/2026 (Fase 1); 09/08/2026 (Fase 2) |
| **Agente** | Product Manager |
| **Fuente principal** | `C:\Users\PC GAMER\LaBorregaMarket\PRODUCT.md` |
| **Fase PM** | Fase 2 Discovery — NOTIFY, MEDIA, EXPLORE |
| **Estatus global** | Fase 1: En Revisión / Corrección Pendiente; Fase 2: Discovery completado |
| **Última evaluación** | 09/08/2026 — Inicio Fase 2 Transacciones |

---

## Módulos identificados

| Módulo | Código | Descripción | Estado documentación PM |
|--------|--------|-------------|-------------------------|
| Autenticación | `AUTH` | Login, registro, logout, sesión JWT | ✅ Historias US-AUTH-* |
| Permisos | `PERMISSIONS` | RBAC por rol y módulo en DB + middleware | ✅ Referenciado en PRD |
| Usuarios | `USERS` | Cuentas de usuario | ✅ Contexto PRD |
| Proveedores | `PROVIDERS` | Fruterías / negocios registrados | ✅ Contexto PRD |
| Productos | `PRODUCTS` | Catálogo global + ProviderProduct | ✅ Contexto PRD |
| Pedidos | `ORDERS` | Modelo DB; sin flujo público | 🔲 Fase 3 (checkout) |
| Notificaciones | `NOTIFY` | Email proveedor en contacto | ✅ Documentado Fase 2 |
| Medios | `MEDIA` | Upload logo/portada/producto | ✅ Documentado Fase 2 |
| Auditoría | `AUDIT` | Bitácora de actividad | ✅ Parcial (login/logout/registro) |
| Explorar | `EXPLORE` | Vista mapa + tarjetas (transversal) | ✅ Gap documentado |

---

## Matriz rol × módulo

| Módulo | CLIENT | PROVIDER | ADMIN |
|--------|--------|----------|-------|
| `USERS` | — | — | CRUD |
| `PROVIDERS` | — | — | CRUD |
| `PRODUCTS` | Ver | Ver + Editar | CRUD |
| `ORDERS` | Ver + Crear | Ver + Crear | CRUD |
| `PERMISSIONS` | — | — | CRUD |
| `AUTH` | Propio | Propio | CRUD |
| `AUDIT` | — | — | CRUD |

---

## Estado implementación vs diseñado (actualizado 08/08/2026)

| Capacidad | Diseñado | Implementado | Gap / Observación |
|-----------|----------|--------------|-------------------|
| Login JWT + cookie httpOnly | ✅ | ✅ | — |
| Registro CLIENT / PROVIDER | ✅ | ✅ | Onboarding proveedor vía wizard `/registro/negocio` |
| Logout + AUDIT | ✅ | ✅ | — |
| Redirect post-login por rol | ✅ | ⚠️ | OBS-06: CLIENT va a `/cuenta` en vez de `/` |
| Middleware protección páginas | ✅ | ✅ | APIs con guards en handlers |
| RBAC matriz en DB | ✅ | ✅ | Sin UI admin editable |
| Onboarding proveedor completo | ✅ | ✅ | BL-002 cerrado en sprint 1 |
| Área cliente `/cuenta` | ✅ | ✅ | BL-006 cerrado |
| Explorar con API real | ✅ | ⚠️ | API OK; OBS-01 mapa móvil, OBS-02 filtros chips |
| Detalle frutería `/fruteria/[id]` | ✅ | ✅ | BL-005 cerrado |
| Panel proveedor precios | ✅ | 🔴 | OBS-04: precio no editable |
| Pedidos checkout | ✅ Fase 2 | 🔲 | Solo modelo DB |
| Header sesión autenticada | ✅ | ✅ | BL-007 cerrado; OBS-09 rol en menú |
| Envelope API catálogos admin | ✅ | 🔶 | OBS-001 Backend pendiente |

---

## Gaps de producto (post Quality Gates 08/08/2026)

### Cerrados en sprint 1

- Onboarding proveedor (BL-002, BL-003)
- Explorar conectado a API (BL-004) — con observaciones UX móvil
- Detalle frutería (BL-005)
- Área cuenta cliente (BL-006)
- Header autenticado + logout (BL-007)
- Guards API (BL-008), password min 8 (BL-009), redirect validation (BL-010)

### Abiertos — Backend (obligatorios antes de cierre fase)

| ID | Hallazgo | Prioridad |
|----|----------|-----------|
| OBS-001 | `/api/catalogs` sin envelope estándar ADR-003 | P1 — obligatorio |
| OBS-002 | Nombres de catálogo divergentes del contrato API-ADMIN-01 | P2 — obligatorio |
| OBS-003 | Lógica productos proveedor en route handler, no en servicio | P2 — obligatorio |
| OBS-004 | Permisos por tipo de catálogo | P3 — recomendado |

### Abiertos — Frontend (obligatorios antes de cierre fase)

| ID | Hallazgo | Prioridad |
|----|----------|-----------|
| OBS-01 | Mapa oculto en móvil en `/explorar` | P0 — obligatorio |
| OBS-04 | Precio no editable en panel proveedor | P0 — obligatorio |
| OBS-02 | Chips filtros no conectados a API | P1 — obligatorio |
| OBS-03 | Hint password en login | P1 — obligatorio |
| OBS-05 | Cuentas demo visibles en producción | P1 — obligatorio |
| OBS-06 | Redirect CLIENT post-login incorrecto | P1 — obligatorio |
| OBS-07 a OBS-12 | Loading, disabled, rol menú, empty states, wizard | P2 — recomendado |

---

## Asunciones de esta fase

| # | Asunción | Impacto si cambia |
|---|----------|-------------------|
| A1 | Mercado inicial: Monterrey, Nuevo León | Seed data, filtros geográficos, marketing |
| A2 | Modelo de monetización **pendiente** (comisión / suscripción / freemium) | Arquitectura de pagos Fase 2+ |
| A3 | Pedidos Fase 2: decisión abierta entre contacto tel/WhatsApp vs checkout in-app | Complejidad transaccional |
| A4 | Verificación de proveedores: manual por ADMIN (por ahora) | Flujo UX verificación |
| A5 | Catálogo global: solo ADMIN agrega productos al sistema | Curación centralizada |
| A6 | Código privado; documentación estilo open source (trazabilidad, seed, PRODUCT.md) | Sin implicación técnica directa |
| A7 | MVP Fase 1 PM: documentar AUTH + handoff UX; resto en backlog MoSCoW | Alcance de esta entrega |

---

## Decisiones pendientes (stakeholder)

| # | Decisión | Opciones | Impacto |
|---|----------|----------|---------|
| 1 | Modelo de monetización | Comisión por pedido / suscripción proveedor / freemium | Arquitectura de pagos |
| 2 | Flujo de pedido | Solo contacto (tel/WhatsApp) vs checkout in-app | **Cerrada 09/08/2026** — solo contacto; sin Order Fase 2 |
| 3 | Verificación de proveedores | Manual (admin) vs documentos + revisión | Confianza del cliente |
| 4 | Alcance geográfico inicial | Solo Monterrey vs Nuevo León completo | Marketing y seed data |
| 5 | Catálogo global | Solo admin agrega vs proveedor propone productos | Curación vs velocidad |

**Estado:** Pendiente validación explícita de Dante.

---

## Riesgos identificados (actualizado 08/08/2026)

| Riesgo | Severidad | Estado |
|--------|-----------|--------|
| Proveedor sin `Provider` → panel roto | Alta | ✅ Mitigado (wizard onboarding) |
| Mock data en explorar | Media | ✅ Mitigado (API real); mapa móvil pendiente |
| Proveedor no puede editar precios | Alta | 🔴 Abierto — OBS-04 |
| Formato API catálogos inconsistente | Media | 🔴 Abierto — OBS-001 |
| Experiencia móvil degradada (sin mapa) | Alta | 🔴 Abierto — OBS-01 |
| QA/DevOps adelantados sin cierre dev | Media | ⏸️ Pausado hasta corrección 100% hallazgos obligatorios |

---

## Evaluación de cumplimiento — Quality Gates (08/08/2026)

### Veredicto global

**Estatus: En Revisión / Corrección Pendiente** — el MVP **no está aprobado al 100%**.

### Resultados por área

| Área | Auditor | Veredicto | Hallazgos obligatorios |
|------|---------|-----------|------------------------|
| Backend | Arquitecto de Software | Rechazado con observaciones | OBS-001, OBS-002, OBS-003 |
| Frontend | UX/UI Designer | Rechazado con observaciones | OBS-01, OBS-04 + P1 (OBS-02 a OBS-06) |
| QA automatizado | Tester Senior (05/08) | Aprobado con condiciones | Sin Blocker/Critical — **pausado** en esta fase |

### Avances validados (consolidados)

- Auth JWT completo con bitácora; onboarding proveedor en 2 pasos; explorar, detalle frutería y cuenta cliente operativos.
- Panel admin con proveedores, verificación y bitácora; guards RBAC en APIs nuevas.
- UI alineada a marca (~78% fidelidad); componentes reutilizables; Header con sesión y búsqueda funcional.

### Impedimentos de negocio

- **Backend:** respuestas de catálogos admin no homogéneas → riesgo de fallos al mostrar datos en panel operativo.
- **Frontend:** sin mapa en móvil y sin edición de precios → promesa de producto incompleta para clientes y proveedores.

### Protocolo de fase

| Actividad | Estado |
|-----------|--------|
| Correcciones Backend | 🔶 Reasignado inmediato — OBS-001 a OBS-003 |
| Correcciones Frontend | 🔶 Reasignado inmediato — OBS-01, OBS-04, P1 |
| Pruebas integradas (QA) | ⏸️ **Pausadas** — no invocar en esta fase |
| Despliegue (DevOps) | ⏸️ **Pausado** — no invocar en esta fase |

Reactivación QA/DevOps: cuando hallazgos obligatorios estén cerrados y PM actualice estatus a **Aprobado para pruebas integradas**.

### Reporte stakeholders

Detalle ejecutivo para cliente: [`REPORTE-ESTADO-CUMPLIMIENTO.md`](./REPORTE-ESTADO-CUMPLIMIENTO.md)

---

## Fase 2 — Transacciones (Discovery 09/08/2026)

### Alcance confirmado

| Módulo | Must-have Fase 2 | Fuera de alcance |
|--------|------------------|------------------|
| `NOTIFY` | Email proveedor en contacto, AUDIT, rate limit | Push, SMS, WhatsApp API |
| `MEDIA` | Logo/portada proveedor, validación 5MB | Galerías múltiples |
| `EXPLORE` | Filtros categoría, producto, URL persistente | Checkout, pagos |
| `ORDERS` | — | **Fase 3** — schema existe sin API pública |

### User stories generadas (14)

| Epic | Historias |
|------|-----------|
| NOTIFY | US-NOTIFY-01 a US-NOTIFY-05 |
| MEDIA | US-MEDIA-01 a US-MEDIA-05 |
| EXPLORE | US-EXPLORE-01 a US-EXPLORE-04 |

### Backlog Fase 2

- Sprint 0: BL-S0-01 a BL-S0-06 (cierre OBS Fase 1)
- P0: BL-021 a BL-032
- P1: BL-033 a BL-036
- P2/Fase 3: BL-037 a BL-041

### Handoffs emitidos

| Agente | Archivo |
|--------|---------|
| UX/UI Designer | `handoff-ux-ui-fase-2.md` |
| Arquitecto | `handoff-arquitecto-fase-2.md` |
| Stakeholders | `REPORTE-FASE-2-INICIO.md` |

### Asunciones Fase 2

| # | Asunción |
|---|----------|
| F2-A1 | Email vía Resend/SendGrid (ADR pendiente Arquitecto) |
| F2-A2 | Storage Cloudinary MVP (ADR pendiente) |
| F2-A3 | WhatsApp Should = `wa.me` link, no API |
| F2-A4 | Notificación sin PII cliente por defecto |
| F2-A5 | Implementación Fase 2 tras Sprint 0 OBS Fase 1 |

### Criterios de éxito Fase 2

| Métrica | Objetivo |
|---------|----------|
| Proveedores con logo/portada | > 50% en 60 días |
| Tiempo notificación email | < 30s |
| Sesiones con filtro en explorar | > 25% |
| Conversión explorar → contacto | +5pp vs Fase 1 |

---

## Log de actividad PM

| Fecha | Actividad | Entregable | Agente destino |
|-------|-----------|------------|----------------|
| 05/08/2026 | Lectura y análisis `PRODUCT.md` + código AUTH | Este archivo | — |
| 05/08/2026 | Borrador PRD v0.1.0 | `prd.md` | Arquitecto, Tech Lead |
| 05/08/2026 | 7 historias US-AUTH-* con criterios de aceptación | `user-stories/` | UX/UI, QA |
| 05/08/2026 | Backlog MoSCoW priorizado | `backlog.md` | Tech Lead |
| 05/08/2026 | Paquete handoff flujos AUTH | `handoff-ux-ui.md` | **UX/UI Designer** |
| 08/08/2026 | Consolidación Quality Gates Backend + Frontend | Sección "Evaluación de cumplimiento" | Backend, Frontend |
| 08/08/2026 | Reporte estado y cumplimiento stakeholders | `REPORTE-ESTADO-CUMPLIMIENTO.md` | Cliente / Stakeholders |
| 09/08/2026 | Discovery Fase 2 — PRD, 14 user stories, backlog BL-021+ | `prd-fase-2.md`, `user-stories/`, `backlog.md` | Arquitecto, UX/UI |
| 09/08/2026 | Handoffs Fase 2 UX + Arquitecto | `handoff-ux-ui-fase-2.md`, `handoff-arquitecto-fase-2.md` | **UX/UI Designer**, **Arquitecto** |
| 09/08/2026 | Nota inicio Fase 2 stakeholders | `REPORTE-FASE-2-INICIO.md` | Cliente / Stakeholders |
| 09/08/2026 | Prompts activación UX + Arquitecto (contexto ventana nueva) | `activation-prompt-ux-fase-2.txt`, `activation-prompt-arquitecto-fase-2.txt` | UX/UI, Arquitecto |
| 14/08/2026 | Discovery Fase 5 — Leaflet/OSM, CAT harden, BRAND; pagos fuera | `fase-5/prd.md`, `fase-5/user-stories/`, `CO-F5-001` | UX/UI, Arquitecto |
| 14/08/2026 | STATUS fase activa 5; BL-040 diferido F6+; BL-084 superado | `STATUS.md`, `comun/backlog.md` | Tech Lead |
| 16/08/2026 | Discovery Fase 6 — deuda P0/P1 + reportes DASH; pagos aparcados | `fase-6/prd.md`, `CO-F6-001`, `US-NOTIFY-10`, `US-DASH-04…06` | UX/UI, Arquitecto, FE, BE, DevOps |
| 16/08/2026 | STATUS fase activa 6; F5 QA con condiciones; BL-040 hasta nuevo aviso | `STATUS.md`, `comun/backlog.md` | Tech Lead |
| 16/08/2026 | Slice C GEO — zoom↔radio + loading lista (`CO-F6-002`, US-GEO-07/08) | `fase-6/prd.md` v0.6.1, `BL-123`/`BL-124` | UX/UI, Arquitecto, Frontend |
| 16/08/2026 | Loader borrega B1–B3 (reutilizable) sustituye skeleton Must de US-GEO-08 | `comun/brand/loader-borrega/` | UX/UI, Frontend |

---

## Fase 6 — Confiabilidad + reportes (Discovery 16/08/2026)

> **No reescribe** F1–F5. Fuentes: DevOps `comun/deuda-fases-previas.md`; QA `IMPACTO-NO-ATENDER.md`; UX/Arch handoffs deuda 16/08. Código F5 y QA F5 (APROBADO CON CONDICIONES) ya ocurrieron; el STATUS PM del 14/08 (“sin código F5”) estaba desfasado.

### Decisiones

| # | Decisión |
|---|----------|
| D-F6-1 | Pagos / cobros POS nuevos / pago en línea **fuera hasta nuevo aviso** (`CO-F6-001`). No F7 automático. POS F3 intacto |
| D-F6-2 | Deuda P0 (`DEV-P0-001` lockfile Redis, `DEV-P0-002` CI) es Must de F6 |
| D-F6-3 | Reportes = panel PROVIDER, solo su negocio. No copiar `/admin/analytics` |
| D-F6-4 | Periodo: día / mes (MM/AAAA) / año (AAAA) **concreto**. TZ Monterrey |
| D-F6-5 | Imprimir **y** descargar PDF del mismo reporte |
| D-F6-6 | Mecanismo PDF = ADR Arquitecto |
| D-F6-7 | Slice deuda: no rediseñar; implementar handoffs UX/Arch 16/08 |
| D-F6-8 | GMV = no `CANCELLED`; split MARKETPLACE vs POS |
| D-F6-9 | Zoom/pan y slider = mismo `radiusKm` Haversine 1–25 (clamp). Círculo siempre visible. No bbox Must (`CO-F6-002`) |
| D-F6-10 | Loading geo = loop borrega B1→B2→B3 (`comun/brand/loader-borrega/`); componente reutilizable; reduced-motion = B1; no splash |

### Inventario deuda (abierta al discovery)

| ID | Sev | Dueño | Tema |
|----|-----|-------|------|
| DEV-P0-001 | P0 | Backend | `@upstash/redis` ausente → contacto 500 |
| DEV-P0-002 | P0 | DevOps | CI `build`/`start` + Playwright |
| DEV-P1-003 | P1 | BE + DevOps | `migrate deploy` F2→F5 |
| DEV-P1-004 | P1 | DevOps | Secretos staging (Should F6) |
| DEV-P1-005 | P1 | Backend | 503 prod sin Redis |
| DEV-P1-006 | P1 | FE | Invariante Leaflet (checklist Arch ya alineado) |
| DEV-P1-007 | P1 | DevOps | JWT por entorno (Should F6) |
| DEV-P2-008 / 010 | P2 | — | Won't F6 (`/health`, PITR) |
| DEV-P2-009 | P2 | Frontend | `.env.example` FE (Could) |
| DEV-P2-011 | P2 | Backend | `requireRole` en rutas nuevas |

### User stories F6

| Slice | Historias |
|-------|-----------|
| RELIAB Must | US-NOTIFY-10, US-OPS-04, US-OPS-05, US-GEO-06, US-BRAND-03 |
| RELIAB Should/Could | US-OPS-06, US-AUTH-08, US-OPS-07 |
| DASH Must | US-DASH-04, US-DASH-05, US-DASH-06 |
| GEO Must | US-GEO-07, US-GEO-08 |

### Handoffs

| Agente | Qué |
|--------|-----|
| Frontend / Backend / DevOps | Implementar deuda (punteros a handoffs UX/Arch 16/08). Prompts en `fase-6/activation-prompt-frontend.txt` etc. |
| UX/UI + Arquitecto | Ciclo **nuevo** DASH (`UF-DASH-02`, API periodo, ADR PDF) **y** delta GEO (`UF-GEO-01`, nota `radiusKm` desde visualizador). Prompts `activation-prompt-ux.txt` / `activation-prompt-arquitecto.txt` |

### Gate de cierre F6

P0-001 y P0-002 cerrados **y** US-DASH-04/05/06 **y** US-GEO-07/08 en DoD. Sin discovery de pasarela. Clustering y bbox Must siguen fuera.

---

## Referencias cruzadas

| Documento | Ubicación |
|-----------|-----------|
| Visión de producto | `LaBorregaMarket/PRODUCT.md` |
| PRD PM Fase 1 | `outputs/laborregamarket/prd.md` |
| PRD PM Fase 2 | `outputs/laborregamarket/prd-fase-2.md` |
| User stories | `outputs/laborregamarket/user-stories/` |
| Handoff UX Fase 1 | `outputs/laborregamarket/handoff-ux-ui.md` |
| Handoff UX Fase 2 | `outputs/laborregamarket/handoff-ux-ui-fase-2.md` |
| Handoff Arquitecto Fase 2 | `outputs/laborregamarket/handoff-arquitecto-fase-2.md` |
| Reporte Fase 1 | `outputs/laborregamarket/REPORTE-ESTADO-CUMPLIMIENTO.md` |
| Inicio Fase 2 | `outputs/laborregamarket/REPORTE-FASE-2-INICIO.md` |
| Prompt activación UX Fase 2 | `outputs/laborregamarket/activation-prompt-ux-fase-2.txt` |
| Prompt activación Arquitecto Fase 2 | `outputs/laborregamarket/activation-prompt-arquitecto-fase-2.txt` |
| Auditoría Backend | `Agente Arquitecto/.../outputs/laborregamarket/OBSERVABILITY.md` |
| Auditoría Frontend | `Agente UX UI/.../outputs/laborregamarket/OBSERVABILITY.md` |
| Esquema dominio | `LaBorregaMarket/prisma/schema.prisma` |
| Permisos y rutas | `LaBorregaMarket/src/lib/auth/permissions.ts` |
| Middleware | `LaBorregaMarket/src/middleware.ts` |
| PRD / US / CO Fase 6 | `outputs/laborregamarket/fase-6/` (incl. `CO-F6-002`) |
| Loader borrega B1–B3 | `outputs/laborregamarket/comun/brand/loader-borrega/` |
| Deuda DevOps | `Agente DevOps/.../comun/deuda-fases-previas.md` |
| Impacto QA deuda | `QA Automation Engineer/.../fase-5/deuda-tecnica-fases-previas/IMPACTO-NO-ATENDER.md` |

---

## 18/08/2026 — Apertura Fase 7 (PM)

Fase activa **7**. `fase-6/` congelada. Alcance: Explorar IDs 000–011 + login cross-device. `CO-F7-001` anula D-F6-9 (pan/zoom no derivan `radiusKm`). Pagos siguen aparcados.

---

## 24/08/2026 — Apertura Fase 8 Parte 1 (PM)

Fase activa **8**. `fase-7/` solo lectura. Alcance de esta parte: chrome de ubicación en `/explorar` (`CompactAddressBar`). US-GEO-17…20. Sin API nueva esperada. FilterBar/mapa/lista/preview quedan para partes siguientes. Leftover F7 (re-firma QA, smoke AUTH LAN) sigue en paralelo y no es Must F8.

---

## 24/08/2026 — Fase 8 Parte 2 radio (PM)

Overlay `RadiusSlider` más bajo en vertical. Clamp **0.5–10 km** (`CO-F8-001`); default 10 km; param `radiusKm` decimal; paso 0.5. Pan ≠ radio intacto. FE actual `Math.round` 1–25 **rompe** 0.5 — Arch+BE+FE deben alinear. US-GEO-21, US-GEO-22. FilterBar/lista/preview siguen fuera.

---

## 24/08/2026 — Fase 8 Parte 3 mapa México (PM)

Viewport acotado a México (`maxBounds` + `minZoom`). Encuadre al círculo al cambiar radio/centro (`FitCircle`). Pan **dentro de MX** no refetch (`CO-F7-001` intacto). GPS/geocode/pin/URL fuera de MX se rechazan. `CO-F8-002` opción A. US-GEO-23. No bbox Must de API. No polígono INEGI Must.

---

## 24/08/2026 — Fase 8 Parte 4 preview hover (PM)

Se descarta el botón «Vista rápida». Hover (puntero) y long-press (touch) abren preview **anclado a la card** con contenido `US-EXPLORE-05`. Clic/tap corto → `/fruteria/[id]`. Marker abre el mismo preview. `CO-F8-003`. US-EXPLORE-07. Sin API nueva; debounce GET al hover.

---

## 24/08/2026 — Gate F7 + LAN móvil (PM)

Código F7 entregado. QA 24/08 BLOQUEADO en papel (BUG-012); layout en repo ya saca FilterBar del scroll. Impedimento “móvil no conecta en local”: usar `npm run dev:lan` y `http://192.168.1.8:8080` — ver `fase-7/NOTA-LAN-MOVIL.md`. Distinto de US-AUTH-09.

---

## 25/08/2026 — Apertura Fase 9 deuda Explorar (PM)

Fase activa **9**. `fase-8/` solo lectura (sign-off QA APROBADO CON CONDICIONES 24/08 **intacto**). Discovery `CO-F9-001` acepta cola QA `DT-F9-001` … `005`:

| DT | US | Nota |
|----|-----|------|
| 001 | US-EXPLORE-08 | Preview in-card; sin API Must |
| 002 | US-EXPLORE-09 | Typeahead solo fruterías; Arch decide suggest |
| 003 | US-EXPLORE-10 | Distancia + ETA; sin minPrice visual |
| 004 | US-EXPLORE-11 | Mayoreo/Domicilio ON; Orgánico y «Filtros» **retirados** |
| 005 | US-GEO-24 | Una barra + mapa ~+10–20% |

Handoffs UX/Arch + prompts listos. No FE hasta handoff UX; BE tras Arch (002/004). Won't: SKUs en typeahead, `sampleProducts` en card, schema orgánico, reopen F8, `BL-040`.

---

## 26/08/2026 — Apertura Fase 10 (PM)

Fase activa **10**. `fase-9/` solo lectura (docs Explorar intactos; el código F9 puede seguir). Discovery `CO-F10-001`: admin endurecido + catálogo del proveedor.

**A5 revocada:** el PROVIDER crea productos **locales** (no comparables, no auto-global). El catálogo **global** sigue siendo de ADMIN. Secciones dinámicas por negocio; taxonomía `FRUTA|VERDURA|AGRICOLA` solo para globales / filtro Explorar (F9 intacto).

| Decisión | Cierre |
|----------|--------|
| D-F10-1 | Seguridad en APIs nuevas antes que usuarios/órdenes admin |
| D-F10-2 | Retiro de `Product` global = inhabilitar; no hard-delete con ventas |
| D-F10-3 | Flags mayoreo/domicilio/activo/verificado = mismos campos F5–F9 |
| D-F10-4 | Won't: usuarios UI, `BL-067`, 2FA, impersonation, `BL-040`, auto-global |
| D-F10-5 | A5 revocada. SKU local solo de esa frutería |
| D-F10-6 | Secciones dinámicas; no chips FilterBar |
| D-F10-7 | Promover local → global = Should (`US-ADMIN-04`) |

Must: `US-SEC-01` … `03`, `US-ADMIN-02` … `03`, `US-CAT-02` … `03`. Handoffs UX/Arch + prompts listos. BE: SEC primero, luego schema CAT. FE tras handoff UX. `US-CAT-01`, `US-REV-04`, `US-BRAND-02` intactos.

---

## 26/08/2026 — F10 media disco (PM)

`CO-F10-002` / **D-F10-8:** logo (perfil), portada y fotos de los productos que oferta el proveedor (y catálogo global ADMIN) se guardan en **disco local**. Cloudinary / S3 / CDN = Won't F10. ADR-006 aparcado. Validación `US-MEDIA-03` intacta. Historia `US-MEDIA-06` / `BL-178`.

---

## 28/08/2026 — Clausura Fase 9 (PM)

Fase 9 **cerrada documentalmente**. Fase activa del producto sigue siendo **10**. `fase-9/` solo lectura.

| Hito | Estado |
|------|--------|
| Discovery PM (`CO-F9-001`, US-08…11, GEO-24) | ✅ 25/08 |
| Diseño UX + contratos Arch | ✅ 25/08 |
| Código Frontend (QR-FE 92/100, 0 P0) | ✅ 25/08 — 5 features cerradas |
| Código Backend (QR-BE 97/100; mayoreo/domicilio listing) | ✅ 25/08 |
| Sign-off QA F9 | ⏳ Pendiente |
| Quality Gate UX/Arch F9 | ⏳ Pendiente (prerrequisito FE para QA) |

**Alcance cerrado:** preview in-card; typeahead fruterías (radio completo); card distancia+ETA; FilterBar Mayoreo/Domicilio (Orgánico/Filtros retirados); chrome una barra + mapa ~+10–20%. Sign-off F8 **intacto**. `CO-F7-001` intacto.

**Siguiente paso:** UX/Arch emiten Quality Gate F9 → Tester corre gates (`QA-F9-progreso` → sign-off). F10 no reabre US F9.

---

## 28/08/2026 — F10 reportes dashboard (PM)

`CO-F10-003` / **D-F10-9:** en `/proveedor/dashboard` (Reportes), un **mes** es atajo que llena inicio/fin; el **rango** es el filtro real; **checkboxes** de producto (ninguno = todos); **Imprimir** esa vista. Historias `US-DASH-07` … `09` / `BL-179` … `181`. `fase-6/` no se edita. PDF del corte = Should. No CSV, no multi-mes, no ADMIN viendo otro negocio.

---

## 28/08/2026 — Paquete de activación UX + Arquitecto (PM)

Sin nueva decisión de producto. Handoffs F10 empaquetados para pegar en chats **nuevos** (paralelo):

- UX: `fase-10/handoff-ux-ui.md` + `activation-prompt-ux.txt` (rutas absolutas, UF/WF nombrados, a11y DoD).
- Arch: `fase-10/handoff-arquitecto.md` + `activation-prompt-arquitecto.txt` (ADRs/contratos esperados, orden SEC → CAT/MEDIA → DASH).

FE espera `handoff-frontend-fase-10.md`. BE espera `handoff-backend-fase-10.md`. Prompts FE/BE no se activan en esta pasada.

---

## 12/09/2026 — Clausura Fase 10 + intro Fase 11 (PM)

Fase 10 **cerrada documentalmente**. Sign-off QA **APROBADO CON CONDICIONES** (12/09, Zero Blocker PASS localhost). Merge a `main` de `LaBorregaMarket`. `fase-10/` solo lectura.

| Ítem | Estado |
|------|--------|
| Must F10 (SEC, ADMIN, CAT local, media disco, DASH) | Entregado; suite QA 89/89 |
| QG-correcciones UX / Arquitecto | Ausente — excepción: Dante + QA + merge |
| BUG-015 / resto BUG-016 | Diferidos → DT-F10-001 / DT-F10-002 (`BL-182` / `BL-183`) |
| Sign-off QA F9 | Sigue pendiente; no se reabre F9 |

Fase activa **11** (intro, no discovery completo). 1 usuario PROVIDER = N fruterías aisladas. Switcher y reportes consolidados solo si N>1. Alta de sucursal = reusar `/registro/negocio`. Demo: `frutas@elparaiso.mx` ×2; `verduras@campoverde.mx` ×1 (mostrar en login). US/prompts: orquestador.

---

## 12/09/2026 — Discovery Fase 11 cerrado (PM)

PM completó US, handoffs y prompts. Visibilidad **N>1** explícita: módulo **nuevo** de reportes globales + switcher en banner; N=1 chrome F10. 2ª sucursal seed: **El Paraíso Tecnológico**.

US: `US-AUTH-11`, `US-HEADER-01`, `US-ISO-01`, `US-DASH-11`, `US-ONB-01`, `US-SEED-01`, `US-ADMIN-11`, `US-EXPLORE-11`.

Siguiente: UX + Arquitecto en paralelo. Graphify CLI no estaba en PATH en la sesión PM; `graphify-out/graph.json` existe.

---

## 12/09/2026 — Clausura documental Fase 11 (PM)

Fase 11 **cerrada documentalmente**. **No se abre fase 12.** El número de fase de producto permanece **11** hasta el PR de DevOps.

Verificado en disco (existencia, no copiado a este workspace):

| Artefacto | Ruta |
|-----------|------|
| Sign-off QA | `QA Automation Engineer/Agente Tester/outputs/laborregamarket/fase-11/qa-signoffs/QA-F11-signoff.md` — **APROBADO** |
| QG UX | `Agente UX UI/Agente UX UI/outputs/laborregamarket/fase-11/quality/QG-correcciones.md` |
| QG Arquitecto | `Agente Arquitecto de Software/Agente Arquitecto/outputs/laborregamarket/fase-11/quality/QG-correcciones.md` |
| EVIDENCIA-BUG-017 | `Agente frontend/Agente Frontend/outputs/laborregamarket/fase-11/quality/EVIDENCIA-BUG-017.md` |
| EVIDENCIA-BUG-018 | `Agente frontend/Agente Frontend/outputs/laborregamarket/fase-11/quality/EVIDENCIA-BUG-018.md` |

Must `BL-190`–`BL-197` → ✅ Cerrado F11. Won't F11 intactos (`BL-040`, Cloudinary, `US-ADMIN-04`, reopen F7–F10, DT-F10 como P0, catálogo compartido, CSV/CFDI).

Siguiente: orquestador activa **DevOps** (PR listo, sin push a `main`). Humano mergea. Graphify CLI no estaba en PATH; `graphify-out/` existe.

---

## 14/09/2026 — Discovery Fase 12 cerrado (orquestador + stakeholder)

Stakeholder: Dante. Módulo **Inventario / almacén**. F11 permanece cerrada (QA APROBADO + QG UX/Arch). DevOps: [PR #11](https://github.com/dantelokito/BorregaMarket/pull/11) **listo**, merge humano pendiente. Código F12 debe nacer de `fase-11` / `main` ya mergeado; la documentación F12 sí arranca.

### Decisiones de negocio (Dante, 14/09)

| ID | Decisión |
|----|----------|
| D-F12-1 | Existencias de los **mismos SKUs del catálogo**. No receta/BOM. |
| D-F12-2 | Ruta nueva `/proveedor/inventario`. SubNav: **Inventario** (primero) → Catálogo → POS → Órdenes → **Ventas** (hoy Dashboard; misma ruta `/proveedor/dashboard`) → Reportes generales (solo N>1). |
| D-F12-3 | Carga en la **unidad de catálogo**. Si entra en caja y se vende en kg/pieza, hay **factor de contenido de caja** (relación administrativa al formato de venta). El almacén no tiene que coincidir 1:1 con la venta. |
| D-F12-4 | Inventario **blando**: POS y Encargar **siempre pueden vender** (stock 0, desactualizado o negativo). Toggle `isAvailable` intacto (ADR-022). Se puede registrar entrada aunque el saldo esté mal. |
| D-F12-5 | Encargar: al crear (órdenes **activas**) la cantidad queda **parcial/reservada** y se ve en inventario. **Descuento absoluto** al **completar** (en código: `DELIVERED`). **Cancelar** (`CANCELLED`) **repone** y deja de ser parcial. POS descuenta al **cobrar**. |
| D-F12-6 | Cada producto tiene **capacidad/tope**. Barra = % del tope. Alerta de poca existencia **por producto**: umbral, o no mostrar. Default **10%**. El dueño sube el máximo, cambia el umbral o apaga la alerta. |

### Cierre de las 6 preguntas abiertas del plan (14/09)

No quedan abiertas para el PRD. El PM las copia como D-F12-7…12; no re-pregunta al stakeholder.

| ID | Pregunta | Cierre |
|----|----------|--------|
| D-F12-7 | Factor caja: ¿fijo por producto o por cada entrada? | **Fijo en la oferta** (`ProviderProduct` / ficha de inventario de ese SKU en la sucursal). Es la relación administrativa al formato de venta (cuántos kg o piezas contiene una caja). Se edita en inventario; las entradas en caja usan ese factor. No es un factor distinto por cada carga en Must. |
| D-F12-8 | ¿La existencia puede pasar del tope (barra > 100%)? | **Sí.** No se bloquea la entrada ni la venta. La barra puede mostrar saturación / más de 100%. El dueño puede subir el máximo cuando quiera. |
| D-F12-9 | Toggle imágenes POS: default y persistencia | **Default ON.** Persistido **por sucursal** (Provider activo). Control en la parte superior del catálogo, junto a las listas de secciones, tipo pregunta extra on/off. Miniaturas en la **lista** del catálogo proveedor: siempre visibles (no es el mismo toggle). |
| D-F12-10 | ¿Kardex Must? | **Won't F12.** Must = saldo on-hand + parciales Encargar + barra/alerta. Historial de movimientos (kardex) no se construye en esta fase. |
| D-F12-11 | ¿Renombrar Dashboard → Ventas? | **Sí (Must).** Etiqueta SubNav **Ventas**. Ruta sin cambio: `/proveedor/dashboard`. |
| D-F12-12 | ¿El cliente en `/fruteria` ve existencias? | **Won't.** Barra, alerta y parciales solo en panel PROVIDER (inventario + catálogo). |

### Won't F12 (congelado)

Receta/BOM, inventario compartido entre sucursales, Cloudinary/S3, `BL-040`, bloquear POS/Encargar por stock, usar `stock` como `isAvailable`, kardex, barra en vitrina cliente.

Siguiente: promover fase activa **12** en STATUS PM y PM en chat limpio (PRD, US, handoffs UX + Arquitecto).

---

## 14/09/2026 — PM Fase 12 cerrado

Documentación PM de inventario blando **cerrada**. Discovery D-F12-1…12 copiado al PRD. Nueve US Must (`US-INV-01`…`06`, `US-CAT-12`, `US-CAT-13`, `US-POS-12`) = `BL-200`…`BL-208`. Should/Could: ninguno.

| Artefacto | Ruta |
|-----------|------|
| PRD | `fase-12/prd.md` |
| Impacto | `fase-12/impacto-modulos.md` |
| Handoffs | `fase-12/handoff-ux-ui.md`, `fase-12/handoff-arquitecto.md` |
| Prompts | `fase-12/activation-prompt-ux.txt`, `fase-12/activation-prompt-arquitecto.txt` |

**Siguiente: UX + Arquitecto en paralelo** (chats limpios). No promover a fase 13. No implementar código desde PM.

---

## 15/09/2026 — Clausura documental Fase 12 (PM)

Cadena F12 **completa**. PM **cierra documentalmente** la fase. **No** se abre Fase 13. `fase-12/` pasa a **solo lectura**.

| Gate | Resultado |
|------|-----------|
| Sign-off QA | **APROBADO** — `QA Automation Engineer/Agente Tester/outputs/laborregamarket/fase-12/qa-signoffs/QA-F12-signoff.md` (API 16/16, E2E 5/5, Zero Blocker PASS) |
| QG UX | Presente — **sin deltas** UI/flujos/tokens (`Agente UX UI/.../fase-12/quality/QG-correcciones.md`) |
| QG Arquitecto | Presente — **sin deltas** contrato/ADR (`Agente Arquitecto de Software/.../fase-12/quality/QG-correcciones.md`) |
| Evidencia BE | `EVIDENCIA-BUG-019.md` (Prisma generate / EPERM; sin parche de contrato) |
| Must `BL-200`–`BL-208` | ✅ Cubiertos |
| Rama | `feat/f12-inventario-blando` (sin merge) |

BUG-019 no altera alcance de producto: fallo de ambiente Prisma en Windows, no inventario blando ni ADR-036/037.

Siguiente: orquestador activa **DevOps** (PR listo, sin push/merge a `main`). Humano mergea. **No Fase 13.**

---

## 15/09/2026 — Cobertura documental Fase 13 (PM)

F13 abierta **solo como cobertura**. No hay código ni prompt de implementación. DevOps F12 sigue en paralelo.

Cierre de producto (Dante): el catálogo GLOBAL es base de onboarding (negocio nuevo no vacío). «Eliminar» en proveedor = **ocultar de su vista** (GLOBAL de plataforma y LOCAL propios) hacia «Eliminados de la vista», con restaurar. El admin ve el maestro (GLOBAL + LOCAL) y no pierde historial. Inactivo ≠ oculto.

| Artefacto | Ruta |
|-----------|------|
| PRD | `fase-13/prd.md` |
| US Must | `US-ADMIN-05/06`, `US-CAT-14/15/16`, `US-DASH-10`, `US-SEC-04` |
| CO | `fase-13/change-orders/CO-F13-001-visibilidad-admin-y-archivo.md` |
| Borrador ADR | `fase-13/adr-draft-038-archivo-vs-delete.md` |
| QG cobertura | `fase-13/quality/QG-cobertura-BE.md`, `QG-cobertura-FE.md`, `QG-cobertura-UX.md` |
| No-regresión | `fase-13/matriz-no-regresion-f10-f12.md` |

Must `BL-210`–`BL-216` documentados. `BL-217` / vista solo mis ofertas = **Won't**. Carry-over sin mezclar: `BL-177`, DT-F10, QA F9, `BL-040`.

Siguiente: orquestador emite handoffs UX + Arquitecto en chats limpios **cuando** autorice build. PM **no** implementa.

---

## 16/09/2026 — Delta cobertura F13: unidad y factor caja

Dante: alta/editar producto LOCAL pide **unidad de venta completa (incluye CAJA)** y **factor caja** en el mismo formulario. Si ya hay inventario y se cambia unidad o factor: alerta (afecta POS, Encargar, inventario) y, al confirmar, **on-hand a 0**. Si hay Encargar activo: **bloqueo** (completar o cancelar; no automático).

Cierres PM vs Dante: el PRD ahora tiene **dos tablas**. D-F13-13/14 = Dante. Inventario-ocultos y paginación 50 siguen siendo PM.

| Artefacto | Ruta |
|-----------|------|
| US | `US-CAT-18`, `US-INV-07` |
| Backlog | `BL-219`, `BL-220` |

Sigue abierto: si un GLOBAL nuevo del admin aparece en fruterías ya operando. No se implementa código.

---

## 16/09/2026 — Delta cobertura F13: precio por oferta + reporte inventario

Cierres Dante: (1) editar precio de **su** oferta GLOBAL o LOCAL **sin** crear SKU y **sin** afectar otras fruterías, **más** historial de cambios de precio de catálogo; (2) reporte de inventario por negocio = saldo **ahora** + **entradas/cargas** registradas (no kardex); reportes generales N>1 = **solo** inventarios actuales. Las ventas siguen en `OrderItem.unitPrice`. Cargas F12 no se reconstruyen.

| Artefacto | Ruta |
|-----------|------|
| US | `US-CAT-19`, `US-CAT-20`, `US-DASH-12`, `US-DASH-13` |
| Backlog | `BL-221` … `BL-224` |
| QG / matriz | actualizados BE/FE/UX y DASH F10/F11 |

Cobertura F13 **completa** para que el orquestador abra UX + Arquitecto. PM **no** escribe prompt de implementación ni toca `LaBorregaMarket`.

Sigue abierto (no mezclar): ocultos en inventario; GLOBAL nuevo en fruterías ya operando.

---

## 16/09/2026 — Revisión de alcance F13: Editar / unidad de oferta

Dante (revisión PM): en `/proveedor` catálogo el botón **Editar** debe verse en **GLOBAL y LOCAL**. La unidad es de **la oferta de esta sucursal** (mismo patrón que el precio). El maestro GLOBAL y las otras fruterías no cambian. Foto sigue F10.

Enmienda: D-F13-15 deja de ser «el proveedor no toca unidad GLOBAL» y pasa a «no muta `Product.unit` del maestro; sí persiste unidad de oferta». Cierres PM: D-F13-23 (GLOBAL nuevo **aparece** en fruterías que ya operan), D-F13-24 (ocultar con Encargar activo **permitido**), D-F13-25 (factor obligatorio si unidad = CAJA). D-F13-10 cerrado (ocultos fuera de inventario/POS). Descarte `US-INV-07` no genera fila de entrada.

| Artefacto | Ruta |
|-----------|------|
| PRD / CO | `fase-13/prd.md`, `CO-F13-001` |
| US | `US-CAT-18`, `US-INV-07` (+ notas `US-CAT-14/15`, `US-DASH-12`) |
| QG / matriz | BE/FE/UX + `matriz-no-regresion-f10-f12.md` |
| Impacto | `fase-13/impacto-modulos.md` |
| Backlog | `BL-219` reescrito |

Cobertura F13 **completa** (alcance cerrado). Lista para orquestador → UX + Arquitecto. PM **no** implementa.

---

## 16/09/2026 — Kickoff implementación F13 (handoffs PM)

Validación cruzada 00–01: PRD, 13 US Must, CO-F13-001, borrador ADR-038, impacto, QG BE/FE/UX y ACs Dado/Cuando/Entonces **completos**. Sin gaps bloqueantes. No se reescribió el PRD.

Emitidos handoffs de build (protocolo 03; ya no «pendiente orquestador»):

| Artefacto | Ruta |
|-----------|------|
| UX | `fase-13/handoff-ux-ui-fase-13.md` |
| Arquitecto | `fase-13/handoff-arquitecto-fase-13.md` |
| Prompts respaldo | `fase-13/activation-prompt-ux.txt`, `fase-13/activation-prompt-arquitecto.txt` |

**Siguiente:** UX + Arquitecto **en paralelo**. F12 permanece cerrada. DevOps F12 ([PR #12](https://github.com/dantelokito/BorregaMarket/pull/12)) en paralelo: restricción de baseline (no asumir F12 en `main`); **no** bloquea diseño.

**STATUS ajenos:** UX y Arquitecto pueden seguir en fase 12. Registrado en STATUS PM; no se editaron workspaces ajenos. PM **no** implementa ni escribe prompt de código de la app.

---

## 16/09/2026 — Cierre documental Fase 13

Gates verificados (no placeholder):

| Gate | Resultado |
|------|-----------|
| QA APROBADO | Playwright 19/19 (API 15/15 + E2E 4/4); BUG-020 Verificado |
| QG UX | Sin delta UI (BUG-020 Backend-only) |
| QG Arquitecto | Sin delta contrato/ADR; ADR-038 intacto |

F13 **cerrada documentalmente**. **No** se abre F14. [PR #12](https://github.com/dantelokito/BorregaMarket/pull/12) F12 **en main**. Rama app: `feat/f13-archivo-oferta-unidad`.

Handoff DevOps: `fase-13/handoff-devops-fase-13.md`. DoD DevOps = PR abierto + checks verdes. **Prohibido** push/merge a `main`/prod; humano mergea. PM **no** implementa ni lanza DevOps.

---

## 17/09/2026 — Apertura documental Fase 14 (autorización Dante)

Dante autoriza abrir F14 **solo documental** para diseñar US de mejoras del panel PROVIDER. F13 permanece cerrada (QA APROBADO, lista DevOps PR). No se reabren US F13. No se implementa ni mergea la app desde PM.

Must (opción A): Perfil `/proveedor/perfil`, datos de negocio editables **sin** reset de `isVerified`, UI de campos API existentes, series de reportes ya calculadas, PDF `from`/`to`, merma **aditiva** (400 si `on_hand` negativo), ajuste por conteo ≥ 0, deuda `$50` y 409 de sección. Kardex de ventas, costos, caja y Explorar = Won't.

| Artefacto | Ruta |
|-----------|------|
| PRD / CO | `fase-14/prd.md`, `CO-F14-001` |
| US | `US-PROF-01`…`05`, `US-CAT-21`…`23`, `US-INV-08`…`10`, `US-DASH-14`…`16` |
| Handoffs | `handoff-ux-ui-fase-14.md`, `handoff-arquitecto-fase-14.md` |
| Backlog | `BL-230`…`BL-272` |

**Siguiente:** UX + Arquitecto **en paralelo**. PM **no** implementa.

---

## 17/09/2026 — Reconciliación F13 merge + baseline F14

Orquestador confirma: [PR #13](https://github.com/dantelokito/BorregaMarket/pull/13) **mergeado** en `main` (`0eda84c`). F13 ya no está “sin merge”. Baseline de código para F14 = **`main`**, no `feat/f13-archivo-oferta-unidad`.

Grafo de orquestación: `graphify update` no reindexa docs; se fuerza `graphify extract` para ingerir `fase-14/` (prd, US, handoffs). Grafo de la app ya está en `0eda84c` — no regenerar hasta código F14.

**Siguiente:** UX + Arquitecto en paralelo. Otros STATUS permanecen en 13 hasta que cada rol arranque.

---

## 18/09/2026 — Cierre documental Fase 14

Gates verificados (existencia; no se copiaron ajenos):

| Gate | Resultado |
|------|-----------|
| QA APROBADO | Playwright 41/41 (API 35/35 + E2E 6/6); Zero Blocker PASS; **sin BUG-021+** |
| QG UX | Sin delta UI / flujos / tokens |
| QG Arquitecto | Sin delta contrato/ADR; ADR-039/040/041 intactos |

F14 **cerrada documentalmente**. `fase-14/` queda **registro** (no reabrir US). **No** se abre F15 (humano no autorizó). Baseline [PR #13](https://github.com/dantelokito/BorregaMarket/pull/13) en `main` (`0eda84c`). Rama app: `feat/f14-panel-proveedor` (`9f5b875` / `92cced6`).

Handoff DevOps: `fase-14/handoff-devops-fase-14.md`. Prompt respaldo: `fase-14/activation-prompt-devops.txt`. DoD DevOps = PR abierto + checks verdes. **Prohibido** push/merge a `main`/prod; humano mergea. PM **no** implementa ni lanza DevOps.

---

*Actualizar esta bitácora con cada release significativo o handoff de agente.*
