# STATUS — LaBorregaMarket

Fuente única de estado para todos los roles. Cada rol edita **solo su fila** y, si aplica, la sección de bugs o ruteo. Máximo ~2 KB: lo histórico vive en git y en `archivo/`.

| Campo | Valor |
|-------|-------|
| Fase activa | **15 — Blindaje legal, analítica y caché** (abierta 2026-10-03, autorizada por el humano) |
| Actúa ahora | **BE** (insumo `fase-15/arch.md` + `fase-15/ux.md`) |
| Código app | `C:\Users\PC GAMER\LaBorregaMarket` · `main` @ `1aeac1c` ([PR #14](https://github.com/dantelokito/BorregaMarket/pull/14) mergeado) · rama `feat/f15-legal-cache` |
| Versión producto | 0.14.0 |
| Actualizado | 2026-10-03 |

## Roles

| Rol | Estado | Archivo de la fase |
|-----|--------|--------------------|
| PM | F15: 11 US Must (BL-280…292). CO-F15-001…003 aceptados (caché solo `/api/providers*`, redondeo lat/lng, Nominatim a Won't). Gate humano: revisión legal antes de producción. Siguiente: BE | [`fase-15/pm.md`](fase-15/pm.md) |
| UX | F15 listo: 7 UF + 10 WF (footer, `/legal/*`, consentimiento, cookies, opt-in WhatsApp, admin Legal). Espera nombres de campo de Arch | [`fase-15/ux.md`](fase-15/ux.md) |
| Arch | F15 diseñada: API-LEGAL-01…05, API-AUTH-15-01, API-PROV-15-01/02, API-NOTIFY-15-01, API-CACHE-15-01, API-CONSENT-15-01, API-AUDIT-15-01; DB-LegalSettings/LegalDocument/UserConsent + `whatsappOrderOptIn`; ADR-042 (legal), 043 (caché), 044 (Umami, llave `lbm_measurement`). CO-F15-001…003 pendientes de PM. Siguiente: BE | [`fase-15/arch.md`](fase-15/arch.md) |
| BE | Sin pendientes | — |
| FE | Sin pendientes | — |
| QA | F14 APROBADO (Playwright 41/41, Zero Blocker) | — |
| DevOps | PR #14 listo, CI verde. Post-merge: `npx prisma migrate deploy` | — |

## Ruteo QA (fase activa)

```
Dictamen: APROBADO
Bugs abiertos: 0
Deltas de diseño: 0
Deltas de contrato: 0
Ruteo: A
```

## Bugs vivos

Ninguno.

## Deuda arrastrada (no Must)

- DT-F10-001 / DT-F10-002 (antes BUG-015 / BUG-016)
- Sign-off QA de F9 nunca emitido
- `US-ADMIN-04` / BL-177, BL-040 (pasarela), BL-243 (`SELECT FOR UPDATE`)

## Histórico

F1–F14 en `archivo/agentes/<agente>/.../outputs/laborregamarket/`. Solo se consulta si una tarea lo pide explícitamente.
