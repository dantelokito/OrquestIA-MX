# Matriz de Casos de Prueba: TC-BRAND-matrix

> **Proyecto:** laborregamarket  
> **Módulo / Feature:** Marca PROVIDER (colores + tema de sesión)  
> **Historia / Contrato:** `US-BRAND-01, US-BRAND-02`, `API-PROVIDER-SETTINGS-01`, `API-SESSION-THEME-01`  
> **Fecha:** 2026-08-15  
> **Ambiente:** `http://127.0.0.1:8080`

---

## Resumen de ejecución

| Métrica | Valor |
|---------|-------|
| Total de casos | 14 |
| Happy path ejecutados | 10/10 |
| Negativos / edge ejecutados | 4/4 |
| Seguridad ejecutados | ver TC-RBAC |

---

## Tabla resumen

| ID | Nombre | Tipo | Prioridad | Auto |
|----|--------|------|-----------|------|
| TC-BRAND-001 | GET /api/provider/me incluye par de colores | Positivo | P1 | provider-settings.spec.ts |
| TC-BRAND-002 | PATCH par válido → `#` + uppercase | Positivo | P1 | provider-settings.spec.ts |
| TC-BRAND-003 | Primario sin contraste AA (`#F9A825`) → 400 | Negativo | P1 | provider-settings.spec.ts |
| TC-BRAND-004 | Secundario `#FFFF00` → 400 (EC-F5-02) | Negativo | P1 | provider-settings.spec.ts |
| TC-BRAND-005 | Solo un color del par → 400 | Negativo | P1 | provider-settings.spec.ts |
| TC-BRAND-006 | Hex `#RGB` o sin `#` → 400 (EC-F5-01) | Negativo | P1 | provider-settings.spec.ts |
| TC-BRAND-007 | Reset ambos `null` → plataforma | Positivo | P1 | provider-settings.spec.ts |
| TC-BRAND-008 | PROVIDER no verificado PATCH solo colores → 200 | Positivo | P1 | provider-settings.spec.ts |
| TC-SESS-001 | GET /api/auth/session invitado → 200 brand null | Positivo | P1 | session.spec.ts |
| TC-SESS-002 | CLIENT autenticado brand null (EC-F5-03) | Positivo | P1 | session.spec.ts |
| TC-SESS-003 | PROVIDER con par válido brand.source=provider | Positivo | P1 | session.spec.ts |
| HP-BRAND-01 | Picker + toast “Colores de tu marca actualizados” | Positivo | P1 | e2e/provider-brand.spec.ts |
| HP-BRAND-02 | CLIENT/invitado Explorar = tokens plataforma | Positivo | P1 | e2e/provider-brand.spec.ts |
| HP-BRAND-02b | Logout restaura plataforma | Positivo | P1 | e2e/provider-brand.spec.ts |

---

## 1. Casos Positivos (Happy Path)

| ID | Nombre | Prerrequisitos | Resultado esperado | Estado |
|----|--------|----------------|-------------------|--------|
| TC-BRAND-001 | Campos GET me | PROVIDER seed | `primaryColor` / `secondaryColor` presentes (hex o null) | Pass |
| TC-BRAND-002 | Par `#1B5E20` / `#0D47A1` | PROVIDER | 200 canonical uppercase | Pass |
| TC-BRAND-007 | Reset null/null | tras PATCH válido | GET me null; session brand null | Pass |
| TC-BRAND-008 | Colores sin isVerified | `registerUnverifiedProvider` | 200; no 403 Google | Pass |
| TC-SESS-001 | Invitado | sin cookie | 200 `authenticated:false`, `brand:null` (no 401) | Pass |
| TC-SESS-003 | PROVIDER + par | colores válidos | `brand.primaryColor` + `source: provider` | Pass |
| HP-BRAND-01 | UI picker | `/proveedor` | Preview CTA blanco; toast éxito | Pass |

---

## 2. Casos Negativos (Unhappy Path)

| ID | Nombre | Input inválido | Error esperado | Estado |
|----|--------|----------------|----------------|--------|
| TC-BRAND-003 | Primario `#F9A825` | contraste &lt; 4.5 | 400 `details.field=primaryColor` | Pass |
| TC-BRAND-004 | Secundario `#FFFF00` | contraste &lt; 3 | 400 `secondaryColor` | Pass |
| TC-BRAND-005 | Solo primario | par mixto | 400 “Debes indicar primario y secundario…” | Pass |
| TC-BRAND-006 | `#1B5` / `1B5E20` | hex inválido | 400 | Pass |

---

## 3. Casos Límite (Edge Cases)

| ID | Nombre | Condición límite | Resultado esperado | Estado |
|----|--------|------------------|-------------------|--------|
| TC-SESS-002 | CLIENT session | login CLIENT | 200 `brand: null` | Pass |
| HP-BRAND-02b | Logout | PROVIDER con marca | chrome `--brand` vuelve a plataforma | Pass |

---

## 4. Casos de Seguridad / Permisos

Cubiertos también en `TC-RBAC-matrix` (session pública, ADMIN PATCH, gate Google intacto).

---

## Referencias upstream

- ACs: `US-BRAND-01`, `US-BRAND-02`
- Contratos: `API-PROVIDER-SETTINGS-01`, `API-SESSION-THEME-01`
- Handoff FE: `FEAT-BRAND-handoff.md`
- ADR-021

---

## Notas

- Restaurar colores seed (`null`/`null`) al final de mutaciones.
- Tokens UI: `--brand`, `--brand-dark`, `--brand-secondary`. Plataforma `#e23744` / `#c13515`.
- Cards de Explorar **no** se pintan con el primario de cada frutería.

*Matriz Fase 5 — LaBorregaMarket v0.5.0*
