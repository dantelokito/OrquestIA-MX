> **Flujo:** Rotar sucursal activa desde el banner (solo N>1)
> **Historia de Usuario Asociada:** US-HEADER-01, US-AUTH-11, US-ISO-01
>
> **Punto de entrada:** cualquier ruta `/proveedor*` con sesión PROVIDER. N = conteo de `Provider` del user (no flag admin).

> **Pasos del Usuario:**
> 1. `[Login]` → `frutas@elparaiso.mx` (N=2) o `verduras@campoverde.mx` (N=1). Sesión resuelve `activeProviderId` (última usada o primera por alta). **QG BUG-017:** el scope de N **no** se congela con la hidratación anónima de `/login`. Al confirmar sesión y entrar a `/proveedor*`, el chrome **relee** N (evento de sesión o reload de scope). Prohibido exigir F5 / recarga rara para ver switcher o el 5º tab.
> 2. `[Condicional N]` → ¿N>1?
>    - **No (Campo Verde):** `[Header F10]` → badge/nombre de **Campo Verde Frutería**. Sin `ProviderSwitcher`. Sin CTA «Cambiar frutería». Chrome idéntico a F10.
>    - **Sí (El Paraíso):** `[Header F11]` → `ProviderSwitcher` ≥44px con nombre de la sucursal activa (`Frutas El Paraíso` o `El Paraíso Tecnológico`).
> 3. `[Abrir switcher]` → Lista de sucursales del user (nombre + colonia corta). La activa lleva `aria-current="true"` + check (`Check`).
> 4. `[Elegir sucursal B]` → Cambia `activeProviderId`. Rehidrata `--brand` / `--brand-secondary` F5, título del panel y datos CAT/POS/órdenes/Reportes F10 de B. Sin segundo login.
> 5. `[Persistencia]` → Recargar la misma sesión/dispositivo mantiene B.

**Condicionales:**
- **Post-login N>1:** primer paint útil de `/proveedor` = Variante B (switcher + Reportes generales). N=0 residual de login = Loading, no Success.
- **N pasa de 1 a 2** (tras `US-ONB-01`): el switcher **aparece** en el siguiente paint del chrome.
- **Fallo de contexto (403/500):** ErrorBanner «No se pudo cambiar de frutería»; se mantiene la activa anterior.
- **Loading cambio:** overlay no bloqueante 200–400 ms; switcher `aria-busy="true"`; no vaciar el layout.
- **Teclado:** `Enter`/`Espacio` abre; flechas recorren; `Escape` cierra; focus visible 2px `var(--brand)`.
- **401:** redirect `/login`.

**Reglas UI:**
- Un solo control de rotar en el header (no duplicar en SubNav).
- `ProviderSwitcher` usa `var(--brand)` de la sucursal **ya activa**; al confirmar B, tokens cambian.
- Menú usuario puede incluir **Agregar frutería** (`US-ONB-01`); no es el CTA de rotar.
- No rediseñar login (`US-AUTH-11`).

**API esperada (no inventar path; Arch cierra contrato):**
- Lectura de N + lista de sucursales del user + `activeProviderId`.
- Mutación de sucursal activa (cookie/sesión). Path = handoff Arquitecto.

**Wireframes:** `WF-HEADER-01-switcher.md`, `WF-ISO-01-contexto-sucursal.md`.

## Inputs Utilizados

- **PRD:** `Administrador de producto/Product Manager/outputs/laborregamarket/fase-11/prd.md`
- **US:** `US-HEADER-01`, `US-AUTH-11`, `US-ISO-01`
- **Tokens:** `outputs/laborregamarket/comun/design-tokens.md`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-11/user-flows/UF-HEADER-01-switcher-fruteria.md`
- **Agente Downstream:** Frontend Developer
