> **Flujo:** Editar nombre, dirección, teléfono, descripción y coordenadas después del onboarding
> **Historia de Usuario Asociada:** US-PROF-03
>
> **Punto de entrada:** `/proveedor/perfil` → bloque **Datos del negocio**. CTA: **Guardar datos del negocio**.

> **Pasos del Usuario:**
> 1. `[Perfil — datos]` → Formulario con `businessName`, `address`, `city`, `phone`, `description`, `latitude`, `longitude` precargados del GET me compartido.
> 2. `[Ayuda]` → «Explorar, el pin y el ETA usan esta ubicación. El sello de verificado **no** se quita al mover el pin. No pedimos documentos».
> 3. `[Guardar válidos (geo AMM)]` → PATCH de settings del proveedor persiste **todos** los campos enviados. GET me refleja. Isolation: solo sucursal activa.
> 4. `[Condicional — lat/lng fuera de AMM u otros 400]` → Error **inline** por campo (coords: «Usa una ubicación dentro de Monterrey / AMM»). Banner de formulario con `error.message` ADR-003. **Ningún** campo de ese request se aplica a medias. El toast **no** es el único canal.
> 5. `[Condicional — IDOR / sin auth]` → 403/401; UI no finge éxito. CLIENT no edita.
> 6. `[PATCH parcial]` → Campos omitidos no se resetean a nulo (contrato Arch). La UI envía el bloque completo al guardar este formulario.

> **Reglas UI:**
> - No hay flujo de re-verificación ni upload de documentos.
> - Inputs ≥44px; labels visibles; `aria-invalid` + `aria-describedby` en error.
> - 4 estados: Empty (descripción vacía permitida), Loading, Error validación/API, Success (toast «Datos guardados» + valores persistidos).
> - Wireframe: `WF-PROF-01-05-perfil.md`.

## Inputs Utilizados

- **US:** `US-PROF-03-editar-datos-negocio.md`
- **PRD:** D-F14-4, D-F14-5, D-F14-23
- **Nota Arch:** ampliar `patchProviderSettingsSchema`; UX no inventa path

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/user-flows/UF-PROF-03-datos-negocio.md`
- **Agente Downstream:** Frontend Developer (tras contrato Arch)
