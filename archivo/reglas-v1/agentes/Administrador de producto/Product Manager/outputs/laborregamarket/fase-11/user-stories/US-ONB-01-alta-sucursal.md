# User Story — US-ONB-01

> **ID:** US-ONB-01  
> **Título:** Alta de sucursal N+1 reusando `/registro/negocio`  
>
> **Como:** PROVIDER ya autenticado con al menos una frutería  
> **Quiero:** registrar otra sucursal en el mismo formulario de `/registro/negocio`  
> **Para:** no depender de un wizard nuevo ni de un segundo usuario  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso N+1):** Dado sesión PROVIDER con ≥1 `Provider`, cuando completo `/registro/negocio` con datos válidos de un negocio nuevo, entonces se crea un `Provider` adicional ligado al mismo `User`, N incrementa, y si N pasa de 1 a 2 aparecen switcher (`US-HEADER-01`) y módulo `US-DASH-11`.
> - [ ] **Escenario 2 (Validación / primer alta):** Dado visitante sin sesión o primer negocio, cuando uso la misma ruta, entonces el flujo de alta **actual** (F1/F5) se mantiene. Si el form es inválido (campos requeridos vacíos), no se crea `Provider` y hay error inline. Copy con sesión PROVIDER: “Nueva frutería” (o equivalente), **no** “Crea tu cuenta”.
> - [ ] **Regla de Negocio:** D-F11-3. Reusar `BusinessOnboardingClient` + `createProvider`. Sin wizard paralelo. Tras el alta, `activeProviderId` puede quedar en la sucursal nueva (documentar en Arch).

>
> **UX:** delta de copy y CTA “Agregar frutería” hacia la ruta existente. **Arquitecto:** unique `userId` removido. **QA:** primer alta vs N+1.

## Inputs Utilizados

- **PRD:** `outputs/laborregamarket/fase-11/prd.md`
- **Backlog:** `BL-194`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-11/user-stories/US-ONB-01-alta-sucursal.md`
- **Agente Downstream:** UX/UI, Arquitecto, Backend, Frontend
- **Fase / Proyecto:** 11 / laborregamarket
