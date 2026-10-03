> **Pantalla:** Reportes generales N>1 con series, ranking y mix
> **Objetivo Principal:** Pintar lo que la API ya calcula; N=1 sin pantalla nueva
> **Flujo:** UF-DASH-14

```text
N=1 → no render de esta página (redirect dashboard reportes). Sin empty nuevo.

N>1 SUCCESS
+----------------------------------------------------------------------------------+
| # Reportes generales                                                             |
| MonthShortcut + DateRangeFields + ProductFilterChecklist (productIds)            |
| KPIs GMV / ticket / órdenes  (intactos)                                          |
| BranchBreakdownTable (intacta)                                                   |
+----------------------------------------------------------------------------------+
| Tendencia consolidada                                                            |
| [ UnifiedProviderChart  series  role=img  aria-label="GMV por día" ]             |
| <details> Tabla GMV y órdenes por bucket </details>                              |
+----------------------------------------------------------------------------------+
| Mix Encargar / Mostrador (bySource)   look PROVIDER, no slate admin              |
| [ barras o split ] + <details> tabla                                             |
+----------------------------------------------------------------------------------+
| Productos más vendidos (products)                                                |
| Tabla ranking: producto, GMV, cantidad                                           |
+----------------------------------------------------------------------------------+
| Inventario actual F13 (GlobalOnHandBlock) — intacto                              |
+----------------------------------------------------------------------------------+
```

Print: `#report-print-global` envuelve KPIs + charts + ranking; chrome `.no-print`.

Móvil: charts `w-full`; checklist productos en fieldset; tablas `overflow-x-auto`.

#### Cuatro estados

| Estado | UI |
|--------|-----|
| Loading | Skeletons KPI + chart `h-48` + tabla. |
| Empty | «Sin ventas en este corte»; gráfica vacía o ceros; inventario F13 puede tener datos. |
| Error | ErrorBanner + Reintentar; **no** ceros inventados. N=1: redirect (no este empty). |
| Success | Tres bloques de series + filtros respetados. |

#### Componentes Requeridos para Frontend:

* **UnifiedProviderChart** (compartido con Ventas).
* **GlobalSeriesBlock**, **GlobalSourceMix**, **GlobalProductRank**.
* **ProductFilterChecklist** ya F10, **añadido** a generales.
* No `GrainSelector`. No gráficos de margen.

## Inputs Utilizados

- **UF:** `UF-DASH-14`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/wireframes/WF-DASH-14-series-generales.md`
- **Agente Downstream:** Frontend Developer
