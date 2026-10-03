# Fase 6 — Confiabilidad + reportes + GEO zoom↔radio (PM)

**Estado:** discovery cerrado 16/08/2026 (v0.6.1). Alcance Dante: **deuda P0/P1** + **reportes proveedor** (día/mes/año, print + PDF) + **homologar zoom del mapa con el radio** y loading al refrescar lista. **Pagos fuera hasta nuevo aviso.**

**US deuda:** `US-NOTIFY-10`, `US-OPS-04`, `US-OPS-05`, `US-GEO-06`, `US-BRAND-03` (Must); `US-OPS-06`, `US-AUTH-08` (Should); `US-OPS-07` (Could)

**US reportes:** `US-DASH-04`, `US-DASH-05`, `US-DASH-06`

**US GEO slice C:** `US-GEO-07`, `US-GEO-08` (loader borrega B1–B3)

**Change orders:** [`CO-F6-001`](./change-orders/CO-F6-001-sprint-confiabilidad.md) (pagos fuera) · [`CO-F6-002`](./change-orders/CO-F6-002-zoom-radio-sync.md) (zoom↔radio)

**Loader (diseño):** [`../comun/brand/loader-borrega/`](../comun/brand/loader-borrega/)

| Artefacto | Ruta |
|-----------|------|
| PRD | [prd.md](./prd.md) |
| Historias | [user-stories/](./user-stories/) |
| Change orders | [change-orders/](./change-orders/) |
| Handoff UX | [handoff-ux-ui.md](./handoff-ux-ui.md) |
| Handoff Arquitecto | [handoff-arquitecto.md](./handoff-arquitecto.md) |
| Prompt activación UX (DASH + GEO) | [activation-prompt-ux.txt](./activation-prompt-ux.txt) |
| Prompt activación Arquitecto (DASH + GEO) | [activation-prompt-arquitecto.txt](./activation-prompt-arquitecto.txt) |
| Prompt Frontend (deuda; GEO tras WF) | [activation-prompt-frontend.txt](./activation-prompt-frontend.txt) |
| Prompt Backend (deuda) | [activation-prompt-backend.txt](./activation-prompt-backend.txt) |
| Prompt DevOps (deuda) | [activation-prompt-devops.txt](./activation-prompt-devops.txt) |

## Tres slices

| Slice | Quién diseña | Quién implementa |
|-------|----------------|------------------|
| **A — Deuda** | Ya listo (UX + Arquitecto, 16/08) | Frontend, Backend, DevOps |
| **B — Reportes DASH** | UX + Arquitecto (ciclo nuevo) | Frontend, Backend tras contratos/WF |
| **C — GEO zoom↔radio** | UX + Arquitecto (delta Explorar) | Frontend sobre Leaflet F5; BE solo si el query no basta (esperado: no) |

## Qué no hacer aquí

- No implementar pasarela, CFDI, PWA, flotilla, cobros POS nuevos ni pago en línea.
- No rediseñar el slice de deuda (handoffs UX/Arch del 16/08).
- No copiar `/admin/analytics` al proveedor.
- No tratar ticket térmico ni CFDI como “imprimir reporte”.
- No clustering ni API bbox Must.
- No escribir en `fase-5/` (solo lectura).
