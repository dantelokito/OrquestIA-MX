# LaBorregaMarket — Entregables Product Manager

> **Proyecto:** LaBorregaMarket  
> **Agente:** Product Manager  
> **Fase activa:** 14 — **Cerrada documentalmente** 18/09. QA APROBADO + QG UX/Arch (sin deltas). Lista DevOps PR. **No hay Fase 15.** F13 en `main` ([PR #13](https://github.com/dantelokito/BorregaMarket/pull/13) `0eda84c`). Pagos fuera.

Estructura **por fases**. Lectura mínima: este archivo + `STATUS.md` + `comun/` + la `fase-N` activa.

```text
outputs/laborregamarket/
├── README.md
├── STATUS.md
├── comun/backlog.md
├── comun/brand/loader-borrega/   B1–B3 PNG (loading reutilizable)
├── historial/
├── fase-1/          AUTH + MVP core
├── fase-2/          EXPLORE, MEDIA, NOTIFY
├── fase-3/          ORDERS, POS, OPS, DASH
├── fase-4/          REVIEWS, GEO (Maps JS), NOTIFY-SCALE, ADMIN-ANALYTICS, POS báscula
├── fase-5/          GEO Leaflet/OSM, CAT harden, BRAND proveedor  ← solo lectura
├── fase-6/          RELIAB + DASH reportes + GEO zoom↔radio        ← solo lectura (congelada)
├── fase-7/          EXPLORE UX + AUTH cross-device                  ← solo lectura
├── fase-8/          EXPLORE polish (P1–P4)                          ← solo lectura
├── fase-9/          Deuda Explorar (US-08…11, GEO-24)               ← solo lectura
├── fase-10/         Admin + catálogo local + media disco + DASH    ← solo lectura (cerrada 12/09)
├── fase-11/         1 user N fruterías + DASH global N>1            ← solo lectura (cerrada 12/09; PR #11 listo)
├── fase-12/         Inventario / almacén + barras catálogo + imágenes POS  ← solo lectura (cerrada 15/09; PR #12 en main)
├── fase-13/         Admin GLOBAL+LOCAL, ocultar, Editar/unidad-oferta, precio, inventario  ← cerrada; PR #13 en main
└── fase-14/         Perfil proveedor + merma aditiva + series DASH + deuda barata  ← cerrada documental 18/09; lista DevOps PR; no F15
```

## Anti-tokens

1. Leer solo `README.md` + `STATUS.md` + `comun/` + `fase-N` activa.
2. No concatenar fases anteriores al implementar.
3. F3–F5 ya tienen US derivadas de discovery cerrado. Si ves copias en `user-stories/` de la raíz, la fuente de verdad es `fase-N/user-stories/`.
4. El layout plano del `SKILL.md` del PM es deuda documental; la fuente de verdad de carpetas es este README.
5. `fase-5/` es solo lectura. Código F5 y QA (APROBADO CON CONDICIONES, 15/08) ya ocurrieron; el STATUS PM del 14/08 (“sin código F5”) quedó desfasado.
6. D-F4-2 (Google Maps JS en `/explorar`) está **revocada** por `fase-5/change-orders/CO-F5-001`. No reintroducir la JS API de pago.
7. `BL-040` (pagos / cobros POS nuevos / pago en línea) está **aparcado hasta nuevo aviso** (`CO-F6-001`). No es F11 automático.
8. `fase-6/` es solo lectura. `CO-F7-001` **anula D-F6-9**: pan/zoom no derivan `radiusKm`.
9. `fase-7/` … `fase-14/` son solo lectura. No reabrir US F7–F14 ni el sign-off QA F8/F10/F11/F12/F13/F14. **No** hay `fase-15/`.
10. Orgánico y chip «Filtros»: **retirados** en F9 (D-F9-2). Mayoreo/Domicilio sí filtran.
11. A5 (F1: solo ADMIN agrega productos) está **revocada** por `CO-F10-001`. El proveedor crea SKUs **locales**; no auto-global. En F11 el SKU local es **por sucursal**.
12. Imágenes: **disco local** (`CO-F10-002`). Cloudinary/S3 **Won't** hasta nuevo aviso.
13. Reportes F10 (`CO-F10-003`): rango + mes-atajo + productos checkbox + print **por sucursal**. F11 añade un **módulo nuevo** de reportes globales solo si N>1.
14. F10 **cerrada** 12/09 (QA APROBADO CON CONDICIONES + merge `main`). F11 **cerrada documentalmente** 12/09 (QA APROBADO + QG UX/Arch). DevOps: [PR #11](https://github.com/dantelokito/BorregaMarket/pull/11) listo; humano mergea.
15. F12 **cerrada documentalmente** 15/09 (QA APROBADO + QG UX/Arch). Rama `feat/f12-inventario-blando`. DevOps F12 en paralelo (QR cita PR #12; humano mergea). No reabrir F11 ni F12.
16. F13 **cerrada** (QA APROBADO + QG UX/Arch). [PR #13](https://github.com/dantelokito/BorregaMarket/pull/13) **en `main`** (`0eda84c`). **Sin** reabrir US. `US-ADMIN-04` Should F10. `US-CAT-17` Won't F13.
17. F14 **cerrada documentalmente** 18/09 (QA APROBADO + QG UX/Arch sin deltas). Rama `feat/f14-panel-proveedor` (`9f5b875` / `92cced6`). DevOps deja PR listo; humano mergea. **Sin** F15. Kardex POS/`DELIVERED` Won't. `SELECT FOR UPDATE` Should. `BL-040` aparcado.

## Índice por fase

| Fase | Alcance (US) | Carpeta |
|------|----------------|---------|
| 1 | `US-AUTH-01` … `US-AUTH-07` | [fase-1/](./fase-1/README.md) |
| 2 | `US-EXPLORE-*`, `US-MEDIA-*`, `US-NOTIFY-*` | [fase-2/](./fase-2/README.md) |
| 3 | `US-ORDERS-*`, `US-POS-*`, `US-OPS-*`, `US-DASH-01` … `03` | [fase-3/](./fase-3/README.md) |
| 4 | `US-REV-*`, `US-GEO-01…03`, `US-NOTIFY-06…09`, `US-ADMIN-01`, `US-POS-05…06`, `US-ORDERS-05` | [fase-4/](./fase-4/README.md) |
| 5 | `US-GEO-04…05`, `US-CAT-01`, `US-BRAND-01…02` | [fase-5/](./fase-5/README.md) |
| 6 | `US-NOTIFY-10`, `US-OPS-04…07`, `US-GEO-06…08`, `US-BRAND-03`, `US-AUTH-08`, `US-DASH-04…06` | [fase-6/](./fase-6/README.md) |
| 7 | `US-GEO-09…16`, `US-AUTH-09`, `US-EXPLORE-05`, `US-EXPLORE-06` | [fase-7/](./fase-7/README.md) |
| 8 | `US-GEO-17` … `23`, `US-EXPLORE-07` (P1–P4) | [fase-8/](./fase-8/README.md) |
| 9 | `US-EXPLORE-08` … `11`, `US-GEO-24` (deuda DT-F9-001…005) | [fase-9/](./fase-9/README.md) |
| 10 | `US-SEC-*`, `US-ADMIN-02` … `04`, `US-CAT-02` … `03`, `US-MEDIA-06`, `US-DASH-07` … `09` | [fase-10/](./fase-10/README.md) |
| 11 | `US-AUTH-11`, `US-HEADER-01`, `US-ISO-01`, `US-DASH-11`, `US-ONB-01`, `US-SEED-01`, `US-ADMIN-11`, `US-EXPLORE-11` | [fase-11/](./fase-11/README.md) |
| 12 | `US-INV-01` … `06`, `US-CAT-12`, `US-CAT-13`, `US-POS-12` | [fase-12/](./fase-12/README.md) |
| 13 | `US-ADMIN-05` … `06`, `US-CAT-14` … `16`, `US-CAT-18` … `20`, `US-DASH-10/12/13`, `US-SEC-04`, `US-INV-07` | [fase-13/](./fase-13/README.md) |
| 14 | `US-PROF-01` … `05`, `US-CAT-21` … `23`, `US-INV-08` … `10`, `US-DASH-14` … `16` | [fase-14/](./fase-14/README.md) |

Backlog global: [comun/backlog.md](./comun/backlog.md)
