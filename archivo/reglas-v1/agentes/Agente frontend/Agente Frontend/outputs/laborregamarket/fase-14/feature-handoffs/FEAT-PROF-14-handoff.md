# Handoff de Feature: FEAT-PROF-14

> **Proyecto:** laborregamarket  
> **Feature:** PROF (US-PROF-01/02/03/04/05)  
> **Stack UI:** Next.js 15 + React 19 + TypeScript + Tailwind 4  
> **Fecha:** 2026-09-17  
> **Wireframe de referencia:** `WF-PROF-01-05-perfil.md`  
> **Contrato de referencia:** `API-PROVIDER-PROFILE-14`, `API-PROVIDER-SETTINGS-14`, `MOD-PROVIDER-SETTINGS-F14-handoff.md`

## Inputs Utilizados

- Handoff UX `fase-14/handoff-frontend-fase-14.md` + tokens/IA v0.14.0
- JSON Backend `Agente backend/.../fase-14/handoff-frontend.md` + `MOD-PROVIDER-SETTINGS-F14-handoff.md`
- ADR-039 (`isVerified` no se envía en PATCH)

---

## 1. Pantallas y componentes implementados

| Pantalla / Vista | Wireframe | Ruta | Estado |
|------------------|-----------|------|--------|
| SubNav Perfil último | WF-PROF-01-05 | todas `/proveedor/*` | OK |
| Perfil (5 bloques) | WF-PROF-01-05 | `/proveedor/perfil` | OK |

**Componentes:** `ProfilePageClient`, `ProfileIdentityBlock`, `ProfileGoogleBlock`, `ProfileBusinessForm`, `OpeningHoursEditor`, `ProfileCapabilitiesForm`. Hook: `useProviderProfile` (un GET `/api/provider/me`).

---

## 2. Integración API

| Endpoint | Método | Hook / Service | Estado |
|----------|--------|----------------|--------|
| `/api/provider/me` | GET | `getMyBusiness` / `useProviderProfile` | OK un fetch al cargar |
| `/api/provider/me` | PATCH | `updateProviderSettings` (datos, Google, horarios, capacidades, colores) | OK; **no** envía `isVerified` |
| `/api/provider/media` | POST | `uploadProviderMedia` | OK logo/portada |

- [x] Sin `fetch` embebido en la vista de Perfil
- [x] Google lock si `isVerified === false` (disabled + banner, no color-only)

---

## 3. Estados UI

| Vista | Loading | Empty | Error | Success |
|-------|---------|-------|-------|---------|
| Perfil | 5 skeletons | logo/portada placeholders; horarios 7 filas + copy no publicado | EmptyState + Reintentar; inline coords AMM | toast Guardado |

---

## 4. Formularios

| Formulario | Campos | Mensajes inline |
|------------|--------|-----------------|
| Datos negocio | nombre, dirección, ciudad, teléfono, descripción, lat/lng AMM | OK |
| Horarios | 7 días cerrado/open/close | apertura antes de cierre |
| Google | Place ID, URL, reseñas | 403 lock |
| Capacidades | switches + prep 5–120 + delivery | OK |

---

## 5. Responsive y accesibilidad

- [x] SubNav `overflow-x-auto` `min-h-11`
- [x] CTAs `min-h-11`; un primary por bloque
- [x] Anclas `#identidad` `#google` `#datos` `#horarios` `#capacidades`

---

## 6. Pruebas

`npx vitest run` → **409 passed / 87 files**. Módulo FE: `tests/unit/provider-f14-ui.test.ts` (subnav Perfil último).

Browser con sesión: **no** (sin login en el navegador del agente).

---

## 7. DoD Frontend

- [x] Pixel vs WF (5 bloques)
- [x] Responsive
- [x] 4 estados
- [x] Capa servicios/hooks
- [x] Validación inline
- [x] a11y basal

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/feature-handoffs/FEAT-PROF-14-handoff.md`
- **Agente Downstream:** QA Tester
