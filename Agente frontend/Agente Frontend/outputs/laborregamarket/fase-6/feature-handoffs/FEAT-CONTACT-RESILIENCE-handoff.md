# Handoff de Feature: FEAT-CONTACT-RESILIENCE

> **Proyecto:** laborregamarket  
> **Feature:** CONTACT-RESILIENCE (toasts 429 / 503 / 500)  
> **Stack UI:** Next.js 15 + React 19 + Tailwind 4  
> **Fecha:** 2026-08-16  
> **Wireframe:** `WF-contacto-resiliencia`  
> **Contrato:** `API-NOTIFY-01` (503 fail-closed Redis)  
> **US:** US-NOTIFY-10 · DEV-P0-001 UI · DEV-P1-005

---

## 1. Pantallas y componentes implementados

| Pantalla / Vista | Wireframe | Ruta | Estado |
|------------------|-----------|------|--------|
| ContactCTA | `WF-contacto-resiliencia` | `/fruteria/[id]`, `/explorar` | OK |

**Componentes:**

| Componente | Ubicación | Descripción |
|------------|-----------|-------------|
| ContactCTA | `src/components/fruteria/ContactCTA.tsx` | Ramifica 429 / 503 / 500 |
| notifyContactToast | `src/lib/ui/contact-toast.ts` | Copy canónico testeable |

`tel:`, `wa.me` y Encargar no se deshabilitan por fallo de notify.

---

## 2. Integración API

| Endpoint | Método | Service | Contrato | Estado |
|----------|--------|---------|----------|--------|
| `/api/providers/[id]/contact` | POST | `notifyProviderContact` | API-NOTIFY-01 | OK |

- [x] Cookie de sesión (`credentials: include`)
- [x] Sin `fetch` en la vista; capa `lib/api/providers.ts`

| HTTP | Toast | Variante |
|------|-------|----------|
| 200 `notified` | La frutería fue notificada | success |
| 429 | silencio | — |
| 503 | El aviso a la frutería no está disponible. Puedes llamar igual. | error |
| 500 / red | No pudimos avisar a la frutería. Puedes llamar igual. | error |

---

## 3. Estados UI (4 estados obligatorios)

| Vista | Loading | Empty | Error | Success |
|-------|---------|-------|-------|---------|
| ContactCTA | — (fire-and-forget) | — | toast 503 ≠ 500; 429 silent | toast 3–5s `aria-live` |

---

## 4. Formularios y validación

N/A (CTA, no formulario).

---

## 5. Responsive y accesibilidad

- [x] Targets ≥44px
- [x] Toast `role="status"` `aria-live="polite"`
- [x] Llamar / WhatsApp / Encargar siempre usables

---

## 6. Pruebas

**Comando:** `npx vitest run tests/unit/contact-toast.test.ts`

- [x] 429 silencio
- [x] 503 copy dedicado
- [x] 500 / TypeError copy de red

---

## 7. Definition of Done (DoD Frontend)

- [x] **Diseño Pixel-Fidelidad**
- [x] **Responsive Design**
- [x] **Manejo de los 4 Estados UI**
- [x] **Consumo Limpio de APIs**
- [x] **Validación de Formulario** (N/A)
- [x] **Accesibilidad Basal**

---

## 8. Notas para downstream

### QA Tester

- Flujos: Llamar / WhatsApp con Redis down (503), 500, 429, éxito.
- Confirmar que `tel:` abre el marcador aunque el toast sea error.
- Datos: usuario CLIENT; frutería con teléfono.

### DevOps

- 503 lo produce Backend si Upstash falta en prod. Frontend no instala `@upstash/redis`.
