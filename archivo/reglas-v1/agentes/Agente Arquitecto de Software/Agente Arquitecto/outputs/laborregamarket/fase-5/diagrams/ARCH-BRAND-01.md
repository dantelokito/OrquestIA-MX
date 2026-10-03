# ARCH-BRAND-01 — Tema de sesión PROVIDER

> **Componente / Flujo:** Colores primario/secundario persistidos + hidratación CSS scoped  
> **Fecha:** 14/08/2026  
> **Fase:** 5 — v0.5.0

---

## Escritura (US-BRAND-01)

```mermaid
sequenceDiagram
  participant UI as SettingsUI
  participant API as PATCH_provider_me
  participant Val as ContrastWCAG
  participant DB as PostgreSQL

  UI->>API: primaryColor secondaryColor
  API->>Val: hex pair and ratios vs white
  alt contraste insuficiente o par incompleto
    Val-->>API: 400 details field
    API-->>UI: no persist
  else par valido o ambos null
    Val-->>API: ok
    API->>DB: UPDATE providers
    API-->>UI: canonical hex or null
  end
```

ADMIN usa `PATCH /api/admin/providers/[id]` con la misma validación. Gate Google 403 **no** aplica a colores.

---

## Hidratación (US-BRAND-02)

```mermaid
flowchart TD
  Layout[Root_layout] --> Session[GET_auth_session]
  Session --> Role{role}
  Role -->|PROVIDER y brand no null| Vars[CSS_vars_sesion]
  Role -->|CLIENT ADMIN invitado o brand null| Platform[Tokens_plataforma]
  Vars --> Chrome[Panel POS ordenes dashboard explorar]
  Platform --> Chrome
  Logout[POST_auth_logout] --> Platform
```

`GET /api/auth/session` siempre **200**. CLIENT viendo `/fruteria/[id]` **no** pinta el chrome con los colores de esa frutería.

Estados de pedido: tokens de feedback F3, no `--brand`.

---

## Referencias

- [`../../comun/adrs/ADR-021-provider-brand-colors.md`](../../comun/adrs/ADR-021-provider-brand-colors.md)
- [`../api/API-PROVIDER-SETTINGS-01.md`](../api/API-PROVIDER-SETTINGS-01.md)
- [`../api/API-SESSION-THEME-01.md`](../api/API-SESSION-THEME-01.md)
- [`../data-model/DB-providers.md`](../data-model/DB-providers.md)
