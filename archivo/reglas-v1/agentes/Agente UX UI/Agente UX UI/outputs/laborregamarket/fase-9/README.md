# Fase 9 — Deuda Explorar (diseño)

> **Producto:** LaBorregaMarket v0.9.0  
> **Fecha diseño:** 25/08/2026  
> **Fecha clausura UX:** 28/08/2026  
> **Estado:** **Cerrada documentalmente** — solo lectura. Quality Gate UX emitido (88/100, 0 P0). Sign-off QA final pendiente (Arquitecto `REVIEW-ARCH` + Tester).

`fase-8/` **solo lectura** (sign-off intacto). `fase-7/` solo lectura. `fase-6/` congelada. Pagos/CFDI Won't (`CO-F6-001`). **`CO-F7-001` intacto** (pan ≠ radio). Clamp 0.5–10 y mapa México F8 se conservan. **`CO-F9-001`** absorbe DT-F9-001…005.

## Alcance

| US | Superficie |
|----|------------|
| US-EXPLORE-08 | Preview **in-card** (animación; mismos triggers F8) |
| US-EXPLORE-09 | Header typeahead solo fruterías; radio completo; chip + tacha |
| US-EXPLORE-10 | Card: distancia + ETA; sin `minPrice` visual |
| US-EXPLORE-11 | Mayoreo/Domicilio filtran; Orgánico y «Filtros» retirados |
| US-GEO-24 | Chrome una barra horizontal (`md+`) + mapa ~+10–20% |

## User flows

| ID | Archivo |
|----|---------|
| UF-GEO-01 | [`user-flows/UF-GEO-01-explorar-f9.md`](./user-flows/UF-GEO-01-explorar-f9.md) |
| UF-EXPLORE-08 | [`user-flows/UF-EXPLORE-08-preview-in-card.md`](./user-flows/UF-EXPLORE-08-preview-in-card.md) |
| UF-EXPLORE-10 | [`user-flows/UF-EXPLORE-10-card-distancia.md`](./user-flows/UF-EXPLORE-10-card-distancia.md) |

## Wireframes

| ID | Archivo |
|----|---------|
| WF-explorar-preview-in-card | [`wireframes/WF-explorar-preview-in-card.md`](./wireframes/WF-explorar-preview-in-card.md) |
| WF-explorar-typeahead | [`wireframes/WF-explorar-typeahead.md`](./wireframes/WF-explorar-typeahead.md) |
| WF-explorar-card-distancia | [`wireframes/WF-explorar-card-distancia.md`](./wireframes/WF-explorar-card-distancia.md) |
| WF-explorar-filterbar-chips | [`wireframes/WF-explorar-filterbar-chips.md`](./wireframes/WF-explorar-filterbar-chips.md) |
| WF-explorar-chrome-mapa | [`wireframes/WF-explorar-chrome-mapa.md`](./wireframes/WF-explorar-chrome-mapa.md) |

## Handoff

[`handoff-frontend-fase-9.md`](./handoff-frontend-fase-9.md) — **cinco partes**.

Contratos Arquitecto (no inventar APIs): `Agente Arquitecto/.../fase-9/api/API-GEO-01.md`, `API-PROVIDER-PREVIEW-01.md`, `API-EXPLORE-NOTES-01.md`.

## Quality Gate

| Documento | Veredicto |
|-----------|-----------|
| [`quality/REVIEW-UX.md`](./quality/REVIEW-UX.md) | APROBADO CON OBSERVACIONES — 88/100 · 0 P0 |
| [`quality/READY-FOR-QA.md`](./quality/READY-FOR-QA.md) | Estafeta QA (condicionada a `REVIEW-ARCH` F9) |

Implementación FE: `Agente frontend/.../fase-9/quality/QR-FE.md` (92/100, insumo).

## Decisiones UX F9

| ID | Decisión |
|----|----------|
| D-F9-UX-1 | Preview = expansión **dentro** del card. Triggers F8 (300 / 150 / 500). Sin popover desanclado. |
| D-F9-UX-2 | Typeahead: filas cover/logo + `businessName`; debounce `GET /api/providers?q&geo&limit=10`. Sin filas SKU. |
| D-F9-UX-3 | Card: sin «$X MXN desde»; una fila distancia + ETA (ADR-017). Should: barra `distanceKm/radiusKm`. |
| D-F9-UX-4 | Mayoreo → `offersWholesale=true`; A domicilio → `offersDelivery=true`. Retirar Orgánico y «Filtros». |
| D-F9-UX-5 | Chrome: **una barra** desde `md` (≥768px); errores debajo; móvil wrap / 2ª fila + chips scroll-x. |
| D-F9-UX-6 | Mapa: móvil **420px**; desktop **`min(520px, 52vh)`**. Overlay radio intacto. |

## Fuera de alcance

Typeahead SKUs, `sampleProducts` en card, schema orgánico, DASH, Maps JS, Places, clustering, pan→radio, pagos/CFDI, reopen F8, recorte `US-EXPLORE-05`.

Baseline solo lectura: F8 `UF-GEO-01` / `UF-EXPLORE-07` / wireframes P1–P4. Contenido preview F7 `US-EXPLORE-05`.

**No editar** esta fase salvo append en `historial/` o correcciones documentales acordadas por PM.

---

*Índice Fase 9 — Agente UX/UI Designer, LaBorregaMarket v0.9.0 — clausurada 28/08/2026.*
