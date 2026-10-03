# ARCH-SCALE-01 — Báscula digital (solo cliente)

> **Componente / Flujo:** WebSerial/WebHID → registry VID/PID → `quantity` del ticket POS  
> **Fecha:** 14/08/2026  
> **Fase:** 4 — v0.4.0  
> **Sin API nueva** — [`../../fase-3/api/API-POS-01.md`](../../fase-3/api/API-POS-01.md) intacto

---

## Flujo de conexión

```mermaid
flowchart TD
  Connect[Conectar_bascula] --> Support{WebSerial_o_WebHID}
  Support -->|No| Manual[Entrada_manual_F3]
  Support -->|Si| Grant[Permiso_puerto]
  Grant --> VID[Leer_usbVendorId_usbProductId]
  VID --> Reg{Match_registry}
  Reg -->|Si| Driver[Parser_del_modelo]
  Reg -->|No| Pick[Selector_manual_localStorage]
  Pick --> Driver
  Driver --> Qty[Autollenar_quantity_KG_o_GR]
  Qty --> Edit[Editable_por_proveedor]
  Edit --> POST[POST_provider_pos_sales]
```

---

## Límites

| Hecho | Destino |
|-------|---------|
| Peso leído | Estado UI → `quantity` |
| VID/PID / stream | **Nunca** al servidor |
| Preferencia modelo | `localStorage` (`lbm.scale.driverId`) |
| Contrato venta | ADR-014 / API-POS-01 sin campos extra |

Desconexión: badge + reconectar o manual. Parse fallido: no pisar `quantity`.

---

## Referencias

- [`../../comun/adrs/ADR-019-scale-drivers.md`](../../comun/adrs/ADR-019-scale-drivers.md)
- US-POS-05, US-POS-06
