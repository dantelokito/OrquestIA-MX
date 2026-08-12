# Handoff UX/UI — LaBorregaMarket AUTH

> **De:** Agente Product Manager  
> **Para:** @UX/UI Designer  
> **Fecha:** 05/08/2026  
> **Versión producto:** 0.1.0  
> **Prioridad:** Flujos de autenticación (módulo AUTH)

---

## Objetivo del handoff

Diseñar flujos de usuario, wireframes y especificaciones de estados para login, registro, logout y navegación autenticada — alineados con las historias US-AUTH-01 a US-AUTH-07 y el PRD en `prd.md`.

**Convención de salida UX:** `Agente UX UI/outputs/laborregamarket/user-flows/` y `wireframes/`.

---

## Inputs de referencia

| Documento | Ubicación |
|-----------|-----------|
| PRD | `Administrador de producto/Product Manager/outputs/laborregamarket/prd.md` |
| User stories AUTH | `outputs/laborregamarket/user-stories/US-AUTH-*.md` |
| Visión producto | `LaBorregaMarket/PRODUCT.md` |
| UI actual login | `LaBorregaMarket/src/app/login/page.tsx` |
| UI actual registro | `LaBorregaMarket/src/app/registro/page.tsx` |
| Header actual | `LaBorregaMarket/src/components/layout/Header.tsx` |

---

## Personas y cuentas demo

| Persona | Rol | Email | Password | Destino post-login |
|---------|-----|-------|----------|-------------------|
| María | CLIENT | `cliente@demo.mx` | `Demo1234!` | `/` o `?redirect=` |
| Carlos | PROVIDER | `frutas@elparaiso.mx` | `Demo1234!` | `/proveedor` |
| Admin | ADMIN | `admin@laborregamarket.mx` | `Demo1234!` | `/admin` |

---

## Flujos prioritarios

### UF-AUTH-01 — Login

> **Historia asociada:** US-AUTH-01, US-AUTH-02, US-AUTH-06  
> **Punto de entrada:** Header "Menú usuario" → `/login`, o redirect desde middleware

**Pasos del usuario:**

1. `[Pantalla: cualquier página]` → Usuario hace clic en icono usuario del Header → navega a `/login`.
2. `[Pantalla: /login]` → Usuario ingresa email y password → clic "Ingresar".
3. `[Condicional]` → ¿Credenciales válidas?
   - **Sí (ADMIN):** → `[Pantalla: /admin]`
   - **Sí (PROVIDER):** → `[Pantalla: /proveedor]`
   - **Sí (CLIENT):** → `[Pantalla: redirect param o /]`
   - **No:** → `[Pantalla: /login]` → mensaje inline rojo `"Credenciales inválidas"` o mensaje Zod.
4. `[Estado Loading]` → Botón muestra "Ingresando..." y está disabled durante la petición.
5. `[Estado Error red]` → Mensaje `"Error de conexión"`.

**Atajos demo (existentes en UI):** botones para rellenar cuentas demo en la página login.

---

### UF-AUTH-02 — Registro

> **Historia asociada:** US-AUTH-03, US-AUTH-04  
> **Punto de entrada:** `/registro`, Header "Registra tu frutería" → `/registro?role=provider`

**Pasos del usuario:**

1. `[Pantalla: /registro]` → Usuario selecciona tipo: **Cliente** o **Proveedor** (toggle).
2. `[Formulario]` → Nombre, email, password, teléfono (opcional).
3. `[Condicional]` → ¿Datos válidos y email único?
   - **Sí (CLIENT):** → `[Pantalla: /explorar]` sesión activa.
   - **Sí (PROVIDER — actual):** → `[Pantalla: /proveedor]` — **gap:** sin `Provider` creado.
   - **Sí (PROVIDER — objetivo):** → `[Pantalla: wizard onboarding negocio]` → paso 2 datos negocio → `[Pantalla: /proveedor]`.
   - **No (email duplicado):** → error `"El email ya está registrado"`.
   - **No (validación):** → mensajes Zod inline.

**Wizard onboarding proveedor (diseñar):**

| Paso | Campos | Validación |
|------|--------|------------|
| 1 — Cuenta | nombre, email, password, teléfono | password min 8 |
| 2 — Negocio | nombre negocio, dirección, ciudad, tel negocio, mapa/coords | dirección requerida; coords en Monterrey |

---

