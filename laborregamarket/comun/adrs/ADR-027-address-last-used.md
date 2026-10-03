# ADR-027 — `lastUsedAt` en UserAddress

> **Estado:** Aceptado  
> **Fecha:** 2026-08-18  
> **Decisores:** Arquitecto de Software  
> **Fase:** 7 — v0.7.1  
> **US:** US-GEO-11, US-GEO-14  
> **Schema:** [`../../fase-7/data-model/DB-addresses.md`](../../fase-7/data-model/DB-addresses.md)

---

#### 1. Contexto y Problema:

`US-GEO-11` pide abrir el mapa en la **última favorita usada** (cross-device), o `isDefault` si no hay last-used. `UserAddress` F4 tiene `isDefault` y `updatedAt`. Usar `updatedAt` confunde “edité la etiqueta” con “centré el mapa aquí”. `isDefault` es “casa”, no “último pin”.

---

#### 2. Opciones Consideradas:

* **Opción A — `lastUsedAt DateTime?` + `POST .../addresses/[id]/use`:** Pros: semántica clara; no ensucia `updatedAt` de edición. Contras: migración + ruta.
* **Opción B — Reusar `updatedAt`:** Pros: cero schema. Contras: PATCH de label mueve el “último uso”.
* **Opción C — Solo `isDefault`:** Pros: cero schema. Contras: no cubre “usé Trabajo ayer sin marcar default”.

---

#### 3. Decisión Elegida:

**Opción A.** Columna `last_used_at` nullable. Stamp **solo** al elegir la dirección para el mapa (`POST /api/users/me/addresses/[id]/use`). No cambia `isDefault` salvo que el body lo pida en otro PATCH.

**Hidratación FE (orden):**

1. Dirección con `lastUsedAt` más reciente (no null).
2. Else `isDefault === true`.
3. Else constante SN (ADR-026).

CRUD F4 intacto. Máximo una `isDefault`. `requireRole(CLIENT)`.

---

#### 4. Consecuencias e Impacto:

* **Positivas:** Favoritas portables; last-used no se pisa al renombrar.
* **Riesgos / Compensaciones:** Una migración Prisma. Filas viejas: `lastUsedAt` null → caen a default o SN.
