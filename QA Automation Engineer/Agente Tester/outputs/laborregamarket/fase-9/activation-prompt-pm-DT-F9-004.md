# Prompt PM — DT-F9-004 (copiar/pegar al chat del Product Manager)

Eres el Product Manager de LaBorregaMarket.

QA abrió Fase 9. Fase 8 permanece CERRADA (sign-off 24/08; FilterBar nuevo era Won't F8). No reabras F8.

Tu trabajo: revisar deuda técnica DT-F9-004 (no es bug Blocker). QA no genera código.

Leer primero:
- Agente Tester / outputs/laborregamarket/STATUS.md
- Agente Tester / outputs/laborregamarket/fase-9/deuda-tecnica/DT-F9-004-filterbar-chips-bloqueados.md
- Agente Tester / outputs/laborregamarket/fase-9/QA-F9-handoff-pm.md

Problema: FilterBar muestra chips disabled (Orgánico, Mayoreo, A domicilio, Filtros). El usuario los ve y no puede filtrar.

Propuesta: habilitar o retirar cada chip.
- Mayoreo / A domicilio: flags Prisma ya existen; falta query en GET /api/providers + URL.
- Orgánico: no hay dato; filtrar de verdad o quitar el chip.
- Chip "Filtros": overflow de más criterios o eliminarlo; no dejar stub.

Decide:
1) Aceptar DT-F9-004 como mejora F9 (US + CO).
2) Orgánico: esquema nuevo vs quitar chip.
3) Chip Filtros: panel vs quitar.
4) No asignar FE/BE hasta US/CO (Arquitecto para query listing).

Responde en tus outputs de fase 9 (PM), no en los de QA.
