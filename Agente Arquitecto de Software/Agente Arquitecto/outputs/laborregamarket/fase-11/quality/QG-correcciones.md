# QG-correcciones — Arquitectura Fase 11

> **Proyecto:** laborregamarket  
> **Fase:** 11 — v0.11.0  
> **Fecha:** 12/09/2026  
> **Agente:** Arquitecto de Software  
> **Trigger:** QA APROBADO (`QA Automation Engineer/.../fase-11/qa-signoffs/QA-F11-signoff.md`)  
> **Dictamen:** Contratos API, modelo de datos y ADRs **intactos**. Sin enmienda estructural.

## Inputs Utilizados

- **Sign-off QA:** `QA Automation Engineer/Agente Tester/outputs/laborregamarket/fase-11/qa-signoffs/QA-F11-signoff.md` (API Must 12/12; E2E 101–105 Pass)
- **Evidencia FE:** `Agente frontend/Agente Frontend/outputs/laborregamarket/fase-11/quality/EVIDENCIA-BUG-017.md`, `EVIDENCIA-BUG-018.md`
- **Handoff BE → FE:** `Agente backend/Agente backend/outputs/laborregamarket/fase-11/handoff-frontend.md`
- **ADRs vivos:** `comun/adrs/ADR-034-user-providers-1n-active.md`, `comun/adrs/ADR-035-global-provider-reports.md`
- **Contratos F11:** `fase-11/api/API-AUTH-11.md`, `API-PROVIDER-ISO-01.md`, `API-PROVIDER-REPORTS-03.md`, `API-EXPLORE-11.md`, `data-model/DB-providers.md`

## 1. Cookie vs header vs JWT claim

**Se confirma ADR-034, opción A. No se enmienda.**

| Fuente | Estado post-QA |
|--------|----------------|
| Cookie `lbm_active_provider` (httpOnly, Path=/, SameSite=Lax; Secure solo HTTPS) | **Fuente de verdad** del activo. QA: cookie + aislamiento + IDOR 403. |
| Claim `activeProviderId` en JWT (`lbm_token`) | **Rechazado.** JWT = `sub` + `role`. Switch no reemite JWT. |
| Header `X-Active-Provider-Id` | **Ignorado** si llega. No es Must. |

BUG-017 no tocó el mecanismo de cookie: el scope FE se hidrataba con `providers=[]` en `/login` y no reconsultaba sesión. El servidor ya devolvía `GET /api/provider/mine` con `providerCount >= 2`.

## 2. Reportes globales

**Se confirma ADR-035, opción A. No se enmienda.**

| Regla | Contrato |
|-------|----------|
| Path | `GET /api/provider/reports/global` (distinto de `GET /api/provider/reports` F10) |
| N ≤ 1 (incluye N=0) | **403** `GLOBAL_REPORTS_NOT_AVAILABLE` — no 404, no 200 vacío |
| N > 1 | 200; agrega **todas** las sucursales del `session.sub`; **no** filtra por cookie activa |
| Query Must | `from` + `to` (YYYY-MM-DD), TZ America/Monterrey; `productIds` opcional |

QA: API 12/12 cubre 403 N=1 (Campo Verde) y 200 N>1 (El Paraíso). FE oculta el 5º tab si `providerCount <= 1`; el API sigue siendo la autoridad en deep-link.

## 3. User 1:N y unique `userId`

**Se confirma. No se reabre unique.**

- Relación `User.providers` 1:N.
- Migración BE documentada: `prisma/migrations/20260912160000_drop_provider_userid_unique`.
- Índice no único `providers_user_id_idx`.
- IDOR mismo user, sucursal distinta del activo → **403** (no 404).
- `POST /api/providers` permite N+1; cookie pasa a la sucursal nueva.

## 4. Contratos API: intactos

**Declaración explícita:** la corrida QA APROBADO y los fixes **no cambiaron** método, path, auth, payloads ni códigos de `API-AUTH-11`, `API-PROVIDER-ISO-01`, `API-PROVIDER-ONB-01`, `API-PROVIDER-REPORTS-03`, `API-ADMIN-PROVIDERS-02`, `API-EXPLORE-11`, `API-SEED-11` ni `DB-providers`.

| Bug | Capa | ¿Contrato? |
|-----|------|------------|
| BUG-017 (session/scope hidratación) | Frontend (`ProviderScopeProvider`, login → `/proveedor`) | No. API ya exponía `providers[]` / `providerCount`. |
| BUG-018 (Explorar URL `lat`/`lng`) | Frontend (`ExplorePageClient`, no pisar query) | No. `API-EXPLORE-11` sin API nueva; clamp 0.5–10 km (CO-F8-001) intacto. |

No se crea ADR-036. SAD `comun/sad.md` v0.11.0 no se edita.

## 5. Nota de integración (sesión) — no regresar BUG-017 al contrato

El delta de `GET /api/auth/session` **ya incluye** `providers`, `providerCount` y `activeProviderId`. Eso **no** es un cambio post-QA; es el contrato F11 original.

Para que el chrome (switcher + tab Reportes generales) no vuelva a quedar en N=0:

1. Tras `login`, el FE **debe** reconsultar `GET /api/auth/session` (o `GET /api/provider/mine` con `credentials: include`) **después** de que la sesión sea autenticada. No reutilizar un scope hidratado en `/login` sin cookie PROVIDER.
2. El árbol persistente de React **no** es fuente de verdad de N. N = respuesta servidor.
3. `SESSION_THEME_EVENT` / `reload()` del scope son detalle FE; no se añaden campos al JWT ni al envelope de session.
4. Invitado / CLIENT / ADMIN: `providers: []`, `providerCount: 0`, `activeProviderId: null` — esperado; no es bug de contrato.

No se documenta un “contrato de sesión v2”. Quien implemente hidratación futura debe leer `API-AUTH-11` + esta nota, no ampliar el payload.

## 6. Nota ADR

| ADR | Acción |
|-----|--------|
| ADR-034 | **Sin nota de reemplazo.** Cookie httpOnly confirmada en implementación y QA. |
| ADR-035 | **Sin nota de reemplazo.** Path global + 403 N≤1 confirmados (API 12/12). |

## 7. Qué no se tocó

- SAD, ADRs, `fase-11/api/*`, `fase-11/data-model/*`.
- Código de la app (fuera de alcance Arquitecto).
- Activación Backend / DevOps (orquestador / humano).
- Otras fases.

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-11/quality/QG-correcciones.md`
- **Agente Downstream:** Product Manager (puede cerrar/promover cuando exista también QG UX)
- **ADR/SAD:** no actualizados
