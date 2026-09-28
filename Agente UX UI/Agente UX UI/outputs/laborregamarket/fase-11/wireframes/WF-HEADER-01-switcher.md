> **Pantalla:** Header PROVIDER — `ProviderSwitcher` (N>1) vs chrome F10 (N=1)
> **Objetivo Principal:** Rotar sucursal activa solo cuando el user tiene más de una frutería
> **US:** US-HEADER-01
> **Rutas:** todas `/proveedor*`
> **Fecha:** 12/09/2026 · **Versión:** 0.11.0

## Inputs Utilizados

- **PRD:** `Administrador de producto/Product Manager/outputs/laborregamarket/fase-11/prd.md`
- **US:** `US-HEADER-01`
- **Tokens:** `outputs/laborregamarket/comun/design-tokens.md`

---

### Variante A — N=1 (Campo Verde) · Success

Chrome **idéntico a F10**. Sin combobox, sin chevron de sucursales.

```text
+-----------------------------------------------------------------------+
| [Logo plataforma]          [SubNav: Catálogo POS Órdenes Dashboard]   |
| Campo Verde Frutería                              [Avatar Ana Ruiz ▾] |
+-----------------------------------------------------------------------+
```

### Variante B — N>1 (El Paraíso) · Success

```text
+-----------------------------------------------------------------------+
| [Logo]   [ProviderSwitcher ≥44px]   [SubNav + Reportes generales]     |
|          Frutas El Paraíso ▾                    [Avatar Carlos ▾]     |
+-----------------------------------------------------------------------+
| ProviderSwitcher ABIERTO (listbox)                                    |
|  ✓ Frutas El Paraíso          Centro                                  |
|    El Paraíso Tecnológico     Tecnológico                             |
|  ───────────────────────────────────                                  |
|    + Agregar frutería  → /registro/negocio                            |
+-----------------------------------------------------------------------+
```

### Mobile `<640px` (N>1)

```text
+---------------------------+
| Logo   [Switcher w-full]  |
|        Frutas El Paraíso ▾|
| [☰ SubNav drawer]  Avatar |
+---------------------------+
```

Switcher usable a ancho completo; hit area ≥44px.

---

### 4 estados del switcher (N>1)

| Estado | Comportamiento |
|--------|----------------|
| **Empty** | Nunca: si N>1 hay ≥2 nombres. Si la lista tarda, ver Loading. |
| **Loading** | Trigger visible con nombre previo o skeleton 120×44; `aria-busy`. No abrir listbox vacío. **Post-login (BUG-017):** si el árbol persistió N=0 desde `/login`, el chrome **rehidrata** al entrar a `/proveedor` o al evento de sesión; no pintar Success N=1/N=0 hasta tener `providerCount` de la sesión autenticada. |
| **Error** | Trigger permanece; toast/banner «No se pudo cambiar de frutería»; activa anterior. |
| **Success** | Nombre + tokens de la elegida; check en la activa. |

N=1 no tiene estos estados de control (el control no existe). N=1 **intacto** tras el mismo flujo de login (sin switcher, sin 5º tab). N>1 **no** depende de recarga manual.

---

### a11y y micro-interacciones

- Rol `combobox` + `listbox`; `aria-expanded`; `aria-label="Frutería activa"`.
- Focus ring 2px `var(--brand)`. Hover fila: `surface-secondary`.
- Disabled: no aplica al trigger salvo durante POST de cambio.
- Contraste nombre sobre `surface-primary` ≥ 4.5:1 (`text-primary`).
- CTA dominante del header al rotar: la opción de la lista (no un segundo botón Guardar).

#### Componentes Requeridos para Frontend:
* **ProviderSwitcher:** visible solo si `providers.length > 1`.
* **ProviderSwitcherItem:** nombre + colonia; check Lucide `Check`.
* **AddStoreLink:** secondary text en el pie del listbox.
* **Responsive:** trigger `min-h-11`; móvil `w-full` bajo el logo.

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-11/wireframes/WF-HEADER-01-switcher.md`
- **Agente Downstream:** Frontend Developer
