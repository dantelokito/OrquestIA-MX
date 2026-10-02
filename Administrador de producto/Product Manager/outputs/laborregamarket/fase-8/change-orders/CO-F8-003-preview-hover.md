# Change Order — Registro de Solicitud de Cambio

> **ID:** CO-F8-003
> **Fecha:** 24/08/2026
> **Proyecto:** LaBorregaMarket
> **Solicitante:** Dante (stakeholder)

#### 1. Descripción del Cambio

**Descartar el botón «Vista rápida»** en la card de `/explorar` y abrir el submódulo de preview por **hover** (puntero) o **long-press** (móvil/tablet), **anclado a la card**.

Dante confirma (24/08/2026):

- Clic / tap **corto** en la card **sigue** yendo a `/fruteria/[id]`.
- Hover o long-press abre un preview **ligero pegado a la card** (no un CTA de texto).
- El contenido es el de `US-EXPLORE-05` (no recortar datos).
- El botón actual (`ProviderCard`, «Vista rápida») **desaparece**.
- Tap en marker del mapa abre **el mismo** preview (paridad F7; no reintroducir el botón).

El submódulo de preview **sigue Must**. Solo cambia disparador y chrome.

#### 2. Evaluación de Impacto

- [ ] Arquitectura
- [x] Diseño UI/UX
- [ ] Base de datos

**Detalle del impacto:**

- **Arquitectura:** sin endpoint nuevo. Mismo `GET` de detalle que `ProviderPreviewSheet`. Debounce/cache al hover para no spamear. Sin Places.
- **Diseño UI/UX:** popover/preview anclado; delay hover; long-press ≠ scroll; tap corto no navega si acaba de haber long-press; teclado Must sin el botón visible.
- **Base de datos:** sin delta.
- **QA:** botón ausente; hover abre preview; tap corto → detalle; long-press no dispara al scrollear.

#### 3. Matriz de Intercambio (Trade-off)

* **Opción A:** Quitar el botón y abrir el sheet modal de F7 con hover (agresivo; tapa la lista).
* **Opción B:** Preview anclado a la card con el mismo contenido; tap corto = detalle.

#### 4. Decisión

**Opción seleccionada:** B
**Aprobado por:** Dante
**Fecha de aprobación:** 24/08/2026

**Efecto en decisiones previas:** `US-EXPLORE-05` (contenido) **sigue**. El CTA texto / sheet-as-botón de F7 queda **revocado** como disparador. `ContactCTA` y heart de la card **se quedan**.
