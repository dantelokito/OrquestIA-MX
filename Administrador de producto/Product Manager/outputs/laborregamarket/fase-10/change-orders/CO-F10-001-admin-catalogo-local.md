# Change Order — Registro de Solicitud de Cambio

> **ID:** CO-F10-001
> **Fecha:** 26/08/2026
> **Proyecto:** LaBorregaMarket
> **Solicitante:** Dante (stakeholder)

#### 1. Descripción del Cambio

Fase 10 abre **admin endurecido** y **catálogo del proveedor** como paquete único. No reabre F9 ni el sign-off F8.

| Cambio | US | Efecto |
|--------|-----|--------|
| RBAC por módulo en catalogs/admin | US-SEC-01 | Cierra OBS-004 (permiso no es siempre `USERS/view`) |
| AUDIT + último ADMIN + IDOR catálogo | US-SEC-02 | Toda escritura sensible queda en bitácora |
| Higiene demo/prod + 401/403 | US-SEC-03 | Cierra OBS-05 en UI prod; patrón DEV-P2-011 |
| CRUD catálogo global | US-ADMIN-02 | ADMIN cura SKUs comparables (A5 ya no es la única vía de alta) |
| Flags proveedores F5–F9 | US-ADMIN-03 | `isVerified`, `isActive`, mayoreo, domicilio |
| Producto **local** del PROVIDER | US-CAT-02 | Alta en `/proveedor`; no comparable |
| Secciones dinámicas | US-CAT-03 | Control «Nueva sección»; agrupa panel y `/fruteria/[id]` |
| Promover local → global | US-ADMIN-04 | Should |
| Imágenes en disco (logo, portada, productos) | US-MEDIA-06 | `CO-F10-002` — sin Cloudinary/S3 |

**Revoca A5 (F1):** “solo ADMIN agrega productos al sistema” deja de aplicar al catálogo **del negocio**. El catálogo **global** comparable sigue siendo de ADMIN.

Decisiones D-F10-1 … D-F10-8 en [`../prd.md`](../prd.md).

#### 2. Evaluación de Impacto

- [x] Arquitectura
- [x] Diseño UI/UX
- [x] Base de datos

**Detalle del impacto:**

- **Arquitectura:** schema dual (SKU global vs local); entidad de sección por `Provider`; RBAC `hasModulePermission` por catálogo; tests 401/403; rate limit de altas. Envelope ADR-003.
- **Diseño UI/UX:** `/proveedor` deja de ser solo toggle de globales: alta de producto + «Nueva sección». `/fruteria/[id]` agrupa por sección. `/admin` tab Catálogos pasa a CRUD; tab Proveedores muestra flags F5–F9. No rediseñar `/admin/analytics`.
- **Base de datos:** migración Must (sección + origen local). Forma exacta = Arquitecto. No hard-delete de `Product` global con ventas.
- **QA:** matrices SEC, ADMIN, CAT; `US-CAT-01` no regresiona; Explorar F9 chips intactos.

#### 3. Matriz de Intercambio (Trade-off)

* **Opción A:** Esperar cierre de código/QA F9 antes de documentar F10.
* **Opción B:** Activar F10 ahora (F9 docs solo lectura; código F9 puede seguir). Swap: no se construye CRUD usuarios, órdenes admin ni 2FA en esta fase.

#### 4. Decisión

**Opción seleccionada:** B  
**Aprobado por:** Dante (plan F10 26/08/2026)  
**Fecha de aprobación:** 26/08/2026

**Efecto en decisiones previas:** A5 (F1) **revocada** para el catálogo del PROVIDER. Catálogo global comparable **sigue**. `US-CAT-01`, `US-REV-04`, `US-BRAND-02`, `CO-F7-001`, `CO-F9-001` **intactos**. `BL-040` sigue aparcado. Media: ver `CO-F10-002` (disco, no cloud).
