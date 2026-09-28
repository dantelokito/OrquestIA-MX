> **Flujo:** Catálogo reducido a productos; toggle de fotos del POS vive en POS
> **Historia de Usuario Asociada:** US-CAT-21
>
> **Punto de entrada:** `/proveedor` (Catálogo) y `/proveedor/pos`. CTA Catálogo: **Agregar producto**. CTA POS de este delta: el switch **Mostrar fotos en el POS** (no sustituye a **Cobrar**).

> **Pasos del Usuario:**
> 1. `[Catálogo]` → Toolbar, secciones, filas F13 (miniatura, GLOBAL/LOCAL, precio, historial, unidad-oferta, Foto, Activo, Eliminar, bandeja). **No** hay logo, portada, colores, Google, horarios, prep ni delivery.
> 2. `[Copy de migración]` → Línea secundaria bajo el H1: «Logo, colores y datos del negocio están en **Perfil**» (enlace a `/proveedor/perfil`).
> 3. `[Deep-link legado]` → Hash o ancla antigua de «Operación y Google» en Catálogo: banner persistente (no toast fugaz) «Esa configuración ahora está en Perfil» + enlace. No queda bloque huérfano.
> 4. `[POS]` → `PosImagesToggle` en el chrome **arriba** de las cards, copy F12: «Aplica al mostrador de esta frutería. Las miniaturas del catálogo no se apagan». Default ON; persistido por sucursal. Catálogo **no** ofrece el toggle.
> 5. `[Condicional — fallo al persistir posShowImages]` → Error visible **en POS** (`role="alert"`); Catálogo no muestra el error.

> **Reglas UI:**
> - No reabrir US F13. Semántica `US-POS-12` intacta.
> - En POS, **Cobrar** sigue siendo el CTA dominante de la pantalla; el toggle es configuración, no primary.
> - Wireframes: `WF-CAT-21-catalogo-pos.md`.

## Inputs Utilizados

- **US:** `US-CAT-21-catalogo-solo-productos.md`
- **US previa:** `US-POS-12` (F12)
- **UI hoy:** `PosImagesToggle` en Catálogo; bloques A/B/D en `ProveedorPageClient`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/user-flows/UF-CAT-21-catalogo-solo-productos.md`
- **Agente Downstream:** Frontend Developer
