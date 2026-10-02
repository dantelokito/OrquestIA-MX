> **Flujo:** Cerrar sesión
> **Historia de Usuario Asociada:** US-AUTH-05
>
> **Punto de entrada:** Header menú usuario autenticado → opción "Cerrar sesión"
>
> **Pasos del Usuario:**
> 1. `[Header autenticado]` → Usuario hace clic en avatar/menú → despliega dropdown.
> 2. `[Menú abierto]` → Usuario hace clic en "Cerrar sesión".
> 3. `[Estado Loading]` → Item menú muestra spinner breve o disabled (opcional).
> 4. `[API POST /api/auth/logout]` → cookie JWT eliminada; evento LOGOUT en bitácora AUDIT.
> 5. `[Pantalla: /]` → usuario en estado público.
> 6. `[Header público]` → muestra login/registro; sin nombre de usuario ni opciones de rol.
>
> **Comportamiento esperado:**
> - No requiere confirmación modal en MVP (acción reversible con nuevo login).
> - Tras logout, rutas protegidas redirigen a login si se intenta acceder directamente.
> - Focus vuelve al botón menú usuario tras cerrar dropdown (accesibilidad).
