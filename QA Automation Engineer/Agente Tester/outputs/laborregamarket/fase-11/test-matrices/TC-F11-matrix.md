# Matriz de Casos de Prueba: TC-F11-matrix

> **Proyecto:** laborregamarket  
> **Módulo / Feature:** F11 multi-frutería (AUTH, HEADER, ISO, DASH, ONB, SEED, ADMIN, EXPLORE)  
> **Historia de Usuario / Contrato:** US-AUTH-11, US-HEADER-01, US-ISO-01, US-DASH-11, US-ONB-01, US-SEED-01, US-ADMIN-11, US-EXPLORE-11 / API-AUTH-11, API-PROVIDER-ISO-01, API-PROVIDER-REPORTS-03  
> **Fecha:** 2026-09-12  
> **Ambiente:** `http://127.0.0.1:8080`

---

## Resumen de ejecución

| Métrica | Valor |
|---------|-------|
| Total de casos | 17 automatizados Must + 4 edge documentados en API existente |
| Happy path ejecutados | 8/8 (100%) |
| Negativos / edge ejecutados | 6/6 (100%) |
| Seguridad ejecutados | 5/5 (100%) |
| Pass | 17 (12 API + 5 E2E) |
| Fail | 0 (re-prueba 12/09 post-fix FE) |
| Blocked | 0 |

---

## Tabla resumen

| ID | Nombre | Tipo | Prioridad | Estado |
|----|--------|------|-----------|--------|
| `TC-F11-001` | Session + mine El Paraíso N=2 | Positivo | P1 | Pass |
| `TC-F11-002` | Cookie activa; header X-Active-Provider-Id ignorado | Positivo | P1 | Pass |
| `TC-F11-003` | POST active id ajeno/inexistente 403 | Seguridad | P1 | Pass |
| `TC-F11-004` | SKU local A no aparece en B | Positivo | P1 | Pass |
| `TC-F11-005` | Global N>1 200 + reports F10 por activo | Positivo | P1 | Pass |
| `TC-F11-006` | Campo Verde global 403 GLOBAL_REPORTS_NOT_AVAILABLE | Negativo | P1 | Pass |
| `TC-F11-007` | Global 401/403 CLIENT/ADMIN | Seguridad | P1 | Pass |
| `TC-F11-008` | mine 401/403; active body extra 400 | Negativo | P1 | Pass |
| `TC-F11-009` | GET /api/providers dos El Paraíso + Campo Verde | Positivo | P1 | Pass |
| `TC-F11-010` | Admin una fila por sucursal (paginado) | Positivo | P1 | Pass |
| `TC-F11-011` | Alta N+1 POST /api/providers | Positivo | P1 | Pass |
| `TC-F11-012` | productIds ajenos en global 403 | Seguridad | P1 | Pass |
| `TC-F11-101` | UI switcher + Reportes generales N>1 | Positivo | P1 | Pass |
| `TC-F11-102` | UI N=1 sin switcher ni módulo; deep-link F10 | Positivo | P1 | Pass |
| `TC-F11-103` | Explorar dos cards El Paraíso | Positivo | P1 | Pass |
| `TC-F11-104` | Admin tab filas por sucursal visibles | Positivo | P1 | Pass |
| `TC-F11-105` | /registro/negocio copy Nueva frutería | Positivo | P1 | Pass |

---

## 1. Casos Positivos (Happy Path)

| ID | Nombre | Prerrequisitos | Resultado esperado | Estado |
|----|--------|----------------|-------------------|--------|
| `TC-F11-001` | Login `frutas@elparaiso.mx` | Seed F11 | `providerCount>=2`, Garza Sada 2501 + Constitución | Pass |
| `TC-F11-002` | Switch cookie | N=2 | `POST /active` + `GET /me` = sucursal B; header no cambia | Pass |
| `TC-F11-004` | Aislamiento CAT | N=2 | SKU creado en A ausente en productos de B | Pass |
| `TC-F11-005` | Reportes globales | N>1 | 200 `scope=allOwnedProviders`, `byProvider.length=N` | Pass |
| `TC-F11-009` | Listing explorar API | Seed | ≥2 nombres Paraíso + Campo Verde | Pass |
| `TC-F11-010` | Admin API | ADMIN | ≥2 filas Paraíso en todas las páginas | Pass |
| `TC-F11-011` | Alta N+1 | PROVIDER fresco | Segundo `POST /api/providers` 201 | Pass |
| `TC-F11-101` | Chrome N>1 | Mismo seed | Combobox + tab Reportes generales | Pass |

