# IMPACTO — No atender ahora la deuda de fases previas

> **Proyecto:** LaBorregaMarket v0.5.0  
> **De:** Agente QA / Tester Senior  
> **Para:** Agente UX/UI Designer · Agente Arquitecto de Software  
> **Fecha:** 15/08/2026  
> **Fase:** 5 (activa en este repo)

Este memo **no** sustituye el backlog de DevOps ni pide parches de código a UX o Arquitecto. Traduce las incidencias **P0/P1** que DevOps ya clasificó como críticas a **consecuencias de producto, contratos y experiencia** si se posponen a F6+.

**Fuente DevOps:** `Agente DevOps/.../outputs/laborregamarket/comun/deuda-fases-previas.md`  
**Dictamen QA F5:** [QA-F5-signoff.md](../qa-signoffs/QA-F5-signoff.md) — APROBADO CON CONDICIONES (sin bugs Blocker/Critical de producto F5).

Este documento **no cambia** el dictamen F5. Documenta el costo de diferir.

---

## 1. Por qué ahora

Los sign-off QA de F1, F3, F4 y F5 llevan la misma condición abierta: **regresión automatizada en staging/CI = PENDIENTE**. F5 acaba de cerrar OBS-F4-023 (Leaflet en `/explorar` sin clave Google). Ese cierre es frágil si el checklist de infra F4 sigue pidiendo lo contrario.

Arrancar **F6 (pagos)** con:

1. un import que ya provoca **500** en local (`@upstash/redis` fuera del lockfile), y  
2. **cero** red de CI en cada push,

no es “deuda cosmética”. Es el perfil de incidente del **primer entorno compartido**: contacto caído, schema F4/F5 inexistente, mapa que revierte al empty F4, y regresiones de checkout invisibles.

La suite viva ya tiene **214** tests. Cada fase que se suma sin pipeline agranda el hueco, no lo reduce.

---

## 2. Mensaje al Arquitecto — calidad de contratos, SAD y gates

El QG Backend F5 (97/100, 0 P0) auditó ADRs 021–022 y el delta API. **No cubre** el manifiesto npm ni el checklist pre-deploy F4 que sigue vivo en `comun/infra-requirements.md`.

### DEV-P0-001 — El contrato ADR-015 no es ejecutable

ADR-015 e `infra-requirements.md` declaran `@upstash/redis` como dependencia Must. El código importa el paquete **antes** de `getRedis()`. El fallback in-memory **no corre**.

| Si se ignora ahora | Efecto |
|--------------------|--------|
| `next build` / `npm ci` en runner limpio | Fallo de compile o ruta contacto 500 |
| Prod “fail-closed” (503 sin Redis) | **Nunca se evalúa**: ni 503 ni Redis real cargan |
| Rate limit de contacto (ADR-015) | Inexistente; abuso de Llamar/WhatsApp sin tope |

Un quality gate de arquitectura que no exige lockfile alineado con el ADR deja un P0 fuera del dictamen.

### DEV-P0-002 — El gate de liberación QA no existe en la práctica

El criterio “100% pass de regresión en staging/QA” está en rojo desde el MVP. Sin pipeline (Postgres + `migrate deploy` + **`build`/`start`** + Playwright):

- Un merge a `main` no tiene red de seguridad.
- Las 214 pruebas solo existen en el laptop de QA.
- **F6 no debería recibir READY-FOR-QA** con este gate abierto: pagos sobre un producto sin CI es riesgo de fraude y de regresiones silenciosas en Encargar/POS.

`next dev` bajo workers paralelos ya 500 (evidencia QA F5). CI debe usar `start`, no copiar el bloque local de `env-requirements.md`.

### DEV-P1-003 — Contratos F4/F5 asumen schema que staging puede no tener

Las migraciones están en el repo. El riesgo es **entorno sin `migrate deploy`**.

| Schema ausente | Contratos que “existen en papel” y 500 en runtime |
|----------------|---------------------------------------------------|
| F4 reviews / addresses | API-REVIEWS-01, API-ADDRESSES-01 |
| F5 `primary_color` / `secondary_color` | API-PROVIDER-SETTINGS-01, API-SESSION-THEME-01 |

QA local no equivale a prod. READY-FOR-QA F5 asume OBS-F5-023 aplicada.

### DEV-P1-004 y DEV-P1-005 — Desplegar “para ver la UI” rompe el modelo de fallos

Sin Upstash en `NODE_ENV=production`, contacto debe ser **503** (ADR-015). Eso es correcto. Lo incorrecto es:

- desplegar staging sin Redis y creer que contacto funciona;
- o desplegar sin el paquete (P0-001) y obtener **500 de compile**, no el 503 diseñado.

Email (Resend), media (Cloudinary) e Inngest quedan no-op. Nunca hubo smoke staging (OBS-F4-022). El diagrama de notificaciones del SAD describe un sistema que el primer entorno compartido no materializa.

### DEV-P1-006 — Acción de Arquitecto: el checklist F4 contradice ADR-020

En `comun/infra-requirements.md` el checklist pre-deploy F4 todavía pide:

- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` con restricción de dominio  
- “Leaflet retirado de `/explorar`”

Eso quedó **superado** por ADR-020, CO-F5-001 y READY-FOR-QA F5 (Explorar **sin** key; attribution OSM). El mismo archivo, más arriba, ya dice que la key no es Must para GEO.

Si no se alinea el checklist:

- DevOps o Frontend “completan” F4 y **reintroducen OBS-F4-023** (mapa gris) o billing de Maps JS.
- El contrato API-GEO-01 F5 y el SAD 0.5.0 dejan de ser la fuente de verdad operativa.

### DEV-P1-007, DEV-P2-008, DEV-P2-011 — calidad que se come el siguiente release

| ID | Si se ignora |
|----|----------------|
| DEV-P1-007 | `JWT_SECRET` de `.env.example` en staging → tokens forjables; cookie sin `Secure` si `NODE_ENV≠production` |
| DEV-P2-008 | Probes a `/health` (no existe; SAD = roadmap) marcan false down. Session F5 (`GET /api/auth/session` 200 invitado) es el contrato vivo |
| DEV-P2-011 | BUG-002 (middleware API bypass) reaparece en **cualquier ruta nueva** sin `requireRole` + caso RBAC. Sin CI (P0-002) no hay red que lo detecte |

---

## 3. Mensaje a UX/UI — experiencia que ya está diseñada y se puede romper por infra

Los UF/WF F5 (Leaflet, catálogo inhabilitado, marca) están aprobados (REVIEW-UX 86/100, 0 P0). La deuda no pide rediseñar F5. Pide **no asumir** que esos estados sobreviven al primer deploy si Arquitecto/DevOps no cierran P0/P1.

### Contacto (UF F2, Encargar + Llamar/WhatsApp)

Los wireframes asumen 200 o 429 (rate limit). Hoy, sin el paquete Redis:

- el usuario ve **500 genérico**, no un empty de negocio;
- no hay copy ni estado de error para “módulo ausente” ni para **503 fail-closed** de prod.

Si P0-001/P1-005 se aplazan, el handoff F6 **no debe** tratar contacto como siempre disponible. Un 500/503 en el CTA de la frutería se lee como producto roto, no como “falta CI”.

### Explorar (UF-GEO-01, WF-explorar-leaflet)

F5 revocó el empty “Mapa no disponible” por falta de API key. El contrato visual es: teselas OSM, attribution visible, lista usable si las teselas caen.

Si alguien aplica el checklist F4:

- vuelve el mapa gris o Google Maps JS (costo + empty que UX ya cerró);
- el layout (CTA en banner, slider al pie) queda acoplado a un motor que el producto abandonó.

**Pedido UX:** no reabrir Google Maps JS en `/explorar` en F6. El embed/enlace de reseñas Google (`US-REV-03`) se mantiene; el motor del mapa no.

### Marca y catálogo (UF-BRAND-01, UF-CAT-01)

Sin migración F5 en staging:

- el picker y `GET /api/auth/session` (`brand`) pueden 500;
- el toggle Inactivo parece “bug de UI” cuando el schema no tiene columnas.

QA no puede re-certificar HP-BRAND / HP-CAT en un entorno compartido. El usuario PROVIDER guarda colores y no ve el chrome; el CLIENT no distingue “producto inhabilitado” de “la app falló”.

### Confianza y F6 (pagos)

Pagos sobre un producto **sin CI** y **sin rate-limit real** de contacto:

- abuso de canales de contacto (spam al proveedor) mientras se diseña checkout;
- regresiones de Encargar/POS/carrito invisibles hasta que un humano las pisa;
- pérdida de confianza: el mapa o el contacto fallan en el mismo release en que se pide pagar.

Copy de 500/503 de contacto **no está** en los WF F5. Si P0 no se cierra, el handoff F6 debe nombrarlo como riesgo conocido — no como empty de mapa ni como “agotado”.

---

## 4. Qué pedimos (sin sustituir a DevOps ni Backend)

| Agente | Pedido |
|--------|--------|
| **Arquitecto** | Alinear el checklist pre-deploy F4 de `infra-requirements.md` con ADR-020 (quitar Must Maps JS y “Leaflet retirado”). No emitir READY-FOR-QA de **F6** mientras DEV-P0-001 y DEV-P0-002 sigan abiertos. |
| **UX/UI** | No reintroducir Google Maps JS en Explorar. En handoffs F6, no asumir contacto 200; 500/503 son riesgo conocido, no empty de mapa. |
| **QA** | No reabre bugs de producto por OBS ya listadas (F4-023 cerrada en F5; 500 Upstash = deuda de manifiesto, no AC F5). Este memo no modifica QA-F5-signoff. |
| **DevOps / Backend** | Dueños de implementación: ver documento fuente. QA no prescribe `npm install` ni YAML aquí. |

### Costo de esperar a F6

```text
Ahora: 2 P0 (compile contacto + CI inexistente) + checklist Maps que deshace F5
F6:    lo mismo + pasarela + datos de pago + más superficie sin RBAC/CI
```

Diferir no “compra tiempo de diseño”. Compra el primer incidente en staging: mapa gris otra vez, contacto 500, colores/reseñas 500, y un checkout que nadie puede regresar en pipeline.

---

## Referencias

| Documento | Quién |
|-----------|--------|
| `comun/deuda-fases-previas.md` | DevOps (IDs DEV-P0-001 … DEV-P2-011) |
| [QA-F5-signoff.md](../qa-signoffs/QA-F5-signoff.md) | QA |
| Arquitecto `comun/infra-requirements.md`, ADR-015, ADR-020 | Arquitecto |
| UX `fase-5/user-flows/UF-GEO-01`, `UF-CAT-01`, `UF-BRAND-01` | UX/UI |

*Agente QA / Tester Senior — LaBorregaMarket v0.5.0 — 15/08/2026.*
