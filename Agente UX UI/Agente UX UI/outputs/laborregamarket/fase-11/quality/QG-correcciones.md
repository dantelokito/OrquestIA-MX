# Quality Gate — Correcciones UX/UI (post-QA APROBADO)

> **Proyecto:** laborregamarket  
> **Fase:** 11  
> **Fecha:** 12/09/2026  
> **Agente emisor:** UX/UI Designer  
> **Agente receptor:** Product Manager (cierre de fase; no activa FE ni DevOps)  
> **Estado:** Completo — hubo bugs de UI/flujo verificados

## Inputs Utilizados

- **Sign-off QA:** `QA Automation Engineer/Agente Tester/outputs/laborregamarket/fase-11/qa-signoffs/QA-F11-signoff.md` (APROBADO, 12/09/2026)
- **Evidencia FE BUG-017:** `Agente frontend/Agente Frontend/outputs/laborregamarket/fase-11/quality/EVIDENCIA-BUG-017.md`
- **Evidencia FE BUG-018:** `Agente frontend/Agente Frontend/outputs/laborregamarket/fase-11/quality/EVIDENCIA-BUG-018.md`
- **Handoff UX original:** `outputs/laborregamarket/fase-11/handoff-frontend-fase-11.md`
- **Diseño original:** `WF-HEADER-01`, `UF-HEADER-01`, `WF-DASH-11`, `UF-DASH-11`, `WF-EXPLORE-11`, `UF-EXPLORE-11`
- **STATUS UX:** `outputs/laborregamarket/STATUS.md`

## Resumen

QA APROBADO tras re-prueba de **BUG-017** (Blocker) y **BUG-018** (Major). El diseño Must F11 (visibilidad por N, módulo Reportes generales, cards por Provider) **no cambia de layout ni tokens**. Sí se formalizan reglas de **sincronización de sesión** y **hidratación geo** que el handoff original asumía implícitas y que FE corrigió en código.

**Tokens:** sin cambio. `comun/design-tokens.md` permanece en v0.11.0. No hay paleta, tipografía ni espaciado nuevos.

## Qué cambió en UI / flujo (por bug)

### BUG-017 — Chrome N>1 tras login (sin recarga rara)

**Síntoma de diseño:** `/login` con layout persistente e hidratación anónima dejaba N=0. Tras `login` + navegar a `/proveedor`, el chrome **no reevaluaba** N: El Paraíso no veía `ProviderSwitcher` ni el 5º tab «Reportes generales» hasta un refresh manual.

**Intención UX (ahora explícita):**

1. Tras login **PROVIDER**, el chrome debe resolver N en el **primer paint útil** de `/proveedor*` (o en el evento de sesión), **sin** pedir al usuario recargar el navegador.
2. Si N>1: aparecen `ProviderSwitcher` (`aria-label="Frutería activa"`) y el ítem SubNav **Reportes generales**.
3. Si N=1: chrome F10 intacto (sin switcher, sin 5º tab). Deep-link a Reportes generales sigue yendo a Reportes F10.
4. Un N=0 residual de la pantalla de login **no** es un estado Success del panel. Mientras se rehidrata el scope, el chrome puede mostrar Loading (skeleton / `aria-busy`); no debe congelar N=0 como “listo”.

**Contrato visual de verificación (seed):**

| Usuario | N esperado | UI obligatoria |
|---------|------------|----------------|
| `frutas@elparaiso.mx` | 2 | Switcher + tab Reportes generales, sin F5 |
| `verduras@campoverde.mx` | 1 | Ni switcher ni 5º tab |

### BUG-018 — Explorar honra `lat`/`lng` de URL

**Síntoma de diseño:** hidratar `/explorar` vacío reescribía centro a San Nicolás (25.7475, −100.283) + 10 km y podía marcar el chip default, ignorando el pin de la URL. Tecnológico (~11 km desde SN) desaparecía del predicado.

**Intención UX (ahora explícita):**

1. Si la URL trae `lat` y `lng` válidos, **ese pin gana**. No pisar con default San Nicolás al hidratar.
2. No `router.replace` que borre el pin de la query cuando ya existe.
3. El chip de dirección (favorita o «San Nicolás») **no** se selecciona si contradice el pin de URL. Fallback de etiqueta = coordenadas / label derivado del pin, no la primera favorita.
4. Clamp de radio 0.5–10 km (F8) se mantiene: `radiusKm=25` en URL se acota a 10. El Must se cumple por **centro**, no por radio sin clamp.
5. Cards Must El Paraíso (Centro + Tecnológico) deben listarse cuando el pin URL (p. ej. Monterrey 25.6714, −100.3089) las incluye en el predicado.

## Ajustes a WF / UF (anti-regresión FE)

Documentación de fase 11 actualizada para que un FE futuro no “optimice” de nuevo el scope persistente ni el default geo:

| Artefacto | Ajuste |
|-----------|--------|
| `UF-HEADER-01-switcher-fruteria.md` | Paso post-login: re-resolver N ante evento de sesión / entrada a `/proveedor`. Prohibido N=0 congelado. |
| `WF-HEADER-01-switcher.md` | Estado Loading incluye “scope post-login”; Success N>1 no exige F5. |
| `UF-DASH-11-reportes-globales.md` | 5º tab nace del mismo N rehidratado; no aparece después de un refresh raro. |
| `WF-DASH-11-reportes-globales.md` | Nota de visibilidad atada al scope de sesión, no a un flag estático de primer mount. |
| `UF-EXPLORE-11-tarjeta-provider.md` | Prioridad de centro: query `lat`/`lng` > default SN. |
| `WF-EXPLORE-11-cards-provider.md` | Hidratación: no reescribir URL; chip no pisa pin. |

`handoff-frontend-fase-11.md` **no** se reescribe (handoff histórico de diseño). Este QG + UF/WF son la fuente para no regresar el bug.

## Lista de archivos UX tocados (esta sesión)

- `fase-11/quality/QG-correcciones.md` (este archivo)
- `fase-11/user-flows/UF-HEADER-01-switcher-fruteria.md`
- `fase-11/user-flows/UF-DASH-11-reportes-globales.md`
- `fase-11/user-flows/UF-EXPLORE-11-tarjeta-provider.md`
- `fase-11/wireframes/WF-HEADER-01-switcher.md`
- `fase-11/wireframes/WF-DASH-11-reportes-globales.md`
- `fase-11/wireframes/WF-EXPLORE-11-cards-provider.md`
- `fase-11/README.md`
- `outputs/laborregamarket/STATUS.md`
- `outputs/laborregamarket/historial/changelog-fase-11-2026-09-12.md` (append)

No se tocaron `comun/design-tokens.md` ni `comun/information-architecture.md`.

## Pendientes

- [ ] PM consume este QG + el de Arquitecto para cerrar / promover. UX **no** activa Frontend ni DevOps.
- [ ] Arquitecto documenta (o declara ausencia de) cambio de contrato en su `QG-correcciones.md`.

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-11/quality/QG-correcciones.md`
- **Agente Downstream:** Product Manager
- **Inputs requeridos para promover:** este archivo + QG Arquitecto + sign-off QA APROBADO
