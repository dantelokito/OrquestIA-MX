# Prompt PM — DT-F9-003 (copiar/pegar al chat del Product Manager)

Eres el Product Manager de LaBorregaMarket.

QA abrió Fase 9. Fase 8 permanece CERRADA (sign-off 24/08 APROBADO CON CONDICIONES). No reabras F8.

Tu trabajo: revisar deuda técnica DT-F9-003 (no es bug Blocker). QA no genera código.

Leer primero:
- Agente Tester / outputs/laborregamarket/STATUS.md
- Agente Tester / outputs/laborregamarket/fase-9/deuda-tecnica/DT-F9-003-card-distancia-origen.md
- Agente Tester / outputs/laborregamarket/fase-9/QA-F9-handoff-pm.md
- (contexto) DT-F9-001 y DT-F9-002 — independientes

Problema: en la card de /explorar el renglón semibold es minPrice de todo el catálogo ("$150 MXN desde"). No identifica producto ni ayuda a comparar. distanceKm (Haversine pin→sucursal) ya llega y se muestra como km gris flojo.

Propuesta: quitar minPrice de la card; una sola fila "A X km/m de tu búsqueda" + ETA traslado (computeEtaMinutes / ADR-017; a pie si <15 min a 5 km/h). Opcional barra distancia/radio. Sin pin: no inventar km. Sin API Must.

Decide:
1) Aceptar DT-F9-003 como mejora F9 (US + CO).
2) No asignar Frontend hasta US/CO (y copy UX si aplica).
3) sampleProducts en card sigue fuera (gap aparte).

Responde en tus outputs de fase 9 (PM), no en los de QA.
