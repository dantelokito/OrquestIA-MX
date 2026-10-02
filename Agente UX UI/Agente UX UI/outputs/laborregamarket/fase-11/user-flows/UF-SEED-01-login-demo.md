> **Flujo:** Cuentas demo F11 en `/login` (no producción)
> **Historia de Usuario Asociada:** US-SEED-01, US-SEC-03 (F10, solo lectura)
>
> **Punto de entrada:** `http://localhost:8080/login` con `NODE_ENV` distinto de `production`.

> **Pasos del Usuario:**
> 1. `[Login no-prod]` → `DemoAccountsBlock` lista cuatro filas clicables (≥44px):
>    - `admin@laborregamarket.mx` — Administrador
>    - `frutas@elparaiso.mx` — Proveedor · 2 fruterías
>    - `verduras@campoverde.mx` — Proveedor · 1 frutería
>    - `cliente@demo.mx` — Cliente
> 2. `[Clic fila]` → Rellena email + password `Demo1234!` (o dispara login demo existente). Hint visible: mismo password para todas.
> 3. `[Tras login El Paraíso]` → switcher + Reportes generales (`UF-HEADER-01`, `UF-DASH-11`).
> 4. `[Tras login Campo Verde]` → chrome F10; **sin** switcher; **sin** Reportes generales.

**Condicionales:**
- **production:** el bloque **no se monta** (`US-SEC-03`).
- **Empty (seed no corrido):** el bloque puede mostrar las filas; login fallará con error inline de credenciales — no inventar cuentas.
- **Error 401:** mensaje existente de login; no revelar si el email existe.

**Reglas UI:**
- Delta mínimo: **una fila extra** Campo Verde. No rediseñar login.
- Columna «2 fruterías» / «1 frutería» es texto secundario `text-secondary`, no badge de admin.
- Contraste AA en filas sobre `surface-secondary`.

**Wireframes:** `WF-SEED-01-login-demo.md`.

## Inputs Utilizados

- **Seed:** `Administrador de producto/Product Manager/outputs/laborregamarket/fase-11/seed-demo.md`
- **US:** `US-SEED-01`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-11/user-flows/UF-SEED-01-login-demo.md`
- **Agente Downstream:** Frontend Developer
