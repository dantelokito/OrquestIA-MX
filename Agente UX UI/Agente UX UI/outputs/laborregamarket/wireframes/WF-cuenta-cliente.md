> **Pantalla:** Cuenta cliente (`/cuenta`)
> **Objetivo Principal:** Ver y editar datos básicos del perfil; placeholder pedidos Fase 2
>
> ```text
> +-----------------------------------------------------------------------+
> | [Header autenticado CLIENT]                                           |
> +-----------------------------------------------------------------------+
> |  Mi cuenta                                                            |
> |                                                                       |
> |  ┌─────────────────────────────────────────────────────────────┐     |
> |  │  Perfil                                                      │     |
> |  │                                                              │     |
> |  │  Nombre completo                                             │     |
> |  │  [ María García________________________ ]                    │     |
> |  │                                                              │     |
> |  │  Email (solo lectura)                                        │     |
> |  │  [ cliente@demo.mx_____________________ ]  🔒               │     |
> |  │                                                              │     |
> |  │  Teléfono                                                    │     |
> |  │  [ 81 9876 5432________________________ ]                    │     |
> |  │                                                              │     |
> |  │  [ ✓ Cambios guardados ]  ← mensaje éxito inline             │     |
> |  │                                                              │     |
> |  │  [ Guardar cambios (CTA) ]                                   │     |
> |  └─────────────────────────────────────────────────────────────┘     |
> |                                                                       |
> |  ┌─────────────────────────────────────────────────────────────┐     |
> |  │  Mis pedidos                                    Fase 2 🔜   │     |
> |  │                                                              │     |
> |  │  📦 Próximamente podrás ver tu historial de pedidos         │     |
> |  │     y dar seguimiento a tus compras.                        │     |
> |  └─────────────────────────────────────────────────────────────┘     |
> +-----------------------------------------------------------------------+
> ```
>
> #### Estados de la pantalla
>
> | Estado | Comportamiento UI |
> |--------|-------------------|
> | **Loading** | Skeleton 3 campos + botón |
> | **Success (carga)** | Formulario con datos de sesión/API |
> | **Success (guardado)** | Banner verde "Cambios guardados" 3s |
> | **Error validación** | Inline bajo campo (teléfono inválido) |
> | **Error API** | Banner rojo "No se pudieron guardar los cambios" |
> | **Empty pedidos** | Card placeholder Fase 2 (siempre en MVP) |
> | **Error sesión** | Redirect `/login?redirect=/cuenta` (middleware) |
>
> #### Componentes Requeridos para Frontend:
> * **ProfileForm:** nombre editable, email readonly, teléfono editable.
> * **CTA Primario:** "Guardar cambios" — deshabilitado si sin cambios (`dirty` check).
> * **OrdersPlaceholder:** card informativa; sin tabla pedidos en MVP.
> * **ProtectedRoute:** solo CLIENT; middleware existente.
>
> #### Responsividad:
> * **Mobile:** Cards full-width `px-4`; CTA `w-full`.
> * **Desktop:** Contenedor `max-w-2xl mx-auto py-8`.
>
> #### API esperada (Backend):
> * `GET /api/users/me` — datos perfil (o desde sesión JWT).
> * `PATCH /api/users/me` — actualizar nombre, teléfono.
