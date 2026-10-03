# Handoff: Product Manager → UX/UI Designer

## Metadata

- **Fecha:** 2026-09-14
- **Fase:** 12
- **Proyecto:** laborregamarket
- **Agente Emisor:** Product Manager
- **Agente Receptor:** UX/UI Designer
- **Timestamp:** 2026-09-14 (discovery F12 cerrado)

Diseñar el módulo inventario, SubNav (Inventario primero, etiqueta Ventas), barras/alerta/parcial, miniaturas en lista catálogo, cards POS con toggle de imágenes. **No** rediseñar Explorar F9, `/fruteria` con existencias, ni kardex. **No** Cloudinary.

Chat **nuevo**, sin historial. Este handoff no incluye wireframes: los produce UX. Código UI (solo lectura): `C:\Users\PC GAMER\LaBorregaMarket\src\`.

---

## Lectura mínima (en este orden)

1. [`prd.md`](./prd.md)
2. [`impacto-modulos.md`](./impacto-modulos.md)
3. Historias Must en [`user-stories/`](./user-stories/)
4. Este archivo.

**Solo lectura:** `fase-11/` … `fase-1/`. No reescribir WF F10/F11 salvo deltas F12.

---

## Entregables (emisor)

| Archivo | Tipo | Estado |
|---------|------|--------|
| `fase-12/prd.md` | PRD | Completo |
| `fase-12/user-stories/US-*.md` | User Stories | Completo |
| `fase-12/impacto-modulos.md` | Impacto | Completo |
| `fase-12/handoff-ux-ui.md` | Handoff | Listo |
| `fase-12/activation-prompt-ux.txt` | Prompt | Listo |

## Pendientes

- [ ] UX produce UF/WF + `handoff-frontend-fase-12.md` (responsable: UX/UI)
- [ ] Should F12: ninguno (responsable: —)

## Validación requerida por el receptor

- [ ] ACs Given-When-Then claros
- [ ] SubNav orden D-F12-2; etiqueta Ventas; ruta dashboard intacta
- [ ] Cliente `/fruteria` sin barras ni existencias
- [ ] Toggle POS ≠ miniaturas CAT
- [ ] Sin placeholders en inputs

## Checklist de recepción (para el Receptor)

- [ ] Todos los archivos listados existen
- [ ] Los archivos tienen el formato correcto
- [ ] La información está completa
- [ ] No hay contradicciones con la fase 12

---

## Rutas / pantallas Must

| Superficie | Qué diseñar |
|------------|-------------|
| SubNav PROVIDER | Inventario primero → Catálogo → POS → Órdenes → Ventas → Reportes generales (solo N>1) |
| `/proveedor/inventario` | Listado SKUs, barra, alerta, parcial Encargar, entrada, ficha tope/umbral/factor caja. 4 estados |
| Lista catálogo proveedor | Miniatura siempre + barra % (`US-CAT-12`, `US-CAT-13`); toggle imágenes POS (pregunta extra junto a secciones; default ON) |
| POS | Card con imagen según el toggle de `/proveedor`; **sin** el interruptor en esta pantalla |
| `/fruteria` | **Sin** existencias (Won't) |
| `/proveedor/dashboard` | Solo rename label Ventas; no rediseñar reportes F10 |

## a11y y DoD UX

- Ítems SubNav y toggle ≥44px; teclado.
- 4 estados del módulo inventario: Empty, Loading, Error, Success.
- Contraste WCAG 2.1 AA. Un CTA dominante en carga de entrada.
- Mobile: barra legible; lista inventario scroll; miniatura no aplasta precio.

## Inputs Utilizados

- **PRD:** `outputs/laborregamarket/fase-12/prd.md`
- **User Stories:** `outputs/laborregamarket/fase-12/user-stories/US-*.md`
- **STATUS:** `outputs/laborregamarket/STATUS.md`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-12/handoff-ux-ui.md`
- **Agente Downstream:** UX/UI Designer
- **Siguiente STATUS:** UX + Arch en paralelo
