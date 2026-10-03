> **Flujo:** Explorar muestra una card/pin por `Provider`
> **Historia de Usuario Asociada:** US-EXPLORE-11
>
> **Punto de entrada:** `/explorar` (chrome F9 intacto: mapa, FilterBar mayoreo/domicilio/radio, typeahead).

> **Pasos del Usuario:**
> 1. `[Lista + mapa]` → Una `ProviderCard` y un pin por sucursal. Seed: **Frutas El Paraíso** (Centro), **El Paraíso Tecnológico** (Garza Sada 2501), **Campo Verde Frutería**. **QG BUG-018:** si la URL trae `lat`/`lng` válidos, **ese centro gana**. Prohibido hidratar vacío y reescribir San Nicolás + 10 km. El chip default / primera favorita no pisa el pin. Clamp radio 0.5–10 km (F8) se mantiene.
> 2. `[Clic card/pin]` → `/fruteria/[id]` de **ese** id. Encargar solo a esa sucursal.
> 3. `[Filtros F9]` → Aplican por sucursal, no por dueño. Tecnológico puede quedar fuera del radio y Centro sí (o al revés).

**Condicionales:**
- **Empty filtros:** empty F9/F2 existente («No hay fruterías en este corte»). Sin chips de sección.
- **Loading:** BrandLoader / skeletons F7–F9.
- **Error red:** banner F9 existente + reintentar.
- **Dos nombres El Paraíso:** `businessName` distinto en cada card; no fusionar.

**Reglas UI:**
- No rediseñar Explorar F9. Delta = datos (N cards), no chrome.
- CLIENT/invitado: cards **nunca** pintan `--brand` de la frutería.
- SKU local de A no aparece como comparable en B.

**API esperada:** listing ya por `Provider` (Arch confirma).

**Wireframes:** `WF-EXPLORE-11-cards-provider.md`.

## Inputs Utilizados

- **US:** `US-EXPLORE-11`
- **Seed:** `fase-11/seed-demo.md` (workspace PM)

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-11/user-flows/UF-EXPLORE-11-tarjeta-provider.md`
- **Agente Downstream:** Frontend Developer
