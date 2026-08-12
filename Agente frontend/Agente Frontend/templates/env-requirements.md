# Variables de Entorno: {nombre-proyecto}

> Documento generado para handoff a **DevOps**.  
> Copiar a `.env` en entorno local; en producción usar gestor de secretos del proveedor cloud.

---

## Tabla de variables

| Variable | Requerida | Descripción | Ejemplo |
|----------|-----------|-------------|---------|
| `VITE_API_URL` | Sí (Vite) | URL base del backend API | `http://localhost:3000/api/v1` |
| `NEXT_PUBLIC_API_URL` | Sí (Next.js) | URL base del backend API | `http://localhost:3000/api/v1` |
| `VITE_APP_NAME` | No | Nombre de la aplicación | `Tienda Online` |
| `NEXT_PUBLIC_APP_NAME` | No | Nombre de la aplicación | `Tienda Online` |
| `VITE_AUTH_TOKEN_KEY` | No | Clave localStorage para access token | `access_token` |
| `VITE_REFRESH_TOKEN_KEY` | No | Clave localStorage para refresh token | `refresh_token` |
| `[CUSTOM_VAR]` | [Sí/No] | [Descripción específica del feature] | `[ejemplo]` |

> **Nota:** Usa el prefijo que corresponda al bundler/framework declarado en el prompt de activación (`VITE_` para Vite, `NEXT_PUBLIC_` para Next.js, etc.).

---

## Archivo `.env.example`

Genera siempre un `.env.example` en la raíz del proyecto con todas las variables requeridas y valores placeholder (sin secretos reales):

```env
# Vite
VITE_API_URL=http://localhost:3000/api/v1
VITE_APP_NAME=Mi Aplicacion
VITE_AUTH_TOKEN_KEY=access_token
VITE_REFRESH_TOKEN_KEY=refresh_token

# Next.js (usar solo si aplica)
# NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
# NEXT_PUBLIC_APP_NAME=Mi Aplicacion
```

---

## Notas de seguridad

- Nunca commitear archivos `.env` con valores reales.
- No almacenar tokens JWT en variables de entorno del cliente; usar localStorage/sessionStorage con claves configurables.
- Usar variables distintas por entorno (`development`, `staging`, `production`).
- La URL del API en producción debe apuntar al dominio HTTPS del backend desplegado.
