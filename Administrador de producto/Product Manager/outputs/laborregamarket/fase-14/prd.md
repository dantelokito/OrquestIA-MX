# PRD Corto — Fase 14

> **Proyecto:** LaBorregaMarket
> **Fecha:** 17/09/2026
> **Versión:** cobertura PM documental (mejoras y deuda del panel PROVIDER; **sin** implementación de app)
> **Objetivo del Negocio:** Que el dueño gestione identidad, datos y operación de **su** frutería en un Perfil dedicado (hoy mezclados en Catálogo y, post-onboarding, **no editables**); que mida merma y ajuste de existencias **sin** kardex de ventas; que vea en Reportes las series que la API **ya** calcula; y que no publique un GLOBAL a $50 ni pierda el 409 al borrar sección.
> **Público Objetivo:** `PROVIDER` con sucursal **activa** (F11). El `CLIENT` no recibe feature nueva. El `ADMIN` no gana US Must (editar datos de negocio desde admin queda Should).

> #### 1. Alcance (MVP)
> * **Incluido:**
>   * Pestaña `/proveedor/perfil`: logo, portada, colores; sub-módulo Google Maps con gate `isVerified` intacto; datos del negocio editables; horarios; capacidades (WhatsApp, tarjeta, mayoreo, menudeo) + operación (prep time, `offersDelivery`).
>   * Catálogo = **solo** productos (secciones, precios, unidades, archivados F13). `posShowImages` se mueve a POS.
>   * Ampliar PATCH de settings del proveedor para `businessName`, `address`, `city`, `phone`, `description`, `latitude`, `longitude`. Geo Monterrey/AMM. **No** resetear `isVerified`. Sin documentos de verificación.
>   * Merma **aditiva** (cantidad + motivo enum + nota) y ajuste por conteo físico. Persistir movimiento. Listado de entradas + mermas + ajustes (**sin** ventas POS ni entregas). `on_hand` resultante **nunca** negativo en estos flujos.
>   * Reportes generales: pintar `series`, `products`, `bySource` + filtro `productIds`. Ventas: gráfica unificada (tendencia, mix canal, top). PDF del corte `from`/`to`.
>   * Quitar `price: item.price ?? 50`. Hacer visible el 409 al borrar sección con productos. Unificar fetches de `getMyBusiness` al cargar Perfil.
> * **Fuera de Alcance:**
>   * Kardex completo (VENTA_POS / ENTREGA_PEDIDO / DESCARTE_UNIDAD / DEVOLUCION). Instrumentar `decrementOnHandForLines`. Rediseñar `confirmDiscard` / `US-INV-07`.
>   * Costos/margen, corte de caja, cajeros/equipo, lotes/caducidad, directorio clientes, crédito mostrador, BOM, inventario compartido.
>   * Granularidad semanal, comparativa vs periodo anterior, agrupación por sección, gráficos de margen.
>   * Cloudinary/S3, `BL-040`, Explorar/mapa/reseñas rediseño, `US-ADMIN-04`, hard-delete, reabrir US F13.

> #### 2. Módulos Principales
> 1. `[PROF/ID]` `US-PROF-01` — 2. `[PROF/MAPS]` `US-PROF-02` — 3. `[PROF/DATOS]` `US-PROF-03`
> 4. `[PROF/HORAS]` `US-PROF-04` — 5. `[PROF/CAPS]` `US-PROF-05`
> 6. `[CAT/SPLIT]` `US-CAT-21` — 7. `[CAT/PRECIO]` `US-CAT-22` — 8. `[CAT/SEC]` `US-CAT-23`
> 9. `[INV/MERMA]` `US-INV-08` — 10. `[INV/AJUSTE]` `US-INV-09` — 11. `[INV/LIST]` `US-INV-10`
> 12. `[DASH/GEN]` `US-DASH-14` — 13. `[DASH/VENTAS]` `US-DASH-15` — 14. `[DASH/PDF]` `US-DASH-16`

## Decisiones cerradas con Dante

