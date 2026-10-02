# ADR-017 — Cálculo de ETA (preparación + Haversine)

> **Estado:** Aceptado  
> **Fecha:** 2026-08-14  
> **Decisores:** Arquitecto de Software  
> **Fase:** 4 — v0.4.0

---

#### 1. Contexto y Problema:

US-NOTIFY-09 pide "Listo aprox. en ~X min" en checkout, detalle de pedido y (Should) notificaciones. El traslado real vía Distance Matrix es Could, no Must. Cada proveedor configura `preparationTimeMinutes`. Pickup puede no tener ubicación del cliente.

---

#### 2. Opciones Consideradas:

* **Opción A — Fórmula simple (Haversine + velocidad urbana fija):** Pros: cero costo API, determinista, testeable, cumple Must. Contras: no refleja tráfico.
* **Opción B — Google Distance Matrix:** Pros: ETA realista. Contras: billing, latencia, Could explícito; fuera de alcance F4.
* **Opción C — Solo `preparationTimeMinutes`:** Pros: trivial. Contras: no cumple el componente de distancia cuando hay pin/dirección.

---

#### 3. Decisión Elegida:

**Opción A.** Una sola función de dominio `computeEtaMinutes(...)` en Backend (fuente de verdad). Frontend no recalcula.

```
travelMinutes = distanceKm > 0
  ? max(1, round(distanceKm / AVG_SPEED_KMH * 60))
  : 0

etaMinutes = preparationTimeMinutes + travelMinutes
```

| Constante | Valor | Notas |
|-----------|-------|-------|
| `AVG_SPEED_KMH` | `25` | Tráfico urbano Monterrey (estimado) |
| `preparationTimeMinutes` | Int en `Provider`, default **20**, rango 5–120 | Config `PATCH /api/provider/me` |
| Distancia | Haversine sobre `Provider.latitude/longitude` y coords del cliente | Misma fórmula que filtro radio |
| Pickup sin coords | `travelMinutes = 0`; copy "tiempo de preparación" | US-NOTIFY-09 escenario 2 |
| Delivery / pickup con pin | Suma completa; copy "Listo aprox. en ~X min" | Estimación, no promesa contractual |

### Snapshot

Al `POST /api/orders` (Should delivery o Must pickup con coords opcionales): persistir `Order.etaMinutes` con el valor mostrado en checkout. Notificaciones (email/WA) usan el snapshot, no recálculo.

### Endpoint de preview

`GET /api/providers/[id]/eta?lat&lng&fulfillmentType=` — público o CLIENT. Sin persistir. Ver API-GEO-01.

### Qué NO hacer

- Llamar Distance Matrix / Directions en F4.
- Prometer el minuto como SLA.
- Calcular ETA solo en el cliente.

---

#### 4. Consecuencias e Impacto:

* **Positivas:** Barato, estable, un código compartido con el filtro geo. Copy UX puede distinguir preparación vs traslado.
* **Riesgos / Compensaciones:** Error vs tráfico real. Evolución futura: sustituir `travelMinutes` por Distance Matrix sin cambiar el campo `etaMinutes` ni el envelope.

## Referencias

- US-NOTIFY-09, US-ORDERS-05
- Geo: [`../../fase-4/api/API-GEO-01.md`](../../fase-4/api/API-GEO-01.md)
- Orders delta: [`../../fase-4/api/API-ORDERS-01.md`](../../fase-4/api/API-ORDERS-01.md)
- Schema: [`../../fase-4/data-model/DB-providers.md`](../../fase-4/data-model/DB-providers.md)
