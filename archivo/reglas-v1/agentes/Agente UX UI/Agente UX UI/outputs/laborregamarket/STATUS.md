# STATUS — LaBorregaMarket UX/UI

> **Última actualización:** 18/09/2026  
> **Fase activa:** **14** — QA APROBADO; QG-correcciones UX emitido (**sin deltas**); **espera PM cierre**. UX no promociona.

---

## Resumen ejecutivo

| Fase | Diseño | Quality Gate UX | Implementación FE |
|------|--------|-----------------|-------------------|
| Fase 1–5 | Completo | Cerrado / emitido | Implementadas |
| Fase 6 | Completo (congelada) | Pendiente FE histórico | No reabrir |
| Fase 7–8 | Completo (solo lectura) | — | No reabrir |
| Fase 9 | Cerrada (solo lectura) | 88/100 | Sign-off QA pendiente |
| Fase 10 | Diseño listo (solo lectura) | Tras FE F10 / excepción PM | Implementada en app |
| Fase 11 | Diseño listo (solo lectura) | QG-correcciones 12/09/2026 | QA APROBADO; no reactivar |
| Fase 12 | Diseño Must listo (solo lectura) | QG-correcciones 15/09/2026 | QA APROBADO; PM cerró F12 |
| Fase 13 | Diseño Must listo (solo lectura) | QG-correcciones 16/09/2026 | QA APROBADO; PR #13 en main |
| **Fase 14** | **Diseño Must listo** | **QG-correcciones 18/09/2026 (sin deltas)** | QA APROBADO; espera PM cierre |

---

## Fase 14 — Activa (18/09/2026)

Producto: pestaña **Perfil**; Catálogo solo productos; merma/ajuste/movimientos (sin kardex de ventas); series en reportes; PDF `from`/`to`.

QA **APROBADO** (`QA-F14-signoff.md`, 17/09/2026). Zero bugs (no BUG-021+). Playwright 41/41. Cola FE vacía.

QG UX: [`fase-14/quality/QG-correcciones.md`](./fase-14/quality/QG-correcciones.md) — **sin deltas**. FE respetó wireframes F14 (Perfil último en SubNav, catálogo sin identidad, merma/movimientos, SVG ADR-041). Tokens/IA **v0.14.0** intactos.

Handoff Frontend original: [`fase-14/handoff-frontend-fase-14.md`](./fase-14/handoff-frontend-fase-14.md).  
Índice: [`fase-14/README.md`](./fase-14/README.md).

**Siguiente:** PM cierra la fase cuando exista también el `QG-correcciones.md` de Arquitecto. UX **no** promociona y **no** lanza DevOps.

**No editar** `fase-13/` ni anteriores.

### Hechos de diseño

- SubNav: Perfil **último** (justificado: esporádico; Reportes generales N>1 queda junto a Ventas).
- Un GET me compartido en Perfil. Google lock intacto. Datos con errores inline AMM; `isVerified` no se resetea en UI.
- Movimientos: copy explícito sin ventas POS. Sheets merma/ajuste no aplastados.
- N=1: sin pantalla nueva (redirect intacto).

---

## Fase 13 — Solo lectura

QG-correcciones 16/09/2026. Ver [fase-13/README.md](./fase-13/README.md). F13 cerrada en producto (QA APROBADO; PR #13 mergeado).

---

## Referencias rápidas

- Índice: [README.md](./README.md)
- Fase 14: [fase-14/README.md](./fase-14/README.md)
- Tokens: [comun/design-tokens.md](./comun/design-tokens.md) v0.14.0
- IA: [comun/information-architecture.md](./comun/information-architecture.md) v0.14.0
