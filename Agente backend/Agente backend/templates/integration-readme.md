# {nombre-proyecto} — Backend

> Stack: `{stack-tecnico}`  
> Generado por el Agente Desarrollador Backend Senior.

---

## Prerrequisitos

- [Node.js >= 18 / Python >= 3.11 / Go >= 1.21] *(según stack)*
- [PostgreSQL >= 14 / MongoDB >= 6] *(según BD del contrato)*
- [Package manager: npm / pnpm / pip / go mod]

---

## Instalación

```bash
# Clonar o ubicarse en outputs/{nombre-proyecto}/
cd outputs/{nombre-proyecto}

# Instalar dependencias
[npm install]

# Configurar variables de entorno
cp .env.example .env
# Editar .env con valores locales
```

---

## Base de datos

```bash
# Ejecutar migraciones
[npx prisma migrate dev]
# o: [npm run migrate]

# Ejecutar seeds (opcional)
[npx prisma db seed]
# o: [npm run seed]
```

---

## Desarrollo

```bash
# Iniciar servidor en modo desarrollo
[npm run dev]

# Servidor disponible en:
# http://localhost:{PORT}/api/v1
```

---

## Pruebas

```bash
# Ejecutar todos los tests
[npm test]

# Solo unit tests
[npm test -- tests/unit]

# Solo integration tests
[npm test -- tests/integration]
```

---

## Estructura del proyecto

```text
outputs/{nombre-proyecto}/
├── src/
│   ├── config/
│   ├── modules/
│   │   └── [modulo]/
│   │       ├── dto/
│   │       ├── controller.ts
│   │       ├── service.ts
│   │       ├── repository.ts
│   │       └── routes.ts
│   ├── middlewares/
│   ├── utils/
│   ├── app.ts
│   └── server.ts
├── tests/
│   ├── unit/
│   └── integration/
├── prisma/ o migrations/
├── .env.example
├── module-handoffs/
└── integration-readme.md
```

---

## API

Base path: `/api/v1`

Consulta los contratos del Arquitecto (`API-{Module}-*`) y los handoffs por módulo en `module-handoffs/MOD-*-handoff.md`.

### Formato de respuesta

**Éxito (200/201):**

```json
{
  "success": true,
  "data": { "..." },
  "message": "Operación realizada con éxito",
  "meta": { "page": 1, "limit": 10, "total": 50 }
}
```

**Error (4xx/5xx):**

```json
{
  "success": false,
  "error": {
    "code": "BAD_REQUEST",
    "message": "Mensaje legible del error",
    "details": [{ "field": "email", "issue": "..." }]
  },
  "timestamp": "2026-08-04T15:00:00.000Z"
}
```

---

## Variables de entorno

Ver documento completo en la raíz del proyecto o generado desde [templates/env-requirements.md](../../templates/env-requirements.md).

---

## Handoffs por módulo

| Módulo | Archivo | Estado |
|--------|---------|--------|
| `{Module}` | `module-handoffs/MOD-{Module}-handoff.md` | [ ] Completo |
