# READY-FOR-QA — Fase {N}

> **Proyecto:** {nombre-proyecto}  
> **Fase:** {N} — {nombre-fase} (v{X.Y.Z})  
> **Fecha:** {DD/MM/AAAA}  
> **De:** Agente UX/UI Designer  
> **Para:** @QA Tester  
> **Condición:** `REVIEW-UX.md` ≥ 80% y 0 P0 **y** `REVIEW-ARCH.md` ≥ 80% y 0 P0

---

## Dictámenes previos

| Agente | Archivo | Veredicto | Puntaje |
|--------|---------|-----------|---------|
| UX/UI | `fase-{N}/quality/REVIEW-UX.md` | | |
| Arquitecto | `fase-{N}/quality/REVIEW-ARCH.md` | | |

---

## Alcance de prueba

|Módulo|Rutas|User flows|Wireframes|
|------|-----|----------|----------|
| | | | |

---

## Roles y acceso

| Rol | Usuario de prueba | Rutas principales |
|-----|-------------------|-------------------|
| CLIENT | | `/fruteria/[id]`, `/carrito`, `/cuenta` |
| PROVIDER | | `/proveedor`, `/proveedor/pos`, `/proveedor/ordenes`, `/proveedor/dashboard` |
| ADMIN | | `/admin` (si aplica F{N}) |

**Entorno:** {staging / local}. **Repo código:** `{ruta}`.

---

## Happy paths obligatorios (100%)

1. {Caso 1 — pasos numerados}
2. {Caso 2}
3. {Caso 3}

---

## Edge cases recomendados (≥85%)

- {Caso negativo / límite}
- {409 / idempotencia / empty state}

---

## Observaciones conocidas (no bloquean QA)

| ID | Severidad | Descripción |
|----|-----------|-------------|
| | P1/P2 | |

---

## Fuera de alcance QA F{N}

{Pasarela, CFDI, hardware, etc.}

---

*Habilitación QA emitida por Agente UX/UI Designer — {nombre-proyecto} v{X.Y.Z}.*
