# Handoff QA → UX UI — cabos copy MEDIA 20 MiB

> **De:** QA Tester Senior  
> **Para:** @UX UI  
> **Fecha:** 12/09/2026  
> **Fase:** 10 **cerrada** — sign-off **APROBADO CON CONDICIONES**; copy 20 MB = [DT-F10-002](./deuda-tecnica/DT-F10-002-media-20mib-fe-bodysize.md); no F11

Backend ya persiste JPEG ≤ 20 MiB en disco (`TC-MED-008` Pass). La UI **sigue pintando 5 MB**. PM debe confirmar el CO; UX actualiza tokens/wireframes/handoff FE para que el copy no mienta.

## Qué revisar (no implementar React)

- `design-tokens.md` — Accept max 5MB → 20MB
- `WF-proveedor-media` / `WF-proveedor-catalogo-f10` / `WF-admin-catalogos` — hints 5MB
- `UF-MEDIA-01` / `UF-CAT-02` / `UF-ADMIN-02` — error «límite de 5MB»
- `handoff-frontend-fase-10.md` — MEDIA-03 tamaño

Producto aún con 5MB: `ProveedorPageClient.tsx`, `ProductImageDropzone.tsx`, `AdminProductForm.tsx`, `MediaUpload.tsx`. Eso lo cierra Frontend (`BUG-016`); UX deja el contrato visual listo.

No tocar Explorar F9, Cloudinary Must, `US-ADMIN-04`.

Detalle: [`QA-F10-retorno-pm-ux-arch.md`](./QA-F10-retorno-pm-ux-arch.md)
