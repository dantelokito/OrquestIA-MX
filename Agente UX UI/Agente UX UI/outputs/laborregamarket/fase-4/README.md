# LaBorregaMarket — Entregables UX Fase 4

> **Agente:** UX/UI Designer  
> **Fecha:** 14/08/2026  
> **Estado diseño:** Completo — Quality Gate UX emitido (14/08/2026)  
> **Versión:** 0.4.0

Fase 4 introduce **reseñas nativas post-entrega**, **vínculo Google Maps exclusivo de proveedores verificados**, **mapa Google con radio y direcciones favoritas**, **ETA en checkout**, **analytics de plataforma para ADMIN**, **báscula digital en POS** y **checkout delivery** (Should).

---

## Índice de entregables

### Documentación compartida (`comun/`)

| Archivo | Versión | Descripción |
|---------|---------|-------------|
| [design-tokens.md](../comun/design-tokens.md) | v0.4.0 | Tokens F3 + GEO, reseñas, ETA, báscula, admin KPIs |
| [information-architecture.md](../comun/information-architecture.md) | v0.3.0 | Maps, `/admin/analytics`, reseña, fulfillment |

### Handoff

| Archivo | Descripción |
|---------|-------------|
| [handoff-frontend.md](./handoff-frontend.md) | Sprint plan F4-A→F, APIs, DoD, a11y |
| [handoff-arquitecto.md](./handoff-arquitecto.md) | Maps JS lazy, WebSerial, embed, a11y lista |

### User flows

| ID | Archivo | Alcance |
|----|---------|---------|
| UF-GEO-01 | [UF-GEO-01-mapa-radio-favoritas.md](./user-flows/UF-GEO-01-mapa-radio-favoritas.md) | Maps, radio 1–25 km, pin, favoritas |
| UF-REV-01 | [UF-REV-01-resena-post-entrega.md](./user-flows/UF-REV-01-resena-post-entrega.md) | Calificar pedido DELIVERED; rating real |
| UF-REV-02 | [UF-REV-02-google-proveedor.md](./user-flows/UF-REV-02-google-proveedor.md) | Config Google verificado / bloqueado |
| UF-NOTIFY-01 | [UF-NOTIFY-01-eta.md](./user-flows/UF-NOTIFY-01-eta.md) | ETA checkout, detalle, copy notificaciones |
| UF-ADMIN-01 | [UF-ADMIN-01-analytics.md](./user-flows/UF-ADMIN-01-analytics.md) | Dashboard plataforma (distinto a F3) |
| UF-POS-02 | [UF-POS-02-bascula.md](./user-flows/UF-POS-02-bascula.md) | Conectar báscula, autodetección, fallback |
| UF-ORDERS-02 | [UF-ORDERS-02-checkout-delivery.md](./user-flows/UF-ORDERS-02-checkout-delivery.md) | Should: A domicilio |

### Wireframes

| ID | Archivo | Pantalla |
|----|---------|----------|
| WF-explorar-geo | [WF-explorar-geo.md](./wireframes/WF-explorar-geo.md) | `/explorar` Maps + radio + favoritas |
| WF-proveedor-google | [WF-proveedor-google.md](./wireframes/WF-proveedor-google.md) | Config Google + tiempo de preparación |
| WF-resena-pedido | [WF-resena-pedido.md](./wireframes/WF-resena-pedido.md) | Formulario reseña post-entrega |
| WF-carrito-eta | [WF-carrito-eta.md](./wireframes/WF-carrito-eta.md) | Checkout + ETA (+ delivery Should) |
| WF-admin-analytics | [WF-admin-analytics.md](./wireframes/WF-admin-analytics.md) | `/admin/analytics` |
| WF-pos-bascula | [WF-pos-bascula.md](./wireframes/WF-pos-bascula.md) | POS + estado báscula |
| WF-fruteria-reviews | [WF-fruteria-reviews.md](./wireframes/WF-fruteria-reviews.md) | Delta detalle: rating + embed |
| WF-cuenta-pedidos-f4 | [WF-cuenta-pedidos-f4.md](./wireframes/WF-cuenta-pedidos-f4.md) | Calificar + copy En camino |

### Referencias Fase 1–3

| Tipo | Ruta |
|------|------|
| User flows F1 | [`../fase-1/user-flows/`](../fase-1/user-flows/) |
| Wireframes F1 | [`../fase-1/wireframes/`](../fase-1/wireframes/) |
| User flows F2 | [`../fase-2/user-flows/`](../fase-2/user-flows/) |
| Wireframes F2 | [`../fase-2/wireframes/`](../fase-2/wireframes/) |
| User flows F3 | [`../fase-3/user-flows/`](../fase-3/user-flows/) |
| Wireframes F3 | [`../fase-3/wireframes/`](../fase-3/wireframes/) |
| Handoff F3 | [`../fase-3/handoff-frontend.md`](../fase-3/handoff-frontend.md) |
| Observabilidad | [`../historial/OBSERVABILITY.md`](../historial/OBSERVABILITY.md) |

---

## Decisiones de diseño Fase 4

| ID | Decisión | Rationale |
|----|----------|-----------|
| **D-F4-1** | Embed/enlace Google, no Places API; bloqueo informativo si `!isVerified` | Confianza real + incentivo a verificarse sin tono punitivo |
| **D-F4-2** | Google Maps JS API sustituye Leaflet en `/explorar` | Un solo motor de mapa; lista sigue siendo alternativa a11y |
| **D-F4-3** | Guardar favorita requiere sesión; invitado → login con pin preservado | Reutilizar ubicación en explorar y delivery |
| **D-F4-4** | ETA = preparación + traslado simple; copy "Listo aprox. en ~X min" | Estimación, no promesa contractual |
| **D-F4-5** | Delivery Should; pickup F3 intacto | GEO primero; "En camino" solo `DELIVERY` |
| **D-F4-6** | Autodetección VID/PID + selector manual + persistencia localStorage | No romper POS F3 si no hay báscula o WebSerial |
| **CO-F4-01** | Rating `0` se muestra "Sin reseñas todavía", no estrellas vacías | Evitar seed/falso vacío |
| **CO-F4-02** | Admin analytics en `/admin/analytics` (tab Analítica), no en dashboard proveedor | Distinguir plataforma vs negocio |
| **CO-F4-03** | Reseña Must = solo lectura si ya existe; edición es Should | Una reseña por pedido entregado |

---

## Quality Gate

| Documento | Estado |
|-----------|--------|
| [REVIEW-UX.md](./quality/REVIEW-UX.md) | APROBADO CON OBSERVACIONES — 82/100, 0 P0 (implementación FE) |
| [READY-FOR-QA.md](./quality/READY-FOR-QA.md) | Estafeta al Agente QA Tester |

---

## Fuera de alcance Fase 4 (diseño)

Pasarela de pagos, CFDI, PWA, logística de reparto (rutas/flotilla), importación de reseñas Google vía API, plantillas visuales de email/WhatsApp (solo copy ETA), fotos en reseña.

---

*Índice Fase 4 — Agente UX/UI Designer, LaBorregaMarket v0.4.0.*
