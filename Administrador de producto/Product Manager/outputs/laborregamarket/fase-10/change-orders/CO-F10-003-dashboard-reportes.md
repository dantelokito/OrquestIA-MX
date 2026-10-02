# Change Order — Registro de Solicitud de Cambio

> **ID:** CO-F10-003
> **Fecha:** 28/08/2026
> **Proyecto:** LaBorregaMarket
> **Solicitante:** Dante (stakeholder)

#### 1. Descripción del Cambio

El dashboard de ventas del **PROVIDER** (`/proveedor/dashboard`, vista Reportes) gana un corte operable:

| Capacidad | US | Nota |
|-----------|-----|------|
| Venta **por producto** (unidades, GMV, split Encargar vs POS) | US-DASH-07 | Checkboxes; ninguno marcado = todos |
| Filtro **inicio / fin** + atajo **un mes** | US-DASH-08 | El mes rellena el rango; el rango es el filtro real |
| **Imprimir** esa vista | US-DASH-09 | Mismo contenido en pantalla; CSS print |

**No** se edita `fase-6/` (`US-DASH-04…06` siguen como baseline de grano día/mes/año y print/PDF de ese corte). F10 **extiende** Reportes. Solo el propio negocio (D-F6-3). `status ≠ CANCELLED` (D-F6-8). TZ America/Monterrey.

Decisión **D-F10-9** en [`../prd.md`](../prd.md).

#### 2. Evaluación de Impacto

- [x] Arquitectura
- [x] Diseño UI/UX
- [ ] Base de datos

**Detalle del impacto:**

- **Arquitectura:** query `from`/`to` (inclusive, TZ Monterrey) + `productIds[]` opcional. Agregación por SKU (globales activados, locales `US-CAT-02`, venta rápida). Tope de rango (p. ej. 366 días). Tests 401/403/IDOR. Envelope ADR-003. Sin schema Must.
- **Diseño UI/UX:** delta pestaña Reportes: selector de un mes, date pickers inicio/fin, lista con checkbox, Imprimir. No copiar `/admin/analytics`. Resumen F3 (hoy+7d) puede seguir.
- **Base de datos:** sin migración Must (órdenes existentes).
- **QA:** rango inválido; empty; print sin chrome de app; otro PROVIDER 403.

#### 3. Matriz de Intercambio (Trade-off)

* **Opción A:** Reabrir `fase-6/` y reescribir `US-DASH-04…06`.
* **Opción B:** Delta F10 (`CO-F10-003`); `fase-6/` solo lectura. Swap: no CSV, no email, no varios meses a la vez, PDF del nuevo corte = Should.

#### 4. Decisión

**Opción seleccionada:** B  
**Aprobado por:** Dante (28/08/2026)  
**Fecha de aprobación:** 28/08/2026

**Efecto en decisiones previas:** El Won't F10 «no reabrir DASH» se **sustituye** solo en el sentido de este delta en `fase-10/`. Docs F6 **intactos**. Redis/CI F6, `BL-040`, ADMIN viendo otro proveedor **siguen** Won't. PDF F6 (`US-DASH-06`) no se reabre; PDF de este corte = Should.
