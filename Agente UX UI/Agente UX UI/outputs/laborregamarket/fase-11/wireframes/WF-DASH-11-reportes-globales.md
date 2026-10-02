> **Pantalla:** Reportes generales — módulo nuevo consolidado
> **Objetivo Principal:** Ver ventas de todas las sucursales a la vez (solo N>1)
> **US:** US-DASH-11
> **Ruta:** `/proveedor/reportes-generales`
> **Fecha:** 12/09/2026 · **Versión:** 0.11.0

## Inputs Utilizados

- **PRD / US:** `US-DASH-11`
- **Tokens:** `KpiCard` F3, **no** `KpiCardAdmin`

---

### Success (N>1)

```text
+-----------------------------------------------------------------------+
| Header + ProviderSwitcher                                             |
| SubNav: Catálogo | POS | Órdenes | Dashboard | *Reportes generales*   |
+-----------------------------------------------------------------------+
| Hint: Esta vista suma todas tus fruterías. Rotar sucursal no la cambia.|
| # Reportes generales                                                  |
| Todas tus fruterías · America/Monterrey                               |
| [ Mes-atajo MM/AAAA ] [ Inicio ] [ Fin ]     [ Imprimir Should ]      |
+-----------------------------------------------------------------------+
| [ KpiCard GMV $12,400 ] [ Órdenes 38 ] [ Ticket $326 ]                |
+-----------------------------------------------------------------------+
| Sucursal                    GMV        Órdenes   Ticket               |
| Frutas El Paraíso           $8,100     22        $368                 |
| El Paraíso Tecnológico      $4,300     16        $269                 |
| Total                       $12,400    38        $326                 |
+-----------------------------------------------------------------------+
```

Dashboard F10 (Resumen | Reportes) **sigue** en `/proveedor/dashboard`. Este H1 y esta ruta son distintos.

**Visibilidad (BUG-017):** el 5º tab no es un flag de primer mount del layout persistente. Nace de N de la sesión **autenticada**. Tras login PROVIDER N>1 el ítem está en SubNav al llegar a `/proveedor*`, sin recarga manual.

### N=1 — el módulo no se pinta

SubNav de 4 tabs (F10). Deep-link → redirect a Reportes F10.

---

### 4 estados

| Estado | UI |
|--------|-----|
| **Empty** | KPIs en `$0` / `0`; copy «Sin ventas consolidadas en este corte»; filas de sucursal en ceros. |
| **Loading** | Skeleton 3 `KpiCard` + 2 filas tabla; filtros activos. |
| **Error** | Banner + CTA **Reintentar** (único primary). 403: «Esta vista no está disponible para una sola frutería». |
| **Success** | Totales + breakdown por `businessName`. |

### Responsive

- **Móvil `<640px`:** KPIs en stack; tabla `overflow-x-auto` (scroll-x); filtros apilados `w-full`; Imprimir `w-full` secondary.
- **Escritorio `≥1024px`:** KPIs en fila `max-w-7xl`; tabla completa.

### a11y

- Tabla con `<th>` reales; caption «Ventas por sucursal».
- Hint no es el único canal: el H1 ya dice «generales».
- Contraste cifras `text-primary` sobre blanco ≥ 4.5:1.
- Print Should: ocultar header/SubNav (`@media print`).

#### Componentes Requeridos para Frontend:
* **GlobalReportsNavItem:** quinto tab SubNav; `hidden` si N≤1.
* **GlobalReportsPage:** H1 + hint + MonthShortcut + DateRangeFields + KpiCard×3 + `BranchBreakdownTable`.
* **BranchBreakdownTable:** scroll-x móvil; pie Total.
* Prohibido: tabs internos «escondidos» dentro de Reportes F10; look slate analytics.

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-11/wireframes/WF-DASH-11-reportes-globales.md`
- **Agente Downstream:** Frontend Developer
