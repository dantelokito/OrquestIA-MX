# Handoff Frontend Developer — LaBorregaMarket Fase 10 (v0.10.0)

> **De:** Agente UX/UI Designer  
> **Para:** @Frontend  
> **Fecha:** 28/08/2026  
> **Prioridad:** Admin + catálogo local + media disco + Reportes rango  
> **No implementar:** pasarela, CFDI, PWA, analytics redo, usuarios/roles UI, órdenes admin, 2FA, impersonation, Maps JS, Places, FilterBar secciones, Cloudinary/CDN, CSV/email, multi-mes, PDF del corte F10, wizard secciones iniciales, reopen F7/F8/F9, reescribir `fase-6/`

---

## Estado: LISTO PARA IMPLEMENTAR

Fase 9 de diseño está **solo lectura**. Fase 8/7 solo lectura. Fase 6 congelada (grano+PDF = baseline documental/API; chrome F10 = rango-primero). Este handoff **no** revoca `CO-F7-001`, `CO-F8-001/002` ni `CO-F9-001`. Absorbe `CO-F10-001` (A5 revocada), `CO-F10-002` (disco), `CO-F10-003` (DASH rango).

**Punto de entrada:** este archivo + [`../STATUS.md`](../STATUS.md) + [`../comun/design-tokens.md`](../comun/design-tokens.md) v0.10.0

Código: `C:\Users\PC GAMER\LaBorregaMarket`  
Panel `/proveedor`, `/fruteria/[id]`, `/admin` tabs, `/proveedor/dashboard?view=reportes`, `/login`

Backend: Arquitecto `fase-10/handoff-backend-fase-10.md` + APIs listadas abajo. **No inventar paths.** Promover (`US-ADMIN-04`) = Should; path TBD Arch.

Quality Gate UX se emite **cuando FE implemente**. No `READY-FOR-QA` de checkout/pagos.

---

## Impacto si no se cierra

El dueño no puede vender SKUs propios ni organizar el menú. Admin sigue con catálogo read-only + upload cloud. Reportes no cortan por rango real ni por producto. Producción puede filtrar cuentas demo.

---

## US de este handoff

| ID | Frontend hace | MoSCoW |
|----|----------------|--------|
| **US-CAT-02** | Drawer alta/edición local; badge Solo este negocio | M |
| **US-CAT-03** | Secciones CRUD + reorder; detalle agrupado; empty «Aún no hay secciones» | M |
| **US-MEDIA-06** | Logo, portada y foto ítem a disco; preview `/api/media`; sin copy nube | M |
| **US-ADMIN-02** | Tab Catálogos CRUD global; inhabilitar ≠ DELETE | M |
| **US-ADMIN-03** | Tabla Proveedores: verificado, activo, Mayoreo, A domicilio | M |
| **US-SEC-03** | Ocultar DemoAccountsBlock en production; 401/403 ErrorBanner | M |
| **US-DASH-07** | Tabla venta por producto; checkboxes (vacío = todos) | M |
| **US-DASH-08** | Mes-atajo + inicio/fin TZ Monterrey | M |
| **US-DASH-09** | Imprimir CSS sin chrome app | M |
| **US-ADMIN-04** | Cola + PromoteLocalDialog (categoría + slug) | S |

**Intactos:** `US-CAT-01` (Activo/Inactivo), `US-BRAND-02` (ADMIN = plataforma), `US-REV-04` (revocar apaga Google), FilterBar F9, Encargar/contacto F2–F3.

---

## Orden de implementación

```
1. MediaDisco: POST existentes a disco; GET /api/media; copy sin Cloudinary
2. SectionBlock: CRUD + reorder; empty; delete solo vacía
3. ProductFormDrawer: POST/PATCH local-products; imagen ítem
4. FruteriaSectionedList: agrupar GET /api/providers/[id]
5. AdminProductForm: CRUD global + imagen admin
6. ProviderTableF10: flags PATCH
7. DemoAccountsBlock: unmount en production
8. Reportes rango: MonthShortcut + dates + checklist + tabla + print CSS
9. Should: PromoteLocalDialog cuando Arch cierre path
```

Arquitecto permite adelantar contratos BE (SEC → CAT/MEDIA → DASH) en paralelo al chrome visual.

---

## Entregables UX (índice)

