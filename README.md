# OrquestIA-MX

Orquestador de agentes de desarrollo con Cursor para LaBorregaMarket. Este workspace solo guarda reglas, skills y documentación; el código vive en `C:\Users\PC GAMER\LaBorregaMarket`.

## Cómo trabajar

En un chat abierto en esta raíz: `@orquestador continúa` (o `@orquestador abre la fase N+1: <requerimiento>`). El orquestador lee `laborregamarket/STATUS.md` y lanza un subagente por rol.

## Estructura

```
.cursor/
  rules/nucleo.mdc            # única regla que se carga siempre
  skills/{orquestador,pm,ux,arch,be,fe,qa,devops}/SKILL.md
laborregamarket/
  STATUS.md                   # estado único de todos los roles
  PLANTILLA-ROL.md            # formato de fase-N/{rol}.md
  comun/                      # documentos vivos (índice en comun/README.md)
  fase-N/{pm,ux,arch,be,fe,qa,devops}.md
  tests/                      # suite Playwright de QA
archivo/                      # F1-F14 y configuración anterior (solo lectura)
```

## Flujo

```
PM -> UX + Arch (paralelo) -> BE -> FE -> QA -> DevOps -> Humano mergea
```

- BE y FE no entregan a QA sin `prisma generate`, `tsc`, lint, tests y build en verde.
- QA dirige las correcciones: lanza a FE/BE con los bugs y vuelve a probar (máximo 2 rondas).
- Ruteo QA: **A** cierra la fase y pasa a DevOps; **B** son bugs que QA resuelve con FE/BE; **C** son deltas de spec y convocan a UX y/o Arch.
- Un archivo por rol y fase sustituye a los handoffs, activation-prompts, README de fase y evidencias sueltas.

## Graphify

Opcional y solo para el código de la app:

```
graphify query "<tema>" --budget 800 --graph "C:\Users\PC GAMER\LaBorregaMarket\graphify-out\graph.json"
```

DevOps ejecuta `graphify update .` en el repo de la app una vez por fase.
