> **Pantalla:** Banner 409 al eliminar sección con productos (form Nueva sección cerrado)
> **Objetivo Principal:** Entender por qué la sección no desapareció
> **Flujo:** UF-CAT-23

```text
CATÁLOGO (form «Nueva sección» COLAPSADO)
+----------------------------------------------------------------------------------+
| [ Agregar producto ]   [ + Nueva sección ]  ← form cerrado, sin sectionError ahí |
+----------------------------------------------------------------------------------+
| ## Frutas                                              [ Eliminar sección ]      |
| [alert banner junto al heading, no dentro del form]                              |
| No se puede eliminar “Frutas”: mueve o quita los productos de la sección antes.  |
| [ Cerrar ]                                                                       |
| (filas de productos siguen visibles)                                             |
+----------------------------------------------------------------------------------+
```

Móvil: banner full-width `role="alert"`; botón Eliminar `min-h-11`; no depende de abrir el form.

Sección vacía: sin banner; la sección desaparece.

#### Cuatro estados

| Estado | UI |
|--------|-----|
| Empty | Sin secciones de usuario: empty F10; GLOBAL plataforma siguen. |
| Loading | Eliminar disabled + `aria-busy` en el heading. |
| Error | Banner 409 visible con form cerrado. Sección intacta. |
| Success (vacía) | Sección removida; listado actualiza. |

#### Componentes Requeridos para Frontend:

* **SectionConflictBanner:** `bg-red-50 text-red-800` + icono alerta; texto+icono (no color-only); × ≥44px.
* **sectionError** deja de vivir solo dentro de `NewSectionForm`.

## Inputs Utilizados

- **UF:** `UF-CAT-23`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/wireframes/WF-CAT-23-error-seccion.md`
- **Agente Downstream:** Frontend Developer
