# Handoff — Quality Gate Backend Fase 2

> **De:** Backend Developer  
> **Para:** @Arquitecto_de_Software  
> **Fecha:** 12/08/2026  
> **Producto:** LaBorregaMarket v0.2.0

---

## Prompt (copiar al chat del Arquitecto)

@Arquitecto_de_Software Hola Arquitecto.

He completado la implementación backend de **LaBorregaMarket Fase 2 (v0.2.0)** — módulos NOTIFY, MEDIA y extensión EXPLORE. Te paso la estafeta para ejecutar la fase de **Gobernanza y Validación de Cumplimiento (Quality Gate F2)**.

---

### Contexto de la entrega

| Campo | Valor |
|-------|-------|
| **Producto** | LaBorregaMarket |
| **Versión backend** | 0.2.0 |
| **Código** | `C:\Users\PC GAMER\LaBorregaMarket` |
| **Handoff F2 (tu spec)** | `Agente Arquitecto de Software/Agente Arquitecto/outputs/laborregamarket/handoff-backend-fase-2.md` |
| **Bitácora Backend** | `Agente backend/outputs/laborregamarket/OBSERVABILITY.md` |
| **Handoff Frontend** | `Agente backend/outputs/laborregamarket/handoff-frontend.md` |
| **Auditoría F1 previa** | Sección histórica en tu `OBSERVABILITY.md` (08/08/2026) — OBS-001…004 reportadas como resueltas por Backend |

**Decisión producto confirmada:** contacto directo — **NO** implementar `POST /api/orders`, checkout ni pagos.

---

### Objetivo

Auditar el código backend Fase 2 y emitir dictamen técnico: **APROBADO**, **APROBADO CON OBSERVACIONES** o **RECHAZADO**, con hallazgos accionables (IDs OBS-F2-xxx si aplica).

---

### Alcance de auditoría (Fase 2)

#### Endpoints nuevos o extendidos

| Módulo | Endpoint | Contrato | Archivos clave |
|--------|----------|----------|----------------|
| NOTIFY | `POST /api/providers/[id]/contact` | API-NOTIFY-01 | `src/app/api/providers/[id]/contact/route.ts`, `src/lib/services/contact.service.ts`, `src/lib/email/resend.ts`, `src/lib/rate-limit/contact.ts`, `src/lib/validators/contact.ts` |
| MEDIA | `POST /api/provider/media` | API-MEDIA-01 | `src/app/api/provider/media/route.ts`, `src/lib/services/media.service.ts`, `src/lib/storage/cloudinary.ts` |
| MEDIA | `POST /api/admin/products/[id]/image` | API-MEDIA-01 | `src/app/api/admin/products/[id]/image/route.ts` |
| EXPLORE | `GET /api/providers` (+ `category`, `q` producto) | API-PROVIDERS-01 v0.2.0 | `src/app/api/providers/route.ts`, `src/lib/services/provider.service.ts` |
| EXPLORE | `GET /api/providers/[id]` (+ `imageUrl`) | API-PROVIDERS-01 v0.2.0 | `src/app/api/providers/[id]/route.ts` |
| ADMIN | `GET /api/admin/providers` (+ `hasValidEmail`) | US-NOTIFY-04 | `src/lib/services/provider.service.ts` → `listAdminProviders` |

#### ADRs y diagramas F2

- ADR-005 (email Resend), ADR-006 (Cloudinary), ADR-007 (AUDIT CONTACT/MEDIA_UPLOAD), ADR-008 (async + rate limit)
- `diagrams/ARCH-NOTIFY-01.md`
- `data-model/DB-audit-permissions.md` (enum extendido)

#### Migración y schema

- `prisma/schema.prisma` — `AuditAction`: `CONTACT`, `MEDIA_UPLOAD`
- Migración: `prisma/migrations/20260810010000_add_audit_contact_media_upload/`
- `.env.example` — `RESEND_*`, `EMAIL_FROM`, `CLOUDINARY_*`, `CONTACT_RATE_LIMIT_*`, `NEXT_PUBLIC_APP_URL`

#### Sprint 0 (re-verificar, no asumir)

- OBS-001: `/api/catalogs` usa `ok()` / `apiError()`
- OBS-003: lógica productos en `lib/services/product.service.ts`

---

### Tareas de auditoría (detalle)

#### 1. Cumplimiento de contratos API

- Envelope ADR-003: `{ data }` / `{ data, meta }` / `{ error, details? }`
- NOTIFY: body `{ source, productIds }`; email async (`after()`); 429 estándar
- MEDIA: multipart; JPEG/PNG/WebP ≤ 5MB
- EXPLORE: `category`, `q` min 2, `imageUrl` en detalle

**Smoke sugerido** (puerto 8080):

```bash
GET  /api/providers?category=FRUTA&q=mango
GET  /api/providers?q=a                    # → 400
POST /api/providers/{id}/contact           # → 200; 6º intento → 429
POST /api/provider/media (PROVIDER, PDF)   # → 400 MIME
```

#### 2. Integridad BD

- Enum `AuditAction` + migración
- Shapes AUDIT ADR-007 (sin PII cliente)
- Sin tablas Contact/Notification

#### 3. Seguridad

- RBAC MEDIA; NOTIFY público
- Rate limit ADR-008
- Cloudinary purge + HTTPS

#### 4. Checklist DoD (handoff-backend-fase-2.md)

Marcar ✅/🔶/❌ cada ítem del handoff.

#### 5. Fuera de alcance

Orders, WhatsApp API, Redis queue, tests automatizados, UI Frontend.

---

### Formato de salida

Actualizar **"Auditoría Arquitectónica de Backend — Fase 2 (v0.2.0)"** en tu `OBSERVABILITY.md` (no sobrescribir auditoría F1).

Prioridades: **P0** bloquea FE F2; **P1** retrabajo Backend; **P2/P3** recomendado.

---

### Criterio de éxito

Frontend puede integrar F2 cuando veredicto sea **APROBADO** o **APROBADO CON OBSERVACIONES** sin P0 abiertos.

— Backend Developer, LaBorregaMarket v0.2.0

---

*Documento generado por Backend Developer — listo para copiar al chat del Arquitecto.*
