# Handoff de Feature: FEAT-NOTIFY

> **Proyecto:** laborregamarket  
> **Feature:** NOTIFY  
> **Stack UI:** Next.js 15 + React 19 + Tailwind  
> **Fecha:** 2026-08-10  
> **Wireframe:** `WF-contacto-cta`, `WF-fruteria-detalle`  
> **US:** US-NOTIFY-01…05  
> **Contrato:** `API-NOTIFY-01`

---

## 1. Pantallas y componentes

| Vista | Ruta | Estado |
|-------|------|--------|
| Detalle frutería CTA | `/fruteria/[id]` | OK |
| Card explorar Contactar | `/explorar` | OK |
| Admin badge email / audit | `/admin` | OK |

**Componentes:**

| Componente | Ubicación |
|------------|-----------|
| `ContactCTA` | `src/components/fruteria/ContactCTA.tsx` |
| `Toast` / `ToastProvider` | `src/components/ui/Toast.tsx` |
| `AppProviders` | `src/components/providers/AppProviders.tsx` |

## 2. Integración API

| Endpoint | Método | Service | Estado |
|----------|--------|---------|--------|
| `/api/providers/[id]/contact` | POST | `notifyProviderContact` | OK |

- Body: `{ source: "call_button" | "whatsapp_button" }`
- 429: sin toast spam; `tel:` nunca bloqueado
- Toast éxito UX: **"La frutería fue notificada"**

## 3. Estados UI

| Vista | Loading | Empty | Error | Success |
|-------|---------|-------|-------|---------|
| ContactCTA | — | — | soft toast / silent 429 | toast 3–5s `aria-live` |

## 4. Accesibilidad

- [x] Toast `aria-live="polite"` / `role="status"`
- [x] Targets ≥44px en CTAs sticky
- [x] WhatsApp secondary (`wa.me`)

## 5. Admin

- Columna notificación con badge **Sin email válido** (`hasValidEmail === false`)
- Bitácora: filtro “Solo contactos” (`module=PROVIDERS&action=CONTACT`)
