> **Flujo:** Precio de la oferta + historial corto
> **Historia de Usuario Asociada:** US-CAT-19, US-CAT-20
>
> **Punto de entrada:** Fila catálogo `/proveedor` (`PriceInput` F10) GLOBAL y LOCAL. Acceso historial: enlace «Historial de precio» en fila o drawer.

> **Pasos del Usuario:**
> 1. `[Editar precio]` → Control habilitado en GLOBAL y LOCAL. Label GLOBAL: «Precio de tu frutería» (no «precio del catálogo admin»). ≥0, 2 decimales. Primera asignación crea oferta (mismo patrón F10).
> 2. `[Éxito]` → Solo esta sucursal. Maestro GLOBAL y sucursal B intactos. Pedidos hechos no cambian (`UF-DASH-10`).
> 3. `[Validación]` → Vacío, negativo, >2 decimales → 400 inline. IDOR → 401/403.
> 4. `[Historial]` → Lista corta, más recientes primero: fecha/hora America/Monterrey, precio antes, precio después. Primera asignación (vacío → valor) también. Empty: «Aún no hay cambios de precio.» no es error.
> 5. `[Condicional IDOR historial]` → 403/404. No mezclar con GMV de reportes.
>
> **Reglas UI:** No crear SKU LOCAL para cambiar precio. Wireframe: `WF-CAT-19-20-precio-historial.md`.

## Inputs Utilizados

- **US:** `US-CAT-19`, `US-CAT-20`

## Outputs Generados

- **Archivo:** `fase-13/user-flows/UF-CAT-19-20-precio-historial.md`
