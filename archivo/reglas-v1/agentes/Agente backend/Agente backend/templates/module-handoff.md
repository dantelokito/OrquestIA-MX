# Handoff de Módulo: MOD-{Module}

> **Proyecto:** `{nombre-proyecto}`  
> **Módulo:** `{Module}` (ej. AUTH, USERS, ORDERS)  
> **Stack:** `{stack-tecnico}`  
> **Fecha:** `{YYYY-MM-DD}`  
> **Contrato de referencia:** `API-{Module}-*`, `DB-{Entity}`

---

## 1. Endpoints implementados

| Método | Ruta | Auth | Contrato API | Estado |
|--------|------|------|--------------|--------|
| `[GET/POST/...]` | `/api/v1/[recurso]` | [Sí/No] | `API-{Module}-01` | [ ] OK |

---

## 2. Validación (DTOs)

- [ ] `req.body` validado con schema antes del controlador
- [ ] `req.params` validado (IDs, slugs, etc.)
- [ ] `req.query` validado (paginación, filtros)

**Schemas implementados:**

| DTO | Archivo | Campos validados |
|-----|---------|------------------|
| `[CreateXDto]` | `src/modules/[modulo]/dto/` | `[campo_1, campo_2]` |

---

## 3. Base de datos y migraciones

- [ ] Modelo/schema de BD alineado con `DB-{Entity}`
- [ ] Migración aplicable y reversible
- [ ] Seeds incluidos (si aplica)

**Archivos:**

| Tipo | Ruta |
|------|------|
| Migración | `[prisma/migrations/... o migrations/...]` |
| Seed | `[ruta seed]` |

---

## 4. Seguridad (RBAC)

- [ ] Rutas protegidas con middleware JWT
- [ ] Roles/permisos validados según contrato del Arquitecto
- [ ] Passwords hasheados con Argon2 o bcrypt (si aplica)

**Rutas protegidas:**

| Ruta | Roles permitidos |
|------|------------------|
| `/api/v1/[recurso]` | `[admin, user]` |

---

## 5. Pruebas

### Unit tests (`service.ts`)

- [ ] Casos de éxito cubiertos
- [ ] Casos de error de negocio cubiertos
- [ ] Repository mockeado

**Comando:** `[npm test -- tests/unit/[modulo].service.test.ts]`

### Integration tests (endpoints HTTP)

- [ ] Códigos HTTP verificados (200, 201, 400, 401, 403, 404, 500)
- [ ] Payload JSON de respuesta válido según contrato
- [ ] BD de prueba / in-memory configurada

**Comando:** `[npm test -- tests/integration/[modulo].routes.test.ts]`

---

## 6. Definition of Done (DoD Backend)

- [ ] **Validación Completa**
- [ ] **Manejo de Errores Robust**
- [ ] **Seguridad de Datos** (secrets en `.env`)
- [ ] **Seguridad de Endpoints** (auth/RBAC)
- [ ] **Eficiencia en Consultas** (sin N+1, paginación en listados)
- [ ] **Pruebas Superadas**

---

## 7. Notas para downstream

### Frontend

- Base URL: `[http://localhost:PORT/api/v1]`
- Endpoints y JSON: ver contratos `API-{Module}-*`

### QA

- Casos límite adicionales: `[describir]`
- Datos de prueba: `[seeds o fixtures]`

### DevOps

- Variables requeridas: ver [env-requirements.md](env-requirements.md) del proyecto
- Comandos de despliegue: ver [integration-readme.md](../integration-readme.md)
