# Handoff de Feature: FEAT-BRAND

> **Proyecto:** laborregamarket  
> **Feature:** BRAND (colores + tema sesión PROVIDER)  
> **Stack UI:** Next.js 15 + React 19 + Tailwind 4  
> **Fecha:** 2026-08-14  
> **Wireframe:** `WF-proveedor-marca`  
> **Contrato:** `API-PROVIDER-SETTINGS-01` (delta), `API-SESSION-THEME-01`

---

## 1. Pantallas y componentes implementados

| Pantalla / Vista | Wireframe | Ruta | Estado |
|------------------|-----------|------|--------|
| BrandColorPicker | `WF-proveedor-marca` | `/proveedor` | OK |
| Tema sesión | tokens CSS | layout raíz | OK |

**Componentes:** `BrandColorPicker`, `SessionThemeProvider`. Tokens `--brand`, `--brand-dark`, `--brand-secondary`.

No pinta cards de `/explorar` con el primario de cada frutería. Badges F3 (`OrderStatusBadge`, `OriginBadge`, `QuickSaleBadge`) no usan `--brand` del proveedor.

---

## 2. Integración API

| Endpoint | Método | Service | Contrato | Estado |
|----------|--------|---------|----------|--------|
| `/api/auth/session` | GET | `getAuthSession` | API-SESSION-THEME-01 | OK (404 → plataforma) |
| `/api/provider/me` | GET/PATCH | `getMyBusiness` / `updateProviderSettings` | API-PROVIDER-SETTINGS-01 | OK |

- Layout público **no** llama `/api/provider/me`.
- Tras PATCH colores o login/logout: `refreshSessionTheme()`.
- Si Backend F5 aún no expone session/colores, el picker muestra error de API y el chrome queda en plataforma.

---

## 3. Estados UI

| Vista | Loading | Empty | Error | Success |
|-------|---------|-------|-------|---------|
| Config colores | skeleton pickers | null = plataforma | hex / contraste / 400 `details.field` / red | toast + CSS vars |
| Sesión | — | brand null | — | PROVIDER con par válido |

---

## 4. Formularios y validación

| Formulario | Schema | Campos | Mensajes |
|------------|--------|--------|----------|
| Colores | hex `#RRGGBB` | primario ≥ 4.5:1 vs blanco; secundario ≥ 3:1 | inline; Guardar disabled si falla |
| Par | ambos hex o ambos null | — | “Debes indicar primario y secundario…” |

Reset: `PATCH { primaryColor: null, secondaryColor: null }`.

---

## 5. Responsive y accesibilidad

- [x] Preview CTA texto blanco
- [x] ContrastHint live (Should)
- [x] CLIENT/ADMIN/invitado = plataforma

---

## 6. Pruebas

**Comando:** `npx vitest run tests/unit/contrast.test.ts`

---

## 7. DoD Frontend

- [x] Pixel-fidelidad
- [x] Responsive
- [x] 4 estados
- [x] Consumo limpio de APIs (contrato session; fallback si 404)
- [x] Validación de formulario
- [x] Accesibilidad basal (contraste Must al guardar)

---

## 8. Notas para downstream

### QA Tester

- PROVIDER con colores: panel, POS, Explorar usan tokens.
- CLIENT en `/explorar` y `/fruteria/[id]`: marca plataforma.
- Logout restaura plataforma.
- Primario `#FFFF00` no se guarda.

### DevOps

- Sin env nueva para brand. Session `Cache-Control: private, no-store` es responsabilidad Backend.
