# Guía de registro de traza (para agentes)

Esta guía explica, en español sencillo, **cómo cada agente deja huella** en el Centro de Trazabilidad para que el visualizador muestre el proceso en tiempo real.

## ¿Para qué sirve?

Hoy cada agente escribe sus propios `OBSERVABILITY.md` y handoffs. Eso está bien, pero es difícil ver **la cadena completa** (quién entregó qué a quién) sin abrir muchas carpetas.

Con un evento JSONL compartido:

1. Queda **trazabilidad** entre agentes (handoffs de → a).
2. El **visualizador** se actualiza solo (SSE + vigilancia de archivos).
3. Cualquiera puede auditar el flujo sin adivinar el orden.

## Dónde se guarda

```
Centro-Trazabilidad/datos/{proyecto}/eventos.jsonl
```

Una línea = un evento. Nunca reescribas el archivo completo salvo herramientas oficiales (`npm run sembrar`).

## Cómo registrar (elige una)

### Opción A — API (recomendada si el servidor está arriba)

```bash
curl -X POST http://localhost:4177/api/eventos \
  -H "Content-Type: application/json" \
  -d @Centro-Trazabilidad/plantillas/evento-traza.ejemplo.json
```

### Opción B — CLI del centro

```bash
cd Centro-Trazabilidad
npm run inicio   # en otra terminal, si quieres verlo en vivo
node herramientas/registrar-evento.js --archivo plantillas/evento-traza.ejemplo.json
```

### Opción C — Append manual

Copia una línea JSON válida al final de `eventos.jsonl`. El vigilante la detecta y la empuja al panel.

## Cuándo emitir cada tipo

| Tipo | Cuándo usarlo |
|------|----------------|
| `inicio_sesion` | Empiezas a trabajar el proyecto / fase |
| `descubrimiento` | Preguntas, supuestos, MoSCoW |
| `artefacto_creado` | Creaste PRD, wireframe, ADR, código, matriz… |
| `handoff_enviado` | Entregas trabajo a otro agente (**obligatorio** `destino_agente_id`) |
| `handoff_recibido` | Confirmas que tomaste un handoff (**obligatorio** `origen_agente_id`) |
| `calidad_evaluada` | Quality gate, auditoría UX, sign-off QA |
| `bloqueo` / `desbloqueo` | Algo detiene o libera el flujo |
| `completado` | Cerraste tu parte de la fase |
| `nota` | Comentario útil que no encaja arriba |

## IDs de agente válidos

`product-manager` · `ux-ui-designer` · `software-architect` · `backend-developer` · `frontend-developer` · `qa-tester-senior` · `devops-cloud-engineer`

Ver detalle en `esquema/catalogo-agentes.json`.

## Checklist mínimo por handoff

- [ ] Evento `handoff_enviado` del agente origen
- [ ] Evento `handoff_recibido` del agente destino
- [ ] `ruta_artefacto` apuntando al markdown/código entregado
- [ ] `proyecto` en kebab-case igual en ambos eventos
