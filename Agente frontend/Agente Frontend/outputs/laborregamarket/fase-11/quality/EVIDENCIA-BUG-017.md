# Evidencia de fix — BUG-017

> **Proyecto:** laborregamarket  
> **Fase:** 11  
> **Fecha:** 2026-09-12  
> **Agente:** Frontend Developer  
> **Bug QA:** `QA Automation Engineer/Agente Tester/outputs/laborregamarket/fase-11/bug-reports/BUG-017.md`  
> **Estado:** Corregido en código (pendiente re-prueba QA)

## Inputs Utilizados

- Handoff QA: `fase-11/QA-F11-handoff-frontend.md`
- US-HEADER-01, US-DASH-11, US-AUTH-11
- Contrato: `GET /api/auth/session` (providers[], providerCount) y `GET /api/provider/mine` con `credentials: include`

## Causa raíz

`ProviderScopeProvider` vivía en `AppProviders` (árbol persistente). El primer `reload` corría en `/login` **sin cookie** (`role !== PROVIDER`), dejaba `providers=[]` y `status=ready`. Tras `login()` + `router.push('/proveedor')` el provider **no se remontaba** y **no escuchaba** `SESSION_THEME_EVENT`, así que N se quedaba en 0 y se ocultaban switcher y el 5º tab. Un `reload` viejo también podía pisar uno posterior.

No era un fallo de API: `GET /api/provider/mine` ya devolvía `providerCount >= 2`.

## Archivos tocados (repo app `C:\Users\PC GAMER\LaBorregaMarket`)

| Archivo | Cambio |
|---------|--------|
| `src/hooks/useProviderScope.ts` | Generación anti-stale; reintento en `/proveedor` si session aún anónima; seed desde `session.providers`; escucha `SESSION_THEME_EVENT` |
| `src/lib/ui/provider-label.ts` | `mineProvidersFromSession`, `shouldRetryScopeSession` |
| `src/app/login/LoginPageClient.tsx` | `reload()` del scope **después** de confirmar session autenticada |
| `tests/unit/provider-scope-session.test.ts` | N=2 vs N=1; session vacía sin mock |

## Diff / commit

No hay commit (no solicitado). Working tree:

- `src/hooks/useProviderScope.ts` y `src/lib/ui/provider-label.ts` (archivos de F11 en working tree)
- `src/app/login/LoginPageClient.tsx` modificado
- HEAD app: `1132d3a` (merge PR #10 fase-10)

## Cómo se re-probó en local

```text
cwd: C:\Users\PC GAMER\LaBorregaMarket
npx vitest run tests/unit/provider-scope-session.test.ts
```

Resultado: **3/3 pass**.

No se ejecutó Playwright E2E en este contexto (sin browser tools del agente). QA debe re-probar:

```text
cwd: QA Automation Engineer/Agente Tester/outputs/laborregamarket/tests
npx playwright test tests/e2e/f11-multi-provider.spec.ts -g TC-F11-101
```

Criterio visual: `frutas@elparaiso.mx` → combobox `aria-label="Frutería activa"` y tab «Reportes generales». `verduras@campoverde.mx` → ninguno de los dos.

## Outputs Generados

- **Archivo:** `fase-11/quality/EVIDENCIA-BUG-017.md`
- **Agente Downstream:** QA Tester
