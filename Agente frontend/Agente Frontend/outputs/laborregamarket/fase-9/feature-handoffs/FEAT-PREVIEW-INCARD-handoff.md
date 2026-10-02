# Handoff de Feature: FEAT-PREVIEW-INCARD

> **Proyecto:** laborregamarket  
> **Feature:** EXPLORE / ProviderPreviewInCard  
> **Stack UI:** Next.js 15 + React 19 + Tailwind 4  
> **Fecha:** 2026-08-25  
> **Wireframe:** `WF-explorar-preview-in-card`  
> **Contrato:** `API-PROVIDER-PREVIEW-01`  
> **US:** US-EXPLORE-08

---

## 1. Componentes

| Componente | Ubicación | Descripción |
|------------|-----------|-------------|
| `ProviderPreviewInCard` | `src/components/explore/ProviderPreviewInCard.tsx` | Overlay absoluto `inset-0` dentro del shell; slide-up 200 ms |
| `ProviderCard` | `src/components/explore/ProviderCard.tsx` | Shell `overflow-hidden rounded-xl`; preview recortado; scroll-into-view condicional |
| `ProviderPreviewContent` | (F7) | Contenido US-EXPLORE-05 intacto |

`ProviderPreviewPopover` queda legado (no montado en Explorar).

---

## 2. Integración API

Mismo `GET /api/providers/[id]`. Cache + un inflight + AbortController (`preview-cache`).

---

## 3. Interacción

| Trigger | Comportamiento |
|---------|----------------|
| Hover | Open delay 300 ms |
| Leave | Close 150 ms |
| Long-press | 500 ms; no navega |
| Tap corto / Link | `/fruteria/[id]` |
| Eye / Alt+Enter | Abre preview |
| Escape | Cierra |
| Marker | `previewId` + scroll-into-view |
| Reduced-motion | delays 0 |

---

## 4. DoD

- [x] Contenido anima **dentro** del card; no popover desanclado  
- [x] Sin botón «Vista rápida»; `aria-label="Vista previa"`  
- [x] Heart / ContactCTA / campos US-EXPLORE-05 / CTA Ver frutería  

---

## 5. Quick fix — overlay sin desbordar (25/08/2026)

- **Bug:** long-press/hover mostraba submódulo fuera del borde del card (push-down `mt-3`).
- **Fix:** `provider-card-shell` con `overflow-hidden`; preview como capa absoluta (`provider-preview-overlay`) con `translateY` + `opacity`; scroll interno del contenido.
- **CSS:** `globals.css` — transición 200 ms; `prefers-reduced-motion` instantáneo.
