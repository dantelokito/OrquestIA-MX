# DB-providers — Delta Fase 5

> **Entidad:** `providers` (Prisma model `Provider`)  
> **Base F4:** [`../../fase-4/data-model/DB-providers.md`](../../fase-4/data-model/DB-providers.md)  
> **Fecha:** 14/08/2026  
> **Versión:** 0.5.0  
> **No editar** los documentos de fase-1 ni fase-4; este archivo es el delta vivo F5.

---

## Campos nuevos (brand)

| Campo | Tipo de Dato | Restricción | Descripción |
| :--- | :--- | :--- | :--- |
| `primary_color` | `String` | NULLABLE | Hex `#RRGGBB` CTA de sesión PROVIDER (ADR-021) |
| `secondary_color` | `String` | NULLABLE | Hex `#RRGGBB` acentos de sesión PROVIDER |

```prisma
primaryColor   String? @map("primary_color")
secondaryColor String? @map("secondary_color")
```

`null` / `null` = tokens de plataforma. **Par:** ambos null o ambos hex válidos. Canonical `#` + 6 hex uppercase.

Sin índices nuevos. Contraste **no** se enforcea en CHECK SQL: validación en aplicación (Zod + WCAG) en PATCH.

Migración sugerida: `add_provider_brand_colors`.

---

## Semántica CAT (sin columna nueva)

El toggle de oferta sigue siendo `ProviderProduct.isAvailable` ([`../../fase-1/data-model/DB-products.md`](../../fase-1/data-model/DB-products.md), T9). F5 **no** añade `isActive` a `provider_products`.

| Lectura / escritura | Regla |
|---------------------|--------|
| Canales públicos y venta | Solo `isAvailable=true` **y** `Product.isActive=true` |
| Panel `GET /api/provider/products` | Catálogo completo (incluye inhabilitados) |
| `topProducts` dashboard | Excluir `isAvailable=false`; KPIs históricos intactos |

`stock` (nullable F1) **no** es fuente de verdad de US-CAT-01.

---

## Campos F4 (sin cambio)

`preparationTimeMinutes`, `offersDelivery`, `googlePlaceId`, `googleMapsUrl`, `googleReviewsEnabled` y agregados `rating`/`reviewCount` permanecen. Embed Google (URL/Place ID) **no** depende de Maps JS en Explorar.

Índices geo: sin PostGIS en F5. Umbral F4 (&gt; 200 providers o p95 &gt; 2 s) sigue vigente.

---

## API response (campos extra F5)

`GET` / `PATCH /api/provider/me`:

```json
{
  "primaryColor": "#1B5E20",
  "secondaryColor": "#F9A825"
}
```

`GET /api/auth/session` (PROVIDER con par válido):

```json
{
  "brand": {
    "primaryColor": "#1B5E20",
    "secondaryColor": "#F9A825",
    "source": "provider"
  }
}
```

Listado / detalle público: **no** exponen colores del negocio (CLIENT ve plataforma).

---

## Referencias

- ADR-021, ADR-022
- Settings: [`../api/API-PROVIDER-SETTINGS-01.md`](../api/API-PROVIDER-SETTINGS-01.md)
- Session: [`../api/API-SESSION-THEME-01.md`](../api/API-SESSION-THEME-01.md)
- CAT: [`../api/API-PROVIDER-PRODUCTS-01.md`](../api/API-PROVIDER-PRODUCTS-01.md)
