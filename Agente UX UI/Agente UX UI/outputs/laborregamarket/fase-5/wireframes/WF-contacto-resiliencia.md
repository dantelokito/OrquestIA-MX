> **Pantalla:** ContactCTA — resiliencia 429 / 503 / 500 (`/fruteria/[id]`)
> **Objetivo Principal:** Llamar o WhatsApp siguen funcionando cuando el aviso a la frutería falla (módulo Redis ausente, prod fail-closed, rate limit)
> **Base:** Extiende [`../../fase-2/wireframes/WF-contacto-cta.md`](../../fase-2/wireframes/WF-contacto-cta.md). Encargar F3 no se toca (D-F3-7).

```text
+-----------------------------------------------------------------------+
|  Detalle frutería                                                     |
|  [ Encargar ]  PRIMARY F3                                             |
|  [ Llamar ] [ WhatsApp ]  secundarios — NUNCA disabled por notify     |
+-----------------------------------------------------------------------+
|  Toast (un solo, role=status)                                         |
|                                                                       |
|  200:  La frutería fue notificada                          success    |
|  429:  (sin toast)                                                    |
|  503:  El aviso a la frutería no está disponible. Puedes   error      |
|        llamar igual.                                                  |
|  500 / red:  No pudimos avisar a la frutería. Puedes       error      |
|        llamar igual.                                                  |
+-----------------------------------------------------------------------+
```

### Prohibido

- Empty de mapa (“El mapa no cargó” / “Mapa no disponible”).
- Copy de stock / “agotado” / “No hay productos activos”.
- Toast **success** en 500 o 503.
- Bloquear `tel:`, `wa.me` o Encargar porque el POST de notify falló.
- UI de “módulo Redis” o causas internas.

#### Estados (delta F2)

| Estado | Comportamiento UI |
|--------|-------------------|
| **Success (200, notified)** | Toast F2: `La frutería fue notificada` |
| **Rate limit (429)** | Sin toast de éxito; `tel:` / WhatsApp ya abiertos (F2) |
| **Fail-closed (503)** | Toast error: **El aviso a la frutería no está disponible. Puedes llamar igual.** |
| **Error servidor / red (500)** | Toast error: **No pudimos avisar a la frutería. Puedes llamar igual.** |
| **Loading breve** | ≤300ms en el POST; `tel:` no espera (F2) |

`tel:` dispara en paralelo al POST. El toast es fire-and-forget.

#### Componentes Requeridos para Frontend:
* **ContactCTA:** ramificar `ApiError.status` 429 / 503 / 500 (hoy 429 se silencia y el resto comparte un solo copy).
* **Toast:** variante `error` para 503 y 500; `success` solo 200. `role="status"` `aria-live="polite"`.
* Encargar permanece CTA dominante de la pantalla detalle (F3).

#### Responsividad:
* Igual que F2: sticky móvil; desktop en hero. Toast sobre el sticky.

#### Accesibilidad:
* Un toast a la vez. Copy 503/500 en `text-slate-900` (borde error). No anunciar causas internas.

#### API esperada:
* `POST /api/providers/[id]/contact` — 200 notified; 429 rate limit; **503** Redis ausente en prod (ADR-015); **500** compile/módulo (DEV-P0-001) o error interno.
* UX no inventa rutas. Backend cierra el manifiesto Redis.

#### Referencias:
* Flujo F2: `../../fase-2/user-flows/UF-NOTIFY-01-contacto.md`
* Handoff: `../handoff-frontend-deuda.md`
* Tokens: Toast (copy 503/500) en `comun/design-tokens.md`
