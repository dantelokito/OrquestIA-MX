> **Flujo:** Admin lista una fila por sucursal (flags F10)
> **Historia de Usuario Asociada:** US-ADMIN-11 (extiende US-ADMIN-03, no reabre el archivo F10)
>
> **Punto de entrada:** `/admin` tab Proveedores.

> **Pasos del Usuario:**
> 1. `[Tab Proveedores]` → Tabla con **una fila por `Provider`**, no por dueño. Seed F11: **Frutas El Paraíso**, **El Paraíso Tecnológico**, **Campo Verde Frutería** (mínimo 3).
> 2. `[Columnas]` → Nombre de sucursal (`businessName`), email del dueño (puede repetirse), colonia/dirección corta, flags F10: verificado, activo, mayoreo, a domicilio. Switches ≥44px.
> 3. `[Toggle flag en Tecnológico]` → PATCH solo a ese `Provider.id`. Centro y Campo Verde **no** cambian.
> 4. `[Éxito]` → switch refleja el nuevo valor; toast no bloqueante opcional.

**Condicionales:**
- **Loading:** skeleton filas; tab usable.
- **Empty:** «No hay sucursales registradas» (no aplica en seed demo).
- **Error 403/401:** ErrorBanner F10; CLIENT/PROVIDER no ven el tab.
- **Error 500:** «No se pudieron guardar los flags» + revert visual del switch.
- **Filtro/búsqueda Should:** no Must F11.

**Reglas UI:**
- Columna **Sucursal** es la primaria (nombre comercial), no el email.
- Mismo `AdminFlagSwitch` F10. Chrome ADMIN = marca plataforma (`US-BRAND-02`).
- Sin CRUD usuarios, sin `US-ADMIN-04`, sin listado de órdenes.

**API esperada:** listado y PATCH por `Provider.id` (Arch).

**Wireframes:** `WF-ADMIN-11-filas-sucursal.md`.

## Inputs Utilizados

- **US:** `US-ADMIN-11`
- **WF F10 (solo lectura):** `fase-10/wireframes/WF-admin-catalogos.md`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-11/user-flows/UF-ADMIN-11-filas-sucursal.md`
- **Agente Downstream:** Frontend Developer
