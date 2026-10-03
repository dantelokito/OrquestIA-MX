# ADR-042 — Documentos legales versionados y registro de consentimiento en BD

> **Estado:** Aprobado  
> **Fecha:** 2026-10-03  
> **Fase:** 15  
> **US:** US-LEGAL-01…04, US-CONSENT-01, US-CONSENT-03  
> **Decisores:** Arquitecto de Software

## Inputs Utilizados

- `fase-15/pm.md` (Must legal; Won't: datos del responsable en variables de entorno, autoservicio ARCO, casilla de marketing)
- Código `feat/f15-legal-cache` @ `caaedba`: `POST /api/auth/register` crea `User` sin transacción; `POST /api/providers` sin aceptación; `AuditLog` con `ipAddress`; `SystemModule` sin `LEGAL`; páginas `/`, `/login`, `/registro` sin `dynamic` (prerender estático)

---

#### 1. Contexto y Problema

LFPDPPP 2025 y LFPC 76 bis exigen publicar identidad, domicilio y medio de contacto del responsable, y el Código de Comercio exige poder demostrar la aceptación electrónica. Los textos cambiarán tras la revisión del abogado, así que hace falta versionar sin perder qué versión aceptó cada usuario. El humano quiere editar los datos del responsable sin desplegar.

---

#### 2. Opciones Consideradas

* **A — Textos y datos en BD (`LegalSettings` fila única, `LegalDocument` inmutable por versión, `UserConsent` por aceptación):** Pros: editable por ADMIN, evidencia por versión, sin redeploy. Contras: 3 tablas y un enum nuevo; las páginas que muestran el footer deben renderizarse dinámicas.
* **B — Textos en Markdown en el repo y versión como constante:** Pros: diff en git. Contras: cada cambio exige deploy; los datos del responsable quedarían en código o env (Won't PM).
* **C — Proveedor externo de consentimiento (CMP):** Contras: costo, script de terceros, sobredimensionado para cookies estrictamente necesarias.

---

#### 3. Decisión Elegida

**Opción A.**

- `LegalSettings`: una sola fila `id = 1` (CHECK en SQL), columnas de negocio **nullable** para poder existir incompleta; la completitud se calcula (`isComplete`, `missingFields[]`). La migración inserta la fila vacía.
- `LegalDocument`: `(type, version)` único; **nunca se actualiza** (no hay endpoint PATCH/DELETE). Vigente = mayor `version` del `type` con `effectiveAt <= now()`.
- `UserConsent`: referencia `documentId` + copia `documentType` y `version` (consulta sin join); `source` distingue registro, alta de negocio y re-aceptación. Único `(userId, documentId, source)`; sin IP.
- La aceptación se valida contra la versión **vigente** que el cliente declara haber visto (`termsVersion`, `privacyVersion`); versión vieja o inexistente → 400.
- `User`/`Provider` y sus `UserConsent` se crean en **la misma transacción**.
- Contenido en Markdown restringido (`##`, `###`, párrafos, listas, enlaces `https:`/rutas internas); FE lo renderiza con un parser propio sin `dangerouslySetInnerHTML`.
- El seed de v1 vive en `prisma/seed-legal.ts` (idempotente: crea v1 solo si el `type` no tiene versiones) y se invoca desde `prisma/seed.ts` y como script `db:seed:legal`, que DevOps corre después de `migrate deploy`.
- Módulo RBAC nuevo `SystemModule.LEGAL`. `ALTER TYPE ... ADD VALUE` va en **una migración propia** porque PostgreSQL no permite usar el valor nuevo en la misma transacción; la segunda migración crea tablas e inserta `Module` + `RolePermission` ADMIN.
- Opt-in de WhatsApp del proveedor = columna nueva `Provider.whatsappOrderOptIn` (`whatsapp_order_opt_in`, default `false`) + `whatsappOrderOptInAt` (`whatsapp_order_opt_in_at`), separada de `whatsappEnabled` (contacto público F7/F14) y de `User.whatsappOptIn` (cliente).
- Domicilio del responsable = **un solo campo de texto** `address` (10–300 caracteres), sin partir en calle/colonia/CP.
- `rfc` nunca sale en la lectura pública (dato personal si es persona física); solo en `GET /api/admin/legal/settings`.
- Marcadores `{{RESPONSABLE_NOMBRE}}`, `{{RESPONSABLE_DOMICILIO}}`, `{{CORREO_ARCO}}`, `{{TELEFONO}}` en el contenido se sustituyen en servidor desde `LegalSettings` al renderizar; dato faltante → "en actualización". Así un cambio del responsable no exige publicar versión nueva; queda en `AuditLog`.
- RBAC por **rol** (`RolePermission`): ADMIN con los 4 permisos; PROVIDER y CLIENT sin fila. "ADMIN sin permiso LEGAL" se prueba poniendo en `false` la fila (ADMIN, LEGAL).
- Retención: `AuditLog.ipAddress` 12 meses; la purga (Should, `audit-ip-purge`) anonimiza (`ip_address = NULL`), no borra filas. IP del rate limit solo vive en Redis con el TTL de su ventana.

---

#### 4. Consecuencias e Impacto

* **Positivas:** evidencia por versión; datos del responsable sin deploy; aceptaciones previas intactas al publicar versión nueva.
* **Negativas:** `/`, `/login`, `/registro`, `/registro/negocio` y `/legal/*` pasan a render dinámico (una lectura por PK por request). Si no hay `TERMS`/`PRIVACY` publicados el registro responde 503 (invariante de despliegue: `db:seed:legal`).
* **Riesgos:** textos borrador IA; gate de abogado en DevOps antes de producción.

## Referencias

- `fase-15/arch.md` (API-LEGAL-*, API-AUTH-15-01, API-PROV-15-*, DB-*)
- ADR-002, ADR-003, ADR-031 (RBAC dual)
