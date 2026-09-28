> **Pantalla:** Vista de impresión del reporte filtrado F10 (`US-DASH-09`)
> **Objetivo Principal:** Papel = la misma vista rango + productos, sin chrome de la app
> **Disparador:** Botón **Imprimir** (`window.print`). Cero endpoint Must (`API-DASH-NOTES-01`).
> **Base documental F6 (no editar):** [`../../fase-6/wireframes/WF-proveedor-reportes-print.md`](../../fase-6/wireframes/WF-proveedor-reportes-print.md) describe grano+PDF. Este archivo es el corte **rango**.

```text
+-----------------------------------------------------------------------+
|  Frutas El Paraíso                                                    |
|  Reporte de ventas · 1 ago 2026 – 31 ago 2026                         |
|  Zona horaria: America/Monterrey · Generado: 28/08/2026 10:15         |
|  Productos: Todos   (o lista: Mango, Chile del rancho)                |
+-----------------------------------------------------------------------+
|  GMV $12,500.50   Ticket prom. $260.43   Órdenes 48                   |
|  Encargar (pedido en línea): $8,200.00 · 30 órdenes                   |
|  Mostrador (POS): $4,300.50 · 18 órdenes                              |
+-----------------------------------------------------------------------+
|  Venta por producto                                                   |
|  Producto · Unidades · GMV · Encargar · POS                           |
+-----------------------------------------------------------------------+
```

Empty: mismos bloques con ceros + copy **«Sin ventas en este corte»**. No página en blanco.

### Ocultar en print (`.no-print`)

- Header global (logo, pill, avatar)
- SubNavProveedor
- `DashboardViewSwitcher`
- MonthShortcut, DateRangeFields, ProductFilterChecklist
- Botón Imprimir
- Toasts, ErrorBanner de sesión, skip-links

### Mostrar en print (`.print-only` si hace falta)

- `provider.businessName`
- Rango calendario `from`–`to` legible
- TZ `America/Monterrey`
- `generatedAt` en local Monterrey
- Leyenda **Todos** si no hay `productIds`; si no, nombres incluidos
- KPIs + tabla `products[]` **iguales a pantalla**

### CSS Must

```css
@page { margin: 16mm; }
@media print {
  .no-print { display: none !important; }
  body { background: #fff; color: #0F172A; }
  #report-print-f10 { display: block; }
}
```

Fondos blancos; texto `slate-900`; contraste ≥ 4.5:1. No depender solo de `--brand` (B/N razonable). Preferir **tabla visible** si un chart se degrada.

#### Estados

| Estado | Print |
|--------|-------|
| **Success con ventas** | Diálogo nativo del navegador |
| **Empty corte** | Hoja con KPIs 0 + copy empty |
| **Sin payload (500)** | Botón Imprimir disabled |
| **400 query** | No se llega: pickers bloquean GET |

#### Componentes requeridos para Frontend

- **ReportPrintRootF10:** `#report-print-f10`.
- **ReportPrintHeaderF10:** H1 negocio; subtítulo rango; meta TZ + generado + productos/Todos.

#### Accesibilidad

- Botón pantalla ≥44px. Papel: tabla con encabezados; no color-only en split.

#### API esperada

- Print: CSS + `window.print`. **Sin** `POST /print`.
- PDF de este corte = Should **fuera de paquete**. No reabrir `GET /api/provider/reports.pdf` F6 en esta UI.

#### Prohibido

CFDI, ticket térmico, CSV, email, watermark fiscal, look slate analytics.

#### Referencias

- `UF-DASH-03-reportes-rango.md`, `API-DASH-NOTES-01.md`