### UF-AUTH-03 — Sesión expirada / acceso no autorizado

> **Historia asociada:** US-AUTH-07  
> **Punto de entrada:** Usuario sin cookie intenta `/proveedor`, `/admin` o `/cuenta`

**Pasos:**

1. `[Pantalla: /proveedor sin sesión]` → Middleware redirige a `/login?redirect=/proveedor`.
2. `[Pantalla: /login]` → Usuario inicia sesión.
3. `[Condicional]` → ¿Rol coincide con ruta destino?
   - **Sí:** → destino original.
   - **No:** → `/` (home) — evitar acceso cruzado de roles.

---

### UF-AUTH-04 — Logout

> **Historia asociada:** US-AUTH-05  
> **Punto de entrada:** Header menú usuario autenticado (a diseñar)

**Pasos:**

1. `[Header autenticado]` → Usuario abre menú → clic "Cerrar sesión".
2. `[API POST /api/auth/logout]` → cookie eliminada.
3. `[Pantalla: /]` → usuario en estado público; Header muestra login/registro.

---

## Pantallas a wireframear

| Pantalla | Objetivo principal | Estados obligatorios |
|----------|-------------------|---------------------|
| `/login` | Autenticar usuario | Default, Loading, Error (credenciales), Error (validación), Error (red), Disabled |
| `/registro` | Crear cuenta CLIENT o PROVIDER | Default, Loading, Error, Success redirect |
| `/registro` paso 2 proveedor | Crear negocio (wizard) | Empty, Loading, Error, Success |
| `Header` público | Navegación + CTA login/registro | Default, Search expanded |
| `Header` autenticado | Nombre, rol, logout, nav por rol | Default, Menu open |

---

## Especificaciones UX (DoD)

- [ ] **Legibilidad y contraste:** WCAG AA (ratio 4.5:1 texto normal).
- [ ] **Jerarquía visual:** un CTA dominante por pantalla ("Ingresar", "Crear cuenta").
- [ ] **Feedback interacción:** estados `hover`, `focus`, `active`, `disabled` en botones y campos.
- [ ] **Manejo errores:** mensajes inline en formularios; no solo toast genérico.
- [ ] **Responsividad:** mobile-first `<= 640px`; desktop `>= 1024px`.
- [ ] **Accesibilidad:** labels asociados a inputs; navegación por teclado en formularios.

---

## Gaps de producto a reflejar en diseño

1. **Header sin sesión siempre** — diseñar variante autenticada con logout (BL-007).
2. **Proveedor sin onboarding** — wizard paso 2 evita panel vacío (BL-002).
3. **Cuentas demo en login** — mantener o mover a entorno dev-only en diseño final.
4. **Password min 6 vs 8** — UI puede mostrar "mínimo 8 caracteres" unificado (BL-009).

---

## Mapa de navegación AUTH (referencia)

```
                    ┌─────────┐
                    │  Home   │
                    └────┬────┘
           ┌─────────────┼─────────────┐
           ▼             ▼             ▼
      ┌────────┐   ┌──────────┐  ┌──────────┐
      │ /login │   │/registro │  │/explorar │
      └───┬────┘   └────┬─────┘  └──────────┘
          │             │
    ┌─────┼─────┐       │
    ▼     ▼     ▼       ▼
 /admin /proveedor /   /explorar (CLIENT)
         │      cuenta (CLIENT)
         ▼
   wizard negocio (PROVIDER nuevo)
```

---

## Entregables esperados del UX/UI Designer

1. `UF-AUTH-01-login.md` — flujo login completo.
2. `UF-AUTH-02-registro.md` — flujo registro + wizard proveedor.
3. `UF-AUTH-03-sesion-expirada.md` — redirect y protección rutas.
4. `UF-AUTH-04-logout.md` — flujo cerrar sesión.
5. `WF-login.md`, `WF-registro.md`, `WF-header-auth.md` — wireframes.
6. `design-tokens.md` — tokens base (brand ya usa `--brand` CSS).

---

## Confirmación PM

- Historias US-AUTH-01 a US-AUTH-07 cubren casos principales y errores comunes del módulo AUTH.
- Alcance MVP documentado; decisiones de negocio #1–#5 en PRODUCT.md pendientes de validación stakeholder.
- **Listo para que UX/UI Designer inicie flujos y wireframes.**

---

*Handoff generado por Agente Product Manager — LaBorregaMarket v0.1.0*
