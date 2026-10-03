> **Flujo:** Admin lista catálogo maestro completo (GLOBAL + LOCAL)
> **Historia de Usuario Asociada:** US-ADMIN-05
>
> **Punto de entrada:** Login ADMIN → `/admin?tab=catalogos`. Chrome de **plataforma** (no `--brand` del negocio).

> **Pasos del Usuario:**
> 1. `[Tab Catálogos → Productos]` → Tabla única con SKU GLOBAL (alta admin) y LOCAL (alta proveedor). Columnas: nombre, `scope` (origen), `isActive`, dueño (solo LOCAL: `businessName`). CTA dominante de pantalla: **Nuevo producto** (sigue creando solo GLOBAL).
> 2. `[Filtros]` → `q` (nombre/slug), `scope` (Todos | GLOBAL | LOCAL), `isActive` (Todos | Activo | Inactivo), dueño (select de negocios; aplica a LOCAL; GLOBAL no tiene dueño).
> 3. `[Paginación visible]` → Default 50, selector 50/100. Muestra página actual y `meta.total`. Ir a siguiente/anterior. Prohibido `limit:100` silencioso como único truco.
> 4. `[Éxito]` → Lista coherente con filtros. Empty si no hay coincidencias (no error).
> 5. `[Condicional]` → ¿`page`/`limit` inválido (0, negativo, >100)?
>    - **Sí:** ErrorBanner 400; no lista parcial sucia.
>    - **No:** se renderiza la página pedida.
> 6. `[403 PROVIDER]` → Esta UI no existe en `/proveedor`. Si API admin se llama con rol PROVIDER: ErrorBanner «Sin permiso».
>
> **Reglas UI:**
> - Un CTA dominante: **Nuevo producto**. Filtros e Inhabilitar son secundarios.
> - No hay segunda bandeja Must de locales. No badge «N ofertas» (Could).
> - Copy: dueño vacío en GLOBAL = «Plataforma», no «sin dueño» ambiguo.
> - Wireframe: `WF-ADMIN-05-catalogo-completo.md`.

## Inputs Utilizados

- **PRD:** `Administrador de producto/Product Manager/outputs/laborregamarket/fase-13/prd.md`
- **US:** `US-ADMIN-05-catalogo-completo.md`
- **QG UX PM:** `fase-13/quality/QG-cobertura-UX.md`

## Outputs Generados

- **Archivo:** `Agente UX UI/Agente UX UI/outputs/laborregamarket/fase-13/user-flows/UF-ADMIN-05-catalogo-completo.md`
- **Agente Downstream:** Frontend Developer
