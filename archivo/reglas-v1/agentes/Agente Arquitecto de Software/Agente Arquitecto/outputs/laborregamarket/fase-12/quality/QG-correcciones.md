# QG-correcciones — Arquitectura Fase 12

> **Proyecto:** laborregamarket  
> **Fase:** 12 — v0.12.0  
> **Fecha:** 15/09/2026  
> **Agente:** Arquitecto de Software  
> **Trigger:** QA APROBADO (`QA Automation Engineer/.../fase-12/qa-signoffs/QA-F12-signoff.md`)  
> **Dictamen:** Contratos API, modelo de datos y ADRs **intactos**. Sin enmienda estructural.

## Inputs Utilizados

- **Sign-off QA:** `QA Automation Engineer/Agente Tester/outputs/laborregamarket/fase-12/qa-signoffs/QA-F12-signoff.md` (API 16/16, E2E 5/5, dictamen APROBADO)
- **Evidencia BE:** `Agente backend/Agente backend/outputs/laborregamarket/fase-12/quality/EVIDENCIA-BUG-019.md`
- **Contratos F12:** `fase-12/api/API-INVENTORY-01.md`, `API-POS-12.md`, `API-ORDERS-12.md`, `API-PROVIDER-PRODUCTS-12.md`, `API-PROVIDER-PREFS-12.md`
- **Datos F12:** `fase-12/data-model/DB-provider-products.md`, `DB-providers.md`, `DB-order-items.md`
- **ADRs vivos:** `comun/adrs/ADR-036-inventario-blando.md`, `comun/adrs/ADR-037-encargar-reserva.md`, `comun/adrs/ADR-022-catalog-inactive.md` (solo lectura), `comun/adrs/ADR-003-error-envelope.md`

## 1. Declaración explícita

**No hubo cambios de contrato, ADR ni esquema de datos por bugs de F12.**

BUG-019 (único, Verificado) fue un **500 de ambiente**: `npx prisma generate` falló con EPERM porque Next en el puerto 8080 tenía abierto `query_engine-windows.dll.node`. La migración `20260915010000_f12_inventario_blando` ya estaba aplicada. Tras parar Next, regenerar el client y reiniciar, GET inventory y PATCH `posShowImages` devolvieron 200 **sin parche de `src/`**.

| Bug | Capa | ¿Contrato / ADR / schema? |
|-----|------|---------------------------|
| BUG-019 (500 inventory / PATCH me) | Runtime Prisma generate (Windows DLL) | **No.** Rutas, payloads, Decimal, `isAvailable` y envelope sin cambio. |

No se crea ADR-038. SAD `comun/sad.md` v0.12.0 **no** se edita. ADR-036 y ADR-037 **no** se enmiendan. ADR-022 **intacto**.

## 2. Contratos vigentes (sin delta post-QA)

| Artefacto | Acción |
|-----------|--------|
| `API-INVENTORY-01` | Intactos path, 403 IDOR, Decimal string, reserved computed |
| `API-POS-12` | Intactos: nunca 4xx de stock; 409 solo ADR-022 |
| `API-ORDERS-12` | Intactos: reserva / commit DELIVERED / restore CANCELLED |
| `API-PROVIDER-PRODUCTS-12` | Intactos: barra + `imageUrl` disco en panel; público sin existencias |
| `API-PROVIDER-PREFS-12` | Intactos: `posShowImages` en `GET/PATCH /api/provider/me`, default true |
| `DB-provider-products` / `DB-providers` / `DB-order-items` | Sin columnas ni índices nuevos post-QA |

## 3. Notas informativas (no obligan ADR)

Confirmación de lo ya diseñado; **no** es un cambio post-QA:

1. Envelope de éxito/error sigue ADR-003: `{ data }` / `{ error }` **sin** flag `success`. Coherente con F12 implementado y con QA.
2. `GET /api/provider/products` del panel reutiliza el wrapper F10 `{ provider, catalog[] }`. Los campos de barra/miniatura de `API-PROVIDER-PRODUCTS-12` van **en cada ítem de catálogo**, no como envelope nuevo. No se reescribe el contrato F10 ni se abre ADR.

## 4. Nota operativa Windows (sin alterar ADR-036)

Antes de E2E o de `prisma generate` en Windows: **detener** el proceso Next que ocupa 8080 (DLL del query engine), ejecutar `npx prisma generate`, **luego** reiniciar el servidor. Un 500 en GET inventory o PATCH `posShowImages` con migración ya aplicada suele ser client desalineado, no un fallo de inventario blando.

No se documenta esto como NFR de producto ni como decisión de schema.

## 5. Nota ADR

| ADR | Acción |
|-----|--------|
| ADR-036 | **Sin nota de reemplazo.** Inventario blando Decimal y no-4xx de stock confirmados en QA. |
| ADR-037 | **Sin nota de reemplazo.** Reserved computed + commit/restore confirmados. |
| ADR-022 | **Intacto.** 409 solo producto no disponible. |

## 6. Qué no se tocó

- `fase-12/api/*`, `fase-12/data-model/*`, `comun/adrs/ADR-036*`, `ADR-037*`, SAD.
- Código de la app (fuera de alcance Arquitecto).
- Promoción de fase. Activación DevOps.
- Otras fases (`fase-11/` solo lectura).

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-12/quality/QG-correcciones.md`
- **Agente Downstream:** Product Manager (puede cerrar/promover cuando exista también QG UX)
- **ADR/SAD:** no actualizados
