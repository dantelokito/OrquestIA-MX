# API-PROVIDER-PREVIEW-01 — Preview in-card (Fase 9)

> **Endpoint:** `GET` `/api/providers/[id]`  
> **Módulo:** `EXPLORE`, `PROVIDERS`  
> **Versión:** 0.9.0  
> **Fecha:** 25/08/2026  
> **US:** US-EXPLORE-08  
> **Base F8:** [`../../fase-8/api/API-PROVIDER-PREVIEW-01.md`](../../fase-8/api/API-PROVIDER-PREVIEW-01.md)  
> **CO:** CO-F9-001 / CO-F8-003  
> **Autenticación:** Pública

**Sin API nueva. Sin recorte de campos. Sin migración.**

El shape F7 (`US-EXPLORE-05`) **sigue vigente**. F8 fijó NFR de hover / long-press. F9 solo cambia el **contenedor visual**: animación **dentro** del card (no popover desanclado).

---

## Contrato HTTP

Igual F7/F8. Inactivo/inexistente → **404**. Envelope ADR-003.

No hay `GET /api/providers/[id]/preview`. El FE reusa `getProviderById`.

---

## NFR (Must FE; cero trabajo BE Must)

| Regla | Valor |
|-------|-------|
| Contenedor | Preview se anima **in-card** (mismo card de lista) |
| Disparador | Hover (puntero) o long-press (touch). **Sin** botón «Vista rápida» |
| Timings | Igual F8: abrir hover ~300 ms; cerrar ~150 ms; long-press ~500 ms |
| Tap / clic corto | Navega a `/fruteria/[id]` |
| Scroll touch | **No** abre preview; click sintético post long-press **no** navega |
| Marker mapa | Abre el mismo preview in-card de la card correspondiente (o equivalente UX) |
| Unicidad | **Uno** abierto a la vez |
| GET en vuelo | **Uno** por `id`; `AbortController` al cambiar |
| Cache | Map de sesión `id → payload` |
| a11y | `prefers-reduced-motion`: estado expandido sin animación o transición mínima |
| Contenido | No recortar campos de `US-EXPLORE-05`; Heart y `ContactCTA` se mantienen |

Backend **no** implementa debounce, cache ni rate-limit nuevo para este slice.

---

## Referencias

- Notas F9: [`API-EXPLORE-NOTES-01.md`](./API-EXPLORE-NOTES-01.md)
- NFR F8: [`../../fase-8/api/API-PROVIDER-PREVIEW-01.md`](../../fase-8/api/API-PROVIDER-PREVIEW-01.md)
- Shape F7: [`../../fase-7/api/API-PROVIDER-PREVIEW-01.md`](../../fase-7/api/API-PROVIDER-PREVIEW-01.md)
- Diagrama F8: [`../../fase-8/diagrams/ARCH-PREVIEW-02.md`](../../fase-8/diagrams/ARCH-PREVIEW-02.md)
