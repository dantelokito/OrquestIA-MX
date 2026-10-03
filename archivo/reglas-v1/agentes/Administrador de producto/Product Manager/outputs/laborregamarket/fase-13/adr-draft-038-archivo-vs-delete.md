# Borrador ADR-038 — Ocultar oferta vs inactivo vs delete; visibilidad admin GLOBAL+LOCAL

> **Estado:** Borrador PM (15/09/2026). **No** aceptado hasta que el Arquitecto lo formalice en `Agente Arquitecto/.../comun/adrs/ADR-038-*.md`.
> **Decisores previstos:** Arquitecto de Software (firma); PM fija intención de producto.
> **Fase:** 13 — cobertura
> **US:** US-ADMIN-05, US-ADMIN-06, US-CAT-14, US-CAT-15, US-CAT-16, US-DASH-10, US-SEC-04; **relacionadas (no son archivo):** US-CAT-18, US-INV-07
> **CO:** CO-F13-001

---

#### 1. Contexto y Problema

El dashboard proveedor (`getProviderCatalog`) lista **todos** los GLOBAL `isActive` más los LOCAL de la sucursal. El único control de «no vender» es `isAvailable` (ADR-022): Inactivo sigue en la lista. No hay DELETE de producto (PROVIDER `canDelete=false`; admin DELETE 405). El admin lista solo GLOBAL (ADR-029), así que no ve ni modera LOCAL.

Negocio: la base GLOBAL **debe** mostrarse al registrarse (no empty). El proveedor debe **ocultar** (copy «Eliminar») GLOBAL y LOCAL de *su* vista, sin borrar el maestro. El admin debe ver el historial.

#### 2. Opciones consideradas

* **Opción A — Hard-delete de `products` / `provider_products`:** pierde evidencia y rompe `OrderItem` / unique. Rechazada.
* **Opción B — Solo `isAvailable=false`:** no libera el dashboard (incidencia actual). Rechazada como única palanca.
* **Opción C — `archivedAt` en `provider_products`:** oculta por sucursal; unique intacto; admin no pierde el SKU. **Elegida.**
* **Opción D — Dashboard default «solo mis ofertas»:** contradice onboarding con base GLOBAL. Won't F13.

#### 3. Decisión elegida (intención PM)

**Opción C.** Campo `ProviderProduct.archivedAt` (`DateTime?`). Nombre de producto: **oculto / eliminado de la vista**. Nombre técnico: archivo de oferta.

### Reglas

| Superficie | Comportamiento F13 |
|------------|-------------------|
| GET panel dashboard | Excluir `archivedAt IS NOT NULL`. Incluir GLOBAL no archivados (con o sin oferta) + LOCAL no archivados. |
| GET `?archived=1` (o ruta equivalente) | Solo ofertas de la sucursal activa con `archivedAt`; para la bandeja. |
| «Eliminar» | Set `archivedAt=now()`. Si no hay oferta GLOBAL: **crear** `ProviderProduct` archivado (precio default no vendible: Arquitecto). |
| Restaurar | `archivedAt=null`. No recrea SKU. Conserva `isAvailable` y `sectionId`. |
| Vendible (explorar, fruteria, orders, POS) | `isAvailable` + `product.isActive` + `archivedAt IS NULL`. |
| Inventario listado | No mostrar filas archivadas. |
| Admin GET productos | **Todos** los `Product` (GLOBAL+LOCAL), no cada `ProviderProduct`. PATCH `isActive` LOCAL y GLOBAL. DELETE 405. |
| Reportes | `OrderItem` snapshot; no filtrar por producto activo/no archivado. |

### Enmiendas a ADRs vigentes

- **ADR-029 listados:** «CRUD admin solo GLOBAL» pasa a «alta admin solo GLOBAL; **listado y `isActive` cubren LOCAL**». Comparable/activar-en-otras-fruterías sigue solo GLOBAL.
- **ADR-022:** «GET panel = catálogo completo» ya no incluye ocultos. Inactivos **sí**. Vendible suma no archivado. Prohibido seguir usando `isAvailable` como único flag de «quitar de la vista».

### Qué NO hacer

- DELETE SQL. Liberar unique al ocultar. `ProviderProduct.isActive` (sigue `isAvailable`). Auto-global. Tabla `LocalProduct`. Segunda bandeja admin de inactivos.

#### 3b. Nota PM para Arquitecto (unidad de oferta — no es el tema de este ADR)

D-F13-15 **enmendado** 16/09: el proveedor **no** muta `Product.unit` del maestro GLOBAL; **sí** persiste la unidad de venta de **su** oferta (esta sucursal), con fallback al maestro. Mismo aislamiento que el precio. Campo (`ProviderProduct.unit` o equivalente) lo elige Arquitecto en ADR propio o extensión; **no** mezclar con `archivedAt`. POS/Encargar/inventario/catálogo leen esa unidad. No SKU LOCAL nuevo para cambiar unidad.

#### 4. Consecuencias

* **Positivas:** onboarding con base; dashboard aligerable; admin con trazabilidad; reportes intactos.
* **Riesgos:** crear oferta solo para ocultar un GLOBAL nunca vendido (precio default). Arquitecto elige 0 vs sentinel y si `isAvailable` nace en false.
* **Compensación:** unique ocupado a propósito (restaurar, no recrear).

## Referencias

- PRD `fase-13/prd.md`, CO-F13-001 (delta Editar/unidad-oferta 16/09)
- ADR-022, ADR-029 (solo lectura; este borrador pide enmienda)
- `US-CAT-18` / D-F13-15: unidad de oferta (fuera del núcleo archivo-vs-delete)
