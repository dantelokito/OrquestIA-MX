> **Pantalla:** `/admin` tab Proveedores — una fila por sucursal
> **Objetivo Principal:** Flagear El Paraíso Tecnológico sin tocar Centro
> **US:** US-ADMIN-11
> **Fecha:** 12/09/2026 · **Versión:** 0.11.0

## Inputs Utilizados

- **US:** `US-ADMIN-11`
- **Tokens:** `AdminFlagSwitch` F10; marca plataforma

---

### Success

```text
+-----------------------------------------------------------------------+
| Admin (marca plataforma)   [Catálogos] [*Proveedores*] [Bitácora]     |
+-----------------------------------------------------------------------+
| Sucursal                 Dueño                    Verif Act May Dom   |
| Frutas El Paraíso        frutas@elparaiso.mx       [x]  [x] [ ] [x]   |
| El Paraíso Tecnológico   frutas@elparaiso.mx       [ ]  [x] [ ] [ ]   |
| Campo Verde Frutería     verduras@campoverde.mx    [x]  [x] [x] [x]   |
+-----------------------------------------------------------------------+
```

Email puede repetirse. La identidad de fila es `businessName` + `Provider.id`.

### Mobile

```text
+----------------------------+
| Card: El Paraíso Tecnológico|
| Dueño: frutas@elparaiso.mx |
| [Verificado] [Activo]      |
| [Mayoreo] [A domicilio]    |
+----------------------------+
```

Switches en 2×2, cada uno ≥44px.

---

### 4 estados

| Estado | UI |
|--------|-----|
| **Empty** | «No hay sucursales registradas». |
| **Loading** | Skeleton 3 filas / 3 cards. |
| **Error** | Banner 500; switch revertido. 403/401 F10. |
| **Success** | Flags persistidos por fila. |

#### Componentes Requeridos para Frontend:
* **ProviderTableF10** extendida: columna Sucursal = `businessName`; no agrupar por user.
* **AdminFlagSwitch** sin cambios de look.

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-11/wireframes/WF-ADMIN-11-filas-sucursal.md`
- **Agente Downstream:** Frontend Developer
