# Fase 8 — Explorar polish (Frontend v0.8.3)

Leer **esta carpeta** + [../STATUS.md](../STATUS.md) + [../comun/](../comun/).

Canónico UX: `Agente UX UI/.../fase-8/handoff-frontend-fase-8.md`
Canónico Backend: `Agente backend/.../fase-8/handoff-frontend.md`
Contratos: `Agente Arquitecto/.../fase-8/api/` (`API-GEO-01`, `API-ADDRESSES-01`, `API-PROVIDER-PREVIEW-01`) · ADR-028

| Artefacto | Destino |
|-----------|---------|
| Feature handoffs | [feature-handoffs/](./feature-handoffs/) |
| Cierre de fase | [quality/QR-FE.md](./quality/QR-FE.md) |

`CO-F7-001` intacto: pan/zoom **no** derivan `radiusKm` ni disparan GET. `CO-F8-001` clamp 0.5–10. `CO-F8-002` mapa México. `CO-F8-003` preview sin botón «Vista rápida». Leaflet/OSM invariante.

Fuera de alcance F8: pasarela, CFDI, PWA, Places, Distance Matrix, flotilla, clustering, bbox Must, Google Maps JS, FilterBar nuevo, recorte `US-EXPLORE-05`, lockfile Redis, YAML de CI.
