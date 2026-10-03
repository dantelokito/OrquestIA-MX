> **Pantalla:** Admin Catálogos → Productos (GLOBAL + LOCAL)
> **Objetivo Principal:** Ver y paginar todos los SKU; inhabilitar; alta solo GLOBAL

```text
+-----------------------------------------------------------------------+
| Header ADMIN (marca plataforma)  Panel | Analítica | Explorar | User  |
+-----------------------------------------------------------------------+
| Tabs: [Catálogos*] Proveedores Bitácora Analítica                     |
+-----------------------------------------------------------------------+
| Productos                                                             |
| [ q buscar          ] [Scope: Todos v] [Estado: Todos v] [Dueño v]    |
|                                              [ + Nuevo producto ] CTA |
+-----------------------------------------------------------------------+
| Nombre        Origen   Estado    Dueño              Acciones          |
| Mango Kent    GLOBAL   Activo    Plataforma         [Inhabilitar]     |
| Ensalada mix  LOCAL    Activo    El Paraíso Centro  [Inhabilitar]     |
| ...                                                                   |
+-----------------------------------------------------------------------+
| Página 1 de 4 · 187 registros   [50 v] por página   [Ant] [Sig]       |
+-----------------------------------------------------------------------+

EMPTY: "No hay productos con estos filtros." + limpiar filtros
LOADING: skeleton 8 filas
ERROR: ErrorBanner + Reintentar (no tabla inventada)
SUCCESS: tabla + paginación visible (nunca limit silencioso)
```

#### Componentes Requeridos para Frontend:
* **AdminProductTableF13:** columnas origen (`ScopeBadge` GLOBAL/LOCAL), dueño, `isActive`. Texto + badge (nunca color-only).
* **AdminProductFilters:** `q`, `scope`, `isActive`, dueño (disabled/oculto si scope=GLOBAL).
* **PaginationBar:** page, `meta.total`, pageSize 50|100. Targets ≥44px.
* **CTA primario:** `bg-[var(--brand)]` texto blanco **Nuevo producto** (solo GLOBAL).
* **Inhabilitar / Reactivar:** Button Secondary; diálogo ConfirmDialog. Sin icono trash de hard-delete.
* **Mobile `<640px`:** filtros en stack; filas card (nombre + origen + dueño); acciones full-width ≥44px. Desktop `≥1024px` tabla `max-w-7xl`.
* **a11y:** contraste AA; focus ring `--brand`; teclado en paginación y filtros.

## Inputs Utilizados

- **UF:** `UF-ADMIN-05`, `UF-ADMIN-06`
- **US:** `US-ADMIN-05`, `US-ADMIN-06`, `US-SEC-04`

## Outputs Generados

- **Archivo:** `fase-13/wireframes/WF-ADMIN-05-catalogo-completo.md`
