# DT-F10-002 — Media 20 MiB: copy FE + bodySizeLimit (resto BUG-016)

> **ID:** DT-F10-002  
> **Tipo:** Deuda técnica / alineación NFR  
> **Origen:** [BUG-016](../bug-reports/BUG-016.md)  
> **Severidad residual:** Major solo si el usuario sube **6–20 MB por UI** o **>20 MiB por API**  
> **Fase:** 10 (cerrada documentalmente 12/09/2026)  
> **Estado:** Abierta — backlog post-v0.10.2  
> **Fecha:** 2026-09-12  
> **Código:** `C:\Users\PC GAMER\LaBorregaMarket`

---

## Qué ya está en v0.10.2 (aceptado)

Backend disco: `MAX_IMAGE_BYTES = 20_971_520` en `src/lib/storage/local-disk.ts`; mensaje service 20MB.  
Playwright **12/09:** `TC-MED-008` JPEG 6 MiB logo → **200**. Fotos de uso diario ≤5 MB y API 6 MiB **OK**.

## Qué queda (deuda)

| Hueco | Evidencia |
|-------|-----------|
| FE `MediaUpload` `MAX_BYTES = 5 * 1024 * 1024` | Un JPEG 6–20 MB no llega al API |
| Copy «máx 5MB» | `ProveedorPageClient`, `ProductImageDropzone`, `AdminProductForm` — `HP-MED-02` Fail |
| `next.config.ts` sin `bodySizeLimit` | `TC-MED-009` (20 MiB+1) → **500** en vez de 400 |
| Contratos US/API/UX | Siguen 5 MB (`US-MEDIA-03`, `API-MEDIA-02`) — CO PM pendiente |
| `cloudinary.ts` | Tope 5 MB residual (path disco no lo usa) |

## Fix futuro (no Must de merge)

1. FE: `MAX_BYTES = 20 * 1024 * 1024` + copy 20MB.  
2. BE: `experimental.serverActions.bodySizeLimit: "21mb"`; oversize → 400.  
3. PM/UX/Arch: CO y contratos 20 MiB.

Specs de cobertura (pueden fallar; no bloquean sign-off): `HP-MED-02`, `TC-MED-009`.

## Relación F10

BE disco **hecho**. Resto diferido. BUG-016 **Diferido**. No bloquea merge GitHub.

## Outputs

- **Archivo:** `outputs/laborregamarket/fase-10/deuda-tecnica/DT-F10-002-media-20mib-fe-bodysize.md`
- **Downstream:** FE + BE + PM/UX/Arch (fase posterior)
