# Prompt de activación Frontend — BUG-012

Copiar el bloque siguiente y pegarlo en el chat del agente Frontend.

```
[INICIO DE INTERACCIÓN FRONTEND — BUG-012 Critical FilterBar chrome]

═══════════════════════════════════════════════════════════════
CONTEXTO
═══════════════════════════════════════════════════════════════

Producto: LaBorregaMarket
Código: C:\Users\PC GAMER\LaBorregaMarket
Ambiente: http://localhost:8080

Ticket QA: BUG-012 — Critical, P1
Handoff: Agente Tester\outputs\laborregamarket\fase-7\QA-F7-handoff-frontend.md
Bug report: Agente Tester\outputs\laborregamarket\fase-7\bug-reports\BUG-012.md

En /explorar, los chips de filtro (Orgánico, Mayoreo, A domicilio,
Verificado, Frutas, Verduras, Agrícola) y el botón «Usar mi ubicación»
se van con el scroll. Deben quedar acoplados al Header.
CompactAddressBar, mapa y lista SÍ scrollean.

Causa: FilterBar está DENTRO de .explore-main-scroll (overflow-y: auto
del fix BUG-011). sticky top-[80px] no ancla al Header.

═══════════════════════════════════════════════════════════════
FIX OBLIGATORIO — chrome FilterBar fuera del scroll
═══════════════════════════════════════════════════════════════

1. ExplorePageClient.tsx:
   - Wrapper flex flex-1 min-h-0 flex-col
   - Sacar FilterBar de .explore-main-scroll (shrink-0, hermano, no hijo)
   - Dentro del scroll: CompactAddressBar + mapa + explore-results-panel

2. FilterBar.tsx:
   - Quitar sticky top-[80px] (ya no scrollea)

3. ExploreMap.tsx:
   - NO tocar MapFocusGuard salvo si el selector .explore-main-scroll
     deja de existir (debe seguir existiendo)

═══════════════════════════════════════════════════════════════
NO TOCAR
═══════════════════════════════════════════════════════════════

- API GEO / backend
- CO-F7-001: pan/zoom NO actualizan radio ni GET
- FitCircle toBounds (BUG-010)
- Preview, login, favoritas
- No devolver el scroll al document.body (regresaría BUG-011)

═══════════════════════════════════════════════════════════════
DoD
═══════════════════════════════════════════════════════════════

1. EC-GEO-18: scroll ≥ 300px en .explore-main-scroll; chips + «Usar mi
   ubicación» siguen visibles bajo el Header (y ±5px)
2. EC-GEO-17 Pass: zoom no altera scroll del catálogo
3. HP-GEO-09 / HP-GEO-10 regresión Pass
4. Avisar a QA para cerrar BUG-012

[FIN DE INTERACCIÓN FRONTEND — BUG-012]
```
