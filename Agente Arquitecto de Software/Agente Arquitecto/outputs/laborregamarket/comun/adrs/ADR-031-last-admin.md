# ADR-031 — Integridad del último ADMIN y sin auto-escalada

> **Estado:** Aceptado  
> **Fecha:** 2026-08-28  
> **Decisores:** Arquitecto de Software  
> **Fase:** 10 — v0.10.2  
> **US:** US-SEC-02  
> **CO:** CO-F10-001

---

#### 1. Contexto y Problema:

Debe existir **siempre** ≥ 1 usuario `role=ADMIN` y `isActive=true`. F10 **no** abre CRUD de usuarios (Won't), pero cualquier mutación futura o seed/script que degrade el único ADMIN dejaría la plataforma sin operador. Tampoco puede un CLIENT/PROVIDER auto-escalarse a ADMIN por API.

---

#### 2. Opciones Consideradas:

* **Opción A — Helper de dominio `assertNotLastAdmin` + 409; sin ruta de usuarios en F10:** Pros: invariante testeable; no inventa CRUD. Contras: el AC de “intento degradar” se cubre con unit tests del helper hasta que exista write de usuarios.
* **Opción B — Abrir `PATCH /api/admin/users/[id]` en F10 solo para el guard:** Pros: el AC HTTP es directo. Contras: D-F10-4 / Won't CRUD usuarios.
* **Opción C — Confiar en que nadie toca `User.role`:** Pros: cero código. Contras: seed, Prisma Studio y un PATCH accidental rompen el invariante.

---

#### 3. Decisión Elegida:

**Opción A.**

### Invariante

```
count(User WHERE role=ADMIN AND isActive=true) >= 1
```

Antes de persistir un cambio que ponga `role≠ADMIN` o `isActive=false` sobre un ADMIN, contar cuántos ADMIN activos **quedarían**. Si el resultado es 0 → **409** `{ "error": "Debe existir al menos un administrador activo" }` (`details.field` = `role` o `isActive`). Sin mutación.

### Auto-escalada

Ninguna ruta F10 (ni existente) acepta que `session.role` CLIENT o PROVIDER escriba `User.role=ADMIN` sobre sí mismo u otro. Si apareciera un body con `role`, ignorarlo o **403**. Seed local puede crear ADMIN; producción no expone esa vía.

### AUDIT

Escrituras F10 (productos, secciones, flags provider, media) dejan `AuditLog` con `module`, `action` (`CREATE`/`UPDATE`/`DISABLE`/`MEDIA_UPLOAD`), `entityId`, `userId` del actor. **Prohibido** persistir password o hash en `details`.

### Código sugerido

`src/lib/auth/assert-not-last-admin.ts` — usado por cualquier servicio que toque `User.role` / `User.isActive` de un ADMIN. Tests unitarios Must aunque no haya ruta HTTP de usuarios en F10.

### Qué NO hacer

- UI matriz `RolePermission`.
- Impersonation.
- 2FA.
- Devolver 200 silencioso al degradar el único ADMIN.

---

#### 4. Consecuencias e Impacto:

* **Positivas:** La plataforma no puede quedarse sin operador; el guard queda listo para un futuro CRUD de usuarios.
* **Riesgos / Compensaciones:** El AC HTTP de US-SEC-02 sobre “degradar mi rol” no tiene endpoint Must F10; QA cubre el helper y, si Prisma Studio se usa en local, el invariante es de aplicación no de trigger DB (Could: CHECK/trigger — fuera de Must).

## Referencias

- US-SEC-02, D-F10-1
- Contrato: [`../../fase-10/api/API-ADMIN-SEC-01.md`](../../fase-10/api/API-ADMIN-SEC-01.md)
- RBAC base: [`../../fase-1/data-model/DB-audit-permissions.md`](../../fase-1/data-model/DB-audit-permissions.md)
