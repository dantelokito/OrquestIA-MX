# Handoff QA → Arquitecto — cabos API MEDIA 20 MiB

> **De:** QA Tester Senior  
> **Para:** @Arquitecto de Software  
> **Fecha:** 12/09/2026  
> **Fase:** 10 **cerrada** — sign-off **APROBADO CON CONDICIONES**; bodySizeLimit / contratos 20 MiB = [DT-F10-002](./deuda-tecnica/DT-F10-002-media-20mib-fe-bodysize.md); no F11

El service de disco ya valida `MAX_IMAGE_BYTES = 20_971_520`. Los contratos F2/F10 siguen en **5 MB**. Además, un POST de **20 MiB+1** responde **500** (no 400): Next recorta el body antes de `MediaValidationError`.

## Qué alinear (docs / ADR, no código de producto salvo que PM lo pida vía BE)

| Artefacto | Hueco |
|-----------|--------|
| `API-MEDIA-02` / `API-MEDIA-01` | Max size 5_242_880 vs código 20_971_520 |
| `ADR-032` / `ADR-006` | NFR 5 MB |
| Next App Router | Documentar `experimental.serverActions.bodySizeLimit: "21mb"` (o equivalente) para que el 400 del service sea alcanzable |
| `src/lib/storage/cloudinary.ts` | Tope 5 MB residual; path disco no lo importa — deprecar o alinear |

MIME magic bytes y `GET /api/media/[filename]` **intactos**. Rate 20/10 min **intacto**.

Evidencia QA: `TC-MED-008` Pass; `TC-MED-009` Fail (500).

Detalle: [`QA-F10-retorno-pm-ux-arch.md`](./QA-F10-retorno-pm-ux-arch.md)
