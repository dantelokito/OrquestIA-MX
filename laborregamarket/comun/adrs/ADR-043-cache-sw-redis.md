# ADR-043 — Caché: service worker con allowlist (Serwist) y Redis en GET públicos

> **Estado:** Aprobado  
> **Fecha:** 2026-10-03  
> **Fase:** 15  
> **US:** US-CACHE-01, US-CACHE-02  
> **Decisores:** Arquitecto de Software

## Inputs Utilizados

- `fase-15/pm.md` (Won't: PWA offline, caché de HTML o de `/api/*` autenticado)
- Código `feat/f15-legal-cache` @ `caaedba`: `@upstash/redis` ya en lockfile (ADR-015, rate limit); `GET /api/media/[filename]` ya responde `Cache-Control: public, max-age=86400`; **`GET /api/catalogs` es solo ADMIN** (`requireRole(ADMIN)` + `hasModulePermission`); `GET /api/providers` y `GET /api/providers/[id]` no leen la sesión; `listProviders` con geo calcula `distanceKm` con las coordenadas exactas de la query

---

#### 1. Contexto y Problema

Usuarios recurrentes recargan estáticos e imágenes; Explorar recalcula Haversine sobre todos los proveedores en cada request. Un service worker mal configurado (p. ej. `defaultCache` de `@serwist/next`) cachea HTML y respuestas API, y en un navegador compartido el usuario B vería datos de A. Una caché Redis mal llaveada sirve precios viejos o respuestas dependientes de sesión.

---

#### 2. Opciones Consideradas

**Navegador**

* **A — Serwist con allowlist explícita y NetworkOnly por default:** Pros: control total, sin HTML en caché. Contras: hay que escribir `sw.ts` a mano.
* **B — `defaultCache` de `@serwist/next` / next-pwa:** Contras: cachea páginas y `/api/*` (riesgo de fuga entre sesiones). Descartada.
* **C — Solo `Cache-Control` HTTP:** Pros: cero dependencias. Contras: no cumple "se sirven desde el service worker" (US-CACHE-01).

**Servidor**

* **D — Upstash Redis cache-aside, llaves por recurso + generación para listados, fail-open:** Pros: ya tenemos Upstash; invalidación barata sin `SCAN`. Contras: carrera escritura-tardía acotada por TTL.
* **E — `unstable_cache` / `revalidateTag` de Next:** Contras: caché por instancia en self-host; semántica cambiante entre versiones de Next.

---

#### 3. Decisión Elegida

**A + D.**

### Service worker (`src/app/sw.ts`, `@serwist/next`)

| Ruta | Estrategia | Notas |
|------|-----------|-------|
| `/_next/static/*` | Precache del build (manifest Serwist) | Versionado por build |
| `/brand/*` | Precache (`globPublicPatterns: ["brand/**"]`) | Ningún otro archivo de `public/` |
| `GET /api/media/*` | CacheFirst, caché `lbm-media-v1`, `maxEntries 300`, `maxAgeSeconds 7 días`, solo status **200** | Nunca opacas (status 0) |
| Todo lo demás (navegaciones HTML, `/api/*`, POST) | **NetworkOnly** (sin handler = red) | Sin fallback offline |

- Compatibilidad verificada: `@serwist/next@9.5.12` (peer `next >=14.0.0`) con Next **15.5.22** instalado. Es plugin de **webpack**: `next build` sin `--turbopack`. **Invariante:** si `build` pasa a Turbopack, migrar a `@serwist/turbopack`; si no, el SW deja de generarse en silencio.
- Paquetes: `@serwist/next@^9.5.12` (dependencia), `serwist@^9.5.12` (devDependency). **Prohibido** importar `defaultCache` de `@serwist/next/worker`.
- `withSerwistInit({ swSrc: "src/app/sw.ts", swDest: "public/sw.js", cacheOnNavigation: false, reloadOnOnline: false, globPublicPatterns: ["brand/**"] })`; `public/sw.js` y `public/swe-worker-*.js` en `.gitignore`; `sw.ts` con `/// <reference lib="webworker" />`. `navigationPreload: false`.
- `skipWaiting`, `clientsClaim`, `cleanupOutdatedCaches: true`; al activar se borran cachés que no estén en la allowlist. Cambiar el sufijo `-vN` invalida la caché runtime en el siguiente despliegue.
- `disable: process.env.NODE_ENV !== "production"` (no se registra en dev). El middleware ya deja pasar `/sw.js` (path con `.`).
- `/sw.js` con `Cache-Control: no-cache, no-store, must-revalidate` en `next.config.ts`.
- **Logout:** tras `POST /api/auth/logout` 200, FE borra `lbm-media-*` (defensa en profundidad), limpia `session-cart` y `maps/preview-cache`, y hace **navegación dura** (`window.location.assign("/")`) para vaciar el Router Cache de Next. Login exitoso también navega duro.

### Redis (`src/lib/cache/public-cache.ts`)

| Recurso | Llave | TTL |
|---------|-------|-----|
| `GET /api/providers/[id]` | `lbm:c1:pd:{providerId}` | 60 s |
| `GET /api/providers` | `lbm:c1:pl:{gen}:{sha1(queryNormalizada)}` | 30 s |
| Generación de listados | `lbm:c1:pl:gen` (INCR; ausente = 0) | sin TTL |

- Query normalizada: solo parámetros conocidos (`page`, `limit`, `q` trim+minúsculas, `city`, `category`, `verified`, `offersWholesale`, `offersDelivery`, `lat`, `lng`, `radiusKm`), ordenados, tras validación. `lat`/`lng` se **redondean a 3 decimales antes de consultar la BD** (hit y miss usan el mismo centro), así el cuerpo cacheado es idéntico al calculado.
- Solo se escribe el `body` de respuestas **200**; jamás 4xx/5xx ni respuestas con `Set-Cookie`. Ningún handler cacheado lee la sesión.
- `invalidateProviderCache(ids[])`: `DEL lbm:c1:pd:{id}` por id + `INCR lbm:c1:pl:gen`. Se llama **después** del commit en toda mutación que cambie la representación pública (lista en `fase-15/arch.md`).
- **Fail-open:** cualquier error o timeout (> 300 ms) de Redis = leer BD y responder 200; un `console.warn` por proceso. Sin `UPSTASH_*` o con `PUBLIC_CACHE_DISABLED=1` = caché desactivada (bypass, sin fallback en memoria; no 503, a diferencia del rate limit). Si la invalidación falla, se registra `[cache] invalidate_failed` y la escritura del negocio **no** falla.
- Header `X-Cache: HIT | MISS | BYPASS` para QA.
- **`GET /api/catalogs` no se cachea:** es ADMIN, no pública (delta al PM).

---

#### 4. Consecuencias e Impacto

* **Positivas:** HTML y APIs autenticadas nunca salen de la red; imágenes y estáticos instantáneos en visitas recurrentes; Explorar evita Haversine repetido.
* **Negativas:** `distanceKm` se calcula desde el centro redondeado (error ≤ ~80 m); dependencia npm nueva `@serwist/next` + `serwist` (dev: `next build` con webpack).
* **Riesgos:** carrera "lector lento escribe después del DEL" en detalle: dato viejo ≤ 60 s. Aceptado (TTL corto). Los listados no la sufren porque el `gen` nuevo cambia la llave.

## Referencias

- `fase-15/arch.md` · ADR-015 (Upstash) · ADR-032 (media en disco) · ADR-002 · ADR-003
