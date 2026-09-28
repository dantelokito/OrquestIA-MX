# User Story — US-DASH-03

> **ID:** US-DASH-03  
> **Título:** Top productos (incl. venta rápida)  
>
> **Como:** PROVIDER  
> **Quiero:** ver top 5 por unidades/ingreso  
> **Para:** saber qué se mueve  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1:** Tabla top 5; `providerProductId === null` muestra QuickSaleBadge + "Venta rápida".
> - [ ] **Escenario 2:** Sin VR → copy explicativo, no error.
> - [ ] **Regla de Negocio:** Incluir `bySource` App vs Mostrador (FEAT-DASH).
