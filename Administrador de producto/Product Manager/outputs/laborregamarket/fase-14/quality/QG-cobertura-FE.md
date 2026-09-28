# QG cobertura Frontend — Fase 14

> **Rol:** Product Manager (gate de cobertura, **no** `QG-correcciones` post-QA).
> **Fecha:** 17/09/2026
> **Implementación:** bloqueada hasta handoff UX → Frontend **y** contrato API. Este PM **no** implementa.

## Must

- [ ] Ruta `/proveedor/perfil` + entrada en `SubNavProveedor`. Remount por `activeProviderId` F11 **intacto**.
- [ ] Mover (no duplicar) `MediaUpload` logo/portada y `BrandColorPicker` a Perfil. Un fetch de `getMyBusiness` compartido al montar Perfil (`BL-269`).
- [ ] Extraer Google, horarios, capacidades, prep y delivery a Perfil. Catálogo (`ProveedorPageClient`) = `ProviderCatalogF10` (+ bandeja F13) **sin** bloques A/B/D.
- [ ] `PosImagesToggle` en página POS; fuera de Catálogo.
- [ ] Formulario datos de negocio con validación alineada a geo AMM; mostrar 400 de API.
- [ ] Editor `openingHours` 7 días; toggles de capacidades booleanos explícitos.
- [ ] Sheets merma y ajuste; pintar 400 de saldo/conteo. Listado Movimientos con 4 estados y filtros.
- [ ] Reportes generales: render `series`, `products`, `bySource`; filtro `productIds`. N=1: redirect + 403 intactos.
- [ ] Unificar `BarChartIlustrativo` / `ReportBarChart` (o librería si Arch lo decide). Conservar `<details>` y CSS print.
- [ ] Botón PDF en reportes sucursal con `from`/`to`; `showPdf` true en esa vista. No montar `GrainSelector`.
- [ ] Quitar `price: item.price ?? 50`. Activar GLOBAL exige precio > 0 en UI **y** respeta 400 de API.
- [ ] `sectionError` (o sucesor) visible con el form Nueva sección cerrado.
- [ ] Cuatro estados UI en Perfil, Movimientos, series de generales. Capa servicios/hooks (sin `fetch` en la vista).
- [ ] Tests de componente: Perfil lock Google; merma 400; catálogo sin identidad; no $50.

## No hacer

- Rediseñar Explorar, mapa, reseñas, WhatsApp cliente.
- Instrumentar POS para kardex.
- Gráficas de margen / semanal / periodo anterior.
- Volver a poner identidad en Catálogo «por compatibilidad» además de Perfil (duplicado).
- Prompt de implementación desde este QG: el código lo escribe Frontend **después** de handoff UX.
