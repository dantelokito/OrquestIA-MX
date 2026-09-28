# DB-providers — Escritura de datos de negocio (Fase 14)

> **Entidad:** `Provider` (`providers`)  
> **Fecha:** 2026-09-17  
> **Fase:** 14  
> **US:** US-PROF-03  
> **ADR:** ADR-039

## Inputs Utilizados

- Prisma `main` @ `0eda84c` modelo `Provider`
- `fase-12/data-model/DB-providers.md` (solo lectura, `posShowImages`)

---

> **Entidad:** `Provider`

**Sin columnas nuevas.** F14 habilita **escritura** PROVIDER de campos que ya existen (hoy solo onboarding + GET):

| Campo | Tipo de Dato | Restricción | Descripción |
| :--- | :--- | :--- | :--- |
| `businessName` | VARCHAR | NOT NULL | Nombre comercial. PATCH me F14. |
| `address` | VARCHAR | NOT NULL | Dirección. PATCH me F14. |
| `city` | VARCHAR | NOT NULL, default Monterrey | Ciudad. PATCH me F14. |
| `phone` | VARCHAR | NOT NULL | Teléfono. PATCH me no envía null. |
| `description` | TEXT? | NULL | Descripción. PATCH me F14. |
| `latitude` | Float | NOT NULL | Pin. Validación AMM en API, no CHECK SQL Must. |
| `longitude` | Float | NOT NULL | Pin AMM. |
| `isVerified` | Boolean | NOT NULL, default false | **Solo ADMIN.** PATCH PROVIDER no lo toca. |
| `verifiedAt` | DateTime? | NULL | Idem. |
| `posShowImages` | Boolean | NOT NULL, default true | Intacta F12. |

Índices existentes (`userId`, `city`, `businessName`, `isActive+isVerified`) bastan. Sin índice geo nuevo Must (Explorar sigue Haversine F4).

## Relaciones

Sin cambio. 1 `User` : N `Provider` (ADR-034).

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/data-model/DB-providers.md`
- **Agente Downstream:** Backend Developer
