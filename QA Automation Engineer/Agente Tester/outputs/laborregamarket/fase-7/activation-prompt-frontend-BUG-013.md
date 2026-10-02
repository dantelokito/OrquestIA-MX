# Prompt de activación Frontend — BUG-013 (mejora UX)

Copiar el bloque siguiente y pegarlo en el chat del agente Frontend.

```
[INICIO DE INTERACCIÓN FRONTEND — BUG-013 Mejora FilterBar colapsable]

═══════════════════════════════════════════════════════════════
CONTEXTO
═══════════════════════════════════════════════════════════════

Producto: LaBorregaMarket
Código: C:\Users\PC GAMER\LaBorregaMarket
Ambiente: http://localhost:8080

Ticket QA: BUG-013 — Major, P2 (mejora UX, no Blocker)
Handoff: Agente Tester\outputs\laborregamarket\fase-7\QA-F7-handoff-frontend.md
Bug report: Agente Tester\outputs\laborregamarket\fase-7\bug-reports\BUG-013.md

PRERREQUISITO: BUG-012 cerrado (FilterBar acoplado al Header, fuera
de .explore-main-scroll). No implementar colapso sobre layout roto.

Mejora: al scroll HACIA ABAJO en .explore-main-scroll, ocultar
FilterBar (chips + «Usar mi ubicación») para dar más espacio al mapa
y a las cards. Mostrar pestaña ligera CENTRADA para re-expandir.
Los filtros activos NO se pierden al colapsar.

═══════════════════════════════════════════════════════════════
COMPORTAMIENTO OBLIGATORIO
═══════════════════════════════════════════════════════════════

1. Colapso automático:
   - Escuchar scroll de .explore-main-scroll
   - scrollTop supera umbral (~80–120px) y delta positivo → colapsar
   - Transición suave; respetar prefers-reduced-motion

2. Pestaña de re-expansión:
   - Visible solo cuando FilterBar colapsado
   - Centrada bajo Header (~24–32px visual; min-h 44px móvil)
   - aria-expanded, aria-label "Mostrar filtros"
   - Click/tap → expandir FilterBar completo

3. Re-expansión alternativa:
   - Scroll hacia arriba cerca del tope (scrollTop < umbral) → expandir
   - Opcional pero recomendado

4. Persistencia de filtros:
   - NO resetear verified/category/chips al colapsar
   - URL sin cambio por colapso/expand
   - Badge en pestaña si hay filtros activos (recomendado)

5. Archivos sugeridos:
   - ExplorePageClient.tsx — estado + listener scroll
   - FilterBar.tsx — variante colapsada + pestaña FilterBarExpandTab
   - globals.css — tokens --explore-filterbar-h, transición

═══════════════════════════════════════════════════════════════
NO TOCAR
═══════════════════════════════════════════════════════════════

- API GEO / backend
- CO-F7-001: pan/zoom NO actualizan radio ni GET
- Header (no colapsar logo/búsqueda/usuario)
- CompactAddressBar (sigue scrolleando con mapa/lista)
- MapFocusGuard / EC-GEO-17
- Preview, login, favoritas

═══════════════════════════════════════════════════════════════
DoD
═══════════════════════════════════════════════════════════════

1. HP-GEO-19 Pass: scroll down colapsa FilterBar; mapa/cards ganan altura
2. EC-GEO-19 Pass: pestaña expande; filtros activos siguen aplicados
3. EC-GEO-18 Pass (regresión BUG-012)
4. EC-GEO-17 Pass (regresión BUG-011)
5. Avisar a QA para cerrar BUG-013

[FIN DE INTERACCIÓN FRONTEND — BUG-013]
```
