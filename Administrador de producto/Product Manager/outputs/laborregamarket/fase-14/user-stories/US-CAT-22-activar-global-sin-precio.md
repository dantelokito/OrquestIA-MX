# User Story — US-CAT-22

> **ID:** US-CAT-22  
> **Título:** Activar GLOBAL sin precio no publica $50; exige precio válido > 0  
>
> **Como:** PROVIDER (sucursal activa)  
> **Quiero:** que al activar un producto GLOBAL que aún no tiene precio de oferta, el sistema **exija** un precio válido y **no** publique $50 por defecto  
> **Para:** no mostrar al cliente un precio inventado  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado un GLOBAL de plataforma **sin** `ProviderProduct.price` (o sin oferta), cuando lo pongo a la venta (toggle Activo / crear oferta vendible), entonces debo capturar un precio **> 0** (mismas reglas de `PriceInput`: rechaza ≤ 0) y ese valor se persiste como precio de **mi** oferta. El cliente ve **ese** precio, no 50. Si ya había precio de oferta > 0, activar reutiliza ese precio (no lo pisa a 50).
> - [ ] **Escenario 2 (Validación/Error):** Dado un GLOBAL sin precio, cuando intento activar **sin** capturar precio o con 0/negativo/NaN, entonces **no** se publica la oferta vendible: error visible en la fila (inline o diálogo), `price: item.price ?? 50` **no existe** en el cliente, y `/fruteria` / Explorar **no** listan el SKU a $50. API que reciba precio 0 o ausente al crear oferta vendible → **400** alineado a UI. IDOR: no puedo activar el GLOBAL en la sucursal B desde la A.
> - [ ] **Regla de Negocio:** D-F14-15. Cierra D-24. Precio de venta = `ProviderProduct.price` (F13). **No** mutar precio de otras sucursales ni del maestro. Stub de archivado con `price: 0` **no** se usa como precio público. Envelope ADR-003.

>
> **UX:** si falta precio, forzar captura (input o drawer) antes de Activo=ON. **Arquitecto:** validar precio > 0 al upsert de oferta vendible. **QA:** no $50 en vitrina; LOCAL con precio intacto; F13 historial si aplica primera asignación.

## Inputs Utilizados

- **PRD:** `outputs/laborregamarket/fase-14/prd.md`
- **Diagnóstico:** `comun/MEJORA-PANEL-PROVEEDOR.md` D-24
- **Código hoy:** `ProviderCatalogF10.tsx` `price: item.price ?? 50`
- **US previa:** `US-CAT-19`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/user-stories/US-CAT-22-activar-global-sin-precio.md`
- **Agente Downstream:** UX, Arquitecto, Backend, Frontend, QA
