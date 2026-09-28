# Handoff Backend Developer — LaBorregaMarket Fase 5 (v0.5.0)

> **De:** Agente Arquitecto de Software  
> **Para:** @Backend Developer (y notas Frontend / DevOps)  
> **Fecha:** 14/08/2026  
> **Prioridad:** Implementar Must F5 según contratos  
> **No implementar:** pasarela, CFDI, PWA, flotilla, Google Maps JS API, Places API, Distance Matrix, bbox API Must, paleta derivada del logo, stock

---

## Estado: LISTO PARA IMPLEMENTAR

Arquitectura F5 documentada. Código F4 ya está en `LaBorregaMarket` (QG BE aprobado). UX F5 aún vacío: los shapes cubren las US; copy/layout (banner vs slider) pueden ajustarse después sin cambiar el modelo.

**Punto de entrada:** este archivo + [`../STATUS.md`](../STATUS.md) + [`../comun/sad.md`](../comun/sad.md)

Código: `C:\Users\PC GAMER\LaBorregaMarket`

---

## Orden de implementación

```
1. Migración Prisma (primaryColor / secondaryColor)
2. Contraste WCAG + PATCH settings + GET /api/auth/session
3. CAT: omitir inactivos en detalle/listado/dashboard; tests 409 orders/POS
4. Frontend: Leaflet OSM, layout US-GEO-05, tokens CSS, carrito/POS ocultar inactivos
5. DevOps: quitar Maps JS key del Must de Explorar; .env.example
```

Mapeo US: GEO-04, GEO-05 (FE), CAT-01, BRAND-01, BRAND-02. Should: clustering, debounce viewport, preview contraste UI.

---

### 1 — Migración

| Tarea | Referencia |
|-------|------------|
| `Provider.primaryColor`, `secondaryColor` | [`data-model/DB-providers.md`](./data-model/DB-providers.md) |

```bash
npx prisma migrate dev --name add_provider_brand_colors
```

Sin índices nuevos. Sin cambio de `Order`. **No** añadir `ProviderProduct.isActive`.

---

### 2 — Brand + sesión (Must)

| Tarea | Contrato |
|-------|----------|
| PATCH/GET colores en `/api/provider/me` | [`api/API-PROVIDER-SETTINGS-01.md`](./api/API-PROVIDER-SETTINGS-01.md) |
| Contraste servidor (4.5:1 primario, 3:1 secundario vs blanco) | [ADR-021](../comun/adrs/ADR-021-provider-brand-colors.md) |
| Par ambos null o ambos hex | mismo |
| `GET /api/auth/session` siempre 200 | [`api/API-SESSION-THEME-01.md`](./api/API-SESSION-THEME-01.md) |
| ADMIN puede PATCH colores | delta admin en API-PROVIDER-SETTINGS-01 |

Helper sugerido: `src/lib/color/contrast.ts`. AUDIT `UPDATE` en PATCH settings.

---

### 3 — Catálogo inhabilitado (Must)

| Tarea | Contrato |
|-------|----------|
| `getProviderDetail`: `isAvailable=true` + `Product.isActive=true` | [`api/API-PROVIDER-PRODUCTS-01.md`](./api/API-PROVIDER-PRODUCTS-01.md) |
| Samples/`_count` listado: mismo filtro | mismo |
| `topProducts` dashboard: excluir `isAvailable=false` | mismo |
| `POST /api/orders` y POS: 409 `Producto no disponible` | ya existe; **tests de regresión** |
| GET panel products | **no** filtrar (toggle) |

[ADR-022](../comun/adrs/ADR-022-catalog-inactive.md). Líneas libres POS (ADR-013) exentas.

---

### 4 — Geo query (cero BE)

[`api/API-GEO-01.md`](./api/API-GEO-01.md) — **no** cambiar `lat`/`lng`/`radiusKm`. Motor = FE (ADR-020).

---

## Frontend (consumo)

| Tema | Qué usar |
|------|----------|
| Envelope | ADR-003 |
| Explorar mapa | Leaflet + OSM (ADR-020); **sin** Google Maps JS key. Attribution OSM. `next/dynamic` `ssr: false` |
| Query lista | API-GEO-01 F4 intacta |
| Layout | Banner **Usar mi ubicación**; slider radio al pie del mapa (US-GEO-05). Favoritas F4 se conservan |
| Fallback teselas | Empty state del mapa; lista usable. **No** "Mapa no disponible por falta de key" |
| Should | Cluster; debounce ~300 ms al recortar lista al viewport (**no** sustituye radio) |
| Tema | `GET /api/auth/session` → CSS vars si `brand != null`. CLIENT/ADMIN = plataforma. Logout limpia |
| Settings colores | PATCH `/api/provider/me`; 400 hex/contraste. Preview UI = Should |
| Catálogo | Detalle/explorar/carrito/POS **ocultan** inactivos. Confirmar pedido → 409 |
| Embed reseñas Google | ADR-018 intacto (URL/Place ID, no JS API) |

---

## DevOps

Ver [`../comun/infra-requirements.md`](../comun/infra-requirements.md).

- **Dejar de exigir** `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` para Explorar (cierra OBS-F4-023).
- Opcional: `NEXT_PUBLIC_OSM_TILE_URL` (CDN compliant en prod).
- Extender `.env.example`.
- npm FE: `leaflet` / `react-leaflet`; retirar Google Maps JS de `/explorar`.

---

## DoD arquitectura (checklist Backend)

- [ ] PATCH colores 400 si contraste insuficiente o par incompleto; no persiste
- [ ] `GET /api/auth/session` 200 para invitado; `brand` solo PROVIDER válido
- [ ] Detalle público **omite** `isAvailable=false` (no greyscale)
- [ ] Orders/POS 409 si producto inhabilitado; orden no creada
- [ ] Dashboard `topProducts` de catálogo vigente; KPIs históricos intactos
- [ ] Query geo F4 sin bbox Must
- [ ] Envelope 400/401/403/404/409/500
- [ ] Sin pasarela / Maps JS / Places / Distance Matrix

---

## Fuera de alcance

Pasarela, CFDI, PWA, Places API, Distance Matrix, flotilla, impresora, barras, bbox Must, stock, tema de proveedor en chrome CLIENT.

---

## Referencias

- SAD: [`../comun/sad.md`](../comun/sad.md)
- ADRs 020–022: [`../comun/adrs/`](../comun/adrs/)
- PRD: PM `fase-5/prd.md`
- Handoff PM: PM `fase-5/handoff-arquitecto.md`
- CO: PM `fase-5/change-orders/CO-F5-001-revertir-google-maps.md`
