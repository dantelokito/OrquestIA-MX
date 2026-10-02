# Handoff QA → Backend — LaBorregaMarket F6/F7

> **De:** QA Tester Senior  
> **Para:** @Backend Developer  
> **Proyecto:** LaBorregaMarket v0.7.1 (código F7; ticket documentado F6)  
> **Fecha:** 19/08/2026  
> **Ambiente:** `http://localhost:8080`  
> **Código:** `C:\Users\PC GAMER\LaBorregaMarket`

---

## Estado

Sign-off F6 **EN PROGRESO** — **no APROBADO**. Zero Blocker **FAIL** (BUG-010 escalado; es Frontend).

Tu cola de **código:** **un ticket**. El resto del slice B (JSON, RBAC) ya pasó.

Ticket: [BUG-009](./bug-reports/BUG-009.md) — Major, P1.

Prompt de activación: [activation-prompt-backend-BUG-010.txt](./activation-prompt-backend-BUG-010.txt)

---

## BUG-010 — fuera de alcance Backend

[BLOCKER-010](./bug-reports/BUG-010.md) es un **TypeError de Leaflet en el cliente** (`FitCircle` llama `L.circle().getBounds()` sin mapa). **No es un fallo de API.**

| Acción Backend | Requerido |
|----------------|-----------|
| Cambiar `GET /api/providers` | **No** |
| Cambiar clamp `radiusKm` 1–25 | **No** |
| Cambiar bbox MTY | **No** |
| Workaround server-side para Leaflet | **No** |

El fix es 100% Frontend (`ExploreMap.tsx`). Si te llegó este ticket por error, ignóralo para implementación; Frontend lo cierra.

**Smoke opcional post-fix FE** (verificar que GEO sigue sano; no es tu entrega):

```bash
curl -s -o /dev/null -w "%{http_code}" "http://localhost:8080/api/providers?lat=25.7475&lng=-100.2830&radiusKm=10"
# Esperado: 200
```

---

## Qué falló (tu ticket BUG-009)

`GET /api/provider/reports.pdf?grain=day&date=2020-01-01` autenticado PROVIDER → **500** `{"error":"Error interno"}`.

El JSON hermano `GET /api/provider/reports?grain=day&date=2020-01-01` → **200** (`empty: true`). El Must PDF (`US-DASH-06` / `API-PROVIDER-REPORTS-PDF-01`) es el único hueco de tu módulo.

En UI el botón **Descargar PDF** está visible y dispara el GET; el 500 es del endpoint, no del FE.

---

## Archivos

| Ruta | Nota |
|------|------|
| `src/app/api/provider/reports.pdf/route.ts` | `GET` + `handleOrderRouteError` enmascara el stack |
| `src/lib/reports/pdf.ts` | `renderProviderReportPdf` (pdfkit) |
| `next.config.ts` | sin `serverExternalPackages` |

`pdfkit` ^0.19.1 **sí** está en `package.json`. Control fuera de Next:

```text
node -e "require('pdfkit')..."  →  OK bytes 1338 %PDF
```

Hipótesis: webpack/Next bundlea pdfkit y pierde AFM/fonts. Pista: `serverExternalPackages: ['pdfkit']` y/o loguear el error real (hoy `handleRouteError` devuelve solo `"Error interno"`).

---

## Contrato esperado

- HTTP **200** `application/pdf`
- `Content-Disposition: attachment; filename="reporte-*.pdf"`
- Magic bytes `%PDF`
- Periodo vacío: copy “Sin ventas en este periodo.”

---

## No tocar

- JSON `GET /api/provider/reports` (TC-REP-001..007, 009, 010 Pass)
- RBAC 401/403 reports y reports.pdf (TC-RBAC-026..030 Pass)
- **GEO** (`GET /api/providers`, clamp, bbox, `meta.total`) — BUG-010 es Frontend
- Contacto / Redis (BUG-005 cerrado)
- Leaflet, `fitBounds`, `ExploreMap.tsx`

---

## DoD de re-prueba QA

Cuando el 200 PDF esté en `:8080`, avisar a QA. Comando:

```bash
cd "C:\Users\PC GAMER\OneDrive - Universidad Autonoma de Nuevo León\Documents\Agentes de desarrollo test\QA Automation Engineer\Agente Tester\outputs\laborregamarket\tests"
PLAYWRIGHT_BASE_URL=http://localhost:8080 npx playwright test tests/api/reports.spec.ts -g "TC-REP-008" tests/e2e/dashboard-reports.spec.ts -g "HP-DASH-06" --workers=1
```

Criterio de cierre BUG-009: ambos Pass. No se firma F6 hasta que Frontend cierre también BUG-010 (Blocker Explorar).
