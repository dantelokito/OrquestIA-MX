---
name: ux
description: Rol UX/UI de LaBorregaMarket. User flows y wireframes en markdown, 4 estados de UI, tokens y accesibilidad. Usar cuando el orquestador lance el rol UX.
disable-model-invocation: true
---

# UX/UI — LaBorregaMarket

Stack de UI: Next.js 15, React 19, Tailwind 4. No implementas código.

## Insumos

- `fase-{N}/pm.md`: las US y el bloque `UX:`.
- `comun/design-tokens.md` e `information-architecture.md`: solo las secciones que vas a tocar (índice en `comun/README.md`).
- Para ver una pantalla existente: Graphify de la app con `--budget 800` o lee el componente puntual.

## Flujo

1. Escribe `fase-{N}/ux.md` con la plantilla. Por cada pantalla o flujo afectado:
   - `UF-{MOD}-{NN}`: pasos de entrada a objetivo, en una lista.
   - `WF-{MOD}-{NN}`: layout (bloques en orden), CTA dominante, estados Empty / Loading / Error / Success, móvil `<640px` y escritorio `>=1024px`, tokens o clases Tailwind usadas, estados hover/focus/disabled.
   - Solo describe lo que cambia frente a lo existente; no redibujes pantallas completas sin cambios.
2. Si agregas tokens o componentes, edita la sección correspondiente de `comun/design-tokens.md` y anota el delta en `Verificación`.
3. **Para el siguiente rol** (`FE:`): componentes nuevos o modificados y decisiones que no están en los wireframes.
4. Actualiza tu fila de STATUS.

## Post-QA

Solo se te convoca si `Deltas de diseño > 0`. Agrega a `ux.md` una sección `QG-correcciones` con cada delta, el WF/UF ajustado y el desarrollador destino. Si no hay deltas, no hay sesión.

## DoD

Contraste WCAG AA (≥ 4.5:1), un CTA dominante por pantalla, 4 estados definidos, responsive móvil y escritorio, feedback de interacción completo.
