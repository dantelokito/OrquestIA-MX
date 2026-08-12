# OBSERVABILITY — Frontend LaBorregaMarket

> **Agente:** Frontend Developer  
> **Proyecto:** laborregamarket  
> **Versión:** 0.2.0  
> **Fecha:** 10/08/2026  
> **Código:** `C:\Users\PC GAMER\LaBorregaMarket`

---

## Estado global

| Sprint | Estado | Notas |
|--------|--------|-------|
| Sprint 0 (OBS F1) | Cerrado | OBS-01/03/04/05/06 verificados en código |
| F2-A NOTIFY | Entregado | ContactCTA + toast + POST contact + admin email badge |
| F2-B MEDIA | Entregado | Upload logo/cover + admin product image + placeholders |
| F2-C EXPLORE | Entregado | `category`/`q`/`verified` server-side + URL sync (cierra OBS-02) |

---

## Sprint 0 — cierre OBS

| OBS | Prioridad | Resultado |
|-----|-----------|-----------|
| OBS-01 | P0 | Mapa móvil `h-[300px]` debajo de lista en `/explorar` |
| OBS-04 | P0 | `PriceInput` editable + PATCH en `/proveedor` |
| OBS-03 | P1 | Hint password login y registro |
| OBS-05 | P1 | Cuentas demo solo si `NODE_ENV !== "production"` |
| OBS-06 | P1 | CLIENT post-login → `/` |
| OBS-02 | P1 | Cerrado en F2-C (chips → API `category`) |

---

## APIs consumidas (Fase 2)

| Método | Ruta | Feature |
|--------|------|---------|
| POST | `/api/providers/[id]/contact` | NOTIFY |
| POST | `/api/provider/media` | MEDIA proveedor |
| POST | `/api/admin/products/[id]/image` | MEDIA admin |
| GET | `/api/providers?category&q&verified&page` | EXPLORE |
| GET | `/api/admin/providers` | `hasValidEmail` badge |

---

## Handoffs

- `feature-handoffs/FEAT-SPRINT0-handoff.md`
- `feature-handoffs/FEAT-NOTIFY-handoff.md`
- `feature-handoffs/FEAT-MEDIA-handoff.md`
- `feature-handoffs/FEAT-EXPLORE-handoff.md`
- `integration-readme.md`
- `.env.example`
- `handoff-ux-quality-gate-fase-2.txt` — prompt Quality Gate para @UX_UI_Designer
- `handoff-ux-quality-gate-fase-2.md` — índice del handoff UX

---

## Quality Gate UX (downstream)

| Campo | Valor |
|-------|-------|
| Estado | Pendiente auditoría UX |
| Solicitud | `handoff-ux-quality-gate-fase-2.txt` |
| Dictamen esperado | `Agente UX UI/.../OBSERVABILITY.md` → sección "Auditoría de Diseño y UX (Frontend)" |
| Fecha solicitud | 12/08/2026 |

---

## Fuera de alcance (confirmado)

Checkout, carrito, `POST /api/orders`, WhatsApp Business API, push/SMS, galerías múltiples.
