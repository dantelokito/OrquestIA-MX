# QG cobertura UX — Fase 14

> **Rol:** Product Manager (gate de cobertura, **no** `QG-correcciones` post-QA).
> **Fecha:** 17/09/2026
> **Implementación de diseño:** cuando el orquestador abra chat UX. **No** implementar la app.

## Must

- [ ] `SubNav` incluye **Perfil** (`/proveedor/perfil`) al extremo derecho después de Ventas, salvo justificación documentada. Catálogo **no** muestra logo, portada, colores, Google, horarios, prep ni delivery.
- [ ] Perfil: bloques Identidad visual, Google Maps, Datos del negocio, Horarios, Capacidades + Operación. Un CTA dominante por bloque. Targets ≥44px.
- [ ] Google: estado **locked** vs editable evidente si `isVerified === false`. Copy de que Maps/reseñas requieren verificación.
- [ ] Datos del negocio: errores inline de coords (fuera de AMM) y 400 de validación; no toast fugaz como único canal.
- [ ] Horarios: editor 7 días alineado a lo que `HoursTable` ya muestra al cliente.
- [ ] Capacidades: toggles WhatsApp, tarjeta, mayoreo, menudeo + prep + delivery, con ayuda de impacto en Explorar (sin rediseñar Explorar).
- [ ] POS: toggle fotos de card visible en `/proveedor/pos`. Catálogo no lo ofrece.
- [ ] Inventario: sheet merma (cantidad, motivo enum, nota); sheet conteo (saldo sistema vs conteo); error 400 si merma > saldo o conteo < 0.
- [ ] Sub-pestaña/sección **Movimientos**: entradas + mermas + ajustes; filtros tipo/fecha; copy que **no** prometa ventas POS.
- [ ] Reportes generales N>1: tendencia `series`, ranking `products`, mix `bySource`, filtro productos. N=1: redirect intacto (sin pantalla nueva).
- [ ] Ventas: tendencia + mix canal + top; `<details>` tabla accesible; print.
- [ ] PDF: botón visible en reportes de sucursal; sin selector `grain`.
- [ ] Activar GLOBAL sin precio: forzar captura de precio > 0; nunca publicar $50 silencioso.
- [ ] 409 al borrar sección con productos: mensaje visible con el form «Nueva sección» **cerrado**.
- [ ] Cuatro estados (empty, loading, error, success) en Perfil, Movimientos, reportes generales (series) y sheets de merma/ajuste.
- [ ] Responsive móvil/escritorio. Contraste WCAG 2.1 AA. Teclado.

## Tokens / baseline

Reusar tokens F10–F13 del panel proveedor. No copiar look slate de admin analytics. No rediseñar `/explorar`, mapa, reseñas ni WhatsApp cliente. Media logo/portada: controles F10 disco local.

## No hacer

- Kardex de ventas/POS/Encargar/descarte en Movimientos.
- Gráficas de margen, semanal, comparativa periodo anterior, agrupación por sección.
- Reactivar `GrainSelector` en la UI.
- Flujo de re-verificación o carga de documentos al cambiar dirección.
- Cloudinary/S3. Corte de caja. Cajeros. Costos.
