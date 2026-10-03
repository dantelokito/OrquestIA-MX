# Handoff Frontend — LaBorregaMarket Backend v0.5.0

> **De:** Backend Developer  
> **Para:** @Frontend Developer  
> **Fecha:** 14/08/2026

---

## Estado: LISTO PARA INTEGRAR — Must F5

Base URL local: `http://localhost:8080`  
Envelope: `{ data }` / `{ data, meta }` / `{ error, details? }` (ADR-003). Query geo F4 **sin cambios**.

---

## Mapa pantalla → endpoint (delta F5)

| Tema | Endpoint(s) | Notas |
|------|-------------|-------|
| Tema de sesión | `GET /api/auth/session` | Siempre **200**. Invitado: `authenticated: false`, `brand: null`. CLIENT/ADMIN: `brand: null`. PROVIDER con par válido: `brand: { primaryColor, secondaryColor, source: "provider" }`. Fallback `brand: null` si no hay par o contraste inválido. `Cache-Control: private, no-store`. **No** llamar `/api/provider/me` desde `/explorar` |
| Settings colores | `GET/PATCH /api/provider/me` | Campos extra `primaryColor` / `secondaryColor` (`#RRGGBB` o `null`). GET devuelve persistido (picker). PATCH exige **ambos** hex o **ambos** `null`. Contraste vs blanco: primario ≥ 4.5:1, secundario ≥ 3:1. Canonical `#` + uppercase. PATCH solo colores **no** dispara 403 Google |
| Admin colores | `PATCH /api/admin/providers/[id]` | Mismos campos de color; `isVerified` sigue opcional. `isVerified=false` no nullifica colores |
| Detalle / explorar | `GET /api/providers/[id]`, `GET /api/providers` | Productos inhabilitados **omitidos** (`isAvailable` en público siempre `true`). Samples/`_count` también exigen `Product.isActive` |
| Panel catálogo | `GET /api/provider/products` | **Sin filtrar** — el dueño ve inhabilitados para reactivar |
| Pedido / POS | `POST /api/orders`, `POST /api/provider/pos/sales` | Línea no vendible → **409** `"Producto no disponible"`. Orden no creada. Líneas libres POS exentas |
| Dashboard | `GET /api/provider/dashboard` | `topProducts` excluye `isAvailable=false`; venta rápida (`providerProductId: null`) se queda. KPIs históricos intactos |
| Explorar mapa | Query F4 intacta | `lat`/`lng`/`radiusKm` 1–25. Motor Leaflet = FE. Sin bbox Must |

---

## Ejemplos

### Sesión invitado

```http
GET /api/auth/session
```

```json
{ "data": { "authenticated": false, "role": null, "brand": null } }
```

### Sesión PROVIDER con marca

```json
{
  "data": {
    "authenticated": true,
    "role": "PROVIDER",
    "brand": {
      "primaryColor": "#1B5E20",
      "secondaryColor": "#0D47A1",
      "source": "provider"
    }
  }
}
```

Tras `POST /api/auth/logout`, volver a consultar session o limpiar CSS vars (plataforma).

### PATCH colores

```http
PATCH /api/provider/me
{ "primaryColor": "#1B5E20", "secondaryColor": "#0D47A1" }
```

Reset:

```json
{ "primaryColor": null, "secondaryColor": null }
```

400 par incompleto: `"Debes indicar primario y secundario, o restablecer ambos"`.  
400 contraste primario: `"El color primario no tiene contraste suficiente para texto blanco (WCAG AA 4.5:1)"`.

### Catálogo público

`GET /api/providers/{id}` ya **no** incluye `{ isAvailable: false }`. Ocultar en carrito/POS UI; el POST es la red de seguridad (409).

---

## Errores HTTP usados F5

400 validación (hex, par, contraste) · 401 · 403 (Google lock F4, no colores) · 404 · 409 (producto no disponible) · 500

Maps JS / Leaflet / teselas OSM son **Frontend**. BE no exige `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` para Explorar.
