# Backlog — LaBorregaMarket

> Backlog priorizado MoSCoW para Tech Lead y equipo de desarrollo.  
> **Última actualización:** 18/09/2026 | **Agente:** Product Manager  
> **Versión:** 0.13.0 en `main` vía [PR #13](https://github.com/dantelokito/BorregaMarket/pull/13); F14 **cerrada documentalmente** (panel PROVIDER; lista DevOps PR); **sin F15**; pagos aparcados

---

## Leyenda

| Prioridad | Significado |
|-----------|-------------|
| S0 | Sprint 0 — cierre Fase 1 (OBS Quality Gate) |
| P0 | Must-have Fase 2 |
| P1 | Should-have Fase 2 |
| P2 | Could-have / Fase 3 |

| MoSCoW | Significado |
|--------|-------------|
| M | Must have |
| S | Should have |
| C | Could have |
| W | Won't have (esta fase) |

---

## Sprint 0 — Cierre Fase 1 (bloqueante antes de Fase 2 build)

| ID | Item | Epic | Agente | Estado |
|----|------|------|--------|--------|
| BL-S0-01 | OBS-001: envelope `/api/catalogs` | BACKEND | Backend | 🔲 Pendiente |
| BL-S0-02 | OBS-002: nombres catálogos API-ADMIN-01 | BACKEND | Backend | 🔲 Pendiente |
| BL-S0-03 | OBS-003: product.service para provider/products | BACKEND | Backend | 🔲 Pendiente |
| BL-S0-04 | OBS-01: mapa móvil en `/explorar` | FRONTEND | Frontend | 🔲 Pendiente |
| BL-S0-05 | OBS-04: edición precio panel proveedor | FRONTEND | Frontend | 🔲 Pendiente |
| BL-S0-06 | OBS-02, OBS-03, OBS-05, OBS-06 (P1 Frontend) | FRONTEND | Frontend | 🔲 Pendiente |

---

## Fase 1 — Referencia (estado consolidado)

| ID | Item | Estado |
|----|------|--------|
| BL-001 | Documentar AUTH | ✅ |
| BL-002 a BL-007 | MVP core (onboarding, explorar API, detalle, cuenta, header) | ✅ Implementado |
| BL-008 a BL-011 | Guards, password, redirect, filtros base | ✅ Implementado |
| BL-012 | Búsqueda header | ✅ Implementado |
| Quality Gate Fase 1 | Backend + Frontend | 🔶 Rechazado con observaciones |

---

## P0 — Must-have Fase 2 (NOTIFY)

| ID | Item | Epic | MoSCoW | User Story | Estado |
|----|------|------|--------|------------|--------|
| BL-021 | Endpoint/evento contacto + email proveedor async | NOTIFY | M | US-NOTIFY-01 | 🔲 Pendiente |
| BL-022 | AUDIT evento contacto | NOTIFY | M | US-NOTIFY-02 | 🔲 Pendiente |
| BL-023 | Rate limit anti-spam contacto | NOTIFY | M | US-NOTIFY-05 | 🔲 Pendiente |
| BL-024 | Fallback proveedor sin email | NOTIFY | M | US-NOTIFY-04 | 🔲 Pendiente |

---

## P0 — Must-have Fase 2 (MEDIA)

| ID | Item | Epic | MoSCoW | User Story | Estado |
|----|------|------|--------|------------|--------|
| BL-025 | Upload logo/portada proveedor (Cloudinary/S3) | MEDIA | M | US-MEDIA-01 | 🔲 Pendiente |
| BL-026 | Validación archivo imagen (5MB, formatos) | MEDIA | M | US-MEDIA-03 | 🔲 Pendiente |
| BL-027 | Display imágenes explorar + detalle | MEDIA | M | US-MEDIA-04, US-MEDIA-05 | 🔲 Pendiente |

---

## P0 — Must-have Fase 2 (EXPLORE)

| ID | Item | Epic | MoSCoW | User Story | Estado |
|----|------|------|--------|------------|--------|
| BL-028 | API filtro `category` en GET /api/providers | EXPLORE | M | US-EXPLORE-01 | 🔲 Pendiente |
| BL-029 | API búsqueda por producto (`q`/`product`) | EXPLORE | M | US-EXPLORE-02 | 🔲 Pendiente |
| BL-030 | UI chips categoría conectados API | EXPLORE | M | US-EXPLORE-01 | 🔲 Pendiente |
| BL-031 | Filtros persistentes en URL | EXPLORE | M | US-EXPLORE-03 | 🔲 Pendiente |
| BL-032 | Empty state filtros sin resultados | EXPLORE | M | US-EXPLORE-04 | 🔲 Pendiente |

---

## P1 — Should-have Fase 2

| ID | Item | Epic | MoSCoW | User Story | Estado |
|----|------|------|--------|------------|--------|
| BL-033 | Feedback cliente "Frutería notificada" | NOTIFY | S | US-NOTIFY-03 | 🔲 Pendiente |
| BL-034 | WhatsApp wa.me con mensaje pre-llenado | NOTIFY | S | — | 🔲 Pendiente |
| BL-035 | Admin upload imagen producto catálogo | MEDIA | S | US-MEDIA-02 | 🔲 Pendiente |
| BL-036 | AUDIT MEDIA_UPLOAD | MEDIA | S | US-MEDIA-01 | 🔲 Pendiente |

---

## P2 — Could-have / histórico

| ID | Item | Epic | Estado |
|----|------|------|--------|
| BL-037 | Formulario interés sin Order | NOTIFY | ✅ Superado — checkout llegó en Fase 3 |
| BL-038 | Filtro geográfico por radio | EXPLORE | ✅ Superado — `US-GEO-02` (Haversine). Motor de mapa: ver F5 `US-GEO-04` (Leaflet/OSM, `CO-F5-001`) |
| BL-039 | Checkout `POST /api/orders` | ORDERS | ✅ Implementado en Fase 3 |
| BL-040 | Pagos en línea / cobros POS nuevos | ORDERS | ⏸️ **Aparcado hasta nuevo aviso** (`CO-F6-001`, D-F6-1). No es F7 automático. POS F3 intacto |
| BL-041 | WhatsApp Business API | NOTIFY | ✅ Superado — ver `US-NOTIFY-08` (Fase 4) |
| BL-018 a BL-020 | Analytics, reseñas, permisos UI | — | ✅ Superado — ver Fase 4 (`US-ADMIN-01`, `US-REV-*`) |

> Nota: Fase 3 (ORDERS/POS/OPS/DASH) se implementó y documentó directamente en `fase-3/` sin pasar por este backlog global (deuda documental). Fuente de verdad de F3: `fase-3/prd.md` y `fase-3/user-stories/`.

---

## Fase 4 — Must/Should (BL-080+)

> Discovery cerrado 14/08/2026. Detalle: [`../fase-4/prd.md`](../fase-4/prd.md). QA corrió F4. `fase-4/` es solo lectura.

| ID | Item | Epic | MoSCoW | User Story | Estado |
|----|------|------|--------|------------|--------|
| BL-080 | Modelo `Review` + trigger post-`DELIVERED` | REVIEWS | M | US-REV-01 | ✅ Implementado (QA F4) |
| BL-081 | Recalcular `rating`/`reviewCount` reales | REVIEWS | M | US-REV-02 | ✅ Implementado (QA F4) |
| BL-082 | Config Google embed (proveedor verificado) | REVIEWS | M | US-REV-03 | ✅ Implementado (QA F4) |
| BL-083 | Bloqueo de config Google (no verificado) | REVIEWS | M | US-REV-04 | ✅ Implementado (QA F4) |
| BL-084 | Google Maps en `/explorar` + radio ajustable | GEO | M | US-GEO-01 | ⛔ Superado — `CO-F5-001` / `US-GEO-04` (Leaflet) + `US-GEO-05` (layout radio) |
| BL-085 | Filtro API `lat`/`lng`/`radiusKm` (Haversine) | GEO | M | US-GEO-02 | ✅ Implementado (QA F4) |
| BL-086 | `UserAddress` + direcciones favoritas | GEO | M | US-GEO-03 | ✅ Implementado (QA F4) |
| BL-087 | Redis/Upstash + worker email | NOTIFY-SCALE | M | US-NOTIFY-06 | ✅ Código F4 — lockfile Redis **abierto** (`DEV-P0-001` / F6) |
| BL-088 | Rate limit distribuido en Redis | NOTIFY-SCALE | M | US-NOTIFY-07 | ✅ Código F4 — ejecutable en F6 (`US-NOTIFY-10`) |
| BL-089 | WhatsApp Business API (nuevo pedido / listo) | NOTIFY-SCALE | S | US-NOTIFY-08 | ✅ Implementado (QA F4) |
| BL-090 | ETA en checkout, detalle y notificaciones | NOTIFY-SCALE | S | US-NOTIFY-09 | ✅ Implementado (QA F4) |
| BL-091 | Dashboard analytics ADMIN | ADMIN-ANALYTICS | M | US-ADMIN-01 | ✅ Implementado (QA F4) — **no** es el reporte proveedor F6 |
| BL-092 | Conectar báscula + autollenar peso en POS | POS | M | US-POS-05 | ✅ Implementado (QA F4) |
| BL-093 | Autodetección de modelo de báscula | POS | M | US-POS-06 | ✅ Implementado (QA F4) |
| BL-094 | Checkout con entrega a domicilio | ORDERS | S | US-ORDERS-05 | ✅ Implementado (QA F4) |

---

## Fase 5 — Must (BL-100+)

> Discovery cerrado 14/08/2026. Implementada; QA **APROBADO CON CONDICIONES** 15/08 (sin CI). Detalle: [`../fase-5/prd.md`](../fase-5/prd.md). `fase-5/` solo lectura.

| ID | Item | Epic | MoSCoW | User Story | Estado |
|----|------|------|--------|------------|--------|
| BL-100 | Mapa `/explorar` Leaflet + OSM sin API key | GEO | M | US-GEO-04 | ✅ Implementado (QA F5; cierra OBS-F4-023) |
| BL-101 | CTA ubicación en banner + radio al pie del mapa | GEO | M | US-GEO-05 | ✅ Implementado (QA F5) |
| BL-102 | Producto inhabilitado oculto y no vendible en todos los canales | CAT | M | US-CAT-01 | ✅ Implementado (QA F5) |
| BL-103 | Configurar colores primario/secundario del proveedor | BRAND | M | US-BRAND-01 | ✅ Implementado (QA F5) |
| BL-104 | Tema aplicado a la sesión PROVIDER + fallback contraste | BRAND | M | US-BRAND-02 | ✅ Implementado (QA F5) |
| BL-105 | (Should) Lista lateral sync viewport + clustering | GEO | S | US-GEO-04 | ⛔ Superado — sync zoom↔radio = `US-GEO-07` / `BL-123`; clustering sigue Won't F6 |

---

## Fase 6 — Deuda confiabilidad (BL-110+)

> Discovery cerrado 16/08/2026. `CO-F6-001`. Diseño deuda UX/Arch **ya existe** (16/08); FE/BE/DevOps implementan. Detalle: [`../fase-6/prd.md`](../fase-6/prd.md).

| ID | Item | Epic | MoSCoW | User Story | DevOps ID | Estado |
|----|------|------|--------|------------|-----------|--------|
| BL-110 | `@upstash/redis` en lockfile + 503 prod + toasts 429/503/500 | RELIAB | M | US-NOTIFY-10 | DEV-P0-001, P1-005 | 🔲 Pendiente |
| BL-111 | CI: Postgres + migrate + `build`/`start` + Playwright | RELIAB | M | US-OPS-04 | DEV-P0-002 | 🔲 Pendiente |
| BL-112 | `migrate deploy` F2→F5 en CI/staging | RELIAB | M | US-OPS-05 | DEV-P1-003 | 🔲 Pendiente |
| BL-113 | Invariante Explorar Leaflet/OSM; cero Maps JS | RELIAB | M | US-GEO-06 | DEV-P1-006 | 🔲 Pendiente |
| BL-114 | 500 session/colores ≠ empty POS | RELIAB | M | US-BRAND-03 | DEV-P1-003 UI | 🔲 Pendiente |
| BL-115 | Secretos staging Resend/Cloudinary/Upstash/Inngest | RELIAB | S | US-OPS-06 | DEV-P1-004 | 🔲 Pendiente |
| BL-116 | `JWT_SECRET` distinto por entorno | RELIAB | S | US-AUTH-08 | DEV-P1-007 | 🔲 Pendiente |
| BL-117 | Sync `.env.example` FE (OSM opcional) | RELIAB | C | US-OPS-07 | DEV-P2-009 | 🔲 Pendiente |

Won't F6 (deuda): DEV-P2-008 `/health`, DEV-P2-010 PITR. DEV-P2-011 = higiene en rutas nuevas (incl. reportes).

---

## Fase 6 — Reportes proveedor (BL-120+)

> Ciclo **nuevo** UX + Arquitecto. Distinto de `US-ADMIN-01` / `BL-091`.

| ID | Item | Epic | MoSCoW | User Story | Estado |
|----|------|------|--------|------------|--------|
| BL-120 | Reportes día / mes / año con fecha concreta | DASH | M | US-DASH-04 | 🔲 Pendiente (diseño UX/Arch) |
| BL-121 | Imprimir reporte (navegador + CSS print) | DASH | M | US-DASH-05 | 🔲 Pendiente (diseño UX) |
| BL-122 | Descargar PDF del mismo reporte | DASH | M | US-DASH-06 | 🔲 Pendiente (ADR Arquitecto) |

Should DASH (no BL propio): comparativa vs periodo anterior. Could: serie horaria del día, drill-down a órdenes. Won't: CSV, email, CFDI, ticket térmico, ADMIN viendo proveedor ajeno.

---

## Fase 6 — GEO zoom ↔ radio (BL-123+)

> `CO-F6-002`. Delta Explorar; filtro Must sigue Haversine (`US-GEO-02`). Sin bbox Must. Clustering Won't.

| ID | Item | Epic | MoSCoW | User Story | Estado |
|----|------|------|--------|------------|--------|
| BL-123 | Zoom/pan y slider = mismo `radiusKm`; círculo siempre visible | GEO | M | US-GEO-07 | ⛔ Superado — `CO-F7-001` / `US-GEO-10` (pan **no** mueve radio) |
| BL-124 | Loader borrega B1–B3 en lista al refetch geo (componente reutilizable) | GEO | M | US-GEO-08 | ⏸️ Congelado F6 (solo lectura; no reabrir en F7) |

---

## Fase 7 — Explorar UX + AUTH (BL-130+)

> Discovery cerrado 18/08/2026. `CO-F7-001` anula D-F6-9. Detalle: [`../fase-7/prd.md`](../fase-7/prd.md). `fase-6/` solo lectura.

| ID | Item | Epic | MoSCoW | User Story | Ticket | Estado |
|----|------|------|--------|------------|--------|--------|
| BL-130 | Layout: mapa prioridad sobre catálogo; mapa arriba en móvil | GEO | M | US-GEO-09 | ID000 | ✅ Código F7 — re-firma QA |
| BL-131 | Pan/zoom no actualizan radio; slider/dirección/GPS sí; slider post-GPS estable | GEO | M | US-GEO-10 | ID001, ID002, ID004 | ✅ Código F7 — re-firma QA |
| BL-132 | Default SN de los Garza; última favorita servidor + 10 km | GEO | M | US-GEO-11 | ID003 | ✅ Código F7 — re-firma QA |
| BL-133 | Mapa +20% alto; lista ≤20 ítems; paginación | GEO | M | US-GEO-12 | ID005 | ✅ Código F7 — re-firma QA |
| BL-134 | Copy “N fruterías a R km” usa `total` del radio, no page size | GEO | M | US-GEO-13 | ID006 | ✅ Código F7 — re-firma QA |
| BL-135 | Direcciones favoritas solo API (`UserAddress`); no localStorage como fuente | GEO | M | US-GEO-14 | ID007 | ✅ Código F7 — re-firma QA |
| BL-136 | Login desde móvil u otro navegador/dispositivo | AUTH | M | US-AUTH-09 | ID008 | 🔶 Código + ADR-025; smoke teléfono LAN pendiente (`NOTA-LAN-MOVIL.md`) |
| BL-137 | Preview proveedor: catálogo, horario, flags, 3 reseñas, mayoreo/menudeo | EXPLORE | M | US-EXPLORE-05 | ID009 | ✅ Código F7 — re-firma QA |
| BL-138 | Búsqueda barra: fruterías + productos del catálogo activo en radio | EXPLORE | M | US-EXPLORE-06 | ID010 | ✅ Código F7 — re-firma QA |
| BL-139 | Markers sin nombre permanente; hover/tap; icono negocio pequeño | GEO | M | US-GEO-15 | ID011 | ✅ Código F7 — re-firma QA |
| BL-140 | Empty de radio: reutilizar loader borrega B1–B3, tamaño ligeramente mayor que loading | GEO | M | US-GEO-16 | ID012 | ✅ Código F7 — re-firma QA |

Won't F7: clustering, bbox Must, Google Maps JS, Places, Distance Matrix, DASH F6, deuda Redis/CI, `BL-040`.

---

## Fase 8 — Explorar polish por partes (BL-150+)

> Discovery P1–P4 cerrado 24/08/2026. `CO-F8-001` … `003`. Detalle: [`../fase-8/prd.md`](../fase-8/prd.md). `fase-7/` solo lectura.

| ID | Item | Epic | MoSCoW | User Story | Ticket | Estado |
|----|------|------|--------|------------|--------|--------|
| BL-150 | Control único de ubicación (chip → sheet/popover) | GEO | M | US-GEO-17 | ID013 | 🔲 Pendiente diseño UX |
| BL-151 | Favoritas con calle visible + borrar (sin select nativo) | GEO | M | US-GEO-18 | ID014 | 🔲 Pendiente diseño UX |
| BL-152 | Guardar dirección en diálogo in-app (no `window.prompt`) | GEO | M | US-GEO-19 | ID015 | 🔲 Pendiente diseño UX |
| BL-153 | Chip absorbe “Centro: X”; conteo `total` se conserva | GEO | M | US-GEO-20 | ID016 | 🔲 Pendiente diseño UX |
| BL-154 | Overlay de radio más bajo en vertical (sigue siendo range) | GEO | M | US-GEO-21 | ID017 | 🔲 Pendiente diseño UX |
| BL-155 | Clamp radio 500 m–10 km (`radiusKm` decimal); pan ≠ radio intacto | GEO | M | US-GEO-22 | ID018 | 🔲 Pendiente Arch + UX |
| BL-156 | Mapa `maxBounds` México + encuadre al círculo; pan interno no refetch | GEO | M | US-GEO-23 | ID019 | 🔲 Pendiente Arch + UX |
| BL-157 | Preview hover/long-press anclado a la card; sin botón «Vista rápida» | EXPLORE | M | US-EXPLORE-07 | ID020 | 🔲 Pendiente diseño UX |

Won't F8 P1–P4: FilterBar nuevo, recortar `US-EXPLORE-05`, clustering, bbox Must de API, Google Maps JS, Places, merge duplicados BE, DASH F6, `BL-040`, pan→radio, polígono INEGI Must.

> `fase-8/` solo lectura. FilterBar chips reales = F9 (`BL-163`), no reopen F8.

---

## Fase 9 — Deuda técnica Explorar (BL-160+)

> Discovery cerrado 25/08/2026; **clausura PM 28/08/2026**. `CO-F9-001`. Código FE/BE entregado; sign-off QA F9 pendiente. Detalle: [`../fase-9/prd.md`](../fase-9/prd.md). `fase-9/` solo lectura.

| ID | Item | Epic | MoSCoW | User Story | Ticket | Estado |
|----|------|------|--------|------------|--------|--------|
| BL-160 | Preview hover/long-press como animación in-card | EXPLORE | M | US-EXPLORE-08 | DT-F9-001 | ✅ Código F9 — re-firma QA |
| BL-161 | Header typeahead solo fruterías; radio completo; chip + tacha | EXPLORE | M | US-EXPLORE-09 | DT-F9-002 | ✅ Código F9 — re-firma QA |
| BL-162 | Card: distancia pin→frutería + ETA (sin minPrice visual) | EXPLORE | M | US-EXPLORE-10 | DT-F9-003 | ✅ Código F9 — re-firma QA |
| BL-163 | Mayoreo/Domicilio filtran; Orgánico y «Filtros» retirados | EXPLORE | M | US-EXPLORE-11 | DT-F9-004 | ✅ Código F9 — re-firma QA |
| BL-164 | Chrome una barra horizontal + mapa ~+10–20% | GEO | M | US-GEO-24 | DT-F9-005 | ✅ Código F9 — re-firma QA |

Won't F9: typeahead SKUs, pintar `sampleProducts` en card, schema orgánico, DASH F6, Redis/CI, `BL-040`, reopen F8, clustering, Maps JS, Places, pan→radio, bbox API Must.

> `fase-9/` solo lectura. F10 no reabre US F9.

---

## Fase 10 — Admin seguro + catálogo proveedor (BL-170+)

> **Cerrada documentalmente 12/09/2026.** QA APROBADO CON CONDICIONES. `fase-10/` solo lectura. Detalle: [`../fase-10/prd.md`](../fase-10/prd.md).

| ID | Item | Epic | MoSCoW | User Story | Estado |
|----|------|------|--------|------------|--------|
| BL-170 | RBAC por módulo en `/api/catalogs` y `/api/admin/*` | SEC | M | US-SEC-01 | ✅ Cerrado F10 |
| BL-171 | AUDIT escrituras + último ADMIN + ownership catálogo proveedor | SEC | M | US-SEC-02 | ✅ Cerrado F10 |
| BL-172 | Higiene demo/prod + 401/403 en rutas nuevas | SEC | M | US-SEC-03 | ✅ Cerrado F10 |
| BL-173 | CRUD catálogo global (alta/edición/retiro; imagen disco) | ADMIN | M | US-ADMIN-02 | ✅ Cerrado F10 |
| BL-174 | Proveedores: verificar/activar + flags F5–F9 | ADMIN | M | US-ADMIN-03 | ✅ Cerrado F10 |
| BL-175 | PROVIDER crea/edita producto local (no comparable) | CAT | M | US-CAT-02 | ✅ Cerrado F10 |
| BL-176 | Secciones dinámicas del catálogo del negocio | CAT | M | US-CAT-03 | ✅ Cerrado F10 |
| BL-177 | ADMIN promueve producto local → catálogo global | ADMIN | S | US-ADMIN-04 | 🔲 Should — no Must F10/F11 |
| BL-178 | Logo, portada y fotos de producto en disco (sin cloud) | MEDIA | M | US-MEDIA-06 | ✅ Cerrado F10 (disco) |
| BL-179 | Venta por producto + checkboxes (vacío = todos) | DASH | M | US-DASH-07 | ✅ Cerrado F10 |
| BL-180 | Rango inicio–fin + atajo un mes | DASH | M | US-DASH-08 | ✅ Cerrado F10 |
| BL-181 | Imprimir vista filtrada (rango + productos) | DASH | M | US-DASH-09 | ✅ Cerrado F10 |
| BL-182 | Fallback UUID fuera de secure context (carrito/POS) | AUTH | S | DT-F10-001 | 🔲 Diferido QA — no Must F11 |
| BL-183 | Copy FE 20 MB + `bodySizeLimit` (oversize → 400) | MEDIA | S | DT-F10-002 | 🔲 Diferido QA — no Must F11 |

Won't F10: auto-global, secciones anidadas, chips FilterBar de secciones, CRUD usuarios, matriz permisos UI, `BL-067`, UI reseñas, 2FA, impersonation, DASH ajeno, Redis/CI, `BL-040`, Cloudinary/S3, reopen F7–F9, CSV/email/CFDI, multi-mes, editar `fase-6/`.

---

## Fase 11 — 1 proveedor → N fruterías (BL-190+)

> Cierre PM 12/09/2026 (QA APROBADO + QG UX/Arch). Detalle: [`../fase-11/prd.md`](../fase-11/prd.md). `fase-10/` y `fase-11/` solo lectura.

| ID | Item | Epic | MoSCoW | US | Estado |
|----|------|------|--------|-----|--------|
| BL-190 | User PROVIDER 1:N `Provider` (quitar `userId` único); contexto `activeProviderId` | AUTH | M | US-AUTH-11 | ✅ Cerrado F11 |
| BL-191 | Header: rotar frutería **solo si N>1**; N=1 banner como F10 | UX | M | US-HEADER-01 | ✅ Cerrado F11 |
| BL-192 | Aislar CAT/POS/DASH/media/pedidos por sucursal (IDOR 403 mismo user) | CAT | M | US-ISO-01 | ✅ Cerrado F11 |
| BL-193 | **Módulo nuevo** reportes globales (todas las sucursales); **solo N>1**; no flag admin | DASH | M | US-DASH-11 | ✅ Cerrado F11 |
| BL-194 | Reusar `/registro/negocio` para sucursal N+1 con sesión PROVIDER | AUTH | M | US-ONB-01 | ✅ Cerrado F11 |
| BL-195 | Seed: El Paraíso ×2 (El Paraíso Tecnológico); Campo Verde ×1; demo login | OPS | M | US-SEED-01 | ✅ Cerrado F11 |
| BL-196 | Admin: N filas / flags F10 **por sucursal** | ADMIN | M | US-ADMIN-11 | ✅ Cerrado F11 |
| BL-197 | Explorar: una tarjeta por `Provider` (dos cards El Paraíso) | EXPLORE | M | US-EXPLORE-11 | ✅ Cerrado F11 |

Won't F11: pagos `BL-040`, Cloudinary, `US-ADMIN-04`, reopen F7–F10, DT-F10 como P0, catálogo compartido, CSV/CFDI.

---

## Fase 12 — Inventario / almacén (BL-200+)

> Discovery cerrado 14/09/2026 (D-F12-1…12). Cadena F12 cerrada 15/09 (QA APROBADO + QG UX/Arch). Detalle: [`../fase-12/prd.md`](../fase-12/prd.md). `fase-12/` solo lectura. DevOps F12 en paralelo.

| ID | Item | Epic | MoSCoW | User Story | Estado |
|----|------|------|--------|------------|--------|
| BL-200 | Módulo `/proveedor/inventario` + SubNav primero + etiqueta Ventas + aislamiento sucursal | INV | M | US-INV-01 | ✅ Cerrado F12 |
| BL-201 | Registrar entrada en unidad de catálogo + factor caja fijo en ficha | INV | M | US-INV-02 | ✅ Cerrado F12 |
| BL-202 | Capacidad/tope, barra %, umbral default 10%, apagar alerta, sobre-tope | INV | M | US-INV-03 | ✅ Cerrado F12 |
| BL-203 | Listado inventario: productos, barra, alerta, parcial Encargar | INV | M | US-INV-04 | ✅ Cerrado F12 |
| BL-204 | POS descuenta al cobrar; no bloquea por stock (ADR-022 intacto) | POS | M | US-INV-05 | ✅ Cerrado F12 |
| BL-205 | Encargar reserva / commit `DELIVERED` / restore `CANCELLED` | ORDERS | M | US-INV-06 | ✅ Cerrado F12 |
| BL-206 | Barra dinámica en lista catálogo proveedor (no vitrina) | CAT | M | US-CAT-12 | ✅ Cerrado F12 |
| BL-207 | Miniatura siempre en lista catálogo proveedor | CAT | M | US-CAT-13 | ✅ Cerrado F12 |
| BL-208 | Imágenes card POS + toggle default ON persistido por sucursal | POS | M | US-POS-12 | ✅ Cerrado F12 |

Inventario **blando** por sucursal activa. **Should/Could F12:** ninguno.

Won't F12: receta/BOM, inventario compartido, Cloudinary, `BL-040`, bloquear POS/Encargar por stock, kardex, barra en `/fruteria`, usar `stock` como `isAvailable`.

---

## Fase 13 — Visibilidad admin + ocultar oferta (BL-210+)

> Cadena F13 **cerrada**. QA APROBADO + QG UX/Arch. [PR #13](https://github.com/dantelokito/BorregaMarket/pull/13) en `main` (`0eda84c`). Detalle: [`../fase-13/prd.md`](../fase-13/prd.md). `fase-13/` registro. `CO-F13-001`. `US-CAT-17` **Won't**. F14 abierta documentalmente 17/09 (no reabre estas filas).

| ID | Item | Epic | MoSCoW | User Story | Estado |
|----|------|------|--------|------------|--------|
| BL-210 | Admin lista `products` GLOBAL + LOCAL; filtros; páginas reales | ADMIN | M | US-ADMIN-05 | Cerrado — QA APROBADO; lista DevOps PR |
| BL-211 | Admin inhabilita SKU LOCAL o GLOBAL (`isActive`); DELETE 405 | ADMIN | M | US-ADMIN-06 | Cerrado — QA APROBADO; lista DevOps PR |
| BL-212 | Proveedor Eliminar = ocultar GLOBAL y LOCAL (`archivedAt`) | CAT | M | US-CAT-14 | Cerrado — QA APROBADO; lista DevOps PR |
| BL-213 | GET dashboard sin ocultos; base GLOBAL onboarding; bandeja + Restaurar | CAT | M | US-CAT-15 | Cerrado — QA APROBADO; lista DevOps PR |
| BL-214 | Reportes sucursal y generales cuadran con `OrderItem` si oculto/inactivo | DASH | M | US-DASH-10 | Cerrado — QA APROBADO; lista DevOps PR |
| BL-215 | Cliente/POS omiten ocultos; carrito/checkout 409 | CAT | M | US-CAT-16 | Cerrado — QA APROBADO; lista DevOps PR |
| BL-216 | PROVIDER `canDelete=false` PRODUCTS; no DELETE HTTP | SEC | M | US-SEC-04 | Cerrado — QA APROBADO; lista DevOps PR |
| BL-219 | Editar GLOBAL/LOCAL: unidad de **oferta** (enum incl. CAJA) + factor caja; no muta maestro GLOBAL | CAT | M | US-CAT-18 | Cerrado — QA APROBADO; lista DevOps PR |
| BL-220 | Cambio unidad/factor (oferta GLOBAL o LOCAL): alerta, descarte on-hand; 409 si Encargar activo | INV | M | US-INV-07 | Cerrado — QA APROBADO; lista DevOps PR |
| BL-221 | Editar precio de oferta GLOBAL/LOCAL por sucursal (no SKU nuevo) | CAT | M | US-CAT-19 | Cerrado — QA APROBADO; lista DevOps PR |
| BL-222 | Historial de cambios de precio de la oferta | CAT | M | US-CAT-20 | Cerrado — QA APROBADO; lista DevOps PR |
| BL-223 | Reporte inventario sucursal: actual + entradas | DASH | M | US-DASH-12 | Cerrado — QA APROBADO; lista DevOps PR |
| BL-224 | Reportes generales N>1: solo inventarios actuales | DASH | M | US-DASH-13 | Cerrado — QA APROBADO; lista DevOps PR |
| BL-217 | Vista default solo mis ofertas + toggle plataforma | CAT | W | US-CAT-17 | ⛔ Won't F13 — contradice onboarding GLOBAL |
| BL-218 | Badge admin «N ofertas» por `productId` | ADMIN | C | — | Could — no Must |

Won't F13: `US-CAT-17`, unificación Mango×N, DELETE SQL, rediseño Explorar, Cloudinary, `BL-040`, `US-ADMIN-04` como Must, reabrir F12, SKU nuevo por unidad, mutar `Product.unit` GLOBAL.

Carry-over (no mezclar): `BL-177`, DT-F10-001/002, QA F9, `BL-040`.

---

## Fase 14 — Mejoras y deuda panel PROVIDER (BL-230+)

> Discovery cerrado 17/09/2026 (D-F14-1…23). F14 **cerrada documentalmente** 18/09 (QA APROBADO + QG UX/Arch sin deltas). Detalle: [`../fase-14/prd.md`](../fase-14/prd.md). `CO-F14-001`. F13 no se reabre. **No hay F15.** Lista DevOps PR.

| ID | Item | Epic | MoSCoW | User Story | Estado |
|----|------|------|--------|------------|--------|
| BL-230 | Pestaña `/proveedor/perfil`; mover logo, portada, colores desde Catálogo | PROF | M | US-PROF-01 | Cerrado — QA APROBADO; lista DevOps PR |
| BL-231 | Google Maps en Perfil (Place ID, URL, reseñas); lock si no `isVerified` | PROF | M | US-PROF-02 | Cerrado — QA APROBADO; lista DevOps PR |
| BL-232 | Catálogo solo productos; `posShowImages` se mueve a POS | CAT | M | US-CAT-21 | Cerrado — QA APROBADO; lista DevOps PR |
| BL-233 | Editar datos del negocio (nombre, dirección, teléfono, coords, descripción) | PROF | M | US-PROF-03 | Cerrado — QA APROBADO; lista DevOps PR |
| BL-234 | UI de horarios de atención (`openingHours`) | PROF | M | US-PROF-04 | Cerrado — QA APROBADO; lista DevOps PR |
| BL-235 | UI capacidades (WhatsApp, tarjeta, mayoreo, menudeo) + prep/delivery en Perfil | PROF | M | US-PROF-05 | Cerrado — QA APROBADO; lista DevOps PR |
| BL-236 | Modelo formal `InventoryMovement` más allá de merma/ajuste | INV | S | — | Should — Arch si lo necesita; Must cubierto por US-INV-08/09 |
| BL-237 | Registrar merma con motivo enum + nota; 400 si `on_hand` negativo | INV | M | US-INV-08 | Cerrado — QA APROBADO; lista DevOps PR |
| BL-238 | Instrumentar POS / `DELIVERED` / descarte para kardex | INV | W | — | ⛔ Won't F14 — no `decrementOnHandForLines` |
| BL-239 | Listado Movimientos: entradas + mermas + ajustes (sin ventas) | INV | M | US-INV-10 | Cerrado — QA APROBADO; lista DevOps PR |
| BL-240 | Ajuste por conteo físico; saldo resultante ≥ 0 | INV | M | US-INV-09 | Cerrado — QA APROBADO; lista DevOps PR |
| BL-241 | Valor `INVENTORY` en `SystemModule` + auditoría | INV | S | — | Should — no Must |
| BL-242 | Restaurar `on_hand` al cancelar pedido ya `DELIVERED` | INV | W | — | ⛔ Won't F14 |
| BL-243 | Atomicidad `on_hand` (`SELECT FOR UPDATE` / versionado) | INV | S | — | Should — Arch; no Must |
| BL-244 | Reportes generales: pintar `series`, `products`, `bySource` + filtro `productIds` | DASH | M | US-DASH-14 | Cerrado — QA APROBADO; lista DevOps PR |
| BL-245 | Componente de gráfica unificado (SVG o librería; Arch decide) | DASH | M | US-DASH-15 | Cerrado — QA APROBADO; lista DevOps PR |
| BL-246 | Ventas: tendencia, mix canal, top productos | DASH | M | US-DASH-15 | Cerrado — QA APROBADO; lista DevOps PR |
| BL-247 | Gráficas de inventario/merma valorizada | DASH | W | — | ⛔ Won't F14 — no hay costo |
| BL-248 | Granularidad semanal y comparativa vs periodo anterior | DASH | W | — | ⛔ Won't F14 |
| BL-249 | Agrupación de ventas por `ProviderSection` | DASH | W | — | ⛔ Won't F14 |
| BL-250 | PDF del reporte de sucursal alineado a `from`/`to` | DASH | M | US-DASH-16 | Cerrado — QA APROBADO; lista DevOps PR |
| BL-251 | Costo unitario en entrada | COST | W | — | ⛔ Won't F14 |
| BL-252 | Margen bruto / valor inventario | COST | W | — | ⛔ Won't F14 |
| BL-253 | Merma valorizada en pesos | COST | W | — | ⛔ Won't F14 |
| BL-254 | Rol cajero / invitación | OPS | W | — | ⛔ Won't F14 |
| BL-255 | `createdByUserId` en ventas | OPS | W | — | ⛔ Won't F14 |
| BL-256 | Corte de caja y turno | OPS | W | — | ⛔ Won't F14 |
| BL-257 | Alertas accionables stock (Inngest) | OPS | S | — | Should — fuera del Must F14 |
| BL-258 | Directorio de clientes de mostrador | OPS | W | — | ⛔ Won't F14 |
| BL-259 | Crédito de mostrador | OPS | W | — | ⛔ Won't F14 |
| BL-260 | Caducidad y lotes | OPS | W | — | ⛔ Won't F14 |
| BL-261 | Quitar default `price ?? 50` al activar GLOBAL | CAT | M | US-CAT-22 | Cerrado — QA APROBADO; lista DevOps PR |
| BL-262 | Alerta stock `on_hand - reserved` | INV | S | — | Should |
| BL-263 | Alertar SKU saldo 0 sin `capacityMax` | INV | S | — | Should |
| BL-264 | Retirar `stock Int?` del schema | INV | S | — | Should |
| BL-265 | Unificar validadores `catalog-f10` / `catalog-f13` | CAT | S | — | Should |
| BL-266 | Desambiguar PATCH local-products id | CAT | C | — | Could |
| BL-267 | Honrar o retirar `range` del dashboard | DASH | C | — | Could |
| BL-268 | Retirar `GrainSelector` / `ReportPeriodPicker` muertos | DASH | C | — | Could — no reactivar grain en UI |
| BL-269 | Un fetch `getMyBusiness` al cargar Perfil | PROF | M | US-PROF-01 | Cerrado — QA APROBADO; lista DevOps PR |
| BL-270 | Agregar reportes en SQL (no memoria) | DASH | S | — | Should |
| BL-271 | 409 al borrar sección con productos visible | CAT | M | US-CAT-23 | Cerrado — QA APROBADO; lista DevOps PR |
| BL-272 | Limpieza naming `bySource`, tipos, comentario ilustrativo | DT | C | — | Could |

Won't F14: kardex VENTA_POS/ENTREGA_PEDIDO, costos/margen, corte de caja, cajeros, lotes, directorio, crédito, BOM, inventario compartido, Cloudinary, `BL-040`, Explorar rediseño, `US-ADMIN-04` como Must, hard-delete, granularidad semanal, comparativa periodo, agrupación por sección, gráficos de margen, reabrir US F13.

Carry-over (no mezclar): `BL-177`, DT-F10-001/002, QA F9, `BL-040`. DevOps F14: PR listo; humano mergea. **Sin F15.**

---

## Orden de ejecución recomendado

```
Sprint 0: BL-S0-01 → BL-S0-06
Sprint 1 Fase 2: BL-021 → BL-024 (NOTIFY core)
Sprint 2 Fase 2: BL-025 → BL-027 (MEDIA) + BL-028 → BL-032 (EXPLORE)
Sprint 3 Fase 2: BL-033 → BL-036 (Should)

Fases 3–5: implementadas / QA (ver carpetas fase-N/). fase-5/ solo lectura.

Fase 6: congelada (solo lectura). No programar BL-110–124 ni DASH en F7.

Sprint 0 Fase 7: activation-prompt UX + Arquitecto (Explorar + AUTH)
Sprint 1 Fase 7: BL-136 (AUTH-09) en paralelo a BL-130–133 + BL-139 (layout/mapa)
Sprint 2 Fase 7: BL-134–135 (`total` + favoritas) y BL-137–138 (preview + búsqueda) + **BL-140** (empty borrega)

Fase 7: no programar más US. Leftover QA/AUTH LAN en paralelo.

Sprint 0 Fase 8: activation-prompt UX + Arquitecto (P1–P4)
Sprint 1 Fase 8: BL-150–153 + BL-154 + BL-155 + BL-156 + BL-157 (preview hover; FE tras UX)

Fase 8: solo lectura. No reabrir US F8.

Sprint 0 Fase 9: activation-prompt UX + Arquitecto (deuda DT-001…005)
Sprint 1 Fase 9: BL-160–164 (FE tras UX; BE tras Arch en BL-161/163)

Fase 9: cerrada documentalmente (28/08). Código entregado; sign-off QA pendiente. No reabrir US F9.

Fase 10: cerrada documentalmente (12/09). QA APROBADO CON CONDICIONES. BL-170–181 Must cerrados. BL-177 Should. BL-182/183 diferidos (no P0 F11).

Fase 11: cerrada documentalmente (12/09). BL-190–197 Must cerrados. QA APROBADO. QG UX + Arch presentes. DevOps: PR #11 listo; humano mergea.

Fase 12: cerrada documentalmente (15/09). BL-200–208 Must cubiertos. QA APROBADO. QG UX + Arch presentes (sin deltas). [PR #12](https://github.com/dantelokito/BorregaMarket/pull/12) en **main**.

Fase 13: cerrada (16/09 documental; 17/09 merge). BL-210–216 y BL-219–224 Must cerrados. QA APROBADO. QG UX + Arch presentes. [PR #13](https://github.com/dantelokito/BorregaMarket/pull/13) en `main`. BL-217 Won't. Pagos (BL-040): no programar.

Fase 14: cerrada documentalmente (18/09). BL-230–235, 237, 239, 240, 244–246, 250, 261, 269, 271 Must cerrados. QA APROBADO (Playwright 41/41; sin BUG-021+). QG UX + Arch presentes (sin deltas). Lista DevOps PR sobre `feat/f14-panel-proveedor`; humano mergea. **No hay Fase 15.** Pagos (BL-040): no programar.
```

---

## Dependencias entre agentes

| Backlog | Upstream | Downstream |
|---------|----------|------------|
| BL-S0-* | Quality Gates Fase 1 | Backend, Frontend |
| BL-021–024 | PM + Arquitecto API-NOTIFY | Backend → Frontend |
| BL-110 | Handoff BE 16/08 + handoff FE 16/08 | Backend (lockfile/503) → Frontend (toasts) |
| BL-111 | DevOps + contrato QA env-requirements | DevOps (YAML); BE no escribe CI |
| BL-112 | BL-111 (mismo pipeline) | Backend script opcional + DevOps |
| BL-113–114 | Handoff FE 16/08 | Frontend |
| BL-120–122 | Handoff PM F6 → UX `UF-DASH-02` + Arquitecto API/ADR-PDF | Backend → Frontend |
| BL-123–124 | F6 congelada; modelo radio = `CO-F7-001` / `US-GEO-10` | No implementar pan→radio |
| BL-130–140 | Handoff PM F7 → UX `UF-GEO-01` delta + Arquitecto API | Histórico F7 (solo lectura) |
| BL-150–153 | Handoff PM F8 P1 → UX chrome ubicación + Arch (reuso API) | UX primero; FE tras `handoff-frontend-fase-8.md` |
| BL-154–155 | Handoff PM F8 P2 + `CO-F8-001` → UX overlay + Arch clamp | Arch contrato 0.5–10 → BE; UX overlay → FE |
| BL-156 | Handoff PM F8 P3 + `CO-F8-002` → UX borde MX + Arch bbox | Arch constante México → FE `maxBounds`; BE Should URL |
| BL-157 | Handoff PM F8 P4 + `CO-F8-003` → UX preview anclado | Histórico F8 (solo lectura) |
| BL-160 | Handoff PM F9 + `CO-F9-001` → UX preview in-card | ✅ Código F9 — re-firma QA |
| BL-161 | Handoff PM F9 → UX typeahead + Arch suggest/`q`+geo | ✅ Código F9 — re-firma QA |
| BL-162 | Handoff PM F9 → UX copy distancia/ETA | ✅ Código F9 — re-firma QA |
| BL-163 | Handoff PM F9 → Arch query mayoreo/domicilio + UX chips | ✅ Código F9 — re-firma QA |
| BL-164 | Handoff PM F9 → UX breakpoint + tokens mapa | ✅ Código F9 — re-firma QA |
| BL-170 | Handoff PM F10 + `CO-F10-001` → Arch RBAC por módulo | Arch → BE; cierra OBS-004 |
| BL-171 | Handoff PM F10 → Arch AUDIT + último ADMIN + IDOR | Arch → BE; FE toasts error |
| BL-172 | Handoff PM F10 → FE ocultar demo prod + tests 401/403 | BE rutas nuevas; FE OBS-05 |
| BL-173 | Handoff PM F10 → UX tab Catálogos CRUD + Arch API-ADMIN | UX → FE; Arch → BE |
| BL-174 | Handoff PM F10 → UX tabla proveedores flags F5–F9 | UX → FE; PATCH admin providers |
| BL-175 | Handoff PM F10 → UX alta producto local + Arch schema dual | Arch schema → BE → FE `/proveedor` |
| BL-176 | Handoff PM F10 → UX «Nueva sección» + Arch `ProviderSection` | Arch → BE → FE + detalle `/fruteria/[id]` |
| BL-177 | Handoff PM F10 Should → Arch promover local→global | No bloquea Must |
| BL-178 | Handoff PM F10 + `CO-F10-002` → Arch disco + FE dropzone | Arch path/URL → BE upload → FE preview |
| BL-179 | Handoff PM F10 + `CO-F10-003` → UX tabla SKU + Arch productIds | Arch → BE reports; FE checkboxes |
| BL-180 | Handoff PM F10 → UX mes+from/to + Arch from/to | Arch → BE; FE date pickers |
| BL-181 | Handoff PM F10 → UX print CSS + FE window.print | ✅ Cerrado F10 |
| BL-182 | DT-F10-001 UUID inseguro | Diferido — Should |
| BL-183 | DT-F10-002 media 20 MiB FE/body | Diferido — Should |
| BL-190–197 | Cerrados F11 (QA APROBADO + QG UX/Arch) | PR #11 listo; humano mergea |
| BL-200–208 | Cerrados F12 (QA APROBADO + QG UX/Arch) | [PR #12](https://github.com/dantelokito/BorregaMarket/pull/12) en main |
| BL-210–216 | Cerrados F13 (`CO-F13-001`) | Lista DevOps PR; humano mergea |
| BL-219–224 | Cerrados F13 (unidad de oferta, precio, reportes inventario) | Mismo PR F13 |
| BL-217 | Won't F13 | No programar |
| BL-230–235, 237, 239, 240, 244–246, 250, 261, 269, 271 | Must F14 (`CO-F14-001`) | Cerrado — QA APROBADO; lista DevOps PR; humano mergea |
| BL-236, 241, 243, 262–265, 270 | Should F14 | No bloquean Must |
| BL-238, 242, 247–249, 251–260 | Won't F14 | Kardex ventas, costos, caja, semanal, margen |
| BL-040 | — | ⏸️ Aparcado (`CO-F6-001`) |
| BL-084–086 | Handoff Arquitecto F4 + UX `UF-GEO-01`. Motor mapa: F5 ADR-020 | Histórico |
| BL-100–101 | `CO-F5-001` + ADR-020 | Histórico F5 |
| BL-087–090 | ADR-015 Redis + credenciales WhatsApp (DevOps) | F6 hace ejecutable Redis (BL-110) |

---

## Referencias

- PRD Fase 1: `outputs/laborregamarket/fase-1/prd.md`
- PRD Fase 2: `outputs/laborregamarket/fase-2/prd.md`
- PRD Fase 3: `outputs/laborregamarket/fase-3/prd.md`
- PRD Fase 4: `outputs/laborregamarket/fase-4/prd.md`
- PRD Fase 5: `outputs/laborregamarket/fase-5/prd.md`
- PRD Fase 6: `outputs/laborregamarket/fase-6/prd.md` (solo lectura)
- PRD Fase 7: `outputs/laborregamarket/fase-7/prd.md` (solo lectura)
- User stories F7: `outputs/laborregamarket/fase-7/user-stories/`
- PRD Fase 8: `outputs/laborregamarket/fase-8/prd.md` (solo lectura)
- User stories F8: `outputs/laborregamarket/fase-8/user-stories/`
- CO-F8-003: `outputs/laborregamarket/fase-8/change-orders/CO-F8-003-preview-hover.md`
- CO-F8-002: `outputs/laborregamarket/fase-8/change-orders/CO-F8-002-mapa-mexico.md`
- CO-F8-001: `outputs/laborregamarket/fase-8/change-orders/CO-F8-001-rango-radio.md`
- PRD Fase 9: `outputs/laborregamarket/fase-9/prd.md` (solo lectura)
- User stories F9: `outputs/laborregamarket/fase-9/user-stories/`
- CO-F9-001: `outputs/laborregamarket/fase-9/change-orders/CO-F9-001-deuda-explorar.md`
- PRD Fase 10: `outputs/laborregamarket/fase-10/prd.md`
- User stories F10: `outputs/laborregamarket/fase-10/user-stories/`
- CO-F10-001: `outputs/laborregamarket/fase-10/change-orders/CO-F10-001-admin-catalogo-local.md`
- CO-F10-002: `outputs/laborregamarket/fase-10/change-orders/CO-F10-002-media-disco-local.md`
- CO-F10-003: `outputs/laborregamarket/fase-10/change-orders/CO-F10-003-dashboard-reportes.md`
- Fase 11 (cerrada documentalmente): `outputs/laborregamarket/fase-11/`
- Fase 12 (cerrada documentalmente 15/09): `outputs/laborregamarket/fase-12/`
- Fase 13 (cerrada documentalmente 16/09): `outputs/laborregamarket/fase-13/`
- CO-F13-001: `outputs/laborregamarket/fase-13/change-orders/CO-F13-001-visibilidad-admin-y-archivo.md`
- Fase 14 (cerrada documentalmente 18/09; lista DevOps PR; **sin F15**): `outputs/laborregamarket/fase-14/`
- CO-F14-001: `outputs/laborregamarket/fase-14/change-orders/CO-F14-001-mejora-panel-proveedor.md`
- Diagnóstico panel: `comun/MEJORA-PANEL-PROVEEDOR.md`
- Sign-off QA F12: `QA Automation Engineer/.../fase-12/qa-signoffs/QA-F12-signoff.md`
- QG UX F12: `Agente UX UI/.../fase-12/quality/QG-correcciones.md`
- QG Arch F12: `Agente Arquitecto de Software/.../fase-12/quality/QG-correcciones.md`
- Sign-off QA F11: `QA Automation Engineer/.../fase-11/qa-signoffs/QA-F11-signoff.md`
- QG UX F11: `Agente UX UI/.../fase-11/quality/QG-correcciones.md`
- QG Arch F11: `Agente Arquitecto de Software/.../fase-11/quality/QG-correcciones.md`
- Deuda QA F10: `QA Automation Engineer/.../fase-10/deuda-tecnica/` (DT-F10-001, DT-F10-002)
- Deuda QA F9: `QA Automation Engineer/.../fase-9/deuda-tecnica/` + `QA-F9-handoff-pm.md`
- CO-F7-001: `outputs/laborregamarket/fase-7/change-orders/CO-F7-001-modelo-radio-mapa.md`
- CO-F6-001: `outputs/laborregamarket/fase-6/change-orders/CO-F6-001-sprint-confiabilidad.md`
- Loader borrega: `outputs/laborregamarket/comun/brand/loader-borrega/`
- Bitácora: `outputs/laborregamarket/historial/OBSERVABILITY.md`
- Handoff UX Fase 6: `outputs/laborregamarket/fase-6/handoff-ux-ui.md`
- Handoff Arquitecto Fase 6: `outputs/laborregamarket/fase-6/handoff-arquitecto.md`
- Deuda DevOps: `Agente DevOps/.../comun/deuda-fases-previas.md`
- Impacto QA: `QA Automation Engineer/.../fase-5/deuda-tecnica-fases-previas/IMPACTO-NO-ATENDER.md`
- Deuda UX (implementación FE): `Agente UX UI/.../fase-6/handoff-frontend-fase-6.md`
- Deuda Arquitecto (implementación BE): `Agente Arquitecto/.../fase-6/handoff-backend-fase-6.md`
- CO-F5-001: `outputs/laborregamarket/fase-5/change-orders/CO-F5-001-revertir-google-maps.md`
