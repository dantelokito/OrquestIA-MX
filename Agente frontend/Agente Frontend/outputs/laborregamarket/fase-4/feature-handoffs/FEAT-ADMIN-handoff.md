# Handoff de Feature: FEAT-ADMIN

> **Proyecto:** laborregamarket  
> **Feature:** ADMIN analytics plataforma  
> **Stack UI:** Next.js 15 + React 19 + Tailwind 4  
> **Fecha:** 2026-08-14  
> **Wireframe:** `WF-admin-analytics`  
> **Contrato:** `API-ADMIN-ANALYTICS-01`

---

## 1. Pantallas y componentes implementados

| Pantalla / Vista | Wireframe | Ruta | Estado |
|------------------|-----------|------|--------|
| Analítica | `WF-admin-analytics` | `/admin/analytics` | OK |

Tab “Analítica” en `/admin` + menú usuario ADMIN.

**Componentes:** `KpiCardAdmin`, `PeriodToggle`, `OriginSplitBar`

Distinto de `/proveedor/dashboard`. Query **`?range=today|7d|30d`** (no `period`).

---

## 2. Integración API

| Endpoint | Método | Service | Contrato | Estado |
|----------|--------|---------|----------|--------|
| `/api/admin/analytics?range=` | GET | `getAdminAnalytics` | API-ADMIN-ANALYTICS-01 | OK |
| `/api/admin/reviews/[id]` | DELETE | `deleteAdminReview` | API-REVIEWS-01 | OK |

`empty: true` + `kpis: null` → “No hay actividad en este periodo” (no ceros fingidos).

---

## 3. Estados UI

| Vista | Loading | Empty | Error | Success |
|-------|---------|-------|-------|---------|
| Analytics | skeleton KPIs | empty periodo | ErrorBanner | KPIs + split |

---

## 4. Formularios y validación

| Formulario | Campos | Mensajes |
|------------|--------|----------|
| Periodo | Hoy / 7d / 30d | tabs |
| Moderación | ID reseña | toast error API |

---

## 5. Responsive y accesibilidad

- [x] Split: leyenda texto + tabla `sr-only`
- [x] Fondo `bg-slate-50`
- [x] Tabs `aria-selected`

---

## 6. Pruebas

Backend: `tests/unit/admin-analytics.service.test.ts`. UI consume el contrato.

---

## 7. DoD Frontend

- [x] Empty real (`kpis: null`)
- [x] Range canónico
- [x] 4 estados

---

## 8. Notas para downstream

### QA Tester

- Rol ADMIN; 403 para otros
- Periodo vacío no muestra $0.00 fingidos
