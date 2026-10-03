# Handoff de Feature: FEAT-ENV

> **Proyecto:** laborregamarket  
> **Feature:** ENV (`.env.example` público FE)  
> **Stack UI:** Next.js 15  
> **Fecha:** 2026-08-16  
> **Wireframe:** —  
> **Contrato:** US-OPS-07 · DEV-P2-009

---

## 1. Pantallas y componentes implementados

Sin pantallas. Sincronización de variables públicas.

| Archivo | Estado |
|---------|--------|
| `LaBorregaMarket/.env.example` | OK |
| `outputs/laborregamarket/comun/.env.example` | OK (espejo) |

---

## 2. Integración API

N/A.

Must Explorar:

| Variable | Must | Nota |
|----------|------|------|
| `NEXT_PUBLIC_OSM_TILE_URL` | No | Vacío = OSM default |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | **No** | No reintroducida |

Secretos (`JWT_SECRET`, Upstash, Resend, Inngest, Cloudinary) **no** se publican como `NEXT_PUBLIC_*`.

---

## 3. Estados UI

N/A.

---

## 4. Formularios y validación

N/A.

---

## 5. Responsive y accesibilidad

N/A.

---

## 6. Pruebas

Comentarios del `.env.example`: OSM opcional; Maps JS no es Must GEO.

---

## 7. Definition of Done (DoD Frontend)

- [x] OSM opcional documentado
- [x] Maps JS key no exigida
- [x] Cero YAML CI / `@upstash/redis` npm desde Frontend

---

## 8. Notas para downstream

### DevOps

Copiar `LaBorregaMarket/.env.example` al entorno. Teselas prod: CDN compliant (OSMF Tile Usage Policy).
