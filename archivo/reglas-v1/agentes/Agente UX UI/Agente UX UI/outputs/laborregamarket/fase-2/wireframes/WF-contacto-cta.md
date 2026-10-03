> **Pantalla:** ContactCTA — contacto en detalle frutería (`/fruteria/[id]`)
> **Objetivo Principal:** Iniciar llamada (y opcionalmente WhatsApp) con feedback de notificación no bloqueante
>
> ### Mobile — sticky footer (`<= 640px`)
>
> ```text
> +-----------------------------------------------------------------------+
> | … (contenido detalle frutería arriba)                                 |
> +-----------------------------------------------------------------------+
> | [STICKY FOOTER — fixed bottom-0 w-full p-4 bg-white border-t]         |
> |                                                                       |
> |  [ 📞  Llamar ahora                    ]  ← Primary w-full / flex-1  |
> |  [ WhatsApp                            ]  ← Secondary (Should)       |
> |                                                                       |
> |  Toast (si activo):                                                   |
> |  ┌─────────────────────────────────────────────────────────────────┐ |
> |  │ La frutería fue notificada                              [ ✕ ]  │ |
> |  └─────────────────────────────────────────────────────────────────┘ |
> |  aria-live="polite" · auto-dismiss 3–5s                               |
> +-----------------------------------------------------------------------+
> ```
>
> ### Desktop (`>= 1024px`)
>
> ```text
> +-----------------------------------------------------------------------+
> |  ProviderHero / sidebar acciones                                      |
> |                                                                       |
> |  [ 📞 Llamar ahora ]   ← Primary (CTA dominante)                     |
> |  [ WhatsApp ]          ← Secondary outline                           |
> |                                                                       |
> |  Toast fixed top-right o bajo hero (no modal)                         |
> +-----------------------------------------------------------------------+
> ```
>
> #### Estados del componente
>
> | Estado | Comportamiento UI |
> |--------|-------------------|
> | **Default** | Llamar primary; WhatsApp secondary visible si hay teléfono/WhatsApp del negocio |
> | **Loading breve** | Tras clic Llamar: spinner/opacidad en botón ≤300ms mientras dispara POST; `tel:` no espera |
> | **Success toast** | Copy: `La frutería fue notificada`; `aria-live="polite"`; dismiss 3–5s o ✕ |
> | **Error toast** | Copy: `No pudimos notificar a la frutería`; llamada/WhatsApp ya abiertos |
> | **Rate limited** | Sin toast de éxito o genérico; `tel:` / `wa.me` siempre habilitados |
> | **Disabled** | Solo si no hay `phone` en provider — ocultar o disable Llamar con hint |
>
> #### Componentes Requeridos para Frontend:
> * **ContactCTA:** grupo botones; primary = `tel:{phone}`; secondary = `wa.me/{digits}?text=…`.
> * **Toast:** región `role="status"` + `aria-live="polite"`; un toast a la vez; `z-index` sobre sticky.
> * **Contact trigger:** al clic → fire-and-forget `POST /api/providers/[id]/contact` (`source`: `call_button` | `whatsapp_button`).
> * Touch targets: min **44px** altura en ambos botones.
>
> #### Copy WhatsApp (mensaje pre-llenado sugerido):
> `Hola, vi tu negocio en LaBorregaMarket y me interesa contactarte.`
>
> #### Responsividad:
> * **Mobile:** Footer sticky; stack vertical Llamar → WhatsApp; padding bottom en contenido para no tapar tabla.
> * **Desktop:** CTAs en hero/sidebar; sin sticky footer.
>
> #### Jerarquía visual (DoD):
> * Un solo CTA dominante: **Llamar** (`bg-[var(--brand)]`).
> * WhatsApp nunca compite en peso visual (secondary / outline).
>
> #### API esperada:
> * `POST /api/providers/[id]/contact` — ver UF-NOTIFY-01.
>
> #### Referencias:
> * Flujo: `UF-NOTIFY-01-contacto.md`
> * Pantalla contenedora: `WF-fruteria-detalle.md`
> * Tokens: Toast, ContactCTA en `design-tokens.md`
