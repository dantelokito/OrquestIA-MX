# ADR-019 — Drivers de báscula digital (WebSerial / WebHID)

> **Estado:** Aceptado  
> **Fecha:** 2026-08-14  
> **Decisores:** Arquitecto de Software  
> **Fase:** 4 — v0.4.0

---

#### 1. Contexto y Problema:

US-POS-05/06: el POS debe leer peso de una báscula USB/serial, autodetectar modelo por `usbVendorId`/`usbProductId` y autollenar `quantity` de la línea activa (`KG`/`GR`). El contrato POS F3 (`quantity` Decimal(10,3) + `unitOfMeasure`, ADR-014 / CO-001) **no debe cambiar**. El catálogo de hardware es el piloto disponible; hay que poder agregar drivers sin tocar el resto del POS.

---

#### 2. Opciones Consideradas:

* **Opción A — 100% cliente (WebSerial/WebHID + registry de parsers):** Pros: cero backend, el peso no se persiste como periférico, fallback manual intacto. Contras: Chrome/Edge desktop; Safari/Firefox limitados.
* **Opción B — Agente local (exe) + WebSocket al POS:** Pros: más protocolos. Contras: instalación, firma, soporte Windows; fuera de MVP web.
* **Opción C — Backend proxy del puerto:** Imposible en serverless; inseguro.

---

#### 3. Decisión Elegida:

**Opción A.** Módulo Frontend `src/lib/pos/scale/` (o equivalente). **Ningún endpoint nuevo.**

### Registry

```ts
type ScaleDriver = {
  id: string
  label: string
  usbVendorId: number
  usbProductId: number
  transport: "webserial" | "webhid"
  parse: (chunk: Uint8Array) => { grams: number } | null
}
```

Autodetección: al autorizar el puerto, leer `usbVendorId`/`usbProductId` y resolver driver. Si no hay match: selector manual de `label` y persistir elección en `localStorage` (`lbm.scale.driverId`). Reconexión usa esa preferencia salvo que el parse falle N veces → re-prompt.

### Integración POS

1. Lectura → convertir a la `unitOfMeasure` de la línea (`GR` = gramos; `KG` = grams/1000).
2. Escribir `quantity` en el estado del ticket (editable después).
3. `POST /api/provider/pos/sales` **sin campos extra** de báscula.

### Fallback

| Caso | UX |
|------|----|
| Sin WebSerial/WebHID | Mensaje + entrada manual F3 |
| Desconexión | Badge "báscula desconectada"; reconectar o manual |
| Parse fallido | No pisar `quantity`; toast |

Catálogo inicial: **un stub `generic-stable`** más los VID/PID del hardware piloto que Backend/Frontend documenten en `registry.ts` cuando exista el dispositivo. Arquitectura lista para un archivo por modelo (`drivers/acme-xyz.ts`) registrado en `registry.ts`.

### Qué NO hacer

- Enviar VID/PID o streams al servidor.
- Cambiar ADR-014 / API-POS-01.
- Impresora térmica / lector de barras (Won't F4).

---

#### 4. Consecuencias e Impacto:

* **Positivas:** POS F3 sigue válido; drivers son plugins; QA puede mockear `parse`.
* **Riesgos / Compensaciones:** Solo Chromium desktop; hardware no registrado exige selector. HTTPS (o localhost) requerido por WebSerial.

## Referencias

- US-POS-05, US-POS-06
- POS F3: [`../../fase-3/api/API-POS-01.md`](../../fase-3/api/API-POS-01.md)
- Diagrama: [`../../fase-4/diagrams/ARCH-SCALE-01.md`](../../fase-4/diagrams/ARCH-SCALE-01.md)
