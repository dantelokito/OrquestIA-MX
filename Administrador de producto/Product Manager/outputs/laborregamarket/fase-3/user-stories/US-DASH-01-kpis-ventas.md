# User Story — US-DASH-01

> **ID:** US-DASH-01  
> **Título:** KPIs de ventas del día  
>
> **Como:** PROVIDER  
> **Quiero:** ver ventas hoy, ticket promedio, órdenes activas y comparativa ayer  
> **Para:** saber cómo va el día  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1:** `GET /api/provider/dashboard` llena 4 KpiCard; TZ Monterrey.
> - [ ] **Escenario 2:** Sin ventas → KPIs 0/`—` y empty amigable + CTA al POS.
> - [ ] **Regla de Negocio:** Delta con texto ("+12% vs ayer"), no solo color. Informativo, sin CTA primary competidor.
>
> **Contrato:** API-PROVIDER-DASH-01. **ADR-012.**
