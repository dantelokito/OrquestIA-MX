# Handoff UX/UI — Fase 4

> **De:** Product Manager  
> **Para:** @UX/UI Designer  
> **Fecha:** 14/08/2026

Diseño F4 **por hacer** (a diferencia de F3, aquí no hay código previo que documentar). Producir flujos y wireframes para:

| US | Flujo a diseñar | Notas |
|----|------------------|-------|
| US-GEO-01…03 | `UF-GEO-01` mapa Google + radio, favoritas | Sustituye el mapa Leaflet en `/explorar`; slider de radio 1–25 km; picker de ubicación con pin arrastrable; selector de direcciones favoritas |
| US-REV-01…04 | `UF-REV-01` reseña post-entrega, `UF-REV-02` config Google (proveedor) | Config con dos estados: habilitado (verificado) / bloqueado con copy "Requiere verificación" (no verificado) |
| US-NOTIFY-09 | `UF-NOTIFY-01` ETA en checkout/detalle pedido | Copy "Listo aprox. en ~X min"; mismo copy en email/WA (contenido, no diseño de plantilla de email) |
| US-ADMIN-01 | `UF-ADMIN-01` dashboard analytics plataforma | Diferenciar visualmente del dashboard ilustrativo de proveedor (F3) |
| US-POS-05…06 | `UF-POS-02` conectar báscula | Estado conectado/desconectado, selector de modelo si no autodetecta |
| US-ORDERS-05 | `UF-ORDERS-02` checkout delivery (Should) | Reutilizar máquina de estados F3; copy "En camino" solo si `fulfillmentType=DELIVERY` |

**DoD UX F4:**
- WCAG AA en el mapa (alternativa de lista a los resultados, no solo visual)
- Estados vacío/error/carga en las 6 pantallas nuevas
- No romper flujos F3 vigentes (checkout pickup, POS, dashboard proveedor)
- El bloque "Requiere verificación" (US-REV-04) debe leerse como informativo, no punitivo

**Salida esperada:** `Agente UX UI/outputs/laborregamarket/fase-4/` (user-flows, wireframes, `quality/REVIEW-UX.md`).

**No diseñar:** pasarela de pagos, CFDI, PWA, logística de reparto real (rutas/flotilla), importación de reseñas de Google vía API.
