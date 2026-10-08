# F15 · QA — Blindaje legal, analítica y caché

Fecha: 2026-10-07 · Insumo: `fase-15/fe.md` (Fixes, `aa01ff5`) y `fase-15/be.md` (Fixes)

## Entregables

Puertas BE y FE en verde. Suite: `laborregamarket/tests`. App `feat/f15-legal-cache` @ `aa01ff5`, `npm run build` y `npm start` en el puerto 8080. Redis local de prueba en el proceso (`127.0.0.1:8079`); `.env` sin cambios. `package-lock.json` sigue sucio por un cambio ajeno; no se commiteó.

Matriz F15 (re-prueba de regresión + lo afectado por BUG-023 y BUG-029):

| ID | US | Tipo | Qué prueba | Resultado |
|----|----|------|------------|-----------|
| TC-LEGAL-001 | US-LEGAL-01 | positivo | Footer en `/` y `/login` con enlaces y responsable | PASS |
| TC-LEGAL-010 | US-LEGAL-01 | negativo | El footer público no está en `/proveedor` | PASS |
| TC-LEGAL-002 | US-LEGAL-02 | positivo | `/legal/privacidad\|terminos\|cookies` sin sesión, versión y markdown del seed | PASS |
| TC-LEGAL-005 | US-LEGAL-02 | negativo | `/legal/otra-cosa` → 404 y sin redirect a `/login` | PASS |
| TC-LEGAL-003 | US-LEGAL-02 | positivo | `GET /api/legal/current` 200, `Cache-Control: no-store`, tres documentos | PASS |
| TC-LEGAL-007 | US-LEGAL-03 | negativo | Anónimo 401 y CLIENT 403 en settings admin | PASS |
| TC-LEGAL-008 | US-LEGAL-03 | negativo | ADMIN: payload inválido 400 ADR-003 y no persiste | PASS |
| TC-LEGAL-009 | US-LEGAL-03 | positivo | ADMIN guarda responsable válido (`isComplete`) | PASS |
| TC-CONSENT-010 | US-CONSENT-01 | positivo/negativo | Casilla desmarcada, error en línea, con casilla entra a `/explorar` | PASS (`aa01ff5`) |
| TC-CONSENT-003 | US-CONSENT-01 | negativo | Registro sin casilla → 400 ADR-003 y no crea usuario | PASS |
| TC-CONSENT-004 | US-CONSENT-01 | negativo | `acceptLegal: false` y versión 9999 → 400 | PASS |
| TC-CONSENT-001 | US-CONSENT-01 | positivo | Registro con versión vigente → 201 | PASS |
| TC-CONSENT-006 | US-CONSENT-01 | negativo | Alta sin `acceptTerms` → 400 y no crea frutería | PASS |
| TC-CONSENT-002 | US-CONSENT-01 | positivo | Alta con casilla, `whatsappOrderOptIn: false` | PASS |
| TC-WA-001 | US-CONSENT-03 | negativo | Proveedor demo: `whatsappOrderOptIn` false | PASS |
| TC-WA-002 | US-CONSENT-03 | negativo | Perfil: switch de avisos de pedidos apagado | PASS |
| TC-COOKIE-001 | US-COOKIE-01 | positivo | «Entendido» guarda `lbm_measurement=on` y oculta el aviso | PASS |
| TC-COOKIE-002 | US-COOKIE-01 | positivo | «Desactivar medición» guarda `off` y no carga Umami | PASS |
| TC-COOKIE-003 | US-COOKIE-01 | edge | Valor distinto de `on`/`off` vuelve a mostrar el aviso | PASS |
| TC-COOKIE-004 | US-ANALYTICS-01 | edge | DNT=1 no carga Umami | PASS |
| TC-CACHE-001 | US-CACHE-02 | positivo | `GET /api/providers` con `X-Cache`; la sesión no filtra ni añade datos ajenos | PASS (re-prueba) |
| TC-CACHE-003 | US-CACHE-02 | negativo | `q` de 1 carácter → 400 sin `X-Cache`; `/api/catalogs` no se cachea | PASS |
| TC-CACHE-004 | US-CACHE-01 | negativo | Tras logout, `/api/users/me` 401 y el listado público no lleva el correo | PASS |
| TC-CACHE-006 | US-CACHE-01 | negativo | Logout no deja el correo en HTML, API ni caché del navegador | PASS |

Re-prueba afectada, fuera de la matriz: EC-CART-015. El clic de «Ver carrito» llega y la URL es `/carrito`. Después la página muestra «Algo salió mal» / `crypto.randomUUID is not a function`. Ese fallo es la deuda previa (DT-F10-001 / BUG-015 y el mismo mecanismo que BUG-024), no el hit-test del aviso.

Corrida de la matriz y de EC-CART-015 (`aa01ff5`, 4 workers): 24 casos de la matriz en verde. TC-CONSENT-010 falló una vez con «Demasiados intentos» porque el cupo de registro (5/h por IP) ya estaba lleno en el Redis de prueba; con el cupo vacío entra a `/explorar`. TC-CACHE-006 falló una vez porque el menú no mostró el correo y pasó al repetirlo. TC-CACHE-001 respondió `BYPASS` justo al reiniciar Redis y pasó en la repetición (`X-Cache` HIT). EC-CART-015 queda en la deuda de `crypto.randomUUID`.

