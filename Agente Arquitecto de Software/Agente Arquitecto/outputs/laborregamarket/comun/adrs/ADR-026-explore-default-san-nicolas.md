# ADR-026 — Centro default Explorar: San Nicolás de los Garza

> **Estado:** Aceptado  
> **Fecha:** 2026-08-18  
> **Decisores:** Arquitecto de Software  
> **Fase:** 7 — v0.7.1  
> **US:** US-GEO-11  
> **ADR relacionado:** [ADR-027](./ADR-027-address-last-used.md)

---

#### 1. Contexto y Problema:

La primera carga de `/explorar` no debe partir de un centro vacío ni de `localStorage`. Invitado y CLIENT sin favoritas deben abrir en **San Nicolás de los Garza, NL**, radio **10 km**, dentro del bounding box F4.

---

#### 2. Opciones Consideradas:

* **Opción A — Constante canónica en código (FE + documentada BE):** Pros: reproducible; QA estable. Contras: no es el GPS del usuario.
* **Opción B — Geolocalización automática al entrar:** Pros: cercanía. Contras: prompt invasivo; fallo = mapa vacío; no cumple el Must de SN.
* **Opción C — Centro de Monterrey (F4 seed):** Pros: ya usado. Contras: no es el default de producto F7.

---

#### 3. Decisión Elegida:

**Opción A.** Constante **única** (export FE; BE no la exige en el GET lista — el cliente envía `lat`/`lng`):

```
DEFAULT_EXPLORE_CENTER = { lat: 25.7475, lng: -100.2830 }
DEFAULT_EXPLORE_RADIUS_KM = 10
```

**Fuente:** punto representativo del **centro urbano** de San Nicolás de los Garza (no un POI pagado). Dentro del bbox F4: lat 25.4–25.9, lng -100.6–-99.8.

**Hidratación (FE):**

1. Sesión CLIENT con `UserAddress` → ADR-027 (last-used / default) + radio 10 km salvo slider ya en URL.
2. Invitado o lista vacía → esta constante + 10 km.
3. “Usar mi ubicación” posterior → GPS; slider intacto (`US-GEO-10`).

`localStorage` **no** es fuente de verdad del origen.

---

#### 4. Consecuencias e Impacto:

* **Positivas:** Misma primera vista en todos los dispositivos; coords testeables.
* **Riesgos / Compensaciones:** El punto no es el domicilio del usuario; GPS y favoritas lo corrigen. Si el municipio pide un pin oficial, se actualiza **esta constante** (un solo lugar).
