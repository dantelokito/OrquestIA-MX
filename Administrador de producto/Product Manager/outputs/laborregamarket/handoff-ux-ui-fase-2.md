# Handoff UX/UI — LaBorregaMarket Fase 2

> **De:** Agente Product Manager  
> **Para:** @UX/UI Designer  
> **Fecha:** 09/08/2026  
> **Versión:** 0.2.0 (Transacciones)  
> **Prioridad:** NOTIFY, MEDIA, EXPLORE (filtros avanzados)

---

## Objetivo

Diseñar flujos, wireframes y estados para: notificación al proveedor en contacto, upload de imágenes y filtros avanzados en explorar — **sin checkout in-app**.

**Convención salida:** `Agente UX UI/outputs/laborregamarket/user-flows/` y `wireframes/`

---

## Inputs

| Documento | Ubicación |
|-----------|-----------|
| PRD Fase 2 | `outputs/laborregamarket/prd-fase-2.md` |
| User stories | `US-NOTIFY-*`, `US-MEDIA-*`, `US-EXPLORE-*` |
| Wireframes Fase 1 | `Agente UX UI/outputs/laborregamarket/wireframes/` |
| Design tokens | `design-tokens.md` |

---

## Flujos prioritarios

### UF-NOTIFY-01 — Contacto con notificación

> **Historias:** US-NOTIFY-01, US-NOTIFY-02, US-NOTIFY-03

1. `[Pantalla: /fruteria/[id]]` → Cliente hace clic "Llamar" o CTA contacto.
2. `[Paralelo]` → Registro evento + email async al proveedor.
3. `[Feedback]` → Toast "La frutería fue notificada" (3–5s, `aria-live="polite"`).
4. `[Acción]` → `tel:` inicia llamada sin bloqueo.
5. `[Opcional Should]` → Segundo CTA "WhatsApp" con `wa.me` y mensaje pre-llenado.

**Estados:** default, loading breve en botón, success toast, error toast (red no bloquea llamada).

---

### UF-MEDIA-01 — Upload logo y portada proveedor

> **Historias:** US-MEDIA-01, US-MEDIA-03, US-MEDIA-05

1. `[Pantalla: /proveedor]` → Sección "Imagen del negocio".
2. `[Upload logo]` → Preview circular + botón "Cambiar logo".
3. `[Upload portada]` → Preview banner + botón "Cambiar portada".
4. `[Validación]` → Error inline formato/tamaño.
5. `[Success]` → Preview actualizado + confirmación breve.

**Wireframe:** `WF-proveedor-media.md` (nuevo)

---

### UF-MEDIA-02 — Admin imagen producto

> **Historias:** US-MEDIA-02

1. `[Pantalla: /admin]` → Tab catálogos o productos.
2. `[Selección producto]` → Upload thumbnail.
3. `[Success/Error]` → Igual patrón validación MEDIA.

---

### UF-EXPLORE-02 — Filtros avanzados

> **Historias:** US-EXPLORE-01 a US-EXPLORE-04

1. `[Pantalla: /explorar]` → Chips Frutas | Verduras | Agrícolas | Verificadas.
2. `[URL]` → `?category=FRUTA&q=mango&verified=true`.
3. `[Empty]` → EmptyState + "Limpiar filtros".
4. `[Móvil]` → Mapa visible debajo lista (cierra OBS-01 Sprint 0).

**Wireframe:** extender `WF-explorar.md` con chips activos y empty filtrado.

---

## Pantallas a wireframear

| Pantalla / componente | Objetivo | Estados |
|----------------------|----------|---------|
| CTA contacto detalle frutería | Llamar + feedback + WhatsApp opcional | default, loading, toast ok/error |
| Sección media proveedor | Upload logo/portada | empty, preview, uploading, error |
| Admin producto imagen | Thumbnail upload | igual MEDIA |
| Explorar filtros | Chips + URL sync | chips on/off, empty, loading |
| ImagePlaceholder | Sin imagen negocio/producto | único estado neutro |

---

## DoD UX Fase 2

- [ ] WCAG AA en nuevos componentes upload y toast
- [ ] Un CTA dominante en detalle frutería (Llamar)
- [ ] Touch targets 44px en chips y botones upload
- [ ] Mobile-first: mapa en explorar móvil
- [ ] Lazy load imágenes en cards

---

## Gaps Sprint 0 (coordinar con Frontend)

Antes de Fase 2 features, cerrar en UX spec: OBS-01 mapa móvil, OBS-04 precio editable — referencia `WF-proveedor-panel.md`.

---

## Entregables esperados UX

1. `UF-NOTIFY-01-contacto.md`
2. `UF-MEDIA-01-upload-proveedor.md`
3. `UF-EXPLORE-02-filtros.md`
4. `WF-proveedor-media.md`, `WF-contacto-cta.md`
5. Actualización `WF-explorar.md`

---

*Handoff PM Fase 2 — LaBorregaMarket v0.2.0*
