# Changelog del Design System

Sustituye a los snapshots completos `design-tokens-*.md` e
`information-architecture-*.md` que estaban en esta carpeta.

## Por qué cambió el formato

Cada fase, el agente de UX copiaba el archivo **entero** (ya con 1,000+
líneas) a `historial/` con un nombre nuevo. Tras 10 fases había 5 versiones
de tokens y 5 de arquitectura de información, de las cuales solo una era
válida y las otras cuatro eran copias casi idénticas (86-90% de las líneas
coinciden).

Eso no solo gastaba tokens: un agente que buscara un token de color podía
aterrizar en una versión de hace dos meses. La regla `00` exige no asumir
que los inputs upstream son correctos, así que el agente tenía que leer las
cinco versiones para averiguar cuál mandaba.

**Regla nueva:** `historial/` registra **qué cambió**, nunca una copia
completa del estado. El estado vigente vive solo en `comun/`.

## Estado vigente

| Artefacto | Ruta | Version |
|---|---|---|
| Design tokens | `comun/design-tokens.md` | v0.14.0 |
| Arquitectura de información | `comun/information-architecture.md` | v0.14.0 |

Cualquier agente que necesite tokens o arquitectura de información los lee de
`comun/`. No existen otras copias válidas.

## design-tokens.md

Cada versión añade **una sección `6X` con los componentes de la fase nueva** y
actualiza los encabezados de micro-interacciones y accesibilidad. El resto del
archivo es idéntico a la versión anterior.

| Versión | Fecha | KB | Secciones | Qué añade |
|---|---|---|---|---|
| v0.2.0 | 18/08/2026 | 10.8 | 14 | Base. Incluye 4 bloques `Changelog Fase N (append …)` de las fases 4-7 |
| v0.7.1 | 18/08/2026 | 36.4 | 14 | Secciones 6b-6f: componentes de las fases 3, 4, 5, 6 y 7 |
| v0.8.3 | 24/08/2026 | 42.1 | 15 | Sección 6g: componentes Fase 8 (Explorar polish) |
| v0.9.0 | 25/08/2026 | 46.5 | 16 | Sección 6h: componentes Fase 9 (deuda Explorar) |
| v0.14.0 | 17/09/2026 | 58.6 | 17 | Sección 6i: componentes Fase 10 (catálogo local, admin, reportes por rango) |

Crecimiento entre v0.9.0 y v0.14.0: 983 → 1,213 líneas (+230). Únicamente la
sección 6i es contenido nuevo; el resto es el mismo archivo.

## information-architecture.md

La IA es mucho más estable: mantiene 8 secciones y solo bumpea el encabezado
del diagrama de navegación global. Por eso ocupaba 14-19 KB y no 46-58 KB.

| Versión | Fecha | KB | Qué cambia |
|---|---|---|---|
| v0.1.0 | 18/08/2026 | 7.5 | Base, 8 secciones + 4 bloques `Changelog Fase N` |
| v0.7.1 | 18/08/2026 | 13.4 | Añade sección 3 `SubNavProveedor`; diagrama de navegación pasa a Fase 7 |
| v0.8.3 | 24/08/2026 | 14.2 | Diagrama de navegación pasa a Fase 8 |
| v0.9.0 | 25/08/2026 | 14.8 | Diagrama de navegación pasa a Fase 9 |
| v0.14.0 | 17/09/2026 | 19.4 | Diagrama de navegación pasa a Fase 12 |

## Recuperación

Las seis versiones eliminadas están en el historial de git, en el commit que
las añadió. Para ver el contenido exacto de cualquiera:

```
git log --oneline -- "<ruta-del-archivo>"
git show 4789969:"<ruta-del-archivo>"
```
