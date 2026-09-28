# Handoff de Feature: FEAT-CAT-14

> **Proyecto:** laborregamarket  
> **Feature:** CAT (US-CAT-21/22/23) + POS toggle fotos  
> **Stack UI:** Next.js 15 + React 19 + TypeScript + Tailwind 4  
> **Fecha:** 2026-09-17  
> **Wireframe de referencia:** `WF-CAT-21-catalogo-pos.md`, `WF-CAT-22-precio-activar.md`, `WF-CAT-23-error-seccion.md`  
> **Contrato de referencia:** `API-PROVIDER-OFFER-14`, `MOD-OFFER-SECTIONS-F14-handoff.md`

## Inputs Utilizados

- Handoff UX F14 + JSON Backend F14 (precio > 0, 409 sección)

---

## 1. Pantallas

| Vista | WF | Ruta | Estado |
|-------|----|------|--------|
| Catálogo solo productos | WF-CAT-21 | `/proveedor` | OK; identidad movida a Perfil |
| Toggle fotos POS | WF-CAT-21 | `/proveedor/pos` | OK PATCH `posShowImages` |
| Diálogo precio > 0 | WF-CAT-22 | modal Catálogo | OK; **cero** `price ?? 50` |
| Banner 409 sección | WF-CAT-23 | fuera del form Nueva sección | OK |

**Componentes:** `PriceRequiredDialog`. Helper: `needsPriceToActivate`.

---

## 2. Integración API

| Endpoint | Método | Service |
|----------|--------|---------|
| `/api/provider/products` | PATCH | `updateProduct` sin default 50 |
| `/api/provider/local-products/{id}` | PATCH | `patchLocalProduct` |
| `/api/provider/sections/{id}` | DELETE | `deleteSection`; 409 → banner |
| `/api/provider/me` | PATCH | `posShowImages` desde POS |

---

## 3. Estados UI

| Vista | Loading | Empty | Error | Success |
|-------|---------|-------|-------|---------|
| PriceRequiredDialog | CTA Guardando | input vacío | ≤0 / 400 API | cierra; switch ON |
| 409 sección | — | — | banner amber `role="alert"` | recarga grupos |

---

## 4. Won't

No Cloudinary. No identidad en Catálogo. Grain no aplica.

---

## 5. Pruebas

`tests/unit/provider-f14-ui.test.ts` (diálogo si precio nulo/0). Suite: **409 passed / 87 files**.

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/feature-handoffs/FEAT-CAT-14-handoff.md`
- **Agente Downstream:** QA Tester