| Tipo | Archivo |
|------|---------|
| Flow local | [`user-flows/UF-CAT-02-producto-local.md`](./user-flows/UF-CAT-02-producto-local.md) |
| Flow secciones | [`user-flows/UF-CAT-03-secciones.md`](./user-flows/UF-CAT-03-secciones.md) |
| Flow admin catálogos + Should | [`user-flows/UF-ADMIN-02-catalogos.md`](./user-flows/UF-ADMIN-02-catalogos.md) |
| Flow flags | [`user-flows/UF-ADMIN-03-proveedores-flags.md`](./user-flows/UF-ADMIN-03-proveedores-flags.md) |
| Flow reportes | [`user-flows/UF-DASH-03-reportes-rango.md`](./user-flows/UF-DASH-03-reportes-rango.md) |
| Flow higiene | [`user-flows/UF-SEC-03-higiene-demo.md`](./user-flows/UF-SEC-03-higiene-demo.md) |
| WF catálogo | [`wireframes/WF-proveedor-catalogo-f10.md`](./wireframes/WF-proveedor-catalogo-f10.md) |
| WF detalle | [`wireframes/WF-fruteria-secciones.md`](./wireframes/WF-fruteria-secciones.md) |
| WF admin catálogos | [`wireframes/WF-admin-catalogos.md`](./wireframes/WF-admin-catalogos.md) |
| WF admin proveedores | [`wireframes/WF-admin-proveedores.md`](./wireframes/WF-admin-proveedores.md) |
| WF login | [`wireframes/WF-login-higiene.md`](./wireframes/WF-login-higiene.md) |
| WF reportes | [`wireframes/WF-proveedor-reportes-rango.md`](./wireframes/WF-proveedor-reportes-rango.md) |
| WF print | [`wireframes/WF-proveedor-reportes-print-f10.md`](./wireframes/WF-proveedor-reportes-print-f10.md) |
| Tokens | [`../comun/design-tokens.md`](../comun/design-tokens.md) §6i |
| IA | [`../comun/information-architecture.md`](../comun/information-architecture.md) |

---

## Parte 1 — `/proveedor` catálogo local + secciones + disco

### Componentes

| Componente | Spec |
|------------|------|
| CatalogToolbarF10 | **Agregar producto** primary ≥44px; **Nueva sección** secondary ≥44px |
| ProductFormDrawer | Sheet `<md` / drawer `md+`; nombre, precio, unidad, sección *, dropzone, Activo |
| ScopeBadge | «Solo este negocio» + Store; nunca color-only |
| SectionBlock | heading, rename, reorder, delete si `productCount=0` |
| ProductImageDropzone | MEDIA-03; preview `/api/media/…`; placeholder F2 |
| MediaUpload F2 | Logo/portada; **cero** copy nube |

Globales F1/F5 (precio + Activo/Inactivo) **siguen**. Grupo **Sin sección** si `sectionId` null.

### Contratos

- `GET /api/provider/products` — delta `scope`, `sectionId`, `sectionName`, `imageUrl`, `providerProductId`
- `POST /api/provider/local-products`, `PATCH /api/provider/local-products/[id]`
- `GET/POST /api/provider/sections`, `PATCH /api/provider/sections/[id]`, `PATCH .../reorder`, `DELETE .../[id]`
- `POST /api/provider/media`, `POST /api/provider/products/[providerProductId]/image`
- `GET /api/media/[filename]`

Arquitecto: `API-PROVIDER-PRODUCTS-02`, `API-PROVIDER-SECTIONS-01`, `API-MEDIA-02`. **No** `POST /api/admin/products` desde PROVIDER.

### DoD Parte 1 (US-CAT-02, US-CAT-03, US-MEDIA-06)

- [ ] PROVIDER crea SKU local con sección requerida; aparece en su bloque.
- [ ] Encargar/POS del **mismo** negocio pueden venderlo si Activo; **no** en otra frutería.
- [ ] Nueva sección siempre visible; empty «Aún no hay secciones».
- [ ] Delete sección disabled o 409 si no vacía; copy de reasignar.
- [ ] Reorder permutación completa.
- [ ] Logo/portada/foto: preview inmediato disco; MEDIA-03 inline; sin Cloudinary.
- [ ] Toggle Activo/Inactivo F5 intacto (no «agotado»).
- [ ] CTAs ≥44px.

