> **Pantalla:** `/login` — fila demo Campo Verde
> **Objetivo Principal:** Entrar a N=1 y N=2 sin seed manual en localhost
> **US:** US-SEED-01
> **Fecha:** 12/09/2026 · **Versión:** 0.11.0

## Inputs Utilizados

- **Seed PM:** `fase-11/seed-demo.md`
- **US:** `US-SEED-01`, higiene `US-SEC-03`

---

### Success — no producción

```text
+-----------------------------------------------------------------------+
| # Ingresar                                                            |
| [ email ] [ password ] [ Ingresar ]                                   |
+-----------------------------------------------------------------------+
| Cuentas demo (localhost)                                              |
|  admin@laborregamarket.mx          Administrador                      |
|  frutas@elparaiso.mx               Proveedor · 2 fruterías            |
|  verduras@campoverde.mx            Proveedor · 1 frutería             |
|  cliente@demo.mx                   Cliente                            |
| Password de todas: Demo1234!                                          |
+-----------------------------------------------------------------------+
```

### Production

El bloque **no se renderiza**. Form de login solo.

---

### 4 estados

| Estado | UI |
|--------|-----|
| **Empty** | No aplica al bloque; form vacío es el empty del login. |
| **Loading** | Fila clicada en `aria-busy`; botón Ingresar spinner. |
| **Error** | Inline login existente (401). Bloque sigue visible en no-prod. |
| **Success** | Redirect por rol; El Paraíso ve switcher; Campo Verde no. |

#### Componentes Requeridos para Frontend:
* **DemoAccountsBlock:** cuarta fila Must `verduras@campoverde.mx`.
* Filas `min-h-11`; unmount si `production`.

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-11/wireframes/WF-SEED-01-login-demo.md`
- **Agente Downstream:** Frontend Developer
