# STATUS — LaBorregaMarket

Fuente única de estado para todos los roles. Cada rol edita **solo su fila** y, si aplica, la sección de bugs o ruteo. Máximo ~2 KB: lo histórico vive en git y en `archivo/`.

| Campo | Valor |
|-------|-------|
| Fase activa | **15 — Blindaje legal, analítica y caché** (abierta 2026-10-03, autorizada por el humano) |
| Actúa ahora | **Orquestador** (Ruteo B · 8 bugs Major, 0 deltas). No lanzar FE ni BE |
| Código app | `C:\Users\PC GAMER\LaBorregaMarket` · `main` @ `1aeac1c` ([PR #14](https://github.com/dantelokito/BorregaMarket/pull/14) mergeado) · rama `feat/f15-legal-cache` |
| Versión producto | 0.14.0 |
| Actualizado | 2026-10-03 |

## Roles

| Rol | Estado | Archivo de la fase |
|-----|--------|--------------------|
| PM | F15: 11 US Must (BL-280…292). CO-F15-001…003 aceptados (caché solo `/api/providers*`, redondeo lat/lng, Nominatim a Won't). Gate humano: revisión legal antes de producción. Siguiente: BE | [`fase-15/pm.md`](fase-15/pm.md) |
| UX | F15 QG-correcciones: δ-diseño-1 ticket `formatQty` (`1.25 KG`); δ-diseño-2 explorar escritorio filtros visibles. Código sin cambio. Siguiente: QA | [`fase-15/ux.md`](fase-15/ux.md) |
| Arch | F15 diseñada: API-LEGAL-01…05, API-AUTH-15-01, API-PROV-15-01/02, API-NOTIFY-15-01, API-CACHE-15-01, API-CONSENT-15-01, API-AUDIT-15-01; DB-LegalSettings/LegalDocument/UserConsent + `whatsappOrderOptIn`; ADR-042 (legal), 043 (caché), 044 (Umami, llave `lbm_measurement`). CO-F15-001…003 pendientes de PM. Siguiente: BE | [`fase-15/arch.md`](fase-15/arch.md) |
| BE | F15: BUG-025 y BUG-026 ya estaban en `main` @ `1aeac1c`. Caché no altera el 400 ni el DTO de colores. Contrato sin cambio. Rama `feat/f15-legal-cache` @ `bdc0301`. Siguiente: QA | [`fase-15/be.md`](fase-15/be.md) |
| FE | F15: BUG-021 cerrado. BUG-022 (Guardar) en `bdc0301`. Rama `feat/f15-legal-cache` @ `bdc0301`. Siguiente: QA | [`fase-15/fe.md`](fase-15/fe.md) |
| QA | F15 RECHAZADO. Ruteo B. 8 bugs Major abiertos (BUG-023…030). Deltas cerrados. Playwright 426/24/0 | [`fase-15/qa.md`](fase-15/qa.md) |
| DevOps | PR #14 listo, CI verde. Post-merge: `npx prisma migrate deploy` | — |

## Ruteo QA (fase activa)

```
Dictamen: RECHAZADO
Bugs abiertos: 8
Deltas de diseño: 0
Deltas de contrato: 0
Ruteo: B
```

## Bugs vivos

- BUG-023 Major FE: el aviso de cookies tapa «Ver carrito».
- BUG-024 Major FE: POS sin `randomUUID` muestra «Algo salió mal».
- BUG-025 Major BE: upload de 20 MiB+1 responde 500.
- BUG-026 Major BE: PATCH admin de colores responde 200 sin `primaryColor`.
- BUG-027 Major FE: PDF de reportes visible; KPIs del dashboard en 0.
- BUG-028 Major FE: pin fuera de México no reescribe la URL; el hover de explorar no abre el diálogo.
- BUG-029 Major FE: registro con casilla se queda en `/registro`.
- BUG-030 Major FE: faltan controles de catálogo, marca, verificación, venta rápida, Encargar y sucursales admin.
- BUG-021 y BUG-022 cerrados. Deltas de diseño y de suite cerrados. No lanzar FE ni BE.

## Deuda arrastrada (no Must)

- DT-F10-001 / DT-F10-002 (antes BUG-015 / BUG-016)
- Sign-off QA de F9 nunca emitido
- `US-ADMIN-04` / BL-177, BL-040 (pasarela), BL-243 (`SELECT FOR UPDATE`)

## Histórico

F1–F14 en `archivo/agentes/<agente>/.../outputs/laborregamarket/`. Solo se consulta si una tarea lo pide explícitamente.
