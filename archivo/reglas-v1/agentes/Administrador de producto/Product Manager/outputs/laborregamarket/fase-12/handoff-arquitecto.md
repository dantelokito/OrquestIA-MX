# Handoff: Product Manager → Arquitecto de Software

## Metadata

- **Fecha:** 2026-09-14
- **Fase:** 12
- **Proyecto:** laborregamarket
- **Agente Emisor:** Product Manager
- **Agente Receptor:** Arquitecto de Software
- **Timestamp:** 2026-09-14 (discovery F12 cerrado)

F12 abre inventario **blando** por sucursal activa: on-hand, tope, umbral, factor caja fijo, reserva Encargar, descuento POS al cobro, preferencia imágenes POS. Paths REST y schema Prisma los decides tú; este handoff fija el *qué*. **No** uses `isAvailable` como stock (ADR-022). **No** 4xx por saldo al vender.

Chat **nuevo**, sin historial. Código (solo lectura para diseñar): `C:\Users\PC GAMER\LaBorregaMarket\`. Salida Arch: workspace Arquitecto `outputs/laborregamarket/fase-12/`.

---

## Lectura mínima (en este orden)

1. [`prd.md`](./prd.md)
2. [`impacto-modulos.md`](./impacto-modulos.md)
3. Must: `US-INV-01` … `US-INV-06`, `US-CAT-12`, `US-CAT-13`, `US-POS-12`
4. Este archivo.
5. Baseline solo lectura: ADR-022; F11 ISO; `ProviderProduct.stock` Int? no usado. No editar `fase-11/` ni `fase-10/`.

---

## Entregables (emisor)

| Archivo | Tipo | Estado |
|---------|------|--------|
| `fase-12/prd.md` | PRD + NFR | Completo |
| `fase-12/impacto-modulos.md` | Impacto modelo/API | Completo |
| `fase-12/user-stories/US-*.md` | User Stories | Completo |
| `fase-12/handoff-arquitecto.md` | Handoff | Listo |
| `fase-12/activation-prompt-arquitecto.txt` | Prompt | Listo |

## Pendientes

- [ ] ADR inventario blando + Decimal kg + factor caja (responsable: Arquitecto)
- [ ] `handoff-backend-fase-12.md` (responsable: Arquitecto)
- [ ] Kardex = Won't (no diseñar Must)

## Validación requerida por el receptor

- [ ] NFRs: 403 IDOR; Decimal cantidades kg; **nunca** 4xx de stock al vender
- [ ] `isAvailable` intacto (ADR-022)
- [ ] APIs públicas `/fruteria` sin existencias
- [ ] `stock` Int? no es el diseño final para KG

## Checklist de recepción (para el Receptor)

- [ ] Todos los archivos listados existen
- [ ] Los archivos tienen el formato correcto
- [ ] La información está completa
- [ ] No hay contradicciones con la fase 12

---

## Orden de diseño (igual que BE implementará)

1. **ISO** — inventario por `activeProviderId`; 403 cruzado (`US-INV-01`).
2. **SALDO** — on-hand Decimal; no reusar `Int? stock` a ciegas (`US-INV-02`).
3. **FICHA** — tope, umbral default 10%, alerta on/off, factor caja fijo (`US-INV-03`, D-F12-7).
4. **LISTA** — on-hand + reserved Encargar (`US-INV-04`).
5. **POS** — descuento al cobrar, blando (`US-INV-05`).
6. **ORDERS** — reserve / DELIVERED commit / CANCELLED restore (`US-INV-06`).
7. **CAT/POS UI data** — barra en lista CAT; toggle imágenes por Provider (`US-CAT-12`, `US-POS-12`). Miniatura CAT reusa media F10 (`US-CAT-13`).

No bloquear POST venta/pedido por saldo.

---

## ADRs / decisiones a resolver

| Tema | US | Detalle |
|------|-----|---------|
| Modelo on-hand | US-INV-02 | Decimal para KG; `ProviderProduct.stock` Int? deprecado o migrado — tú decides |
| Factor caja | US-INV-02 | Fijo en oferta sucursal, no por movimiento |
| Tope / umbral | US-INV-03 | Por producto; >100% permitido |
| Reserva Encargar | US-INV-06 | Activas = Marketplace ∧ ¬DELIVERED ∧ ¬CANCELLED |
| Commit / restore | US-INV-06 | DELIVERED descuenta; CANCELLED repone |
| POS cobro | US-INV-05 | Nunca 4xx por stock; 409 solo ADR-022 |
| Toggle POS | US-POS-12 | Preferencia por Provider, default true |
| Público | US-CAT-12 | No exponer stock en detalle/explorar |

## Contratos esperados (nombres finales = Arch)

| Contrato | US | Esperado |
|----------|-----|----------|
| GET/PATCH inventario sucursal | US-INV-01, 03, 04 | Lista + ficha; 403 cruzado |
| POST entrada | US-INV-02 | Validación cantidad; permite saldo mal |
| Delta POS sales | US-INV-05 | Descuenta; 2xx con on-hand 0/negativo |
| Delta orders Encargar | US-INV-06 | Reserva/commit/restore |
| Preferencia UI POS | US-POS-12 | Toggle por Provider |
| GET catálogo panel | US-CAT-12, 13 | Barra + URL miniatura; panel completo ADR-022 |

Envelope ADR-003. Versionado `/api/v1/...` si el SAD vigente lo exige.

## NFR (Must)

- Seguridad: JWT + ownership sucursal; IDOR 403.
- Venta: cero 4xx de stock.
- Rendimiento: listado inventario paginado o acotado al catálogo de la sucursal; sin N+1 evitable.
- Sin Cloudinary/S3. Sin pasarela. Sin kardex Must.

## Inputs Utilizados

- **PRD:** `outputs/laborregamarket/fase-12/prd.md`
- **Impacto:** `outputs/laborregamarket/fase-12/impacto-modulos.md`
- **User Stories:** `outputs/laborregamarket/fase-12/user-stories/`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-12/handoff-arquitecto.md`
- **Agente Downstream:** Arquitecto de Software
