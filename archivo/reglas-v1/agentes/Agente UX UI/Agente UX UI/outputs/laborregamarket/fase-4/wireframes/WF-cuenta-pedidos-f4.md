> **Pantalla:** Cuenta cliente — pedidos Fase 4 (`/cuenta#pedidos`)
> **Objetivo Principal:** Calificar entregados y mostrar copy de fulfillment correcto
> **Base:** Extiende [`../../fase-3/wireframes/WF-cuenta-pedidos.md`](../../fase-3/wireframes/WF-cuenta-pedidos.md)

```text
+-----------------------------------------------------------------------+
| [Header CLIENT]                                                       |
+-----------------------------------------------------------------------+
|  Mi cuenta · perfil F1 (sin cambio)                                   |
+-----------------------------------------------------------------------+
|  Mis pedidos                                                          |
|  ┌─────────────────────────────────────────────────────────────────┐ |
|  │ #1042  [🕐 Pendiente]  [🛍 Pedido en línea]                     │ |
|  │ … [ Cancelar pedido ]  ← solo PENDING (F3)                       │ |
|  ├─────────────────────────────────────────────────────────────────┤ |
|  │ #1038  [📦 Listo para recoger]  pickup / IN_TRANSIT              │ |
|  │ EtaChip: Listo aprox. en ~20 min  (si sigue vigente)             │ |
|  ├─────────────────────────────────────────────────────────────────┤ |
|  │ #1045  [🚚 En camino]  DELIVERY / IN_TRANSIT                     │ |
|  │ Dirección: Casa · EtaChip                                        │ |
|  ├─────────────────────────────────────────────────────────────────┤ |
|  │ #1030  [✓ Entregado]                                             │ |
|  │ [ Calificar pedido ]  PRIMARY de la card  ← si !review           │ |
|  ├─────────────────────────────────────────────────────────────────┤ |
|  │ #1028  [✓ Entregado]  Tu reseña ★★★★☆  (solo lectura)           │ |
|  ├─────────────────────────────────────────────────────────────────┤ |
|  │ #1020  Mostrador / POS — sin CTA Calificar                       │ |
|  └─────────────────────────────────────────────────────────────────┘ |
+-----------------------------------------------------------------------+
```

#### Estados de la pantalla

| Estado | Comportamiento UI |
|--------|-------------------|
| **Loading** | Skeleton 3× OrderCard (F3) |
| **Empty** | F3 "Aún no tienes pedidos" |
| **Success** | Cards + CTA Calificar solo DELIVERED sin review y con `clientId` |
| **Error** | ErrorBanner F3 |
| **Post-reseña** | Card actualiza a estrellas read-only sin recargar toda la cuenta |

#### Copy IN_TRANSIT (CO-F4 / D-F4-5)

| `fulfillmentType` | Label badge | Icono |
|-------------------|-------------|-------|
| `PICKUP` o ausente | **Listo para recoger** | `PackageCheck` |
| `DELIVERY` | **En camino** | `Truck` |

Nunca color-only. Pickup F3 no cambia.

#### Componentes Requeridos para Frontend:
* **OrderStatusBadge** variante F4 (tokens §6c).
* **CalificarCTA:** primary outline en card Entregado.
* **EtaChip** compacto en CONFIRMED / IN_TRANSIT.

#### Responsividad:
* Cards full-width; CTA Calificar `w-full` móvil.

#### API esperada:
* `GET /api/orders` — incluye `fulfillmentType`, `review`, `etaMinutes?`

#### Referencias:
* Flujos: `UF-REV-01`, `UF-NOTIFY-01`, `UF-ORDERS-02`
* Formulario: `WF-resena-pedido.md`
