# ADR-044 — Analítica con Umami sin cookies, DNT y opt-out local

> **Estado:** Aprobado  
> **Fecha:** 2026-10-03  
> **Fase:** 15  
> **US:** US-COOKIE-01, US-ANALYTICS-01  
> **Decisores:** Arquitecto de Software

## Inputs Utilizados

- `fase-15/pm.md` (Won't: GA4 / PostHog / Sentry, banner opt-in bloqueante)
- Código `feat/f15-legal-cache` @ `caaedba`: `next.config.ts` sin CSP; `/api/admin/analytics` es agregado de pedidos (no se toca)

---

#### 1. Contexto y Problema

Se necesita medir vistas y 6 eventos sin cookies ni PII para que baste un aviso informativo (no consentimiento expreso). La medición debe poder desactivarse y respetar DNT, y no debe romper la app si Umami no responde o no está configurado.

---

#### 2. Opciones Consideradas

* **A — Umami (script oficial, sin cookies) + wrapper `track()` con allowlist:** Pros: sin cookies, datos agregados, auto-hospedable o cloud. Contras: script de tercero (CSP).
* **B — Eventos propios a nuestra BD:** Contras: construir dashboards; IP en nuestros logs.
* **C — GA4 / PostHog:** Won't PM (cookies, PII, consentimiento expreso).

---

#### 3. Decisión Elegida

**Opción A.**

- Componente cliente `UmamiScript` en `src/app/layout.tsx`: inyecta `<Script strategy="afterInteractive">` **solo si** existen `NEXT_PUBLIC_UMAMI_SRC` y `NEXT_PUBLIC_UMAMI_WEBSITE_ID`, `navigator.doNotTrack !== "1"`, `navigator.globalPrivacyControl !== true` y `localStorage["lbm_measurement"] !== "off"`.
- Atributos: `data-website-id`, `data-do-not-track="true"`, `data-exclude-search="true"` (no viajan `q`, `lat`, `lng` en la URL), `data-exclude-hash="true"`, `data-domains` = dominio de producción si `NEXT_PUBLIC_UMAMI_DOMAINS` está definida (opcional).

### Llave de preferencia (única, sin cookies)

| Llave `localStorage` | Valor | Significado |
|----------------------|-------|-------------|
| `lbm_measurement` | ausente | Aviso informativo **pendiente**; medición activa (salvo DNT/GPC) |
| `lbm_measurement` | `"on"` | El usuario pulsó «Entendido» o reactivó en «Preferencias de medición»; aviso no vuelve |
| `lbm_measurement` | `"off"` | Medición desactivada; aviso no vuelve; el script no se inyecta |
| `umami.disabled` | `"1"` | Mecanismo nativo de Umami. Se escribe junto con `"off"` para cortar el script ya cargado sin recargar; se borra al pasar a `"on"` |

Cualquier otro valor se trata como ausente. No hay llave separada para "aviso visto": la presencia de `lbm_measurement` lo indica. Al reactivar se inyecta el script si no estaba.
- `src/lib/analytics/track.ts`: `track(event, props?)` tipado con unión cerrada de eventos (`explore_search`, `provider_view`, `contact_click`, `cart_add`, `register_success`, `login_success`) y props permitidas (`providerId`, `category`, `source`). Hace no-op si `window.umami` no existe, DNT=1, GPC o preferencia `off`; atrapa toda excepción. Prohibido en props: correo, teléfono, nombre, `userId`, `orderId`, texto de búsqueda, coordenadas.
- Sin `localStorage` (modo privado estricto): todo `try/catch`, el aviso se muestra cada visita y la medición queda activa salvo DNT.
- **CSP (Should):** `Content-Security-Policy-Report-Only` en `next.config.ts` con el origen de `NEXT_PUBLIC_UMAMI_SRC` en `script-src` y `connect-src`, más teselas OSM, Nominatim, Cloudinary y Unsplash. Se promueve a CSP bloqueante en una fase posterior tras revisar reportes; F15 no bloquea para no romper Leaflet ni scripts inline de Next.

---

#### 4. Consecuencias e Impacto

* **Positivas:** cero cookies nuevas; Política de Cookies solo lista `lbm_token` y `lbm_active_provider`; app idéntica sin env o con Umami caído.
* **Negativas:** sin atribución por usuario (deseado); conteos subestimados por DNT y bloqueadores.
* **Riesgos:** un dev agrega props con PII → el tipo cerrado de `track()` lo impide en compilación; QA revisa payloads.

## Referencias

- `fase-15/arch.md` · ADR-043 (CSP de `worker-src 'self'`)
