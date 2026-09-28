# ADR-039 — `isVerified` intacto al mudar pin y datos de negocio

> **ADR-039:** Sello verificado vs coordenadas editables  
> **Estado:** Aprobado  
> **Fecha:** 2026-09-17  
> **Fase:** 14  
> **US:** US-PROF-03, US-PROF-02  
> **Decisores:** Arquitecto de Software

## Inputs Utilizados

- PRD F14 D-F14-4, D-F14-5
- Handoff PM `fase-14/handoff-arquitecto-fase-14.md`
- ADR-018 (gate Google), ADR-017 (ETA), ADR-028 (bbox Explorar ≠ pin de sucursal)
- Código `main` @ `0eda84c`: `patchProviderSettingsSchema` no acepta datos de negocio; `isVerified` solo lo muta ADMIN

---

#### 1. Contexto y Problema:

Tras el onboarding, el PROVIDER no puede corregir `businessName`, `address`, `city`, `phone`, `description`, `latitude` ni `longitude` porque `patchProviderSettingsSchema` es `.strict()` y no lista esos campos. El dueño necesita enmendar un pin mal capturado.

D-F14-5 **prohíbe** apagar `isVerified` al cambiar coords. Un negocio ya verificado puede mudar el pin y conservar reseñas/Maps/sello. Explorar, Haversine y ETA **sí** leen el valor nuevo. No hay flujo de re-verificación ni carga de documentos en F14.

El bbox de **alta de sucursal** sigue siendo AMM (`monterreyLatSchema` / `monterreyLngSchema`: lat 25.4–25.9, lng −100.6–−99.8). ADR-028 (México) aplica al **mapa Explorar** del cliente, no al pin del negocio.

---

#### 2. Opciones Consideradas:

* **Opción A — Reset `isVerified=false` al cambiar lat/lng o address:** Pros: el sello no viaja con un pin distinto. Contras: contradice D-F14-5; obliga a un flujo ADMIN que F14 no tiene.
* **Opción B — Permitir PATCH de datos de negocio **sin** mutar `isVerified`/`verifiedAt`; geo AMM; documentar el riesgo:** Pros: cumple Must; Explorar se actualiza; Google lock (ADR-018) intacto. Contras: sello de verificado con ubicación distinta.
* **Opción C — Pedir documentos o Place ID nuevo al mudar pin:** Pros: re-ancla Maps. Contras: Won't F14 (sin documentos).

---

#### 3. Decisión Elegida:

**Opción B.**

| Regla | Valor |
|-------|--------|
| Path | `PATCH /api/provider/me` (sucursal **activa**, F11) |
| Campos nuevos aceptados | `businessName`, `address`, `city`, `phone`, `description`, `latitude`, `longitude` |
| Geo | Reusar `monterreyLatSchema` / `monterreyLngSchema`. Fuera de AMM → **400**. Par lat/lng: si se envía uno, se exigen ambos. |
| `isVerified` / `verifiedAt` | **Prohibido** en el body PROVIDER. Si llegan → 400 (`.strict()`). El servicio **no** los escribe en este PATCH. |
| Google (ADR-018) | Intactos. `isVerified=false` → `GoogleReviewsLockedError` **403** si el body toca Place ID / URL / toggle. Mudar coords **no** desbloquea ni bloquea Maps. |
| ADMIN | PATCH de los mismos datos de negocio = **Should** (`D-F14-18`). Must F14 = el proveedor. |
| Atómico | Un request inválido no aplica campos a medias. |

### Riesgo aceptado (D-F14-5)

Un PROVIDER verificado puede mover el pin dentro de AMM y conservar:

- sello `isVerified` en Explorar/vitrina
- embed de reseñas Google (si Place ID/URL no cambian)
- `verifiedAt`

Haversine, ranking por distancia y ETA (ADR-017) usan las **nuevas** coords de inmediato. Mitigación F14 = este ADR. Re-verificación = fase futura.

### Qué NO hacer

- Resetear `isVerified` en `updateProviderSettings`.
- Validar el pin de sucursal con bbox México (ADR-028) en este PATCH.
- Cloudinary/S3. Documentos de verificación.

---

#### 4. Consecuencias e Impacto:

* **Positivas:** Datos de negocio editables post-onboarding; contratos F4–F12 de settings siguen; IDOR F11 intacto.
* **Riesgos:** Sello de verificado desalineado del pin. Consumidores de `GET /api/providers` no necesitan contrato nuevo.

## Referencias

- Contrato: `fase-14/api/API-PROVIDER-SETTINGS-14.md`
- ADR-018, ADR-003, ADR-002, ADR-034
