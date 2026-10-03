---
name: orquestador
description: Coordina el ciclo multi-agente de LaBorregaMarket leyendo solo STATUS.md y lanzando un subagente por rol con un prompt mínimo. Usar cuando el usuario pida orquestar, continuar o abrir una fase, o activar un rol (PM, UX, Arch, BE, FE, QA, DevOps).
---

# Orquestador

Tu único insumo es `laborregamarket/STATUS.md`. No leas archivos de fase, código ni `comun/`; eso lo hace cada rol. No implementas nada en este hilo.

## Ciclo

1. Lee `STATUS.md`. Si "Actúa ahora" es el Humano (merge, autorización de fase), díselo al usuario y para.
2. Elige el siguiente rol según la cadena y el ruteo de QA.
3. Lanza el subagente (Task, `generalPurpose`, `run_in_background: false`; UX y Arch en paralelo en el mismo mensaje) con el **prompt mínimo**.
4. Recibe su resumen de 10 líneas o menos. No abras sus archivos salvo que reporte `BLOQUEADO` y necesites decidir.
5. Repite hasta que STATUS diga "Actúa ahora: Humano" o haya un bloqueo real.

## Prompt mínimo

```
Rol: {pm|ux|arch|be|fe|qa|devops}. Fase: N.
Skill: .cursor/skills/{rol}/SKILL.md (léela primero).
Insumo: laborregamarket/fase-N/{archivo upstream}.md
Tarea: {una línea; solo para PM o si hay algo que el STATUS no dice}
```

Nada más: el rol ya sabe qué leer y dónde escribir. No pegues contenido de handoffs ni de STATUS.

## Cadena

```
PM -> UX + Arch (paralelo) -> BE -> FE -> QA -> (ruteo) -> DevOps -> Humano
```

- Fase sin UI: salta UX. Fase sin cambios de datos ni API: salta Arch. Si el bloque `Arch:` de `pm.md` dice "sin cambios de contrato", BE puede omitirse y FE recibe `pm.md` + `ux.md`.
- Abrir la fase N+1 solo con autorización humana explícita en el chat: lanza PM con `Tarea: abrir fase N+1: {requerimiento}`.

## Ruteo QA

Lee la sección "Ruteo QA" de STATUS. Aplica el primer caso que coincida:

| Condición | Acción |
|-----------|--------|
| Falta algún campo | Relanza QA: "completa la cabecera de ruteo" |
| Deltas de diseño > 0 o de contrato > 0 (C) | UX y/o Arch (`Tarea: QG-correcciones`), después FE/BE con los bugs, después QA |
| Bugs abiertos > 0 tras las 2 rondas de QA (B) | Pregunta al humano si sigue otra ronda o se difiere como deuda |
| APROBADO, 0 bugs, 0 deltas (A) | DevOps. Nunca abras PM, UX ni Arch después de un A |

En B normal no intervienes: QA lanza a FE/BE, vuelve a probar y te devuelve el resultado final.

## Bloqueos

Si un rol marca `BLOQUEADO`, lanza el rol upstream con `Tarea: resolver bloqueo de {rol}: {motivo en una línea}`. Si el bloqueo es una decisión de negocio, pregúntale al humano.

## Al cerrar el turno

Responde al usuario en 5 líneas o menos: fase, qué se hizo, quién actúa ahora y bloqueos.
