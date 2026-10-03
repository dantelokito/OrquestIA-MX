# User Story — US-SEC-04

> **ID:** US-SEC-04  
> **Título:** Ocultar no habilita DELETE de productos  
>
> **Como:** operador de plataforma  
> **Quiero:** que PROVIDER siga sin `canDelete` en PRODUCTS y que no exista DELETE HTTP de producto ni de oferta  
> **Para:** no perder evidencia de ventas ni abrir malas prácticas de borrado  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado el seed de permisos, cuando un PROVIDER consulta su matriz, entonces `PRODUCTS.canDelete=false`. La UI de catálogo **no** llama DELETE de `products` ni de `provider_products`. Ocultar usa PATCH (o POST de archivo) documentado. Admin DELETE de producto **sigue 405**. `assertProductHardDeleteAllowed` (o equivalente) **no** se relaja para «limpiar» ocultos.
> - [ ] **Escenario 2 (Validación/Error):** Dado un cliente que fuerza `DELETE /api/provider/products/[id]` o `DELETE /api/admin/products/[id]`, entonces **405** o **404** de ruta, **nunca** 204 con fila borrada. Un ADMIN con `canDelete=true` en seed **tampoco** borra SQL de producto en F13 (el 405 permanece). Intento de borrar sección con productos ocultos → **409** (F10).
> - [ ] **Regla de Negocio:** D-F13-3, D-F13-5. Archivar ≠ delete. No se enciende `canDelete` PROVIDER. Envelope ADR-003.

>
> **UX:** no icono de basura que implique borrado de base. **Arquitecto:** no nuevas rutas DELETE. **QA:** 405/404 DELETE; seed `canDelete`; 409 secciones.

## Inputs Utilizados

- **PRD:** `outputs/laborregamarket/fase-13/prd.md`
- **Seed:** `prisma/seed.ts` PROVIDER `canDelete: false` en PRODUCTS
- **Código hoy:** `src/app/api/admin/products/[id]/route.ts` DELETE 405

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-13/user-stories/US-SEC-04-sin-delete-productos.md`
- **Agente Downstream:** Arquitecto, Backend, Frontend, QA
