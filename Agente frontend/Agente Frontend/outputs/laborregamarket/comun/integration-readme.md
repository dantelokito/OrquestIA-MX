# Integration README — LaBorregaMarket Frontend

## Código fuente

La UI vive en el monolito Next.js:

`C:\Users\PC GAMER\LaBorregaMarket`

**Índice de lectura:** [README.md](./README.md) + [STATUS.md](./STATUS.md)

## Stack

- Next.js 15 / React 19 / TypeScript / Tailwind 4
- Zod (validación server + mensajes client)
- Leaflet + OSM (`leaflet` / `react-leaflet`) — explorar, detalle, onboarding
- Nominatim (geocode cliente, sin Places; viewbox México ADR-028)
- Media disco local (`GET /api/media/{file}`; `UPLOADS_DIR` en servidor). Cloudinary **no** es Must F10
- Resend (NOTIFY email)
- WebSerial/WebHID (báscula POS, cliente only)

## Comandos

```bash
cd "C:\Users\PC GAMER\LaBorregaMarket"
npm install
npm run dev
```

Build: `npm run build`  
Tests: `npm test`  
Seed DB: `npm run db:seed`

## Variables de entorno

Ver [`.env.example`](./.env.example). Copiar a la raíz de `LaBorregaMarket`.

- `NEXT_PUBLIC_OSM_TILE_URL` — opcional. Vacío = `tile.openstreetmap.org`.
- **No** se exige `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` para Explorar.
- `RESEND_API_KEY` / `EMAIL_FROM` — email de contacto F2 y nuevo pedido F3
- `UPLOADS_DIR` — directorio de media disco (default `./uploads`). F10 Must. `CLOUDINARY_*` ya no es Must.
- F10 no agrega variables `NEXT_PUBLIC_*`.

## Flujos a verificar (Fase 13)

1. **Admin Productos:** GLOBAL+LOCAL, filtros, paginación 50/100, Inhabilitar/Reactivar, sin DELETE.
2. **Catálogo:** Editar GLOBAL y LOCAL; Eliminar oculta; bandeja Restaurar; inactivo sigue en lista.
3. **Drawer:** unidad CAJA + factor; GLOBAL no muta maestro.
4. **Descarte:** modal si on-hand ≠ 0; Encargar 409 con Ir a Órdenes (no al ocultar).
5. **Precio:** «precio de tu frutería» + historial.
6. **Reportes:** tab Inventario sucursal (saldos+entradas+print); generales N>1 solo actuales.
7. **Cliente:** sin pantallas nuevas; 409 carrito/POS «El producto ya no está disponible».

## Rutas UI F13

| Ruta | Uso |
|------|-----|
| `/admin` | Catálogo completo F13 |
| `/proveedor` | Catálogo + bandeja + drawer unidad |
| `/proveedor/dashboard?view=reportes` | Tabs Ventas / Inventario |
| `/proveedor/reportes-generales` | Inventario actual N>1 |

## Flujos a verificar (Fase 12)


1. **SubNav:** Inventario → Catálogo → POS → Órdenes → Ventas (`/proveedor/dashboard` intacta). Reportes generales solo N>1.
2. **Inventario:** `/proveedor/inventario` 4 estados; entrada en unidad de catálogo; ficha tope/umbral/alerta/factor; barra >100% con texto; chip Encargar.
3. **CAT:** miniatura 48px siempre; barra compacta; toggle «Mostrar fotos en el POS» en `/proveedor` (no en POS).
4. **POS:** cards con/sin imagen según flag; cobro sin candado por stock.
5. **Frutería:** sin barra de existencias.

## Rutas UI F12

| Ruta | Uso |
|------|-----|
| `/proveedor/inventario` | Listado existencias sucursal activa |
| `/proveedor` | Catálogo + thumbs + barra + PosImagesToggle |
| `/proveedor/pos` | Cards imagen condicional; sin lock stock |
| `/proveedor/dashboard` | Ventas (label SubNav; ruta F11) |

