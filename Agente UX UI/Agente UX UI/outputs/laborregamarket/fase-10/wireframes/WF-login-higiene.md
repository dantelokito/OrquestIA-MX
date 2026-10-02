> **Pantalla:** Login / registro — higiene de cuentas demo (`US-SEC-03`)
> **Objetivo Principal:** Cero credenciales seed en UI de producción
> **Base:** [`../../fase-1/wireframes/WF-login.md`](../../fase-1/wireframes/WF-login.md), [`../../fase-7/wireframes/WF-login-sesion.md`](../../fase-7/wireframes/WF-login-sesion.md) — **solo lectura**. No rediseñar card, CTA Ingresar ni SessionPersistBanner.

### Desarrollo (demo permitido)

```text
+-----------------------------------------------------------------------+
|                    ┌─────────────────────────────┐                    |
|                    │  Iniciar sesión             │                    |
|                    │  Email / Contraseña         │                    |
|                    │  [    Ingresar     ]        │                    |
|                    │  ¿No tienes cuenta?         │                    |
|                    │  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │                    |
|                    │  Atajos demo (dev)          │  ← solo si         |
|                    │  [Admin] [Proveedor] [Cliente]│    no production │
|                    └─────────────────────────────┘                    |
+-----------------------------------------------------------------------+
```

### Producción (`NODE_ENV=production` o flag Arch)

```text
+-----------------------------------------------------------------------+
|                    ┌─────────────────────────────┐                    |
|                    │  Iniciar sesión             │                    |
|                    │  Email / Contraseña         │                    |
|                    │  [    Ingresar     ]        │                    |
|                    │  ¿No tienes cuenta?         │                    |
|                    └─────────────────────────────┘                    |
|  (sin bloque demo; sin emails/passwords seed en el DOM)               |
+-----------------------------------------------------------------------+
```

Misma regla en `/registro` si existiera copy de cuentas de prueba.

### 401 / 403 en superficies F10

Reutilizar **ErrorBanner** F1–F3. No pantalla nueva de permisos.

| Código | Copy UI |
|--------|---------|
| 401 | Redirect `/login?redirect=…` o banner «Inicia sesión para continuar» |
| 403 módulo admin | «Sin permiso para este módulo» |
| 403 negocio ajeno | «Esta vista es solo para tu negocio» |

#### Estados

| Estado | UI |
|--------|----|
| **production** | `DemoAccountsBlock` **no montado** |
| **development** | Bloque F1 opcional, intacto |
| **Session persist F7** | Banner F7 intacto (ambos entornos) |

#### Componentes requeridos para Frontend

- **DemoAccountsBlock:** render condicional `process.env.NODE_ENV !== 'production'` (o flag Arch).
- Card login F1 + SessionPersistBanner F7 sin cambios de layout.

#### Accesibilidad

- Ingresar sigue siendo el único primary. Atajos demo, si visibles, son secondary.

#### API esperada

- Ninguna para ocultar el bloque. Criterio: `API-ADMIN-SEC-01` higiene prod.

#### Referencias

- `UF-SEC-03-higiene-demo.md`
