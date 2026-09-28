> **Pantalla:** Preview vitrina (sheet/drawer desde `/explorar`)
> **Objetivo Principal:** Decidir si entrar al detalle con horario, flags reales, 3 reseñas y catálogo activo
> **Historia:** US-EXPLORE-05

```text
+-----------------------------------------------------------------------+
| [Header Explorar permanece detrás / dimmed]                           |
+-----------------------------------------------------------------------+
| Sheet / Drawer  max-w-lg  scrolleable                                 |
|  [ × Cerrar ]                                                         |
|  # Nombre frutería                                                    |
|  [Abierta]  o  [Cerrada ahora]  o  "Horario no publicado"             |
|  verificado a la borrega desde 03/2026   (si isVerified)              |
|                                                                       |
|  Iconos (solo true):  🚚 Envío   💳 Tarjeta sucursal   WA WhatsApp    |
|  Chips: Mayoreo  Menudeo                                              |
|                                                                       |
|  Horario                                                              |
|  +----------+------------+------------+                               |
|  | Día      | Apertura   | Cierre     |                               |
|  | Lunes    | 08:00      | 18:00      |                               |
|  | Domingo  | Cerrado    | —          |                               |
|  +----------+------------+------------+                               |
|                                                                       |
|  Catálogo (preview, solo activos)                                     |
|  [ Mini ] Mango Ataulfo · kg                                          |
|  [ Mini ] Jitomate · kg                                               |
|                                                                       |
|  Reseñas                                                              |
|  [ReviewCard] [ReviewCard] [ReviewCard]   ← máx. 3                    |
|  [ Ver todas las reseñas ]  → /fruteria/[id]#resenas   secondary      |
|                                                                       |
|  [     Ver frutería     ]  ← CTA dominante  min-h-11                  |
+-----------------------------------------------------------------------+
```

### Mobile (`<= 640px`)

```text
+-----------------------------------------------------------------------+
| Bottom sheet 90vh  handle + Cerrar                                    |
| Horario: cada día en UNA fila apilada                                 |
|   Lunes                                                               |
|   08:00 – 18:00                                                       |
| Flags en wrap; icono + label texto (nunca solo color)                 |
| Catálogo lista 1 col                                                  |
| CTA Ver frutería sticky pie sheet  w-full                             |
+-----------------------------------------------------------------------+
```

**Breakpoint horario:** `>=640px` tabla 3 columnas; `<640px` apilado día + rango. Si 7 filas no caben: `overflow-y-auto` en el bloque horario (max-h 12rem).

#### Estados de la pantalla

| Estado | Comportamiento UI |
|--------|-------------------|
| **Loading** | Sheet abierto; BrandLoader 64px; sr-only “Cargando frutería”. |
| **Success** | Datos API; flags omitidos si false/null. |
| **Horario vacío** | “Horario no publicado”; sin chip Abierta/Cerrada. |
| **Sin reseñas** | “Sin reseñas todavía”; CTA Ver todas sigue (ancla). |
| **Catálogo vacío** | “No hay productos activos en vitrina” — no mock. |
| **Error** | Inline + Reintentar; no cerrar Explorar. |
| **404** | Cerrar sheet; toast; lista refetch. |

#### Componentes Requeridos para Frontend:
* **ProviderPreviewSheet:** dialog/sheet `role="dialog"`; Escape cierra; focus trap.
* **OpenNowChip:** texto+icono; `isOpenNow` true/false; oculto si null.
* **HoursTable:** 3 cols desktop; stack móvil.
* **CapabilityIcons:** Delivery, Card, WhatsApp — render **iff** contrato true (+ phone para WA).
* **WholesaleRetailChips:** independientes.
* **ReviewsPreview:** 3× ReviewCard compacto.
* **CTA Ver frutería:** Button Primary `w-full` móvil.

#### Responsividad:
* **Mobile:** bottom sheet; CTA sticky.
* **Desktop:** drawer derecho o modal centrado `max-w-lg`; mapa permanece.

#### Accesibilidad:
* Título `h2` = `businessName`. Focus inicial en Cerrar o título.
* Iconos con `aria-label` (“Envío a domicilio”, “Pago con tarjeta en sucursal”, “WhatsApp disponible”).
* Ancla `#resenas` en página detalle (id en sección reseñas F4).

#### API esperada:
* `GET /api/providers/[id]` (API-PROVIDER-PREVIEW-01)

#### Referencias:
* Flujo: `../user-flows/UF-EXPLORE-05-preview.md`
* Detalle: `../../fase-1/wireframes/WF-fruteria-detalle.md` + F4 reseñas (solo lectura)
