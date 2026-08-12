# Backlog — LaBorregaMarket

> Backlog priorizado MoSCoW para Tech Lead y equipo de desarrollo.  
> **Última actualización:** 09/08/2026 | **Agente:** Product Manager  
> **Versión:** 0.2.0 (Fase 2)

---

## Leyenda

| Prioridad | Significado |
|-----------|-------------|
| S0 | Sprint 0 — cierre Fase 1 (OBS Quality Gate) |
| P0 | Must-have Fase 2 |
| P1 | Should-have Fase 2 |
| P2 | Could-have / Fase 3 |

| MoSCoW | Significado |
|--------|-------------|
| M | Must have |
| S | Should have |
| C | Could have |
| W | Won't have (esta fase) |

---

## Sprint 0 — Cierre Fase 1 (bloqueante antes de Fase 2 build)

| ID | Item | Epic | Agente | Estado |
|----|------|------|--------|--------|
| BL-S0-01 | OBS-001: envelope `/api/catalogs` | BACKEND | Backend | 🔲 Pendiente |
| BL-S0-02 | OBS-002: nombres catálogos API-ADMIN-01 | BACKEND | Backend | 🔲 Pendiente |
| BL-S0-03 | OBS-003: product.service para provider/products | BACKEND | Backend | 🔲 Pendiente |
| BL-S0-04 | OBS-01: mapa móvil en `/explorar` | FRONTEND | Frontend | 🔲 Pendiente |
| BL-S0-05 | OBS-04: edición precio panel proveedor | FRONTEND | Frontend | 🔲 Pendiente |
| BL-S0-06 | OBS-02, OBS-03, OBS-05, OBS-06 (P1 Frontend) | FRONTEND | Frontend | 🔲 Pendiente |

---

## Fase 1 — Referencia (estado consolidado)

| ID | Item | Estado |
|----|------|--------|
| BL-001 | Documentar AUTH | ✅ |
| BL-002 a BL-007 | MVP core (onboarding, explorar API, detalle, cuenta, header) | ✅ Implementado |
| BL-008 a BL-011 | Guards, password, redirect, filtros base | ✅ Implementado |
| BL-012 | Búsqueda header | ✅ Implementado |
| Quality Gate Fase 1 | Backend + Frontend | 🔶 Rechazado con observaciones |

---

## P0 — Must-have Fase 2 (NOTIFY)

| ID | Item | Epic | MoSCoW | User Story | Estado |
|----|------|------|--------|------------|--------|
| BL-021 | Endpoint/evento contacto + email proveedor async | NOTIFY | M | US-NOTIFY-01 | 🔲 Pendiente |
| BL-022 | AUDIT evento contacto | NOTIFY | M | US-NOTIFY-02 | 🔲 Pendiente |
| BL-023 | Rate limit anti-spam contacto | NOTIFY | M | US-NOTIFY-05 | 🔲 Pendiente |
| BL-024 | Fallback proveedor sin email | NOTIFY | M | US-NOTIFY-04 | 🔲 Pendiente |

---

## P0 — Must-have Fase 2 (MEDIA)

| ID | Item | Epic | MoSCoW | User Story | Estado |
|----|------|------|--------|------------|--------|
| BL-025 | Upload logo/portada proveedor (Cloudinary/S3) | MEDIA | M | US-MEDIA-01 | 🔲 Pendiente |
| BL-026 | Validación archivo imagen (5MB, formatos) | MEDIA | M | US-MEDIA-03 | 🔲 Pendiente |
| BL-027 | Display imágenes explorar + detalle | MEDIA | M | US-MEDIA-04, US-MEDIA-05 | 🔲 Pendiente |

---

## P0 — Must-have Fase 2 (EXPLORE)

| ID | Item | Epic | MoSCoW | User Story | Estado |
|----|------|------|--------|------------|--------|
| BL-028 | API filtro `category` en GET /api/providers | EXPLORE | M | US-EXPLORE-01 | 🔲 Pendiente |
| BL-029 | API búsqueda por producto (`q`/`product`) | EXPLORE | M | US-EXPLORE-02 | 🔲 Pendiente |
| BL-030 | UI chips categoría conectados API | EXPLORE | M | US-EXPLORE-01 | 🔲 Pendiente |
| BL-031 | Filtros persistentes en URL | EXPLORE | M | US-EXPLORE-03 | 🔲 Pendiente |
| BL-032 | Empty state filtros sin resultados | EXPLORE | M | US-EXPLORE-04 | 🔲 Pendiente |

---

## P1 — Should-have Fase 2

| ID | Item | Epic | MoSCoW | User Story | Estado |
|----|------|------|--------|------------|--------|
| BL-033 | Feedback cliente "Frutería notificada" | NOTIFY | S | US-NOTIFY-03 | 🔲 Pendiente |
| BL-034 | WhatsApp wa.me con mensaje pre-llenado | NOTIFY | S | — | 🔲 Pendiente |
| BL-035 | Admin upload imagen producto catálogo | MEDIA | S | US-MEDIA-02 | 🔲 Pendiente |
| BL-036 | AUDIT MEDIA_UPLOAD | MEDIA | S | US-MEDIA-01 | 🔲 Pendiente |

---

## P2 — Could-have / Fase 3

| ID | Item | Epic | Estado |
|----|------|------|--------|
| BL-037 | Formulario interés sin Order | NOTIFY | 🔲 Fase 3 |
| BL-038 | Filtro geográfico por radio | EXPLORE | 🔲 Fase 3 |
| BL-039 | Checkout `POST /api/orders` | ORDERS | 🔲 Fase 3 — Decisión #2 cerrada |
| BL-040 | Pagos en línea | ORDERS | 🔲 Fase 3+ |
| BL-041 | WhatsApp Business API | NOTIFY | 🔲 Fase 3 |
| BL-018 a BL-020 | Analytics, reseñas, permisos UI | — | 🔲 Roadmap |

---

## Orden de ejecución recomendado

```
Sprint 0: BL-S0-01 → BL-S0-06
Sprint 1 Fase 2: BL-021 → BL-024 (NOTIFY core)
Sprint 2 Fase 2: BL-025 → BL-027 (MEDIA) + BL-028 → BL-032 (EXPLORE)
Sprint 3 Fase 2: BL-033 → BL-036 (Should)
```

---

## Dependencias entre agentes

| Backlog | Upstream | Downstream |
|---------|----------|------------|
| BL-S0-* | Quality Gates Fase 1 | Backend, Frontend |
| BL-021–024 | PM + Arquitecto API-NOTIFY | Backend → Frontend |
| BL-025–027 | PM + Arquitecto API-MEDIA | Backend → Frontend |
| BL-028–032 | PM + Arquitecto API-PROVIDERS ext | Backend → Frontend |
| BL-039+ | Decisión checkout Fase 3 | Full stack |

---

## Referencias

- PRD Fase 1: `outputs/laborregamarket/prd.md`
- PRD Fase 2: `outputs/laborregamarket/prd-fase-2.md`
- User stories: `outputs/laborregamarket/user-stories/`
- Bitácora: `outputs/laborregamarket/OBSERVABILITY.md`
- Handoff UX Fase 2: `outputs/laborregamarket/handoff-ux-ui-fase-2.md`
- Handoff Arquitecto Fase 2: `outputs/laborregamarket/handoff-arquitecto-fase-2.md`
