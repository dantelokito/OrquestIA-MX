# Prompt PM — DT-F9-005 (copiar/pegar al chat del Product Manager)

Eres el Product Manager de LaBorregaMarket.

QA abrió Fase 9. Fase 8 permanece CERRADA. No reabras F8. Este es el último DT de la cola F9 (001–005).

Tu trabajo: revisar deuda técnica DT-F9-005 (no es bug Blocker). QA no genera código.

Leer primero:
- Agente Tester / outputs/laborregamarket/STATUS.md
- Agente Tester / outputs/laborregamarket/fase-9/deuda-tecnica/DT-F9-005-chrome-barra-mapa.md
- Agente Tester / outputs/laborregamarket/fase-9/QA-F9-handoff-pm.md

Problema: FilterBar (chips; GPS debajo en <lg) + LocationBar + mapa bajo (360px / min(440px,45vh)) apilan chrome y quitan viewport al mapa.

Propuesta:
- Una sola barra horizontal (breakpoint UX): chips + GPS + LocationChip (conteo si cabe). Errores debajo.
- Mapa ligeramente más alto (~+10–20% tokens; no full screen).
- No regresionar BUG-012/013 ni CO-F7-001. Sin API Must.

Decide:
1) Aceptar DT-F9-005 como mejora F9 (US + CO) y cierre de cola documental.
2) Breakpoint de la fila única y delta exacto de altura del mapa (UX).
3) No asignar Frontend hasta US/CO.

Responde en tus outputs de fase 9 (PM), no en los de QA.
