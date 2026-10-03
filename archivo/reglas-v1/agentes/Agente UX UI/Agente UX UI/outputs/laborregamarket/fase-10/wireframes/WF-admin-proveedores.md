> **Pantalla:** Admin tab Proveedores (`/admin?tab=proveedores`) — flags F5–F9
> **Objetivo Principal:** Verificar/activar negocios y alinear Mayoreo / A domicilio con el listing Explorar
> **Base:** tab Proveedores en [`../../fase-1/wireframes/WF-admin-panel.md`](../../fase-1/wireframes/WF-admin-panel.md) — solo lectura. Bitácora sin delta F10.

```text
+-----------------------------------------------------------------------+
| [Header ADMIN — marca plataforma]                                     |
|  [ Catálogos ]  [ Proveedores ]  [ Bitácora ]  [ Analítica ]          |
+-----------------------------------------------------------------------+
|  Proveedores                                                          |
|                                                                       |
|  Negocio     │ Ciudad  │ Verificado │ Activo │ Mayoreo │ A domicilio │ Email    │ Acción     |
|  Frutas El…  │ MTY     │ [● Sí]     │ [●]    │ [●]     │ [○]         │ OK       │ [Revocar]  |
|  Verduras N. │ MTY     │ [○ No]     │ [●]    │ [○]     │ [●]         │ ⚠ Sin    │ [Verificar]│
|              │         │            │        │         │             │ email    │            |
+-----------------------------------------------------------------------+
```

Mobile: wrapper `overflow-x-auto`; primera columna sticky Should; targets ≥44px.

### Confirmación al revocar verificación (`US-REV-04`)

```text
+------------------------------------------------------+
|  ¿Revocar verificación?                              |
|  Se apagan las reseñas de Google de este negocio.    |
|  El Place ID no se borra.                            |
|  [ Cancelar ]              [ Revocar ]               |
+------------------------------------------------------+
```

Revocar = primary destructivo (`error` outline o ConfirmDialog F3), no `--brand` de cobro.

#### Estados de la pantalla

| Estado | Comportamiento UI |
|--------|-------------------|
| **Loading** | Skeleton 8 filas |
| **Empty** | «No hay proveedores registrados» |
| **Saving fila** | Switches de la fila disabled + spinner |
| **Success** | ✓ 2s en la fila |
| **Error PATCH** | Inline + Reintentar |
| **Sin email** | Badge «Sin email válido» F2 intacto |
| **401/403** | Login / ErrorBanner módulo |

#### Componentes requeridos para Frontend

- **ProviderTableF10:** columnas F1 + `isActive` + `offersWholesale` + `offersDelivery`.
- **AdminFlagSwitch:** label visible Verificado / Activo / Mayoreo / A domicilio.
- **RevokeVerifyDialog:** copy Google Reviews.
- **VerifyAction:** Verificar / Revocar F1.

#### Responsividad

- Desktop: tabla completa `text-sm`.
- Mobile: scroll-x obligatorio (DoD PM). No esconder Mayoreo/Domicilio detrás de un menú Must.

#### Accesibilidad

- Cada switch `aria-label="{negocio}, {flag}"`. Nunca color-only.
- ConfirmDialog Escape / foco inicial en Cancelar.

#### API esperada

- `GET /api/admin/providers` (flags en fila)
- `PATCH /api/admin/providers/[id]` `{ isVerified, isActive, offersWholesale, offersDelivery }`

#### Fuera de alcance

Colores del negocio (Could), impersonation, CRUD usuarios, analytics.

#### Referencias

- `UF-ADMIN-03-proveedores-flags.md` · `API-ADMIN-PROVIDERS-01` · FilterBar F9
