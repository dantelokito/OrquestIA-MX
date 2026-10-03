# User Story — US-PROF-01

> **ID:** US-PROF-01  
> **Título:** Pestaña Perfil: identidad visual (logo, portada, colores)  
>
> **Como:** PROVIDER (sucursal activa)  
> **Quiero:** una pestaña **Perfil** en `/proveedor/perfil` donde edite logo, portada y colores de **mi** frutería, sin mezclarlos con el catálogo de productos  
> **Para:** configurar la vitrina una vez y dejar Catálogo para el trabajo diario de precios y SKU  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado un PROVIDER con sucursal activa, cuando abro el panel, entonces el `SubNav` muestra **Perfil** (ruta `/proveedor/perfil`, al extremo derecho después de Ventas salvo que UX justifique otro orden documentado). En esa pantalla aparecen **logo**, **portada** y **colores de marca** con los mismos contratos actuales (`POST /api/provider/media` → `logoUrl`/`coverUrl`; `PATCH /api/provider/me` hex de marca). Un guardado exitoso se refleja en la vitrina `/fruteria/[id]` de **esa** sucursal. Al cargar Perfil, `getMyBusiness` (o sucesor) se resuelve **una vez** y lo reutilizan logo/portada/colores (no cuatro round-trips independientes del mismo recurso; D-F14-19 / `BL-269`).
> - [ ] **Escenario 2 (Validación/Error):** Dado un archivo que el validador de media F10 rechaza (tipo no permitido o tamaño sobre el límite de cliente), cuando subo logo o portada, entonces el error es **visible** en Perfil, no se persiste URL nueva y Catálogo no muestra un estado a medias. Sin sucursal activa / sin auth PROVIDER → **401/403**. Un CLIENT no entra a `/proveedor/perfil` (redirect o 403). Fallo de `GET /api/provider/me`: estado Error recuperable, **sin** paleta inventada.
> - [ ] **Regla de Negocio:** D-F14-1, D-F14-19, D-F14-22. Disco local F10 (`CO-F10-002`); **no** Cloudinary/S3. Colores = sucursal activa (F11); otra sucursal mía no cambia. Envelope ADR-003. Cuatro estados UI: Empty (sin logo/portada aún), Loading, Error, Success. Identidad **no** permanece como bloque de `/proveedor` catálogo (`US-CAT-21`).

>
> **UX:** pestaña Perfil; un CTA dominante por bloque (guardar colores / subir media); targets ≥44px. **Arquitecto:** sin contrato nuevo de media; opcional contexto compartido del GET me. **QA:** aislamiento F11; no-regresión de upload F10; Catálogo ya no muestra logo/portada/colores.

## Inputs Utilizados

- **PRD:** `outputs/laborregamarket/fase-14/prd.md`
- **Diagnóstico:** `comun/MEJORA-PANEL-PROVEEDOR.md` §2.3, D-25
- **UI hoy:** `ProveedorPageClient.tsx` (MediaUpload + BrandColorPicker en Catálogo)

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/user-stories/US-PROF-01-pestana-perfil-identidad-visual.md`
- **Agente Downstream:** UX, Arquitecto, Backend, Frontend, QA
