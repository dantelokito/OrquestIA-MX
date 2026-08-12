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

---

*Actualizar esta bitácora con cada release significativo o handoff de agente.*
