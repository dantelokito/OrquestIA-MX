> **Flujo:** Operación plataforma — panel admin
> **Historia de Usuario Asociada:** — (módulos AUDIT, PRODUCTS, PROVIDERS; rol ADMIN)
>
> **Punto de entrada:** Login ADMIN → `/admin`
>
> **Pasos del Usuario:**
> 1. `[Pantalla: /admin]` → Usuario ve tabs: Catálogos | Proveedores | Bitácora.
> 2. `[Tab Catálogos]` → Lista 7 catálogos del sistema (read-only JSON en MVP).
> 3. `[Tab Proveedores]` → Lista proveedores con estado verificación; toggle verificar manualmente (MVP).
> 4. `[Tab Bitácora]` → Tabla eventos AUDIT: login, logout, registro, cambios producto.
> 5. `[Filtros bitácora]` → Por módulo, fecha, usuario (opcional MVP).
>
> **Condicionales:**
> - **Loading:** → Skeleton tabs + contenido.
> - **Empty bitácora:** → "No hay eventos registrados".
> - **Success:** → Datos renderizados según tab activo.
> - **Error:** → ErrorBanner por tab.
>
> **Reglas UI:**
> - Solo rol ADMIN accede; otros roles redirect.
> - MVP catálogos: vista JSON read-only (ya implementado parcialmente).
> - Verificación proveedores: manual por admin (asunción A4 PM).
