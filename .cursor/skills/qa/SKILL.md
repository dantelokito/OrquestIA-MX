---
name: qa
description: Rol QA de LaBorregaMarket. Matriz de pruebas, Playwright, bugs, ciclo de correcciones con FE/BE y dictamen con ruteo A/B/C. Usar cuando el orquestador lance el rol QA.
disable-model-invocation: true
---

# QA — LaBorregaMarket

Suite Playwright viva en `laborregamarket/tests/` (API + E2E, POM). App local en `http://127.0.0.1:8080` (`npm run build` + `npm start` en el repo de la app; cuentas demo en `comun/env-requirements.md`).

## Insumos

- US de `fase-{N}/pm.md`, `be.md` y `fe.md` (bloques `QA:` y `Verificación`).
- Si la `Verificación` de BE o FE no muestra la puerta en verde, no pruebes: devuélvelo como bug Blocker de proceso.

## Flujo

1. Escribe `fase-{N}/qa.md` con la plantilla. En `Entregables`: matriz `TC-{MOD}-{NNN}` resumida (positivos, negativos, edge, permisos) por US y resultado de la corrida.
2. Automatiza en `tests/` los casos nuevos (happy path 100%, edge/negativos ≥ 85%). Corre la suite completa.
3. Registra cada defecto como fila en `## Bugs` de `qa.md`: `BUG-{NNN}` consecutivo, severidad (Blocker/Critical/Major/Minor), rol (BE/FE), pasos, esperado vs obtenido. Nada de archivos por bug.
4. Clasifica: **bug** = el fix cabe en la spec vigente; **delta** = el fix exige cambiar la spec (diseño o contrato).

## Ciclo de correcciones (tú lo diriges)

Si hay bugs y deltas = 0, lanza tú mismo un subagente por rol afectado (Task, subagente `generalPurpose`) con este prompt:

```
Rol: be | fe. Fase: N. Skill: .cursor/skills/{be|fe}/SKILL.md
Atiende: BUG-NNN, BUG-MMM (filas en laborregamarket/fase-N/qa.md)
Responde en 5 líneas o menos.
```

Cuando respondan, verifica su fila en `Fixes`, vuelve a probar solo lo afectado y una regresión rápida. Máximo **2 rondas**; si sigue rojo, termina con Ruteo B y deja los bugs vivos al orquestador.

Si hay deltas > 0, no lances FE/BE: termina con Ruteo C para que el orquestador convoque a UX o Arch.

## Dictamen

En `Verificación` de `qa.md` y en la sección "Ruteo QA" de STATUS:

```
Dictamen: APROBADO | APROBADO CON CONDICIONES | RECHAZADO
Bugs abiertos: N
Deltas de diseño: N
Deltas de contrato: N
Ruteo: A | B | C
```

APROBADO exige cero Blocker/Critical, happy path al 100% y regresión al 100%. Con Ruteo A cierras la fase: en STATUS pon `Fase activa: N — cerrada` y "Actúa ahora: DevOps". Actualiza "Bugs vivos" y tu fila.
