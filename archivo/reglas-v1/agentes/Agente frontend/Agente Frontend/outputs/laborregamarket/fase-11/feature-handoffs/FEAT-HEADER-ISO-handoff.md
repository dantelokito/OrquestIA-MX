# Handoff de Feature: FEAT-HEADER-ISO

> **Proyecto:** laborregamarket  
> **Feature:** HEADER / ISO  
> **Stack UI:** Next.js 15 / React 19 / Tailwind  
> **Fecha:** 2026-09-12  
> **Wireframe de referencia:** `WF-HEADER-01-switcher.md`, `WF-ISO-01-contexto-sucursal.md`  
> **Contrato de referencia:** `API-AUTH-11.md`, `API-PROVIDER-ISO-01.md`

## Inputs Utilizados

- **PRD / US:** `US-HEADER-01`, `US-ISO-01`, `US-AUTH-11`
- **Handoff UX:** `Agente UX UI/.../fase-11/handoff-frontend-fase-11.md`
- **Notas Arch:** `Agente Arquitecto/.../fase-11/handoff-frontend-notas-fase-11.md`

---

## 1. Pantallas y componentes implementados

| Pantalla / Vista | Wireframe | Ruta | Estado |
|------------------|-----------|------|--------|
| Switcher N>1 / chrome N=1 | `WF-HEADER-01` | `/proveedor*` | OK |
| Eyebrow + remount panel | `WF-ISO-01` | Catálogo, POS, Órdenes, Ventas | OK |

**Componentes**

| Componente | Ubicación | Descripción |
|------------|-----------|-------------|
| `ProviderSwitcher` | `src/components/provider/ProviderSwitcher.tsx` | Combobox ≥44px; listbox; check; Agregar frutería |
| `ProviderHeaderContext` | `src/components/provider/ProviderHeaderContext.tsx` | Nombre estático si N=1 |
| `ActiveStoreEyebrow` | `src/components/provider/ActiveStoreEyebrow.tsx` | Nombre de sucursal activa |
| `ProviderPanelBody` | `src/components/provider/ProviderPanelBody.tsx` | `key=activeProviderId` recarga CAT/POS/DASH |
| `useProviderScope` | `src/hooks/useProviderScope.ts` | N, activo, switch |
| `getProviderMine` / `setActiveProvider` | `src/lib/api/provider-f11.ts` | Sin header `X-Active-Provider-Id` |

---

## 2. Integración API

| Endpoint | Método | Hook / Service | Contrato | Estado |
|----------|--------|----------------|----------|--------|
| `/api/auth/session` | GET | `getAuthSession` + scope | API-AUTH-11 | Consume delta `providerCount` / `providers` |
| `/api/provider/mine` | GET | `getProviderMine` | API-AUTH-11 | Preferido para colonia |
| `/api/provider/active` | POST | `setActiveProvider` | API-AUTH-11 | Cookie httpOnly servidor |

- `credentials: 'include'` en cliente HTTP existente.
- Si `mine`/`active` aún no existen (404), fallback mock solo para nombres seed El Paraíso; documentado para QA.
- Tras switch: `refreshSessionTheme()` (tokens `--brand`) + remount del panel.

---

## 3. Estados UI

| Vista | Loading | Empty | Error | Success |
|-------|---------|-------|-------|---------|
| Switcher N>1 | Skeleton / `aria-busy` | No aplica (N>1) | Toast «No se pudo cambiar de frutería» | Check en activa |
| N=1 | Nombre o skeleton | Sin control | — | Chrome F10 sin combobox |

---

## 4. Formularios

No hay formulario nuevo. El POST solo envía `{ providerId }`.

---

## 5. Responsive y accesibilidad

- [x] Móvil: trigger `w-full` `min-h-11`
- [x] Escritorio: trigger junto al logo
- [x] `role=combobox` / `listbox`, `aria-label="Frutería activa"`
- [x] Teclado Escape cierra; focus ring `--brand`

---

## 6. Pruebas

**Comando:** `npx vitest run tests/unit/provider-f11-ui.test.ts`

- Visibilidad N=1 vs N>1
- Colonia desde dirección seed

---

## 7. DoD Frontend

- [x] Fidelidad WF-HEADER / WF-ISO
- [x] Responsive
- [x] 4 estados del switcher
- [x] Capa servicios/hooks
- [x] a11y basal

---

## 8. Notas para downstream

### QA Tester

- **Fix BUG-017 (12/09/2026):** el scope se recarga al login (`SESSION_THEME_EVENT` + `reload` tras session OK). Sin esto N quedaba en 0 y no montaba chrome.
- Login `frutas@elparaiso.mx` → switcher y dos nombres (El Paraíso / El Paraíso Tecnológico) cuando el seed F11 exista.
- Login `verduras@campoverde.mx` → sin switcher, sin quinto tab.
- Rotar sucursal: colores y listados del panel deben corresponder a la activa (depende de cookie BE).
- 403 IDOR: copy «Este recurso no pertenece a la frutería activa».

### DevOps

Sin variables `NEXT_PUBLIC_*` nuevas. Cookie `lbm_active_provider` la setea el servidor.

## Outputs Generados

- **Archivo:** `fase-11/feature-handoffs/FEAT-HEADER-ISO-handoff.md`
- **Agente Downstream:** QA Tester
