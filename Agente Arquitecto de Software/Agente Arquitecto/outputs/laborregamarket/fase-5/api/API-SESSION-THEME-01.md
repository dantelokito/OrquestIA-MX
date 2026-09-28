# API-SESSION-THEME-01 — Hidratar tema de sesión

> **Endpoint:** `GET` `/api/auth/session`  
> **Módulo:** `AUTH`, `PROVIDERS`  
> **Versión:** 0.5.0  
> **Fecha:** 14/08/2026  
> **US:** US-BRAND-02  
> **ADR:** [`../../comun/adrs/ADR-021-provider-brand-colors.md`](../../comun/adrs/ADR-021-provider-brand-colors.md)  
> **Autenticación:** Opcional (200 con o sin cookie)

Layout público (`/explorar`) no debe llamar `GET /api/provider/me` (403 para CLIENT/invitado). Este endpoint es liviano y **siempre 200**.

---

## GET `/api/auth/session`

> **Descripción:** Devolver rol de la cookie JWT (si existe) y el par de marca **efectivo** para pintar tokens CSS.  
> **Autenticación:** Opcional

Sin body. Cookie `httpOnly` existente (ADR cookie F1).

### 200 — invitado (sin cookie o JWT inválido)

```json
{
  "data": {
    "authenticated": false,
    "role": null,
    "brand": null
  }
}
```

**No** usar 401: el layout de Explorar llama esto en cada carga.

### 200 — CLIENT o ADMIN

```json
{
  "data": {
    "authenticated": true,
    "role": "CLIENT",
    "brand": null
  }
}
```

`brand` es **siempre** `null` para CLIENT y ADMIN (D-F5-6: chrome de plataforma).

### 200 — PROVIDER con par válido

```json
{
  "data": {
    "authenticated": true,
    "role": "PROVIDER",
    "brand": {
      "primaryColor": "#1B5E20",
      "secondaryColor": "#F9A825",
      "source": "provider"
    }
  }
}
```

### 200 — PROVIDER sin colores, par incompleto, o contraste inválido en lectura

```json
{
  "data": {
    "authenticated": true,
    "role": "PROVIDER",
    "brand": null
  }
}
```

FE aplica tokens de plataforma. PROVIDER sin entidad `Provider` (wizard paso 2): `brand: null`.

| Campo | Tipo | Notas |
|-------|------|--------|
| `authenticated` | boolean | Cookie JWT válida |
| `role` | `CLIENT` \| `PROVIDER` \| `ADMIN` \| null | Del JWT |
| `brand` | object \| null | Solo PROVIDER + par que pasa contraste |
| `brand.source` | `"provider"` | Reservado; no hay `"logo"` en F5 (Could) |

**Nunca incluir:** `passwordHash`, email, phone, `googlePlaceId`, tokens.

No hay **400** / **403** en este GET. **500** envelope estándar si falla Prisma.

---

## Contrato de aplicación (FE)

1. Root layout (o provider de tema) llama `GET /api/auth/session`.
2. Si `brand != null`, setear CSS vars de sesión (`--brand`, `--brand-dark` o equivalentes UX) **solo** en esa sesión.
3. Si `brand == null`, usar tokens globales.
4. `POST /api/auth/logout` → volver a consultar session o limpiar vars en cliente (marca de plataforma).
5. Tras PATCH exitoso de colores, reconsultar session (o aplicar el par canónico del 200 de settings).
6. Estados de pedido **no** se recuercen con `--brand` (tokens F3).

CLIENT viendo `/fruteria/[id]` **no** hidrata los colores de esa frutería en el chrome.

---

## Implementación sugerida

| Capa | Archivo |
|------|---------|
| Route | `src/app/api/auth/session/route.ts` |
| Session | Reutilizar `getSession(request)` (no `requireRole`) |
| Brand | Leer `Provider` del `userId` si `role=PROVIDER`; `isBrandPairValid()` (mismo helper que PATCH) |

NFR: una query puntual; p95 irrelevante frente a Explorar. Sin cache HTTP agresivo (`Cache-Control: private, no-store`) para que logout no sirva brand stale.

---

## Referencias

- Login/logout: [`../../fase-1/api/API-AUTH-01.md`](../../fase-1/api/API-AUTH-01.md)
- Escritura colores: [`API-PROVIDER-SETTINGS-01.md`](./API-PROVIDER-SETTINGS-01.md)
- Diagrama: [`../diagrams/ARCH-BRAND-01.md`](../diagrams/ARCH-BRAND-01.md)
