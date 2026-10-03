# PRD Corto — Fase 11

> **Proyecto:** LaBorregaMarket
> **Fecha:** 12/09/2026
> **Versión:** discovery PM (visibilidad N>1)
> **Objetivo del Negocio:** Un dueño opera varias fruterías con un solo login, sin mezclar inventario, pedidos ni reportes entre sucursales, y con una vista consolidada solo cuando ya tiene más de una.
> **Público Objetivo:** Usuario `PROVIDER` con una o varias sucursales en Monterrey / área metropolitana.

> #### 1. Alcance (MVP)
> * **Incluido:**
>   * 1 usuario proveedor = N fruterías (`Provider`). Cada sucursal es un negocio **aislado** (catálogo, stock, POS, pedidos, media, reportes F10).
>   * Contexto activo (`activeProviderId`).
>   * **Módulo NUEVO** de reportes generales/globales (vista consolidada / “fruterías globales”) con la información de **todas** las sucursales a la vez. **Solo lo ve** un PROVIDER con N>1 fruterías registradas. No es un flag de admin. No es “una pestaña escondida” de Reportes F10: es un módulo de navegación distinto.
>   * Si N=1: el proveedor **mantiene** Reportes F10 por sucursal; **no** ve el módulo consolidado; **no** cambia su chrome.
>   * Banner/header: opción de **rotar/cambiar** entre fruterías **solo si N>1**. Con N=1 el banner queda como hoy (sin switcher).
>   * Alta de sucursal N+1 reusando `/registro/negocio` (copy distinto si ya hay sesión PROVIDER).
>   * Seed y login demo: El Paraíso ×2 (`Frutas El Paraíso` + **El Paraíso Tecnológico**); Campo Verde ×1; mostrar `verduras@campoverde.mx` en cuentas demo.
>   * Admin: listar y flagear **por sucursal** (mismos flags F10).
>   * Explorar: una card por `Provider` (El Paraíso aparece dos veces).
> * **Fuera de Alcance:**
>   * Catálogo o inventario compartido entre sucursales.
>   * Pagos / pasarela (`BL-040`), Cloudinary/S3, promover local→global (`US-ADMIN-04`).
>   * Reabrir F7–F10, Explorar F9, DT-F10-001/002 como Must.
>   * CSV, email de reporte, CFDI. Print del consolidado = Should.
>
> #### 2. Módulos Principales
> 1. `[AUTH/SESION]` `US-AUTH-11`: Relación User 1:N Provider; sesión con sucursal activa; IDOR entre sucursales del mismo user = 403.
> 2. `[HEADER]` `US-HEADER-01`: Switcher de frutería visible solo si N>1.
> 3. `[AISLAMIENTO]` `US-ISO-01`: Panel F10 (CAT, secciones, media, POS, pedidos, DASH sucursal) opera sobre la sucursal activa.
> 4. `[DASH GLOBAL]` `US-DASH-11`: Módulo **nuevo** de reportes de **todas** las fruterías; visible solo si N>1.
> 5. `[ONBOARDING]` `US-ONB-01`: `/registro/negocio` crea la primera **o** una sucursal adicional si ya hay sesión PROVIDER.
> 6. `[SEED]` `US-SEED-01`: Demo El Paraíso ×2 / Campo Verde ×1.
> 7. `[ADMIN]` `US-ADMIN-11`: N filas y flags F10 por sucursal.
> 8. `[EXPLORE]` `US-EXPLORE-11`: N cards en mapa/listado.

## Decisiones (Dante, 12/09)

| ID | Decisión |
|----|----------|
| D-F11-1 | Sucursales **aisladas**. El header solo cambia contexto. |
| D-F11-2 | Switcher **y** módulo de reportes globales **solo si N>1**. Campo Verde no ve ni switcher ni el módulo. Visibilidad = conteo N, no flag ADMIN. |
| D-F11-3 | Alta de sucursal = reusar `/registro/negocio`, no un wizard nuevo. |
| D-F11-4 | `frutas@elparaiso.mx` = 2 fruterías; `verduras@campoverde.mx` = 1. |
| D-F11-5 | 2ª sucursal El Paraíso: **El Paraíso Tecnológico** (nombre fijo para seed). |

## Relación con F10

F10 entregó catálogo local, secciones, media disco y reportes `from`/`to` **por un** `Provider`. F11 no cambia esas reglas: las **repite por sucursal** y añade módulo consolidado + switcher + 1:N.

## Stakeholder

Alcance MVP validado por Dante (12/09), incluido el matiz de módulo global y switcher como función de N.

## Inputs Utilizados

- Requerimientos stakeholder 12/09 (1:N, aislamiento, visibilidad N>1)
- Intro previa `fase-11/` (README, impacto, seed)
- F10 cerrada (solo lectura)

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-11/prd.md`
- **Agente Downstream:** UX/UI y Arquitecto (paralelo)
- **Handoffs:** `handoff-ux-ui.md`, `handoff-arquitecto.md`
