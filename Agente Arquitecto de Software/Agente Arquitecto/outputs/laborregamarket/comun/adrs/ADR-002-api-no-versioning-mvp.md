# ADR-002 — Sin versionado de API en MVP

> **Estado:** Aceptado  
> **Fecha:** 05/08/2026  
> **Decisores:** Arquitecto de Software

---

## Contexto

La plantilla de contratos API del skill sugiere rutas con prefijo `/api/v1/`. Sin embargo, el código existente de LaBorregaMarket ya implementa endpoints bajo `/api/*` sin versión:

- `/api/auth/login`
- `/api/auth/register`
- `/api/providers`
- `/api/provider/products`
- `/api/catalogs`

Introducir `/api/v1/` ahora requeriría duplicar rutas o romper el frontend existente.

## Decisión

**No introducir versionado de API (`/api/v1/`) en MVP v0.1.0.** Mantener rutas actuales bajo `/api/*`.

## Alternativas consideradas

### A) Migrar todo a `/api/v1/` con redirect desde `/api/*`

- **Pros:** Preparado para versionado futuro.
- **Contras:** Overhead de mantenimiento dual; breaking change para código existente; sin consumidores externos que lo requieran.

### B) Versionado solo en endpoints nuevos

- **Pros:** Gradual.
- **Contras:** Inconsistencia en la API; confusión para desarrolladores.

## Consecuencias

### Positivas

- Cero breaking changes en MVP.
- Simplicidad para equipo pequeño.
- Frontend y Backend comparten mismo deploy (monolito).

### Negativas

- Cuando se necesite v2, habrá que planificar migración con período de deprecación.
- Sin contrato formal de retrocompatibilidad por versión.

## Estrategia futura (Fase 2+)

Cuando haya consumidores externos o cambios breaking:

1. Introducir `/api/v2/` para endpoints modificados.
2. Mantener `/api/v1/` (renombrando rutas actuales) con header `Deprecation`.
3. Documentar en OpenAPI con versionado semántico del producto (`0.1.0`).

## Referencias

- Código: `LaBorregaMarket/src/app/api/`
- PRODUCT.md sección API