---

## Parte 2 — `/fruteria/[id]` por sección

### Componentes

| Componente | Spec |
|------------|------|
| SectionedProductList | Grupos `sectionSortOrder`; omitir headings vacíos en público |
| ProviderHero | Cover/logo pueden ser `/api/media/…`; placeholder F2 |
| ProductRow / Encargar / ContactCTA | Intactos F2–F3 |

### Contratos

`GET /api/providers/[id]` — `scope`, `sectionId`, `sectionName`, `sectionSortOrder`, `imageUrl` resuelto.

### DoD Parte 2

- [ ] Listado agrupado (globales activos + locales vendibles del dueño).
- [ ] Hero portada disco o placeholder.
- [ ] Encargar dominante; contacto no bloqueado.
- [ ] FilterBar Explorar **sin** chips de sección.

---

## Parte 3 — `/admin` Catálogos

### Componentes

| Componente | Spec |
|------------|------|
| AdminProductForm | 2 cols; categoría plataforma; **distinto** del drawer PROVIDER |
| AdminProductImageUpload | Disco; copy sin nube |
| ProductActiveAdminControl | Inhabilitar (`isActive=false`); no DELETE |
| PromoteLocalDialog | **Should** US-ADMIN-04 |

Chrome ADMIN = marca **plataforma**.

### Contratos

- `GET/POST /api/admin/products`, `PATCH /api/admin/products/[id]`
- `POST /api/admin/products/[id]/image` (solo GLOBAL)
- Promover: ADR-029; **no inventar path** hasta Arch

### DoD Parte 3 (US-ADMIN-02 + Should 04)

- [ ] Alta/edición global usable; imagen disco.
- [ ] Inhabilitar ≠ papelera; 405/409 no se ofrece como UI de borrar.
- [ ] Distinct vs alta local (categoría vs sección).
- [ ] Should: diálogo promover con categoría + 409 slug (si hay contrato).

---

## Parte 4 — `/admin` Proveedores flags

### Componentes

| Componente | Spec |
|------------|------|
| ProviderTableF10 | + Activo, Mayoreo, A domicilio |
| AdminFlagSwitch | Labels paridad F9; ≥44px |
| RevokeVerifyDialog | Copy Google Reviews (`US-REV-04`) |

Mobile: `overflow-x-auto`. Badge «Sin email válido» F2 intacto.

### Contratos

`GET /api/admin/providers` (incluir `offersWholesale` / `offersDelivery`).  
`PATCH /api/admin/providers/[id]` — `API-ADMIN-PROVIDERS-01`.

### DoD Parte 4 (US-ADMIN-03)

- [ ] Cuatro flags operables; mismos campos listing F9 / F1.
- [ ] Revocar verificación muestra copy Google.
- [ ] Tabla usable en móvil (scroll-x).

---

## Parte 5 — Higiene demo

### Componentes

| Componente | Spec |
|------------|------|
| DemoAccountsBlock | Unmount si production (o flag Arch) |
| ErrorBanner | 401/403 rutas F10; sin UI de roles |

Card login F1 + SessionPersistBanner F7 **intactos**.

### Contratos

`API-ADMIN-SEC-01` criterio entorno. UI no llama endpoint «¿mostrar demo?».

### DoD Parte 5 (US-SEC-03)

- [ ] Cero emails/passwords seed en DOM de production.
- [ ] Dev puede conservar atajos.
- [ ] 403 → ErrorBanner existente.

---

## Parte 6 — Reportes rango + print

### Componentes

| Componente | Spec |
|------------|------|
| MonthShortcut | `input type="month"` rellena from/to |
| DateRangeFields | inicio/fin editables; max hoy Monterrey |
| ProductFilterChecklist | vacío = omitir `productIds` |
| ProductSalesTable | `products[]` completo (no top 5) |
| DocumentActions F10 | Solo **Imprimir** Secondary ≥44px |
| ReportPrintRootF10 | `#report-print-f10`; `.no-print` chrome |

**No pintar** GrainSelector ni Descargar PDF. Look PROVIDER, no slate analytics. Query **solo** `from`+`to` (XOR vs `grain`/`date`).

### Contratos

- `GET /api/provider/reports?from&to&productIds` — `API-PROVIDER-REPORTS-02` modo F10
- Print: `API-DASH-NOTES-01` (cero endpoint)

