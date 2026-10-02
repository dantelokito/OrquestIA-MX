> **Flujo:** Área de cuenta cliente
> **Historia de Usuario Asociada:** — (BL-006; persona María CLIENT)
>
> **Punto de entrada:** Header autenticado CLIENT → "Mi cuenta" → `/cuenta`
>
> **Pasos del Usuario:**
> 1. `[Middleware]` → Sin sesión CLIENT → redirect `/login?redirect=/cuenta`.
> 2. `[Pantalla: /cuenta]` → Usuario ve sección perfil: nombre, email, teléfono.
> 3. `[Edición]` → Usuario modifica nombre o teléfono → clic "Guardar cambios".
> 4. `[Condicional]` → ¿Guardado exitoso?
>    - **Sí:** → mensaje éxito inline verde "Cambios guardados".
>    - **No:** → error inline bajo campo o banner error.
> 5. `[Sección pedidos]` → Placeholder Fase 2: "Próximamente podrás ver tu historial de pedidos".
>
> **Condicionales:**
> - **Loading inicial:** → Skeleton formulario.
> - **Error sesión:** → redirect login (manejado por middleware).
> - **Empty pedidos:** → Card informativa con ilustración + texto Fase 2.
>
> **Reglas UI:**
> - CTA dominante: "Guardar cambios".
> - Email: solo lectura (cambio email fuera de alcance MVP).
> - Ruta protegida: solo rol CLIENT.
