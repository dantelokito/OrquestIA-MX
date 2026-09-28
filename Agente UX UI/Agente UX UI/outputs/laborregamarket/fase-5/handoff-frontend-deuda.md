# Handoff Frontend — Deuda crítica (próxima fase)

> **De:** Agente UX/UI Designer  
> **Para:** @Frontend  
> **Fecha:** 16/08/2026  
> **Producto:** LaBorregaMarket v0.5.0  
> **Tipo:** Addendum — no sustituye [`handoff-frontend.md`](./handoff-frontend.md) v0.5.0

Fuente QA: `QA Automation Engineer/.../fase-5/deuda-tecnica-fases-previas/IMPACTO-NO-ATENDER.md`  
Fuente DevOps: `Agente DevOps/.../comun/deuda-fases-previas.md`

Backend / Redis / CI / JWT los cierra **Arquitecto + Backend + DevOps**. Este archivo es **solo lo que Frontend debe implementar o no romper** antes de F6 (pagos).

---

## 1. Impacto más crítico si se ignora

El peor escenario no es “falta CI”. Es el **primer entorno compartido + F6 pagos** sobre Encargar, POS y contacto ya vivos.

| Dimensión | Consecuencia mayor |
|-----------|-------------------|
| **Confiabilidad** | `POST /api/providers/[id]/contact` responde **500** porque `@upstash/redis` no está en el lockfile (`DEV-P0-001`). El fallback in-memory y el **503 fail-closed** de prod (ADR-015) **nunca se evalúan**. El cliente lee producto roto. |
| **Confiabilidad** | Sin pipeline (`DEV-P0-002`) las ~214 pruebas viven en un laptop. Un merge rompe checkout/POS/Leaflet y nadie lo ve hasta que un humano paga o cobra. |
| **Escalabilidad** | Rate limit de contacto inexistente → spam Llamar/WhatsApp al proveedor en el mismo release en que se pide pagar. |
| **Mantenibilidad** | Checklist F4 aún exige Maps JS y “Leaflet retirado”. Completarlo **reintroduce OBS-F4-023** (mapa gris / billing) y deshace `CO-F5-001`. |
| **Mantenibilidad** | Staging sin `migrate deploy` (`DEV-P1-003`): picker de marca y `GET /api/auth/session` (`brand`) 500; el PROVIDER cree que “la UI de colores está rota”. |

```text
Ahora:  2 P0 (compile contacto + CI) + checklist Maps que deshace F5
F6:     lo mismo + pasarela + datos de pago + más superficie sin RBAC/CI
```

Diferir no compra tiempo de diseño. Compra el incidente: mapa gris otra vez + contacto 500 + colores 500 + checkout sin red de CI.

---

## 2. Incidencias a atender en la próxima fase (exclusivo)

**Todas las P0 y P1.** Sin eso no hay F6 pagable. Más dos P2 acoplados a Frontend / rutas nuevas.

| ID | Sev | Por qué entra | Dueño código | Cambio Frontend |
|----|-----|---------------|--------------|-----------------|
| **DEV-P0-001** | P0 | Clone/CI no compila; contacto 500; 503 de prod nunca corre | Backend (manifiesto) | Estados 500/503 en `ContactCTA` — [`WF-contacto-resiliencia.md`](./wireframes/WF-contacto-resiliencia.md) |
| **DEV-P0-002** | P0 | Gate QA abierto F1–F5 | DevOps | No documentar `next dev` ni `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` como Must de Explorar |
| **DEV-P1-003** | P1 | Schema F4/F5 ausente → 500 reviews/colores/session | DevOps + Backend | Fallback chrome plataforma; ErrorBanner en picker; 500 ≠ empty POS |
| **DEV-P1-004** | P1 | Resend/Cloudinary/Upstash/Inngest no-op en staging | DevOps | No asumir notify/media 200; toasts F2 de error ya existen |
| **DEV-P1-005** | P1 | Prod sin Redis = **503**, no 500 de import | Backend + DevOps | Copy 503 ≠ 429 ≠ 500 |
| **DEV-P1-006** | P1 | Checklist F4 reviviría mapa gris | DevOps + **Frontend** | Invariante Leaflet (abajo) |
| **DEV-P1-007** | P1 | JWT de example / cookie sin Secure | DevOps | Nada de UI |
| **DEV-P2-009** | P2 | `.env.example` de Frontend incompleto vs app | **Frontend (doc)** | Sincronizar vars públicas |
| **DEV-P2-011** | P2 | Ruta nueva de pagos sin `requireRole` | Backend | No inventar APIs; solo contratos Arquitecto |

