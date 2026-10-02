# Handoff Backend Developer — LaBorregaMarket Fase 9 (v0.9.0)

> **De:** Agente Arquitecto de Software  
> **Para:** @Backend Developer  
> **Fecha:** 25/08/2026  
> **Prioridad:** Query `offersWholesale` / `offersDelivery` en listing (Must); typeahead = **cero ruta nueva**  
> **No implementar:** endpoint `/suggest`, schema orgánico, Places, Distance Matrix, CI YAML, `/health`, Maps JS, clustering, bbox Must de lista, pan→radio, reopen F7/F8, pasarela/CFDI

---

## Estado: LISTO PARA IMPLEMENTAR

**Punto de entrada:** este archivo + [`../STATUS.md`](../STATUS.md) + [`../comun/sad.md`](../comun/sad.md)

Código: `C:\Users\PC GAMER\LaBorregaMarket`

`CO-F9-001`. `CO-F7-001` intacto. Clamp 0.5–10 y `MEXICO_BOUNDS` F8 **no se tocan**. **Sin migración Prisma** (`offersWholesale` / `offersDelivery` ya existen).

---

## Orden de implementación

```
1. ListProvidersFilters + buildWhere: offersWholesale / offersDelivery (AND)
2. Parse query en route GET /api/providers (booleanos; inválido → 400)
3. Tests: mayoreo / domicilio / ambos / AND con q+geo / empty total=0 / bool inválido
4. Verificar que listing serializa offersWholesale / offersDelivery si aún no
```

US-EXPLORE-08 / 10 / 24: **cero trabajo BE Must.**  
US-EXPLORE-09: **cero ruta nueva** — documentar uso de `q`+geo con `limit=10` para FE.

---

## Incidencias de este handoff

| Tema | Backend hace |
|------|----------------|
| Mayoreo | `offersWholesale=true` → `where.offersWholesale = true` |
| Domicilio | `offersDelivery=true` → `where.offersDelivery = true` |
| AND | Con `lat`/`lng`/`radiusKm`, `q`, `verified`, `category`, `isActive` |
| Bool ausente | No filtra por ese flag |
| Bool inválido | **400** ADR-003 |
| Typeahead | No crear `/api/providers/suggest` ni similar |
| Preview / distancia / chrome | No tocar |

**No es Backend aquí:** animación in-card, header UI, ETA en card, FilterBar visual, altura mapa, Orgánico, chip «Filtros», CI YAML, PDF, Redis.

---

### 1 — Filtros listing (Must)

Contrato: [`api/API-GEO-01.md`](./api/API-GEO-01.md)

Código actual: `src/lib/services/provider.service.ts` → `buildWhere` **no** incluye estos flags hoy. Añadir a filtros + where.

```
offersWholesale === true  →  { offersWholesale: true }
offersDelivery === true   →  { offersDelivery: true }
```

`meta.total` = COUNT del predicado completo (igual F7). Empty = **200** + `total=0`.

---

### 2 — Typeahead (cero ruta)

Contrato + diagrama: [`api/API-GEO-01.md`](./api/API-GEO-01.md), [`diagrams/ARCH-EXPLORE-TYPEAHEAD-01.md`](./diagrams/ARCH-EXPLORE-TYPEAHEAD-01.md)

El predicado `q` unión (businessName / description / producto vendible) **ya** cubre el radio. FE hará un GET debounced con `limit=10`. Ranking por similitud = Should FE.

---

### 3 — Sin API (no tocar)

| US | Nota |
|----|------|
| US-EXPLORE-08 | [`api/API-PROVIDER-PREVIEW-01.md`](./api/API-PROVIDER-PREVIEW-01.md) |
| US-EXPLORE-10 / US-GEO-24 | [`api/API-EXPLORE-NOTES-01.md`](./api/API-EXPLORE-NOTES-01.md) |

---

## Tests Must

| Caso | Esperado |
|------|----------|
| `offersWholesale=true` + geo | Solo wholesale; total correcto |
| `offersDelivery=true` + geo | Solo delivery |
| ambos true | AND |
| + `q` + geo | AND con unión q |
| 0 matches | 200, `total=0` |
| `offersWholesale=maybe` | 400 |

No reabrir suite clamp/MX F8 salvo regresión accidental.

---

## Fuera de alcance

DASH, PDF, `@upstash/redis`, pipeline CI, Places, Distance Matrix, clustering, Maps JS, `BL-040`, pan→radio, schema orgánico, typeahead SKUs, endpoint suggest, reopen sign-off F8.

## Quality

No hay `quality/REVIEW-ARCH.md` hasta cierre de este handoff (filtros + tests).
