# Handoff Frontend — LaBorregaMarket Backend Fase 11

> **De:** Backend Developer  
> **Para:** Frontend Developer  
> **Fecha:** 12/09/2026  
> **Proyecto:** laborregamarket  
> **Fase:** 11

## Estado: LISTO PARA INTEGRAR — Must F11 (sesión 1:N + aislamiento + DASH global)

Base URL local: `http://localhost:8080`  
Envelope: éxito `{ data }` / error habitual `{ error, details? }`. El reporte global N≤1 usa `{ error: { code, message }, timestamp }`.  
Cookies: `credentials: 'include'`. JWT = `lbm_token`. Sucursal activa = `lbm_active_provider` (httpOnly, Path=/, SameSite=Lax; Secure solo en producción). El JWT **no** lleva sucursal. Ignorar `X-Active-Provider-Id`.

Migración Prisma: `prisma/migrations/20260912160000_drop_provider_userid_unique`. Tras pull: `npx prisma migrate deploy` (o `dev`) y `npx prisma db seed`.

## Inputs Utilizados

- **Handoff Arch:** `Agente Arquitecto de Software/Agente Arquitecto/outputs/laborregamarket/fase-11/handoff-backend-fase-11.md`
- **Contratos:** `API-AUTH-11`, `API-PROVIDER-ISO-01`, `API-PROVIDER-ONB-01`, `API-PROVIDER-REPORTS-03`, `API-ADMIN-PROVIDERS-02`, `API-EXPLORE-11`, `API-SEED-11`, `DB-providers`
- **ADRs:** ADR-034, ADR-035, ADR-003, ADR-025

---

## Endpoints nuevos o con delta

| Método | Ruta | Auth | Qué cambió |
|--------|------|------|------------|
| GET | `/api/auth/session` | Pública | `providerCount`, `activeProviderId`, `providers[]` (ordenado `createdAt ASC`). Cookie activa se **corrige** si es ajena (200, no 403). `brand` = sucursal activa. |
| GET | `/api/provider/mine` | PROVIDER | Lista para switcher: `id`, `businessName`, `address`, `isActive` |
| POST | `/api/provider/active` | PROVIDER | Body `{ "providerId" }` (cuid, `.strict()`). 403 si id ajeno o inexistente (no 404). Set-Cookie activo. |
| POST | `/api/providers` | PROVIDER | Alta N+1 (ya no 409 “ya tienes negocio”). 201 incluye `userId` y `activeProviderId`. Cookie = sucursal **nueva**. |
| GET | `/api/provider/reports/global` | PROVIDER N>1 | Query Must: `from` + `to` (YYYY-MM-DD). `productIds` opcional. N≤1 → **403** `GLOBAL_REPORTS_NOT_AVAILABLE`. |
| GET | `/api/provider/reports` | PROVIDER | Igual F10, filtrado por **activo** |
| GET/PATCH | `/api/provider/me` y resto `/api/provider/*` | PROVIDER | Resuelven sucursal por cookie. Recurso de otra sucursal del mismo user → **403** |
| GET | `/api/admin/providers` | ADMIN + PROVIDERS/view | Una fila por `Provider`. Añade `userId` y `ownerEmail` (además de `userEmail`) |
| GET | `/api/providers` | Pública | Sin colapsar por dueño: dos cards El Paraíso |

Excepciones de `resolveActiveProvider`: `GET /api/provider/mine`, `POST /api/provider/active`, `GET /api/provider/reports/global`.

---

## Shapes

### GET `/api/auth/session` PROVIDER

```json
{
  "data": {
    "authenticated": true,
    "role": "PROVIDER",
    "brand": { "primaryColor": "#2D6A4F", "secondaryColor": "#F4A261", "source": "provider" },
    "providerCount": 2,
    "activeProviderId": "clx...",
    "providers": [
      { "id": "clx...", "businessName": "Frutas El Paraíso", "primaryColor": "#2D6A4F", "secondaryColor": "#F4A261" }
    ]
  }
}
```

CLIENT/ADMIN/invitado: `providers: []`, `providerCount: 0`, `activeProviderId: null`, `brand: null`.

### GET `/api/provider/reports/global` 403 (N=1)

```json
{
  "error": { "code": "GLOBAL_REPORTS_NOT_AVAILABLE", "message": "El reporte global solo está disponible con más de una sucursal" },
  "timestamp": "2026-09-12T22:00:00.000Z"
}
```

200: `scope: "allOwnedProviders"`, `byProvider[]` (todas las sucursales, ceros si no vendieron), `products[]` con `providerId`.

---

## Seed demo (`Demo1234!`)

| Email | N | Sucursales |
|-------|---|------------|
| `frutas@elparaiso.mx` | 2 | Frutas El Paraíso (Constitución 1200) + El Paraíso Tecnológico (Garza Sada 2501) |
| `verduras@campoverde.mx` | 1 | Campo Verde Frutería — global **403** |
| `admin@laborregamarket.mx` | 0 | Sin cambio |
| `cliente@demo.mx` | 0 | Sin cambio |

Explorar: dos pines / dos `/fruteria/[id]` para El Paraíso. Pedido público usa el `providerId` de la ficha, no la cookie del dueño.

---

## Pendientes FE (fuera de este handoff)

- Switcher UI (handoff UX)
- Copy “Nueva frutería” en `/registro/negocio` si `providerCount >= 1`
- Print consolidado Should
- `DemoAccountsBlock` Campo Verde

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-11/handoff-frontend.md`
- **Agente Downstream:** Frontend Developer
- **Módulos:** `fase-11/module-handoffs/MOD-AUTH-handoff.md`, `MOD-DASH-handoff.md`
