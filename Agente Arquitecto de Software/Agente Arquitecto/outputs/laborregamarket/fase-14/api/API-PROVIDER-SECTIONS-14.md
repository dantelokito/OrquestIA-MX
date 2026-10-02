# API-PROVIDER-SECTIONS-14 — 409 al eliminar sección con productos (mensaje usable)

> **Endpoint:** `DELETE /api/provider/sections/[id]`  
> **Descripción:** La regla F10 **no cambia**. Este delta fija el body 409 para que Frontend lo muestre fuera del form colapsado «Nueva sección».  
> **Autenticación:** Requerida — PROVIDER + sucursal activa  
> **Módulo:** `PRODUCTS`  
> **Versión:** 0.14.0  
> **Fecha:** 2026-09-17  
> **US:** US-CAT-23  
> **ADR:** ADR-030, ADR-003, ADR-002  
> **Envelope:** ADR-003  
> **Base (solo lectura):** `fase-10/api/API-PROVIDER-SECTIONS-01.md`

## Inputs Utilizados

- PRD D-F14-15
- Contrato F10 DELETE sección

---

## DELETE `/api/provider/sections/[id]`

Solo si no hay `ProviderProduct.sectionId` apuntando a la sección (visibles **o** archivados cuentan). Vacía → **2xx** como F10.

#### 409 — sección con productos (Must, body usable)

```json
{
  "error": "La sección tiene productos. Muévelos antes de eliminarla",
  "details": [
    {
      "field": "id",
      "message": "Reasigna los productos a otra sección"
    }
  ]
}
```

- HTTP **409** (no 400). Sección y productos **permanecen**.
- `error` es string ADR-003 (no objeto). Frontend Must leer `error` (y `details[0].message` si existe) en un banner/toast **fuera** del form «Nueva sección».
- Id ajeno → **403**. Inexistente → **404**. Sin auth → **401**.

No hay cascade. No hay «mover a Sin sección» Must. No hard-delete de productos.

## Errores

| HTTP | Caso |
|------|------|
| 400 | No usado en DELETE vacío/lleno (el conflicto es 409) |
| 401 | Sin sesión |
| 403 | Rol / IDOR |
| 404 | Id inexistente |
| 409 | Sección con productos |
| 500 | Error interno |

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/api/API-PROVIDER-SECTIONS-14.md`
- **Agente Downstream:** Backend Developer, Frontend
