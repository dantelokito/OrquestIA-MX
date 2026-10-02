# Prompt de activación Frontend — BUG-014 (mejora UX CompactAddressBar)

Copiar el bloque siguiente y pegarlo en el chat del agente Frontend.

```
[INICIO DE INTERACCIÓN FRONTEND — BUG-014 Mejora CompactAddressBar horizontal]

═══════════════════════════════════════════════════════════════
CONTEXTO
═══════════════════════════════════════════════════════════════

Producto: LaBorregaMarket
Código: C:\Users\PC GAMER\LaBorregaMarket
Ambiente: http://localhost:8080

Ticket QA: BUG-014 — Major, P2 (mejora UX, no Blocker)
Handoff: Agente Tester\outputs\laborregamarket\fase-7\QA-F7-handoff-frontend.md
Bug report: Agente Tester\outputs\laborregamarket\fase-7\bug-reports\BUG-014.md

Dependencia: NINGUNA (independiente de BUG-012 / BUG-013).

Mejora: compactar CompactAddressBar en /explorar. Los 3 controles
— buscar dirección, domicilios favoritos (#favorite-address) y
botón «Guardar dirección» — deben compartir UNA SOLA FILA horizontal
desde viewport ≥640px (tablet/desktop). Reducir altura vertical
de la banda de domicilio del paciente.

═══════════════════════════════════════════════════════════════
COMPORTAMIENTO OBLIGATORIO
═══════════════════════════════════════════════════════════════

1. Fila horizontal ≥640px:
   - #geocode-query + botón lupa + #favorite-address + botón Guardar
     en la MISMA fila (flex-row, items-center, h-11 uniforme)
   - Input flex-1 min-w-0; select ~160–200px shrink-0; botón shrink-0

2. Label «Favoritas»:
   - sr-only o aria-label en el select en tablet+ (≥640px)
   - NO label block encima del select en tablet/desktop

3. Padding reducido:
   - Sección: py-2 sm:py-3 (no py-4)
   - Meta/copy (ExploreCount, «Centro: …», errores) DEBAJO de la fila
     de controles, no entre ellos

4. Móvil <640px:
   - Stack permitido (buscar arriba; favoritas + guardar abajo)
   - NO forzar una sola fila en 360px si no cabe

5. Archivos sugeridos:
   - CompactAddressBar.tsx — flex-row desde sm:/md:; quitar lg:w-[280px]
   - FavoriteAddressSelect.tsx — variante inline; label responsive
   - globals.css — token opcional --explore-addressbar-controls-h

═══════════════════════════════════════════════════════════════
NO TOCAR
═══════════════════════════════════════════════════════════════

- API GEO / backend / endpoints /addresses
- CO-F7-001: pan/zoom NO actualizan radio ni GET
- FilterBar, Header, colapso BUG-013
- Selectores e2e: #geocode-query, #favorite-address, botón «Guardar dirección»
- MapFocusGuard / EC-GEO-17
- Preview, login redirect, prompt guardar favorita (HP-GEO-03)
- CompactAddressBar sigue dentro de .explore-main-scroll (scrollea con mapa)

═══════════════════════════════════════════════════════════════
DoD
═══════════════════════════════════════════════════════════════

1. HP-GEO-20 Pass: en 768×1024 y 1280×800, tres controles en una fila
2. EC-GEO-20 Pass: 360×640 stack OK; 640×800 altura banda controles ≤ ~56px
3. HP-GEO-03 Pass: regresión explore-geo.spec.ts (favoritas / login / prompt)
4. EC-GEO-17 / CO-F7-001 / HP-GEO-09 Pass: sin regresión
5. Avisar a QA para cerrar BUG-014

[FIN DE INTERACCIÓN FRONTEND — BUG-014]
```
