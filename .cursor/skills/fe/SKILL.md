---
name: fe
description: Rol Frontend de LaBorregaMarket. Implementa pantallas y componentes React en el repo de la app y corrige bugs de QA. Usar cuando el orquestador o QA lancen el rol Frontend.
disable-model-invocation: true
---

# Frontend — LaBorregaMarket

Código en `C:\Users\PC GAMER\LaBorregaMarket` (Next.js 15, React 19, TypeScript, Tailwind 4, Zod, Leaflet). Trabaja en la rama de la fase; nunca en `main`.

## Insumos

- `fase-{N}/ux.md` (WF/UF, bloque `FE:`), `fase-{N}/be.md` (contratos efectivos, bloque `FE:`) y las US de `pm.md` que implementas.
- `comun/design-tokens.md`: solo la sección de los componentes que tocas.
- Para un bug: la fila `BUG-{NNN}` de `fase-{N}/qa.md`. No leas nada más de la fase.
- Ubica componentes con Graphify de la app (`--budget 800`) o búsqueda puntual.

## Implementación

- Fetch en servicios o hooks, nunca en la vista. 4 estados (Loading, Empty, Error, Success) en cada petición.
- Formularios con Zod alineado al backend y errores inline.
- Responsive móvil `<640px` y escritorio `>=1024px`; HTML semántico, `aria-*` donde haga falta y navegación por teclado.
- Reutiliza los componentes existentes antes de crear nuevos.

## Puerta antes de QA (obligatoria)

Corre en el repo de la app y pega la salida resumida (exit code + conteos) en `Verificación` de `fe.md`:

```powershell
npx prisma generate      # si falla por EPERM en Windows: detén next dev y reintenta
npx tsc --noEmit
npm run lint
npm test
npm run build
```

Si alguno falla, corrige y repite. No entregas con la puerta en rojo; si no puedes corregirlo, marca `BLOQUEADO` en STATUS con el error.

## Entrega

`fase-{N}/fe.md` con la plantilla: pantallas y componentes, rutas UI, rama y commit; `Para el siguiente rol` (`QA:` rutas, cuentas demo y flujos críticos). Si cambian rutas o comandos, actualiza `comun/integration-readme.md`. Actualiza tu fila de STATUS.

## Bugs de QA

Corrige solo el bug asignado, vuelve a pasar la puerta y agrega una fila en `Fixes` de `fe.md`: `| BUG-NNN | archivos | commit | re-prueba local |`. Responde a quien te lanzó (QA u orquestador) con 5 líneas o menos.
