# Proceso OrquestIA-MX

Documento vivo de orquestación. Todos los agentes lo consumen como el backlog del PM: es la cadena canónica, no un STATUS de fase.

Cerebro de orquestación: `<ORQUESTA_REPO>/graphify-out/graph.html`. Cerebro de la app: `<APP_REPO>/graphify-out/graph.html`. Consulta: `graphify query`, `graphify path`, `graphify explain`.

## Cadena canónica

```
PM → UX/UI + Arquitecto (paralelo)
   → Backend (tras handoff-backend-fase-N)
   → Frontend (tras handoff-frontend-fase-N)
   → QA
        ↻ FE/BE si hay bugs (con evidencia)
   → QA APROBADO → PM (no cierra la fase aún)
   → UX + Arquitecto documentan correcciones (ventanas nuevas)
   → PM cierra / promueve
   → DevOps deja PR listo
   → Humano mergea y decide producción
```

QA no re-prueba un `BUG-{NNN}` sin `fase-{N}/quality/EVIDENCIA-BUG-{NNN}.md` del FE y/o BE responsable.

PM no promueve N → N+1 sin:

- `Agente UX UI/.../fase-{N}/quality/QG-correcciones.md`
- `Agente Arquitecto/.../fase-{N}/quality/QG-correcciones.md`

## Ventana nueva por rol

Un rol = un subagente o chat limpio. El orquestador **no** implementa FE/BE/QA/UX/Arch/DevOps/PM en su propio hilo.

Prompt mínimo al activar:

1. `graphify query` de orquestación (fase, handoffs)
2. `graphify query` de <APP_REPO> (`--graph "<APP_REPO>/graphify-out/graph.json"`)
3. Ruta del handoff anterior
4. Skill del rol
5. Regla `graphify.mdc`

Si falta el grafo de la app: STOP y `graphify update .` en `<APP_REPO>`. Fallback de orquestación (`comun/PROCESO.md`) solo si no hay grafo de este repo.

Los `activation-prompt-*.txt` son respaldo para pegar en un chat nuevo; no son excusa para seguir en la ventana larga del orquestador.

## DevOps

DoD = PR abierto, checks verdes, descripción lista. Prohibido `git push` a `main`/`master` y merge a producción. El humano mergea.

## Evidencia de fix

Al atender un bug de QA, FE/BE escribe en su workspace:

`outputs/{proyecto}/fase-{N}/quality/EVIDENCIA-BUG-{NNN}.md`

Debe incluir: archivos tocados, commit o diff, cómo se re-probó en local. Sin ese archivo, QA no re-testea.

## Post-APROBADO (antes de la siguiente fase)

El sign-off QA → PM **no** cierra la fase. El orquestador abre dos ventanas nuevas:

- UX: documenta cambios de UI/flujo/tokens en `fase-{N}/quality/QG-correcciones.md`
- Arquitecto: documenta cambios de contrato/ADR/datos en `fase-{N}/quality/QG-correcciones.md`

Si no hubo bugs cerrados en la fase, ambos archivos lo declaran explícitamente.

## Graphify

Dos corpus; no fusionar:

- **Orquestación:** este repo (reglas, STATUS, fase activa, `comun/`). Tras un handoff: `graphify update .`. Cerebro: `<ORQUESTA_REPO>/graphify-out/graph.html`.
- **App:** `<APP_REPO>`. Tras cambiar código: `graphify update .` en ese repo. Cerebro: `<APP_REPO>/graphify-out/graph.html`.

PM, UX/UI, Arquitecto, Backend, Frontend, QA y DevOps consultan **ambos** antes de analizar. Si falta el grafo de la app: STOP y regenerar.

## Áreas de mejora (revisión pre-F11)

| Hallazgo | Ajuste en vigor |
|----------|------------------|
| Siete STATUS pueden divergir; no había un doc de proceso compartido | Este archivo + Graphify |
| Activación mixta (prompt pegado vs orquestador largo) | Un rol = un contexto nuevo |
| DevOps hablaba de merge a `main` / prod | Solo PR; humano mergea |
| QA cerraba bugs y UX/Arch no re-documentaban | QG-correcciones obligatorio antes de promover |
| FE/BE no dejaban evidencia de fix | `EVIDENCIA-BUG-{NNN}.md` antes de re-test |
| "Lista para producción" incluía deploy del agente | Lista = cadena validada + PR listo; prod la autoriza el humano |

## Inputs Utilizados

- Reglas `.cursor/rules/00`–`06`
- Skills de cada rol
- `graphify-out/GRAPH_REPORT.md` (comunidades y puentes; no STATUS de F10)

## Outputs Generados

- **Archivo:** `comun/PROCESO.md`
- **Agente Downstream:** todos los roles + orquestador
- **Inputs Requeridos:** handoff de la fase activa, grafo, skill del rol

---

**Nota de seguridad:** Este documento debe mantenerse en un repositorio privado o ser sanitizado antes de hacerlo público. Contiene referencias a rutas y estructuras internas del proyecto en desarrollo.
