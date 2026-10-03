# Fase 11 — 1 proveedor → N fruterías

**Estado:** **cerrada documentalmente** 12/09/2026 (v0.11.0). Sign-off QA **APROBADO**. QG UX + QG Arquitecto **presentes**. **No hay fase 12.**

Siguiente: **DevOps deja PR listo**. Prohibido push/merge a `main` o producción; el **humano** mergea. Esta carpeta **no reabre** user stories.

Pagos fuera (`BL-040`). Fase 10 es **solo lectura**.

## Cierre

| Ítem | Ruta / estado |
|------|----------------|
| Sign-off QA | `QA Automation Engineer/Agente Tester/outputs/laborregamarket/fase-11/qa-signoffs/QA-F11-signoff.md` — **APROBADO** |
| QG-correcciones UX | `Agente UX UI/Agente UX UI/outputs/laborregamarket/fase-11/quality/QG-correcciones.md` |
| QG-correcciones Arquitecto | `Agente Arquitecto de Software/Agente Arquitecto/outputs/laborregamarket/fase-11/quality/QG-correcciones.md` |
| Evidencia FE BUG-017 | `Agente frontend/Agente Frontend/outputs/laborregamarket/fase-11/quality/EVIDENCIA-BUG-017.md` |
| Evidencia FE BUG-018 | `Agente frontend/Agente Frontend/outputs/laborregamarket/fase-11/quality/EVIDENCIA-BUG-018.md` |
| Must BL-190–197 | Hecho / cerrado en backlog PM |
| DevOps | Pendiente PR (sin merge) |

## Must (histórico — no reabrir)

| ID | US | Qué | Estado |
|----|-----|-----|--------|
| BL-190 | [US-AUTH-11](./user-stories/US-AUTH-11-sesion-multifruteria.md) | 1 User PROVIDER → N `Provider` + contexto `activeProviderId` | ✅ Cerrado |
| BL-191 | [US-HEADER-01](./user-stories/US-HEADER-01-switcher-fruteria.md) | Header: rotar frutería **solo si N>1**; N=1 banner como hoy | ✅ Cerrado |
| BL-192 | [US-ISO-01](./user-stories/US-ISO-01-aislamiento-sucursal.md) | Cada sucursal aislada: catálogo, secciones, media, POS, pedidos, reportes F10 | ✅ Cerrado |
| BL-193 | [US-DASH-11](./user-stories/US-DASH-11-reportes-globales.md) | **Módulo nuevo** de reportes globales (todas las sucursales); **solo N>1** | ✅ Cerrado |
| BL-194 | [US-ONB-01](./user-stories/US-ONB-01-alta-sucursal.md) | Reusar `/registro/negocio` para sucursal N+1 | ✅ Cerrado |
| BL-195 | [US-SEED-01](./user-stories/US-SEED-01-demo-paraiso-campoverde.md) | Seed El Paraíso ×2, Campo Verde ×1; Campo Verde en login | ✅ Cerrado |
| BL-196 | [US-ADMIN-11](./user-stories/US-ADMIN-11-filas-por-sucursal.md) | Admin: una fila y flags F10 **por sucursal** | ✅ Cerrado |
| BL-197 | [US-EXPLORE-11](./user-stories/US-EXPLORE-11-tarjeta-por-provider.md) | Explorar: una tarjeta por `Provider` | ✅ Cerrado |

## Visibilidad (no ambiguo)

- N = número de `Provider` del user. **No** es un flag de admin.
- **N>1:** switcher en banner + módulo distinto de reportes consolidados.
- **N=1:** sin switcher, sin módulo consolidado, chrome y Reportes F10 iguales a F10.

## Won't

Pagos, Cloudinary/S3, `US-ADMIN-04`, reopen F7–F10, DT-F10-001/002 como P0, catálogo **compartido**, CSV/CFDI.

## Artefactos PM

| Archivo | Uso |
|---------|-----|
| [prd.md](./prd.md) | PRD corto |
| [impacto-modulos.md](./impacto-modulos.md) | Impacto por módulo |
| [seed-demo.md](./seed-demo.md) | Cuentas y N sucursales |
| [handoff-ux-ui.md](./handoff-ux-ui.md) | Handoff UX (histórico) |
| [handoff-arquitecto.md](./handoff-arquitecto.md) | Handoff Arquitecto (histórico) |
| [activation-prompt-ux.txt](./activation-prompt-ux.txt) | Histórico activación UX |
| [activation-prompt-arquitecto.txt](./activation-prompt-arquitecto.txt) | Histórico activación Arch |
| [user-stories/](./user-stories/) | Ocho US Must (solo lectura) |

## Siguiente

Orquestador: activar **DevOps** en chat limpio. DoD DevOps = **PR abierto**, no merge. Humano autoriza el merge. **No** abrir fase 12.
