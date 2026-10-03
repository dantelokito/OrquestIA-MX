> **Flujo:** Flags de operación de proveedores (verificado, activo, mayoreo, domicilio)
> **Historia de Usuario Asociada:** US-ADMIN-03, US-REV-04
>
> **Punto de entrada:** `/admin?tab=proveedores`. Baseline F1/F2: tabla + Verificar/Revocar + badge email. Este flujo **añade** columnas; no rediseña Bitácora ni Analytics.

> **Pasos del Usuario:**
> 1. `[Tab Proveedores]` → Tabla: Negocio, Ciudad, **Verificado**, **Activo**, **Mayoreo**, **A domicilio**, Email, Acción. Cada flag = `AdminFlagSwitch` texto+control (≥44px), nunca color-only.
> 2. `[Verificar]` → `PATCH /api/admin/providers/[id]` `{ isVerified: true }`. Conservar flujo F1.
> 3. `[Revocar verificación]` → ConfirmDialog: «Al revocar, se apagan las reseñas de Google de este negocio. El Place ID no se borra.» (`US-REV-04`). Confirmar → `{ isVerified: false }` (transacción apaga `googleReviewsEnabled`).
> 4. `[Activo]` → `{ isActive }` — mismo campo listing F1: `false` oculta el negocio de `/explorar`.
> 5. `[Mayoreo]` → `{ offersWholesale }` — mismo concepto chip F9.
> 6. `[A domicilio]` → `{ offersDelivery }` — mismo concepto chip F9.
> 7. `[Email]` → Badge **Sin email válido** F2 (`US-NOTIFY-04`) se **conserva**. No es un flag PATCH F10.

**Condicionales:**
- **Saving fila:** switches disabled + spinner en la fila. Success ✓ 2s.
- **Error PATCH:** inline rojo + Reintentar.
- **401:** `/login?redirect=/admin?tab=proveedores`.
- **403:** ErrorBanner «Sin permiso para este módulo».
- **Mobile:** tabla `overflow-x-auto`; no apilar flags de forma que se pierda el negocio.

**Reglas UI:**
- Labels: **Verificado**, **Activo**, **Mayoreo**, **A domicilio** — paridad copy Explorar F9 (no «Wholesale» / «Delivery» en UI).
- Chrome ADMIN = tokens plataforma. Prohibido pintar filas con `primaryColor` del negocio.
- Wireframe: `WF-admin-proveedores.md`.

**API esperada:**
- `GET /api/admin/providers` — Must incluir `offersWholesale` / `offersDelivery` si el tab los muestra (`API-ADMIN-PROVIDERS-01`).
- `PATCH /api/admin/providers/[id]` — body parcial `isVerified`, `isActive`, `offersWholesale`, `offersDelivery` (+ colores F5 Could, no este paquete).

**Referencias:** D-F10-3, `US-REV-04`, ADR-018, FilterBar F9, `API-ADMIN-PROVIDERS-01.md`.
