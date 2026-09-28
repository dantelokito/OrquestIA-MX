# QR-FE — Informe de calidad Frontend Fase 11

> **Proyecto:** LaBorregaMarket  
> **Fase:** 11 — Multi-frutería + reportes generales  
> **Fecha:** 2026-09-12  
> **Agente:** Frontend Developer  
> **Destinatario:** UX/UI Designer (Quality Gate)

Autoevaluación 10 criterios × 10 puntos. Umbral líder: **≥80%** y **0 P0**.

---

## Rúbrica

| # | Criterio | Puntos | Notas |
|---|----------|--------|-------|
| 1 | Fidelidad WF-HEADER / ISO | 9 | Switcher solo N>1; N=1 sin combobox; eyebrow + remount. |
| 2 | Módulo Reportes generales | 9 | Ruta nueva; 5º tab N>1; KPI F3; tabla sucursal; print Should. |
| 3 | Onboarding N+1 | 9 | Copy «Nueva frutería» / CTA «Crear frutería»; menú Agregar. |
| 4 | Demo Campo Verde | 10 | Fila `verduras@campoverde.mx`; unmount production. |
| 5 | Admin una fila / sucursal | 9 | Columna Sucursal + Dueño; cards móvil; empty sucursales. |
| 6 | Explorar 1 card / Provider | 9 | Chrome F9 intacto; título `businessName`; no agrupa FE. |
| 7 | Cookie activa (no header) | 10 | POST `/api/provider/active`; sin `X-Active-Provider-Id`. |
| 8 | 4 estados + a11y basal | 8 | Combobox; tabla caption; hit ≥44px. Sin auditoría lector. |
| 9 | Sin regresiones F7–F10 | 9 | Explorar/FilterBar; Reportes F10; no slate admin en panel. |
| 10 | Capa servicios + tests | 8 | `provider-f11.ts` + hook; unit N/colonia. Suite global BE en paralelo puede fallar tests de session. |

**Total: 90 / 100**

---

## P0 / P1

Ningún P0 de UI Must.

- **P1:** Print consolidado es Should (`window.print`).
- **P1 (atendido 12/09/2026):** BUG-017 — scope se recarga tras login (`SESSION_THEME_EVENT` + `reload` post-session). Ver `EVIDENCIA-BUG-017.md`.
- **P1 (atendido 12/09/2026):** BUG-018 — Explorar honra lat/lng de `window.location`. Ver `EVIDENCIA-BUG-018.md`.
- **P1:** Si el seed F11 no está aplicado, N=2 depende de `GET /api/provider/mine` o mock El Paraíso.
- **P1:** Tests unitarios de `session.service` los actualiza Backend (payload F11).

Residual Won't: pagos, Cloudinary, `US-ADMIN-04`, chips sección Explorar.

---

## Autoevaluación

- Grep docs FE F11: sin placeholders `[Insertar]`, `TODO`, `XXX`.
- Rutas de handoff en `fase-11/`.
- Inputs UX + Arch + US leídos antes de implementar.

## Outputs Generados

- **Archivo:** `fase-11/quality/QR-FE.md`
- **Agente Downstream:** UX/UI (QG) y QA (tras READY-FOR-QA)
