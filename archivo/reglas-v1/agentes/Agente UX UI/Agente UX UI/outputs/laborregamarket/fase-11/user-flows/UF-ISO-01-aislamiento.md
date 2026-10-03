> **Flujo:** Panel F10 opera solo sobre la sucursal activa
> **Historia de Usuario Asociada:** US-ISO-01, US-AUTH-11
>
> **Punto de entrada:** `/proveedor`, `/proveedor/pos`, `/proveedor/ordenes`, `/proveedor/dashboard` tras switcher o login.

> **Pasos del Usuario:**
> 1. `[Contexto]` → Encabezado de página muestra `businessName` de `activeProviderId` (H1 o eyebrow). N=1: mismo patrón F10 (solo el nombre, sin switcher).
> 2. `[Catálogo / POS / Órdenes / Reportes F10]` → Listados y mutaciones solo de la activa. SKU local de A no aparece al rotar a B.
> 3. `[Rotar a B]` → Las cuatro superficies recargan datos de B (mismo layout F10). Media disco y secciones de A desaparecen de la vista.

**Condicionales:**
- **IDOR (usuario fuerza id de B con A activa):** UI no ofrece atajos; si la API 403, ErrorBanner «Este recurso no pertenece a la frutería activa».
- **Loading rehidratación:** skeleton de la superficie actual; no flash de datos de A sobre B.
- **Empty catálogo B:** empty F10 («Aún no hay secciones» / sin productos), no el de A.

**Reglas UI:**
- No redibujar CAT/POS/DASH F10. Solo **contexto** (título + tokens).
- Cliente en `/fruteria/[id]` de A no ve inventario de B.

**Wireframes:** `WF-ISO-01-contexto-sucursal.md`.

## Inputs Utilizados

- **US:** `US-ISO-01`
- **WF F10 (solo lectura):** `fase-10/wireframes/WF-proveedor-catalogo-f10.md`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-11/user-flows/UF-ISO-01-aislamiento.md`
- **Agente Downstream:** Frontend Developer
