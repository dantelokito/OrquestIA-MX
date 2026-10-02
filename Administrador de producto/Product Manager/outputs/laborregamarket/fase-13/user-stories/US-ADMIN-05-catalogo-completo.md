# User Story — US-ADMIN-05

> **ID:** US-ADMIN-05  
> **Título:** Admin ve el catálogo maestro completo (GLOBAL y LOCAL)  
>
> **Como:** ADMIN  
> **Quiero:** listar todos los SKU de `products` (GLOBAL y LOCAL), con origen, dueño, `isActive` y `scope`, y paginar de verdad  
> **Para:** tener seguimiento de lo que registran las fruterías y de la base de plataforma, sin recortar la lista en silencio  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado que existen SKU GLOBAL (alta admin) y SKU LOCAL (alta proveedor) en `products`, cuando abro Catálogos → Productos y pido `GET` admin de productos, entonces veo **ambos** orígenes. Cada fila muestra nombre, `scope`, `isActive`, y si es LOCAL el dueño (`ownerProviderId` / `businessName`). Puedo filtrar por `q`, `scope`, `isActive` y proveedor dueño (el filtro de dueño aplica a LOCAL; GLOBAL no tiene dueño). La UI muestra página actual, total de registros (`meta.total`) y permite ir a la siguiente página. Default **50** por página, máximo **100** (ADR-004). No se pide `limit:100` como único truco para «ver todo».
> - [ ] **Escenario 2 (Validación/Error):** Dado un `page` o `limit` inválido (0, negativo, >100), cuando listo, entonces recibo **400** sin lista parcial sucia. Dado un proveedor dueño que no existe, cuando filtro por él, entonces lista vacía o 400 según contrato (Arquitecto), **no** 500. Un PROVIDER que llama el endpoint admin recibe **403**.
> - [ ] **Regla de Negocio:** D-F13-2, D-F13-12. Esto **no** convierte LOCAL en comparable ni permite a otras fruterías activarlo. Alta admin **sigue** creando solo GLOBAL. No se listan filas de `provider_products` como si fueran SKU distintos (Could: badge «N ofertas», no Must). Envelope ADR-003.

>
> **UX:** tab Catálogos con columnas de origen/dueño y controles de página; filtro `isActive` (no segunda bandeja). **Arquitecto:** quitar `where: { scope: GLOBAL }` de `listAdminProducts`; incluir dueño. **QA:** LOCAL visible; paginación `meta`; 403 PROVIDER.

## Inputs Utilizados

- **PRD:** `outputs/laborregamarket/fase-13/prd.md`
- **Contrato vigente (roto a propósito):** ADR-029 listados admin solo GLOBAL
- **Código hoy:** `src/lib/services/admin-product.service.ts`, `AdminProductForm.tsx` (`limit: 100`)

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-13/user-stories/US-ADMIN-05-catalogo-completo.md`
- **Agente Downstream:** UX, Arquitecto, Backend, Frontend, QA
