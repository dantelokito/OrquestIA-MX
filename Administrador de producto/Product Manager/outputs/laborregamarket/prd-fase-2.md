# PRD — LaBorregaMarket Fase 2 (Transacciones)

> **Proyecto:** LaBorregaMarket  
> **Fecha:** 09/08/2026  
> **Versión:** 0.2.0 (Fase 2)  
> **Objetivo del Negocio:** Cerrar el ciclo de contacto entre clientes y proveedores, elevar la presentación visual del marketplace y habilitar descubrimiento preciso mediante filtros avanzados — sin checkout ni pagos en la aplicación.  
> **Público Objetivo:** Clientes locales (CLIENT), dueños de fruterías (PROVIDER) y operadores de plataforma (ADMIN).

---

## Relación con Fase 1

Fase 1 (v0.1.0) entregó descubrimiento, autenticación, onboarding proveedor, cuenta cliente y panel admin. Fase 1 está **En Revisión / Corrección Pendiente** (Quality Gates 08/08/2026). Sprint 0 de Fase 2 debe cerrar hallazgos P0/P1 de Fase 1 antes de integrar nuevas capacidades.

**Decisión de producto confirmada (Decisión #2):** contacto directo tel/WhatsApp — **sin checkout in-app** en Fase 2.

---

## Objetivos Fase 2

1. **Cerrar el loop de contacto:** el proveedor recibe aviso cuando un cliente muestra interés (clic en llamar/contacto), sin depender solo de que el cliente inicie la conversación por otro canal.
2. **Confianza visual:** logos, portadas e imágenes de productos en explorar y detalle de frutería.
3. **Descubrimiento preciso:** filtros por categoría, producto, verificación y búsqueda unificada conectados al servidor.

**Propuesta de valor:** el cliente sigue contactando directo (sin pagos en app), pero el proveedor no pierde leads y la plataforma se ve y filtra como producto terminado.

---

## Módulos Fase 2

| Módulo | Código | Descripción |
|--------|--------|-------------|
| Notificaciones | `NOTIFY` | Email (Must) y WhatsApp link (Should) al proveedor en eventos de contacto |
| Medios | `MEDIA` | Upload logo/portada proveedor; imagen producto catálogo global (admin) |
| Explorar | `EXPLORE` | Filtros avanzados API + UI (categoría, producto, verified, q) |

**Fuera de alcance Fase 2:** módulo `ORDERS` (checkout, `POST /api/orders`, pagos en línea). Modelo `Order`/`OrderItem` en schema queda para Fase 3. Sección "Pedidos" en `/cuenta` permanece placeholder.

---

## Requerimientos funcionales (alto nivel)

### NOTIFY

| RF | Descripción | Prioridad |
|----|-------------|-----------|
| RF-NOTIFY-01 | Al clic "Llamar"/contacto en `/fruteria/[id]`, registrar evento y enviar email al proveedor | Must |
| RF-NOTIFY-02 | Evento `CONTACT` (o equivalente) en bitácora AUDIT | Must |
| RF-NOTIFY-03 | Cliente ve feedback breve "Frutería notificada" (sin bloquear llamada) | Should |
| RF-NOTIFY-04 | Enlace WhatsApp `wa.me` con mensaje pre-llenado (Should) | Should |
| RF-NOTIFY-05 | Rate limit anti-spam en eventos de contacto por IP/sesión | Must |
| RF-NOTIFY-06 | Email sin PII del cliente salvo consentimiento explícito | Must |

### MEDIA

| RF | Descripción | Prioridad |
|----|-------------|-----------|
| RF-MEDIA-01 | Proveedor sube/actualiza `logoUrl` y `coverUrl` | Must |
| RF-MEDIA-02 | Admin sube `imageUrl` en producto catálogo global | Should |
| RF-MEDIA-03 | Validación formato (JPEG/PNG/WebP), tamaño max 5MB | Must |
| RF-MEDIA-04 | Imágenes visibles en cards explorar y detalle frutería | Must |
| RF-MEDIA-05 | Placeholder cuando no hay imagen | Must |

### EXPLORE (extensión Fase 1)

| RF | Descripción | Prioridad |
|----|-------------|-----------|
| RF-EXPLORE-01 | Chips categoría (frutas/verduras/agrícolas) filtran vía API | Must |
| RF-EXPLORE-02 | Query param `product` o `q` para "negocios que venden mango" | Must |
| RF-EXPLORE-03 | Filtro `verified` sincronizado UI ↔ API (cierra OBS-02) | Must |
| RF-EXPLORE-04 | Filtros persisten en URL (shareable links) | Must |
| RF-EXPLORE-05 | Empty state cuando filtros no devuelven resultados | Must |
| RF-EXPLORE-06 | Filtro por distancia/radio | Could |

---

## Requerimientos no funcionales

| Categoría | Requerimiento |
|-----------|---------------|
| Notificaciones | Entrega async; no bloquear respuesta HTTP del clic contacto; reintentos |
| Email | Templates HTML simples; variables negocio y contexto de página |
| Storage | Cloudinary o S3; max 5MB/archivo; purge al eliminar recurso |
| Seguridad | Solo PROVIDER edita media de su negocio; ADMIN catálogo global |
| Performance | Explorar con filtros < 2s; lazy load imágenes en cards |
| Privacidad | No exponer teléfono cliente en email sin consentimiento |
| Accesibilidad | Upload con labels, errores inline, WCAG AA en nuevos componentes |

---

#### 1. Alcance (Fase 2)

* **Incluido:**
  - Email notificación al proveedor en contacto desde detalle frutería
  - Upload logo y portada proveedor
  - Filtros avanzados explorar (categoría, producto, verified, q en URL)
  - Sprint 0: cierre OBS Fase 1 P0/P1 (Backend OBS-001–003; Frontend OBS-01, OBS-04, P1)
  - Bitácora eventos CONTACT y MEDIA_UPLOAD

* **Fuera de Alcance:**
  - Checkout in-app, `POST /api/orders`, pagos en línea
  - Push notifications, SMS masivo
  - Galería múltiple por producto
  - App móvil nativa, reseñas, dashboard analytics
  - WhatsApp Business API (solo `wa.me` link en Should)

---

#### 2. Módulos Principales

1. **`NOTIFY`:** Notificaciones al proveedor cuando un cliente contacta; email Must, WhatsApp link Should; anti-spam y auditoría.
2. **`MEDIA`:** Gestión de imágenes de negocio (proveedor) y catálogo global (admin); validación y placeholders.
3. **`EXPLORE`:** Filtros avanzados conectados al backend; chips categoría, búsqueda por producto, URLs compartibles.

---

## Priorización MoSCoW Fase 2

| Prioridad | Items |
|-----------|-------|
| **Must** | NOTIFY email, MEDIA logo/portada, EXPLORE filtros API+UI, Sprint 0 OBS Fase 1 |
| **Should** | WhatsApp wa.me, admin imagen producto, feedback cliente, AUDIT CONTACT/MEDIA |
| **Could** | Formulario interés sin Order, filtro geográfico radio |
| **Won't** | Checkout, pagos, push, SMS, galerías múltiples |

---

## Métricas de éxito Fase 2

| Métrica | Objetivo |
|---------|----------|
| Proveedores con logo/portada | > 50% activos en 60 días |
| Tiempo notificación email | < 30s tras clic contacto |
| Sesiones con al menos 1 filtro en explorar | > 25% |
| Conversión explorar → contacto | +5pp vs baseline Fase 1 |

---

## Decisiones Fase 2

| # | Decisión | Estado | Recomendación PM |
|---|----------|--------|------------------|
| D-F2-1 | Proveedor email | Pendiente Arquitecto | Resend o SendGrid |
| D-F2-2 | Storage imágenes | Pendiente Arquitecto | Cloudinary MVP |
| D-F2-3 | WhatsApp | Should = wa.me link | API Business en Fase 3 |
| D-F2-4 | Datos en notificación | Productos vistos en detalle, sin PII cliente | Aprobado PM |
| D-F2-5 | Checkout (Decisión #2) | **Cerrada** — solo contacto directo | Sin Order en Fase 2 |

---

## Referencias

| Documento | Ubicación |
|-----------|-----------|
| PRD Fase 1 | `outputs/laborregamarket/prd.md` |
| User stories Fase 2 | `outputs/laborregamarket/user-stories/US-NOTIFY-*`, `US-MEDIA-*`, `US-EXPLORE-*` |
| Handoff UX | `outputs/laborregamarket/handoff-ux-ui-fase-2.md` |
| Handoff Arquitecto | `outputs/laborregamarket/handoff-arquitecto-fase-2.md` |
| Backlog | `outputs/laborregamarket/backlog.md` |
| Bitácora | `outputs/laborregamarket/OBSERVABILITY.md` |

---

*PRD Fase 2 generado por Agente Product Manager — LaBorregaMarket v0.2.0.*
