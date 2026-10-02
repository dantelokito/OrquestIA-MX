# Handoff: UX/UI Designer → Frontend Developer

## Metadata

- **Fecha:** 2026-09-12
- **Fase:** 11
- **Proyecto:** laborregamarket
- **Agente Emisor:** UX/UI Designer
- **Agente Receptor:** Frontend Developer
- **Timestamp:** 2026-09-12 (diseño Must F11)

Delta de chrome PROVIDER (switcher N>1), **módulo nuevo** Reportes generales, copy `/registro/negocio`, fila demo Campo Verde, admin y explorar por sucursal. **No** rediseñar Explorar F9 ni `/admin/analytics`. **No** copiar look slate al panel PROVIDER.

**No implementar código desde este chat UX.** Frontend espera **también** contratos del Arquitecto (`handoff-backend-fase-11` / APIs). Este handoff no activa FE.

Código (solo lectura aquí): `C:\Users\PC GAMER\LaBorregaMarket\src\`

---

## Estado: LISTO PARA IMPLEMENTAR (cuando Arch entregue contratos)

**Punto de entrada:** este archivo + [`../STATUS.md`](../STATUS.md) + [`../comun/design-tokens.md`](../comun/design-tokens.md) v0.11.0 + [`../comun/information-architecture.md`](../comun/information-architecture.md) v0.11.0

Quality Gate UX: **cuando FE implemente**. QG-correcciones post-QA APROBADO, no ahora.

---

## Entregables

| Archivo | Tipo | Estado |
|---------|------|--------|
| `fase-11/user-flows/UF-HEADER-01-switcher-fruteria.md` | User flow | Completo |
| `fase-11/user-flows/UF-ISO-01-aislamiento.md` | User flow | Completo |
| `fase-11/user-flows/UF-DASH-11-reportes-globales.md` | User flow | Completo |
| `fase-11/user-flows/UF-ONB-01-alta-sucursal.md` | User flow | Completo |
| `fase-11/user-flows/UF-SEED-01-login-demo.md` | User flow | Completo |
| `fase-11/user-flows/UF-ADMIN-11-filas-sucursal.md` | User flow | Completo |
| `fase-11/user-flows/UF-EXPLORE-11-tarjeta-provider.md` | User flow | Completo |
| `fase-11/wireframes/WF-HEADER-01-switcher.md` | Wireframe | Completo |
| `fase-11/wireframes/WF-ISO-01-contexto-sucursal.md` | Wireframe | Completo |
| `fase-11/wireframes/WF-DASH-11-reportes-globales.md` | Wireframe | Completo |
| `fase-11/wireframes/WF-ONB-01-nueva-fruteria.md` | Wireframe | Completo |
| `fase-11/wireframes/WF-SEED-01-login-demo.md` | Wireframe | Completo |
| `fase-11/wireframes/WF-ADMIN-11-filas-sucursal.md` | Wireframe | Completo |
| `fase-11/wireframes/WF-EXPLORE-11-cards-provider.md` | Wireframe | Completo |
| `comun/design-tokens.md` | Tokens v0.11.0 | Completo |
| `comun/information-architecture.md` | IA v0.11.0 | Completo |

## Pendientes

- [ ] Contratos API F11 (responsable: Arquitecto). FE no inventa paths.
- [ ] Print del consolidado = Should (no bloquea)
- [ ] Persistencia `activeProviderId` (forma = ADR Arquitecto)

## US de este handoff

| ID | Frontend hace | MoSCoW |
|----|----------------|--------|
| **US-AUTH-11** | Consumir `activeProviderId`; no rediseñar login | M |
| **US-HEADER-01** | `ProviderSwitcher` solo N>1; N=1 chrome F10 | M |
| **US-ISO-01** | Eyebrow + rehidratar tokens/título; CAT/POS/DASH F10 sobre activa | M |
| **US-DASH-11** | Ruta `/proveedor/reportes-generales` + 5º tab solo N>1; 4 estados | M |
| **US-ONB-01** | Copy «Nueva frutería» + CTA Agregar frutería | M |
| **US-SEED-01** | Fila `verduras@campoverde.mx` en DemoAccountsBlock | M |
| **US-ADMIN-11** | Una fila por `businessName` / `Provider.id` | M |
| **US-EXPLORE-11** | Dos cards El Paraíso; chrome F9 intacto | M |

## Orden de implementación (cuando Arch+BE permitan)

```
1. ProviderSwitcher + persistencia activa (N>1)
2. ActiveStoreEyebrow + rehidratación --brand
3. GlobalReportsNavItem + página consolidada (403/redirect si N=1)
4. OnboardingModeCopy + AddStoreCta
5. DemoAccountsBlock Campo Verde
6. ProviderTableF10 filas por sucursal
7. Verificar listing Explorar (datos; no chrome)
```

## Rutas / componentes

| Superficie | Spec |
|------------|------|
| Header | `WF-HEADER-01` · ≥44px · teclado |
| Panel F10 | `WF-ISO-01` · no redibujar CAT/POS/DASH |
| Reportes generales | `WF-DASH-11` · `KpiCard` F3 · no `KpiCardAdmin` |
| `/registro/negocio` | `WF-ONB-01` |
| `/login` | `WF-SEED-01` · prod-off |
| `/admin` Proveedores | `WF-ADMIN-11` |
| `/explorar` | `WF-EXPLORE-11` |

## Validación requerida por el receptor

- [ ] Switcher y módulo global = función de N
- [ ] Campo Verde sin chrome extra
- [ ] 4 estados del consolidado
- [ ] Contratos Arch leídos (no inventar API)

## Checklist de recepción (Frontend)

- [ ] Todos los archivos de la tabla Entregables existen
- [ ] Tokens v0.11.0 e IA actualizados
- [ ] Sin placeholders en UF/WF
- [ ] Handoff Arquitecto disponible antes de fetch reales

## Won't

Pagos, Cloudinary, `US-ADMIN-04`, chips sección Explorar, CSV/CFDI, reopen F7–F10.

## Inputs Utilizados

- **PRD:** `Administrador de producto/Product Manager/outputs/laborregamarket/fase-11/prd.md`
- **Handoff PM:** `.../fase-11/handoff-ux-ui.md`
- **US:** `US-AUTH-11`, `US-HEADER-01`, `US-ISO-01`, `US-DASH-11`, `US-ONB-01`, `US-SEED-01`, `US-ADMIN-11`, `US-EXPLORE-11`
- **STATUS PM:** fase 11 discovery listo

## Outputs Generados

- **Archivo:** `Agente UX UI/Agente UX UI/outputs/laborregamarket/fase-11/handoff-frontend-fase-11.md`
- **Agente Downstream:** Frontend Developer
- **STATUS:** diseño F11 listo; FE espera este handoff **y** contratos Arch
