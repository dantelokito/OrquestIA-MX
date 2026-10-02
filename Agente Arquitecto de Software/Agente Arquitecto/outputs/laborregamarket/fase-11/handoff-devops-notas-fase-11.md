# Notas Arquitecto → DevOps — Fase 11

> **Fecha:** 12/09/2026  
> **Sin Cloudinary Must.** Media sigue disco F10 (`UPLOADS_DIR` + volumen).

## Cookies

Dos cookies first-party (misma origin):

| Nombre | Contenido |
|--------|-----------|
| Cookie JWT vigente | `sub` + `role` (ADR-025) |
| `lbm_active_provider` | cuid de sucursal (ADR-034) |

Flags idénticos: HttpOnly, Path `/`, SameSite=Lax, Secure solo HTTPS/`NODE_ENV=production`. Sin `Domain` salvo subdominio ya documentado.

No env nueva Must. No Redis extra. No CI YAML F6.

Tras deploy: migración `drop_provider_userid_unique` **antes** de seed N=2.

## Outputs Generados

- **Archivo:** `fase-11/handoff-devops-notas-fase-11.md`
