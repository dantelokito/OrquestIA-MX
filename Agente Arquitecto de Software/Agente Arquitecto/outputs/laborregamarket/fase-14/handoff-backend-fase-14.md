# Handoff: Arquitecto de Software → Backend Developer

## Metadata

- **Fecha:** 2026-09-17
- **Timestamp:** 2026-09-17
- **Fase:** 14
- **Proyecto:** laborregamarket
- **Agente Emisor:** Arquitecto de Software
- **Agente Receptor:** Backend Developer
- **Prioridad:** SETTINGS → PERFIL intacto → PRECIO → SECCIÓN 409 → MERMA → AJUSTE → MOVIMIENTOS → PDF from/to → filtro entradas reportes
- **Estado:** LISTO PARA IMPLEMENTAR (el orquestador activa Backend; este handoff **no** lanza el agente).

Código (solo Backend escribe): `C:\Users\PC GAMER\LaBorregaMarket`  
Baseline: **`main` @ `0eda84c`** (PR #13 mergeado).  
STATUS Arch: [`../STATUS.md`](../STATUS.md)

Paths REST **sin** `/api/v1/` (ADR-002). Envelope ADR-003. JWT + IDOR 403 (F11).

UX trabaja **en paralelo**. No esperes wireframes para implementar contratos.

**No implementar:** kardex POS/`DELIVERED`, instrumentar `decrementOnHandForLines`, reset `isVerified`, Cloudinary/S3, BL-040, `SELECT FOR UPDATE` como Must, admin PATCH datos negocio (Should), librería de charts.

---

## Orden de implementación

```
1. Prisma: InventoryEntry.kind + reason + note + onHandAfter; receiveAs nullable
2. PATCH /api/provider/me datos de negocio + geo AMM; jamás escribir isVerified
3. Precio > 0 al dejar isAvailable=true (todos los caminos de oferta)
4. DELETE sección: conservar 409 con error string usable
5. POST shrinkage / adjustments + transacción onHand
6. GET movements paginado; POST entries rellena kind=ENTRADA y onHandAfter
7. Reportes inventario: filtrar entries kind=ENTRADA
8. PDF reports.pdf: parseReportsRequest (from/to XOR grain)
9. Tests: geo 400, isVerified intacto, merma 400, ajuste 400, IDOR, N=1 403 global, PDF rango, lock Google, precio 0 no publica
```

---

## Entregables

| Archivo | Tipo | Estado |
|---------|------|--------|
| [`api/API-PROVIDER-SETTINGS-14.md`](./api/API-PROVIDER-SETTINGS-14.md) | Contrato | Completo |
| [`api/API-PROVIDER-PROFILE-14.md`](./api/API-PROVIDER-PROFILE-14.md) | Contrato (sin semántica nueva) | Completo |
| [`api/API-PROVIDER-OFFER-14.md`](./api/API-PROVIDER-OFFER-14.md) | Contrato | Completo |
| [`api/API-PROVIDER-SECTIONS-14.md`](./api/API-PROVIDER-SECTIONS-14.md) | Contrato | Completo |
| [`api/API-INVENTORY-14.md`](./api/API-INVENTORY-14.md) | Contrato | Completo |
| [`api/API-PROVIDER-REPORTS-14.md`](./api/API-PROVIDER-REPORTS-14.md) | Contrato | Completo |
| [`data-model/DB-inventory-entries.md`](./data-model/DB-inventory-entries.md) | Esquema | Completo |
| [`data-model/DB-providers.md`](./data-model/DB-providers.md) | Esquema (sin columnas nuevas) | Completo |
| [`diagrams/ARCH-INV-14.md`](./diagrams/ARCH-INV-14.md) | Diagrama | Completo |
| [`diagrams/ARCH-PROF-14.md`](./diagrams/ARCH-PROF-14.md) | Diagrama | Completo |
| [`../comun/adrs/ADR-039-isverified-coords.md`](../comun/adrs/ADR-039-isverified-coords.md) | ADR | Aprobado |
| [`../comun/adrs/ADR-040-merma-aditiva.md`](../comun/adrs/ADR-040-merma-aditiva.md) | ADR | Aprobado |
| [`../comun/adrs/ADR-041-graficas-svg.md`](../comun/adrs/ADR-041-graficas-svg.md) | ADR | Aprobado |

## Decisiones Arch (obligatorias)

| Tema | Decisión |
|------|----------|
| Tabla merma/ajuste | **Extender `InventoryEntry`** con `kind` (`ENTRADA` \| `MERMA` \| `AJUSTE`). No hay `InventoryMovement`. |
| Gráficas | **SVG unificado** en Frontend. Cero npm de charts. Backend no toca shape de series. |
| `isVerified` | Intacta al mudar pin (ADR-039). Riesgo de sello vs coords: documentado, no bloquea. |
| Concurrencia | Must = transacción. `SELECT FOR UPDATE` = Should BL-243. |

## Notas Frontend (este workspace; no editar el de FE)

Mismos JSON. Perfil consume GET me **una vez**. Toggle `posShowImages` en POS. Banner 409 de sección fuera del form colapsado. Pintar `series`/`products`/`bySource`. PDF con query `from`/`to`. Un componente SVG (ADR-041) + `<details>` + print.

Handoff FE lo emite UX cuando existan wireframes. Contratos ya son fuente de verdad de API.

## Notas DevOps

**Sin variables de entorno nuevas Must.** Sin bucket. Sin Redis extra. Migración Prisma (`InventoryEntry.kind`, `receiveAs` nullable) viaja en el PR de app. `pdfkit` ya está en lockfile. Humano mergea; no push a `main` desde agentes.

Delta infra: changelog 0.14.0 en [`../comun/infra-requirements.md`](../comun/infra-requirements.md) (sin env nueva). No hay `infra-requirements` de fase aparte.

## Archivos de código sugeridos

| Área | Ruta actual |
|------|-------------|
| Schema | `prisma/schema.prisma` |
| Settings | `src/lib/validators/provider-settings.ts`, `provider.service.ts`, `src/app/api/provider/me/route.ts` |
| Precio | `product.service.ts`, `local-product.service.ts` |
| Secciones | DELETE `src/app/api/provider/sections` |
| Inventario | `inventory.service.ts`, nuevas routes `shrinkage` / `adjustments` / `movements` |
| Reportes PDF | `src/app/api/provider/reports.pdf/route.ts` — usar `parseReportsRequest` |
| Reportes inv | `inventory-report.service.ts` — `kind: ENTRADA` |
| Tests | geo, verificación, merma 400, ajuste 400, IDOR, PDF rango, N=1 403 |

## Pendientes

- [ ] Wireframes UX F14 (paralelo; no bloquea BE)
- [ ] `SELECT FOR UPDATE` (Should BL-243)
- [ ] Admin PATCH datos negocio (Should D-F14-18)
- [ ] Kardex ventas / Cloudinary / BL-040 = Won't

## Validación requerida por el receptor

- [ ] Contratos con método, path, auth, body, 200/201, 4xx/5xx, envelope
- [ ] PATCH me no muta `isVerified`
- [ ] Geo AMM 400
- [ ] Merma/ajuste 400 si el saldo resultante sería negativo
- [ ] Cero instrumentación POS/`DELIVERED`
- [ ] N=1 global 403 `GLOBAL_REPORTS_NOT_AVAILABLE`
- [ ] Precio mayor que 0 al publicar; prohibido default 50
- [ ] Tests 100% del módulo en verde antes de QA

## Checklist de recepción (para el Receptor)

- [ ] Todos los archivos listados existen
- [ ] Formato de plantilla
- [ ] Información completa
- [ ] Sin contradicción con fase 14 / ADR-039–041
- [ ] No escribir en `fase-13/`

## Inputs Utilizados

- **Handoff PM:** `Administrador de producto/.../fase-14/handoff-arquitecto-fase-14.md`
- **PRD / impacto / 14 US / QG-cobertura-BE / MEJORA-PANEL-PROVEEDOR.md**
- **SAD / ADR-002 / 003 / 018 / 022 / 023 / 033 / 035 / 036 / 038**
- **Prisma (lectura):** `LaBorregaMarket/prisma/schema.prisma` @ `0eda84c`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/handoff-backend-fase-14.md`
- **Agente Downstream:** Backend Developer
