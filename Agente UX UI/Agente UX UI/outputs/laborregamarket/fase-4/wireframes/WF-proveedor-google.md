> **Pantalla:** Configuración del negocio — Google Maps y tiempo de preparación (`/proveedor#google`)
> **Objetivo Principal:** Vincular Place ID/URL (si verificado) y definir minutos de preparación
> **Base:** Extiende [`../../fase-1/wireframes/WF-proveedor-panel.md`](../../fase-1/wireframes/WF-proveedor-panel.md)

```text
+-----------------------------------------------------------------------+
| [Header PROVIDER]                                                     |
| [ Catálogo | POS | Órdenes | Dashboard ]  ← Catálogo activo           |
+-----------------------------------------------------------------------+
|  Mi catálogo — Frutas El Paraíso                                      |
|  … media + tabla productos (F1–F2, sin cambio) …                      |
+-----------------------------------------------------------------------+
|  Configuración del negocio                                            |
+-----------------------------------------------------------------------+
```

### Estado A — Verificado (`isVerified=true`)

```text
|  Reseñas en Google Maps                                               |
|  ┌─────────────────────────────────────────────────────────────────┐ |
|  │  Mostrar enlace en mi vitrina  [ toggle ON ]                    │ |
|  │  URL de Google Maps o Place ID                                  │ |
|  │  [ https://maps.google.com/…________________ ]                  │ |
|  │  Hint: Solo enlace; no importamos reseñas.                      │ |
|  │  [ Guardar vínculo ]  PRIMARY                                   │ |
|  └─────────────────────────────────────────────────────────────────┘ |
|  Tiempo de preparación                                                |
|  [ 25 ] minutos   hint: se suma al traslado en el ETA del cliente    |
|  [ Guardar ] secondary                                                |
```

### Estado B — No verificado (`isVerified=false`) — informativo, no punitivo

```text
|  Reseñas en Google Maps                                               |
|  ┌─────────────────────────────────────────────────────────────────┐ |
|  │  ℹ  Requiere verificación de tu negocio                         │ |
|  │  Cuando el equipo verifique tu frutería, podrás mostrar un      │ |
|  │  enlace a tus reseñas de Google en la vitrina.                  │ |
|  │  [ Cómo solicitar verificación → ]  link (sin plazos)           │ |
|  │                                                                 │ |
|  │  Mostrar enlace  [ toggle disabled ]                            │ |
|  │  URL o Place ID  [__________] disabled  opacity-60              │ |
|  └─────────────────────────────────────────────────────────────────┘ |
|  Tiempo de preparación  (sí editable — no depende de verificación)    |
|  [ 25 ] minutos  [ Guardar ]                                          |
```

#### Estados de la pantalla

| Estado | Comportamiento UI |
|--------|-------------------|
| **Loading** | Skeleton del bloque config |
| **Empty Place ID** | Toggle off; Guardar disabled hasta valor válido |
| **Success** | Toast "Vínculo de Google actualizado" |
| **Error formato** | Inline bajo input: "Usa una URL de Google Maps o un Place ID" |
| **Error 403** | Banner info (no rojo): "Disponible cuando tu negocio esté verificado" |
| **Disabled (B)** | `VerificationRequiredBanner` `info`; controles no interactivos |

#### Componentes Requeridos para Frontend:
* **VerificationRequiredBanner:** `bg-blue-50 text-blue-900` + icono `Info`; contraste AA; **nunca** `error`/`warning`.
* **GooglePlaceField:** URL o Place ID; validación cliente + servidor.
* **PrepTimeInput:** número 5–180 min; step 5.
* Toggle con `aria-checked`; disabled anuncia "Requiere verificación".

#### Responsividad:
* **Mobile:** Bloques stack; toggle y Guardar `w-full`.
* **Desktop:** `max-w-2xl` bajo el catálogo.

#### API esperada:
* `PATCH /api/provider/profile` — `{ googlePlaceId?, googleMapsUrl?, googleReviewsEnabled?, preparationTimeMinutes? }`

#### Referencias:
* Flujo: `../user-flows/UF-REV-02-google-proveedor.md`, `UF-NOTIFY-01-eta.md`