## Flujos a verificar (Fase 11)

1. **Switcher:** `frutas@elparaiso.mx` (N>1) ve combobox; `verduras@campoverde.mx` (N=1) no.
2. **Reportes generales:** tab y ruta `/proveedor/reportes-generales` solo N>1; N=1 conserva `/proveedor/dashboard?view=reportes`.
3. **Alta sucursal:** `/registro/negocio` con sesión PROVIDER → «Nueva frutería».
4. **Login demo:** fila Campo Verde solo no-prod.
5. **Admin:** una fila por sucursal (mismo email dos veces es válido).
6. **Explorar:** dos cards El Paraíso si el listing no colapsa (chrome F9).

## Flujos a verificar (Fase 10)

1. **Catálogo proveedor:** Nueva sección; Agregar producto local (sección requerida, foto disco, badge Solo este negocio); globales F1 Activo/Inactivo.
2. **Detalle `/fruteria/[id]`:** listado agrupado por sección; Encargar; POS del mismo dueño ve SKUs locales activos.
3. **Admin Catálogos:** alta/edición GLOBAL + imagen disco; Inhabilitar; 409 slug.
4. **Admin Proveedores:** Verificado, Activo, Mayoreo, A domicilio; revocar verify copy Google.
5. **Login:** DemoAccountsBlock ausente en production.
6. **Reportes:** mes atajo; from/to; checkboxes; print sin chrome; sin GrainSelector/PDF.
7. F9/F8/F7 intactos: Explorar chips, Leaflet, pan ≠ radio.

## Rutas UI F11

| Ruta | Uso |
|------|-----|
| `/proveedor*` | Header switcher si N>1 |
| `/proveedor/reportes-generales` | Consolidado Must (solo N>1) |
| `/registro/negocio` | Alta N+1 / primer negocio |
| `/login` | Demo Campo Verde (no prod) |
| `/admin` | Filas por sucursal |
| `/explorar` | Chrome F9 |

## Rutas UI F10

| Ruta | Uso |
|------|-----|
| `/proveedor` | Catálogo local + secciones + media disco |
| `/fruteria/[id]` | Detalle agrupado por sección |
| `/admin` | Catálogos CRUD + Proveedores flags |
| `/login` | DemoAccountsBlock solo no-prod |
| `/proveedor/dashboard?view=reportes` | Rango from/to + print F10 |
| `/explorar` | Chrome F9 (solo lectura) |

## Flujos a verificar (Fase 14)

1. **Perfil:** `/proveedor/perfil` último en SubNav; un GET me; identidad ya no está en Catálogo.
2. **Catálogo:** activar GLOBAL sin precio abre diálogo; nunca $50 inventado; 409 sección fuera del form Nueva sección.
3. **POS:** toggle «Mostrar fotos» PATCH `posShowImages`.
4. **Inventario:** merma (motivo enum + nota), ajuste conteo ≥ 0, pestaña Movimientos sin copy de ventas.
5. **Ventas:** `UnifiedProviderChart` tendencia/mix/top; PDF `from`/`to`; sin grain.
6. **Reportes generales N>1:** pinta series/products/bySource + filtro; N=1 sigue 403 redirect.

## Rutas UI F14

| Ruta | Uso |
|------|-----|
| `/proveedor/perfil` | Identidad, Google, datos, horarios, capacidades |
| `/proveedor` | Catálogo solo productos |
| `/proveedor/pos` | Toggle fotos |
| `/proveedor/inventario?tab=movimientos` | ENTRADA/MERMA/AJUSTE |
| `/proveedor/dashboard` | Charts unificados + PDF from/to |
| `/proveedor/reportes-generales` | Series globales (N>1) |

## Downstream

- **UX:** `fase-10/quality/QR-FE.md`
- **QA:** solo tras `READY-FOR-QA.md`
- **DevOps:** volumen persistente + `UPLOADS_DIR`. Cloudinary deja de ser Must.
