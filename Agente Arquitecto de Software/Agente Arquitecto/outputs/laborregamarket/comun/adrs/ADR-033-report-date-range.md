# ADR-033 — Ventana calendario `from`/`to` del reporte PROVIDER

> **Estado:** Aceptado  
> **Fecha:** 2026-08-28  
> **Decisores:** Arquitecto de Software  
> **Fase:** 10 — v0.10.2  
> **US:** US-DASH-07, US-DASH-08  
> **CO:** CO-F10-003  
> **No reemplaza:** [ADR-024](./ADR-024-calendar-windows.md) (`grain`+`date` F6 sigue vigente)

---

#### 1. Contexto y Problema:

ADR-024 define `GET /api/provider/reports?grain=&date=` (día/mes/año concreto). F10 pide un **rango inicio–fin** inclusive (TZ America/Monterrey) y filtro por productos. El mes en UI es un **atajo** que rellena el rango; no es un grano API nuevo. Copiar las ventanas rolling F3 (`7d`/`30d`) mezclaría modelos. `fase-6/` es solo lectura: el delta vive en F10.

---

#### 2. Opciones Consideradas:

* **Opción A — Mismo path `/api/provider/reports` con modo query XOR (`grain+date` **o** `from+to`):** Pros: un servicio de agregación; FE F6 no se rompe. Contras: validación de query discriminada.
* **Opción B — Path nuevo `/api/provider/reports/range`:** Pros: contratos aislados. Contras: dos rutas para el mismo agregado; más superficie 401/403.
* **Opción C — Extender `GET /api/provider/dashboard`:** Pros: una pantalla. Contras: shape rolling F3 vs corte imprimible; ya se rechazó en ADR-024.

---

#### 3. Decisión Elegida:

**Opción A.**

### Discriminación de query

| Modo | Params requeridos | Params prohibidos juntos |
|------|-------------------|--------------------------|
| F6 grain | `grain`, `date` | `from`, `to` |
| F10 rango | `from`, `to` (`YYYY-MM-DD`) | `grain`, `date` |

Mezcla grain con from/to → **400**. Falta el par del modo → **400**.

El atajo de mes es **solo FE**: primer día del mes → último día del mismo mes en Monterrey. La API no recibe `month=` en este modo.

### Inclusivo vs SQL

Calendario **inclusive** en las dos puntas (AC US-DASH-08). Interno, igual que ADR-024:

```
fromUtc = monterreyDayStartUtc(from)
toExclusiveUtc = monterreyDayStartUtc(to) + 1 day
filtro: createdAt >= fromUtc AND createdAt < toExclusiveUtc
```

### Tope y errores

| Caso | HTTP |
|------|------|
| `from` > `to` | 400 `details.field=from` |
| Span > **366** días inclusive (`to - from + 1 > 366`) | 400 `details.field=to` |
| `to` estrictamente futuro vs hoy Monterrey | 400 (el `from` futuro también) |
| Periodo en curso (hasta hoy) | Permitido |
| Formato no `YYYY-MM-DD` | 400 |

### Productos (`US-DASH-07`)

Query repetible `productIds` = `ProviderProduct.id` (cuid). Sentinel `quickSale` = líneas con `providerProductId=null` (venta rápida).

| Query | Semántica |
|-------|-----------|
| `productIds` ausente o lista vacía | Todos los SKUs **con movimiento** en el periodo (incluye venta rápida si hubo) |
| Uno o más cuid | Solo esos `ProviderProduct` del **propio** negocio |
| Incluye `quickSale` | Suma además venta rápida |
| Id de otro provider | **403** (IDOR) o se ignora como no propio — **Must: 403** si **cualquier** id no pertenece al `session.sub` |

KPIs (`gmv`, `orderCount`, `avgTicket`, `bySource`) se recortan al mismo predicado de ítems. Tabla `products[]`: nombre, `quantitySum`, `salesTotal`, split MARKETPLACE/POS. `status ≠ CANCELLED`. Empty: `empty: true`, no 404.

`series` en modo rango: un punto por **día** del intervalo (como `grain=month` pero recortado a `from`–`to`). `topProducts` F6 puede omitirse en modo rango (la tabla completa lo sustituye) o limitarse a las filas filtradas — Must es `products[]` completo del predicado, no un top 5.

### Ownership

Igual ADR-024: `requireRole(PROVIDER)` + `resolveProviderByUserId(session.sub)`. ADMIN/CLIENT → **403**. Print (`US-DASH-09`) = FE. PDF de este corte = Should (no reabre ADR-023).

### Qué NO hacer

- Editar archivos en `fase-6/`.
- `grain=range`.
- Multi-mes como tipo API (el usuario puede elegir 1–366 días; “un mes a la vez” es regla de atajo UI, no de span).
- ADMIN `?providerId=`.
- CSV / email / CFDI.

---

#### 4. Consecuencias e Impacto:

* **Positivas:** F6 grain intacto; un endpoint; TZ y GMV alineados a D-F6-8.
* **Riesgos / Compensaciones:** FE debe no mandar grain y from juntos. Span de 366 días con muchos `OrderItem` exige groupBy SQL (no hidratar órdenes en memoria).

## Referencias

- US-DASH-07, US-DASH-08, D-F10-9
- Contrato F10: [`../../fase-10/api/API-PROVIDER-REPORTS-02.md`](../../fase-10/api/API-PROVIDER-REPORTS-02.md)
- Contrato F6 (solo lectura): [`../../fase-6/api/API-PROVIDER-REPORTS-01.md`](../../fase-6/api/API-PROVIDER-REPORTS-01.md)
- ADR-024: [ADR-024](./ADR-024-calendar-windows.md)
