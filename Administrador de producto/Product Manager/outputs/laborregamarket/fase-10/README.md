# Fase 10 — Admin seguro + catálogo proveedor (PM)

**Estado:** **cerrada documentalmente** 12/09/2026 (v0.10.2). Sign-off QA **APROBADO CON CONDICIONES**. Merge a `main`. **Solo lectura.** No reabrir US ni change orders.

Fase activa del producto: **11** — [`../fase-11/`](../fase-11/README.md).

## Cierre

| Ítem | Estado |
|------|--------|
| Discovery (`CO-F10-001` … `003`) | Cerrado 28/08 |
| Implementación Must | Entregada (SEC, ADMIN, CAT local, media disco, DASH) |
| QA | `QA Automation Engineer/.../fase-10/qa-signoffs/QA-F10-signoff.md` APROBADO CON CONDICIONES (12/09) |
| Excepción proceso | Sin `QG-correcciones.md` UX/Arch; Dante + QA + merge cierran igual |
| Deuda | DT-F10-001 / DT-F10-002 → `BL-182` / `BL-183` (no Must F11) |

## Alcance (histórico)

| US | Tema | MoSCoW |
|----|------|--------|
| `US-SEC-01` | RBAC por módulo en catalogs y admin APIs | M |
| `US-SEC-02` | AUDIT + último ADMIN + ownership catálogo proveedor | M |
| `US-SEC-03` | Higiene demo/prod + 401/403 en rutas nuevas | M |
| `US-ADMIN-02` | CRUD catálogo **global** (comparables) | M |
| `US-ADMIN-03` | Proveedores: verificar/activar + flags F5–F9 | M |
| `US-CAT-02` | PROVIDER agrega/edita producto **local** | M |
| `US-CAT-03` | Secciones dinámicas del catálogo del negocio | M |
| `US-MEDIA-06` | Logo, portada y fotos de producto en **disco local** | M |
| `US-DASH-07` | Venta por producto + checkboxes (vacío = todos) | M |
| `US-DASH-08` | Rango inicio–fin + atajo un mes | M |
| `US-DASH-09` | Imprimir la vista filtrada | M |
| `US-ADMIN-04` | Promover local → global | S |

**Change orders:** [`CO-F10-001`](./change-orders/CO-F10-001-admin-catalogo-local.md) (A5), [`CO-F10-002`](./change-orders/CO-F10-002-media-disco-local.md) (sin cloud), [`CO-F10-003`](./change-orders/CO-F10-003-dashboard-reportes.md) (DASH).

| Artefacto | Ruta |
|-----------|------|
| PRD | [prd.md](./prd.md) |
| Historias | [user-stories/](./user-stories/) |
| Change orders | [change-orders/](./change-orders/) |
| Handoff UX | [handoff-ux-ui.md](./handoff-ux-ui.md) |
| Handoff Arquitecto | [handoff-arquitecto.md](./handoff-arquitecto.md) |

## Qué no hacer aquí

- No editar esta carpeta. No reabrir sign-off QA F8/F10 ni US F7/F8/F9/F10.
- No auto-global; no Cloudinary/S3; no `BL-040`; no editar `fase-6/`.