| ID | Decisión | Cierre |
|----|----------|--------|
| D-F14-1 | Pestaña `/proveedor/perfil`. Mover logo, portada y colores desde Catálogo. | Dante 17/09 (opción A) |
| D-F14-2 | Google Maps (Place ID, URL, reseñas) vive en Perfil. Gate `isVerified` **intacto** (`GoogleReviewsLockedError` si no verificado). | Dante 17/09 |
| D-F14-3 | Catálogo se queda **solo** productos. `posShowImages` se mueve a POS. | Dante 17/09 |
| D-F14-4 | Datos del negocio editables post-onboarding vía PATCH proveedor: nombre, dirección, ciudad, teléfono, descripción, lat/lng. | Dante 17/09 |
| D-F14-5 | **NO** resetear `isVerified` al cambiar dirección/coords. **No** pedir documentos de verificación. Explorar/Haversine/ETA se actualizan con el dato nuevo. | Dante 17/09 (cierre diagnóstico #4) |
| D-F14-6 | UI de `openingHours`, `whatsappEnabled`, `acceptsCardAtStore`, `offersWholesale`, `offersRetail`. Prep time y `offersDelivery` se mueven a Perfil. Semántica de Explorar **sin cambio**. | Dante 17/09 |
| D-F14-7 | Gráficas: pintar lo que la API **ya** devuelve. **No** librería nueva como Must. Arquitecto decide SVG unificado vs librería. Conservar `<details>` accesible y CSS print. | Dante 17/09 |
| D-F14-8 | **No** granularidad semanal. **No** comparativa periodo anterior. **No** agrupación por sección. **No** gráficos de margen (no hay costo). | Dante 17/09 |
| D-F14-9 | PDF reconectado al modo `from`/`to` de la UI. **No** reactivar modo `grain` en la UI. | Dante 17/09 |
| D-F14-10 | Merma **ADITIVA** (no kardex completo). **NO** instrumentar POS ni transición `DELIVERED`. POS sigue inventario blando ADR-022. | Dante 17/09 |
| D-F14-11 | Merma/ajuste **no pueden** dejar `on_hand` negativo → **400**. Conteo físico ≥ 0; saldo resultante = el conteo. Ventas POS **sí** pueden dejar negativo. Dos políticas a propósito. | Dante 17/09 |
| D-F14-12 | Motivo de merma: enum `CADUCIDAD`, `DANO`, `ROBO`, `MUESTRA`, `OTRO` + nota opcional. | Dante 17/09 (diagnóstico #2) |
| D-F14-13 | Descarte por cambio de unidad (`confirmDiscard` → `onHand=0`, `US-INV-07`) **no** se rediseña. | Dante 17/09 |
| D-F14-14 | Si N=1, `GET` reportes generales sigue **403** `GLOBAL_REPORTS_NOT_AVAILABLE` y redirect a dashboard reportes. | Dante 17/09 |
| D-F14-15 | Activar GLOBAL sin precio **no** publica $50; exige precio válido > 0. El 409 al borrar sección con productos es **visible**. | Dante 17/09 |

## Cierres PM (abiertos a corrección de Arquitecto en schema)

| ID | Cierre PM | Nota |
|----|-----------|------|
| D-F14-16 | Arquitecto elige persistencia: extender `InventoryEntry` **o** tabla `InventoryMovement` **solo** para tipos de este alcance (entrada existente + `MERMA` + `AJUSTE`). PM **no** fija schema. | Técnico |
| D-F14-17 | `SELECT FOR UPDATE` / versionado de `on_hand`: **Should**, no Must. Anotar riesgo de carrera en ADR. | Diagnóstico #D-04 |
| D-F14-18 | Admin PATCH de los mismos datos de negocio: **Should** (hoy `patchAdminProviderSchema` tampoco los acepta). Must F14 = el **proveedor**. | Fuera de las 14 US |
| D-F14-19 | Reducir fetches repetidos de `getMyBusiness` al cargar el panel: **Must** como AC de `US-PROF-01` (trivial de redactar). | D-25 |
| D-F14-20 | Comparativa GMV por sucursal en Ventas: **Should** (el Must de `US-DASH-15` es tendencia + mix canal + top). | |
| D-F14-21 | Invariante: merma/ajuste **no** tocan `decrementOnHandForLines` ni el flujo de descarte F13. | |
| D-F14-22 | IDOR F11: todo PATCH/GET de Perfil, merma y reportes opera sobre la **sucursal activa**. 403 cruzado. Envelope ADR-003. | |
| D-F14-23 | Lat/lng se validan con las reglas geo **existentes** (Monterrey/AMM). 400 si inválido. | |

**Cerrado (ya no abierto del diagnóstico §8):** (1) merma **bloquea** negativo; (2) motivo = enum + nota; (4) **no** re-verificar al cambiar coords; (5) librería **no** es Must.

## MoSCoW

| Prioridad | Ítems |
|-----------|--------|
| Must | `US-PROF-01`…`05`, `US-CAT-21`…`23`, `US-INV-08`…`10`, `US-DASH-14`…`16` (`BL-230`–`235`, `237`, `239`, `240`, `244`–`246`, `250`, `261`, `269`, `271`) |
| Should | `BL-236` (modelo formal si Arch lo necesita más allá del Must), `BL-241` (`INVENTORY` en `SystemModule`), `BL-243` (atomicidad `on_hand`), `BL-262`/`263`/`264`/`265`/`270`, admin PATCH datos negocio, comparativa por sucursal |
| Could | `BL-266`, `BL-267`, `BL-268`, `BL-272` |
| Won't | Kardex de `VENTA_POS`/`ENTREGA_PEDIDO`/`DESCARTE_UNIDAD` (`BL-238`, `BL-242`), costos/margen (`BL-251`–`253`), corte de caja/cajeros (`BL-254`–`256`), lotes (`BL-260`), directorio/crédito (`BL-258`–`259`), granularidad semanal/comparativa periodo/sección (`BL-248`/`249`), gráficos de merma valorizada (`BL-247`), Cloudinary/S3, `BL-040`, Explorar/mapa/reseñas rediseño, `US-ADMIN-04`, hard-delete, BOM, inventario compartido, reabrir US F13 |

## Invariantes técnicos

- Envelope ADR-003. IDOR F11 (sucursal activa). JWT PROVIDER.
- `isVerified` **no** se apaga al editar dirección/coords. El pin de Explorar, Haversine y ETA **sí** usan el valor nuevo (riesgo de sello de verificado con ubicación distinta: documentar en ADR; **no** es bloqueo Must).
- Campos de capacidades y horarios **ya** existen en PATCH; F14 añade UI, no cambia filtros de Explorar.
- POS: inventario **blando** (ADR-022). Venta **puede** dejar `on_hand` negativo. Merma y ajuste **no**.
- No instrumentar `decrementOnHandForLines`. No kardex de ventas. Descarte `US-INV-07` intacto (sigue sin fila de merma).
- Reportes generales N=1: 403 `GLOBAL_REPORTS_NOT_AVAILABLE` + redirect. N>1: pintar series ya calculadas.
- PDF: el archivo bajado cubre el mismo `from`/`to` visible. Sin `grain` en UI.
- Precio de oferta GLOBAL al activar: **no** default 50. Precio válido > 0 o no se publica.
- Media logo/portada: disco local F10 (`CO-F10-002`). Sin Cloudinary/S3.
- Baseline código: F13 en **`main`** @ `0eda84c` ([PR #13](https://github.com/dantelokito/BorregaMarket/pull/13)). Este PRD **no** pide implementar la app.

## Riesgo para Arquitecto (D-F14-5)

Al permitir lat/lng sin reset de `isVerified`, un negocio verificado puede mudar el pin y conservar reseñas/Maps. Explorar mostrará la nueva posición. Mitigación F14 = documentar; no hay flujo de re-verificación ni carga de documentos.

## Stakeholder

Autorización humana Dante **17/09/2026**: abrir **F14 documental** para diseñar US. F13 permanece **cerrada** (QA APROBADO; PR #13 en `main`). No reabrir US F13. No mergear F14. Implementación de código F14 es **posterior** (otro rol).

## Inputs Utilizados

- Diagnóstico: `comun/MEJORA-PANEL-PROVEEDOR.md` (17/09/2026).
- Autorización Dante 17/09/2026 (opción A Must; merma aditiva; política `on_hand` ≥ 0 en merma/ajuste).
- PRD F13: `outputs/laborregamarket/fase-13/prd.md` (solo lectura).
- Backlog: `outputs/laborregamarket/comun/backlog.md` (último Must F13 = `BL-224`).
- STATUS PM: `outputs/laborregamarket/STATUS.md`.
- Proceso: `comun/PROCESO.md`.

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/prd.md`
- **Agente Downstream:** UX/UI y Arquitecto (handoffs del orquestador, en paralelo)
