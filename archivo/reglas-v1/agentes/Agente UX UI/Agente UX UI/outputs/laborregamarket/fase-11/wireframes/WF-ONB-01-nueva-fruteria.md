> **Pantalla:** `/registro/negocio` — copy Nueva frutería (sesión PROVIDER)
> **Objetivo Principal:** Dar de alta sucursal N+1 sin wizard nuevo
> **US:** US-ONB-01
> **Fecha:** 12/09/2026 · **Versión:** 0.11.0

## Inputs Utilizados

- **US:** `US-ONB-01`

---

### Success — ya hay sesión PROVIDER

```text
+-----------------------------------------------------------------------+
| [Header autenticado]                         [Volver al panel]        |
+-----------------------------------------------------------------------+
| # Nueva frutería                                                      |
| Se sumará a tu mismo usuario. Catálogo, POS y pedidos quedan aislados.|
|                                                                       |
|  Nombre comercial *     [________________]                            |
|  Dirección *            [________________]                            |
|  (resto de campos F1/F5: teléfono, colores, etc.)                     |
|                                                                       |
|  [ Crear frutería ]   ← CTA primario único, min-h-11                  |
+-----------------------------------------------------------------------+
```

### Primer alta / sin sesión

Copy F1/F5 vigente (**no** este H1). Mismo form.

---

### 4 estados

| Estado | UI |
|--------|-----|
| **Empty** | Form en blanco (o valores default F5); sin errores. |
| **Loading** | CTA disabled + spinner «Creando…». |
| **Error** | Inline por campo; o Banner 500. No se crea Provider. |
| **Success** | Redirect panel + toast «Frutería creada». |

### Mobile

Campos y CTA `w-full`. Un H1 visible sin recorte.

#### Componentes Requeridos para Frontend:
* **BusinessOnboardingClient** reusado.
* **OnboardingModeCopy:** si `session.role===PROVIDER` && N≥1 → título «Nueva frutería», CTA «Crear frutería».
* **AddStoreCta** en menú usuario / pie switcher.

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-11/wireframes/WF-ONB-01-nueva-fruteria.md`
- **Agente Downstream:** Frontend Developer
