# QG-correcciones — Arquitectura Fase 13

> **Proyecto:** laborregamarket  
> **Fase:** 13 — v0.13.0  
> **Fecha:** 16/09/2026  
> **Agente:** Arquitecto de Software  
> **Trigger:** QA APROBADO (`QA Automation Engineer/.../fase-13/qa-signoffs/QA-F13-signoff.md`)  
> **Dictamen:** Contratos API, modelo de datos y ADRs **intactos**. Sin enmienda estructural.

## Inputs Utilizados

- **Sign-off QA:** `QA Automation Engineer/Agente Tester/outputs/laborregamarket/fase-13/qa-signoffs/QA-F13-signoff.md` (Playwright 19/19: API 15/15 + E2E 4/4, dictamen APROBADO, Zero Blocker PASS)
- **Bug:** `QA Automation Engineer/Agente Tester/outputs/laborregamarket/fase-13/bug-reports/BUG-020.md` (Verificado)
- **Evidencia BE:** `Agente backend/Agente backend/outputs/laborregamarket/fase-13/quality/EVIDENCIA-BUG-020.md`
- **Contrato citado:** `fase-13/api/API-INVENTORY-13.md` (200 ficha; 409 oferta oculta)
- **ADR vivo:** `comun/adrs/ADR-038-archivo-oferta-unidad.md`

## 1. Declaración explícita

**No hubo cambios de contrato, ADR ni esquema de datos por bugs de F13.**

BUG-020 (único, Verificado) fue un **fallo de implementación**: `POST /api/provider/inventory/[providerProductId]/entries` usaba `inventoryEntrySchema.parse` **sin importar** el símbolo. Eso producía 500 antes de validar y antes del 409 de oferta oculta. `API-INVENTORY-13` ya exigía 200 (visible) y 409 (archivada). Tras el import, QA re-probó y ambos códigos se cumplen.

| Bug | Capa | ¿Contrato / ADR / schema? |
|-----|------|---------------------------|
| BUG-020 (500 POST entries) | Ruta Next: import faltante de Zod | **No.** Paths, payloads, 200/409 y `InventoryEntry` sin cambio. |

**Sin ADR nuevo.** ADR-038 **no** se enmienda (un import no altera archivo vs delete ni `saleUnit`). SAD `comun/sad.md` v0.13.0 **no** se edita. No hay delta de columnas ni de unique `provider_products`.

## 2. Contratos vigentes (sin delta post-QA)

| Artefacto | Acción |
|-----------|--------|
| `API-INVENTORY-13` | Intactos: persistir entrada; 409 `{ error: "Oferta oculta" }` sobre archivada |
| `API-ADMIN-PRODUCTS-13` | Intactos |
| `API-PROVIDER-ARCHIVE-13` | Intactos |
| `API-PROVIDER-OFFER-13` | Intactos |
| `API-PROVIDER-PRICE-13` | Intactos |
| `API-SELLABLE-13` | Intactos |
| `API-PROVIDER-REPORTS-INV-13` | Intactos |
| `DB-provider-products` / `DB-inventory-entries` / `DB-provider-product-price-history` | Sin columnas ni índices nuevos post-QA |
| ADR-038 | **Sin nota de reemplazo.** Archivo + unidad de oferta confirmados en QA. |

## 3. Nota ADR

| ADR | Acción |
|-----|--------|
| ADR-038 | **Sin ADR nuevo; contrato intacto.** Un `ReferenceError` de import no cambia `archivedAt`, `saleUnit` ni unique. |
| ADR-022 / ADR-036 / ADR-037 | Intactos (solo lectura). |

## 4. Qué no se tocó

- `fase-13/api/*`, `fase-13/data-model/*`, `comun/adrs/ADR-038*`, SAD.
- Código de la app (fuera de alcance Arquitecto; el fix es de Backend).
- Promoción de fase. Activación DevOps.
- `fase-12/` solo lectura.

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-13/quality/QG-correcciones.md`
- **Agente Downstream:** Product Manager (puede cerrar/promover cuando exista también QG UX)
- **ADR/SAD:** no actualizados
