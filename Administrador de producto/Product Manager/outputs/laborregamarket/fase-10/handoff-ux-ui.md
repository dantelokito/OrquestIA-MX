# Handoff UX/UI — Fase 10

> **De:** Product Manager  
> **Para:** @UX/UI Designer  
> **Fecha:** 28/08/2026 (v0.10.2 — paquete de activación)

Diseñar deltas de `/proveedor`, `/fruteria/[id]` y `/admin` (tabs Catálogos y Proveedores). Baseline: `WF-admin-panel` (F1/F2) + panel catálogo proveedor F1/F5. **No** rediseñar `/admin/analytics` (`US-ADMIN-01`). **No** copiar look slate de analytics al panel PROVIDER. Marca de plataforma en sesión ADMIN (`US-BRAND-02`).

`CO-F10-001` revoca A5: el proveedor **crea** productos locales y **secciones**. `CO-F10-002`: imágenes en **disco**, no cloud. `CO-F10-003`: Reportes con mes-atajo, rango e impresión. F9 solo lectura (FilterBar Explorar **sin** chips de secciones custom).

Chat **nuevo**, sin historial. Este handoff no incluye wireframes: los produce UX.

---

## Lectura mínima (en este orden)

1. [`prd.md`](./prd.md)
2. [`change-orders/CO-F10-001-admin-catalogo-local.md`](./change-orders/CO-F10-001-admin-catalogo-local.md), [`CO-F10-002`](./change-orders/CO-F10-002-media-disco-local.md), [`CO-F10-003`](./change-orders/CO-F10-003-dashboard-reportes.md)
3. Historias Must: `US-CAT-02`, `US-CAT-03`, `US-MEDIA-06`, `US-ADMIN-02`, `US-ADMIN-03`, `US-SEC-03`, `US-DASH-07` … `09`. Should: `US-ADMIN-04` (no bloquea).
4. Este archivo.

