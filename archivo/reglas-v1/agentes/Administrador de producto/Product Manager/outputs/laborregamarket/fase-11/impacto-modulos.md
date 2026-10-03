# Impacto por módulo — Fase 11

> **Fecha:** 12/09/2026  
> **Código hoy:** `C:\Users\PC GAMER\LaBorregaMarket`  
> **Hecho de modelo:** `Provider.userId` es `@unique` → 1 User = 1 frutería. F11 exige 1 User = N `Provider`.

Este documento es el mapa de impacto para Arquitecto, UX, Backend y Frontend. No sustituye ADRs ni contratos.

## Auth / sesión

| Hoy | F11 |
|-----|-----|
| `User.provider` relación 1:1 | `User.providers` 1:N; quitar unique en `userId` |
| APIs `/api/provider/*` resuelven “el” Provider por usuario | Resolver el **activo** (`activeProviderId` en cookie/sesión) y validar que pertenezca al user |
| `createProvider` en `/registro/negocio` falla o pisa si ya hay negocio | Permite sucursal N+1 con sesión PROVIDER; primer negocio sigue igual para alta nueva |

Riesgo: olvidar el filtro de ownership → un dueño lee/escribe la otra sucursal (IDOR). Tests 403 Must (`US-AUTH-11`, `US-ISO-01`).

## Header / chrome proveedor

| Hoy | F11 |
|-----|-----|
| Marca y nombre de un solo `Provider` | Selector de sucursal **visible solo si N>1** (`US-HEADER-01`) |
| Colores F5 (`primaryColor` / `secondaryColor`) de ese negocio | Al cambiar sucursal, rehidratar tokens CSS y título |

Campo Verde (N=1): **sin** selector; banner **igual que F10**. El Paraíso (N=2): selector obligatorio, persistir última sucursal usada. Visibilidad = conteo N, no flag ADMIN.

## Catálogo, secciones, SKU local, media disco (F10)

Siguen las reglas F10 **por `providerId` activo** (`US-ISO-01`):

- SKU local (`scope=LOCAL`) no sale en otras sucursales ni en Explorar comparable.
- `ProviderSection` y `ProviderProduct` no se comparten.
- Uploads disco (`UPLOADS_DIR`) ligados al `Provider` activo. IDOR 403 si el id no es de la sucursal activa.

No reabrir Cloudinary (`CO-F10-002`).

## POS y Encargar

Pedidos (`Order.providerId`) ya son por frutería. F11: el POS y el inventario de Encargar usan **solo** la sucursal activa. Un cliente en `/fruteria/[id]` pide a **esa** sucursal (Explorar muestra dos cards de El Paraíso).

## Reportes F10 (por sucursal) vs módulo global (nuevo)

| Superficie | Quién la ve | Comportamiento |
|------------|-------------|----------------|
| Reportes F10 (`from`/`to`, productos, print) | Todos los PROVIDER, sucursal activa | Sin cambio de reglas F10 salvo el `providerId` activo |
| **Módulo nuevo** de reportes generales/globales (`US-DASH-11`) | **Solo N>1** | Vista consolidada de **todas** las sucursales del user. Entrada de nav **propia** (no un tab oculto dentro de F10 que “aparezca” como el mismo módulo). Print consolidado = Should |

Campo Verde **no** ve el módulo. No CSV, no CFDI, no ADMIN viendo DASH ajeno (Won't F10 intacto). 403 si se llama el API consolidado con N=1.

## `/registro/negocio`

Reusar el formulario actual (`BusinessOnboardingClient` + `createProvider`):

- Sin sesión / primer negocio: flujo actual.
- Con sesión PROVIDER y ya hay ≥1 sucursal: mismo form = **alta de sucursal**. Copy UX: “Nueva frutería”, no “Crea tu cuenta”.
- Arquitecto: el unique `userId` es el bloqueo; no hace falta un wizard distinto.

## Admin (`US-ADMIN-11`)

Hoy una fila por proveedor-usuario. F11: **una fila por sucursal**. Flags `isVerified`, `isActive`, mayoreo, domicilio **por sucursal**. Verificar El Paraíso Centro no verifica El Paraíso Tecnológico.

## Explorar / ficha pública

Una card y una ruta `/fruteria/[id]` por `Provider`. El Paraíso ×2 = dos pines / dos fichas. Filtros F9 (mayoreo, domicilio, radio) aplican por sucursal, no por dueño.

## Login demo

`DemoAccountsBlock` hoy: admin, `frutas@elparaiso.mx`, `cliente@demo.mx`.  
Must: añadir `verduras@campoverde.mx` → Proveedor (1 frutería). Password `Demo1234!`. Ocultar el bloque en `production` (F10 `US-SEC-03` intacto).

## QA / DevOps

- Fixtures: user El Paraíso con 2 providers; Campo Verde con 1.
- IDOR entre sucursales del mismo email = casos Must.
- Módulo consolidado: ausente si N=1; presente si N>1.
- Volumen `UPLOADS_DIR` (pedido Arch F10) sigue siendo DevOps; no es P0 de F11.

## Fuera de impacto F11

Pagos, Explorar chrome F9, Maps JS, Redis/CI F6, DT-F10-001/002 como Must, `US-ADMIN-04`.

## Inputs Utilizados

- **PRD:** `outputs/laborregamarket/fase-11/prd.md`
- **Código (solo lectura):** `C:\Users\PC GAMER\LaBorregaMarket`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-11/impacto-modulos.md`
- **Agente Downstream:** Arquitecto, UX/UI
