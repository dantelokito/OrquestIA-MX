# Variables de Entorno: {nombre-proyecto}

> Documento generado para handoff a **DevOps**.  
> Copiar a `.env` en entorno local; en producción usar gestor de secretos del proveedor cloud.

---

## Tabla de variables

| Variable | Requerida | Descripción | Ejemplo |
|----------|-----------|-------------|---------|
| `NODE_ENV` | Sí | Entorno de ejecución | `development` |
| `PORT` | Sí | Puerto del servidor HTTP | `3000` |
| `DATABASE_URL` | Sí | Connection string de la BD | `postgresql://user:pass@localhost:5432/dbname` |
| `JWT_SECRET` | Sí | Secreto para firmar tokens JWT | `[generar con openssl rand -base64 32]` |
| `JWT_EXPIRES_IN` | No | Expiración del access token | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | No | Expiración del refresh token | `7d` |
| `CORS_ORIGIN` | No | Orígenes permitidos (comma-separated) | `http://localhost:5173` |
| `RATE_LIMIT_WINDOW_MS` | No | Ventana de rate limiting en ms | `900000` |
| `RATE_LIMIT_MAX` | No | Máximo de requests por ventana | `100` |
| `[CUSTOM_VAR]` | [Sí/No] | [Descripción específica del módulo] | `[ejemplo]` |

---

## Archivo `.env.example`

Genera siempre un `.env.example` en la raíz del proyecto con todas las variables requeridas y valores placeholder (sin secretos reales):

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=change-me-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

---

## Notas de seguridad

- Nunca commitear archivos `.env` con valores reales.
- Rotar `JWT_SECRET` y credenciales de BD al desplegar a producción.
- Usar variables distintas por entorno (`development`, `staging`, `production`).
