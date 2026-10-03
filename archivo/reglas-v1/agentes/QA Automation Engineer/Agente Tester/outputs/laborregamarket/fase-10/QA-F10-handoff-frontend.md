# Handoff QA → Frontend — LaBorregaMarket F10

> **Nota 12/09:** F10 **APROBADO CON CONDICIONES**. BUG-015/016 **Diferidos** → [DT-F10-001](./deuda-tecnica/DT-F10-001-uuid-contexto-inseguro.md) / [DT-F10-002](./deuda-tecnica/DT-F10-002-media-20mib-fe-bodysize.md). Este handoff queda **histórico**; no es P0 de merge.

> **De:** QA Tester Senior  
> **Para:** @Frontend Developer  
> **Proyecto:** LaBorregaMarket v0.10.2  
> **Fecha:** 31/08/2026  
> **Ambiente:** `http://127.0.0.1:8080`  
> **Código:** `C:\Users\PC GAMER\LaBorregaMarket`

---

## Metadata

- **Fase:** 10
- **Agente Emisor:** QA / Tester Senior
- **Agente Receptor:** Frontend Developer
- **Backend:** actúa en **BUG-016** ([handoff BE](./QA-F10-handoff-backend.md)). **BUG-015** sigue siendo solo FE.

---

## Estado

Sign-off F10 **APROBADO CON CONDICIONES** (12/09). Cola Frontend **histórica** (Diferida a DT, no P0 merge):

| Prioridad | Ticket | Estado |
|-----------|--------|--------|
| P1 | [BUG-015](./bug-reports/BUG-015.md) — `crypto.randomUUID is not a function` al abrir `/carrito` | **Diferido** → DT-F10-001 |
| P2 | [BUG-016](./bug-reports/BUG-016.md) — límite imagen 5 MB → 20 MiB (logo, portada, producto) | **Diferido** → DT-F10-002 |

Prompts (copiar/pegar en el chat Frontend):

- P1: [`activation-prompt-frontend-BUG-015.txt`](./activation-prompt-frontend-BUG-015.txt)
- P2 (después o en paralelo a 015): [`activation-prompt-frontend-BUG-016.txt`](./activation-prompt-frontend-BUG-016.txt)

---

## Qué falló (BUG-015)

**Repro:** en `/fruteria/[id]`, aumentar cantidades → **«Ver carrito →»** (o «Encargar» en móvil) → `/carrito` muestra `global-error`:

```
Algo salió mal.
crypto.randomUUID is not a function
Intentar de nuevo
```

El pedido **no se crea**. `POST /api/orders` no sale.

**Causa raíz:** inicializador de `useRef` en cliente:

```tsx
// src/app/carrito/CartPageClient.tsx ~L50
const idempotencyRef = useRef(crypto.randomUUID());
```

`crypto.randomUUID` no existe en contexto no seguro ni en navegadores sin esa API. Chromium + `127.0.0.1` puede ocultar el bug.

**Misma deuda (mismo ticket):** `src/components/pos/PosPageClient.tsx` L54, L154, L227.

---

## Archivos a tocar

| Ruta | Acción |
|------|--------|
| `src/lib/uuid.ts` (nuevo, nombre a criterio FE) | `newIdempotencyKey()`: usar `globalThis.crypto.randomUUID` **solo si** `typeof === "function"`; si no, UUID v4 con `crypto.getRandomValues` o fallback no criptográfico de último recurso |
| `src/app/carrito/CartPageClient.tsx` | Dejar de llamar `crypto.randomUUID()` en el inicializador de `useRef`; lazy-init con el helper |
| `src/components/pos/PosPageClient.tsx` | Sustituir las 3 llamadas restantes |

### Helper objetivo

```ts
export function newIdempotencyKey(): string {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === "function") {
    return c.randomUUID();
  }
  if (c && typeof c.getRandomValues === "function") {
    const bytes = new Uint8Array(16);
    c.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }
  return `idemp-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
```

Lazy-init (no ejecutar UUID en el primer argumento de `useRef` si el helper asume `window`):

```tsx
const idempotencyRef = useRef<string>("");
if (!idempotencyRef.current) {
  idempotencyRef.current = newIdempotencyKey();
}
```

---

## Resultado esperado

- `/carrito` con ítems: resumen, notas, **«Confirmar pedido»**. Cero `global-error`.
- POS `/proveedor/pos` abre el chrome de mostrador (búsqueda / cobro) sin `global-error`.
- Header `Idempotency-Key` sigue siendo un UUID (o string único) en `POST /api/orders` y POS sales.

---

## No tocar

- API órdenes / POS / backend (cero cambio BE)
- Contrato `Idempotency-Key` en servidor (sigue requerido)
- Copy de `src/app/global-error.tsx` (el TypeError debe dejar de existir)
- Explorar F8/F9, reportes rango (BUG-015)
- `US-ADMIN-04`
- Subir el tope **solo** en FE (BUG-016: BE debe coincidir)

---

## Checklist de recepción (Frontend)

- [ ] Leído [BUG-015.md](./bug-reports/BUG-015.md) completo
- [ ] Confirmado crash en `CartPageClient` L50 (y POS)
- [ ] Alcance 015 limitado a helper UUID + 2 clientes
- [ ] Leído [BUG-016.md](./bug-reports/BUG-016.md) — `MAX_BYTES` = `20 * 1024 * 1024`

---

## DoD BUG-015

1. Helper con guarda `typeof crypto.randomUUID === "function"`
2. Carrito y POS sin llamada cruda a `crypto.randomUUID`
3. Repro manual: frutería → Ver carrito → chrome Encargar
4. Spec QA `tests/e2e/cart-uuid.spec.ts` Pass (stub `randomUUID` undefined)
5. Avisar a QA para cerrar BUG-015 y re-evaluar sign-off F10

---

## BUG-016 — límite 20 MiB (P2, tras o en paralelo a 015)

**Repro:** `/proveedor` logo, portada o dropzone de producto (y admin Catálogos) con JPEG 6–20 MB → inline `El archivo supera el límite de 5MB`.

**Causa:** `src/components/ui/MediaUpload.tsx` `MAX_BYTES = 5 * 1024 * 1024` + hints «máx 5MB».

### Archivos FE

| Ruta | Acción |
|------|--------|
| `src/components/ui/MediaUpload.tsx` | `MAX_BYTES = 20 * 1024 * 1024`; mensaje `El archivo supera el límite de 20MB` |
| `src/app/proveedor/ProveedorPageClient.tsx` | Copy logo y portada: `JPEG, PNG o WebP · máx 20MB` |
| `src/components/provider/catalog/ProductImageDropzone.tsx` | Hint 20MB |
| `src/components/admin/AdminProductForm.tsx` | Hint 20MB |

Constante **idéntica** a BE (`20_971_520`). No tocar copy Cloudinary (sigue prohibido). Si BE aún no desplegó, archivos 6–20 MB pasarán el cliente y el API devolverá 400: coordinar.

### DoD BUG-016 (FE)

1. Logo, portada, producto local y admin: hint y error **20MB**
2. `HP-MED-02` Pass (`provider-catalog-f10.spec.ts` / admin copy)
3. Avisar a QA (cierre conjunto con BE)

---

## Pendientes

- [ ] Fix BUG-015 (responsable: Frontend) — P1
- [ ] Fix BUG-016 capa FE (responsable: Frontend) — P2; BE en paralelo
- [ ] Re-test QA (responsable: QA)
