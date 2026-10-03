> **Pantalla:** `/fruteria/[id]` — sin existencias (Won't F12)  
> **Objetivo Principal:** Confirmar que la vitrina cliente no muestra inventario  
> **Flujo:** UF-CAT-12 escenario 2  
> **Base:** `fase-10/wireframes/WF-fruteria-secciones.md` (solo lectura). Chrome F9/F10 intacto.

```text
+-----------------------------------------------------------------------+
| Header público / CLIENT                                               |
| {Nombre frutería}  CTA Encargar                                       |
| ▾ Sección                                                             |
|  Producto · precio · stepper  ← SIN barra, SIN on-hand, SIN reserva   |
+-----------------------------------------------------------------------+
```

**Prohibido:** `InventoryCapacityBar`, badges «Poca existencia», chips Reserva, copy «quedan N».

#### Componentes Requeridos para Frontend:

* Ningún componente F12 de inventario en esta ruta. Payload público no se pinta aunque el API lo mandara por error (defensa UI: no bind de campos stock).

## Inputs Utilizados

- **US-CAT-12**, D-F12-12

## Outputs Generados

- **Archivo:** `fase-12/wireframes/WF-FRUTERIA-12-sin-existencias.md`
