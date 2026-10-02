# ARCH-MEDIA-02 — Upload a disco y serving

> **Componente / Flujo:** Validación MIME, persistencia `UPLOADS_DIR`, GET público opaco  
> **Fecha:** 28/08/2026  
> **Fase:** 10 — v0.10.2  
> **ADR:** ADR-032 (ADR-006 aparcado)

---

## Upload PROVIDER (logo / portada / ítem)

```mermaid
sequenceDiagram
  participant UI as Dropzone
  participant API as POST_media
  participant Val as mimeMagic_size
  participant Disk as UPLOADS_DIR
  participant DB as PostgreSQL

  UI->>API: multipart file cookie JWT
  API->>API: requireRole plus ownership
  API->>Val: magic bytes JPEG PNG WebP max 5MB
  alt invalido
    Val-->>UI: 400 URL previa intacta
  else ok
    API->>Disk: write cuid.ext
    API->>DB: persist slash api slash media slash cuid.ext
    API->>Disk: unlink archivo anterior si era local
    API->>DB: AuditLog MEDIA_UPLOAD
    API-->>UI: 200 url
  end
```

---

## Lectura pública

```mermaid
flowchart LR
  Card[Explorar_o_fruteria]
  Card --> Url[logoUrl_o_imageUrl]
  Url --> Handler[GET_api_media_opaque]
  Handler --> Sanitize[solo_cuid_dot_ext]
  Sanitize --> File[UPLOADS_DIR]
  File --> Headers[nosniff_image_mime]
```

Resolución de foto de producto: `ProviderProduct.imageUrl ?? Product.imageUrl`.

---

## Runtime

```mermaid
flowchart TD
  Next[Next_js_API]
  Next --> Vol[volumen_persistente]
  Vol --> Dir[UPLOADS_DIR]
  Next -.-> Vercel[Vercel_ephemeral]
  Vercel --> Incompat[incompatible_F10]
```

---

## Qué no entra

- SDK Cloudinary / S3.
- Path traversal.
- Ejecutables.

---

## Referencias

- [`../api/API-MEDIA-02.md`](../api/API-MEDIA-02.md)
- [`../../comun/adrs/ADR-032-disk-image-storage.md`](../../comun/adrs/ADR-032-disk-image-storage.md)
