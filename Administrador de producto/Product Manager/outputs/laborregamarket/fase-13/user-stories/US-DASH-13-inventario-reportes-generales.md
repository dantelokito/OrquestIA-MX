# User Story — US-DASH-13

> **ID:** US-DASH-13  
> **Título:** Reportes generales N>1 muestran solo inventarios actuales  
>
> **Como:** PROVIDER con **más de una** frutería  
> **Quiero:** ver en el módulo de reportes generales los **saldos de inventario actuales** de todas mis sucursales  
> **Para:** comparar existencias ahora, sin el historial de entradas de cada negocio  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso N>1):** Dado El Paraíso (N>1), cuando abro reportes generales (`US-DASH-11`), entonces además de ventas consolidadas existe una vista/bloque de **inventario actual** por sucursal (mínimo: `businessName`, SKU, on-hand). **No** se lista el historial de entradas en esta pestaña (eso vive en Reportes de cada sucursal, `US-DASH-12`).
> - [ ] **Escenario 2 (Oculto N=1 / Error):** Dado N=1, cuando uso el panel, entonces **no** veo el módulo generales (regla `US-DASH-11`). Endpoint consolidado de inventario con N=1 o user ajeno → **403**. Periodo/rango de ventas F10 **no** filtra el saldo actual (el actual es «ahora», no un corte histórico).
> - [ ] **Regla de Negocio:** D-F13-20. Print del bloque inventario en generales = Should (igual que print consolidado F11). Envelope ADR-003.

>
> **UX:** mismo módulo N>1; no copiar analytics admin. **Arquitecto:** contrato consolidado de on-hand. **QA:** N>1 ve actuales; N=1 no ve el módulo; sin entradas en esa vista.

## Inputs Utilizados

- **PRD:** `outputs/laborregamarket/fase-13/prd.md`
- **US:** `US-DASH-11`, `US-DASH-12`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-13/user-stories/US-DASH-13-inventario-reportes-generales.md`
- **Agente Downstream:** UX, Arquitecto, Backend, Frontend, QA
