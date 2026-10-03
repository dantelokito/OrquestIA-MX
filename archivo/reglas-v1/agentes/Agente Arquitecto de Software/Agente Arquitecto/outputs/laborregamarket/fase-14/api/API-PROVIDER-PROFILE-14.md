# API-PROVIDER-PROFILE-14 — Contratos de Perfil sin cambio de semántica

> **Endpoints:** `GET`/`PATCH` `/api/provider/me` · `POST` `/api/provider/media`  
> **Descripción:** Confirma que identidad visual, Google lock, horarios, capacidades, prep/delivery y `posShowImages` **no** cambian de contrato. F14 mueve la UI a `/proveedor/perfil` (y el toggle POS a `/proveedor/pos`).  
> **Autenticación:** Requerida — PROVIDER + sucursal activa  
> **Módulo:** `PROVIDERS` / `MEDIA`  
> **Versión:** 0.14.0  
> **Fecha:** 2026-09-17  
> **US:** US-PROF-01, US-PROF-02, US-PROF-04, US-PROF-05, US-CAT-21  
> **ADR:** ADR-018, ADR-021, ADR-032, ADR-036, ADR-003, ADR-002  
> **Envelope:** ADR-003  
> **No hay path REST nuevo.**

## Inputs Utilizados

- Contratos F4/F5/F7/F10/F12 de settings y media (solo lectura)
- PRD D-F14-1, D-F14-2, D-F14-3, D-F14-6, D-F14-19

---

## Media (US-PROF-01)

`POST /api/provider/media` F10 intacto (disco `UPLOADS_DIR`, ADR-032). Campos `logoUrl` / `coverUrl`. Sin Cloudinary/S3.

`PATCH /api/provider/me` de `primaryColor` / `secondaryColor` (ADR-021) intacto.

FE Must: un solo `GET /api/provider/me` al cargar Perfil (D-F14-19). Eso **no** exige un endpoint de «contexto»; es consumo. Backend no agrega un BFF.

---

## Google (US-PROF-02)

Campos: `googlePlaceId`, `googleMapsUrl`, `googleReviewsEnabled`, `googleReviewsLocked`.

Si `isVerified === false` y el PATCH toca cualquiera de los tres Google → **403**

```json
{ "error": "Requiere verificación de tu negocio" }
```

Place ID / URL inválidos → **400**. Mudar coords (`API-PROVIDER-SETTINGS-14`) **no** relaja este gate.

---

## Horarios (US-PROF-04)

`openingHours` vigente (`openingHoursSchema`):

```json
{
  "openingHours": [
    { "day": 1, "open": "08:00", "close": "18:00", "closed": false },
    { "day": 0, "open": null, "close": null, "closed": true }
  ]
}
```

`null` = no publicado. Array 0–7; `day` 0–6 único; abierto exige `HH:mm` y `open < close` mismo día. **400** si inválido. Explorar consume el JSON **sin** cambio de query.

---

## Capacidades y operación (US-PROF-05)

Ya aceptados en PATCH:

| Campo | Tipo | Rango |
|-------|------|--------|
| `whatsappEnabled` | boolean | — |
| `acceptsCardAtStore` | boolean | — |
| `offersWholesale` | boolean | El PROVIDER **sí** puede activarlo |
| `offersRetail` | boolean | — |
| `preparationTimeMinutes` | int | 5–120 |
| `offersDelivery` | boolean | — |

Booleanos explícitos. Prep fuera de rango → **400**. Filtros Explorar F9 (`offersWholesale`, `offersDelivery`) **sin** cambio.

---

## `posShowImages` (US-CAT-21)

Contrato `API-PROVIDER-PREFS-12` intacto: boolean en GET/PATCH me, default `true`, por sucursal activa. **No** hay path POS nuevo. La UI del toggle sale de Catálogo y vive en `/proveedor/pos`. Miniaturas CAT ignoran el flag.

---

## Errores comunes

| HTTP | Caso |
|------|------|
| 400 | Zod horarios, colores, prep, Google formato, media tipo/tamaño |
| 401 | Sin sesión |
| 403 | Rol / IDOR / Google lock |
| 404 | Provider ausente |
| 409 | No usado aquí |
| 413/400 | Media sobre límite F10 |
| 500 | Error interno |

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/api/API-PROVIDER-PROFILE-14.md`
- **Agente Downstream:** Backend Developer, Frontend
