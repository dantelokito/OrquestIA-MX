> **Flujo:** Abrir Perfil y editar identidad visual (logo, portada, colores) de la sucursal activa
> **Historia de Usuario Asociada:** US-PROF-01
>
> **Punto de entrada:** `SubNavProveedor` → pestaña **Perfil** (`/proveedor/perfil`). CTA de bloque: **Guardar colores** / **Subir logo** / **Subir portada**.

> **Pasos del Usuario:**
> 1. `[Panel proveedor]` → El `SubNav` muestra, de izquierda a derecha: Inventario · Catálogo · POS · Órdenes · Ventas · Reportes generales (solo N>1) · **Perfil**. Perfil es el **extremo derecho** (uso esporádico). Ícono Lucide `Store` + label «Perfil». Targets ≥44px; overflow-x en móvil.
> 2. `[Pantalla Perfil]` → Un único `GET` de negocio (`getMyBusiness` o sucesor) hidrata logo, portada, colores, Google, datos, horarios y capacidades. Los bloques **no** disparan fetches duplicados del mismo recurso.
> 3. `[Bloque Identidad visual]` → Logo (`MediaUpload` variant logo), portada (`MediaUpload` variant cover) y `BrandColorPicker`. Contratos F10 intactos (`POST /api/provider/media`, `PATCH /api/provider/me` hex). Disco local; sin copy de nube.
> 4. `[Condicional — media válida]` → Sí: preview + URL persistida; la vitrina `/fruteria/[id]` de **esta** sucursal refleja el cambio. No: error visible en el bloque (tipo/tamaño F10); no se persiste URL nueva.
> 5. `[Condicional — GET me falla]` → Estado Error recuperable (`Reintentar`). **No** se inventa paleta. CLIENT / sin auth → 401/403 o redirect, no entra a Perfil.
> 6. `[Catálogo]` → Logo, portada y colores **ya no** aparecen en `/proveedor` (`UF-CAT-21`).

> **Reglas UI:**
> - Un CTA dominante **por bloque**, no uno para toda la página.
> - Empty: placeholders F10 «Aún no subes logo / portada»; colores en default de plataforma hasta guardar un hex válido (contraste primario ≥4.5:1 texto blanco).
> - Loading: skeletons de 5 bloques, `aria-busy="true"`.
> - Isolation F11: otra sucursal mía no cambia.
> - Wireframe: `WF-PROF-01-05-perfil.md`.

## Inputs Utilizados

- **PRD:** `Administrador de producto/Product Manager/outputs/laborregamarket/fase-14/prd.md`
- **US:** `US-PROF-01-pestana-perfil-identidad-visual.md`
- **QG UX:** `fase-14/quality/QG-cobertura-UX.md`
- **Handoff PM:** `fase-14/handoff-ux-ui-fase-14.md`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/user-flows/UF-PROF-01-pestana-identidad.md`
- **Agente Downstream:** Frontend Developer
- **Wireframe:** `fase-14/wireframes/WF-PROF-01-05-perfil.md`
