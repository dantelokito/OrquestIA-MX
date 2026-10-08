# STATUS — LaBorregaMarket

Fuente única de estado para todos los roles. Cada rol edita **solo su fila** y, si aplica, la sección de bugs o ruteo. Máximo ~2 KB: lo histórico vive en git y en `archivo/`.

| Campo | Valor |
|-------|-------|
| Fase activa | **15 — Blindaje legal, analítica y caché** (cerrada 2026-10-07) |
| Actúa ahora | **Humano** (merge del PR #15, y revisión legal antes de producción) |
| Código app | `C:\Users\PC GAMER\LaBorregaMarket` · `main` @ `1aeac1c` · rama `feat/f15-legal-cache` @ `a4fae9b` ([PR #15](https://github.com/dantelokito/BorregaMarket/pull/15)) |
| Versión producto | 0.15.0 |
| Actualizado | 2026-10-07 |

## Roles

| Rol | Estado | Archivo de la fase |
|-----|--------|--------------------|
| PM | F15: 11 US Must (BL-280…292). CO-F15-001…003 aceptados (caché solo `/api/providers*`, redondeo lat/lng, Nominatim a Won't). Gate humano: revisión legal antes de producción. Siguiente: BE | [`fase-15/pm.md`](fase-15/pm.md) |
| UX | F15 QG-correcciones: δ-diseño-1 ticket `formatQty` (`1.25 KG`); δ-diseño-2 explorar escritorio filtros visibles. Código sin cambio. Siguiente: QA | [`fase-15/ux.md`](fase-15/ux.md) |
| Arch | F15 diseñada: API-LEGAL-01…05, API-AUTH-15-01, API-PROV-15-01/02, API-NOTIFY-15-01, API-CACHE-15-01, API-CONSENT-15-01, API-AUDIT-15-01; DB-LegalSettings/LegalDocument/UserConsent + `whatsappOrderOptIn`; ADR-042 (legal), 043 (caché), 044 (Umami, llave `lbm_measurement`). CO-F15-001…003 pendientes de PM. Siguiente: BE | [`fase-15/arch.md`](fase-15/arch.md) |
| BE | F15: BUG-025 y BUG-026 ya estaban en `main` @ `1aeac1c`. Caché no altera el 400 ni el DTO de colores. Contrato sin cambio. Rama `feat/f15-legal-cache` @ `bdc0301`. Siguiente: QA | [`fase-15/be.md`](fase-15/be.md) |
| FE | F15: BUG-023 y BUG-029 en `aa01ff5`. BUG-024, 027, 028 y 030 no son regresión F15. Rama `feat/f15-legal-cache` @ `aa01ff5`. Siguiente: QA | [`fase-15/fe.md`](fase-15/fe.md) |
| QA | F15 APROBADO. Ruteo A. Bugs abiertos 0. Deltas 0. Matriz F15 24/24. Siguiente: DevOps | [`fase-15/qa.md`](fase-15/qa.md) |
| DevOps | PR #15 listo, CI verde. Versión 0.15.0. Post-merge: `npx prisma migrate deploy` y `npm run db:seed:legal`. Producción bloqueada hasta revisión legal. Actúa ahora: Humano | [`fase-15/devops.md`](fase-15/devops.md) |

## Ruteo QA (fase activa)

```
Dictamen: APROBADO
Bugs abiertos: 0
Deltas de diseño: 0
Deltas de contrato: 0
Ruteo: A
```

## Bugs vivos

Ninguno en F15. BUG-021, BUG-022, BUG-023 y BUG-029 cerrados.

## Deuda arrastrada (no Must)

- DT-F10-001 / DT-F10-002 (antes BUG-015 / BUG-016). EC-CART-015 llega a `/carrito` y luego cae por `crypto.randomUUID`.
- BUG-024: HP-POS-015, `crypto.randomUUID` ya en `main` @ `1aeac1c`
- BUG-025: upload de 20 MiB+1 → 500 por el tope de 10 MB del middleware de Next; ya en `main`
- BUG-026: PATCH admin de colores responde 200 sin `primaryColor`; el DTO ya era así en `main`
- BUG-027: botón PDF y KPI de ventas del dashboard; ya en `main`
- BUG-028: pin `lat=33&lng=-99` no vuelve a México; ya en `main`
- BUG-030: selectores de specs antiguas ausentes; ya en `main`
- Sign-off QA de F9 nunca emitido
- `US-ADMIN-04` / BL-177, BL-040 (pasarela), BL-243 (`SELECT FOR UPDATE`)

## Histórico

F1–F14 en `archivo/agentes/<agente>/.../outputs/laborregamarket/`. Solo se consulta si una tarea lo pide explícitamente.
