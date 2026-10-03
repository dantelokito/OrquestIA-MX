# Handoff de Feature: FEAT-SCALE

> **Proyecto:** laborregamarket  
> **Feature:** SCALE (báscula POS WebSerial)  
> **Stack UI:** Next.js 15 + React 19 + Tailwind 4  
> **Fecha:** 2026-08-14  
> **Wireframe:** `WF-pos-bascula`  
> **Contrato:** ADR-019 (sin API); POS F3 `POST /api/provider/pos/sales` intacto

---

## 1. Pantallas y componentes implementados

| Pantalla / Vista | Wireframe | Ruta | Estado |
|------------------|-----------|------|--------|
| POS báscula | `WF-pos-bascula` | `/proveedor/pos` | OK |

**Módulo:** `src/lib/pos/scale/` — `ScaleAdapter`, registry (`generic-stable`, `ftdi-generic`, `prolific-generic`), parsers ASCII. Persistencia `lbm.scale.driverId`.

**UI:** `ScaleStatusBadge` + selector de modelo + Conectar. Keypad F3 intacto.

---

## 2. Integración API

Ningún endpoint nuevo. Cobro **sin** campos de báscula.

---

## 3. Estados UI

| Vista | Loading | Empty | Error | Success |
|-------|---------|-------|-------|---------|
| Báscula | “Conectando…” | desconectada / unsupported | desconexión / parse fail (no pisa qty) | lecturas → quantity KG/GR |

---

## 4. Formularios y validación

Conversión `gramsToQuantity`: GR = gramos; KG = /1000; PZA no se sobrescribe.

---

## 5. Responsive y accesibilidad

- [x] Badge texto+icono; touch ≥44px Conectar
- [x] Fallback keypad si no hay WebSerial (Chrome/Edge desktop + HTTPS/localhost)

---

## 6. Pruebas

**Comando:** `npx vitest run tests/unit/pos-scale.test.ts`

---

## 7. DoD Frontend

- [x] Registry + stub genérico + VID/PID piloto FTDI/Prolific
- [x] POS F3 cobro intacto
- [x] Sin VID/PID al servidor

---

## 8. Notas para downstream

### QA Tester

- Sin WebSerial: mensaje + keypad
- Línea KG/GR activa recibe peso; PZA no
- `POST /api/provider/pos/sales` shape F3
