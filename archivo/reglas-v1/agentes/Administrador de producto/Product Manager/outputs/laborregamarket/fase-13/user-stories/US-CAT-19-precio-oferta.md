# User Story — US-CAT-19

> **ID:** US-CAT-19  
> **Título:** Proveedor edita el precio de su oferta (GLOBAL o LOCAL)  
>
> **Como:** PROVIDER (sucursal activa)  
> **Quiero:** cambiar el precio de venta de un producto del catálogo global del admin o de uno LOCAL mío, solo para **esta** frutería  
> **Para:** vender al precio de mi negocio sin alterar el maestro ni a otras sucursales  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado un SKU GLOBAL de plataforma en mi dashboard (con o sin oferta previa) o un LOCAL propio, cuando asigno o edito el precio (≥ 0, máximo 2 decimales), entonces se guarda en `ProviderProduct.price` de la sucursal activa (se crea la oferta si no existía, mismo patrón de activación F10). El `Product` GLOBAL **no** cambia de precio de plataforma. La sucursal B (mismo user, N>1) **conserva** su precio. Encargar y POS posteriores usan el precio nuevo. Pedidos **ya hechos** no cambian (`US-DASH-10`).
> - [ ] **Escenario 2 (Validación/Error):** Dado precio vacío, negativo o más de 2 decimales, cuando guardo, entonces **400** y no hay mutación. Sin auth / otra sucursal → **401/403**. Un CLIENT no edita. Editar el precio del maestro vía API admin **no** pisa las ofertas de los proveedores.
> - [ ] **Regla de Negocio:** D-F13-17. **No** se crea un SKU LOCAL nuevo por cambiar precio. Envelope ADR-003. Cada cambio deja rastro (`US-CAT-20`).

>
> **UX:** `PriceInput` usable en filas GLOBAL y LOCAL (no deshabilitado en globales). **Arquitecto:** upsert oferta; no mutar `Product` GLOBAL por precio de frutería. **QA:** A vs B independientes; GMV histórico intacto.

## Inputs Utilizados

- **PRD:** `outputs/laborregamarket/fase-13/prd.md`
- **Código hoy:** `PriceInput.tsx`, `upsertProviderProduct` (ya hay precio por oferta; Must es dejarlo explícito y correcto en GLOBAL)

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-13/user-stories/US-CAT-19-precio-oferta.md`
- **Agente Downstream:** UX, Arquitecto, Backend, Frontend, QA
