# Change Order — Registro de Solicitud de Cambio

> **ID:** CO-F6-001
> **Fecha:** 16/08/2026
> **Proyecto:** LaBorregaMarket
> **Solicitante:** Dante (stakeholder)

#### 1. Descripción del Cambio

Fase 6 **deja de ser** el sprint de pasarela / cobros POS nuevos / pago en línea (`BL-040`, D-F5-1 “pagos → F6+”). En su lugar F6 absorbe:

1. **Deuda crítica** documentada por DevOps (`DEV-P0-001` … `DEV-P2-011`) y el impacto QA (`IMPACTO-NO-ATENDER.md`): lockfile Redis, CI de regresión, migrate, 503 de contacto, invariante Leaflet.
2. **Reportes administrativos del proveedor:** ventas y analytics por **día / mes / año** con fecha concreta, **imprimir en navegador y descargar PDF**.

`BL-040` queda **aparcado hasta nuevo aviso** (no hay fecha F7). El cobro F3 de mostrador (ticket POS existente) **no se toca ni se amplía**.

Motivo: arrancar pagos sobre contacto 500, sin CI y sin rate-limit real es el perfil de incidente del primer entorno compartido. El dashboard F3 (hoy + 7 días, sin exportar) no cubre la operación diaria/mensual/anual del proveedor.

#### 2. Evaluación de Impacto

- [x] Arquitectura
- [x] Diseño UI/UX
- [ ] Base de datos

**Detalle del impacto:**

- **Arquitectura:** hacer ejecutable ADR-015 (`@upstash/redis` en lockfile; 503 fail-closed). Extender API-PROVIDER-DASH-01 con grano `day|month|year` + fecha. ADR de generación PDF (mecanismo a decisión del Arquitecto). Sin schema de pagos. Rutas nuevas con `requireRole` (DEV-P2-011). CI (DEV-P0-002) es DevOps.
- **Diseño UI/UX:** slice deuda ya diseñado (ContactCTA 503/500, Leaflet, fallback marca). Slice reportes: ciclo nuevo `UF-DASH-02` + WF print/PDF sobre `/proveedor/dashboard` (o subruta). No rediseñar `/admin/analytics`.
- **Base de datos:** sin migración de producto. `migrate deploy` F2→F5 en todos los entornos (operativo, no delta de schema).
- **QA:** no READY-FOR-QA de pagos. Gate F6 = P0-001 + P0-002 cerrados **y** US-DASH-04/05/06.

#### 3. Matriz de Intercambio (Trade-off)

* **Opción A:** Aumentar tiempo de entrega o presupuesto.
  - Estimación adicional: un sprint extra de pasarela + PCI/secretos de cobro **además** de cerrar P0 y reportes — incompatible con “pagos fuera hasta nuevo aviso”.
* **Opción B:** Intercambiar la nueva función por una del backlog actual de esfuerzo equivalente (*Swap*).
  - Funcionalidad a descartar/intercambiar: **pasarela de pagos in-app, cobros POS nuevos y pago en línea (`BL-040`)**, aparcados hasta nuevo aviso. El esfuerzo de F6 se destina a deuda P0/P1 + reportes DASH imprimibles.

#### 4. Decisión

**Opción seleccionada:** B
**Aprobado por:** Dante
**Fecha de aprobación:** 16/08/2026

**Efecto en decisiones previas:** D-F5-1 (pagos fuera de F5, “→ F6+”) se **sustituye**: pagos quedan fuera **hasta nuevo aviso**, no automáticos en la siguiente fase. D-F5-2 (Leaflet/OSM) se mantiene; F6 añade invariante para no reintroducir Maps JS.
