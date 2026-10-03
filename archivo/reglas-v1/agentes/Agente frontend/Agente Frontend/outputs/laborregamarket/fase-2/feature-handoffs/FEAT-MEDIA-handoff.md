# Handoff de Feature: FEAT-MEDIA

> **Proyecto:** laborregamarket  
> **Feature:** MEDIA  
> **Stack UI:** Next.js 15 + React 19 + Tailwind + next/image  
> **Fecha:** 2026-08-10  
> **Wireframe:** `WF-proveedor-media`, `WF-admin-panel`, `WF-explorar`, `WF-fruteria-detalle`  
> **US:** US-MEDIA-01…05  
> **Contrato:** `API-MEDIA-01`

---

## 1. Pantallas y componentes

| Vista | Ruta | Estado |
|-------|------|--------|
| Upload logo/portada | `/proveedor` | OK |
| Upload imagen producto | `/admin` → catálogo Productos | OK |
| Cards / hero / thumbs | explorar + detalle | OK |

**Componentes:**

| Componente | Ubicación |
|------------|-----------|
| `MediaUpload` | `src/components/ui/MediaUpload.tsx` |
| `ImagePlaceholder` | `src/components/ui/ImagePlaceholder.tsx` |
| `ProviderHero` (cover+logo) | `src/components/fruteria/ProviderHero.tsx` |

## 2. Integración API

| Endpoint | Método | Service | Estado |
|----------|--------|---------|--------|
| `/api/provider/media` | POST multipart | `uploadProviderMedia` | OK |
| `/api/admin/products/[id]/image` | POST multipart | `uploadAdminProductImage` | OK |
| `/api/provider/me` | GET | ahora incluye `logoUrl`/`coverUrl` | OK |

Validación client alineada al server: JPEG/PNG/WebP · 5MB.

## 3. Estados UI

| Vista | Loading | Empty | Error | Success |
|-------|---------|-------|-------|---------|
| MediaUpload | overlay spinner | placeholder | inline aria-live | preview URL |
| Cards/detalle | skeleton explore | ImagePlaceholder | onError → placeholder | next/image lazy |

## 4. Accesibilidad

- [x] Labels en file inputs
- [x] Dimensiones fijas / aspect ratios (anti-CLS)
- [x] Errores inline con `role="alert"`
