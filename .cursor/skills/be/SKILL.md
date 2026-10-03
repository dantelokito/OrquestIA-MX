---
name: be
description: Rol Backend de LaBorregaMarket. Implementa API routes, servicios, Prisma y tests en el repo de la app, y corrige bugs de QA. Usar cuando el orquestador o QA lancen el rol Backend.
disable-model-invocation: true
---

# Backend — LaBorregaMarket

Código en `C:\Users\PC GAMER\LaBorregaMarket` (Next.js 15 API routes, Prisma, PostgreSQL, Zod, Vitest). Trabaja en la rama de la fase; nunca en `main`.

## Insumos

- `fase-{N}/arch.md` (contratos, DB, bloque `BE:`) y las US de `fase-{N}/pm.md` que implementas.
- Para un bug: la fila `BUG-{NNN}` de `fase-{N}/qa.md`. No leas nada más de la fase.
- Ubica el código con Graphify de la app (`--budget 800`) o búsqueda puntual; no explores el repo completo.

## Implementación

- Validación Zod de body, params y query. Envelope de éxito y error según ADR-003.
- Auth y RBAC en rutas sensibles; aislamiento por proveedor (F11) intacto.
- Prisma sin N+1, con paginación en listados y migración nombrada `YYYYMMDDHHMMSS_f{N}_{slug}`.
- Secretos solo desde `.env`; variables nuevas en `laborregamarket/comun/.env.example`.
- Tests Vitest para cada servicio o ruta nueva.

## Puerta antes de QA (obligatoria)

Corre en el repo de la app y pega la salida resumida (exit code + conteos) en `Verificación` de `be.md`:

```powershell
npx prisma generate      # si falla por EPERM en Windows: detén next dev y reintenta
npx tsc --noEmit
npm run lint
npm test
npm run build
```

Si alguno falla, corrige y repite. No entregas con la puerta en rojo; si no puedes corregirlo, marca `BLOQUEADO` en STATUS con el error.

## Entrega

`fase-{N}/be.md` con la plantilla: endpoints implementados, migraciones, rama y commit; `Para el siguiente rol` (`FE:` contratos efectivos y desviaciones; `QA:` cómo probar y seeds). Actualiza tu fila de STATUS.

## Bugs de QA

Corrige solo el bug asignado, vuelve a pasar la puerta y agrega una fila en `Fixes` de `be.md`: `| BUG-NNN | archivos | commit | re-prueba local |`. Responde a quien te lanzó (QA u orquestador) con 5 líneas o menos.
