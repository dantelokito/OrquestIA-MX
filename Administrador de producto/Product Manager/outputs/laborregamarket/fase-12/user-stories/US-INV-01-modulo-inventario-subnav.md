# User Story — US-INV-01

> **ID:** US-INV-01  
> **Título:** Módulo inventario, SubNav primero y etiqueta Ventas  
>
> **Como:** PROVIDER  
> **Quiero:** un módulo `/proveedor/inventario` primero en la SubNav, con sucursal activa aislada, y ver “Ventas” donde hoy dice Dashboard  
> **Para:** administrar existencias de esa frutería sin mezclar sucursales ni perder el dashboard de ventas  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado un PROVIDER con sucursal activa A, cuando abro el panel, entonces la SubNav muestra en este orden: Inventario, Catálogo, POS, Órdenes, Ventas, y si N>1 también Reportes generales. Inventario es el primer ítem y lleva a `/proveedor/inventario`. Ventas apunta a `/proveedor/dashboard` (misma ruta que el Dashboard F10/F11). El módulo lista solo SKUs de A.
> - [ ] **Escenario 2 (Error IDOR):** Dado sucursal A activa, cuando pido inventario, tope o preferencias de sucursal B (mismo user u otro dueño) por id/query, entonces **403** y no hay mutación. Un CUSTOMER o ADMIN sin rol PROVIDER no opera este módulo como dueño.
> - [ ] **Regla de Negocio:** D-F12-2, D-F12-11, aislamiento F11. Inventario no compartido. Reportes generales siguen solo N>1. No redirigir Ventas a otra URL.

>
> **UX:** SubNav + empty/loading/error del módulo. **Arquitecto:** ownership por `activeProviderId`. **QA:** cruzar ids A↔B.

## Inputs Utilizados

- **PRD:** `outputs/laborregamarket/fase-12/prd.md`
- **Impacto:** `outputs/laborregamarket/fase-12/impacto-modulos.md`
- **Backlog:** `BL-200`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-12/user-stories/US-INV-01-modulo-inventario-subnav.md`
- **Agente Downstream:** UX/UI, Arquitecto, Backend, Frontend, QA
- **Fase / Proyecto:** 12 / laborregamarket
