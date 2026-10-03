# Change Order — Registro de Solicitud de Cambio

> **ID:** CO-F10-002
> **Fecha:** 26/08/2026
> **Proyecto:** LaBorregaMarket
> **Solicitante:** Dante (stakeholder)

#### 1. Descripción del Cambio

Las imágenes de **logo (perfil)**, **portada** del proveedor y **cada producto** que oferta (SKU local y, si aplica, foto del ítem en su catálogo) se guardan en **almacenamiento local del servidor** (disco / carpeta de uploads). **No** se implementa Cloudinary, S3 ni CDN en F10.

Validez de archivo sigue `US-MEDIA-03` (JPEG/PNG/WebP, máx 5MB). `US-MEDIA-01` / `US-MEDIA-02` (F2) se **cumplen por disco**, no por cloud (ADR-006 **aparcado** hasta nuevo aviso).

Historia: [`../user-stories/US-MEDIA-06-almacenamiento-disco.md`](../user-stories/US-MEDIA-06-almacenamiento-disco.md). Decisión **D-F10-8**.

#### 2. Evaluación de Impacto

- [x] Arquitectura
- [x] Diseño UI/UX
- [x] Base de datos

**Detalle del impacto:**

- **Arquitectura:** ADR de disco (path, URL pública o `/uploads/…`, reemplazo/borrado de archivo viejo, MIME real no solo extensión, path traversal). Sin SDK Cloudinary. Tests de upload + 401/403 + IDOR (no leer/escribir archivos de otro provider).
- **Diseño UI/UX:** mismos dropzones; preview por URL local; empty = placeholder F2. Copy no menciona “nube”.
- **Base de datos:** `logoUrl` / `coverUrl` / `imageUrl` pueden ser paths relativos o URLs del mismo origin. Sin tabla cloud ids Must.
- **QA:** no llamadas a APIs de cloud; archivo aparece en explorar/detalle/panel.

#### 3. Matriz de Intercambio (Trade-off)

* **Opción A:** Seguir ADR-006 (Cloudinary) para logo, portada y productos.
* **Opción B:** Disco local ahora; cloud **Won't F10** (reabrir cuando Dante pida).

#### 4. Decisión

**Opción seleccionada:** B  
**Aprobado por:** Dante  
**Fecha de aprobación:** 26/08/2026

**Efecto en decisiones previas:** ADR-006 / Cloudinary **no** son Must F10. Validación `US-MEDIA-03` **intacta**. `CO-F10-001` (A5, secciones, SEC) **intacto**.
