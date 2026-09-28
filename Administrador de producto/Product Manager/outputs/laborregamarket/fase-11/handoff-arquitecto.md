# Handoff: Product Manager → Arquitecto de Software

## Metadata

- **Fecha:** 2026-09-12
- **Fase:** 11
- **Proyecto:** laborregamarket
- **Agente Emisor:** Product Manager
- **Agente Receptor:** Arquitecto de Software
- **Timestamp:** 2026-09-12 (discovery F11)

F11 abre 1 User → N `Provider`, contexto `activeProviderId`, aislamiento IDOR, **módulo API** de reportes consolidados (solo N>1) y seed. Paths REST y schema Prisma los decides tú; este handoff fija el *qué*.

Chat **nuevo**, sin historial. Código (solo lectura para diseñar): `C:\Users\PC GAMER\LaBorregaMarket\`. Salida Arch: workspace Arquitecto `outputs/laborregamarket/fase-11/`.

---

## Lectura mínima (en este orden)

1. [`prd.md`](./prd.md)
2. [`impacto-modulos.md`](./impacto-modulos.md) y [`seed-demo.md`](./seed-demo.md)
3. Must: `US-AUTH-11`, `US-HEADER-01`, `US-ISO-01`, `US-DASH-11`, `US-ONB-01`, `US-SEED-01`, `US-ADMIN-11`, `US-EXPLORE-11`
4. Este archivo.
5. Baseline solo lectura: F10 contratos DASH/ADMIN/MEDIA. No editar `fase-10/` ni `fase-6/`.

---

## Entregables (emisor)

| Archivo | Tipo | Estado |
|---------|------|--------|
| `fase-11/prd.md` | PRD + NFR implícitos | Completo |
| `fase-11/impacto-modulos.md` | Impacto modelo/API | Completo |
| `fase-11/user-stories/US-*.md` | User Stories | Completo |
| `fase-11/handoff-arquitecto.md` | Handoff | Listo |
| `fase-11/activation-prompt-arquitecto.txt` | Prompt | Listo |

## Pendientes

- [ ] ADR 1:N + sesión + contrato consolidado (responsable: Arquitecto)
- [ ] `handoff-backend-fase-11.md` (responsable: Arquitecto)
- [ ] Print consolidado / PDF = Should (no bloquea)

## Validación requerida por el receptor

- [ ] NFRs de seguridad: 401/403 IDOR entre sucursales del mismo user
- [ ] Módulo consolidado es contrato **distinto**; 403 si N=1
- [ ] Sin unique `userId` en `Provider`

## Checklist de recepción (para el Receptor)

- [ ] Todos los archivos listados existen
- [ ] Los archivos tienen el formato correcto
- [ ] La información está completa
- [ ] No hay contradicciones con la fase 11

---

## Orden de diseño (igual que BE implementará)

1. **AUTH** — `US-AUTH-11`: quitar unique, `User.providers` 1:N, `activeProviderId`, ownership.
2. **ISO** — `US-ISO-01`: todas las rutas provider/media/POS/orders/reports F10 filtran por activo.
3. **HEADER** — persistir cambio de contexto (`US-HEADER-01`).
4. **DASH GLOBAL** — `US-DASH-11`: endpoint/módulo **nuevo**; no reutilizar a ciegas el reporte de sucursal.
5. **ONB / SEED / ADMIN / EXPLORE** — `US-ONB-01`, `US-SEED-01`, `US-ADMIN-11`, `US-EXPLORE-11`.

No adelantar consolidado si AUTH/ISO no cierran 401/403.

---

## ADRs / decisiones a resolver

| Tema | US | Detalle |
|------|-----|---------|
| Unique `userId` | US-AUTH-11 | Quitar `@unique`; índice no único o compuesto si hace falta |
| Contexto activo | US-AUTH-11, US-HEADER-01 | Cookie vs JWT claim vs header; persistir última sucursal |
| IDOR | US-ISO-01 | 403 si id ≠ activo o no es del user |
| Alta N+1 | US-ONB-01 | `createProvider` con sesión; no pisar el primero |
| Reportes sucursal | US-ISO-01 | Mismo contrato F10 + `providerId` activo |
| Reportes globales | US-DASH-11 | Contrato **nuevo**; visible/autorizado solo si N>1; GMV `status ≠ CANCELLED`; TZ America/Monterrey; tope de span F10 |
| Admin filas | US-ADMIN-11 | PATCH por `Provider.id`; flags no cruzan |
| Seed | US-SEED-01 | El Paraíso Tecnológico + coords; password `Demo1234!` |
| Explorar | US-EXPLORE-11 | Listing por Provider (ya es así); dos filas El Paraíso |

## Contratos esperados (nombres finales = Arch)

| Contrato | US | Esperado |
|----------|-----|----------|
| Sesión / me / switch | US-AUTH-11, US-HEADER-01 | Lista de providers del user + activo; 403 switch ajeno |
| Delta provider APIs | US-ISO-01 | Resuelven activo; 403 cruzado |
| Alta negocio | US-ONB-01 | Permite N+1 |
| Reportes consolidados | US-DASH-11 | Nuevo `API-*`; 403 si N=1 o no dueño |
| Admin providers | US-ADMIN-11 | N filas; flags por id |
| Seed | US-SEED-01 | Dos providers mismo `userId` |

Envelope ADR-003. Versionado `/api/v1/...` si el SAD vigente lo exige.

## NFR (Must)

- Seguridad: JWT + ownership; sin filtrar datos de sucursal B con A activa.
- Rendimiento: consolidado agrega N sucursales del **mismo** user; tope de rango F10; sin N+1 evitable.
- Sin Cloudinary/S3. Sin pasarela.

## Inputs Utilizados

- **PRD:** `outputs/laborregamarket/fase-11/prd.md`
- **Impacto:** `outputs/laborregamarket/fase-11/impacto-modulos.md`
- **User Stories:** `outputs/laborregamarket/fase-11/user-stories/`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-11/handoff-arquitecto.md`
- **Agente Downstream:** Arquitecto de Software
