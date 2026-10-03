# Validación UX 00–01 y DoD — Fase 13

> **Fecha:** 16/09/2026  
> **Rol:** UX/UI Designer  
> **Dictamen recepción PM:** **CONFORME** (no hay `RETORNO-pm-fase-13.md`)

## Checklist 00–01

| Check | Resultado |
|-------|-----------|
| Handoff PM existe y completo | Sí `handoff-ux-ui-fase-13.md` |
| PRD alcance + MoSCoW | Sí |
| US formato Como/Quiero/Para + GWT éxito y error | Sí (13 Must) |
| QG-cobertura-UX | Sí |
| Placeholders `[Insertar]` / TODO en inputs | No detectados en lectura de PRD/US/handoff |
| Contradicción F12 vs F13 | Registrada: STATUS UX estaba en 12; se actualiza a 13. `fase-12/` solo lectura. QG F12 no se reabre |

## DoD diseño Must

- [x] Admin GLOBAL+LOCAL, inhabilitar, sin DELETE
- [x] Editar GLOBAL y LOCAL (unidad/factor de oferta)
- [x] Eliminar=ocultar; bandeja Restaurar
- [x] Precio oferta + historial
- [x] Reportes inventario sucursal y N>1 actuales
- [x] 4 estados admin listado y bandeja (+ reportes inventario)
- [x] Responsive y WCAG AA; CTA dominante
- [x] Cliente sin pantallas nuevas
- [x] No rediseño Explorar/mapa/reseñas/WhatsApp/`/fruteria`/Cloudinary/kardex/hard-delete

## Tokens / IA

Delta real: nuevos componentes de fila, bandeja, drawer GLOBAL, pestaña Inventario. Bump **v0.13.0**.

## Quality Gate post-QA

`QG-correcciones.md` **no aplica** hasta QA APROBADO F13.
