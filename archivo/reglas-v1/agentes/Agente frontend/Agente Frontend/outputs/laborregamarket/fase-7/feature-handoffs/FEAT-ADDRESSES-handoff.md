# Handoff de Feature: FEAT-ADDRESSES

> **Proyecto:** laborregamarket
> **Feature:** ADDRESSES (favoritas en servidor + centro por defecto San Nicolás)
> **Stack UI:** Next.js 15 + React 19 + Tailwind 4
> **Fecha:** 2026-08-18
> **Wireframe:** `WF-explorar-mapa-primero` (barra compacta)
> **Contrato:** `API-ADDRESSES-01` (F7) + `MOD-ADDRESSES-handoff` · ADR-026 / ADR-027
> **US:** US-GEO-11 · US-GEO-14

---

## 1. Pantallas y componentes implementados

| Pantalla / Vista | Wireframe | Ruta | Estado |
|------------------|-----------|------|--------|
| Barra compacta de dirección | `WF-explorar-mapa-primero` | `/explorar` | OK |

**Componentes / módulos:**

| Componente | Ubicación | Descripción |
|------------|-----------|-------------|
| `resolveExploreCenter` | `src/lib/maps/explore-center.ts` | Función pura: URL → last-used → default → pin invitado → San Nicolás |
| `SAN_NICOLAS_CENTER` | `src/lib/maps/constants.ts` | `25.7475, -100.2830` (ADR-026) |
| `FavoriteAddressSelect` | `src/components/explore/FavoriteAddressSelect.tsx` | Sin cambios de API; el select ahora sella `lastUsedAt` |

---

## 2. Integración API

| Endpoint | Método | Service | Contrato | Estado |
|----------|--------|---------|----------|--------|
| `/api/users/me/addresses` | GET | `listMyAddresses` | API-ADDRESSES-01 | OK (hidratación del centro) |
| `/api/users/me/addresses` | POST | `createAddress` | API-ADDRESSES-01 | OK |
| `/api/users/me/addresses/[id]/use` | POST | `markAddressUsed` | API-ADDRESSES-01 | OK (al elegir favorita) |

- El GET de direcciones **gana** a `sessionStorage`: el pin guardado solo se usa como cola del invitado (`guest` tras 401/403) para el viaje `/explorar` → `/login` → `/explorar`.
- El primer GET de `/api/providers` espera a que la URL refleje el centro resuelto, así nunca sale una petición sin coordenadas.
- El stamp de last-used es best-effort: un fallo no rompe mapa ni lista; la lista local se reordena con la dirección usada al frente.

---

## 3. Estados UI

| Vista | Loading | Empty | Error | Success |
|-------|---------|-------|-------|---------|
| Favoritas | select deshabilitado mientras no hay datos | "Sin direcciones guardadas" | 401/403 → modo invitado (CTA lleva a login) | Lista ordenada last-used primero |
| Centro del mapa | — | Sin direcciones → San Nicolás + 10 km | Fallo de red → San Nicolás | Pin + círculo en la dirección elegida |

---

## 4. Formularios y validación

Etiqueta de dirección máx. 40 caracteres al guardar. Radio por defecto 10 km en cualquier hidratación que no venga de la URL.

---

## 5. Responsive y accesibilidad

- [x] Select y botón Guardar con `min-h-11`
- [x] Etiqueta visible "Favoritas" asociada al `select`
- [x] Copy de centro actual ("Centro: {etiqueta}") como texto, no solo color

---

## 6. Pruebas

**Comando:** `npx vitest run tests/unit/explore-center.test.ts`

- [x] URL gana sobre cualquier dirección
- [x] Last-used más reciente gana al `isDefault`
- [x] `sessionStorage` ignorado para sesión CLIENT
- [x] Sin datos → San Nicolás 10 km

---

## 7. Definition of Done (DoD Frontend)

- [x] **Diseño Pixel-Fidelidad**
- [x] **Responsive Design**
- [x] **Manejo de los 4 Estados UI**
- [x] **Consumo Limpio de APIs**
- [x] **Validación de Formulario**
- [x] **Accesibilidad Basal**

---

## 8. Notas para downstream

### QA Tester

- Invitado sin pin en URL: el mapa abre en San Nicolás con 10 km.
- CLIENT con dirección usada ayer: al entrar a `/explorar` el mapa abre en esa dirección aunque `sessionStorage` tenga otra.
- Elegir favorita dispara `POST .../use`: al recargar, esa dirección encabeza la lista.
- PROVIDER/ADMIN reciben 403 en favoritas: la pantalla queda en modo invitado sin romperse.

### DevOps

Sin variables nuevas.