---

## 2. Casos Negativos (Unhappy Path)

| ID | Nombre | Input inválido | Error esperado | Estado |
|----|--------|----------------|----------------|--------|
| `TC-F11-006` | Global N=1 | `verduras@campoverde.mx` | 403 `GLOBAL_REPORTS_NOT_AVAILABLE` | Pass |
| `TC-F11-008` | Active `.strict()` | `{ extra: true }` | 400 | Pass |
| `TC-F11-102` | Deep-link global N=1 | `/proveedor/reportes-generales` | Redirect a Reportes F10 | Pass |

---

## 3. Casos Límite (Edge Cases)

| ID | Nombre | Condición límite | Resultado esperado | Estado |
|----|--------|------------------|-------------------|--------|
| `TC-F11-011` | Primer alta vs N+1 | Unique `userId` ya dropeado | 201 no 409 | Pass |
| `TC-F11-105` | Copy onboarding | Sesión PROVIDER | Heading «Nueva frutería», no «Crea tu cuenta» | Pass |
| `TC-F11-103` | Cards + geo default | `/explorar` con lat/lng | URL conserva pin; dos cards visibles | Pass |

---

## 4. Casos de Seguridad / Permisos

| ID | Nombre | Escenario RBAC | Resultado esperado | Estado |
|----|--------|----------------|-------------------|--------|
| `TC-F11-003` | IDOR active | Id Campo Verde o cuid inventado | 403 | Pass |
| `TC-F11-007` | Global sin privilegio | Anónimo / CLIENT / ADMIN | 401 / 403 / 403 | Pass |
| `TC-F11-008` | mine CLIENT | JWT CLIENT | 403 | Pass |
| `TC-F11-012` | productIds ajenos | SKU de Campo Verde en global Paraíso | 403 | Pass |
| `TC-F11-002` | Header spoof | `X-Active-Provider-Id` | Contexto no cambia | Pass |

---

## Referencias upstream

- ACs: `Administrador de producto/Product Manager/outputs/laborregamarket/fase-11/user-stories/`
- Contratos: `Agente Arquitecto de Software/Agente Arquitecto/outputs/laborregamarket/fase-11/api/`
- Handoff BE: `Agente backend/Agente backend/outputs/laborregamarket/fase-11/handoff-frontend.md`
- Handoff FE: `Agente frontend/Agente Frontend/outputs/laborregamarket/fase-11/feature-handoffs/FEAT-*.md`

## Specs

- `tests/tests/api/f11-multi-provider.spec.ts`
- `tests/tests/e2e/f11-multi-provider.spec.ts`

## Notas

- Antes de seed/migración, El Paraíso tenía N=1 (unique `userId` vigente). QA aplicó `npx prisma migrate deploy` y `npm run db:seed`. `npx prisma generate` falló con **EPERM** (DLL bloqueada); el servidor Next ya en 8080 siguió sirviendo.
- F10 diferidos (BUG-015/016) no se reabren como P0.
- Won't: pagos, Cloudinary, US-ADMIN-04, DT-F10-001/002.

## Inputs Utilizados

- **PRD / US:** workspace PM `fase-11/`
- **Contratos:** `API-AUTH-11`, `API-PROVIDER-ISO-01`, `API-PROVIDER-REPORTS-03`
- **Handoffs:** BE `handoff-frontend.md`, FE `FEAT-HEADER-ISO`, `FEAT-DASH-11`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-11/test-matrices/TC-F11-matrix.md`
- **Agente Downstream:** PM, Frontend, Backend
