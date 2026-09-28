# INFRA-APP — Handoff F14

> **Proyecto:** laborregamarket  
> **Componente:** APP (monolito Next.js + Prisma)  
> **Entorno:** PR contra `main` (no producción)  
> **Fecha:** 2026-09-18  
> **Generado por:** Agente DevOps / Cloud Engineer Senior

| Campo | Valor |
|-------|--------|
| **Emisor** | DevOps |
| **Receptor** | Humano (merge; `migrate deploy`; no prod) |
| **PR** | https://github.com/dantelokito/BorregaMarket/pull/14 |
| **Rama** | `feat/f14-panel-proveedor` |
| **SHA** | `ca48135` |

## 1. Resumen

Sin Terraform, K8s ni Dockerfile nuevos en F14. CI existente (lint + Vitest + `next build`). Cloudinary no Must. Volumen `UPLOADS_DIR` en staging/prod sigue pendiente (deuda previa). Producción **no** declarada.

Post-merge: `npx prisma migrate deploy` (migración `20260918010000_f14_inventory_entry_kind`).

## 2. Pipeline CI/CD

| Etapa | Estado | Notas |
|-------|--------|-------|
| Lint & Unit Tests | ✅ Configurado | `.github/workflows/ci.yml` |
| Build | ✅ Configurado | `next build` |
| CodeQL / Analyze | ✅ Configurado | `.github/workflows/codeql.yml` |
| Deploy Production | ⏳ Humano | Prohibido desde este agente |

## 3. Observabilidad

Fuente de producto: `OBSERVABILITY.md` v0.14.0 en el repo de la app. Sin `/api/health` Must. Sin Prometheus nuevo.

## 4. Información para QA / humano

| Campo | Valor |
|-------|-------|
| URL local | `http://127.0.0.1:8080` |
| Comando post-merge | `npx prisma migrate deploy` |
| E2E | Playwright local (no en YAML CI) |

## 5. Definition of Done — DevOps (este PR)

- [x] PR abierto, descripción lista, sin merge a `main` ni producción
- [x] Documentación de producto alineada a **0.14.0**
- [x] Pipeline seguro existente (lint, tests, build, CodeQL)
- [x] Checks verdes (lint/test/build, Analyze, CodeQL)
