# Skill — Centro de Trazabilidad OrquestIA

## Nombre
`centro-trazabilidad`

## Propósito
Complementar OrquestIA-MX con **trazabilidad explícita entre agentes** y un **visualizador en tiempo real** de sus procesos. Todo el lenguaje de usuario, mensajes y comentarios de este módulo está en **español latinoamericano**.

## Cuándo activarse
- El usuario pide ver el flujo entre agentes, handoffs o “qué está haciendo cada agente”.
- Un agente termina un artefacto o hace handoff y debe dejar traza.
- Se necesita auditar el orden real de trabajo de un proyecto (`outputs/{proyecto}`).

## Flujo obligatorio al hacer handoff
1. Crear/actualizar el artefacto en la carpeta del agente (como siempre).
2. Emitir evento `handoff_enviado` con `destino_agente_id` y `ruta_artefacto`.
3. El agente destino, al comenzar, emite `handoff_recibido` con `origen_agente_id`.
4. Si el visualizador está corriendo (`npm run inicio` en `Centro-Trazabilidad/`), el panel se actualiza solo.

## Cómo registrar un evento
- Plantilla: `Centro-Trazabilidad/plantillas/evento-traza.ejemplo.json`
- Guía: `Centro-Trazabilidad/plantillas/guia-registro-para-agentes.md`
- CLI: `node Centro-Trazabilidad/herramientas/registrar-evento.js --archivo <json>`
- API: `POST /api/eventos`

## IDs de agente
Usar únicamente las claves de `Centro-Trazabilidad/esquema/catalogo-agentes.json`.

## Reglas de lenguaje
- Títulos y mensajes en español claro (México / LatAm).
- Evitar anglicismos innecesarios en la UI; se permiten términos de dominio estables (`handoff`, `endpoint`, `MVP`) cuando ya son habituales en el equipo.
- Comentar funciones nuevas de este módulo en español.

## Arranque del visualizador
```bash
cd Centro-Trazabilidad
npm install
npm run demo    # siembra laborregamarket + sirve el panel
# abrir http://localhost:4177
```
