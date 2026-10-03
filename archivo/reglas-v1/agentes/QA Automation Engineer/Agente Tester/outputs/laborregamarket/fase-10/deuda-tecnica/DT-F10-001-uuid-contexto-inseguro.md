# DT-F10-001 — UUID en contexto inseguro (ex BUG-015)

> **ID:** DT-F10-001  
> **Tipo:** Deuda técnica (no Blocker de release localhost)  
> **Origen:** [BUG-015](../bug-reports/BUG-015.md)  
> **Severidad residual:** Major en `http://IP` / hostname ≠ localhost; **nula** en `http://127.0.0.1` + Chrome/Edge modernos  
> **Fase:** 10 (cerrada documentalmente 12/09/2026)  
> **Estado:** Abierta — backlog post-v0.10.2  
> **Fecha:** 2026-09-12  
> **Código:** `C:\Users\PC GAMER\LaBorregaMarket`

---

## Incidencia

`CartPageClient` y `PosPageClient` llaman `crypto.randomUUID()` al montar. En **contexto no seguro** (`http://192.168.x.x`, hostname LAN) o navegadores sin Web Crypto UUID, Next pinta `global-error`: «Algo salió mal / crypto.randomUUID is not a function».

En el **ambiente de release acordado** (`http://127.0.0.1:8080`, Chrome/Edge) Encargar **funciona**: localhost es secure context y `randomUUID` existe. Stakeholder (12/09) confirma que ese es el criterio de cierre v0.10.2.

## Código (sin fix en esta versión)

```tsx
// src/app/carrito/CartPageClient.tsx ~L50
const idempotencyRef = useRef(crypto.randomUUID());
```

POS: L54, L154, L227. No hay `newIdempotencyKey`.

## Fix futuro (no Must F10)

Helper con `typeof crypto.randomUUID === "function"` + `getRandomValues` / fallback; lazy-init del `useRef`. Specs: `e2e/cart-uuid.spec.ts` (`EC-CART-015`, `HP-POS-015`).

## Relación F10

Sign-off **APROBADO CON CONDICIONES**. BUG-015 **Diferido** (no Verificado). No reabre F8/F9. No bloquea merge GitHub.

## Outputs

- **Archivo:** `outputs/laborregamarket/fase-10/deuda-tecnica/DT-F10-001-uuid-contexto-inseguro.md`
- **Downstream:** Frontend (fase posterior) / PM backlog
