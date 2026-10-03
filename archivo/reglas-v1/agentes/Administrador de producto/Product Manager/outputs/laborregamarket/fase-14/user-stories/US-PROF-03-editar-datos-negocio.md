# User Story — US-PROF-03

> **ID:** US-PROF-03  
> **Título:** Editar datos del negocio (nombre, dirección, teléfono, coords, descripción)  
>
> **Como:** PROVIDER (sucursal activa)  
> **Quiero:** corregir nombre comercial, dirección, ciudad, teléfono, descripción y coordenadas **después** del onboarding  
> **Para:** que Explorar, el pin y el ETA no queden con un dato permanente incorrecto  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado un negocio ya creado, cuando en Perfil envío `businessName`, `address`, `city`, `phone`, `description`, `latitude` y `longitude` válidos (lat/lng con las reglas geo **existentes** de Monterrey/AMM: `monterreyLatSchema` / `monterreyLngSchema` o sucesor), entonces el PATCH de settings del proveedor **persiste** esos campos (hoy el schema `.strict()` los rechaza). El GET `me` los devuelve. Explorar, Haversine y ETA usan el valor **nuevo**. `isVerified` **no** cambia (ni a false ni se pide documento). Solo se muta la **sucursal activa**.
> - [ ] **Escenario 2 (Validación/Error):** Dado lat/lng fuera del área permitida, o teléfono/nombre que fallen el validador que Arquitecto documente (reusar reglas de `createProviderSchema` donde existan), cuando guardo, entonces **400**, body con `error.code`/`message` ADR-003, y **ningún** campo de ese request se aplica a medias (transacción o rechazo total). IDOR: PATCH con `providerId` de otra sucursal (mía o ajena) → **403/404**, sin mutación. Sin auth PROVIDER → **401/403**. CLIENT → 403. Campos omitidos en un PATCH parcial no se resetean a null salvo que el contrato lo declare explícito.
> - [ ] **Regla de Negocio:** D-F14-4, D-F14-5, D-F14-22, D-F14-23. **No** resetear `isVerified`. **No** flujo de re-verificación ni carga de documentos. Riesgo para Arquitecto: un negocio verificado puede mudar el pin y conservar el sello; documentar en ADR, no bloquear F14. Admin PATCH de los mismos campos = **Should** (D-F14-18), no este Must. Envelope ADR-003.

>
> **UX:** formulario de datos del negocio en Perfil; errores inline por campo (coords inválidas accionables); 4 estados. **Arquitecto:** ampliar `patchProviderSettingsSchema`; geo existente; no mutar `isVerified`. **QA:** 400 fuera de AMM; IDOR F11; `isVerified` permanece; Explorar muestra dirección nueva.

## Inputs Utilizados

- **PRD:** `outputs/laborregamarket/fase-14/prd.md`
- **Diagnóstico:** `comun/MEJORA-PANEL-PROVEEDOR.md` §2.4, D-10, decisión abierta #4
- **Contrato hoy:** `patchProviderSettingsSchema` no lista estos campos; GET sí los serializa

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/user-stories/US-PROF-03-editar-datos-negocio.md`
- **Agente Downstream:** UX, Arquitecto, Backend, Frontend, QA
