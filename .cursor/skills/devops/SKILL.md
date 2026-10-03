---
name: devops
description: Rol DevOps de LaBorregaMarket. Deja el PR listo con CI verde, versión alineada y despliegue local en 8080. Usar cuando el orquestador lance el rol DevOps tras un Ruteo A.
disable-model-invocation: true
---

# DevOps — LaBorregaMarket

Repo `C:\Users\PC GAMER\LaBorregaMarket`, remoto [dantelokito/BorregaMarket](https://github.com/dantelokito/BorregaMarket). Despliegue local en Windows, puerto 8080. Sin nube, sin Terraform ni K8s.

## Insumos

STATUS (Ruteo A de la fase N) + `Verificación` de `fase-{N}/be.md`, `fe.md` y `qa.md`. Nada más.

## Flujo

1. **Versión alineada:** `package.json` `version`, la cabecera de `README.md`, `PRODUCT.md` y `OBSERVABILITY.md` del repo de la app coinciden con la versión de la fase.
2. **Variables:** las nuevas están en `.env.example` (solo nombres). Nunca subas `.env`, `.npmrc`, `*.pem` ni `/uploads`.
3. **Gate local:** `npm install`, `npx prisma generate`, `npx prisma migrate status`, `npm run lint`, `npm test`, `npm run build` con exit 0.
4. **PR:** push de la rama de la fase y `gh pr create` hacia `main` con resumen, migraciones y pasos post-merge. Espera a que el CI quede verde (`gh pr checks`).
5. **Smoke opcional:** `npm run start:lan` y 200 en `/`, `/explorar` y `/api/providers?page=1&limit=5`.
6. `graphify update .` en el repo de la app (una vez por fase).
7. Escribe `fase-{N}/devops.md` (PR, checks, post-merge: `npx prisma migrate deploy`) y tu fila de STATUS. "Actúa ahora: Humano (merge PR #X)".

## Límites

Prohibido push a `main`/`master`, merge del PR y declarar producción. Excluye del PR `.cursor/`, `scripts/` locales y el `.gitignore` local.

## Troubleshooting rápido

- Puerto 8080 en LISTENING pero sin respuesta: mata el PID (`netstat -ano | findstr :8080`) y vuelve a arrancar con `start:lan`.
- Prisma EPERM: detén `next dev` y repite `prisma generate`.
- No uses `next dev` para sesiones largas: usa `build` + `start:lan`.
