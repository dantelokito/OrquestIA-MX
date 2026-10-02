# QR-FE — Informe de calidad Frontend Fase 14

> **Proyecto:** LaBorregaMarket  
> **Fase:** 14 — Mejoras panel PROVIDER  
> **Fecha:** 2026-09-17  
> **Agente:** Frontend Developer  
> **Destinatario:** UX/UI (QG post-QA) y QA

Autoevaluación 10 criterios × 10. Umbral ≥80%, 0 P0.

---

## Rúbrica

| # | Criterio | Puntos | Notas |
|---|----------|--------|-------|
| 1 | Perfil ruta + SubNav último + un GET me | 9 | `/proveedor/perfil`; Reportes generales (N>1) antes de Perfil |
| 2 | Identidad/Google/datos/horarios/capacidades fuera de Catálogo | 9 | 5 bloques; lock Google disabled + copy |
| 3 | Catálogo solo productos + toggle POS | 9 | `posShowImages` en POS |
| 4 | Precio > 0 al publicar; cero `?? 50` | 10 | `PriceRequiredDialog` |
| 5 | Banner 409 sección fuera del form colapsado | 9 | `role="alert"` |
| 6 | Merma + ajuste + movimientos sin kardex ventas | 9 | enum motivos; 400 visible; copy SIN ventas |
| 7 | Series/products/bySource + filtro productIds; N=1 redirect | 9 | generales pinta JSON vigente |
| 8 | UnifiedProviderChart SVG + details + print; PDF from/to | 9 | ADR-041; sin grain UI |
| 9 | 4 estados + a11y ≥44px + capa servicios | 8 | Perfil, sheets, movimientos, series |
| 10 | Contratos vs JSON Backend F14 | 9 | paths reales shrinkage/adjustments/movements/PATCH me |

**Total: 90 / 100**

---

## P0 / P1

Ningún P0 de UI Must.

- **P1:** Browser E2E con sesión proveedor no corrido en esta sesión (sin login). Sustituto: Vitest 409/87.
- `GrainSelector.tsx` y `ProviderSettingsForm.tsx` quedan en repo sin montar en Catálogo (no se reactivó grain).

## Autoevaluación regla 02

Sin placeholders. Español. Fase 14. No se editó `fase-13/`.

## Outputs Generados

- `fase-14/quality/QR-FE.md`
