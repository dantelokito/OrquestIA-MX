# User Story — US-NOTIFY-10

> **ID:** US-NOTIFY-10  
> **Título:** Contacto resiliente (Redis en lockfile, 503 de prod, toasts 429/503/500)  
>
> **Como:** CLIENT o visitante en el detalle de una frutería  
> **Quiero:** que “avisar a la frutería” no se caiga con un 500 genérico, y poder llamar o encargar igual  
> **Para:** no leer el producto como roto cuando el aviso no está disponible  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Lockfile):** Dado un clone limpio (`npm ci`), cuando se resuelve `import { Redis } from "@upstash/redis"` en el rate-limit de contacto, entonces el módulo existe en `package.json` y `package-lock.json` (cierra **DEV-P0-001**). Prohibido `import()` dinámico solo para que compile.
> - [ ] **Escenario 2 (Prod fail-closed):** Dado `NODE_ENV=production` sin `UPSTASH_*` (o Redis caído), cuando hago `POST /api/providers/[id]/contact`, entonces recibo **503** envelope ADR-003, **no** 500 `Can't resolve`.
> - [ ] **Escenario 3 (Toasts):** Dado el CTA de contacto, cuando la API responde, entonces: 200 `notified` → toast éxito F2; 429 → silencio F2; **503** → “El aviso a la frutería no está disponible. Puedes llamar igual.”; **500**/red → “No pudimos avisar a la frutería. Puedes llamar igual.”
> - [ ] **Regla de Negocio:** D-F6-2 / D-F6-7. `tel:`, `wa.me` y Encargar **siguen usables**. Nunca empty de mapa ni “agotado”. Umbrales 429 = ADR-015. Copy canónico: handoff UX 16/08 (`WF-contacto-resiliencia.md`).

>
> **UX:** ya diseñado — `Agente UX UI/.../fase-6/handoff-frontend-fase-6.md`. **Arquitecto/BE:** `fase-6/handoff-backend-fase-6.md`. **QA:** 503 ≠ 500 ≠ 429; CTA no se deshabilita.
