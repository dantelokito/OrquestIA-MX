# Handoff UX/UI — Fase 5

> **De:** Product Manager  
> **Para:** @UX/UI Designer  
> **Fecha:** 14/08/2026

Diseño F5 **por hacer**. Delta sobre F4, no rediseñar reseñas, ETA, báscula ni delivery. Producir flujos y wireframes para:

| US | Flujo a diseñar | Notas |
|----|------------------|-------|
| US-GEO-04 | Delta `UF-GEO-01` — motor de mapa Open Source | Mapa usable **sin** clave Google. Lista = alternativa a11y. Attribution OSM. Clustering Should. |
| US-GEO-05 | Layout Explorar F5 | **Usar mi ubicación** en banner superior (header/FilterBar). Slider radio **overlay inferior del mapa** (1–25 km). No dejar radio ni CTA en la LocationBar de `WF-explorar-geo` F4. Favoritas F4: barra compacta o banner — tú decides. |
| US-CAT-01 | `UF-CAT-01` toggle producto | Clarificar activo/inactivo. Empty POS si el catálogo queda vacío. No diseñar stock/agotado. |
| US-BRAND-01 | `UF-BRAND-01` picker de colores | Primario + secundario en config de negocio. Preview de contraste Should. Reset a marca plataforma. |
| US-BRAND-02 | Theming sesión PROVIDER | Tokens scoped: panel, POS, ops, dashboard y `/explorar` **si** sesión PROVIDER. CLIENT/ADMIN/invitado = marca plataforma. No pintar cada card del marketplace con un color distinto. |

**DoD UX F5:**

- WCAG AA: slider radio operable por teclado; CTA ubicación ≥44px; primario guardable solo si el CTA (texto blanco) cumple contraste (o estado de error claro).
- Cuatro estados en Explorar: loading, success, empty radio, mapa caído por **red** (lista usable). Ya no existe el estado "Mapa no disponible por falta de API key".
- No romper checkout pickup F3, GEO radio API F4, ni embed Google de reseñas (`US-REV-03`).
- No diseñar pasarela, CFDI, PWA ni flotilla.

**Salida esperada:** `Agente UX UI/outputs/laborregamarket/fase-5/` (user-flows, wireframes, `quality/REVIEW-UX.md`). Actualizar `design-tokens.md` con tokens de marca **por proveedor** (sesión PROVIDER).

**No diseñar:** Google Maps JS en Explorar, pagos, bounding-box como filtro Must (viewport sync de lista es Should).
