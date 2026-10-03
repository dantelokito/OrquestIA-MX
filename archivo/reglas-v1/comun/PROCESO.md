# Proceso OrquestIA-MX

Documento vivo de orquestación. Todos los agentes lo consumen como el backlog del PM: es la cadena canónica, no un STATUS de fase.

Cerebro de orquestación: `graphify-out/graph.html`. Cerebro de la app: `C:\Users\PC GAMER\LaBorregaMarket\graphify-out\graph.html`. Consulta: `graphify query`, `graphify path`, `graphify explain` con `--graph` del corpus correcto.

## Cadena canónica

```
PM → UX/UI + Arquitecto (paralelo)
   → Backend (tras handoff-backend-fase-N)
   → Frontend (tras handoff-frontend-fase-N)
   → QA (sign-off con Bugs abiertos / Deltas de diseño / Deltas de contrato)
        ├─ Escenario A: APROBADO, 0 bugs, 0 deltas → QA cierra la fase → DevOps
        ├─ Escenario B: bugs de código           → FE/BE con evidencia → QA
        └─ Escenario C: deltas > 0               → UX y/o Arq QG-correcciones → FE/BE → QA
   → DevOps deja PR listo
   → Humano mergea y decide producción
```

QA no re-prueba un `BUG-{NNN}` sin `fase-{N}/quality/EVIDENCIA-BUG-{NNN}.md` del FE y/o BE responsable.

El ruteo post-QA lo decide **solo** la matriz de la sección "Quality Gate de QA". Ninguna sesión de PM, UX o Arquitecto es obligatoria al final de la fase; solo se abren cuando la matriz las convoca.

## Ventana nueva por rol

Un rol = un subagente o chat limpio. El orquestador **no** implementa FE/BE/QA/UX/Arch/DevOps/PM en su propio hilo.

Prompt mínimo al activar:

1. `graphify query` de orquestación (fase, handoffs)
2. `graphify query` de LaBorregaMarket (`--graph "C:\Users\PC GAMER\LaBorregaMarket\graphify-out\graph.json"`)
3. Ruta del handoff anterior
4. Skill del rol
5. Regla `graphify.mdc`

Si falta el grafo de la app: STOP y `graphify update .` en `C:\Users\PC GAMER\LaBorregaMarket`. Fallback de orquestación (`comun/PROCESO.md`) solo si no hay grafo de este repo.

Los `activation-prompt-*.txt` son respaldo para pegar en un chat nuevo; no son excusa para seguir en la ventana larga del orquestador.

## DevOps

DoD = PR abierto, checks verdes, descripción lista. Prohibido `git push` a `main`/`master` y merge a producción. El humano mergea.

## Evidencia de fix

Al atender un bug de QA, FE/BE escribe en su workspace:

`outputs/{proyecto}/fase-{N}/quality/EVIDENCIA-BUG-{NNN}.md`

Debe incluir: archivos tocados, commit o diff, cómo se re-probó en local. Sin ese archivo, QA no re-testea.

## Quality Gate de QA (matriz de decisión)

### Campos obligatorios del sign-off

`QA-{F}-signoff.md` (o `QA-F{N}-progreso.md`) declara en su cabecera, con números:

```
Dictamen: APROBADO | APROBADO CON CONDICIONES | RECHAZADO
Bugs abiertos: N          (BUG-* y DT-* vivos)
Deltas de diseño: N       (UI, flujo, tokens, wireframe o AC incompleto)
Deltas de contrato: N     (API, modelo de datos, ADR)
Ruteo: A | B | C
```

Clasificación:

- **Bug de código:** el fix cabe dentro de la especificación vigente (error de ejecución, de interfaz o de lógica). Cuenta en `Bugs abiertos`.
- **Delta:** el fix exige cambiar la especificación (requerimiento incompleto, cambio de modelo de datos, discrepancia contra el contrato). Cuenta en `Deltas de diseño` o `Deltas de contrato`, no como bug de código.

Si falta alguno de los cuatro campos, el sign-off está incompleto y el orquestador lo devuelve a QA sin abrir otra sesión.

### Orden de evaluación (estricto)

El orquestador evalúa en este orden y aplica el **primer** escenario que coincida:

