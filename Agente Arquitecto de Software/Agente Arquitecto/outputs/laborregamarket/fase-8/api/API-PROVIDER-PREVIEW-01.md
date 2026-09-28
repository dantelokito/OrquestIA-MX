# API-PROVIDER-PREVIEW-01 — Preview hover (Fase 8)

> **Endpoint:** `GET` `/api/providers/[id]`  
> **Módulo:** `EXPLORE`, `PROVIDERS`  
> **Versión:** 0.8.3  
> **Fecha:** 24/08/2026  
> **US:** US-EXPLORE-07  
> **Base F7:** [`../../fase-7/api/API-PROVIDER-PREVIEW-01.md`](../../fase-7/api/API-PROVIDER-PREVIEW-01.md)  
> **CO:** CO-F8-003  
> **Autenticación:** Pública

**Sin API nueva. Sin recorte de campos. Sin migración.**

El shape F7 (`US-EXPLORE-05`) **sigue vigente**: horario, flags, `reviewsPreview[3]`, productos vendibles, `isOpenNow`, etc. Este documento solo fija el NFR de disparo hover / long-press.

---

## Contrato HTTP

Igual F7. Inactivo/inexistente → **404**. Envelope ADR-003.

No hay `GET /api/providers/[id]/preview`. El FE reusa `getProviderById`.

---

## NFR hover / long-press (Must FE; cero trabajo BE Must)

| Regla | Valor |
|-------|-------|
| Disparador | Hover (puntero) o long-press (touch). **Sin** botón «Vista rápida» |
| Tap / clic corto | Navega a `/fruteria/[id]` |
| Marker mapa | Abre el **mismo** preview (paridad F7) |
| Previews abiertos | **Uno** a la vez |
| GET en vuelo | **Uno** por `id`; `AbortController` al cambiar de card |
| Debounce abrir hover | **~300 ms** (UX puede afinar) |
| Debounce cerrar hover | **~150 ms** (permite cruzar al popover) |
| Long-press | **~500 ms**; movimiento / scroll **cancela**; click sintético post-press **no** navega |
| Cache | Map de sesión `id → payload`; no refetch si ya se tiene |
| Spam | **Prohibido** N GET al cruzar el grid |

Backend **no** implementa debounce, cache ni rate-limit nuevo para este slice.

---

## Referencias

- Diagrama: [`../diagrams/ARCH-PREVIEW-02.md`](../diagrams/ARCH-PREVIEW-02.md)
- Shape F7: [`../../fase-7/api/API-PROVIDER-PREVIEW-01.md`](../../fase-7/api/API-PROVIDER-PREVIEW-01.md)
- Diagrama F7: [`../../fase-7/diagrams/ARCH-PREVIEW-01.md`](../../fase-7/diagrams/ARCH-PREVIEW-01.md)
