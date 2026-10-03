# Handoff Arquitecto — Fase 7

> **De:** Product Manager  
> **Para:** @Arquitecto de Software  
> **Fecha:** 18/08/2026 (v0.7.0 — Explorar)

Contratos y ADRs para Explorar + sesión cross-device. **No** reabrir PDF/DASH F6 ni ADR-015 Redis. **No** bbox Must. Leaflet/OSM invariante (ADR-020).

`CO-F7-001`: el servidor **no** asume radio derivado del viewport. Recibe `radiusKm` del cliente (slider).

## ADRs a resolver

| ADR | Tema | Detalle |
|-----|------|---------|
| Cookie/sesión móvil | US-AUTH-09 | Por qué falla login en móvil/otro browser (SameSite, Secure, Domain, credentials, Authorization vs cookie). Flags por entorno. |
| Coords default | US-GEO-11 | Punto canónico San Nicolás de los Garza, NL (constante documentada). |
| lastUsed favorita | US-GEO-11/14 | Si `UserAddress` necesita `lastUsedAt` (migración) o basta `isDefault` + `updatedAt`. |

## Contratos (`fase-7/api/` en outputs Arquitecto)

| Contrato | US |
|----------|----|
| API-GEO-01 delta | Lista: `lat`, `lng`, `radiusKm`, `q`, `page`, `limit` (≤20), **`total`**. Haversine + filtros. |
| API-GEO-ADDRESS (F4 delta) | CRUD favoritas CLIENT; default; last-used. |
| API-PROVIDER-PREVIEW-01 | Detalle/preview: horario estructurado, `isOpenNow`, `offersDelivery`, pago tarjeta sucursal, WhatsApp, `verifiedAt`, 3 reseñas, mayoreo/menudeo, items catálogo activos (preview). |
| AUTH (nota) | Login + me; cookies first-party en móvil. |
| — | US-GEO-16 — **sin API nueva**. Empty = `total=0` del delta API-GEO-01. UI reutiliza loader borrega. |

Envelope ADR-003 en 4xx/5xx.

### Schema propuesto (mínimo)

- Favoritas: reusar `UserAddress` F4; migración **solo si** falta last-used.
- Preview: reusar Provider, horario, Review F4, ProviderProduct; campos faltantes (tarjeta sucursal, mayoreo) = tu inventario + delta Prisma si no existen.
- **No** modelo de pagos.

### NFR

| Categoría | Requerimiento |
|-----------|---------------|
| Seguridad | Favoritas solo del `userId`. Preview público de datos de vitrina. Login sin filtrar JWT en querystring. |
| Consistencia | `total` = mismo predicado que la página (radio + q + category). |
| Rendimiento | Conteo no N+1 por página; índice geo existente. Debounce búsqueda FE; BE min 2 chars. |
| Geo | Clamp 1–25 en servidor si llega fuera de rango. |

### Fuera de alcance F7

DASH, lockfile Redis, CI YAML, Places, Distance Matrix, clustering, Maps JS, pasarela.

## Entregables esperados

ADRs cookie + coords SN; delta API-GEO-01 (`total`, `q`); API favoritas; API preview; `handoff-backend-fase-7.md`; append `sad.md` si aplica.
