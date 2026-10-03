# Handoff de Feature: FEAT-SPRINT0

> **Proyecto:** laborregamarket  
> **Feature:** SPRINT0  
> **Stack UI:** Next.js 15 + React 19 + Tailwind  
> **Fecha:** 2026-08-10  
> **Wireframe de referencia:** `WF-explorar`, `WF-proveedor-panel`, `WF-login`  
> **Contrato de referencia:** N/A (cierre OBS Fase 1)

---

## 1. Pantallas y componentes

| Pantalla | OBS | Ruta | Estado |
|----------|-----|------|--------|
| Explorar mapa móvil | OBS-01 | `/explorar` | OK |
| PriceInput | OBS-04 | `/proveedor` | OK |
| Login hint + demo gate | OBS-03/05 | `/login` | OK |
| Redirect CLIENT | OBS-06 | post-login `/` | OK |
| Registro hint password | OBS-03 | `/registro` | OK |

## 2. Integración API

Sin endpoints nuevos. Verifica PATCH precios proveedor existente.

## 3. Estados UI

N/A (cierre residuales).

## 4. Responsive y accesibilidad

- [x] Mapa ~300px visible en `<lg`
- [x] PriceInput focus ring + teclado Enter/Escape
- [x] Demo accounts no renderizan en production

## 5. Pruebas sugeridas

- Viewport móvil: lista + mapa debajo
- Editar precio → persistencia al recargar
- Login CLIENT sin `redirect` → home `/`
- Build production: sin bloque “Cuentas demo”
