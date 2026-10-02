# Handoff: Product Manager → Arquitecto de Software

## Metadata

- **Fecha:** 2026-09-17
- **Fase:** 14
- **Proyecto:** laborregamarket
- **Agente Emisor:** Product Manager
- **Agente Receptor:** Arquitecto de Software
- **Timestamp:** 2026-09-17 (kickoff documental F14; cobertura PM completa)

F14 abre Perfil (datos de negocio **editables**), merma **aditiva** (no kardex de ventas), pintar series ya calculadas y PDF en modo `from`/`to`. Paths REST y schema Prisma los decides tú; este handoff fija el *qué*. **No** resetear `isVerified` al cambiar coords. **No** instrumentar `decrementOnHandForLines`. **No** 4xx de stock al **vender** (blando F12). **Sí** 400 si merma/ajuste dejarían `on_hand` negativo.

Chat **nuevo**, sin historial. Código (solo lectura para diseñar): `C:\Users\PC GAMER\LaBorregaMarket\`. Salida Arch: workspace Arquitecto `outputs/laborregamarket/fase-14/`.

**Fase 13:** **cerrada** en PM (QA APROBADO). Tu STATUS/QG F13 son **históricos**. Escribes **solo** en `fase-14/` (+ `comun/` vivos: SAD/ADR). No edites `fase-13/`.

**Baseline código:** **`main`** @ `0eda84c` ([PR #13](https://github.com/dantelokito/BorregaMarket/pull/13) mergeado). Contratos F14 asumen modelo F13 (archivo, unidad de oferta, entradas, ADR-038) y F12 (on-hand Decimal, POS blando). Implementación de código F14 es **posterior** (Backend). No pidas al PM implementar. No bloquea emitir `handoff-backend-fase-14.md` cuando termines diseño.

---

## Lectura mínima (en este orden)

1. [`prd.md`](./prd.md)
2. [`impacto-modulos.md`](./impacto-modulos.md)
3. [`quality/QG-cobertura-BE.md`](./quality/QG-cobertura-BE.md)
4. Must: `US-PROF-01`…`05`, `US-CAT-21`…`23`, `US-INV-08`…`10`, `US-DASH-14`…`16`
5. Este archivo.
6. Baseline solo lectura: ADR-003, ADR-022, aislamiento F11, inventario F12, archivo F13. No editar `fase-13/` ni anteriores.

---

## Entregables (emisor)

| Archivo | Tipo | Estado |
|---------|------|--------|
| `fase-14/prd.md` | PRD + NFR | Completo |
| `fase-14/impacto-modulos.md` | Impacto modelo/API | Completo |
| `fase-14/user-stories/US-*.md` | User Stories | Completo |
| `fase-14/handoff-arquitecto-fase-14.md` | Handoff | Listo |
| `fase-14/activation-prompt-arquitecto.txt` | Prompt activación | Listo |

## Pendientes

- [ ] ADR: datos de negocio + `isVerified` intacto al mudar pin (responsable: Arquitecto)
- [ ] ADR: persistencia merma/ajuste (`InventoryEntry` vs `InventoryMovement` acotado) (responsable: Arquitecto)
- [ ] ADR: gráfica SVG unificado vs librería (responsable: Arquitecto; PM **no** fija npm)
- [ ] `handoff-backend-fase-14.md` (responsable: Arquitecto)
- [ ] Kardex POS/`DELIVERED` / costos / caja = Won't (no diseñar Must)
- [ ] UX en **paralelo** (UF/WF); no esperes a FE para contratos
- [ ] `SELECT FOR UPDATE` = **Should** (`BL-243`); documentar riesgo de carrera

## Validación requerida por el receptor

- [ ] NFRs: JWT + IDOR 403; envelope ADR-003; geo AMM 400
- [ ] PATCH proveedor acepta datos de negocio; **no** muta `isVerified`
- [ ] Google lock intacto si no verificado
- [ ] Merma/ajuste 400 si `on_hand` resultante < 0; conteo ≥ 0
- [ ] Cero instrumentación de POS/`DELIVERED` en Must
- [ ] N=1 reportes generales: 403 `GLOBAL_REPORTS_NOT_AVAILABLE`
- [ ] PDF query `from`/`to`; sin grain como Must de UI
- [ ] Precio oferta vendible > 0; sin default 50 de servidor

## Checklist de recepción (para el Receptor)

- [ ] Todos los archivos listados existen
- [ ] Los archivos tienen el formato correcto
- [ ] La información está completa
- [ ] No hay contradicciones con la fase 14
- [ ] Tu STATUS pasa a fase **14** (el PM no lo edita)

---

## Orden de diseño (igual que BE implementará)

1. **SETTINGS** — ampliar PATCH datos de negocio + geo; `isVerified` intacto (`US-PROF-03`).
2. **PERFIL UI-API** — campos ya aceptados (horarios, capacidades, Google, colores, prep, delivery, media) sin cambio de semántica (`US-PROF-01/02/04/05`).
3. **CAT SPLIT** — `posShowImages` intacto; no contrato nuevo (`US-CAT-21`).
4. **PRECIO** — activar GLOBAL exige precio > 0 (`US-CAT-22`).
5. **SECCIÓN** — 409 con mensaje usable (`US-CAT-23`).
6. **MERMA / AJUSTE** — persistir movimientos; 400 negativo (`US-INV-08/09`).
7. **LISTADO MOV** — GET entradas+merma+ajuste paginado (`US-INV-10`).
8. **DASH** — pintar payload global existente; PDF rango (`US-DASH-14/15/16`).

No bloquear POST venta/pedido por saldo. No reset de verificación.

---

## ADRs / decisiones a resolver

| Tema | US | Detalle |
|------|-----|---------|
| Datos negocio vs `isVerified` | US-PROF-03 | D-F14-5: no reset; documentar riesgo Explorar/Haversine/ETA |
| Geo AMM | US-PROF-03 | Reusar schemas existentes; 400 |
| Tabla merma/ajuste | US-INV-08/09/10 | `InventoryEntry` extendido **o** `InventoryMovement` **solo** ENTRADA+MERMA+AJUSTE. PM no fija schema |
| Motivo merma | US-INV-08 | Enum PM: `CADUCIDAD`, `DANO`, `ROBO`, `MUESTRA`, `OTRO` + nota |
| Negativo | US-INV-08/09 vs POS | Dos políticas: merma/ajuste 400; POS blando ADR-022 |
| Concurrencia | — | Should `BL-243`; no Must |
| Gráficas | US-DASH-15 | SVG unificado vs librería ligera React 19; `<details>` + print obligatorios |
| PDF | US-DASH-16 | `from`/`to`; no grain en UI |

## Contratos esperados (nombres finales = Arch)

| Contrato | US | Esperado |
|----------|-----|----------|
| PATCH `/api/provider/me` (o sucesor) | US-PROF-03…05 | Datos negocio + campos ya existentes |
| POST media | US-PROF-01 | Intactos F10 |
| POST merma | US-INV-08 | 201 + 400 negativo |
| POST ajuste conteo | US-INV-09 | 201 + 400 conteo < 0 |
| GET movimientos | US-INV-10 | page/limit; tipos acotados |
| GET reports/global | US-DASH-14 | shape actual + 403 N=1 |
| GET reports.pdf | US-DASH-16 | `from`/`to` |
| PATCH oferta / activar | US-CAT-22 | precio > 0 |
| DELETE sección | US-CAT-23 | 409 intacto |

Envelope ADR-003. Versionado `/api/v1/...` si el SAD vigente lo exige.

## NFR (Must)

- Seguridad: JWT + ownership sucursal; IDOR 403; RBAC PROVIDER vs CLIENT vs ADMIN.
- Venta: cero 4xx de stock. Merma/ajuste: 400 si saldo < 0.
- Rendimiento: listados de movimientos paginados; no N+1 evitable en GET me (FE puede unificar fetches).
- Sin Cloudinary/S3. Sin pasarela. Sin kardex de ventas Must.

## Riesgo explícito (D-F14-5)

Un negocio **verificado** puede mudar lat/lng y conservar reseñas/Maps. Explorar mostrará el pin nuevo. F14 **no** pide documentos. Documentar en ADR; no bloquear.

## Contradicción de STATUS (registro)

Arquitecto/UX pueden seguir con fase **13** activa. **Reconciliación:** F13 cerrada en PM (QA APROBADO); producto documental = **14**. Al arrancar, actualicen **su** STATUS a 14.

## Inputs Utilizados

- **PRD:** `outputs/laborregamarket/fase-14/prd.md`
- **Impacto:** `outputs/laborregamarket/fase-14/impacto-modulos.md`
- **User Stories:** `outputs/laborregamarket/fase-14/user-stories/`
- **Diagnóstico:** `comun/MEJORA-PANEL-PROVEEDOR.md`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/handoff-arquitecto-fase-14.md`
- **Agente Downstream:** Arquitecto de Software
