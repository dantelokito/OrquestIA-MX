> **Pantalla:** Acciones de documento en Reportes de sucursal (pestaña Ventas)
> **Objetivo Principal:** Bajar el PDF del mismo from/to visible
> **Flujo:** UF-DASH-16

```text
Reportes sucursal · pestaña Ventas
+----------------------------------------------------------------------------------+
| From [ 2026-09-01 ]  To [ 2026-09-17 ]   [ Mes actual ]                          |
|                        [ Imprimir ]  [ Descargar PDF ]   ← ambos secondary       |
+----------------------------------------------------------------------------------+
| (contenido del corte: KPIs + UnifiedProviderChart + tablas)                      |
+----------------------------------------------------------------------------------+

Pestaña Inventario F13
| [ Imprimir ]     (sin Descargar PDF)                                             |
```

Móvil: botones `w-full` apilados (`DocumentActions` actual). Desktop: fila a la derecha.

Sin `GrainSelector`. Sin selector día/mes/año F6.

#### Cuatro estados (control PDF)

| Estado | UI |
|--------|-----|
| Empty / rango inválido | PDF y Print `disabled`; mensaje de rango F10 visible. |
| Loading | Botón PDF `aria-busy` «Descargando…». |
| Error | Banner «No pudimos generar el PDF» / 400 rango; no blob vacío. |
| Success | Descarga del archivo del corte visible (mismos from/to/productIds). |

#### Componentes Requeridos para Frontend:

* **DocumentActions:** `showPdf={true}` + `onPdf` en Ventas sucursal.
* Query PDF alineada a `from`/`to` (contrato Arch). `content-type` PDF.
* Print HTML F10 intacto.

## Inputs Utilizados

- **UF:** `UF-DASH-16`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/wireframes/WF-DASH-16-pdf.md`
- **Agente Downstream:** Frontend Developer
