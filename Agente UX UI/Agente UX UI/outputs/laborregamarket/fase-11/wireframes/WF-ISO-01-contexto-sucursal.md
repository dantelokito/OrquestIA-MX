> **Pantalla:** Contexto de sucursal activa en panel F10 (sin rediseñar CAT/POS/DASH)
> **Objetivo Principal:** El dueño sabe en qué frutería opera; los datos no se mezclan
> **US:** US-ISO-01
> **Rutas:** `/proveedor`, `/proveedor/pos`, `/proveedor/ordenes`, `/proveedor/dashboard`
> **Fecha:** 12/09/2026 · **Versión:** 0.11.0

## Inputs Utilizados

- **US:** `US-ISO-01`
- **WF F10 (solo lectura):** `fase-10/wireframes/WF-proveedor-catalogo-f10.md`

---

### Success — Catálogo con sucursal B activa

```text
+-----------------------------------------------------------------------+
| Header + ProviderSwitcher (solo N>1)                                  |
| SubNav: Catálogo | POS | Órdenes | Dashboard | [Reportes generales?]  |
+-----------------------------------------------------------------------+
| Eyebrow: El Paraíso Tecnológico          [colores --brand de B]       |
| # Catálogo                                                            |
| [Layout F10 intacto: secciones + locales + media disco]               |
+-----------------------------------------------------------------------+
```

N=1: eyebrow = nombre F10 habitual; resto igual.

---

### 4 estados (rehidratación al rotar)

| Estado | Comportamiento |
|--------|----------------|
| **Empty** | Superficie F10 empty de **B** (ej. «Aún no hay secciones»), nunca datos de A. |
| **Loading** | Skeleton de la página actual 200–600 ms; no mostrar filas de A. |
| **Error** | Banner 403 «Este recurso no pertenece a la frutería activa» si hay IDOR; CTA Reintentar. |
| **Success** | Listados y tokens de B. |

### Mobile

Eyebrow encima del H1, una columna; no truncar el nombre a menos de 2 líneas.

#### Componentes Requeridos para Frontend:
* **ActiveStoreEyebrow:** `text-secondary` + `businessName` `text-primary`.
* Reusar layouts F10; prohibido copiar pantallas nuevas de catálogo.

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-11/wireframes/WF-ISO-01-contexto-sucursal.md`
- **Agente Downstream:** Frontend Developer
