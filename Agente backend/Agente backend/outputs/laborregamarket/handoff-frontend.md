# Handoff Frontend — LaBorregaMarket Backend v0.2.0

> **De:** Backend Developer  
> **Para:** @Frontend Developer  
> **Fecha:** 10/08/2026

---

## Estado: ENTERADO ✅ — Backend Fase 2 listo para integración

Base URL local: `http://localhost:8080`  
Envelope: `{ data }` / `{ data, meta }` / `{ error, details? }` (ADR-003).

---

## Mapa pantalla → endpoint

| Pantalla UX | Endpoint(s) | Notas F2 |
|-------------|-------------|----------|
| `WF-login` | `POST /api/auth/login` | `{ data: { user } }`; cookie JWT |
| `WF-registro` paso 1 | `POST /api/auth/register` | Si `role=PROVIDER` → wizard paso 2 |
| `WF-registro` paso 2 | `POST /api/providers` | Sesión PROVIDER |
| `WF-header-auth` | `POST /api/auth/logout` | `{ data: { message } }` |
| `WF-explorar` | `GET /api/providers?city&q&category&verified&page&limit` | **Enviar `category` al server** (FRUTA\|VERDURA\|AGRICOLA). `q` min 2. Sync URL ↔ query (US-EXPLORE-03). Empty `data: []` → EmptyState (US-EXPLORE-04) |
| `WF-fruteria-detalle` | `GET /api/providers/[id]` | `products[].imageUrl` nullable |
| `WF-fruteria-detalle` contacto | `POST /api/providers/[id]/contact` | Body opcional `{ source, productIds }`. Toast US-NOTIFY-03; **no bloquear** `tel:`. Público |
| `WF-cuenta-cliente` | `GET/PATCH /api/users/me` | CLIENT |
| `WF-proveedor-panel` | `GET /api/provider/me` | 404 → onboarding |
| `WF-proveedor-panel` catálogo | `GET/PATCH /api/provider/products` | |
| `WF-proveedor-panel` media | `POST /api/provider/media` | multipart `file` + `field=logo\|cover` → `{ data: { url, field } }` |
| `WF-admin-panel` proveedores | `GET /api/admin/providers` | Campo `hasValidEmail` para badge sin email (US-NOTIFY-04) |
| `WF-admin-panel` producto imagen | `POST /api/admin/products/[id]/image` | multipart `file` → `{ data: { url, field: "imageUrl" } }` |
| `WF-admin-panel` bitácora | `GET /api/admin/audit?action=CONTACT` | También `MEDIA_UPLOAD` |
| `WF-admin-panel` catálogos | `GET /api/catalogs?catalog=` | |

---

## Contratos F2 — ejemplos

### Contacto

```http
POST /api/providers/{id}/contact
Content-Type: application/json

{ "source": "call_button", "productIds": [] }
```

```json
{ "data": { "notified": true, "message": "Frutería notificada" } }
```

429:

```json
{ "error": "Demasiados intentos. Intenta más tarde." }
```

### Media proveedor

```http
POST /api/provider/media
Content-Type: multipart/form-data
Cookie: <sesión PROVIDER>

file=<jpeg|png|webp ≤5MB>&field=logo
```

400 MIME:

```json
{
  "error": "Validation failed",
  "details": [{ "field": "file", "message": "Formato no permitido. Usa JPEG, PNG o WebP" }]
}
```

400 size: `"El archivo supera el límite de 5MB"`.

### Explorar

```http
GET /api/providers?category=FRUTA&q=mango&verified=true&page=1&limit=20
```

`q` con 1 carácter → 400 `Mínimo 2 caracteres`.

---

## US pendientes en Frontend (backend ya listo)

| US | Trabajo FE |
|----|------------|
| US-EXPLORE-01/02 | Chips categoría + search → query API |
| US-EXPLORE-03 | Persistencia filtros en URL |
| US-EXPLORE-04 | EmptyState + limpiar filtros |
| US-NOTIFY-03 | Toast / aria-live tras contact |
| US-MEDIA-01/02 | Forms upload |
| US-MEDIA-04/05 | Display + placeholders |

---

## Redirect post-login (UI)

| Rol | Default |
|-----|---------|
| CLIENT | `/cuenta` |
| PROVIDER | `/proveedor` (o wizard si sin Provider) |
| ADMIN | `/admin` |

---

## Errores HTTP esperados

| Código | Caso | Body ejemplo |
|--------|------|--------------|
| 400 | Validación | `{ error, details: [{ field, message }] }` |
| 401 | Sin sesión | `{ error: "..." }` |
| 403 | Rol incorrecto | `{ error: "Acceso denegado" }` |
| 404 | Provider/producto | `{ error: "Frutería no encontrada" }` / `"Producto no encontrado"` |
| 409 | Conflicto | `{ error: "..." }` |
| 429 | Rate limit contacto | `{ error: "Demasiados intentos. Intenta más tarde." }` |

---

## Contratos completos

Ver `Agente Arquitecto de Software/.../outputs/laborregamarket/api/API-NOTIFY-01.md`, `API-MEDIA-01.md`, `API-PROVIDERS-01.md`.

---

*Handoff generado por Backend Developer — LaBorregaMarket v0.2.0.*
