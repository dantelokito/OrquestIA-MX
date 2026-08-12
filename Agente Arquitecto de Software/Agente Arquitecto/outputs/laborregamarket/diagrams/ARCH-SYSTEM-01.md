# ARCH-SYSTEM-01 — Topología de contenedores

> **Componente / Flujo:** Arquitectura de sistema LaBorregaMarket v0.1.0  
> **Fecha:** 05/08/2026

---

## Diagrama de contenedores (C4 Level 2)

```mermaid
flowchart TB
  subgraph client [Cliente]
    Browser["Browser Web"]
    Leaflet["Leaflet + OpenStreetMap"]
  end

  subgraph nextjs [Next.js 15 Monolito]
    Pages["App Router Pages"]
    API["API Routes"]
    Middleware["middleware.ts"]
    AuthLib["lib/auth"]
    Services["lib/services"]
    PrismaClient["lib/prisma"]
  end

  subgraph data [Persistencia]
    PG[("PostgreSQL 15+")]
  end

  Browser --> Pages
  Browser --> Leaflet
  Pages --> API
  Middleware --> Pages
  API --> AuthLib
  API --> Services
  Services --> PrismaClient
  PrismaClient --> PG
```

---

## Descripción de componentes

| Componente | Responsabilidad | Tecnología |
|------------|-----------------|------------|
| **Browser Web** | UI React, formularios, mapa interactivo | React 19, Tailwind CSS 4 |
| **App Router Pages** | Rutas `/`, `/explorar`, `/login`, `/proveedor`, `/admin`, `/cuenta` | Next.js Server/Client Components |
| **API Routes** | REST endpoints bajo `/api/*` | Next.js Route Handlers |
| **middleware.ts** | Protección de **páginas** por rol (no APIs) | Next.js Middleware |
| **lib/auth** | JWT sign/verify, `getSession`, `requireRole`, permisos | jsonwebtoken, bcrypt |
| **lib/services** | Lógica de negocio (a crear por Backend) | TypeScript |
| **lib/prisma** | Acceso a datos ORM | Prisma Client 6 |
| **PostgreSQL** | Persistencia relacional | PostgreSQL 15+ |

---

## Flujo de request típico

```mermaid
sequenceDiagram
  participant C as Cliente
  participant P as Page_Component
  participant A as API_Route
  participant S as Service
  participant D as Prisma
  participant DB as PostgreSQL

  C->>P: Navega /explorar
  P->>A: fetch GET /api/providers
  A->>S: listProviders(filters)
  S->>D: provider.findMany
  D->>DB: SELECT con indices
  DB-->>D: rows
  D-->>S: Provider[]
  S-->>A: mapped + meta
  A-->>P: JSON data + meta
  P-->>C: Render tarjetas + mapa
```

---

## Despliegue MVP sugerido

```mermaid
flowchart LR
  User["Usuario"] --> Vercel["Vercel - Next.js"]
  Vercel --> Neon["Neon / Supabase PostgreSQL"]
```

| Entorno | Frontend + API | Base de datos |
|---------|----------------|---------------|
| Desarrollo | `localhost:3000` | PostgreSQL local o Docker |
| Staging/Prod | Vercel | Neon, Supabase o Railway |

---

## Límites del sistema (MVP)

| Dentro del monolito | Fuera de alcance MVP |
|---------------------|----------------------|
| Auth JWT | OAuth / SSO |
| CRUD catálogo proveedor | Checkout / pagos |
| Explorar + detalle | App móvil nativa |
| Admin read-only catálogos | Upload imágenes S3 |
| AuditLog en DB | APM / tracing distribuido |

---

## Referencias

- SAD: [`../sad.md`](../sad.md)
- Auth flow: [`ARCH-AUTH-01.md`](./ARCH-AUTH-01.md)
- Infra: [`../infra-requirements.md`](../infra-requirements.md)
