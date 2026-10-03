# ADR-021 — Colores de marca por proveedor (sesión PROVIDER)

> **Estado:** Aceptado  
> **Fecha:** 2026-08-14  
> **Decisores:** Arquitecto de Software  
> **Fase:** 5 — v0.5.0

---

#### 1. Contexto y Problema:

US-BRAND-01/02 piden que el proveedor configure **primario y secundario** y los vea en **toda su sesión** (panel, POS, órdenes, dashboard y `/explorar` si entra logueado). CLIENT, ADMIN e invitados deben seguir viendo la marca de **plataforma**. El rechazo de contraste insuficiente es Must en servidor (no fiarse solo del picker). Paleta derivada del logo es Could (fuera de F5).

---

#### 2. Opciones Consideradas:

* **Opción A — Dos campos hex nullable en `Provider` + validación WCAG en PATCH + hidratación via sesión:** Pros: un par persistido; fallback trivial (`null` = tokens globales); el layout público no necesita 403. Contras: hay que calcular contraste en el servidor.
* **Opción B — Tema por CSS en el cliente sin persistir (localStorage):** Pros: cero migración. Contras: no sobrevive de dispositivo; no hay rechazo server-side; otro browser pierde la marca.
* **Opción C — Pintar cada card de `/explorar` con los colores de esa frutería:** Pros: vitrina de marca en el marketplace. Contras: D-F5-6 lo prohíbe (chrome CLIENT no es un mosaico de marcas).

---

#### 3. Decisión Elegida:

**Opción A.**

### Persistencia

| Campo Prisma | Columna | Tipo | Semántica |
|--------------|---------|------|-----------|
| `primaryColor` | `primary_color` | `String?` | Hex `#RRGGBB`. CTA / `--brand` de sesión |
| `secondaryColor` | `secondary_color` | `String?` | Hex `#RRGGBB`. Acentos / `--brand-dark` de sesión |

`null` en ambos = tokens de plataforma (`--brand` / `--brand-dark` globales). **Par:** ambos `null` (reset) o ambos válidos. Un solo color → **400**.

Canonicalizar a `#` + 6 hex uppercase al persistir. No aceptar shorthand `#RGB`.

### Contraste (Must servidor)

Usar luminancia relativa WCAG 2.1 contra **blanco** `#FFFFFF`:

| Campo | Umbral | Motivo |
|-------|--------|--------|
| `primaryColor` | ratio ≥ **4.5:1** | Texto claro sobre CTA (AA normal) |
| `secondaryColor` | ratio ≥ **3:1** | Acentos / texto grande |

Si falla → **400** envelope ADR-003, `details[].field` = el color, **no persistir**. Preview en UI es Should; el servidor es la fuente de verdad.

**Lectura:** si los valores guardados fallan contraste (dato legado o corrupción), serializar `brand: null` (fallback US-BRAND-02 escenario 3). No auto-reparar en GET.

### Autorización

- Escribe el **dueño** (`PATCH /api/provider/me`) o **ADMIN** (`PATCH /api/admin/providers/[id]`) con la misma validación.
- No aceptar `isVerified`, `isActive`, `rating`, `reviewCount`, `userId` en el PATCH de colores.

### Aplicación del tema

- Tokens CSS **scoped a la sesión PROVIDER**, no al chrome de cada frutería en el marketplace.
- CLIENT / ADMIN / invitado: marca de plataforma.
- Estados de pedido (PENDING, etc.) siguen tokens de feedback F3; nunca solo color de marca.
- Logout restaura plataforma (FE limpia vars; `GET /api/auth/session` deja de devolver brand).

Hidratación: [`API-SESSION-THEME-01`](../../fase-5/api/API-SESSION-THEME-01.md) (`GET /api/auth/session`). Escritura: [`API-PROVIDER-SETTINGS-01`](../../fase-5/api/API-PROVIDER-SETTINGS-01.md).

---

#### 4. Consecuencias e Impacto:

* **Positivas:** Un par persistido; rechazo de contraste no bypasseable por API; `/explorar` con sesión PROVIDER recibe marca sin 403 de `/api/provider/me`.
* **Riesgos / Compensaciones:** Contraste vs blanco no cubre texto oscuro sobre primario claro (se rechaza ese primario, que es el objetivo). Secondary umbral 3:1 es más laxo que AA de texto normal a propósito (acentos).

## Referencias

- US-BRAND-01, US-BRAND-02, D-F5-6
- Schema: [`../../fase-5/data-model/DB-providers.md`](../../fase-5/data-model/DB-providers.md)
- Diagrama: [`../../fase-5/diagrams/ARCH-BRAND-01.md`](../../fase-5/diagrams/ARCH-BRAND-01.md)
