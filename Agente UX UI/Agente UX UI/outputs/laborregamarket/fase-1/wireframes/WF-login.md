> **Pantalla:** Login (`/login`)
> **Objetivo Principal:** Autenticar usuario con email y password; redirigir según rol o param `redirect`
>
> ```text
> +-----------------------------------------------------------------------+
> | [Header público] Logo | Pill búsqueda | Registra frutería | Menú user |
> +-----------------------------------------------------------------------+
> |                                                                       |
> |                    ┌─────────────────────────────┐                    |
> |                    │  🍊 Iniciar sesión          │                    |
> |                    │                             │                    |
> |                    │  Email                      │                    |
> |                    │  [________________________] │                    |
> |                    │                             │                    |
> |                    │  Contraseña                 │                    |
> |                    │  [________________________] │                    |
> |                    │  Mínimo 8 caracteres        │                    |
> |                    │                             │                    |
> |                    │  [ ERROR INLINE AQUÍ ]      │  ← credenciales     |
> |                    │                             │                    |
> |                    │  [    Ingresar (CTA)     ]  │  ← dominante        |
> |                    │                             │                    |
> |                    │  ¿No tienes cuenta?         │                    |
> |                    │  Regístrate                 │                    |
> |                    │                             │                    |
> |                    │  --- Demo (dev/staging) --- │                    |
> |                    │  Admin | Proveedor | Cliente│                    |
> |                    └─────────────────────────────┘                    |
> |                         max-w-md centrado                             |
> +-----------------------------------------------------------------------+
> ```
>
> #### Estados de la pantalla
>
> | Estado | Comportamiento UI |
> |--------|-------------------|
> | **Default** | Formulario vacío, CTA "Ingresar" activo |
> | **Loading** | CTA texto "Ingresando...", `disabled`, inputs disabled |
> | **Error credenciales** | Banner o inline `"Credenciales inválidas"` en rojo (`text-red-600`) |
> | **Error validación** | Mensaje bajo campo: email inválido, password < 8 chars |
> | **Error red** | Banner `"Error de conexión. Intenta de nuevo."` + CTA reintento |
> | **Disabled** | Durante loading; sin doble submit |
>
> #### Componentes Requeridos para Frontend:
> * **Formulario auth:** `email` (type email), `password` (type password), labels asociados.
> * **CTA Primario:** `Ingresar` — `bg-[var(--brand)]`, ancho completo en móvil.
> * **Link secundario:** `Regístrate` → `/registro`.
> * **Demo buttons:** `type="button"`, solo visible si `NODE_ENV !== 'production'` o flag explícito.
> * **Error container:** `aria-live="polite"` para lectores de pantalla.
>
> #### Responsividad:
> * **Mobile (<=640px):** Card full-width con `px-4`, CTA `w-full`.
> * **Desktop (>=1024px):** Card centrada `max-w-md`, padding `p-8`.
