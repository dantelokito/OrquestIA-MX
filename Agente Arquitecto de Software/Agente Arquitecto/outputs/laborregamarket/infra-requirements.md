# Infraestructura — LaBorregaMarket v0.2.0

> **Agente:** Arquitecto de Software  
> **Fecha:** 10/08/2026  
> **Audiencia:** DevOps, Backend Developer  
> **Changelog 0.2.0:** Resend + Cloudinary + rate limit contacto

---

## Runtime

| Requisito | Versión mínima |
|-----------|----------------|
| Node.js | 20+ |
| PostgreSQL | 15+ |
| npm / pnpm | Según `package-lock.json` del repo |

---

## Variables de entorno

### Core (Fase 1)

| Variable | Requerida | Descripción | Ejemplo |
|----------|-----------|-------------|---------|
| `DATABASE_URL` | Sí | Connection string PostgreSQL | `postgresql://user:pass@localhost:5432/laborregamarket` |
| `JWT_SECRET` | Sí | Secreto para firmar tokens (min 32 chars) | `your-super-secret-key-min-32-chars` |
| `JWT_EXPIRES_IN` | No | Expiración JWT | `7d` |
| `NODE_ENV` | Sí | Entorno de ejecución | `development` / `production` |
| `NEXT_PUBLIC_APP_NAME` | No | Nombre app | `La Borrega Market` |
| `NEXT_PUBLIC_APP_URL` | Sí (Fase 2 email) | URL canónica (links en email) | `https://laborregamarket.mx` |

### Email — Resend (Fase 2, ADR-005)

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| `RESEND_API_KEY` | Sí en staging/prod | API key Resend |
| `EMAIL_FROM` | Sí en staging/prod | Remitente verificado |

Sin `RESEND_API_KEY` en local: no-op + AUDIT `reason: "email_disabled"`.

### Storage — Cloudinary (Fase 2, ADR-006)

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| `CLOUDINARY_CLOUD_NAME` | Sí (si MEDIA activo) | Cloud name |
| `CLOUDINARY_API_KEY` | Sí | API key |
| `CLOUDINARY_API_SECRET` | Sí | API secret |

### Rate limit contacto (opcional)

| Variable | Default | Descripción |
|----------|---------|-------------|
| `CONTACT_RATE_LIMIT_PER_PROVIDER` | `5` | Max contactos / provider / 10 min |
| `CONTACT_RATE_LIMIT_PER_IP` | `20` | Max contactos / IP / hora |

### Archivo de referencia

`LaBorregaMarket/.env.example` — Backend debe extender con vars Fase 2.

### Seguridad

- **Nunca** commitear `.env` con valores reales.
- `JWT_SECRET` único por entorno.
- Secretos Resend/Cloudinary solo server-side (nunca `NEXT_PUBLIC_*`).
- En producción: `secure: true` en cookie JWT.

---

## Base de datos

### Proveedor recomendado MVP

| Entorno | Opción |
|---------|--------|
| Desarrollo local | PostgreSQL Docker o instalación local |
| Staging/Prod | Neon, Supabase, Railway |

### Comandos Prisma

```bash
npx prisma migrate dev    # Aplicar migraciones (dev)
npx prisma db seed        # Datos demo
npx prisma generate       # Regenerar client
npx prisma studio         # UI explorar datos
```

### Migración Fase 2

Extender enum `AuditAction`:

```prisma
enum AuditAction {
  // ... existentes ...
  CONTACT
  MEDIA_UPLOAD
}
```

Nombre sugerido: `add_audit_contact_media_upload`

---

## Despliegue sugerido

```mermaid
flowchart LR
  User["Usuario"] --> CDN["Vercel Edge"]
  CDN --> NextJS["Next.js App + API Routes"]
  NextJS --> PG["PostgreSQL Managed"]
  NextJS --> Resend["Resend"]
  NextJS --> Cloudinary["Cloudinary"]
```

| Componente | Servicio sugerido |
|------------|-------------------|
| Frontend + API | Vercel (Next.js nativo) |
| Base de datos | Neon / Supabase / Railway |
| Email | Resend |
| Imágenes | Cloudinary |
| DNS | Cloudflare o registrar del dominio |

### Build

```bash
npm run build    # next build
npm start        # next start (producción)
```

Dependencias npm Fase 2: `resend`, `cloudinary`.

---

## Servicios externos

| Servicio | Uso | Fase |
|----------|-----|------|
| OpenStreetMap | Mapas Leaflet (cliente) | 1 |
| Resend | Email contacto proveedor | 2 |
| Cloudinary | Upload logo/cover/product | 2 |
| Redis / cola | Rate limit global + worker email | 3 |
| WhatsApp Business API | Notificaciones WA | 3+ (Fase 2 = solo `wa.me` FE) |

---

## Observabilidad

| Capacidad | Implementación | Notas |
|-----------|----------------|-------|
| Audit trail | `AuditLog` + `CONTACT` / `MEDIA_UPLOAD` | ADR-007 |
| Application logs | `console` / Vercel logs | Fallos Resend |
| Rate limiting | In-memory Map (contacto) | Redis Fase 3 |
| Health check | No dedicado | Roadmap |

---

## CORS

**No requerido** — monolito same-origin.

---

## Backup y recuperación

| Aspecto | Recomendación |
|---------|---------------|
| Backups DB | Automáticos managed |
| Retención | 7 días mínimo |
| Imágenes | Cloudinary backup/plan según cuenta |
| Seed | `prisma/seed.ts` |

---

## Checklist pre-deploy Fase 2

- [ ] `DATABASE_URL`, `JWT_SECRET`, `NODE_ENV=production`
- [ ] `NEXT_PUBLIC_APP_URL` correcta
- [ ] `RESEND_API_KEY` + `EMAIL_FROM` (dominio verificado)
- [ ] `CLOUDINARY_*` configuradas
- [ ] Migración `CONTACT` / `MEDIA_UPLOAD` aplicada
- [ ] `next.config` remotePatterns incluye Cloudinary
- [ ] Cookie `secure` activa

---

## Referencias

- SAD: [`sad.md`](./sad.md)
- Hub: [`OBSERVABILITY.md`](./OBSERVABILITY.md)
- ADR-005 / ADR-006: [`adrs/`](./adrs/)
- Repo: `LaBorregaMarket/README.md`, `.env.example`
