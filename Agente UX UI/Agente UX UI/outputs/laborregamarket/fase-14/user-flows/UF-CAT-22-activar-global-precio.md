> **Flujo:** Activar un GLOBAL sin precio exige captura > 0; nunca publica 50
> **Historia de Usuario Asociada:** US-CAT-22
>
> **Punto de entrada:** Fila de catálogo GLOBAL, toggle **Activo**.

> **Pasos del Usuario:**
> 1. `[GLOBAL con precio de oferta > 0]` → Activar reutiliza ese precio. No se pisa a 50.
> 2. `[GLOBAL sin precio / sin oferta]` → El switch **no** pasa a ON hasta capturar precio. Se abre diálogo `PriceRequiredDialog`: `PriceInput` «Precio de tu frutería» (mismas reglas F13: rechaza ≤ 0). CTA dominante: **Poner a la venta**. Secundario: **Cancelar** (queda inactivo).
> 3. `[Guardar precio > 0]` → Se persiste la oferta vendible con **ese** valor. Cliente ve ese precio en `/fruteria` y Explorar, no 50.
> 4. `[Condicional — 0, negativo, vacío, NaN]` → Error inline en el diálogo; **no** se publica. `price ?? 50` **no existe** en el cliente.
> 5. `[LOCAL]` → Flujo de precio F13 intacto; esta historia no lo cambia.

> **Reglas UI:**
> - El diálogo es el único camino para la primera publicación; no hay default silencioso.
> - Error de fila si la API responde 400 (además del cliente).
> - Wireframe: `WF-CAT-22-precio-activar.md`.

## Inputs Utilizados

- **US:** `US-CAT-22-activar-global-sin-precio.md`
- **US previa:** `US-CAT-19`
- **Código hoy:** `ProviderCatalogF10.tsx` `price: item.price ?? 50`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/user-flows/UF-CAT-22-activar-global-precio.md`
- **Agente Downstream:** Frontend Developer