### DoD Parte 6 (US-DASH-07 … 09)

- [ ] Mes rellena rango; pickers editables.
- [ ] from>to / >366 / futuro → inline, no GET.
- [ ] Checkboxes recortan; ninguno = todos (locales + venta rápida).
- [ ] Empty «Sin ventas en este corte»; Imprimir habilitado.
- [ ] Print: sin header/SubNav/filtros; sí negocio, rango, TZ, Todos o nombres.
- [ ] Un mes a la vez en atajo; no primary de cobro.

---

## Copy Must

| Situación | Copy |
|-----------|------|
| Empty secciones | `Aún no hay secciones` |
| Delete sección llena | `Mueve los productos a otra sección antes de eliminarla` |
| Hint local | `Solo este negocio — no aparece en otras fruterías` |
| MEDIA formato | `Formato no permitido. Use JPEG, PNG o WebP` |
| MEDIA tamaño | `El archivo supera el límite de 5MB` |
| Sección requerida | `Elige una sección` |
| Precio | `Indica un precio válido` |
| Empty detalle | `Sin productos publicados aún` |
| Inhabilitar global | `Inhabilitar oculta el SKU a nuevas activaciones. No se borra el historial.` |
| 409 slug | `Ya existe un producto con ese identificador` |
| Revocar verify | `Al revocar, se apagan las reseñas de Google de este negocio. El Place ID no se borra.` |
| Empty reportes | `Sin ventas en este corte` |
| from>to | `La fecha de inicio no puede ser posterior a la de fin` |
| >366 | `El rango no puede superar 366 días` |
| Futuro | `Elige un periodo que no sea futuro` |
| Print productos | `Todos` o lista de nombres |
| 403 módulo | `Sin permiso para este módulo` |
| 403 negocio | `Esta vista es solo para tu negocio` |
| Toggle catálogo | `Activo` / `Inactivo` — no «agotado» |

**Prohibido:** Cloudinary, nube, CDN, «Vista rápida», chips sección en Explorar, «eliminar para siempre» como Must de catálogo global.

---

## Design system — componentes F10

| Componente | Spec en tokens |
|------------|----------------|
| ScopeBadge, SectionBlock, ProductFormDrawer | §6i |
| ProductImageDropzone / MediaDisco | §6i |
| AdminProductForm, AdminFlagSwitch, PromoteLocalDialog | §6i |
| MonthShortcut, DateRangeFields, ProductFilterChecklist | §6i |
| ReportPrintF10, DemoAccountsBlock | §6i |
| ProductActiveSwitch, MediaUpload, KpiCard, ErrorBanner | F5 / F2 / F3 conservados |
| FilterBarF9 / Explorar | §6h — **sin** chips sección |

---

## Contratos (resumen — no inventar)

| Uso | API |
|-----|-----|
| Panel catálogo | `GET /api/provider/products` |
| Alta local | `POST /api/provider/local-products` |
| Edit local | `PATCH /api/provider/local-products/[id]` |
| Activar GLOBAL | `PATCH /api/provider/products` F1 |
| Secciones | `/api/provider/sections` + `reorder` |
| Media negocio | `POST /api/provider/media` `field=logo\|cover` |
| Foto ítem | `POST /api/provider/products/[providerProductId]/image` |
| Serving | `GET /api/media/[filename]` |
| Admin CRUD | `/api/admin/products` |
| Imagen global | `POST /api/admin/products/[id]/image` |
| Flags | `PATCH /api/admin/providers/[id]` |
| Reportes | `GET /api/provider/reports?from&to` |
| Print | CSS only |
| Promover | TBD Arch (Should) |

401 sin cookie. 403 rol/módulo/IDOR. Envelope ADR-003.

---

## Fuera de alcance

Pasarela, CFDI, PWA, clustering, Places, pan→radio, FilterBar secciones, Cloudinary/S3/CDN, CRUD usuarios, matriz permisos UI, `BL-067`, 2FA, impersonation, redo `/admin/analytics`, ADMIN DASH ajeno, CSV, email reporte, multi-mes, PDF corte F10, wizard Frutas/Verduras/Agrícolas, reopen F7/F8/F9, editar `fase-6/`.

---

*Handoff UX/UI → Frontend — LaBorregaMarket v0.10.0 — 28/08/2026.*
