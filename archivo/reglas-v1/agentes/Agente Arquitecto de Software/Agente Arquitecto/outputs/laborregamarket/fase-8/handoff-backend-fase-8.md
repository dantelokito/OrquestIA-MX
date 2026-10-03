# Handoff Backend Developer — LaBorregaMarket Fase 8 (v0.8.3)

> **De:** Agente Arquitecto de Software  
> **Para:** @Backend Developer  
> **Fecha:** 24/08/2026  
> **Prioridad:** Clamp `radiusKm` 0.5–10 (Must) + `isInMexico` en URL (Should); **no** reabrir F6/F7 (DASH/PDF/Redis/CI/AUTH cookie)  
> **No implementar:** pasarela, CFDI, CI YAML, `/health`, Maps JS, clustering, bbox Must de lista, teselas OSM, polígono INEGI, merge de duplicados, debounce preview

---

## Estado: LISTO PARA IMPLEMENTAR

**Punto de entrada:** este archivo + [`../STATUS.md`](../STATUS.md) + [`../comun/sad.md`](../comun/sad.md)

Código: `C:\Users\PC GAMER\LaBorregaMarket`

`CO-F7-001` intacto: el servidor **no** deriva `radiusKm` del viewport. `CO-F8-001`: clamp **0.5–10** decimal. `CO-F8-002`: coords fuera de México → 400 Should. **Sin migración Prisma.**

---

## Orden de implementación

```
1. clampGeoRadiusKm: 0.5–10, sin Math.round; meta.radiusKm = aplicado
2. Quitar 400 bbox AMM en GET /api/providers (y POST/PATCH addresses)
3. Should: isInMexico(lat,lng) → 400 envelope si falla (no remap a SN)
4. Tests: 0.5, 10, 22→10, 0→0.5, 0.7 intacto; CDMX 200; 33.0,-99.0 400
```

P1 favoritas: **cero ruta nueva**. Envelope DELETE / tope 20 ya existen.  
P4 preview: **cero trabajo BE Must.** Mismo `GET /api/providers/[id]` F7. Debounce/cache es Frontend.

---

## Incidencias de este handoff

| Tema | Backend hace |
|------|----------------|
| Clamp | `clampGeoRadiusKm` / schema geo: min 0.5 max 10; default 10; **no** `Math.round` |
| Haversine | Igual F4/F7. Círculo FE = `radiusKm * 1000` m |
| AMM 400 | **Revocado.** CDMX (`19.43, -99.13`) no es 400 |
| ADR-028 Should | `!isInMexico` → 400 ADR-003 (`details` en `lat`/`lng`). No fallback SN en servidor |
| Addresses | Mismo helper en POST/PATCH `lat`/`lng`. Sin endpoint nuevo |
| Preview | No tocar GET detalle |

**No es Backend aquí:** Leaflet `maxBounds`, Nominatim viewbox, overlay compacto, hover debounce, copy metros, FilterBar, CI YAML, PDF, Redis.

---

### 1 — Lista Explorar (Must)

Contrato: [`api/API-GEO-01.md`](./api/API-GEO-01.md)  
ADR clamp: [`../comun/adrs/ADR-020-maps-engine-leaflet.md`](../comun/adrs/ADR-020-maps-engine-leaflet.md) (append F8)

Código actual: `src/lib/validators/geo.ts` (`clampGeoRadiusKm` 1–25). Alinear a 0.5–10.

`radiusKm` fuera de rango → clamp, `meta.radiusKm` = aplicado. **No 400** por 22 ni por 0.

---

### 2 — México (Should GET; Must addresses)

ADR: [`../comun/adrs/ADR-028-mexico-bounds.md`](../comun/adrs/ADR-028-mexico-bounds.md)  
Addresses: [`api/API-ADDRESSES-01.md`](./api/API-ADDRESSES-01.md)

```
MEXICO_BOUNDS south=14.5329 west=-118.3649 north=32.7187 east=-86.7104
isInMexico(lat,lng) = inclusivo en ese rectángulo
```

Quitar `MONTERREY_LAT_*` / `MONTERREY_LNG_*` del **guard de Explorar y favoritas**. El filtro de lista **no** es `WHERE lat BETWEEN …`.

Punto de prueba fuera del rectángulo: `lat=33.0&lng=-99.0` (un punto fronterizo como Laredo puede **pasar** el rectángulo; no usarlo como caso 400).

---

### 3 — Preview (no tocar)

Contrato: [`api/API-PROVIDER-PREVIEW-01.md`](./api/API-PROVIDER-PREVIEW-01.md) — nota NFR FE. Shape F7 intacto.

---

## Fuera de alcance

DASH, PDF, `@upstash/redis`, pipeline CI, Places, Distance Matrix, clustering, Maps JS, `BL-040`, pan→radio, polígono INEGI, fusión de `label` duplicados.

## Quality

No hay `quality/REVIEW-ARCH.md` hasta cierre de este handoff (clamp + tests; Should MX si se implementa).
