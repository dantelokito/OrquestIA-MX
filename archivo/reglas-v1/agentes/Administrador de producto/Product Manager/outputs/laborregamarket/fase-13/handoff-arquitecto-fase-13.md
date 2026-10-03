# Handoff: Product Manager → Arquitecto de Software

## Metadata

- **Fecha:** 2026-09-16
- **Fase:** 13
- **Proyecto:** laborregamarket
- **Agente Emisor:** Product Manager
- **Agente Receptor:** Arquitecto de Software
- **Timestamp:** 2026-09-16 (kickoff implementación F13; cobertura PM completa)

F13 abre visibilidad admin de **todos** los `Product`, archivo de oferta (`archivedAt` o equivalente), unidad de **oferta** por sucursal (sin mutar `Product.unit` GLOBAL), precio de oferta con historial, persistencia de **entradas** de inventario, reportes de saldo actual. Paths REST y schema Prisma los decides tú; este handoff fija el *qué*. **No** uses `isAvailable` como único flag de oculto (ADR-022 intacto). **No** 4xx por saldo al vender (blando F12). **No** hard-delete.

Chat **nuevo**, sin historial. Código (solo lectura para diseñar): `C:\Users\PC GAMER\LaBorregaMarket\`. Salida Arch: workspace Arquitecto `outputs/laborregamarket/fase-13/`.

**Fase 12:** cerrada documentalmente en PM. Tu STATUS/QG F12 son **históricos**. Escribes **solo** en `fase-13/` (+ `comun/` vivos: SAD/ADR). No edites `fase-12/`.

**Baseline código:** DevOps F12 en paralelo ([PR #12](https://github.com/dantelokito/BorregaMarket/pull/12); merge **humano**). Contratos F13 pueden **asumir** el modelo inventario blando F12 (on-hand Decimal, factor caja en oferta, reserva Encargar) como diseño; BE/FE/DevOps **no** asumen ese código ya en `main`. No bloquea emitir `handoff-backend-fase-13.md`. Formaliza [`adr-draft-038-archivo-vs-delete.md`](./adr-draft-038-archivo-vs-delete.md) como ADR en tu workspace.

---

## Lectura mínima (en este orden)

1. [`prd.md`](./prd.md)
2. [`impacto-modulos.md`](./impacto-modulos.md)
3. [`adr-draft-038-archivo-vs-delete.md`](./adr-draft-038-archivo-vs-delete.md)
4. [`quality/QG-cobertura-BE.md`](./quality/QG-cobertura-BE.md)
5. Must: `US-ADMIN-05/06`, `US-CAT-14/15/16/18/19/20`, `US-DASH-10/12/13`, `US-SEC-04`, `US-INV-07`
6. Este archivo.
7. Baseline solo lectura: ADR-003, ADR-022, aislamiento F11, inventario F12. No editar `fase-12/` ni anteriores.

---

## Entregables (emisor)

| Archivo | Tipo | Estado |
|---------|------|--------|
| `fase-13/prd.md` | PRD + NFR | Completo |
| `fase-13/impacto-modulos.md` | Impacto modelo/API | Completo |
| `fase-13/user-stories/US-*.md` | User Stories | Completo |
| `fase-13/adr-draft-038-archivo-vs-delete.md` | Borrador ADR (PM) | Completo — tú formalizas |
| `fase-13/handoff-arquitecto-fase-13.md` | Handoff | Listo |
| `fase-13/activation-prompt-arquitecto.txt` | Prompt activación | Listo |

## Pendientes

- [ ] ADR-038 archivo vs delete + unidad de oferta (responsable: Arquitecto)
- [ ] `handoff-backend-fase-13.md` (responsable: Arquitecto)
- [ ] Kardex / backfill F12 / Cloudinary / `BL-040` = Won't (no diseñar Must)
- [ ] UX en **paralelo** (UF/WF); no esperes a FE para contratos

## Validación requerida por el receptor

- [ ] NFRs: JWT + IDOR 403; envelope ADR-003; paginación admin 50/100
- [ ] DELETE producto/oferta **405** o ruta inexistente; unique `provider_products` intacto
- [ ] `isAvailable` intacto (ADR-022); tercer flag = archivo de oferta
- [ ] Unidad de venta sucursal persistida **sin** mutar `Product.unit` GLOBAL
- [ ] Venta: cero 4xx de stock (F12); 409 Encargar **solo** al cambiar unidad/factor
- [ ] Ocultar con Encargar activo **permitido** (D-F13-24)
- [ ] APIs públicas sin ocultos; reportes de ventas = `OrderItem` snapshot

## Checklist de recepción (para el Receptor)

- [ ] Todos los archivos listados existen
- [ ] Los archivos tienen el formato correcto
- [ ] La información está completa
- [ ] No hay contradicciones con la fase 13
- [ ] Tu STATUS pasa a fase **13** (el PM no lo edita)

---

## Orden de diseño (igual que BE implementará)

1. **ADMIN LIST** — GET todos los `Product` GLOBAL + LOCAL; filtros; meta paginación (`US-ADMIN-05`).
2. **ADMIN MOD** — PATCH `isActive` LOCAL y GLOBAL; DELETE 405 (`US-ADMIN-06`, `US-SEC-04`).
3. **ARCHIVO** — `archivedAt` (o equivalente) por oferta; crear fila archivada si GLOBAL sin oferta; Restaurar no muta `isAvailable` (`US-CAT-14/15`).
4. **VENDIBLE** — cliente/POS/inventario excluyen archivo; carrito stale 409 (`US-CAT-16`).
5. **UNIDAD OFERTA** — campo por sucursal; fallback maestro; LOCAL sí muta `Product.unit` (`US-CAT-18`).
6. **DESCARTE** — cambio unidad/factor: alerta; `onHand=0` sin fila de entrada; 409 Encargar activo (`US-INV-07`).
7. **PRECIO** — `ProviderProduct.price` + historial por `providerProductId` (`US-CAT-19/20`).
8. **ENTRADAS** — `addInventoryEntry` inserta fila; reportes sucursal actual + entradas; N>1 solo actuales (`US-DASH-12/13`).
9. **VENTAS** — KPIs no filtran por activo/archivo; snapshot `OrderItem` (`US-DASH-10`).

No bloquear POST venta/pedido por saldo. No cancelar Encargar al ocultar.

---

## ADRs / decisiones a resolver

| Tema | US | Detalle |
|------|-----|---------|
| Archivo vs delete | US-CAT-14, US-SEC-04 | Formalizar ADR-038; unique intacto; no SQL DELETE |
| Unidad de oferta | US-CAT-18 | Campo en oferta (tú nombras); no `Product.unit` GLOBAL |
| Fallback unidad | US-CAT-18 | Maestro hasta primer Editar; primera edición GLOBAL sin oferta **crea** `ProviderProduct` |
| Factor CAJA | US-CAT-18 | Obligatorio si unidad de oferta = CAJA (D-F13-25) |
| Descarte vs entrada | US-INV-07, US-DASH-12 | `onHand=0` no es `addInventoryEntry` |
| Encargar vs ocultar | US-INV-07 vs US-CAT-14 | 409 solo cambio unidad/factor; ocultar permitido |
| Historial precio | US-CAT-20 | Tabla/bitácora por oferta; primera asignación también |
| Entradas desde go-live | US-DASH-12 | Sin backfill F12 (D-F13-21) |
| GLOBAL nuevo | US-CAT-15 | Sigue apareciendo en dashboard (D-F13-23) |

## Contratos esperados (nombres finales = Arch)

| Contrato | US | Esperado |
|----------|-----|----------|
| GET admin products | US-ADMIN-05 | GLOBAL+LOCAL; `meta.total`; 50/100 |
| PATCH admin isActive | US-ADMIN-06 | LOCAL y GLOBAL; 403 PROVIDER |
| DELETE products | US-SEC-04 | 405 admin y proveedor |
| PATCH/POST archivo oferta | US-CAT-14/15 | ocultar / restaurar / listar `archived` |
| GET catálogo panel | US-CAT-15/16/18 | sin archivados; Editar datos unidad oferta |
| PATCH unidad/factor | US-CAT-18, US-INV-07 | 400 validación; 409 Encargar; descarte |
| PATCH precio + GET historial | US-CAT-19/20 | por sucursal; 403 cruzado |
| GET reporte inventario sucursal | US-DASH-12 | actual + entradas |
| GET inventario generales N>1 | US-DASH-13 | solo actuales; 403 si N=1 |
| Delta reportes ventas | US-DASH-10 | JOIN no filtra snapshot |

Envelope ADR-003. Versionado `/api/v1/...` si el SAD vigente lo exige.

## NFR (Must)

- Seguridad: JWT + ownership sucursal; IDOR 403; RBAC admin vs PROVIDER.
- Venta: cero 4xx de stock; 409 ADR-022 y producto no disponible (oculto/inactivo).
- Rendimiento: listados paginados; sin N+1 evitable en admin y reportes.
- Sin Cloudinary/S3. Sin pasarela. Sin kardex Must. Sin mutar maestro GLOBAL.

## Contradicción de STATUS (registro)

Arquitecto/UX pueden seguir con fase **12** activa (QG-correcciones emitidos, espera PM). **Reconciliación:** F12 cerrada en PM; producto = **13**. Al arrancar, actualicen **su** STATUS a 13.

## Inputs Utilizados

- **PRD:** `outputs/laborregamarket/fase-13/prd.md`
- **Impacto:** `outputs/laborregamarket/fase-13/impacto-modulos.md`
- **User Stories:** `outputs/laborregamarket/fase-13/user-stories/`
- **Borrador ADR:** `outputs/laborregamarket/fase-13/adr-draft-038-archivo-vs-delete.md`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-13/handoff-arquitecto-fase-13.md`
- **Agente Downstream:** Arquitecto de Software
