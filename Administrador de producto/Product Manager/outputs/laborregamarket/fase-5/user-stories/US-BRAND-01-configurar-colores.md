# User Story — US-BRAND-01

> **ID:** US-BRAND-01  
> **Título:** Proveedor configura colores primario y secundario  
>
> **Como:** PROVIDER  
> **Quiero:** elegir y guardar un color primario y uno secundario de mi negocio  
> **Para:** usar mis colores representativos en el sistema  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado que abro la configuración de mi negocio, cuando elijo primario y secundario (hex válido) y guardo, entonces persisten en mi `Provider` y un preview muestra botones/acentos con esos colores.
> - [ ] **Escenario 2 (Contraste insuficiente):** Dado un primario que no alcanza contraste WCAG AA para texto blanco sobre ese color (CTA), cuando intento guardar, entonces se rechaza con mensaje claro y **no** se persiste; se sugiere ajustar o usar el fallback de plataforma.
> - [ ] **Escenario 3 (Reset):** Dado que ya tenía colores propios, cuando elijo restaurar marca de plataforma, entonces los campos quedan vacíos/nulos y la UI vuelve a `--brand` / `--brand-dark` globales.
> - [ ] **Regla de Negocio:** D-F5-6. Solo el dueño de ese `Provider` (o ADMIN) puede escribir estos campos. Preview de contraste es Should en UI; el rechazo de contraste insuficiente es Must en servidor o en validación equivalente documentada por Arquitecto. Paleta derivada del logo es Could.

>
> **UX:** `UF-BRAND-01` picker en config de negocio (junto a logo/portada F2). **QA:** persistencia, rechazo de hex inválido, rechazo de contraste.
