# API-PROVIDER-DASH-01 — Dashboard ventas

> **Fase:** 3 · **US:** US-DASH-01…03 · **Fuente:** FEAT-DASH + ADR-012 + REVIEW-ARCH

| Método | Ruta | Rol | Notas |
|--------|------|-----|-------|
| GET | `/api/provider/dashboard` | PROVIDER | Un solo endpoint. TZ Monterrey. |

Shape implementado (FE): `empty`, `kpis` (incl. `bySource`), `series7d`, `topProducts`. Top con `providerProductId === null` = venta rápida. Agregación groupBy/SQL, no mock en prod.
