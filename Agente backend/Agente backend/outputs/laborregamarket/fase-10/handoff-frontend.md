# Handoff Frontend — LaBorregaMarket Backend v0.10.2

> **De:** Backend Developer  
> **Para:** @Frontend Developer  
> **Fecha:** 28/08/2026

---

## Estado: LISTO PARA INTEGRAR — Must F10 (SEC + CAT + MEDIA + DASH)

Base URL local: `http://localhost:8080`  
Envelope JSON: `{ data }` / `{ error, details? }` (ADR-003). Cookie: `credentials: 'include'` (ADR-025).  
F9 Explorar chips, F8 clamp/MX, F7 preview y PDF F6 **siguen**. `US-DASH-09` print CSS es **solo FE**. Demo copy en `/login` (`US-SEC-03`) es **solo FE**.

Migración Prisma Must: `add_product_scope_sections_media` (`npx prisma migrate dev` o `deploy`). Env: `UPLOADS_DIR` (default `./uploads`).

---

## Mapa pantalla → endpoint (delta F10)

| Tema | Endpoint(s) | Notas |
|------|-------------|-------|
| CRUD catálogo global ADMIN | `GET/POST /api/admin/products`, `PATCH /api/admin/products/[id]` | Solo `scope=GLOBAL`. DELETE HTTP → **405**. Imagen: `POST .../products/[id]/image` |
| Flags proveedor ADMIN | `PATCH /api/admin/providers/[id]` | `isVerified`, `isActive`, `offersWholesale`, `offersDelivery` + par de colores F5. `isVerified=false` apaga Google en la misma tx |
| Alta SKU local | `POST /api/provider/local-products` | PROVIDER dueño. `sectionId` propio. No usar `POST /api/admin/products` |
| Editar local | `PATCH /api/provider/local-products/[id]` | `id` = `ProviderProduct.id`. GLOBAL por esta ruta → **400** |
| Panel catálogo | `GET /api/provider/products` | GLOBAL activos + LOCAL propios. `scope`, `sectionId`, `imageUrl` resuelto |
| Toggle GLOBAL | `PATCH /api/provider/products` | Sigue F1. Acepta `sectionId` opcional. LOCAL → 400/403 |
| Secciones | `GET/POST /api/provider/sections`, `PATCH/DELETE .../[id]`, `PATCH .../reorder` | Delete solo vacía → **409**. Reorder = permutación exacta |
| Media disco | `POST /api/provider/media`, `POST /api/provider/products/[providerProductId]/image`, `GET /api/media/[filename]` | URL `/api/media/{id}.{ext}`. Público el GET. Sin Cloudinary |
| Reportes rango | `GET /api/provider/reports?from=&to=` | XOR vs `grain`+`date`. `productIds` repetible. Print = CSS FE |
| Detalle frutería | `GET /api/providers/[id]` | Vendibles + `scope` / `sectionId` / `sectionName` / `sectionSortOrder` |

---

## Shapes relevantes

### Panel `GET /api/provider/products` (fila)

```json
{
  "scope": "LOCAL",
  "sectionId": "clx...",
  "sectionName": "Frutas de temporada",
  "imageUrl": "/api/media/ab12.jpg",
  "providerProductId": "clx...",
  "price": 38.5,
  "isAvailable": true,
  "product": { "id": "clx...", "name": "Chile del rancho", "category": null, "unit": "KG" }
}
```

`imageUrl` resuelto: `ProviderProduct.imageUrl ?? Product.imageUrl`. Orden: `section.sortOrder` ASC (sin sección al final), luego nombre.

### Detalle público (ítem vendible)

```json
{
  "providerProductId": "clx...",
  "scope": "GLOBAL",
  "sectionId": "clx...",
  "sectionName": "Frutas de temporada",
  "sectionSortOrder": 0,
  "category": "FRUTA",
  "imageUrl": "/api/media/ab12.jpg"
}
```

LOCAL: `category` es `null`. FilterBar Explorar `category=` sigue `FRUTA|VERDURA|AGRICOLA` (solo GLOBAL). Agrupar vitrina por `section.sortOrder`.

### Reportes modo F10

Query: `from=YYYY-MM-DD&to=YYYY-MM-DD` (inclusive, TZ Monterrey). **Prohibido** mezclar con `grain`/`date`.

`productIds` repetible = `ProviderProduct.id` o `quickSale`. Ausente/vacío = todos con movimiento. Id ajeno → **403**.

GMV = `SUM(subtotal)` de líneas incluidas. `products[]` completo (no top 5). `series` un punto por día (ceros si no hay venta). Empty: `empty: true`, HTTP **200**.

Atajo de mes = FE rellena `from`/`to`. PDF F6 (`grain`/`date`) **no** cubre este corte.

### Media

Preview con la URL persistida `/api/media/…` (mismo origin). Copy sin “nube”. Fallo de disco → **500** genérico.

---

## Códigos

| Caso | HTTP |
|------|------|
| Sin cookie | 401 |
| CLIENT en `/api/admin/*` o PROVIDER en ruta ajena | 403 |
| ADMIN sin permiso de módulo | 403 `"Sin permiso para este módulo"` |
| Validación Zod / from>to / span>366 / mezcla grain+from | 400 |
| Slug global duplicado / sección duplicada / sección con productos / hard-delete | 409 |
| DELETE `/api/admin/products/[id]` | 405 |
| Rate altas (admin 60/h, local 30/h, secciones 30/h, media 20/10 min) | 429 |

---

## Fuera de alcance BE

Print CSS, demo copy login/registro, agrupar UI por sección, atajo mes, checkboxes `productIds`, promover LOCAL→GLOBAL (Should), Cloudinary/S3, CRUD usuarios, pan→radio, reopen F7/F8/F9.
