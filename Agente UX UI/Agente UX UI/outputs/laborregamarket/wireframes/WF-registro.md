> **Pantalla:** Registro (`/registro`) — Paso 1 Cuenta + Paso 2 Negocio (PROVIDER)
> **Objetivo Principal:** Crear cuenta CLIENT o PROVIDER; completar datos de negocio en wizard (PROVIDER)
>
> ### Paso 1 — Cuenta
>
> ```text
> +-----------------------------------------------------------------------+
> | [Header público]                                                      |
> +-----------------------------------------------------------------------+
> |                                                                       |
> |  StepIndicator:  (1) Cuenta ──── (2) Negocio                          |
> |                  [activo]         [pendiente — solo PROVIDER]         |
> |                                                                       |
> |                    ┌─────────────────────────────┐                    |
> |                    │  Crear cuenta               │                    |
> |                    │                             │                    |
> |                    │  [ Cliente ] [ Proveedor ]  │  ← toggle          |
> |                    │                             │                    |
> |                    │  Nombre completo            │                    |
> |                    │  [________________________] │                    |
> |                    │  Email                      │                    |
> |                    │  [________________________] │                    |
> |                    │  Contraseña                 │                    |
> |                    │  [________________________] │                    |
> |                    │  Mínimo 8 caracteres        │                    |
> |                    │  Teléfono (opcional)        │                    |
> |                    │  [________________________] │                    |
> |                    │                             │                    |
> |                    │  [ ERROR INLINE ]           │                    |
> |                    │                             │                    |
> |                    │  [  Crear cuenta (CTA)   ]  │                    |
> |                    │                             │                    |
> |                    │  ¿Ya tienes cuenta? Login   │                    |
> |                    └─────────────────────────────┘                    |
> +-----------------------------------------------------------------------+
> ```
>
> ### Paso 2 — Negocio (solo PROVIDER)
>
> ```text
> +-----------------------------------------------------------------------+
> |  StepIndicator:  (1) Cuenta ──── (2) Negocio                          |
> |                  [completado]     [activo]                            |
> |                                                                       |
> |                    ┌─────────────────────────────┐                    |
> |                    │  Datos de tu frutería       │                    |
> |                    │                             │                    |
> |                    │  Nombre del negocio *       │                    |
> |                    │  [________________________] │                    |
> |                    │  Dirección *                │                    |
> |                    │  [________________________] │                    |
> |                    │  Ciudad                     │                    |
> |                    │  [ Monterrey            ▼ ] │                    |
> |                    │  Teléfono del negocio       │                    |
> |                    │  [________________________] │                    |
> |                    │                             │                    |
> |                    │  ┌─────────────────────┐    │                    |
> |                    │  │   Mapa Leaflet      │    │  ← pin ubicación   |
> |                    │  │   (Monterrey)       │    │                    |
> |                    │  └─────────────────────┘    │                    |
> |                    │                             │                    |
> |                    │  [ Atrás ] [ Finalizar (CTA)]│                   |
> |                    └─────────────────────────────┘                    |
> +-----------------------------------------------------------------------+
> ```
>
> #### Estados de la pantalla
>
> | Estado | Paso | Comportamiento UI |
> |--------|------|-------------------|
> | **Default** | 1 | Toggle en Cliente; formulario vacío |
> | **Default** | 2 | Mapa centrado Monterrey; campos vacíos |
> | **Loading** | 1/2 | CTA "Creando cuenta..." / "Guardando..." disabled |
> | **Error validación** | 1/2 | Inline bajo campos (Zod) |
> | **Error email duplicado** | 1 | `"El email ya está registrado"` bajo email |
> | **Error red** | 1/2 | Banner conexión + reintento |
> | **Success CLIENT** | 1 | Redirect `/explorar` + sesión activa |
> | **Success PROVIDER** | 2 | Redirect `/proveedor` + Provider creado |
> | **Empty** | 2 | Mapa sin pin hasta usuario interactúa |
>
> #### Componentes Requeridos para Frontend:
> * **RoleToggle:** segmentado Cliente/Proveedor; preselección si `?role=provider`.
> * **StepIndicator:** 2 pasos; paso 2 oculto para CLIENT.
> * **MapPicker:** Leaflet con pin draggable; coords default centro Monterrey.
> * **CTA Primario:** "Crear cuenta" (paso 1) / "Finalizar registro" (paso 2).
> * **CTA Secundario:** "Atrás" en paso 2 → vuelve a paso 1 (datos preservados).
>
> #### Responsividad:
> * **Mobile:** Mapa altura fija 200px; botones stack vertical `w-full`.
> * **Desktop:** Mapa 300px; botones en fila, CTA derecha.
