# API-PROVIDER-01 — Panel proveedor

> **Módulo:** `PRODUCTS`, `PROVIDERS`  
> **Versión:** 0.1.0  
> **Fecha:** 05/08/2026

---

## GET `/api/provider/me`

> **Descripción:** Obtener perfil Provider del usuario autenticado.  
> **Autenticación:** Requerida — Rol `PROVIDER`  
> **Estado:** **Nuevo** (BL-002, BL-003)

#### Respuestas:

* **200 Success:**

```json
{
  "data": {
    "id": "clx...",
    "businessName": "Frutas El Paraíso",
    "address": "Av. Juárez 123, Centro",
    "city": "Monterrey",
    "latitude": 25.6714,
    "longitude": -100.3089,
    "phone": "+528112345678",
    "isVerified": true,
    "isActive": true
  }
}
```

* **404 Not Found:** Usuario PROVIDER sin entidad Provider.

```json
{ "error": "Perfil de proveedor no encontrado" }
```

UI muestra EmptyState + CTA "Completar registro de negocio".

* **401 Unauthorized** / **403 Forbidden**

---

## GET `/api/provider/products`

> **Descripción:** Catálogo global con estado ProviderProduct del proveedor logueado.  
> **Autenticación:** Requerida — Rol `PROVIDER`

#### Respuestas:

* **200 Success:**

```json
{
  "data": {
    "provider": {
      "id": "clx...",
      "businessName": "Frutas El Paraíso"
    },
    "catalog": [
      {
        "product": {
          "id": "clx...",
          "name": "Mango",
          "slug": "mango",
          "category": "FRUTA",
          "unit": "KG",
          "description": "Mango fresco de temporada"
        },
        "price": 45.00,
        "isAvailable": true,
        "providerProductId": "clx..."
      },
      {
        "product": {
          "id": "clx...",
          "name": "Piña",
          "slug": "pina",
          "category": "FRUTA",
          "unit": "PIEZA",
          "description": null
        },
        "price": null,
        "isAvailable": false,
        "providerProductId": null
      }
    ]
  }
}
```

**Incluye:** Todos los `Product` con `isActive=true`, ordenados por `category ASC`, `name ASC`.  
**price null + isAvailable false:** Producto no activado aún por el proveedor.

* **404 Not Found:** Sin Provider (mismo que `/api/provider/me`).

* **401** / **403**

---

## PATCH `/api/provider/products`

> **Descripción:** Activar/desactivar producto y actualizar precio.  
> **Autenticación:** Requerida — Rol `PROVIDER`

#### Body de Solicitud:

```json
{
  "productId": "string (requerido, ID del Product global)",
  "isAvailable": "boolean (requerido)",
  "price": "number (opcional, requerido si activar producto nuevo)"
}
```

#### Respuestas:

* **200 Success:**

```json
{
  "data": {
    "providerProduct": {
      "id": "clx...",
      "providerId": "clx...",
      "productId": "clx...",
      "price": 45.00,
      "isAvailable": true,
      "product": {
        "id": "clx...",
        "name": "Mango",
        "category": "FRUTA",
        "unit": "KG"
      }
    }
  }
}
```

* **400 Bad Request:**

| Caso | Mensaje |
|------|---------|
| Activar producto nuevo sin price | `"Debes especificar un precio para activar un producto nuevo"` |
| price < 0 | `"El precio debe ser mayor o igual a 0"` |
| Validación Zod | Mensaje del campo |

* **404 Not Found:** Sin Provider.

* **401** / **403**

#### Lógica upsert

```
Si ProviderProduct existe → UPDATE isAvailable, price (si enviado)
Si no existe Y price enviado → CREATE
Si no existe Y sin price → 400
```

#### Side effects

- `AuditLog`: `module=PRODUCTS`, `action=ENABLE|DISABLE`, `entityId=providerProduct.id`

---

## Nota: PATCH por productId en URL (opcional Fase 1.1)

El código actual usa `PATCH /api/provider/products` con `productId` en body.  
Opcionalmente se puede agregar `PATCH /api/provider/products/[productId]` — no requerido para MVP si se mantiene body.

---

## Referencias

- Products entity: [`../data-model/DB-products.md`](../data-model/DB-products.md)
- Catálogo flow: [`../diagrams/ARCH-CATALOG-01.md`](../diagrams/ARCH-CATALOG-01.md)
- UX: `WF-proveedor-panel.md`
