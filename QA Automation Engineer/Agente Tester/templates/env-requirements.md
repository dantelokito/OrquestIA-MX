# Variables de Entorno QA: {nombre-proyecto}

> Documento generado para handoff a **DevOps** y configuración del ambiente de pruebas.  
> Copiar a `.env.test` o `.env.qa` en el entorno de staging/QA.

---

## Tabla de variables

| Variable | Requerida | Descripción | Ejemplo |
|----------|-----------|-------------|---------|
| `QA_BASE_URL` | Sí | URL base del backend en staging | `https://api-staging.example.com` |
| `QA_FRONTEND_URL` | Sí | URL base del frontend en staging | `https://staging.example.com` |
| `QA_API_PREFIX` | No | Prefijo de rutas API | `/api/v1` |
| `QA_USER_EMAIL` | Sí | Usuario de prueba (rol estándar) | `qa-user@example.com` |
| `QA_USER_PASSWORD` | Sí | Contraseña del usuario de prueba | `[valor en gestor de secretos]` |
| `QA_ADMIN_EMAIL` | No | Usuario admin para pruebas RBAC | `qa-admin@example.com` |
| `QA_ADMIN_PASSWORD` | No | Contraseña del admin de prueba | `[valor en gestor de secretos]` |
| `QA_API_TOKEN` | No | Token pre-generado para tests API | `[Bearer token]` |
| `QA_DB_SEED` | No | Script o comando para datos de prueba | `npm run seed:qa` |
| `PLAYWRIGHT_BASE_URL` | Sí | URL base para tests E2E Playwright | `https://staging.example.com` |
| `PLAYWRIGHT_HEADLESS` | No | Ejecución headless en CI | `true` |
| `PLAYWRIGHT_TIMEOUT_MS` | No | Timeout global de tests | `30000` |

---

## Archivo `.env.test.example`

Genera siempre un `.env.test.example` en la raíz del proyecto con variables placeholder (sin secretos reales):

```env
QA_BASE_URL=https://api-staging.example.com
QA_FRONTEND_URL=https://staging.example.com
QA_API_PREFIX=/api/v1
QA_USER_EMAIL=qa-user@example.com
QA_USER_PASSWORD=change-me
QA_ADMIN_EMAIL=qa-admin@example.com
QA_ADMIN_PASSWORD=change-me
PLAYWRIGHT_BASE_URL=https://staging.example.com
PLAYWRIGHT_HEADLESS=true
PLAYWRIGHT_TIMEOUT_MS=30000
```

---

## Comandos CI/CD

```bash
# Instalar Playwright
npm ci
npx playwright install --with-deps

# Ejecutar suite completa
npx playwright test --reporter=html

# Solo API
npx playwright test tests/api/

# Solo E2E
npx playwright test tests/e2e/
```

---

## Notas de seguridad

- Nunca commitear archivos `.env.test` con credenciales reales.
- Usar gestor de secretos del CI (GitHub Secrets, Azure Key Vault, etc.) para credenciales de staging.
- Rotar credenciales de prueba periódicamente; no reutilizar credenciales de producción.

---

## Datos de prueba (seeds / fixtures)

| Entidad | Descripción | Origen |
|---------|-------------|--------|
| `[Usuario estándar]` | Rol `[user]` para happy path | `[seed script / fixture]` |
| `[Usuario admin]` | Rol `[admin]` para pruebas RBAC | `[seed script / fixture]` |
| `[Datos de módulo]` | [Descripción] | `[MOD-*-handoff.md sección QA]` |
