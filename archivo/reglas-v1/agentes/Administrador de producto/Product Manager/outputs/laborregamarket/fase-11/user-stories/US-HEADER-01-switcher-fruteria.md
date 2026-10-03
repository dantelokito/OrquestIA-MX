# User Story — US-HEADER-01

> **ID:** US-HEADER-01  
> **Título:** Rotar de frutería en el banner solo si N>1  
>
> **Como:** PROVIDER con más de una frutería registrada  
> **Quiero:** cambiar la sucursal activa desde el header/banner  
> **Para:** operar catálogo, POS, pedidos y reportes F10 de esa sucursal sin otro login  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso N>1):** Dado `frutas@elparaiso.mx` con N=2 (`Frutas El Paraíso` y `El Paraíso Tecnológico`), cuando abro el panel, entonces el banner muestra un control para **rotar/cambiar** entre esas fruterías; al elegir otra, `activeProviderId` cambia, se rehidratan nombre, tokens de marca F5 y el panel F10 (catálogo, secciones, media, POS, pedidos, reportes por sucursal) de la nueva activa.
> - [ ] **Escenario 2 (N=1 / sin switcher):** Dado `verduras@campoverde.mx` con N=1, cuando abro el panel, entonces el banner **queda como hoy** (F10): **no** hay switcher, **no** hay CTA de rotar fruterías, y el chrome no cambia.
> - [ ] **Regla de Negocio:** D-F11-2. El switcher es función de N (conteo de `Provider` del user), no un permiso ADMIN. N≤1 = oculto. Persistir última sucursal usada entre recargas (misma sesión / dispositivo).

>
> **UX:** WF header PROVIDER; ≥44px; teclado. **Arquitecto:** cambio de contexto + persistencia. **QA:** El Paraíso ve switcher; Campo Verde no.

## Inputs Utilizados

- **PRD:** `outputs/laborregamarket/fase-11/prd.md`
- **User Stories:** `US-AUTH-11`
- **Backlog:** `BL-191`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-11/user-stories/US-HEADER-01-switcher-fruteria.md`
- **Agente Downstream:** UX/UI, Frontend, Arquitecto
- **Fase / Proyecto:** 11 / laborregamarket
