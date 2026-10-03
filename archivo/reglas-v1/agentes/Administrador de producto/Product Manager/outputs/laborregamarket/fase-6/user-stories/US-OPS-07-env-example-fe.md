# User Story — US-OPS-07

> **ID:** US-OPS-07  
> **Título:** Sincronizar `.env.example` público de Frontend  
>
> **Como:** desarrollador que lee solo el repo de Frontend  
> **Quiero:** las variables **públicas** de Explorar al día (OSM opcional; sin Maps Must)  
> **Para:** no reintroducir `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` como requisito ni omitir teselas  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1:** Dado `comun/.env.example` de Frontend, cuando se alinea a F6, entonces `NEXT_PUBLIC_OSM_TILE_URL` es opcional (default OSM) y Maps JS key **no** es Must de Explorar.
> - [ ] **Regla de Negocio:** Could F6 (**DEV-P2-009**). No publicar Upstash, JWT, Resend ni Inngest como `NEXT_PUBLIC_*`.

>
> **Frontend (doc).** El `.env.example` de la app `LaBorregaMarket` ya está al día; este US es el drift del repo FE.
