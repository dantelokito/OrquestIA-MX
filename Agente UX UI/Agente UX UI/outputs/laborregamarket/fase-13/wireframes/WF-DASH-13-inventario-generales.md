> **Pantalla:** Reportes generales N>1 — bloque inventario actual
> **Objetivo Principal:** Comparar saldos ahora de todas las sucursales, sin historial de entradas

```text
+-----------------------------------------------------------------------+
| Reportes generales (solo N>1)                                         |
| Ventas consolidadas F11 (intactas)                                    |
+-----------------------------------------------------------------------+
| Inventario actual                                                     |
| «Saldos ahora. El historial de entradas está en Reportes              |
|  de cada sucursal.»                                                   |
| Sucursal              SKU            On-hand                          |
| El Paraíso Centro     Mango Kent     4                                |
| El Paraíso Tec        Mango Kent     12                               |
+-----------------------------------------------------------------------+
```

#### Componentes:
* **GlobalOnHandBlock:** agrupado por `businessName`. Look PROVIDER (no slate analytics).
* Print inventario = Should. N=1: módulo ausente.
* Empty: «No hay existencias registradas.» Error: Reintentar.

## Inputs Utilizados

- **UF:** `UF-DASH-13`

## Outputs Generados

- **Archivo:** `fase-13/wireframes/WF-DASH-13-inventario-generales.md`
