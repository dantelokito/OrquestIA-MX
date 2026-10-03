> **Flujo:** Reportes generales N>1 — solo inventarios actuales
> **Historia de Usuario Asociada:** US-DASH-13
>
> **Punto de entrada:** `/proveedor/reportes-generales` (oculto si N=1).

> **Pasos del Usuario:**
> 1. `[Módulo N>1]` → Además de ventas consolidadas F11, bloque **Inventario actual** por sucursal: `businessName`, SKU, on-hand (unidad de oferta o fallback).
> 2. `[Copy]` → «Saldos ahora. El historial de entradas está en Reportes de cada sucursal.» No prometer historial aquí.
> 3. `[N=1]` → El módulo no se muestra (regla F11).
> 4. `[Print inventario generales]` → Should (igual print consolidado F11). No Must.
> 5. `[Error]` → 403 N=1 o user ajeno. El rango de ventas **no** filtra el saldo actual.
>
> **Reglas UI:** Look PROVIDER, no analytics admin. Wireframe: `WF-DASH-13-inventario-generales.md`.

## Inputs Utilizados

- **US:** `US-DASH-13`

## Outputs Generados

- **Archivo:** `fase-13/user-flows/UF-DASH-13-inventario-generales.md`
