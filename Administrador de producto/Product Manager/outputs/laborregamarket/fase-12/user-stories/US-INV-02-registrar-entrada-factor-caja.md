# User Story — US-INV-02

> **ID:** US-INV-02  
> **Título:** Registrar entrada en unidad de catálogo y factor caja en ficha  
>
> **Como:** PROVIDER  
> **Quiero:** cargar existencias en la unidad del SKU y, si compro caja y vendo kg/pieza, usar un factor de contenido fijo en la ficha  
> **Para:** que el almacén administrativo se relacione al formato de venta sin receta/BOM  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado un SKU de la sucursal activa con unidad de catálogo (KG, PIEZA, MANOJO, CAJA, LITRO o GRAMO), cuando registro una entrada en esa unidad, entonces el on-hand de A aumenta en esa cantidad. Si el SKU se vende en kg/pieza y entra en caja, uso el **factor caja de la ficha** (fijo en la oferta) para convertir cajas a unidad de venta; no pido un factor distinto por cada carga. Puedo guardar el factor en la ficha inventario / oferta de esa sucursal.
> - [ ] **Escenario 2 (Validación/Error):** Dado cantidad vacía, no numérica o menor o igual a cero, cuando intento guardar la entrada, entonces no se muta el saldo y veo un mensaje de validación (sin 500). Dado sucursal A activa, cuando intento cargar un SKU de B, entonces **403**.
> - [ ] **Regla de Negocio:** D-F12-3, D-F12-7. Factor **fijo en la oferta**, no por movimiento. Se puede registrar entrada aunque el saldo esté mal (D-F12-4). Sin BOM. KG/fracciones: Arquitecto usa Decimal (no Int de `stock` actual).

>
> **UX:** formulario de entrada + campo factor en ficha. **Arquitecto:** conversión caja→unidad; Decimal kg. **QA:** entrada 0/negativa rechazada; saldo mal no bloquea entrada válida.

## Inputs Utilizados

- **PRD:** `outputs/laborregamarket/fase-12/prd.md`
- **Impacto:** `outputs/laborregamarket/fase-12/impacto-modulos.md`
- **Backlog:** `BL-201`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-12/user-stories/US-INV-02-registrar-entrada-factor-caja.md`
- **Agente Downstream:** UX/UI, Arquitecto, Backend, Frontend, QA
- **Fase / Proyecto:** 12 / laborregamarket
