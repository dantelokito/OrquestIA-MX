> **Pantalla:** Header global — variantes público y autenticado
> **Objetivo Principal:** Navegación transversal, búsqueda, acceso auth y menú por rol
>
> ### Variante A — Header público (sin sesión)
>
> ```text
> +-----------------------------------------------------------------------+
> | 🍊 LaBorregaMarket | [Fruterías en tu zona | Hoy | ¿Qué buscas? 🔍]   |
> |                    |              Registra tu frutería  🌐  [≡ 👤]   |
> +-----------------------------------------------------------------------+
> | [Search expanded — opcional]                                          |
> |  [ Buscar fruterías, frutas, verduras...        ] [ Buscar ]          |
> +-----------------------------------------------------------------------+
> ```
>
> ### Variante B — Header autenticado (menú abierto)
>
> ```text
> +-----------------------------------------------------------------------+
> | 🍊 LaBorregaMarket | [ Pill búsqueda ]           [ Avatar Carlos ▼ ]  |
> +-----------------------------------------------------------------------+
> |                                              ┌──────────────────┐     |
> |                                              │ Carlos M.        │     |
> |                                              │ Proveedor        │     |
> |                                              │ ───────────────  │     |
> |                                              │ Mi panel         │     |
> |                                              │ Explorar         │     |
> |                                              │ Cerrar sesión    │     |
> |                                              └──────────────────┘     |
> +-----------------------------------------------------------------------+
> ```
>
> ### Variante C — Menú por rol
>
> | Rol | Items menú dropdown |
> |-----|---------------------|
> | **CLIENT** | Mi cuenta, Explorar, Cerrar sesión |
> | **PROVIDER** | Mi panel (`/proveedor`), Explorar, Cerrar sesión |
> | **ADMIN** | Panel admin (`/admin`), Explorar, Cerrar sesión |
>
> #### Estados de la pantalla
>
> | Estado | Comportamiento UI |
> |--------|-------------------|
> | **Default público** | Menú usuario → `/login`; búsqueda colapsada |
> | **Search expanded** | Input + botón Buscar; `autoFocus` en input |
> | **Default autenticado** | Avatar + nombre truncado; sin login/registro |
> | **Menu open** | Dropdown con items rol; click fuera cierra |
> | **Loading logout** | "Cerrar sesión" con spinner breve |
> | **Mobile** | Logo emoji only; búsqueda en segunda fila o modal |
>
> #### Comportamiento búsqueda (BL-012):
> - Submit búsqueda → navega a `/explorar?q={termino}`.
> - En MVP: no autocompletado; redirect simple.
>
> #### Componentes Requeridos para Frontend:
> * **Navbar:** `sticky top-0 z-50`, altura `h-[80px]`, `bg-white border-b`.
> * **SearchPill:** `rounded-full`, expandible con animación.
> * **UserMenu:** dropdown accesible; `Escape` cierra; trap focus opcional.
> * **Avatar:** iniciales o icono User; badge rol en subtítulo menú.
> * **Logout:** `POST /api/auth/logout` → redirect `/`.
>
> #### Responsividad:
> * **Mobile (<=640px):** Logo texto oculto (`hidden sm:block`); "Registra frutería" oculto.
> * **Desktop (>=1024px):** Layout completo con pill búsqueda centrada `max-w-[480px]`.
>
> #### Accesibilidad:
> * `aria-expanded` en botón menú y pill búsqueda.
> * Navegación teclado: Tab entre items; Enter activa.
> * `aria-label="Menú de usuario"` en trigger avatar.
