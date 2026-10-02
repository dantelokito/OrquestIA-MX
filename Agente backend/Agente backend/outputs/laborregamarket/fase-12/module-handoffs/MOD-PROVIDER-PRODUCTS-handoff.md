# Handoff de Módulo: MOD-PROVIDER-PRODUCTS (delta F12)

> **Proyecto:** laborregamarket  
> **Módulo:** PROVIDER-PRODUCTS + PREFS  
> **Stack:** Next.js + Prisma  
> **Fecha:** 2026-09-14  
> **Contrato de referencia:** `API-PROVIDER-PRODUCTS-12`, `API-PROVIDER-PREFS-12`, `DB-providers`

## Inputs Utilizados

- Contratos F12 panel CAT, público y `posShowImages`

## 1. Endpoints

| Método | Ruta | Auth | Delta |
|--------|------|------|-------|
| GET | `/api/provider/products` | PROVIDER | Barra + `imageUrl` disco en filas con instancia |
| GET | `/api/providers` y `/api/providers/[id]` | Pública | Sin claves de existencias |
| GET/PATCH | `/api/provider/me` | PROVIDER | `posShowImages` default true; PATCH sucursal B en body → 403 |

## 2. JSON real vs contrato

**Desviación documentada:** `GET /api/provider/products` conserva el envelope F10 `{ data: { provider, catalog: [...] } }`. Las claves de barra (`onHand`, `reserved`, `capacityMax`, `fillPercent`, `alertThresholdPercent`, `alertEnabled`, `lowStockAlert`) se añaden **solo** si existe `ProviderProduct`. El ejemplo del contrato muestra un ítem plano; el FE debe leer `data.catalog[]`. Productos globales sin instancia siguen con `price: null` y **sin** campos de inventario.

Público: el mapper de `getProviderDetail` / listing no serializa `onHand`, `capacityMax`, `fillPercent`, umbral, alerta, `reserved` ni `boxContentFactor`. `imageUrl` de vitrina sí puede existir.

`GET /api/provider/me` incluye el objeto F5 vigente **más** `posShowImages` (boolean, default true).

## 3. Pruebas

- ISO PATCH `posShowImages` + `providerId` de Tecnológico con cookie Centro → 403
- `assertNoPublicInventoryKeys` en detalle público
- Suite `npm test` 352 passed

## 6. DoD Backend

- [x] Miniatura CAT no depende de `posShowImages`
- [x] Público silencioso
- [x] 403 IDOR prefs
- [x] Tests pasando

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-12/module-handoffs/MOD-PROVIDER-PRODUCTS-handoff.md`
- **Agente Downstream:** Frontend, QA
