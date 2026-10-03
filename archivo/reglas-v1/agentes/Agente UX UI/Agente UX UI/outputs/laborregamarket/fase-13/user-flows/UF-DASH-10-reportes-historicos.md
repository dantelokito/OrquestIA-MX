> **Flujo:** Reportes de ventas cuadran con ítems ocultos o SKU inactivo (sin rediseño de layout)
> **Historia de Usuario Asociada:** US-DASH-10
>
> **Punto de entrada:** `/proveedor/dashboard?view=reportes` y `/proveedor/reportes-generales` (N>1). Layout F10/F11 **intactos**.

> **Pasos del Usuario:**
> 1. `[Consultar rango]` → GMV, top, series, print/PDF incluyen `OrderItem` snapshot aunque el producto esté oculto o `isActive=false`.
> 2. `[No evaporar]` → El ranking de catálogo vigente puede excluir no vendibles; los KPIs del rango **no**.
> 3. `[Error]` → 400 rango inválido (ADR-033); 401/403 sucursal ajena. Sin JOIN obligatorio a productos activos.
>
> **Reglas UI:** Cero pantallas nuevas Must. QA visual: mismos números vs baseline F10/F11.

## Inputs Utilizados

- **US:** `US-DASH-10`

## Outputs Generados

- **Archivo:** `fase-13/user-flows/UF-DASH-10-reportes-historicos.md`
