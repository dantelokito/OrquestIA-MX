> **Pantalla:** `/explorar` — una card y un pin por Provider (delta F11, chrome F9)
> **Objetivo Principal:** Encargar a la sucursal correcta (El Paraíso ×2)
> **US:** US-EXPLORE-11
> **Fecha:** 12/09/2026 · **Versión:** 0.11.0

## Inputs Utilizados

- **US:** `US-EXPLORE-11`
- **Seed:** El Paraíso Centro + El Paraíso Tecnológico (Garza Sada 2501) + Campo Verde

---

### Success

```text
+-----------------------------------------------------------------------+
| Chrome Explorar F9 (una barra md+, FilterBar, typeahead)  [NO TOCAR]  |
+------------------------------+----------------------------------------+
| Mapa OSM                     | Lista ≤20                              |
|  • Frutas El Paraíso         | [Card] Frutas El Paraíso               |
|    (Centro)                  |   Av. Constitución 1200                |
|  • El Paraíso Tecnológico    | [Card] El Paraíso Tecnológico          |
|    (Garza Sada 2501)         |   Av. Eugenio Garza Sada 2501          |
|  • Campo Verde               | [Card] Campo Verde Frutería            |
+------------------------------+----------------------------------------+
```

Clic card → `/fruteria/[id]` de esa sucursal. Preview in-card F9 intacto.

**Hidratación geo (BUG-018):** query `lat`/`lng` > default San Nicolás (25.7475, −100.283). No `replace` que borre el pin. Chip «San Nicolás» / favorita solo si coincide con el centro real. Ejemplo QA: `?lat=25.6714&lng=-100.3089` lista ambas cards El Paraíso.

---

### 4 estados

| Estado | UI |
|--------|-----|
| **Empty** | Empty F9/F2 («No hay fruterías…»). Sin chips de sección. |
| **Loading** | BrandLoader / skeletons F7–F9. |
| **Error** | Banner red F9 + Reintentar. |
| **Success** | N cards = N `Provider` en el predicado geo/filtros. |

### Responsive

Mapa arriba en móvil (F7). Cards stack. Dos El Paraíso no se colapsan.

#### Componentes Requeridos para Frontend:
* `ProviderCard` existente; `title` = `businessName`.
* No FilterBar secciones. No pintar brand de sucursal en card pública.

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-11/wireframes/WF-EXPLORE-11-cards-provider.md`
- **Agente Downstream:** Frontend Developer
