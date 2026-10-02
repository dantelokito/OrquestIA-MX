# Handoff de Feature: FEAT-POS-12

> **Proyecto:** laborregamarket  
> **Feature:** POS-12 (fotos en card + preferencia por sucursal)  
> **Stack UI:** Next.js 15 + React 19 + TypeScript + Tailwind 4  
> **Fecha:** 2026-09-14  
> **Wireframe de referencia:** `WF-POS-12-cards-toggle.md`  
> **Contrato de referencia:** `API-PROVIDER-PREFS-12.md`. Sin MOD-handoff F12.

---

## 1. Pantallas y componentes implementados

| Pantalla / Vista | Wireframe | Ruta | Estado |
|------------------|-----------|------|--------|
| PosImagesToggle | WF-POS-12 | `/proveedor` junto a toolbar secciones | OK |
| PosProductCard | WF-POS-12 | `/proveedor/pos` | OK |

**Prohibido cumplido:** el switch **no** está en toolbar POS, ticket ni keypad.

---

## 2. Integración API

| Endpoint | Método | Service | Contrato | Estado |
|----------|--------|---------|----------|--------|
| `/api/provider/me` | GET | `getMyBusiness` | API-PROVIDER-PREFS-12 | `posShowImages` default true si ausente |
| `/api/provider/me` | PATCH | `updateProviderSettings` | API-PROVIDER-PREFS-12 | revert + alerta si falla |

Si PATCH/GET de preferencia aún no existe en BE: POS asume ON; CAT muestra «No se guardó la preferencia» y revierte el switch.

- [x] Sin fetch en la vista
- [x] Hit area switch ≥44px (`h-11 min-w-11`)

---

## 3. Estados UI

| Vista | Loading | Empty | Error | Success |
|-------|---------|-------|-------|---------|
| Cards POS | skeletons vigentes | catálogo vacío F3 | ErrorBanner catálogo | cards con/sin slot img |
| Toggle | disabled busy | — | role=alert No se guardó la preferencia | persistido |

---

## 4. Formularios

Switch boolean; validación 400 del contrato se muestra como error recuperable.

---

## 5. Responsive y a11y

- Cards 2 col móvil / 3 desktop; slot 16:9.
- Switch teclado (button role=switch).
- Default ON por sucursal activa (cookie ISO F11).

---

## 6. Pruebas

Manual: ver QR-FE. Unit: capacidad no aplica aquí.

---

## 7. DoD Frontend

- [x] Toggle en `/proveedor` no en POS
- [x] Default ON
- [x] Cards condicionales
- [x] Error revert
- [x] a11y ≥44px

---

## 8. Notas QA

- Cambiar sucursal (N>1) debe leer preferencia de esa frutería.
- Miniaturas CAT no dependen del flag.

## Inputs Utilizados

- WF-POS-12, API-PROVIDER-PREFS-12, US-POS-12

## Outputs Generados

- **Archivo:** `fase-12/feature-handoffs/FEAT-POS-12-handoff.md`
- **Agente Downstream:** QA
