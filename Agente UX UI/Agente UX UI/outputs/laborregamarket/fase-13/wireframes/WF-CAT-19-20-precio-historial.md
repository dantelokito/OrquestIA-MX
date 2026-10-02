> **Pantalla:** Precio de oferta en fila + historial corto
> **Objetivo Principal:** Editar precio de **esta** frutería y ver rastro fecha/antes/después

```text
FILA
| Precio de tu frutería  [ $ 28.50 ]  [ Historial ]  link secondary

POPOVER / SHEET HISTORIAL (más recientes primero)
+------------------------------------------+
| Historial de precio · Mango Kent         |
| 16/09/2026 11:20  $25.00 → $28.50        |
| 01/09/2026 09:00  — → $25.00  (primera)  |
+------------------------------------------+
EMPTY: «Aún no hay cambios de precio.»
ERROR: Reintentar. IDOR no muestra datos ajenos.
```

#### Componentes:
* **PriceInput:** habilitado GLOBAL y LOCAL; no deshabilitar en GLOBAL. Mobile: no aplastar (columna propia o `w-full`).
* **PriceHistoryList:** fecha TZ America/Monterrey; 2 decimales; `aria-label`.
* Primera asignación deja rastro. No es GMV.

## Inputs Utilizados

- **UF:** `UF-CAT-19-20-precio-historial.md`

## Outputs Generados

- **Archivo:** `fase-13/wireframes/WF-CAT-19-20-precio-historial.md`
