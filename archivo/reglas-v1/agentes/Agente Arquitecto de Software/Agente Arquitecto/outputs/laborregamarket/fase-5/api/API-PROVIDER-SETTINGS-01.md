# API-PROVIDER-SETTINGS-01 — Delta brand colors (Fase 5)

> **Endpoint:** `GET` / `PATCH` `/api/provider/me` y delta `PATCH /api/admin/providers/[id]`  
> **Módulo:** `PROVIDERS`  
> **Versión:** 0.5.0  
> **Fecha:** 14/08/2026  
> **US:** US-BRAND-01  
> **Base F4:** [`../../fase-4/api/API-PROVIDER-SETTINGS-01.md`](../../fase-4/api/API-PROVIDER-SETTINGS-01.md)  
> **ADR:** [`../../comun/adrs/ADR-021-provider-brand-colors.md`](../../comun/adrs/ADR-021-provider-brand-colors.md)  
> **Autenticación:** Requerida — Rol `PROVIDER` (dueño) o `ADMIN` (ruta admin)

Los campos F4 (`preparationTimeMinutes`, Google, etc.) **siguen vigentes**. Este delta añade el par de colores. Gate Google 403 **no** aplica a colores (no requieren `isVerified`).

---

## GET `/api/provider/me` — campos extra

Extender `data` F4:

```json
{
  "data": {
    "id": "clx...",
    "businessName": "Frutas El Paraíso",
    "preparationTimeMinutes": 20,
    "offersDelivery": false,
    "googlePlaceId": "ChIJ...",
    "googleMapsUrl": "https://maps.google.com/...",
    "googleReviewsEnabled": true,
    "googleReviewsLocked": false,
    "primaryColor": "#1B5E20",
    "secondaryColor": "#F9A825"
  }
}
```

| Campo extra | Semántica |
|-------------|-----------|
| `primaryColor` | Hex `#RRGGBB` o `null` (plataforma) |
| `secondaryColor` | Hex `#RRGGBB` o `null` (plataforma) |

Si el par guardado falla contraste en lectura, devolver **`null`/`null`** (no exponer un tema inválido). El GET de settings del dueño puede incluir los valores crudos **o** los efectivos; **Must de hidratación de UI** es `GET /api/auth/session` (`brand: null` si inválidos). Preferencia: GET me devuelve lo persistido (para el picker) aunque el contraste se haya degradado; session aplica fallback. Si se persisten solo vía PATCH validado, ambos coinciden.

---

## PATCH `/api/provider/me` — colores

> **Descripción:** Actualizar par de marca. PATCH parcial: colores independientes de Google/tiempos.  
> **Autenticación:** Requerida — Rol `PROVIDER` (dueño)

#### Body (campos nuevos, todos opcionales):

```json
{
  "primaryColor": "#1B5E20",
  "secondaryColor": "#F9A825"
}
```

Reset a plataforma:

```json
{
  "primaryColor": null,
  "secondaryColor": null
}
```

| Campo | Tipo | Validación |
|-------|------|------------|
| `primaryColor` | string \| null | `null` o `#RRGGBB` (6 hex, case-insensitive). Contraste vs `#FFFFFF` ≥ **4.5:1** |
| `secondaryColor` | string \| null | `null` o `#RRGGBB`. Contraste vs `#FFFFFF` ≥ **3:1** |

### Reglas de par

1. Enviar **ambos** `null` → persistir reset.
2. Enviar **ambos** hex válidos que pasan contraste → persistir canonical `#` + uppercase.
3. Enviar solo uno, o uno `null` y el otro hex → **400** (`"Debes indicar primario y secundario, o restablecer ambos"`).
4. Hex inválido (sin `#`, shorthand `#RGB`, caracteres no hex) → **400** `details.field` = el campo.
5. Contraste insuficiente → **400**, no persistir:

```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "primaryColor",
      "message": "El color primario no tiene contraste suficiente para texto blanco (WCAG AA 4.5:1)"
    }
  ]
}
```

```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "secondaryColor",
      "message": "El color secundario no tiene contraste suficiente para acentos (mínimo 3:1 sobre blanco)"
    }
  ]
}
```

No acepta: `isVerified`, `isActive`, `rating`, `reviewCount`, `userId`.

Campos F4 en el mismo PATCH siguen sus reglas (gate Google 403 si aplica a esos campos). Un PATCH que **solo** toca colores **no** dispara el gate Google.

#### 200 Success:

Mismo shape que GET (colores canonicalizados).

AUDIT `UPDATE`, `module=PROVIDERS`, `entityId=provider.id`. No loguear secretos.

---

## PATCH `/api/admin/providers/[id]` — delta colores

> **Autenticación:** Requerida — Rol `ADMIN`  
> Base: [`../../fase-1/api/API-ADMIN-01.md`](../../fase-1/api/API-ADMIN-01.md)

Body F1 (`isVerified`) se mantiene. Campos opcionales F5:

```json
{
  "isVerified": true,
  "primaryColor": "#1B5E20",
  "secondaryColor": "#F9A825"
}
```

Misma validación de par / hex / contraste. Reset con ambos `null`. Side effect F4 (`isVerified=false` → `googleReviewsEnabled=false`) **no** nullifica colores.

---

## Implementación sugerida

| Capa | Archivo |
|------|---------|
| Schema | `Provider.primaryColor` / `secondaryColor` — ver [`../data-model/DB-providers.md`](../data-model/DB-providers.md) |
| Contraste | `src/lib/color/contrast.ts` (luminancia relativa WCAG 2.1) |
| Zod | Extender `patchProviderSettingsSchema` |
| Service | `updateProviderSettings` + admin patch |
| Session | [`API-SESSION-THEME-01.md`](./API-SESSION-THEME-01.md) |

---

## Referencias

- ADR-021: [`../../comun/adrs/ADR-021-provider-brand-colors.md`](../../comun/adrs/ADR-021-provider-brand-colors.md)
- Settings F4: [`../../fase-4/api/API-PROVIDER-SETTINGS-01.md`](../../fase-4/api/API-PROVIDER-SETTINGS-01.md)
- Diagrama: [`../diagrams/ARCH-BRAND-01.md`](../diagrams/ARCH-BRAND-01.md)
