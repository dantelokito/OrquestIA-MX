# Matriz de Casos de Prueba: TC-RBAC-matrix

> **Proyecto:** laborregamarket  
> **Módulo / Feature:** RBAC extensión Fase 5  
> **Historia / Contrato:** transversal F5 — `API-SESSION-THEME-01`, `API-PROVIDER-SETTINGS-01`  
> **Fecha:** 2026-08-15  
> **Ambiente:** `http://127.0.0.1:8080`

---

## Resumen de ejecución

| Métrica | Valor |
|---------|-------|
| Total de casos | 6 |
| Seguridad | 6/6 |

---

## Tabla resumen

| ID | Nombre | Tipo | Prioridad | Auto |
|----|--------|------|-----------|------|
| TC-RBAC-023 | GET /api/auth/session sin token → 200 (no 401) | Seguridad | P1 | rbac.spec.ts / session.spec.ts |
| TC-RBAC-024 | GET session ADMIN → 200 brand null | Seguridad | P1 | session.spec.ts |
| TC-RBAC-025 | PATCH colores CLIENT → 403 | Seguridad | P1 | rbac.spec.ts |
| TC-RBAC-026 | ADMIN PATCH par de colores → 200 | Seguridad | P1 | provider-settings.spec.ts |
| TC-RBAC-027 | Gate Google 403 intacto si se tocan campos Google | Seguridad | P1 | provider-settings.spec.ts |
| TC-RBAC-028 | ADMIN PATCH isVerified=false conserva colores (EC-F5-10) | Seguridad | P2 | provider-settings.spec.ts |

---

## 4. Casos de Seguridad / Permisos

| ID | Nombre | Escenario RBAC | Resultado esperado | Estado |
|----|--------|----------------|-------------------|--------|
| TC-RBAC-023 | Session pública | sin cookie | 200 `authenticated:false` | Pass |
| TC-RBAC-024 | ADMIN chrome plataforma | login ADMIN | `brand: null` | Pass |
| TC-RBAC-025 | CLIENT no escribe marca | PATCH `/api/provider/me` colores | 403 | Pass |
| TC-RBAC-026 | ADMIN puede PATCH colores | `/api/admin/providers/{id}` | 200 par canonical | Pass |
| TC-RBAC-027 | Google gate | PROVIDER no verificado PATCH Place ID | 403; colores-only no 403 | Pass |
| TC-RBAC-028 | Unverify no borra marca | ADMIN `isVerified=false` | colores se conservan | Pass |

---

## Referencias upstream

- Contratos: `API-SESSION-THEME-01`, `API-PROVIDER-SETTINGS-01` (delta ADMIN)
- Gate Google F4: `TC-SET-003` / `HP-REV-04`

*Matriz Fase 5 — LaBorregaMarket v0.5.0*
