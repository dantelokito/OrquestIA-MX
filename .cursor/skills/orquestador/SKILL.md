---
name: orquestador
description: >-
  Coordina el ciclo multi-agente de OrquestIA-MX: consulta Graphify y
  comun/PROCESO.md, lanza cada rol en un contexto nuevo, valida handoffs
  y no avanza si falla la validación cruzada. Usar cuando el usuario pida
  orquestar, ciclar fases, activar agentes, continuar el flujo PM/UX/Arch/BE/FE/QA/DevOps
  o reanudar trabajo por fases.
---

# Orquestador

Ciclo de trabajo del workspace raíz. Proceso vivo: `comun/PROCESO.md`. El código de la app no vive aquí: `C:\Users\PC GAMER\LaBorregaMarket`.

## Quick start

1. `graphify query "quién actúa en la fase activa"` sobre el grafo de orquestación (si no hay grafo de este repo: `comun/PROCESO.md` + `STATUS.md`).
2. `graphify query` de la tarea sobre el grafo de LaBorregaMarket (`--graph "C:\Users\PC GAMER\LaBorregaMarket\graphify-out\graph.json"`). Si falta ese `graph.json`: STOP y `graphify update .` en el repo de la app.
3. Cruzar STATUS solo para elegir el siguiente rol; no implementar en este hilo.
4. Lanzar **un subagente / chat limpio por rol**. Prompt mínimo:
   - resultado de ambos `graphify query`
   - ruta del handoff anterior
   - skill del rol
   - `.cursor/rules/graphify.mdc`
5. Validar con las reglas `00`–`03`. Si falla: handoff de retorno y no avances.
6. Actualizar el STATUS del workspace que entregó. `graphify update .` aquí; si el rol tocó código de la app, también `graphify update .` en LaBorregaMarket.
7. Repetir hasta bloqueo real o DoD de fase.

Prohibido: implementar FE/BE/QA/UX/Arch/DevOps/PM en la ventana del orquestador.

## Cadena

```
PM → UX/UI + Arquitecto (paralelo)
   → Backend (tras handoff-backend-fase-N)
   → Frontend (tras handoff-frontend-fase-N)
   → QA ↻ FE/BE (solo con EVIDENCIA-BUG-NNN)
   → QA APROBADO → PM (no cierra)
   → UX + Arquitecto (QG-correcciones, ventanas nuevas)
   → PM cierra / promueve
   → DevOps (PR listo, sin merge)
   → Humano mergea / prod
```

## Skills por rol

| Rol | Skill |
|-----|-------|
| PM | `Administrador de producto/Product Manager/.cursor/skills/product-manager/SKILL.md` |
| UX/UI | `Agente UX UI/Agente UX UI/.cursor/skills/ux-ui-designer/SKILL.md` |
| Arquitecto | `Agente Arquitecto de Software/Agente Arquitecto/.cursor/skills/software-architect/SKILL.md` |
| Backend | `Agente backend/Agente backend/.cursor/skills/backend-developer/SKILL.md` |
| Frontend | `Agente frontend/Agente Frontend/.cursor/skills/frontend-developer/SKILL.md` |
| QA | `QA Automation Engineer/Agente Tester/.cursor/skills/qa-tester-senior/SKILL.md` |
| DevOps | `Agente DevOps/Agente DevOps/.cursor/skills/devops-cloud-engineer/SKILL.md` |

Cada subagente escribe solo en su `outputs/laborregamarket/fase-{N}/`.

## Queries Graphify

Orquestación:

```
graphify query "quién actúa en la fase activa" --graph "C:\Users\PC GAMER\OneDrive - Universidad Autonoma de Nuevo León\Documents\Proyectos desarrollo\Agentes de desarrollo test\graphify-out\graph.json"
graphify path "STATUS PM" "STATUS QA" --graph "C:\Users\PC GAMER\OneDrive - Universidad Autonoma de Nuevo León\Documents\Proyectos desarrollo\Agentes de desarrollo test\graphify-out\graph.json"
graphify explain "BUG-015" --graph "C:\Users\PC GAMER\OneDrive - Universidad Autonoma de Nuevo León\Documents\Proyectos desarrollo\Agentes de desarrollo test\graphify-out\graph.json"
graphify query "handoffs pendientes" --graph "C:\Users\PC GAMER\OneDrive - Universidad Autonoma de Nuevo León\Documents\Proyectos desarrollo\Agentes de desarrollo test\graphify-out\graph.json"
```

App (todos los roles, incluido PM y UX):

```
graphify query "<módulo o feature>" --graph "C:\Users\PC GAMER\LaBorregaMarket\graphify-out\graph.json"
```

## Tras una entrega

- [ ] Archivos del handoff existen y no son placeholder
- [ ] IDs (`US-*`, `API-*`, `BUG-*`) referenciados existen
- [ ] Destino = fase activa N
- [ ] Si fue fix: existe `EVIDENCIA-BUG-{NNN}.md`
- [ ] Si QA APROBÓ: hay plan para abrir UX y Arch (QG-correcciones) antes de promover
- [ ] STATUS del emisor actualizado
- [ ] `graphify update .` (orquestación); si hubo código de app: `graphify update .` en LaBorregaMarket

Si la sesión se corta: el siguiente turno empieza en el paso 1. No inventes fase.
