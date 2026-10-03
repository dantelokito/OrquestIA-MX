# Validación UX 00–01 y DoD — Fase 14

> **Fecha:** 17/09/2026  
> **Rol:** UX/UI Designer  
> **Dictamen recepción PM:** **CONFORME** (no hay `RETORNO-pm-fase-14.md`)

## Paso 0 Graphify

| Grafo | Resultado |
|-------|-----------|
| Orquestación | Fase 14 activa (PM); `handoff-ux-ui-fase-14.md` y 14 US Must indexados |
| LaBorregaMarket | `SubNavProveedor`, `getMyBusiness`, `ProviderSettingsForm`, `InventoryEntry`, `ReportsView` presentes. Merma **no** existe en código (`main` @ `0eda84c`) |

## Checklist 00–01

| Check | Resultado |
|-------|-----------|
| Handoff PM existe y completo | Sí `handoff-ux-ui-fase-14.md` |
| PRD alcance + MoSCoW | Sí; Must = 14 US panel PROVIDER |
| US formato Como/Quiero/Para + GWT éxito y error | Sí (14 Must) |
| QG-cobertura-UX | Sí |
| Placeholders `[Insertar]` / TODO en inputs PM | No detectados en PRD/US/handoff leídos |
| Contradicción STATUS | Registrada: STATUS UX estaba en 13; se actualiza a **14**. `fase-13/` solo lectura. QG F13 no se reabre |
| PRODUCT.md «Fase 14+ canales» | **No** es el alcance Must. Must = mejoras panel PROVIDER |

## DoD diseño Must

- [x] SubNav Perfil extremo derecho (después de Reportes generales si N>1; justificado: uso esporádico)
- [x] Perfil: 5 bloques, un CTA por bloque, Google locked vs editable, datos inline AMM, horarios 7 días, capacidades + prep/delivery
- [x] Catálogo sin identidad; `posShowImages` en POS
- [x] Precio GLOBAL > 0; 409 sección visible
- [x] Sheets merma/ajuste; Movimientos sin copy de ventas
- [x] Series generales; gráfica unificada; PDF from/to; N=1 redirect (sin pantalla nueva)
- [x] 4 estados Perfil, Movimientos, series, sheets
- [x] Responsive y WCAG AA; targets ≥44px; gráficas `role="img"` + details
- [x] Cliente sin pantallas nuevas; no Explorar/mapa/WhatsApp/Cloudinary/kardex ventas/grain/caja/costos

## Tokens / IA

Delta real: Perfil, split Catálogo/POS, merma/ajuste/movimientos, series y PDF. Bump **v0.14.0**.

## Quality Gate post-QA

`QG-correcciones.md` **no aplica** hasta QA APROBADO F14.

## Excepciones (no bloquean diseño)

- Arquitecto en paralelo: paths PATCH datos negocio y persistencia merma/ajuste no están en este chat. FE no inventa contratos.
- Librería vs SVG unificado: decisión Arch; UX fija a11y/print.
- Should: comparativa sucursal, admin PATCH datos, `SELECT FOR UPDATE` — no diseñados.
