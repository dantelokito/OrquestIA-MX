# ADR-001 — Onboarding proveedor en dos pasos

> **Estado:** Aceptado  
> **Fecha:** 05/08/2026  
> **Decisores:** Arquitecto, UX/UI Designer, Product Manager

---

## Contexto

El registro con `role=PROVIDER` actualmente crea solo la entidad `User`, sin `Provider`. Esto provoca que el panel `/proveedor` falle o muestre estado roto (BL-002, BL-003).

El UX Designer especificó un wizard de onboarding en dos pasos (decisión D1) que requiere datos adicionales del negocio: nombre, dirección, coordenadas, teléfono.

## Decisión

Implementar onboarding proveedor en **dos pasos separados**:

1. **Paso 1:** `POST /api/auth/register` con `role=PROVIDER` → crea `User` + sesión JWT.
2. **Paso 2:** Wizard UI → `POST /api/providers` → crea `Provider` vinculado al `userId` autenticado.

Adicionalmente: `GET /api/provider/me` retorna 404 si no existe Provider, permitiendo a la UI mostrar EmptyState.

## Alternativas consideradas

### A) Registro atómico (User + Provider en un solo POST)

- **Pros:** Una sola transacción, menos round-trips.
- **Contras:** Rompe el wizard UX de dos pasos; formulario de registro demasiado largo; no permite guardar progreso parcial.

### B) Crear Provider vacío en paso 1 y completar en paso 2 (PATCH)

- **Pros:** Garantiza existencia de Provider desde el inicio.
- **Contras:** Datos incompletos en DB; validaciones más complejas; Provider "fantasma" sin dirección.

## Consecuencias

### Positivas

- Alineado con wireframes `WF-registro.md` paso 2 y `UF-PROVIDER-01`.
- Formulario paso 1 simple (solo datos personales).
- Validación geográfica concentrada en paso 2.
- EmptyState claro si usuario salta el wizard.

### Negativas

- Usuario PROVIDER puede existir temporalmente sin Provider.
- Requiere guard en `/proveedor` y redirect condicional post-login.

## Implementación

```
POST /api/auth/register { role: "PROVIDER" } → User
  → UI redirect wizard paso 2
POST /api/providers { businessName, address, ... } → Provider
  → UI redirect /proveedor
```

Ver: [`../api/API-PROVIDERS-01.md`](../api/API-PROVIDERS-01.md) (POST), [`../api/API-PROVIDER-01.md`](../api/API-PROVIDER-01.md) (GET /me).

## Referencias

- UX decisión D1: `OBSERVABILITY.md` (UX)
- Backlog: BL-002, BL-003
