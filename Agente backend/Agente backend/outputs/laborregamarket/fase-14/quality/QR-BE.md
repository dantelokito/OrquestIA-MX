# Quality Report Backend — Fase 14

> **Fecha:** 17/09/2026  
> **Proyecto:** laborregamarket  
> **Agente:** Backend Developer

## Inputs Utilizados

- Handoff Arquitecto `fase-14/handoff-backend-fase-14.md`
- Contratos API-PROVIDER-SETTINGS-14, API-PROVIDER-PROFILE-14, API-PROVIDER-OFFER-14, API-PROVIDER-SECTIONS-14, API-INVENTORY-14, API-PROVIDER-REPORTS-14
- DB-inventory-entries, DB-providers
- ADR-039, ADR-040, ADR-041

## Checklist recepción 00–01

- [x] Contratos con método, path, auth, body, 200/201, 4xx/5xx, envelope
- [x] PATCH me no muta `isVerified`
- [x] Geo AMM 400
- [x] Merma/ajuste 400 si saldo resultante negativo
- [x] Cero instrumentación POS/`DELIVERED`
- [x] N=1 global 403 `GLOBAL_REPORTS_NOT_AVAILABLE`
- [x] Precio > 0 al publicar; prohibido default 50
- [x] Tests 100% del módulo en verde
- [x] No se escribió en `fase-13/`

Sin `API-INCOMPLETOS.md` / retorno al Arquitecto.

## Alcance Must cerrado

| Ítem | Evidencia |
|------|-----------|
| Prisma `InventoryEntry.kind` + `reason` + `note` + `onHandAfter`; `receiveAs` nullable | `schema.prisma` + `20260918010000_f14_inventory_entry_kind` |
| PATCH me datos negocio + geo AMM; jamás `isVerified` | `provider-settings.ts`, `updateProviderSettings` |
| Precio > 0 al `isAvailable=true` | `assertPublishablePrice` en offer/local/product |
| DELETE sección 409 usable | route DELETE ya alineada; test body |
| POST shrinkage / adjustments + transacción | `addShrinkage`, `addAdjustment` |
| GET movements paginado ENTRADA+MERMA+AJUSTE | `listInventoryMovements` |
| POST entries `kind=ENTRADA` + `onHandAfter` | `addInventoryEntry` |
| Reportes inventario filtran `kind=ENTRADA` | `inventory-report.service.ts` |
| PDF `parseReportsRequest` from/to XOR grain | `reports.pdf/route.ts` |

## Won't / excepciones (documentadas, no bloquean)

- Kardex POS/`DELIVERED` y `decrementOnHandForLines` **no** se tocaron (ADR-022: venta sí puede dejar `onHand` negativo).
- `SELECT FOR UPDATE` = Should BL-243.
- Admin PATCH datos de negocio = Should D-F14-18.
- Cloudinary / BL-040 / charts npm = Won't.
- `npx prisma generate` puede fallar EPERM si el engine DLL está bloqueado (mismo síntoma F12/F13). Los tipos F14 sí quedaron en `node_modules/.prisma/client`.
- Suciedad local NO F14 (`.gitignore`, `PriceInput.tsx`, `.cursor/`, `scripts/`) **no** viajó en el commit.

## Tests

```
cd C:\Users\PC GAMER\LaBorregaMarket
npx vitest run
```

Resultado: **401 passed**, 86 files, 17/09/2026.

Casos Must: geo 400, `isVerified` intacto, merma 400, ajuste 400, IDOR 403, N=1 403 global, PDF rango, Google lock, precio 0 no publica, DELETE sección 409.

## Rama

`feat/f14-panel-proveedor` desde `origin/main` @ `0eda84c`. Sin push/merge a `main`.

## Outputs Generados

- `fase-14/quality/QR-BE.md`
- `fase-14/module-handoffs/MOD-PROVIDER-SETTINGS-F14-handoff.md`
- `fase-14/module-handoffs/MOD-INVENTORY-F14-handoff.md`
- `fase-14/module-handoffs/MOD-OFFER-SECTIONS-F14-handoff.md`
- `fase-14/module-handoffs/MOD-REPORTS-F14-handoff.md`
- `fase-14/handoff-frontend.md`