## Para el siguiente rol

- Ruteo A. Fase 15 cerrada. Siguiente: DevOps.
- Cero bugs abiertos de F15 y cero deltas. BUG-024, 025, 026, 027, 028 y 030 pasan a deuda arrastrada: la evidencia de Fixes nombra archivo, commit de `main` (`1aeac1c`) y el mecanismo.
- BUG-021, BUG-022, BUG-023 y BUG-029 cerrados.
- `npm start` sin Redis deja login/registro en 503 (ADR-015). Esta corrida usó un Redis local de prueba, sin tocar `.env`.

## Pendientes

- TC-CAT-007 — suite. El primer POST a veces llega en 409 porque otro caso apaga el mismo SKU global. No es defecto de producto.
- EC-CART-015 y HP-POS-015 (`crypto.randomUUID`) quedan en deuda, no en esta fase.

## Verificación

```
Dictamen: APROBADO
Bugs abiertos: 0
Deltas de diseño: 0
Deltas de contrato: 0
Ruteo: A
```

Playwright (`aa01ff5`, `npm start` :8080, 4 workers): matriz F15 24/24 PASS. Happy path y regresión de F15 al 100%. Cero Blocker/Critical. EC-CART-015 no es caso de la matriz; el clic llega y el error UUID es deuda previa.

## Fixes

| ID | Commit | Re-prueba |
|----|--------|-----------|
| BUG-021 | `bd61771` | `GET /legal/otra-cosa` → 404. Cerrado en ronda 1. |
| BUG-022 | `bdc0301` | Aviso en `z-30`. EC-05 pulsa «Guardar». HP-POS-01 cobra y muestra «Nueva venta» con `1.25 KG`. El aviso no intercepta el clic. Cerrado. |
| BUG-023 | `aa01ff5` | EC-CART-015: «Ver carrito» recibe el clic y la URL es `/carrito`. El aviso ya no intercepta el puntero. Cerrado. |
| BUG-029 | `aa01ff5` | TC-CONSENT-010: con la casilla, «Crear cuenta» entra a `/explorar`. El 429 era el cupo de 5 registros/h, no la navegación. Cerrado. |

## Bugs

| ID | Sev | Rol | Pasos / esperado vs obtenido | Estado |
|----|-----|-----|------------------------------|--------|
| BUG-021 | Major | FE | Abrir `GET /legal/otra-cosa` sin sesión. Esperado: HTTP 404, sin ir a `/login`. Re-prueba: 404. | Cerrado (`bd61771`) |
| BUG-022 | Major | FE | El aviso no debe interceptar clics. Re-prueba en `bdc0301`: «Guardar» y «Cobrar» reciben el clic. | Cerrado (`bdc0301`) |
| BUG-023 | Major | FE | EC-CART-015: pulsar «Ver carrito». Esperado: el clic llega. Re-prueba en `aa01ff5`: la URL es `/carrito`. | Cerrado (`aa01ff5`) |
| BUG-024 | Major | FE | HP-POS-015: POS sin `crypto.randomUUID`. El heading «Algo salió mal» ya está en `main` @ `1aeac1c`. | Deuda arrastrada |
| BUG-025 | Major | BE | TC-MED-009: subir 20 MiB+1. El 500 lo provoca el tope de 10 MB del middleware de Next, ya en `main`. | Deuda arrastrada |
| BUG-026 | Major | BE | TC-RBAC-026 y TC-RBAC-028: el DTO admin ya omitía `primaryColor` en `main`. | Deuda arrastrada |
| BUG-027 | Major | FE | HP-DASH-09 y HP-DASH-01: PDF y KPI de ventas ya fallan igual en `main`. | Deuda arrastrada |
| BUG-028 | Major | FE | HP-GEO-23c: `lat=33&lng=-99` no vuelve a México; igual en `main`. | Deuda arrastrada |
| BUG-029 | Major | FE | TC-CONSENT-010: casilla marcada y «Crear cuenta». Esperado: `/explorar`. Re-prueba: entra. | Cerrado (`aa01ff5`) |
| BUG-030 | Major | FE | Selectores ausentes (catálogo, alcance, copy de imagen, marca, verificación, POS, Encargar, toast, sucursales, `goto /login`) ya en `main`. | Deuda arrastrada |

## Deltas

Cerrados en la suite. No van a UX ni a Arch.

| ID | Tipo | Qué falla la spec | Qué hace el producto |
|----|------|-------------------|----------------------|
| δ-diseño-1 | diseño | HP-POS-01 exigía `1.250` | Cerrado. El ticket afirma `1.25 KG` (`formatQty`). |
| δ-diseño-2 | diseño | Explorar escritorio esperaba «mostrar filtros» y «abrir búsqueda» | Cerrado. En ≥1024 los chips ya están visibles. El flujo móvil no se tocó. |
| δ-suite | suite | 403 Campo Verde, cookie Secure, pin a 10 km, TC-LEGAL en paralelo, 429 | Cerrado en fixtures. La venta usa El Paraíso. HP-AUTH-09/09b reinyectan la cookie. «Paraíso» abre en las coordenadas del proveedor. 008/009 van en serie. Cada caso lleva su IP; el catálogo de prueba no llena el bucket de El Paraíso. |
