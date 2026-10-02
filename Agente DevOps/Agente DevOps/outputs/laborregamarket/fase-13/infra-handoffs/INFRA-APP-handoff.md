# INFRA-APP — Handoff F13

| Campo | Valor |
|-------|--------|
| **Fecha** | 2026-09-17 |
| **Emisor** | DevOps |
| **Receptor** | Humano (`migrate deploy`; no prod) |
| **PR** | https://github.com/dantelokito/BorregaMarket/pull/13 |
| **Rama release** | `feat/f13-archivo-oferta-unidad` |
| **Rama seguimiento** | `fase-13` |
| **Merge** | `0eda84c` en `main` |
| **Feature SHA** | `48544e5` |

Post-merge: `npx prisma migrate deploy` (migración `20260916180000_f13_archivo_oferta_unidad`). Sin Terraform/K8s nuevos en F13. Sin Cloudinary Must. Volumen `UPLOADS_DIR` en staging/prod sigue pendiente (deuda previa). Producción **no** declarada.
