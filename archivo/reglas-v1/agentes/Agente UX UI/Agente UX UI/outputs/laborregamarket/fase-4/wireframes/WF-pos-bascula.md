> **Pantalla:** POS mostrador — báscula digital (`/proveedor/pos`)
> **Objetivo Principal:** Conectar báscula y autollenar peso KG/GR sin romper cobro F3
> **Base:** Extiende [`../../fase-3/wireframes/WF-pos-mostrador.md`](../../fase-3/wireframes/WF-pos-mostrador.md) y `WF-pos-cantidad-unidad.md`

```text
+-----------------------------------------------------------------------+
| [Header PROVIDER]  [ Catálogo | POS | Órdenes | Dashboard ]           |
+-----------------------------------------------------------------------+
|  CATALOGO (58%)              |  TICKET (42%)                          |
|  grid F3                     |  Ticket #—                             |
|                              |  ┌──────────────────────────────────┐ |
|                              |  │ ScaleStatusBadge                 │ |
|                              |  │ [●] Conectada · Modelo X         │ |
|                              |  │ o [○] Desconectada               │ |
|                              |  │ [ Conectar báscula ] secondary   │ |
|                              |  └──────────────────────────────────┘ |
|                              |  líneas TicketLine F3                 |
|                              |  Total · Pago · [ Cobrar ] PRIMARY    |
+-----------------------------------------------------------------------+
```

### Panel cantidad (KG/GR) con báscula conectada

```text
|  Cantidad                                                             |
|  [ 1.250 ] kg     ← autollenado desde lectura; editable               |
|  Hint: "Peso de la báscula. Puedes corregirlo."                       |
|  NumericKeypad F3 intacto                                             |
```

### Modelo desconocido

```text
|  ┌─ Modal ─────────────────────────────────────────────────────────┐ |
|  │  No reconocimos este dispositivo                                  │ |
|  │  Elige el modelo de báscula:                                      │ |
|  │  ( ) Modelo piloto A   ( ) Modelo piloto B                        │ |
|  │  [ Usar este modelo ] PRIMARY                                     │ |
|  │  Recordaremos la elección en este dispositivo.                    │ |
|  └───────────────────────────────────────────────────────────────────┘ |
```

### Navegador sin WebSerial/WebHID

```text
|  ℹ Este navegador no conecta básculas. Captura el peso a mano.        |
|  [ Conectar báscula ] disabled                                        |
|  Keypad F3 disponible                                                 |
```

#### Estados de la pantalla

| Estado | Comportamiento UI |
|--------|-------------------|
| **Desconectada** | Badge + CTA Conectar; peso manual F3 |
| **Conectando** | Spinner en CTA; badge "Conectando…" |
| **Conectada** | Badge success texto+icono; lecturas fluyen a línea KG/GR |
| **Desconexión mid-sale** | Badge desconectada + toast; ticket intacto |
| **Sin soporte** | Banner info; CTA disabled; F3 ok |
| **Modelo desconocido** | Modal selector; persist `localStorage` |
| **Unidad no peso** | Lectura ignorada; hint kg/g |
| **Error lectura** | Inline + reabrir selector o manual |

#### Componentes Requeridos para Frontend:
* **ScaleStatusBadge:** Conectada / Desconectada / Conectando — texto + icono (`Unplug`/`Cpu`).
* **ConnectScaleButton:** secondary; no compite con Cobrar.
* **ScaleModelSelect:** radio list modelos piloto.
* Reutilizar QuantityInput, NumericKeypad, UnitSelector (F3).

#### Responsividad:
* Badge + CTA en cabecera del ticket (desktop) / encima de total sticky (móvil).
* Modal modelo: full-width móvil.

#### API esperada:
* Ninguna de periférico. `POST /api/pos/sales` sin cambio.

#### Referencias:
* Flujo: `../user-flows/UF-POS-02-bascula.md`
* F3: `UF-POS-01-mostrador.md`
