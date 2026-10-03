> **Flujo:** Contacto con notificación al proveedor
> **Historia de Usuario Asociada:** US-NOTIFY-01, US-NOTIFY-02, US-NOTIFY-03, US-NOTIFY-04, US-NOTIFY-05
>
> **Punto de entrada:** `/fruteria/[id]` — CTA "Llamar" (dominante) o "WhatsApp" (secundario Should)
>
> **Pasos del Usuario:**
> 1. `[Pantalla: /fruteria/[id]]` → Cliente (o visitante) ve detalle del negocio y productos activos.
> 2. `[CTA Llamar]` → Usuario hace clic en "Llamar" / "Llamar ahora".
> 3. `[Paralelo A — UI]` → Se inicia `tel:{phone}` de inmediato (sin esperar red). Botón puede mostrar loading breve ≤300ms.
> 4. `[Paralelo B — API]` → `POST /api/providers/[id]/contact` con body opcional `{ "source": "call_button", "productIds": [...] }` (público; CLIENT opcional).
> 5. `[Feedback éxito]` → Si registro OK → Toast `"La frutería fue notificada"` (3–5s, dismiss manual, `aria-live="polite"`). Email al proveedor es async (≤30s); UI no espera el email.
> 6. `[Opcional Should — WhatsApp]` → Segundo CTA "WhatsApp" abre `https://wa.me/{digits}?text={mensajePrellenado}` (source: `whatsapp_button`). Misma secuencia de registro + toast; no bloquea el enlace.
>
> **Condicionales:**
> - **Éxito notificación:** → Toast éxito; llamada/WhatsApp ya en curso.
> - **Error de red en POST:** → `tel:` / `wa.me` siguen; Toast opcional `"No pudimos notificar a la frutería"`. Cliente nunca ve causas internas.
> - **Proveedor sin email / email inválido (US-NOTIFY-04):** → AUDIT con `notificationFailed`; cliente ve mismo toast genérico de éxito de registro o error genérico — **nunca** "sin email".
> - **Rate limit (US-NOTIFY-05):** → Sin nuevo email; `tel:` siempre usable. Omitir toast de éxito o mostrar genérico; sin UI de "bloqueado".
> - **Sin login:** → Mismo flujo; no gate de autenticación.
>
> **Reglas UI:**
> - CTA dominante: **Llamar** (`--brand`). WhatsApp = Button secondary.
> - Un solo toast a la vez; no bloquear scroll ni el sticky footer.
> - Sin PII del cliente en email (US-NOTIFY-01 / D-F2-4).
> - Wireframe: `WF-contacto-cta.md`. Actualiza detalle: `WF-fruteria-detalle.md`.
>
> **API esperada:**
> - `POST /api/providers/[id]/contact` → `{ data: { notified: true, message: "Frutería notificada" } }`
> - NFR: respuesta < 200ms; rate limit 5/proveedor/10min por IP/sesión.
