# ADR-025 — Cookie JWT first-party (sesión móvil y segundo navegador)

> **Estado:** Aceptado  
> **Fecha:** 2026-08-18  
> **Decisores:** Arquitecto de Software  
> **Fase:** 7 — v0.7.1  
> **US:** US-AUTH-09  
> **Distinto de:** US-AUTH-08 / DEV-P1-007 (`JWT_SECRET` por entorno)

---

#### 1. Contexto y Problema:

Login funciona en el desktop original y falla o entra en loop 401 en Safari/Chrome móvil u otro navegador (`US-AUTH-09`). Causas típicas: `SameSite=None` sin `Secure`, `Secure` en HTTP local, `Domain` que no coincide con el host, fetch sin cookie, JWT en querystring, o staging con `NODE_ENV=development` (cookie sin `Secure` en HTTPS mixto / ITP).

La app es **monolito Next.js** (misma origin para HTML y `/api/*`). No hay SPA en otro dominio.

---

#### 2. Opciones Consideradas:

* **Opción A — Cookie httpOnly same-origin (`SameSite=Lax`):** Pros: first-party; CSRF de POST cross-site reducido; no JWT en JS. Contras: no sirve si el FE vive en otro site (no es el caso).
* **Opción B — `Authorization: Bearer` en cada request:** Pros: portable a nativo. Contras: token en memoria/storage; no cierra el Must web; riesgo XSS.
* **Opción C — `SameSite=None; Secure`:** Pros: cross-site. Contras: innecesario same-origin; Safari/ITP más estricto; requiere HTTPS siempre.

---

#### 3. Decisión Elegida:

**Opción A.** Sesión = cookie JWT existente. Flags:

| Flag | Local HTTP | Staging / prod HTTPS |
|------|------------|----------------------|
| `HttpOnly` | true | true |
| `Path` | `/` | `/` |
| `SameSite` | `Lax` | `Lax` |
| `Secure` | **false** | **true** |
| `Domain` | omitir (host actual) | omitir salvo subdominio documentado |

- **Prohibido:** JWT en querystring, body de login como única sesión (el campo `token` legacy no es Must), `SameSite=None`.
- FE: `credentials: 'include'` o fetch same-origin. No CORS credentials a otro host.
- Staging/prod: HTTPS + `NODE_ENV=production` para que `Secure` se active (DEV-P1-007).
- `GET /api/auth/session` o `/api/me` equivalente: lee cookie; 200 invitado si no hay JWT.

Nota de contrato: [`../../fase-7/api/API-AUTH-01.md`](../../fase-7/api/API-AUTH-01.md).

---

#### 4. Consecuencias e Impacto:

* **Positivas:** Un modelo de sesión para desktop y móvil; QA puede matriz iOS/Android + segundo Chrome.
* **Riesgos / Compensaciones:** Si algún día el FE se sirve de otro dominio, hay que reabrir este ADR (opción C o B). Cookie sin `Secure` en local no debe copiarse a prod.
