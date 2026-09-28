> **Flujo:** Alta de sucursal N+1 reusando `/registro/negocio`
> **Historia de Usuario Asociada:** US-ONB-01
>
> **Punto de entrada:** menú usuario PROVIDER o pie del `ProviderSwitcher` → «Agregar frutería» → `/registro/negocio`.

> **Pasos del Usuario:**
> 1. `[Sesión PROVIDER con ≥1 negocio]` → CTA «Agregar frutería» (texto, no icono solo). Destino la ruta existente.
> 2. `[Formulario]` → Mismos campos F1/F5 (`BusinessOnboardingClient`). Copy H1 **«Nueva frutería»**. Lead: «Se sumará a tu mismo usuario. Catálogo, POS y pedidos quedan aislados.» **No** «Crea tu cuenta».
> 3. `[Condicional validación]` → ¿Campos requeridos válidos?
>    - **Sí:** crea `Provider` adicional; N incrementa; `activeProviderId` = sucursal nueva (según Arch); redirect `/proveedor` con contexto de la nueva.
>    - **No:** errores inline; no POST exitoso.
> 4. `[Post-alta N=2]` → Aparecen `ProviderSwitcher` y nav **Reportes generales**.

**Condicionales:**
- **Sin sesión / primer negocio:** flujo F1/F5 intacto (copy de alta de cuenta/negocio, no «Nueva frutería»).
- **409 / nombre duplicado (si API lo define):** inline en nombre comercial.
- **403 / 500:** ErrorBanner; el form conserva valores.
- **Loading:** CTA «Crear frutería» `disabled` + spinner; no doble submit.

**Reglas UI:**
- Sin wizard paralelo. Un CTA dominante: **Crear frutería** (≥44px, `w-full` en móvil).
- Link secundario «Volver al panel» → `/proveedor`.
- Tras éxito, toast «Frutería creada» + nombre.

**API esperada:** `createProvider` existente con unique `userId` removido (Arch/BE).

**Wireframes:** `WF-ONB-01-nueva-fruteria.md`.

## Inputs Utilizados

- **PRD:** `Administrador de producto/Product Manager/outputs/laborregamarket/fase-11/prd.md`
- **US:** `US-ONB-01`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-11/user-flows/UF-ONB-01-alta-sucursal.md`
- **Agente Downstream:** Frontend Developer
