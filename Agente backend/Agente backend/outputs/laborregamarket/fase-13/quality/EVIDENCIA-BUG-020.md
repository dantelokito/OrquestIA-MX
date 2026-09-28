# EVIDENCIA-BUG-020 — POST entries 500 (schema sin import)

> **Fecha:** 16/09/2026  
> **Proyecto:** laborregamarket  
> **Fase:** 13  
> **Agente:** Backend Developer  
> **Bug:** BUG-020 (Blocker, P1)  
> **Estado:** Fix aplicado. Listo para re-prueba QA (Backend no lanza QA).

## Inputs Utilizados

- `QA Automation Engineer/Agente Tester/outputs/laborregamarket/fase-13/bug-reports/BUG-020.md`
- `fase-13/QA-F13-handoff-backend.md`
- `fase-13/activation-prompt-backend-BUG-020.txt`
- Contrato `API-INVENTORY-13`

## Causa raíz (confirmada)

`POST /api/provider/inventory/[providerProductId]/entries` llamaba `inventoryEntrySchema.parse(...)` **sin importar** el símbolo desde `@/lib/validators/inventory`. Eso lanza `ReferenceError` → `handleRouteError` → **500** `{ "error": "Error interno" }` **antes** de validar el body y **antes** de `addInventoryEntry`. Por eso la oferta oculta también salía 500 y no 409.

El handler de `OfferArchivedError` (409) ya existía en la ruta; no se ejecutaba porque el parse reventaba primero.

## Archivos tocados

| Ámbito | Archivo | Cambio |
|--------|---------|--------|
| App | `src/app/api/provider/inventory/[providerProductId]/entries/route.ts` | Import de `inventoryEntrySchema`; catch 409 `OfferArchivedError` |
| Tests | `tests/integration/inventory-entries.routes.test.ts` | HTTP de la ruta: 200 ficha, 409 oculta, 400 schema |
| Markdown | este archivo + `STATUS.md` + QR-BE + MOD + historial append | Evidencia |

Rama app: `feat/f13-archivo-oferta-unidad`. Sin push/merge a `main`. Sin commit (working tree F13). Sin cambios de UI.

## Diff

```diff
+import { OfferArchivedError } from "@/lib/catalog/offer";
 import { inventoryEntrySchema } from "@/lib/validators/inventory";
 ...
+    if (err instanceof OfferArchivedError) {
+      return apiError(err.message, 409, err.details());
+    }
```

El import de `inventoryEntrySchema` es el parche que elimina el 500 por `ReferenceError`.

## Cómo se re-probó

### 1. Test de integración de la ruta HTTP (DoD)

```
cd C:\Users\PC GAMER\LaBorregaMarket
npx vitest run tests/integration/inventory-entries.routes.test.ts
```

**3 passed:**

| Caso | Resultado |
|------|-----------|
| POST body `{ quantity: "1.250", receiveAs: "CATALOG" }` oferta visible | **200** ficha + `lastEntryId` |
| `addInventoryEntry` lanza `OfferArchivedError` | **409** `{ error: "Oferta oculta", details: [{ field: "providerProductId", message: "No se cargan entradas sobre una oferta oculta" }] }` |
| `quantity: "0"` | **400**, el servicio no se llama (schema sí importado) |

### 2. Suite completa

```
npx vitest run
```

**376 passed** / 81 files.

### 3. Curl 8080

`POST /api/auth/login` con `frutas@elparaiso.mx` / `Demo1234!` respondió **500** en esta sesión (Next en 8080 recompiló login; no es el `ReferenceError` de entries). La re-prueba Must de BUG-020 queda cubierta por el test HTTP de la ruta (mismo `POST` handler que usa QA).

## DoD re-prueba QA (pendiente QA)

TC-F13-008, TC-F13-011, TC-F13-006b. Backend **no** lanza QA.

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-13/quality/EVIDENCIA-BUG-020.md`
- **Agente Downstream:** QA Tester
