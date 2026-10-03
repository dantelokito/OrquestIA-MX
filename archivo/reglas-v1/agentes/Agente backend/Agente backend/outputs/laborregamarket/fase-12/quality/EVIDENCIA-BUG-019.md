# EVIDENCIA-BUG-019 — Inventario y PATCH me 500 (Prisma generate)

> **Fecha:** 14/09/2026  
> **Proyecto:** laborregamarket  
> **Fase:** 12  
> **Agente:** Backend Developer  
> **Bug:** BUG-019 (Blocker)  
> **Estado:** Fix de ambiente aplicado. Listo para re-prueba QA (Backend no lanza QA).

## Inputs Utilizados

- `QA Automation Engineer/Agente Tester/outputs/laborregamarket/fase-12/bug-reports/BUG-019.md`
- `fase-12/QA-F12-handoff-backend.md`
- Contratos API-INVENTORY-01 y API-PROVIDER-PREFS-12

## Causa raíz

El **500 no era un bug de lógica** en `InventoryService` ni en PATCH `/api/provider/me`.

1. Migración `20260915010000_f12_inventario_blando` ya estaba aplicada.
2. El proceso Next (`npm run dev:lan` / `next dev -p 8080`) tenía abierto `query_engine-windows.dll.node`.
3. `npx prisma generate` fallaba con **EPERM** al renombrar el DLL.
4. El proceso en 8080 ejecutaba queries F12 (`onHand`, `posShowImages`) con un query engine desalineado → Prisma lanzaba y las rutas devolvían `{ "error": "Error interno" }`.
5. Validación Zod (400) y RBAC (401/403) no tocan esos campos en el SELECT/UPDATE, por eso TC-F12-010/013/015 pasaban.

Tras detener PIDs Next (`npm run dev:lan`, `next dev -p 8080`, `start-server.js`) y regenerar el client, GET inventory y PATCH `posShowImages` responden **200** sin cambios de código de producto.

## Archivos tocados

| Ámbito | Archivo | Cambio |
|--------|---------|--------|
| App `src/` | ninguno | No hubo parche de servicio/ruta |
| Prisma client | `node_modules/@prisma/client` (generado) | `npx prisma generate` OK (v6.19.3) |
| Markdown Backend | este archivo + `STATUS.md` + historial append | Evidencia y estado |

Rama app: `feat/f12-inventario-blando`. Sin commit nuevo (working tree F12 previo intacto). Sin push/merge a `main`.

## Diff / commit

No hay diff de `src/` atribuible a este bug. Diff F12 preexistente (inventario Must) no se modificó en esta sesión.

```
npx prisma generate
# ✔ Generated Prisma Client (v6.19.3) to .\node_modules\@prisma\client in 102ms
```

## Cómo se re-probó

### 1. Parar bloqueo DLL

Procesos detenidos: `npm run dev:lan` (PID 21960), `next dev -p 8080` (17548), `start-server.js` (21372). No se detuvo tsserver de Cursor.

### 2. Generate

```
cd C:\Users\PC GAMER\LaBorregaMarket
npx prisma generate
```

Resultado: **OK** (exit 0).

### 3. Tests unitarios e integración inventario

```
npm test -- tests/unit/inventory.service.test.ts tests/unit/inventory-metrics.test.ts tests/unit/inventory-convert.test.ts tests/unit/inventory-capacity.test.ts tests/integration/inventory.routes.test.ts
```

Resultado: **5 files, 21 tests passed**.

### 4. HTTP real (servidor reiniciado `npm run dev` en 8080)

Login `POST /api/auth/login` `frutas@elparaiso.mx` / `Demo1234!` → **200**.

| Request | Resultado |
|---------|-----------|
| `GET /api/provider/inventory` | **200** `data[]` con `onHand` string `"0.000"`, `reserved`, `capacityMax`, `meta` implícito en listado |
| `PATCH /api/provider/me` `{ "posShowImages": false }` | **200** envelope `data` |
| `PATCH /api/provider/me` `{ "posShowImages": true }` (restore) | **200** |

No se observó 500 en estas rutas Must tras generate + restart.

## DoD re-prueba QA (pendiente QA)

TC-F12-001…009, 011, 012, 014. Backend **no** lanza QA.

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-12/quality/EVIDENCIA-BUG-019.md`
- **Agente Downstream:** QA Tester
