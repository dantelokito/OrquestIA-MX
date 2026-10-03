# Handoff de Feature: FEAT-EXPLORE

> **Proyecto:** laborregamarket  
> **Feature:** EXPLORE  
> **Stack UI:** Next.js 15 + React 19 + Tailwind  
> **Fecha:** 2026-08-10  
> **Wireframe:** `WF-explorar`  
> **US:** US-EXPLORE-01…04 (cierra OBS-02)  
> **Contrato:** `API-PROVIDERS-01`

---

## 1. Pantallas

| Vista | Ruta | Estado |
|-------|------|--------|
| Explorar filtros | `/explorar` | OK |
| Búsqueda header | Header → `/explorar?q=` | OK |

## 2. Integración API

| Endpoint | Query | Service | Estado |
|----------|-------|---------|--------|
| `GET /api/providers` | `q` (≥2), `category` (`FRUTA\|VERDURA\|AGRICOLA`), `verified`, `page`, `limit` | `getProviders` | OK |

- **No** se usa alias `product` — solo `q`
- Filtro categoría **server-side** (eliminado client-side keyword match)

## 3. URL sync

| Param | Chip / input |
|-------|----------------|
| `?category=FRUTA` | Frutas |
| `?category=VERDURA` | Verduras |
| `?category=AGRICOLA` | Agrícola |
| `?verified=true` | Verificado |
| `?q=` | Header / búsqueda |
| `?page=` | Paginación |

Hydrate desde URL; back/forward restaura; **Limpiar filtros** → `/explorar`.

## 4. Estados UI

| Vista | Loading | Empty | Error | Success |
|-------|---------|-------|-------|---------|
| Explorar | SkeletonCard | “No encontramos fruterías” + Limpiar | ErrorBanner | grid + mapa |

Empty filtrado ≠ ErrorBanner. Mapa usa el mismo array `providers` (sin markers stale).

## 5. Accesibilidad

- [x] Chips `aria-pressed` + min-h 44px
- [x] Hint búsqueda ≥2 caracteres
