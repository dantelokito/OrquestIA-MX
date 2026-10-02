> **Pantalla:** Calificar pedido entregado (modal o `/cuenta/pedidos/[id]/resena`)
> **Objetivo Principal:** Publicar una reseña 1–5 + comentario para un pedido `COMPLETED` propio

```text
+-----------------------------------------------------------------------+
| [Header CLIENT]                                                       |
+-----------------------------------------------------------------------+
|  ┌── Modal / panel max-w-lg ───────────────────────────────────────┐ |
|  │  Calificar tu pedido #1042                                        │ |
|  │  Frutas El Paraíso · Entregado · 12 ago                           │ |
|  │                                                                   │ |
|  │  ¿Qué te pareció?                                                 │ |
|  │  [☆] [☆] [★] [★] [★]     aria: "Calificación 3 de 5"            │ |
|  │                                                                   │ |
|  │  Comentario (opcional)                                            │ |
|  │  [________________________________]                               │ |
|  │   0/500                                                           │ |
|  │                                                                   │ |
|  │  [ Cancelar ] secondary     [ Publicar reseña ] PRIMARY           │ |
|  └───────────────────────────────────────────────────────────────────┘ |
+-----------------------------------------------------------------------+
```

### Ya existe reseña (Must — solo lectura)

```text
|  Tu reseña · #1042                                                    |
|  ★★★★☆  4/5                                                          |
|  "Muy fresca la fruta, recoger fue rápido."                           |
|  (sin editar en Must)                                                 |
```

#### Estados de la pantalla

| Estado | Comportamiento UI |
|--------|-------------------|
| **Loading** | Skeleton estrellas + textarea |
| **Empty rating** | CTA Publicar disabled; inline "Elige una calificación" al submit |
| **Success** | Cierra modal; toast "Gracias por tu reseña"; card pasa a solo lectura |
| **Error 409** | "Ya calificaste este pedido" + muestra reseña existente |
| **Error red** | ErrorBanner + Reintentar; draft de comentario se conserva |
| **Pedido no elegible** | No se abre; CTA ausente en la card |

#### Componentes Requeridos para Frontend:
* **RatingStars:** 5 botones 44px; teclado flechas; `aria-valuenow`.
* **ReviewForm:** textarea 500; CTA Publicar único primary.
* **ConfirmDialog** no requerido (publicar es directo; Cancelar cierra).

#### Responsividad:
* **Mobile:** Full-screen sheet o modal `w-full`; CTA `w-full`.
* **Desktop:** Modal centrado `max-w-lg`; focus trap + Escape.

#### API esperada:
* `POST /api/orders/[id]/reviews` — `{ rating, comment? }`

#### Referencias:
* Flujo: `../user-flows/UF-REV-01-resena-post-entrega.md`
* Cuenta: `WF-cuenta-pedidos-f4.md`
