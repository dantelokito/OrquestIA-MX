> **Flujo:** [Nombre del flujo, ej. Registro e Inicio de Sesión]
> **Historia de Usuario Asociada:** [ID de la US, ej. US-AUTH-01]
>
> **Pasos del Usuario:**
> 1. `[Pantalla A: Landing Page]` -> El usuario hace clic en el botón "Registrarse".
> 2. `[Pantalla B: Formulario]` -> El usuario ingresa Email y Password.
> 3. `[Condicional]` -> ¿Datos válidos?
>    - **Sí:** `[Pantalla C: Dashboard]` -> Muestra mensaje de bienvenida.
>    - **No:** `[Pantalla B]` -> Muestra alerta inline con el error en rojo.
