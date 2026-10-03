> **Flujo:** Ajuste por conteo físico: el saldo queda igual al conteo (≥ 0)
> **Historia de Usuario Asociada:** US-INV-09
>
> **Punto de entrada:** `/proveedor/inventario` Existencias → **Ajuste por conteo**. CTA del sheet: **Confirmar ajuste**.

> **Pasos del Usuario:**
> 1. `[Sheet]` → Muestra **Saldo en sistema** (solo lectura) vs campo **Conteo físico** (≥ 0). El usuario **no** calcula el delta a mano.
> 2. `[Preview de delta]` → Texto vivo: «Se aplicará un ajuste de −3 KG (queda 5)» o «+4 KG (queda 12)». Si conteo = saldo: «Sin cambio de saldo» y CTA disabled.
> 3. `[Conteo 0]` → Válido. Preview «ajuste de −N (queda 0)». No es 400.
> 4. `[Confirmar]` → `onHand` = conteo; movimiento AJUSTE con delta firmado; aparece en Movimientos.
> 5. `[Condicional — conteo < 0, vacío, NaN]` → Error inline «El conteo no puede ser negativo» / «Indica el conteo físico». 400 servidor: visible en sheet, sin mutar.
> 6. `[IDOR / archivado]` → 403/404.

> **Reglas UI:**
> - Esto **no** es «Registrar entrada» (eso suma). Copy: «El saldo quedará exactamente en el conteo».
> - Un CTA Confirmar ajuste. Cancelar cierra sin guardar.
> - Sheet no aplastado en móvil. 4 estados.
> - Wireframe: `WF-INV-09-ajuste.md`.

## Inputs Utilizados

- **US:** `US-INV-09-ajuste-conteo-fisico.md`
- **US:** `US-INV-08`, `US-INV-02`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/user-flows/UF-INV-09-ajuste-conteo.md`
- **Agente Downstream:** Frontend Developer (tras contrato Arch)
