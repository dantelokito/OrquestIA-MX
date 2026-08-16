# Notas — Centro de Trazabilidad

El Centro de Trazabilidad vive en la carpeta raíz `Centro-Trazabilidad/`.

## Idea en una frase

Que cualquier persona del equipo (o cualquier agente) pueda responder:  
**“¿Quién hizo qué, cuándo, y a quién se lo pasó?”** sin abrir diez bitácoras distintas.

## Relación con OBSERVABILITY.md

- `OBSERVABILITY.md` de cada agente sigue siendo la **bitácora narrativa** del rol.
- `eventos.jsonl` del Centro es la **línea de tiempo compartida** y alimenta el visualizador.

Cuando actualices un `OBSERVABILITY.md` o envíes un handoff, registra también el evento correspondiente (ver `Centro-Trazabilidad/plantillas/guia-registro-para-agentes.md`).
