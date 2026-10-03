# LaBorregaMarket — Entregables UX Fase 5

> **Agente:** UX/UI Designer  
> **Fecha:** 14/08/2026  
> **Estado diseño:** Completo — Quality Gate UX emitido (15/08/2026)  
> **Versión:** 0.5.0

Fase 5 introduce **mapa Leaflet/OSM** (revoca Google Maps JS en `/explorar`), **layout Explorar** (ubicación en banner, radio al pie del mapa), **catálogo inhabilitado en todos los canales** y **marca primario/secundario en sesión PROVIDER**.

---

## Índice de entregables

### Documentación compartida (`comun/`)

| Archivo | Versión | Descripción |
|---------|---------|-------------|
| [design-tokens.md](../comun/design-tokens.md) | v0.5.0 | Tokens F4 + marca por sesión, Leaflet, toggle Activo/Inactivo |
| [information-architecture.md](../comun/information-architecture.md) | v0.4.0 | Explorar Leaflet, config marca, visibilidad de canal |

### Handoff

| Archivo | Descripción |
|---------|-------------|
| [handoff-frontend.md](./handoff-frontend.md) | Sprint plan F5-A→C, APIs, DoD, a11y |
| [handoff-frontend-deuda.md](./handoff-frontend-deuda.md) | Addendum próxima fase: contacto 503/500, invariante Leaflet, fallback marca |
| [handoff-arquitecto.md](./handoff-arquitecto.md) | Leaflet, CSS sesión, contraste servidor, catálogo inactivo |

### User flows

| ID | Archivo | Alcance |
|----|---------|---------|
| UF-GEO-01 | [UF-GEO-01-mapa-leaflet-radio.md](./user-flows/UF-GEO-01-mapa-leaflet-radio.md) | Leaflet/OSM, CTA banner, radio overlay, favoritas compactas |
| UF-CAT-01 | [UF-CAT-01-inhabilitar-producto.md](./user-flows/UF-CAT-01-inhabilitar-producto.md) | Toggle Activo/Inactivo en todos los canales |
| UF-BRAND-01 | [UF-BRAND-01-colores-negocio.md](./user-flows/UF-BRAND-01-colores-negocio.md) | Picker + tema sesión PROVIDER |

### Wireframes

| ID | Archivo | Pantalla |
|----|---------|----------|
| WF-explorar-leaflet | [WF-explorar-leaflet.md](./wireframes/WF-explorar-leaflet.md) | `/explorar` Leaflet + banner + overlay radio |
| WF-proveedor-marca | [WF-proveedor-marca.md](./wireframes/WF-proveedor-marca.md) | Config colores + preview contraste |
| WF-catalogo-canales | [WF-catalogo-canales.md](./wireframes/WF-catalogo-canales.md) | Toggle, empty POS, carrito toast |
| WF-contacto-resiliencia | [WF-contacto-resiliencia.md](./wireframes/WF-contacto-resiliencia.md) | Toasts 429 / 503 / 500; `tel:` no se bloquea |

### Referencias Fase 1–4 (solo lectura)

| Tipo | Ruta |
|------|------|
| WF Explorar F4 (reemplazado) | [`../fase-4/wireframes/WF-explorar-geo.md`](../fase-4/wireframes/WF-explorar-geo.md) |
| User flows / WF F4 | [`../fase-4/`](../fase-4/README.md) |
| User flows F1–F3 | [`../fase-1/user-flows/`](../fase-1/user-flows/), [`../fase-3/`](../fase-3/README.md) |

No editar `fase-4/` ni fases anteriores.

---

## Decisiones de diseño Fase 5

| ID | Decisión | Rationale |
|----|----------|-----------|
| **D-F5-UX-1** | Favoritas en **barra compacta** (buscar + selector + Guardar) | Banner tiene un solo CTA de ubicación; radio vive en el mapa |
| **D-F5-UX-2** | Motor Leaflet + OSM; error de mapa = **solo red** | Cierra OBS-F4-023; no hay estado "sin API key" |
| **D-F5-UX-3** | Filtro Must = Haversine F4; viewport/clustering = Should | D-F5-3; no bbox Must |
| **D-F5-UX-4** | Toggle **Activo / Inactivo**; carrito **retira línea + toast** | No es stock; evita filas muertas |
| **D-F5-UX-5** | Tema scoped a sesión PROVIDER; CLIENT = plataforma | D-F5-6; no pintar cards ajenas |
| **CO-F5-001** | Google Maps JS revocada en Explorar | Dante: no se paga la API |

---

## Addendum deuda (16/08/2026)

Próxima fase: cerrar P0/P1 DevOps + P2-009/P2-011. Delta FE en [handoff-frontend-deuda.md](./handoff-frontend-deuda.md). No diseñar pasarela aquí.

---

## Quality Gate

| Documento | Estado |
|-----------|--------|
| [REVIEW-UX.md](./quality/REVIEW-UX.md) | APROBADO CON OBSERVACIONES — 86/100, 0 P0 (implementación FE) |
| [READY-FOR-QA.md](./quality/READY-FOR-QA.md) | Estafeta al Agente QA Tester |

---

## Fuera de alcance Fase 5 (diseño)

Pasarela de pagos, CFDI, PWA, flotilla, Google Maps JS en Explorar, bbox Must, tema proveedor en cards CLIENT/ADMIN, stock/agotado, paleta derivada del logo.

---

*Índice Fase 5 — Agente UX/UI Designer, LaBorregaMarket v0.5.0.*
