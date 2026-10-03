# API-PROVIDER-SECTIONS-01 — Secciones dinámicas

> **Endpoints:** `GET/POST /api/provider/sections`, `PATCH/DELETE /api/provider/sections/[id]`, `PATCH /api/provider/sections/reorder`  
> **Módulo:** `PRODUCTS`  
> **Versión:** 0.10.2  
> **Fecha:** 28/08/2026  
> **US:** US-CAT-03  
> **ADR:** [`../../comun/adrs/ADR-030-provider-section.md`](../../comun/adrs/ADR-030-provider-section.md)  
> **Autenticación:** Requerida — Rol `PROVIDER` (dueño)

## Inputs Utilizados

- **US:** `US-CAT-03`
- **DB:** [`../data-model/DB-provider-sections.md`](../data-model/DB-provider-sections.md)

---

## GET `/api/provider/sections`

Lista plana del negocio, `sortOrder ASC`.

```json
{
  "data": [
    {
      "id": "clx...",
      "name": "Frutas de temporada",
      "sortOrder": 0,
      "productCount": 4
    }
  ]
}
```

Empty: `data: []` (200). 401 / 403 / 404 sin Provider.

---

## POST `/api/provider/sections`

```json
{ "name": "Chiles del rancho" }
```

| Campo | Validación |
|-------|------------|
| `name` | 1–40, trim, sin HTML |

`sortOrder` = max existente + 1 (o 0 si vacío). `nameNormalized` = lower(trim). Duplicado en el negocio → **409**.

#### 201

```json
{
  "data": {
    "id": "clx...",
    "name": "Chiles del rancho",
    "sortOrder": 3,
    "productCount": 0
  }
}
```

AUDIT `PRODUCTS` / `CREATE`, `entityId=section.id`. Rate limit: 30 / hora / provider.

---

## PATCH `/api/provider/sections/[id]`

Body: `{ "name": "Nuevo nombre" }` y/o `{ "sortOrder": 2 }` (un ítem). Renombrar a duplicado → 409. Id ajeno → **403**.

AUDIT `UPDATE`.

---

## PATCH `/api/provider/sections/reorder`

```json
{ "ids": ["clx1", "clx2", "clx3"] }
```

Debe ser **permutación exacta** de todas las secciones del negocio (misma longitud, sin ids ajenos). Se persiste `sortOrder` = índice. Incompleto o id ajeno → **400** / **403**.

AUDIT `UPDATE` con `details: { ids }`.

---

## DELETE `/api/provider/sections/[id]`

Solo si `productCount=0`. Si hay `ProviderProduct.sectionId` → **409**:

```json
{
  "error": "La sección tiene productos. Muévelos antes de eliminarla",
  "details": [{ "field": "id", "message": "Reasigna los productos a otra sección" }]
}
```

Id ajeno → **403**. AUDIT `DELETE`.

No hay cascade a productos. No hay “mover a Sin sección” Must.

---

## Errores comunes

| HTTP | Caso |
|------|------|
| 400 | Nombre vacío / HTML / reorder incompleto |
| 401 | Sin sesión |
| 403 | CLIENT/ADMIN o sección de otro provider |
| 404 | Id inexistente (cuid que no está en DB) |
| 409 | Nombre duplicado; delete no vacío |
| 429 | Rate limit altas |

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-10/api/API-PROVIDER-SECTIONS-01.md`
- **Agente Downstream:** Backend Developer
