> **Flujo:** Vincular reseñas de Google Maps (proveedor) — habilitado o bloqueado
> **Historia de Usuario Asociada:** US-REV-03, US-REV-04
>
> **Punto de entrada:** Login PROVIDER → `/proveedor` (sección Configuración del negocio) o ancla `#google`
>
> **Pasos del Usuario:**
> 1. `[Pantalla: config negocio]` → Bloque "Reseñas en Google Maps" visible **siempre** (verificado o no).
> 2. `[Estado A — isVerified=true]` → Inputs URL o Place ID habilitados; toggle "Mostrar en mi vitrina". Usuario guarda → `/fruteria/[id]` muestra enlace/embed "Ver reseñas en Google".
> 3. `[Estado B — isVerified=false]` → Mismos controles **disabled**. Banner informativo (no error): **"Requiere verificación de tu negocio"** + texto/enlace de cómo solicitarla (sin prometer tiempos).
> 4. `[Validación]` → URL de Google Maps o Place ID con formato esperado; error inline si no.
>
> **Condicionales:**
> - **Formato inválido:** → mensaje bajo el input; toggle no se activa.
> - **ADMIN revoca verificación:** → `googleReviewsEnabled` se apaga en vitrina; el dato se conserva; el proveedor vuelve a Estado B.
> - **Loading guardar:** → Spinner en Guardar; inputs disabled.
> - **Error 403/422** (bypass): → ErrorBanner "Esta opción está disponible cuando tu negocio esté verificado".
> - **Éxito:** → Toast "Vínculo de Google actualizado".
>
> **Reglas UI:**
> - El bloque bloqueado se lee **informativo**, no punitivo: paleta `info` (`#3B82F6`), icono `Info`, nunca `error` rojo ni copy de "castigo".
> - CTA dominante Estado A: **Guardar vínculo**. Estado B: sin CTA primario en el bloque (el CTA vive en el mensaje de verificación, secondary/link).
> - Solo enlace/embed — no listar reseñas importadas de Google.
> - Incluir en la misma pantalla `preparationTimeMinutes` (UF-NOTIFY-01).
> - Wireframe: `WF-proveedor-google.md`; vitrina: `WF-fruteria-reviews.md`.
>
> **API esperada:**
> - `PATCH /api/provider/profile` — `{ googlePlaceId?, googleMapsUrl?, googleReviewsEnabled?, preparationTimeMinutes? }`
> - Backend rechaza Google fields si `isVerified=false` (403 o 422)
