# Handoff: Product Manager → UX/UI Designer

## Metadata

- **Fecha:** 2026-09-12
- **Fase:** 11
- **Proyecto:** laborregamarket
- **Agente Emisor:** Product Manager
- **Agente Receptor:** UX/UI Designer
- **Timestamp:** 2026-09-12 (discovery F11)

Diseñar deltas de chrome PROVIDER (switcher N>1), **módulo nuevo** de reportes globales, copy de `/registro/negocio` para sucursal N+1, fila extra en login demo, y tabla admin por sucursal. **No** rediseñar Explorar F9 ni `/admin/analytics`. **No** copiar look slate de analytics al panel PROVIDER.

Chat **nuevo**, sin historial. Este handoff no incluye wireframes: los produce UX. Código UI (solo lectura): `C:\Users\PC GAMER\LaBorregaMarket\src\`.

---

## Lectura mínima (en este orden)

1. [`prd.md`](./prd.md)
2. [`impacto-modulos.md`](./impacto-modulos.md) y [`seed-demo.md`](./seed-demo.md)
3. Historias Must en [`user-stories/`](./user-stories/)
4. Este archivo.

**Solo lectura:** `fase-10/` … `fase-1/`. No reescribir WF F6/F9/F10 salvo deltas F11.

---

## Entregables (emisor)

| Archivo | Tipo | Estado |
|---------|------|--------|
| `fase-11/prd.md` | PRD | Completo |
| `fase-11/user-stories/US-*.md` | User Stories | Completo |
| `fase-11/impacto-modulos.md` | Impacto | Completo |
| `fase-11/seed-demo.md` | Seed | Completo |
| `fase-11/handoff-ux-ui.md` | Handoff | Listo |
| `fase-11/activation-prompt-ux.txt` | Prompt | Listo |

## Pendientes

- [ ] UX produce UF/WF + handoff-frontend-fase-11 (responsable: UX/UI)
- [ ] Print del módulo consolidado = Should (responsable: UX si hay capacidad; no bloquea)

## Validación requerida por el receptor

- [ ] ACs Given-When-Then claros
- [ ] Visibilidad switcher y módulo global = función de N, no flag admin
- [ ] N=1 no cambia chrome
- [ ] Sin placeholders en inputs

## Checklist de recepción (para el Receptor)

- [ ] Todos los archivos listados existen
- [ ] Los archivos tienen el formato correcto
- [ ] La información está completa
- [ ] No hay contradicciones con la fase 11

---

## Rutas / pantallas Must

| Superficie | Qué diseñar |
|------------|-------------|
| Banner/header PROVIDER | Switcher **solo N>1**. N=1 = badge/nombre actual F10, sin control de rotar |
| Nav panel PROVIDER | **Módulo distinto** “Reportes generales” / “Fruterías globales” (nombre UX) **solo N>1**. Reportes F10 por sucursal siguen existiendo para todos |
| `/proveedor` resto | Título/contexto de sucursal activa; no rediseñar CAT/POS/DASH F10 |
| `/registro/negocio` | Copy “Nueva frutería” si ya hay sesión PROVIDER; CTA desde panel hacia esa ruta |
| `/login` demo | Fila Campo Verde |
| `/admin` Proveedores | Una fila por sucursal (nombre de negocio visible) |
| `/explorar` | Dos cards El Paraíso (nombres distintos); sin chips de sección |

## a11y y DoD UX

- CTA switcher y entrada al módulo global ≥44px; teclado.
- 4 estados del módulo consolidado: Empty, Loading, Error, Success.
- Contraste WCAG 2.1 AA. Un CTA dominante por pantalla.
- Mobile: switcher usable; tabla consolidada scroll-x si aplica.

## Inputs Utilizados

- **PRD:** `outputs/laborregamarket/fase-11/prd.md`
- **User Stories:** `outputs/laborregamarket/fase-11/user-stories/US-*.md`
- **STATUS:** `outputs/laborregamarket/STATUS.md`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-11/handoff-ux-ui.md`
- **Agente Downstream:** UX/UI Designer
- **Siguiente STATUS:** UX + Arch en paralelo
