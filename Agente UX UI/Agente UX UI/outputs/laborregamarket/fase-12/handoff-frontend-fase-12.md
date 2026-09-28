# Handoff: UX/UI Designer → Frontend Developer

## Metadata

- **Fecha:** 2026-09-14
- **Fase:** 12
- **Proyecto:** laborregamarket
- **Agente Emisor:** UX/UI Designer
- **Agente Receptor:** Frontend Developer
- **Timestamp:** 2026-09-14 (diseño Must F12)

Módulo inventario, SubNav (Inventario primero, etiqueta Ventas), barras/alerta/parcial, miniaturas CAT, cards POS con toggle en `/proveedor`. **No** rediseñar Explorar F9, reportes F10, ni kardex. **No** Cloudinary. **No** existencias en `/fruteria`.

**No implementar código desde este chat UX.** Frontend espera también contratos del Arquitecto. Este handoff no activa FE ni QA.

Código (solo lectura aquí): `C:\Users\PC GAMER\LaBorregaMarket\src\`

---

## Estado: LISTO PARA IMPLEMENTAR (cuando Arch entregue contratos)

**Punto de entrada:** este archivo + [`../STATUS.md`](../STATUS.md) + [`../comun/design-tokens.md`](../comun/design-tokens.md) v0.12.0 + [`../comun/information-architecture.md`](../comun/information-architecture.md) v0.12.0

Quality Gate UX: **cuando FE implemente y QA APROBADO**. `QG-correcciones.md` no aplica ahora.

---

## Entregables

| Archivo | Tipo | Estado |
|---------|------|--------|
| `fase-12/user-flows/UF-INV-01-modulo-subnav.md` | User flow | Completo |
| `fase-12/user-flows/UF-INV-02-entrada-factor-caja.md` | User flow | Completo |
| `fase-12/user-flows/UF-INV-03-capacidad-alerta.md` | User flow | Completo |
| `fase-12/user-flows/UF-INV-04-listado-estados.md` | User flow | Completo |
| `fase-12/user-flows/UF-INV-05-pos-sin-candado.md` | User flow | Completo |
| `fase-12/user-flows/UF-INV-06-parcial-encargar.md` | User flow | Completo |
| `fase-12/user-flows/UF-CAT-12-barra-catalogo.md` | User flow | Completo |
| `fase-12/user-flows/UF-CAT-13-miniatura-catalogo.md` | User flow | Completo |
| `fase-12/user-flows/UF-POS-12-toggle-imagenes.md` | User flow | Completo |
| `fase-12/wireframes/WF-INV-01-subnav.md` | Wireframe | Completo |
| `fase-12/wireframes/WF-INV-02-entrada.md` | Wireframe | Completo |
| `fase-12/wireframes/WF-INV-03-ficha-capacidad.md` | Wireframe | Completo |
| `fase-12/wireframes/WF-INV-04-listado.md` | Wireframe | Completo |
| `fase-12/wireframes/WF-INV-05-pos-sin-candado.md` | Wireframe | Completo |
| `fase-12/wireframes/WF-CAT-12-13-fila-catalogo.md` | Wireframe | Completo |
| `fase-12/wireframes/WF-POS-12-cards-toggle.md` | Wireframe | Completo |
| `fase-12/wireframes/WF-FRUTERIA-12-sin-existencias.md` | Wireframe | Completo |
| `comun/design-tokens.md` | Tokens v0.12.0 | Completo |
| `comun/information-architecture.md` | IA v0.12.0 | Completo |

## Pendientes

- [ ] Contratos API inventario / preferencia POS (responsable: Arquitecto). FE no inventa paths.
- [ ] Decimal kg vs Int `stock` (responsable: Arquitecto; UX no fija schema)
- [ ] Should F12: ninguno

## US de este handoff

| ID | Frontend hace | MoSCoW |
|----|----------------|--------|
| **US-INV-01** | Ruta inventario + SubNav orden + label Ventas | M |
| **US-INV-02** | Sheet entrada + factor solo en ficha | M |
| **US-INV-03** | Tope, barra %, umbral 10%, alerta off, >100% | M |
| **US-INV-04** | Listado 4 estados + barra + alerta + parcial | M |
| **US-INV-05** | POS sin UI de candado por stock | M |
| **US-INV-06** | Chip reserva Encargar en inventario | M |
| **US-CAT-12** | Barra compacta en fila CAT; nunca `/fruteria` | M |
| **US-CAT-13** | Miniatura 48px siempre en lista CAT | M |
| **US-POS-12** | Toggle en `/proveedor`; cards POS; no toolbar POS | M |

## Orden de implementación (cuando Arch+BE permitan)

```
1. SubNav: Inventario primero + label Ventas (ruta dashboard intacta)
2. InventoryPage 4 estados + fila + barra + alerta + parcial
3. StockEntrySheet + InventorySkuSheet (factor fijo)
4. CatalogRowThumb + barra compacta (no fruteria)
5. PosImagesToggle en /proveedor + slot img PosProductCard
6. Verificar POS cobra sin lock UI
```

## a11y Must

- Ítems SubNav y toggle POS ≥44px; teclado y `aria-current`.
- Barra: `aria-valuetext`, nunca color-only (sobre-tope y poca existencia llevan texto).
- Miniatura: `alt` = nombre; placeholder no es botón falso.
- Un CTA dominante en entrada: **Registrar entrada**.

## Won't (no pintar)

BOM, inventario compartido, Cloudinary, kardex, barra en `/fruteria`, bloquear ventas, `BL-040`.

## Checklist de recepción (Frontend)

- [ ] Todos los archivos de la tabla existen
- [ ] SubNav D-F12-2 / D-F12-11
- [ ] Cuatro estados en `WF-INV-04-listado.md`
- [ ] `/fruteria` sin barra (`WF-FRUTERIA-12-sin-existencias.md`)
- [ ] Toggle POS ≠ miniaturas CAT

## Inputs Utilizados

- **Handoff PM:** `Administrador de producto/Product Manager/outputs/laborregamarket/fase-12/handoff-ux-ui.md`
- **PRD / US / impacto:** workspace PM `fase-12/`
- **STATUS PM:** `Administrador de producto/Product Manager/outputs/laborregamarket/STATUS.md`

## Outputs Generados

- **Archivo:** `Agente UX UI/Agente UX UI/outputs/laborregamarket/fase-12/handoff-frontend-fase-12.md`
- **Agente Downstream:** Frontend Developer (tras contratos Arch)
- **Inputs Requeridos:** este handoff + tokens/IA v0.12.0 + APIs Arquitecto
