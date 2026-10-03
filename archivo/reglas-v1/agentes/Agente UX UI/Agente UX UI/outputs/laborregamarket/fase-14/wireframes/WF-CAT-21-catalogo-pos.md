> **Pantalla:** Catálogo solo productos + toggle fotos en POS
> **Objetivo Principal:** Trabajo diario de SKU sin identidad; fotos de card se configuran al cobrar
> **Flujo:** UF-CAT-21

```text
CATÁLOGO /proveedor  (>=1024px)
+----------------------------------------------------------------------------------+
| [ActiveStoreEyebrow]                                                             |
| # Catálogo                                                                       |
| Logo, colores y datos del negocio están en [Perfil →]                            |
| (si hash legado #operacion / #google:)                                           |
| [info banner] Esa configuración ahora está en Perfil.  [Ir a Perfil]             |
+----------------------------------------------------------------------------------+
| [ Agregar producto ]  [ Nueva sección ]     ← CTA dominante: Agregar producto    |
| (NO: MediaUpload, BrandColorPicker, PosImagesToggle, Operación y Google)         |
| ProviderCatalogF10: secciones, filas F13, bandeja Eliminados de la vista         |
+----------------------------------------------------------------------------------+

POS /proveedor/pos
+----------------------------------------------------------------------------------+
| # Punto de venta                                                                 |
| +--------------------------------------------------------------+                 |
| | Mostrar fotos en el POS          [========O] switch ≥44px    |                 |
| | Aplica al mostrador de esta frutería.                        |                 |
| | Las miniaturas del catálogo no se apagan.                    |                 |
| +--------------------------------------------------------------+                 |
| Cards de cobro (imagen según toggle) …  CTA pantalla: [ Cobrar ]                 |
+----------------------------------------------------------------------------------+
```

Móvil: copy Perfil bajo H1; banner full-width; toggle POS `w-full` row; Cobrar sticky intacto.

#### Cuatro estados (delta)

| Superficie | Loading | Empty | Error | Success |
|------------|---------|-------|-------|---------|
| Catálogo | Skeletons F10 de filas (sin skeleton de logo) | Sin SKU: empty F10 + Agregar producto | ErrorBanner catálogo | Filas F13 |
| Toggle POS | Switch disabled + `aria-busy` al persistir | N/A (siempre hay valor default ON) | `text-red-600` bajo el switch | Cards con/sin foto |

#### Componentes Requeridos para Frontend:

* **CatalogProfileHint:** texto + link Perfil; `ProfileDeepLinkBanner` si hash legado.
* **PosImagesToggle:** se **mueve** a POS; sale de Catálogo. Semántica F12.
* Prohibido en Catálogo: bloques A/B/D de `ProveedorPageClient`.

## Inputs Utilizados

- **UF:** `UF-CAT-21`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/wireframes/WF-CAT-21-catalogo-pos.md`
- **Agente Downstream:** Frontend Developer