**Solo lectura (no rediseñar, no reescribir):** `fase-9/`, `fase-8/`, `fase-6/` (DASH F6 es baseline; F10 **extiende** Reportes). Código UI: `C:\Users\PC GAMER\LaBorregaMarket\src\`.

---

## Rutas / pantallas Must

| Ruta | Qué diseñar en F10 |
|------|--------------------|
| `/proveedor` | Alta producto local, secciones dinámicas, dropzones logo + portada + foto de producto (disco) |
| `/fruteria/[id]` | Listado agrupado por sección del negocio (globales activados + locales); hero de portada |
| `/admin` tab Catálogos | CRUD catálogo **global**; imagen a disco |
| `/admin` tab Proveedores | Flags `isVerified`, `isActive`, Mayoreo, A domicilio |
| `/proveedor` pestaña Reportes | Mes-atajo, rango inicio/fin, checkboxes de producto, tabla, Imprimir |

**Fuera de este handoff:** `/admin/analytics` (`US-ADMIN-01` intacta). `/explorar` FilterBar (F9 intacto, sin chips de sección).

---

## a11y y DoD del paquete (Must)

- CTA primarios (Agregar producto, Nueva sección, Imprimir, guardar flags) **≥44px**.
- Print: CSS `@media print`; sin header/SubNav; sí negocio, rango, TZ, productos o «Todos».
- Empty states: «Aún no hay secciones»; sin ventas en el corte; placeholder de imagen F2 si vacío.
- Error inline: MEDIA-03 (formato/5MB), precio, sección requerida, inicio ≤ fin.
- Mobile: tabla Proveedores scroll-x; Reportes usable sin copiar look slate de analytics.

---

## US-CAT-02 — Alta de producto local

Hoy: `/proveedor` activa SKUs globales (precio + `isAvailable`).

| Flujo | Notas |
|-------|-------|
| CTA | «Agregar producto» en el catálogo del negocio |
| Formulario | Nombre, precio, unidad, sección (de `US-CAT-03`), imagen (dropzone → disco `US-MEDIA-06`), toggle disponible |
| Éxito | Aparece en su sección; Encargar/POS del mismo negocio pueden venderlo |
| Error | Validación inline (MEDIA-03, precio, sección requerida) |

**DoD:** el PROVIDER ya no está limitado a activar el catálogo global. SKU no se ofrece a otras fruterías.

---

## US-CAT-03 — Secciones dinámicas

Hoy: agrupación implícita por `FRUTA` / `VERDURA` / `AGRICOLA` de plataforma.

| Flujo | Notas |
|-------|-------|
| Control | «Nueva sección» siempre visible (dinámico, N secciones) |
| CRUD | Crear, renombrar, reordenar; eliminar solo vacía (o flujo «mover productos» si lo diseñas) |
| Detalle | `/fruteria/[id]` lista productos **por sección** (globales activados + locales) |
| Should | Sugerir Frutas / Verduras / Agrícolas al primer uso; nombres custom libres |

**DoD:** una lista plana; ≥44px en CTA; empty «Aún no hay secciones». No anidar. No chips Explorar.

---

## US-ADMIN-02 — Tab Catálogos CRUD

Hoy: grid read-only + upload imagen (`US-MEDIA-02` cloud F2).

| Flujo | Notas |
|-------|-------|
| Alta / edición | Nombre, categoría de plataforma, unidad; imagen a **disco** (`US-MEDIA-06`) |
| Retiro | Inhabilitar, no papelera destructiva si hay ventas |

**DoD:** curación global usable; distinto visualmente del alta local del proveedor; sin copy de nube.

---

## US-MEDIA-06 — Logo, portada y fotos de producto (disco)

Hoy: F2 asume Cloudinary (ADR-006). F10 **no** usa cloud.

| Flujo | Notas |
|-------|-------|
| Perfil | Logo del negocio (dropzone panel `/proveedor`) |
| Portada | Cover en panel; hero `/fruteria/[id]` |
| Productos | Foto de cada ítem que oferta (local o global activado) + ADMIN en catálogo global |
| Preview | URL local / mismo origin; placeholder F2 si vacío |
| Error | MEDIA-03 inline (formato/5MB) |

**DoD:** cero mención de Cloudinary; preview inmediato; reemplazo visible.

---

## US-ADMIN-03 — Tab Proveedores flags

Hoy: verificado + badge email + Verificar/Revocar.

| Flujo | Notas |
|-------|-------|
| Flags | `isVerified`, `isActive`, Mayoreo, A domicilio (mismos conceptos F9) |
| Conservar | Badge «Sin email válido» |
| Side-effect | Copy si al revocar verificación se apaga Google Reviews |

**DoD:** la tabla refleja operación F5–F9; mobile scroll-x.

---

## US-SEC-03 (UI mínima)

Ocultar bloque de cuentas demo en producción. 403/401 reutilizan ErrorBanner.

---

## US-ADMIN-04 (Should)

Acción «Promover a catálogo global» (cola o detalle). No bloquear Must.

---

## US-DASH-07 / 08 / 09 — Reportes filtrables

Hoy: F3 Resumen (hoy+7d) + F6 Reportes grano día/mes/año (docs solo lectura). F10 **extiende** la pestaña Reportes.

| Flujo | Notas |
|-------|-------|
| Mes | Un selector MM/AAAA rellena inicio = día 1 y fin = último día (TZ Monterrey) |
| Rango | Date pickers **inicio** y **fin** (filtro real; editables tras el atajo) |
| Productos | Checkboxes; ninguno marcado = todos. Incluir locales y venta rápida |
| Tabla | Por SKU: unidades, GMV, split Encargar vs POS |
| Imprimir | Misma vista; sin header/SubNav; sí negocio, rango, TZ, productos o «Todos» |
| Empty | Sin ventas en el corte: mensaje amigable |

**DoD:** un mes a la vez; inicio ≤ fin; CTA Imprimir ≥44px; no copiar `/admin/analytics`; no primary de cobro. PDF del corte = Should.

---

## Entregables esperados (artefactos a devolver)

Nombres sugeridos; el diseño es tuyo. No inventes contratos API.

| Artefacto | Contenido |
|-----------|-----------|
| Delta proveedor | Alta local (`US-CAT-02`) + secciones (`US-CAT-03`) + logo/portada/foto disco (`US-MEDIA-06`) |
| Delta `/fruteria/[id]` | Listado **por sección** (globales activados + locales); hero portada |
| Delta `/admin` | Tab Catálogos CRUD (`US-ADMIN-02`) + tab Proveedores flags (`US-ADMIN-03`) + higiene demo (`US-SEC-03`) |
| Delta Reportes | Mes-atajo + rango + checkboxes + tabla + print (`US-DASH-07` … `09`) |
| `handoff-frontend-fase-10.md` | Tokens, empty/error, print CSS, DoD por US. **Obligatorio** antes de activar FE |
| Quality Gate | Cuando FE implemente (no bloquea este handoff inicial) |

Should (no bloquea Must): promover local → global (`US-ADMIN-04`); PDF del corte DASH.

**No diseñar:** analytics admin, reescribir WF F6 como si fuera fase-6, usuarios/roles UI, órdenes admin, 2FA, impersonation, FilterBar secciones, Maps JS, reopen F9, flujos de CDN/Cloudinary, CSV/email/CFDI, multi-mes.
