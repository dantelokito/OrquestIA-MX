# ADR-030 — Secciones dinámicas del catálogo del negocio

> **Estado:** Aceptado  
> **Fecha:** 2026-08-28  
> **Decisores:** Arquitecto de Software  
> **Fase:** 10 — v0.10.2  
> **US:** US-CAT-03  
> **CO:** CO-F10-001  
> **Relacionado:** [ADR-029](./ADR-029-dual-sku.md)

---

#### 1. Contexto y Problema:

El enum `ProductCategory` (`FRUTA\|VERDURA\|AGRICOLA`) es taxonomía de **plataforma** (filtro Explorar F9). El PROVIDER necesita agrupar su vitrina con nombres propios (D-F10-6). Esas secciones no pueden convertirse en chips de FilterBar ni anidarse.

---

#### 2. Opciones Consideradas:

* **Opción A — Entidad `ProviderSection` (nombre, `sortOrder`) + `ProviderProduct.sectionId`:** Pros: globales activados y locales se agrupan igual; una lista plana; DELETE vacío es trivial. Contras: migración; productos sin sección (alta global histórica).
* **Opción B — Reusar `Product.category` con valores libres:** Pros: cero tabla. Contras: ensucia el filtro Explorar; locales no deben tener enum de plataforma (ADR-029).
* **Opción C — Árbol de secciones:** Pros: subgrupos. Contras: D-F10-6 lo prohíbe (Won't anidar).

---

#### 3. Decisión Elegida:

**Opción A.** Lista **plana** por `providerId`.

### Modelo

| Campo | Regla |
|-------|-------|
| `name` | Trim; 1–40 chars; sin HTML; unique por negocio **case-insensitive** vía `nameNormalized` |
| `sortOrder` | Entero ≥ 0; reorder persistido |
| `sectionId` en `ProviderProduct` | Nullable (históricos GLOBAL sin asignar). Alta **local** Must exige sección del **mismo** `providerId` |

### Borrado

DELETE solo si **cero** `ProviderProduct` apuntan a la sección → si no, **409** `{ "error": "La sección tiene productos. Muévelos antes de eliminarla" }`. No hay “Sin sección” Must. Sugerir Frutas/Verduras/Agrícolas al primer uso = Should.

### Ownership

Toda ruta ` /api/provider/sections*` resuelve `Provider` por `session.sub`. ID de sección de otro negocio → **403** (no 404, para no filtrar existencia; aceptable 404 si el id no existe en absoluto).

### Superficie pública

`GET /api/providers/[id]` serializa `sectionId`, `sectionName`, `sectionSortOrder` en cada producto vendible. El FE agrupa. **Prohibido** exponer secciones como query de `GET /api/providers` (listing).

### Qué NO hacer

- `parentId` / anidar.
- Query `section=` en Explorar.
- Unique global de nombre entre fruterías.

---

#### 4. Consecuencias e Impacto:

* **Positivas:** Taxonomía de plataforma intacta; vitrina custom por negocio; un FK cubre GLOBAL y LOCAL.
* **Riesgos / Compensaciones:** Productos globales activados antes de F10 quedan `sectionId=null` hasta que el dueño los asigne. El detalle puede mostrar un grupo “Sin sección” en FE (Could; no API Must).

## Referencias

- US-CAT-03, D-F10-6
- DB: [`../../fase-10/data-model/DB-provider-sections.md`](../../fase-10/data-model/DB-provider-sections.md)
- API: [`../../fase-10/api/API-PROVIDER-SECTIONS-01.md`](../../fase-10/api/API-PROVIDER-SECTIONS-01.md)