| Orden | Condición | Escenario | Quién se convoca |
|-------|-----------|-----------|------------------|
| 1 | `Deltas de diseño > 0` o `Deltas de contrato > 0` | **C — Desviación estructural** | UX (si diseño > 0) y/o Arquitecto (si contrato > 0) |
| 2 | Dictamen RECHAZADO o APROBADO CON CONDICIONES, o `Bugs abiertos > 0`, con deltas = 0 | **B — Fallos de código** | Frontend y/o Backend responsable |
| 3 | Dictamen APROBADO, `Bugs abiertos: 0`, deltas = 0 | **A — Cierre directo** | Nadie más; DevOps tras el cierre |

### Escenario A — Cierre directo

- La fase **se cierra en la misma sesión de QA**: QA escribe `Ruteo: A` y `Fase {N}: CERRADA` en el sign-off y actualiza su STATUS.
- El orquestador refleja el cierre en el STATUS del PM sin abrir subagente y lanza DevOps.
- **Prohibido** abrir sesiones de PM-cierre, UX `QG-correcciones` o Arquitecto `QG-correcciones`.

### Escenario B — Fallos de código

- La estafeta vuelve **directamente** a Frontend y/o Backend con `QA-F{N}-handoff-frontend.md` / `QA-F{N}-handoff-backend.md` y los `BUG-*` con la evidencia de QA.
- FE/BE corrigen y entregan `EVIDENCIA-BUG-{NNN}.md`; QA re-prueba y vuelve a evaluar la matriz.
- **Prohibido** convocar a UX/UI o Arquitecto para arreglar bugs de código.

### Escenario C — Desviaciones estructurales

- Se convoca a UX y/o Arquitecto (ventana `QG-correcciones`) para ajustar la especificación (`SPEC-{ID}` desde F15; hasta entonces los `US-*`/`UF-*`/`WF-*`/`API-*`/`DB-*` afectados) **antes** de que FE/BE toquen el código.
- `fase-{N}/quality/QG-correcciones.md` lista cada delta, el archivo de especificación ajustado y a qué desarrollador va.
- El PM solo se convoca si el delta cambia alcance, tiempo o ACs (`change-order.md`).
- Después: FE/BE implementan → QA re-prueba → nueva evaluación de la matriz. La fase siempre termina por el Escenario A.

### Cierre vs. siguiente fase

Cerrar la fase N (Escenario A) no abre la N+1. Abrir N+1 requiere autorización humana; el PM la abre en una sesión nueva sin exigir `QG-correcciones.md` de la fase N.

## Graphify

Dos corpus; no fusionar:

- **Orquestación:** este repo (reglas, STATUS, fase activa, `comun/`). Tras un handoff: `graphify update .`. Cerebro: `graphify-out/graph.html`.
- **App:** `C:\Users\PC GAMER\LaBorregaMarket\graphify-out\graph.json`. Tras cambiar código: `graphify update .` en ese repo. Cerebro: `LaBorregaMarket/graphify-out/graph.html`.

PM, UX/UI, Arquitecto, Backend, Frontend, QA y DevOps consultan **ambos** antes de analizar. Si falta el grafo de la app: STOP y regenerar.

## Áreas de mejora (revisión pre-F11)

| Hallazgo | Ajuste en vigor |
|----------|-----------------|
| Siete STATUS pueden divergir; no había un doc de proceso compartido | Este archivo + Graphify |
| Activación mixta (prompt pegado vs orquestador largo) | Un rol = un contexto nuevo |
| DevOps hablaba de merge a `main` / prod | Solo PR; humano mergea |
| QA cerraba bugs y UX/Arch no re-documentaban | `QG-correcciones` solo en Escenario C (deltas > 0) |
| UX/Arch/PM se abrían tras cada APROBADO sin deltas (F13 y F14: "sin deltas") | Escenario A: QA cierra la fase; sin sesiones post-QA |
| FE/BE no dejaban evidencia de fix | `EVIDENCIA-BUG-{NNN}.md` antes de re-test |
| “Lista para producción” incluía deploy del agente | Lista = cadena validada + PR listo; prod la autoriza el humano |

## Inputs Utilizados

- Reglas `.cursor/rules/00`–`06`
- Skills de cada rol
- `graphify-out/GRAPH_REPORT.md` (comunidades y puentes; no STATUS de F10)

## Outputs Generados

- **Archivo:** `comun/PROCESO.md`
- **Agente Downstream:** todos los roles + orquestador
- **Inputs Requeridos:** handoff de la fase activa, grafo, skill del rol
