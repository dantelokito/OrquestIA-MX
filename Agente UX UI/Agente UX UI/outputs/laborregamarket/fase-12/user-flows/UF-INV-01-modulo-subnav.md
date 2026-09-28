> **Flujo:** Entrar al módulo inventario y navegar SubNav F12  
> **Historia de Usuario Asociada:** US-INV-01  
> **Pantalla destino:** `/proveedor/inventario`  
>
> **Pasos del Usuario:**
> 1. `[Login PROVIDER]` -> Completa sesión. Header F11 (switcher solo N>1) permanece.
> 2. `[SubNavProveedor]` -> Ve ítems en este orden: **Inventario** · Catálogo · POS · Órdenes · **Ventas** · Reportes generales (solo si N>1).
> 3. `[Condicional]` -> ¿N≤1?
>    - **Sí:** no existe el sexto ítem Reportes generales (regla F11 intacta).
>    - **No:** el sexto ítem apunta a `/proveedor/reportes-generales`.
> 4. `[Pantalla Inventario]` -> El primer ítem lleva a `/proveedor/inventario`. El listado muestra solo SKUs de la sucursal **activa**.
> 5. `[Ítem Ventas]` -> Abre `/proveedor/dashboard` (misma ruta F10/F11). No hay redirección a inventario ni a reportes generales.
> 6. `[Error 403]` -> Si un CUSTOMER/ADMIN intenta el módulo como dueño, o se fuerza id de otra sucursal: pantalla Error con copy «No puedes ver el inventario de otra frutería» + CTA Volver a Catálogo. Sin saldos inventados.

## Inputs Utilizados

- **PRD:** `Administrador de producto/Product Manager/outputs/laborregamarket/fase-12/prd.md`
- **US:** `fase-12/user-stories/US-INV-01-modulo-inventario-subnav.md`
- **IA previa:** `comun/information-architecture.md` v0.11.0

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-12/user-flows/UF-INV-01-modulo-subnav.md`
- **Agente Downstream:** Frontend Developer
- **Wireframe:** `WF-INV-01-subnav.md`