**No Must en la próxima fase (no implementar desde FE):**

- **DEV-P2-008** `/health` — SAD = roadmap; probes a `/` o `GET /api/auth/session`.
- **DEV-P2-010** PITR / nube — hasta staging real; el gate inmediato es P0-002.

UX **no** prescribe `npm install`, YAML de CI ni secretos.

---

## 3. Sprint FE — deuda (orden)

| Orden | Trabajo | ID | Wireframe / nota |
|-------|---------|----|------------------|
| 1 | Ramificar toasts de `ContactCTA` por 429 / 503 / 500; **nunca** bloquear `tel:` / `wa.me` / Encargar | P0-001, P1-005 | `WF-contacto-resiliencia.md` |
| 2 | Invariante Explorar: Leaflet + OSM; **prohibido** `@vis.gl/react-google-maps` y Maps key Must | P1-006 | `WF-explorar-leaflet.md` (ya F5) |
| 3 | Session/colores 500 → tokens plataforma + ErrorBanner picker; no romper `/explorar` | P1-003 | `WF-proveedor-marca.md` + abajo |
| 4 | Toggle/catálogo: 500 de API ≠ “No hay productos activos” | P1-003 | `WF-catalogo-canales.md` |
| 5 | Sincronizar `comun/.env.example` de Frontend (solo públicos) | P2-009 | Tabla env abajo |

---

## 4. Contacto — copy canónico

`tel:` y Encargar **siempre** usables. Un toast a la vez; variante **error** (no success). Nunca empty de mapa ni “agotado”.

| HTTP | Toast | `tel:` / Encargar |
|------|-------|-------------------|
| 200 `notified` | `La frutería fue notificada` (success, F2) | Usable |
| 429 | Silencio (F2: no “bloqueado”) | Usable |
| **503** | **El aviso a la frutería no está disponible. Puedes llamar igual.** | Usable |
| **500** / red | **No pudimos avisar a la frutería. Puedes llamar igual.** | Usable |

Hoy el código silencia 429 y usa un solo error genérico para el resto. Hay que ramificar 503 vs 500.

---

## 5. Invariante Explorar (`DEV-P1-006`)

- **Prohibido** reintroducir `@vis.gl/react-google-maps` en `/explorar`.
- **Prohibido** exigir `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` para GEO.
- Mantener Leaflet + teselas OSM, attribution visible, estado “El mapa no cargó; usa la lista”.
- `NEXT_PUBLIC_OSM_TILE_URL` opcional (default OSM).
- Embed/enlace Google de reseñas (`US-REV-03`) **se mantiene**.

---

## 6. Marca y catálogo (`DEV-P1-003`)

| Superficie | Si API 500 (schema ausente) |
|------------|------------------------------|
| `SessionThemeProvider` | Tokens de **plataforma**; no romper chrome |
| `BrandColorPicker` | ErrorBanner + Reintentar; no fingir guardado |
| POS empty | 500 = ErrorBanner; **no** “No hay productos activos” |
| `/explorar` | Lista usable; no empty de mapa |

---

## 7. `.env.example` Frontend (`DEV-P2-009`)

Alinear el `.env.example` del repo Frontend con la app. **Solo variables públicas:**

| Variable | Must Explorar | Nota |
|----------|---------------|------|
| `NEXT_PUBLIC_OSM_TILE_URL` | No (opcional) | Default teselas OSM |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | **No** | No es Must GEO; no reintroducir |

**No** publicar secretos de servidor como `NEXT_PUBLIC_*` (Upstash, JWT, Resend, Inngest). Esos viven en el `.env.example` de la app / DevOps.

---

## 8. Fuera de alcance de este addendum

CI YAML, `npm install @upstash/redis`, JWT, `/health`, pasarela, clustering Should, parches OBS-UX-F5-001 (ETA `slate-400`) salvo que FE los tome en paralelo.

---

## DoD Frontend (deuda)

- [ ] `ContactCTA` ramifica 429 / 503 / 500 con copy de la tabla §4
- [ ] `tel:`, `wa.me` y Encargar no se deshabilitan por fallo de notify
- [ ] Explorar sigue Leaflet/OSM; cero Maps JS
- [ ] Session 500 → plataforma; picker ErrorBanner
- [ ] 500 catálogo ≠ empty POS de “sin activos”
- [ ] `.env.example` FE: OSM opcional; sin Maps key Must

---

*Handoff deuda UX → Frontend — LaBorregaMarket v0.5.0 — 16/08/2026.*
