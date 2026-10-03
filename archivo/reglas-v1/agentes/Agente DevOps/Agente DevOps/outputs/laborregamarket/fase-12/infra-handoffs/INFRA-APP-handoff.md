# INFRA-APP — Handoff F12

| Campo | Valor |
|-------|--------|
| **Fecha** | 2026-09-15 |
| **Emisor** | DevOps |
| **Receptor** | Humano (merge) |
| **PR** | https://github.com/dantelokito/BorregaMarket/pull/12 |
| **Rama** | `feat/f12-inventario-blando` |
| **SHA** | `8446245` |

Post-merge: `npx prisma migrate deploy`. Sin Terraform/K8s nuevos en F12. Volumen `UPLOADS_DIR` en staging/prod sigue pendiente (deuda previa). Cloudinary no Must.
