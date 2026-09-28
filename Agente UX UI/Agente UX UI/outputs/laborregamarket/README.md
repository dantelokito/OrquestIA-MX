# LaBorregaMarket — Entregables UX/UI

> **Proyecto:** LaBorregaMarket  
> **Agente:** UX/UI Designer  
> **Última actualización:** 18/09/2026

Repositorio de diseño para el marketplace de fruterías. Estructura **por fases**. **Fase 14 activa.** Fase 13 y anteriores solo lectura.

---

## Estructura del repositorio

```text
outputs/laborregamarket/
├── README.md
├── STATUS.md
├── comun/                    ← tokens + IA (vivos v0.14.0)
├── historial/                ← snapshots previos + changelog append
├── fase-1/ … fase-13/        ← solo lectura
└── fase-14/                  ← Perfil + merma aditiva + series (activa)
```

---

## Fase 14 — Perfil y deuda panel PROVIDER (activa)

| Área | Documento |
|------|-----------|
| Índice F14 | [fase-14/README.md](./fase-14/README.md) |
| QG-correcciones | [fase-14/quality/QG-correcciones.md](./fase-14/quality/QG-correcciones.md) (**sin deltas**) |
| Handoff FE | [fase-14/handoff-frontend-fase-14.md](./fase-14/handoff-frontend-fase-14.md) |
| Design tokens | [comun/design-tokens.md](./comun/design-tokens.md) v0.14.0 |
| IA | [comun/information-architecture.md](./comun/information-architecture.md) v0.14.0 |

**Alcance F14:** `/proveedor/perfil`; Catálogo solo productos; merma/ajuste/movimientos; series generales; gráfica unificada; PDF from/to. QA APROBADO. QG-correcciones: [fase-14/quality/QG-correcciones.md](./fase-14/quality/QG-correcciones.md) (**sin deltas**). Espera PM cierre.

**No editar** `fase-13/` … `fase-1/` salvo append en `historial/`.

---

## Fases anteriores (referencia)

| Fase | Alcance | Ubicación |
|------|---------|-----------|
| Fase 13 | Visibilidad admin / archivo oferta | [fase-13/](./fase-13/README.md) |
| Fase 12 | Inventario / almacén | [fase-12/](./fase-12/README.md) |
| Fase 11 | 1 user N fruterías | [fase-11/](./fase-11/README.md) |
| Fase 10 | Admin + catálogo local + Reportes rango | [fase-10/](./fase-10/README.md) |
| Fase 1–9 | Ver STATUS | `fase-{N}/` |

---

## Reglas anti-tokens (obligatorias)

1. **Fuente de verdad:** [`comun/design-tokens.md`](./comun/design-tokens.md) (v0.14.0).
2. **Nunca color-only** para estado de pedido, origen, venta rápida, báscula, alerta de existencias, **Inactivo vs Eliminado de la vista**, Google locked, tipo de movimiento.
3. **Un CTA dominante** por pantalla (en Perfil: **por bloque**).
4. **IN_TRANSIT** pickup = **"Listo para recoger"**; DELIVERY = **"En camino"**.
5. **Contacto F2:** `tel:` nunca bloqueado por notify 429/500/503.
6. **Lista alternativa al mapa** — motor Leaflet/OSM. **Pan/zoom ≠ `radiusKm`**.
7. **No inventar APIs.**
8. **Marca proveedor** solo sesión PROVIDER. Chrome ADMIN = marca **plataforma**.
9. `historial/` solo append.
10. **Media F10:** disco local; cero copy Cloudinary.
11. **FilterBar Explorar:** sin chips de secciones custom.
12. **F11:** switcher y Reportes generales **solo N>1**.
13. **F12:** inventario blando; no candado POS; no barra en `/fruteria`.
14. **F13:** Eliminar = ocultar; Editar GLOBAL = unidad de **oferta**; cliente sin pantallas nuevas.
15. **F14:** Perfil último en SubNav; Movimientos **sin** copy de ventas; N=1 sin pantalla nueva de generales; no `grain`.

---

## Quality y estado

Ver [STATUS.md](./STATUS.md). F14: QA APROBADO; QG-correcciones **sin deltas**. Espera PM cierre. UX no promociona ni lanza DevOps.

---

*Índice mantenido por Agente UX/UI Designer*
