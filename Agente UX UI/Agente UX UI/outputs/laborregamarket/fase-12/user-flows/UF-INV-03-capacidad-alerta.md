> **Flujo:** Tope, barra porcentual y alerta de poca existencia  
> **Historia de Usuario Asociada:** US-INV-03  
>
> **Pasos del Usuario:**
> 1. `[Listado o ficha]` -> Ve barra = on-hand / tope como %. Texto auxiliar «{on-hand} / {tope} {unidad}».
> 2. `[Ficha]` -> Edita tope (máximo), umbral (default 10% del tope la primera vez), interruptor **Alerta de poca existencia**.
> 3. `[Condicional]` -> ¿Tope vacío, 0 o negativo?
>    - **Sí:** validación inline; no persiste.
>    - **No:** guarda; barra se recalcula.
> 4. `[Condicional]` -> ¿On-hand > tope?
>    - **Sí:** barra visual >100% (fill puede desbordar el track con label «{n}%»); **no** hay modal de bloqueo ni rechazo de entrada.
>    - **No:** barra 0–100% habitual.
> 5. `[Condicional]` -> ¿Alerta encendida y % ≤ umbral?
>    - **Sí:** badge «Poca existencia» (texto + icono `AlertTriangle`, nunca solo color).
>    - **No (apagada):** no hay badge aunque el % esté bajo.

## Inputs Utilizados

- **US:** `US-INV-03`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-12/user-flows/UF-INV-03-capacidad-alerta.md`
- **Wireframe:** `WF-INV-03-ficha-capacidad.md`
