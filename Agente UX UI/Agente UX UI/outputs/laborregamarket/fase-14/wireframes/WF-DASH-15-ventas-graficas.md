> **Pantalla:** Ventas (Resumen y Reportes) con tres bloques de gráfica unificada
> **Objetivo Principal:** Tendencia, mix de canal y top productos sin SVG duplicados
> **Flujo:** UF-DASH-15

```text
/proveedor/dashboard  Resumen
+----------------------------------------------------------------------------------+
| KPIs hoy / 7d / 30d (intactos F10)                                               |
| Tendencia 7d     [ UnifiedProviderChart series7d ]                               |
| Mix de canal     Encargar | Mostrador   (bySource)                               |
| Top productos    tabla o barras horizontales (topProducts)                       |
| cada una: <details> tabla accesible                                              |
+----------------------------------------------------------------------------------+

/proveedor/dashboard?view=reportes  pestaña Ventas
+----------------------------------------------------------------------------------+
| Rango from/to + filtro productos (F10)                                           |
| KPIs del corte                                                                   |
| Tendencia (series) | Mix canal | Top productos                                   |
| #report-print-f10                                                                |
+----------------------------------------------------------------------------------+
```

Arquitecto elige SVG único o librería; UX exige la misma jerarquía y tokens PROVIDER (`--brand`, no analytics slate).

Móvil: tres bloques apilados; desktop: tendencia full-width, mix | top en 2 columnas `>=1024px`.

#### Cuatro estados

| Estado | UI |
|--------|-----|
| Loading | Skeletons de 3 bloques. |
| Empty | «Sin ventas en este corte»; no crash `max=0`. |
| Error | ErrorBanner; details ocultos o vacíos, no números fake. Degradación librería: details visible. |
| Success | Tres bloques + print usable. |

#### Componentes Requeridos para Frontend:

* **UnifiedProviderChart:** `{ label, value }[]`; `role="img"`; `aria-label`.
* **ChannelMixBlock**, **TopProductsBlock**.
* Retirar duplicación `BarChartIlustrativo` / `ReportBarChart`.
* Should comparativa sucursal: **no pintar**.

## Inputs Utilizados

- **UF:** `UF-DASH-15`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/wireframes/WF-DASH-15-ventas-graficas.md`
- **Agente Downstream:** Frontend Developer
