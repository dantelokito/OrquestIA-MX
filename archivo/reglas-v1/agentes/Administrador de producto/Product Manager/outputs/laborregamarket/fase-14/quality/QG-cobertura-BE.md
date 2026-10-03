# QG cobertura Backend — Fase 14

> **Rol:** Product Manager (gate de cobertura, **no** `QG-correcciones` post-QA).
> **Fecha:** 17/09/2026
> **Implementación:** bloqueada hasta handoff Arquitecto → Backend. Este PM **no** implementa.

El Arquitecto baja contratos; este QG es el mínimo que Backend debe poder testear cuando implemente.

## Must

- [ ] `PATCH` settings proveedor acepta `businessName`, `address`, `city`, `phone`, `description`, `latitude`, `longitude` (schema ya no los rechaza por `.strict()`). Geo `monterreyLatSchema`/`monterreyLngSchema` (o sucesor): **400** si inválido. PATCH **no** muta `isVerified`.
- [ ] Campos ya existentes siguen: `openingHours`, `whatsappEnabled`, `acceptsCardAtStore`, `offersWholesale`, `offersRetail`, `preparationTimeMinutes`, `offersDelivery`, colores, Google, `posShowImages`.
- [ ] Google: `isVerified === false` → error de lock vigente (`GoogleReviewsLockedError` / 403). No relajar el gate.
- [ ] IDOR F11: todo GET/PATCH de `me`, media, merma, ajuste, movimientos, PDF y reportes opera sobre sucursal **activa**. Cruzado → **403/404**.
- [ ] POST merma: cantidad > 0, motivo enum `CADUCIDAD`|`DANO`|`ROBO`|`MUESTRA`|`OTRO`, nota opcional. Si `onHand - qty < 0` → **400** sin fila. Persistencia del movimiento (tabla = Arch).
- [ ] POST ajuste: conteo ≥ 0; `onHand` resultante = conteo; movimiento `AJUSTE`. Conteo < 0 → **400**.
- [ ] GET movimientos: tipos `ENTRADA` + `MERMA` + `AJUSTE`; filtro tipo/`from`/`to`; paginación. **Sin** VENTA_POS ni ENTREGA_PEDIDO.
- [ ] **No** modificar `decrementOnHandForLines`. **No** instrumentar POS ni `DELIVERED`. **No** cambiar `confirmDiscard` / `US-INV-07`.
- [ ] Reportes generales: N=1 → **403** `GLOBAL_REPORTS_NOT_AVAILABLE`. N>1: payload ya incluye `series`, `products`, `bySource`; filtro `productIds` intacto. Sin endpoint nuevo Must para pintar.
- [ ] PDF sucursal: query `from`/`to` alineada a la UI; **no** exigir `grain` para el corte visible.
- [ ] Upsert/activar oferta GLOBAL vendible: precio **> 0** obligatorio; **prohibido** default 50 en servidor si el cliente lo omite.
- [ ] DELETE sección con productos: **409** intacto (F10); body con `error.message` usable por FE.
- [ ] Envelope ADR-003. Tests unit/integration de geo 400, merma 400, ajuste 400, IDOR, PDF rango, lock Google.
- [ ] 100% tests del módulo en verde antes de handoff QA.

## Should (no bloquea Must)

- [ ] `SELECT FOR UPDATE` / versionado de `on_hand` (`BL-243`).
- [ ] Admin PATCH de datos de negocio (`D-F14-18`).
- [ ] `SystemModule.INVENTORY` (`BL-241`).

## No hacer

- Kardex de POS / Encargar / descarte / devolución.
- Reset de `isVerified` al cambiar coords.
- Modo `grain` como único path del PDF.
- Granularidad semanal, comparativa periodo, agregación por sección, costo/margen.
- Cloudinary/S3. `BL-040`. Hard-delete. `canDelete` PROVIDER en PRODUCTS.
