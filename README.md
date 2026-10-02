# OrquestIA-MX

Repositorio de orquestación de agentes de desarrollo con Cursor. Este workspace **es el orquestador**: coordina PM, UX/UI, Arquitecto, Backend, Frontend, QA y DevOps.

## Cómo trabajar

- Skill: `@orquestador` (ciclo de fase, Graphify, handoffs).
- Proceso vivo (todos los agentes): [`comun/PROCESO.md`](comun/PROCESO.md).
- Reglas globales: `.cursor/rules/00-` … `06-orquestador.mdc`.
- Grafo de orquestación: `graphify-out/` (`GRAPH_REPORT.md`, `graph.json`, `graph.html`).
- Grafo de la app LaBorregaMarket: `C:\Users\PC GAMER\LaBorregaMarket\graphify-out\` (otro corpus; no mezclar).
- Código de la app: `C:\Users\PC GAMER\LaBorregaMarket`.

Paso 0 de **cualquier** rol (PM, UX, Arch, BE, FE, QA, DevOps): consultar ambos grafos antes de explorar.

```
graphify query "quién actúa en la fase activa" --graph "C:\Users\PC GAMER\OneDrive - Universidad Autonoma de Nuevo León\Documents\Proyectos desarrollo\Agentes de desarrollo test\graphify-out\graph.json"
graphify path "STATUS PM" "STATUS QA" --graph "C:\Users\PC GAMER\OneDrive - Universidad Autonoma de Nuevo León\Documents\Proyectos desarrollo\Agentes de desarrollo test\graphify-out\graph.json"
graphify explain "BUG-015" --graph "C:\Users\PC GAMER\OneDrive - Universidad Autonoma de Nuevo León\Documents\Proyectos desarrollo\Agentes de desarrollo test\graphify-out\graph.json"
graphify query "<módulo o feature>" --graph "C:\Users\PC GAMER\LaBorregaMarket\graphify-out\graph.json"
```
