# Handoff QA → Product Manager — LaBorregaMarket F10

> **Nota 12/09:** F10 **cerrada** con **APROBADO CON CONDICIONES**. El CO 20 MiB queda en [DT-F10-002](./deuda-tecnica/DT-F10-002-media-20mib-fe-bodysize.md) (backlog). Merge GitHub = DevOps. No abrir F11 desde QA.

> **De:** QA Tester Senior  
> **Para:** @Product Manager  
> **Proyecto:** LaBorregaMarket v0.10.2  
> **Fecha:** 31/08/2026  
> **Fase QA activa:** 10

---

## Pedido

Registrar **change-order** del NFR de tamaño de imagen: **5 MB → 20 MiB** (`20_971_520` bytes). Stakeholder: instalación **local**, fotos de gran calidad. Superficies: **logo (perfil)**, **portada**, **producto** (SKU local y catálogo admin GLOBAL).

QA ya abrió [BUG-016](./bug-reports/BUG-016.md) (Major P2) con handoffs [Frontend](./QA-F10-handoff-frontend.md) y [Backend](./QA-F10-handoff-backend.md). El **código no espera** este CO: el stakeholder autorizó el cambio en sesión QA.

Prompt: [`activation-prompt-pm-BUG-016.txt`](./activation-prompt-pm-BUG-016.txt)

---

## Por qué PM

`US-MEDIA-03`, `API-MEDIA-02`, `ADR-006` / `ADR-032` y copy UX F10 siguen diciendo **5 MB**. El sistema **cumple** ese AC. Sin CO, el fix 20 MiB contradice el contrato escrito.

## Qué actualizar (en outputs PM / Arquitecto / UX, no en QA)

| Artefacto | Cambio |
|-----------|--------|
| `US-MEDIA-03` (y US-MEDIA-01/06 ACs de tamaño) | ≤ 5MB → ≤ 20MB (20 MiB) |
| `API-MEDIA-02` / `API-MEDIA-01` | Max size `20_971_520` |
| Copy UX / tokens | `máx 20MB`; error `El archivo supera el límite de 20MB` |
| CO nuevo (p. ej. `CO-F10-003`) | Alcance local; MIME intacto; rate limit intacto |

MIME JPEG/PNG/WebP y disco `UPLOADS_DIR` **no cambian**. Cloudinary/S3 sigue fuera de Must.

---

## Relación con F10 QA

| Ticket | Rol PM |
|--------|--------|
| [BUG-015](./bug-reports/BUG-015.md) Blocker Encargar | Ninguno (Frontend) |
| [BUG-016](./bug-reports/BUG-016.md) Major 20 MiB | CO documental |

Sign-off F10 **APROBADO CON CONDICIONES** (12/09). BUG-015 **Diferido** (DT-F10-001). BUG-016 resto **Diferido** (DT-F10-002); no es Blocker de merge.

## Fuera

- Implementar código (FE/BE)
- Reabrir F8/F9, `US-ADMIN-04`

## DoD PM

1. CO emitido (5 MB → 20 MiB, tres superficies)
2. US / aviso a Arquitecto y UX para alinear contratos y copy
3. No bloquear a FE/BE
