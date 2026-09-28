> **Pantalla:** Detalle frutería — reseñas nativas + embed Google (`/fruteria/[id]`)
> **Objetivo Principal:** Mostrar reputación real (nativa) y, si aplica, enlace a Google
> **Base:** Extiende [`../../fase-1/wireframes/WF-fruteria-detalle.md`](../../fase-1/wireframes/WF-fruteria-detalle.md) y [`../../fase-3/wireframes/WF-fruteria-encargar.md`](../../fase-3/wireframes/WF-fruteria-encargar.md)
> Encargar sigue siendo el CTA dominante (D-F3-7 intacto).

```text
+-----------------------------------------------------------------------+
| [Header]                                                              |
+-----------------------------------------------------------------------+
|  Hero: cover · logo · nombre · badge verificado                       |
|  RatingStars 4.6 (23 reseñas)   o   "Sin reseñas todavía"             |
|  [ Encargar ] PRIMARY     [ Llamar ] [ WhatsApp ]                     |
+-----------------------------------------------------------------------+
|  … info · mini mapa · productos + stepper F3 …                        |
+-----------------------------------------------------------------------+
|  Reseñas de clientes                                                  |
|  ┌─────────────────────────────────────────────────────────────────┐ |
|  │ ★★★★☆  María · hace 3 días                                      │ |
|  │ "Muy fresca, listo para recoger a tiempo."                        │ |
|  ├─────────────────────────────────────────────────────────────────┤ |
|  │ ★★★★★  Luis · hace 1 sem                                        │ |
|  │ "Buen mango."                                                     │ |
|  └─────────────────────────────────────────────────────────────────┘ |
|  [ Ver más ] paginación                                               |
+-----------------------------------------------------------------------+
|  Ver reseñas en Google   ← SOLO si googleReviewsEnabled=true          |
|  [ Abrir en Google Maps ↗ ]  secondary (enlace / embed ligero)        |
+-----------------------------------------------------------------------+
```

### Sin reseñas nativas

```text
|  Reseñas de clientes                                                  |
|  EmptyState: "Sin reseñas todavía"                                    |
|  (NO estrellas ☆☆☆☆☆ en 0.0)                                         |
```

### Google no habilitado

```text
|  (bloque Google omitido por completo — no mostrar disabled al público)|
```

#### Estados de la pantalla

| Estado | Comportamiento UI |
|--------|-------------------|
| **Loading reseñas** | Skeleton 3 filas bajo hero |
| **Empty nativas** | "Sin reseñas todavía"; hero sin número falso |
| **Success** | Lista ReviewCard + rating agregado |
| **Error reseñas** | Hint "No cargamos las reseñas" + Reintentar; Encargar intacto |
| **Embed Google** | Link externo `rel="noopener"`; embed opcional lazy iframe |

#### Componentes Requeridos para Frontend:
* **RatingStars** display (no input) + `reviewCount`.
* **ReviewCard:** rating, autor, fecha relativa, comentario.
* **GoogleReviewsLink:** secondary; solo `googleReviewsEnabled`.

#### Responsividad:
* **Mobile:** Sección reseñas bajo productos; Encargar sticky F3.
* **Desktop:** Reseñas full-width bajo grid info.

#### API esperada:
* `GET /api/providers/[id]` — `rating`, `reviewCount`, `googleReviewsEnabled`, `googleMapsUrl`
* `GET /api/providers/[id]/reviews?page=`

#### Referencias:
* Flujos: `UF-REV-01-resena-post-entrega.md`, `UF-REV-02-google-proveedor.md`
