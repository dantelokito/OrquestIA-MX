# QG-correcciones — Arquitectura Fase 14

> **Proyecto:** laborregamarket  
> **Fase:** 14 — v0.14.0  
> **Fecha:** 18/09/2026  
> **Agente:** Arquitecto de Software  
> **Trigger:** QA APROBADO (`QA Automation Engineer/Agente Tester/outputs/laborregamarket/fase-14/qa-signoffs/QA-F14-signoff.md`)  
> **Dictamen:** Contratos API, modelo de datos y ADRs **intactos**. **Sin deltas.** Sin enmienda estructural.

## Inputs Utilizados

- **Sign-off QA:** `QA Automation Engineer/Agente Tester/outputs/laborregamarket/fase-14/qa-signoffs/QA-F14-signoff.md` (Playwright API 35/35 + E2E 6/6, dictamen APROBADO, Zero Blocker PASS, **zero bugs**)
- **Matriz:** `QA Automation Engineer/Agente Tester/outputs/laborregamarket/fase-14/test-matrices/TC-F14-matrix.md`
- **Contratos F14:** `fase-14/api/API-PROVIDER-SETTINGS-14.md`, `API-PROVIDER-PROFILE-14.md`, `API-PROVIDER-OFFER-14.md`, `API-PROVIDER-SECTIONS-14.md`, `API-INVENTORY-14.md`, `API-PROVIDER-REPORTS-14.md`
- **Datos F14:** `fase-14/data-model/DB-inventory-entries.md`, `DB-providers.md`
- **ADRs vivos:** `comun/adrs/ADR-039-isverified-coords.md`, `comun/adrs/ADR-040-merma-aditiva.md`, `comun/adrs/ADR-041-graficas-svg.md`

## 1. Declaración explícita

**No hubo bugs de contrato, ADR ni esquema de datos en F14. No hay deltas post-QA.**

QA no abrió `BUG-021+`. No hay handoff de retorno, ni evidencia BE/FE, ni re-prueba de defecto. Los contratos F14 y ADR-039 / ADR-040 / ADR-041 **no fueron revertidos** por QA. Must de perfil, catálogo/POS, merma/ajuste aditivos y reportes/PDF cumple contra US y contratos.

Un 500 inicial en merma/ajuste (Prisma client desactualizado porque `next` bloqueaba `prisma generate`) quedó clasificado por QA como **fallo de proceso local**, no de producto. Tras `migrate deploy` + reinicio: 41/41 Pass. Eso **no** altera paths, payloads, `InventoryEntry.kind` ni envelope.

| Bug | Capa | ¿Contrato / ADR / schema? |
|-----|------|---------------------------|
| Ninguno | N/A | **Sin delta.** |

**Sin ADR nuevo.** ADR-039, ADR-040 y ADR-041 **no** se enmiendan. SAD `comun/sad.md` v0.14.0 **no** se edita. No hay delta de columnas ni de índices en `InventoryEntry` / `Provider`.

## 2. Contratos vigentes (sin delta post-QA)

| Artefacto | Acción |
|-----------|--------|
| `API-PROVIDER-SETTINGS-14` | Intactos: PATCH datos de negocio + pin AMM; `isVerified` no se apaga |
| `API-PROVIDER-PROFILE-14` | Intactos (sin semántica nueva) |
| `API-PROVIDER-OFFER-14` | Intactos: precio vendible > 0 |
| `API-PROVIDER-SECTIONS-14` | Intactos: 409 de sección |
| `API-INVENTORY-14` | Intactos: merma/ajuste/movimientos; `kind` en `InventoryEntry`; 400 si `onHand` negativo |
| `API-PROVIDER-REPORTS-14` | Intactos: series/products/bySource; PDF `from`/`to`; N=1 403 |
| `DB-inventory-entries` / `DB-providers` | Sin columnas ni índices nuevos post-QA |
| ADR-039 / ADR-040 / ADR-041 | **Sin nota de reemplazo.** Confirmados en QA. |

## 3. Nota ADR

| ADR | Acción |
|-----|--------|
| ADR-039 | **Sin nota de reemplazo.** `isVerified` intacto al mudar pin; bbox AMM del pin confirmado. |
| ADR-040 | **Sin nota de reemplazo.** Merma/ajuste aditivos en `InventoryEntry.kind`; sin tabla `InventoryMovement`. |
| ADR-041 | **Sin nota de reemplazo.** SVG unificado; sin librería npm; N=1 403. |
| ADR-022 / ADR-036 / ADR-038 | Intactos (solo lectura). Inventario blando en **venta**; merma/ajuste con 400. |

## 4. Qué no se tocó

- `fase-14/api/*`, `fase-14/data-model/*`, `comun/adrs/ADR-039*`, `ADR-040*`, `ADR-041*`, SAD.
- Código de la app (fuera de alcance Arquitecto).
- Promoción de fase. Activación DevOps.
- `fase-13/` y anteriores: **solo lectura.** No reabrir F13.

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/quality/QG-correcciones.md`
- **Agente Downstream:** Product Manager (puede cerrar/promover cuando exista también QG UX)
- **ADR/SAD:** no actualizados
- **Deltas:** **no**
