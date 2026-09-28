# Matriz de Casos de Prueba: TC-MEDIA-matrix (F10)

> **Proyecto:** laborregamarket  
> **Módulo / Feature:** Imágenes en disco local  
> **Historia de Usuario / Contrato:** `US-MEDIA-06`, `US-MEDIA-03` / `API-MEDIA-02` · [BUG-016](../bug-reports/BUG-016.md) **Diferido** → [DT-F10-002](../deuda-tecnica/DT-F10-002-media-20mib-fe-bodysize.md)  
> **Fecha:** 2026-08-31  
> **Ambiente:** `http://127.0.0.1:8080`

## Inputs Utilizados

- ACs: `US-MEDIA-06` (tamaño F2 = 5 MB; NFR stakeholder = 20 MiB)
- CO: `CO-F10-002`
- FE: dropzone JPEG/PNG/WebP; cero Cloudinary

---

## Resumen de ejecución

| Métrica | Valor |
|---------|-------|
| Total de casos | 11 |
| Happy path / negativos / edge / seguridad | Must 8 Pass; 008 Pass 12/09; 009 + HP-MED-02 Fail |
| Pass / Fail / Blocked | 9 / 2 / 0 |

---

## Tabla resumen

| ID | Nombre | Tipo | Prioridad | Auto | Estado |
|----|--------|------|-----------|------|--------|
| TC-MED-001 | POST logo JPEG válido | Positivo | P1 | api/media.spec.ts | Pass |
| TC-MED-002 | GET /api/media/{file} público | Positivo | P1 | api/media.spec.ts | Pass |
| TC-MED-003 | MIME falso (ext .jpg) 400 | Negativo | P1 | api/media.spec.ts | Pass |
| TC-MED-004 | Path traversal GET 400 | Seguridad | P1 | api/media.spec.ts | Pass |
| TC-MED-005 | POST imagen ProviderProduct | Positivo | P1 | api/media.spec.ts | Pass |
| TC-MED-006 | ADMIN image sobre LOCAL 400 | Negativo | P2 | api/media.spec.ts | Pass |
| TC-MED-007 | Upload sin sesión 401 | Seguridad | P1 | api/rbac.spec.ts | Pass |
| HP-MED-01 | UI copy sin Cloudinary | Positivo | P2 | e2e/provider-catalog-f10.spec.ts | Pass |
| TC-MED-008 | JPEG 6 MiB (≤20 MiB) → 200 | Positivo | P1 | api/media.spec.ts | Pass |
| TC-MED-009 | 20 MiB+1 → 400 mensaje 20MB | Edge / negativo | P1 | api/media.spec.ts | Fail |
| HP-MED-02 | Copy UI máx 20MB | Positivo | P1 | e2e/provider-catalog-f10.spec.ts | Fail |

---

## 1. Casos Positivos (Happy Path)

| ID | Nombre | Prerrequisitos | Resultado esperado | Estado |
|----|--------|----------------|-------------------|--------|
| TC-MED-001 | Logo disco | PROVIDER; JPEG 1×1 | 200; `data.url` `/api/media/…` | Pass |
| TC-MED-002 | GET público | url de 001 | 200; `Content-Type` image; `X-Content-Type-Options: nosniff` | Pass |
| TC-MED-005 | Foto ítem | local o PP propio | 200; URL disco | Pass |
| HP-MED-01 | Copy UI | `/proveedor` dropzone | JPEG/PNG/WebP; **sin** Cloudinary | Pass |
| TC-MED-008 | Logo 6 MiB | JPEG magic + padding | **200**; `data.url` `/api/media/…` | Pass |
| HP-MED-02 | Copy 20MB | logo, portada, producto (y admin) | `/20MB/`; cero «máx 5MB» en esas superficies | Fail |

---

## 2. Casos Negativos (Unhappy Path)

| ID | Nombre | Input inválido | Error esperado | Estado |
|----|--------|----------------|----------------|--------|
| TC-MED-003 | Body `not-an-image` + `fake.jpg` | magic bytes | 400 | Pass |
| TC-MED-006 | ADMIN POST image de Product LOCAL | id local | 400 | Pass |

---

## 3. Casos Límite (Edge Cases)

| ID | Nombre | Condición límite | Resultado esperado | Estado |
|----|--------|------------------|-------------------|--------|
| TC-MED-004 | `..` en filename | GET `/api/media/foo..bar.png` | 400 | Pass |
| TC-MED-009 | `20_971_520 + 1` bytes | JPEG magic + padding | **400**; mensaje 20MB | Fail (12/09: **500** — Next body) |

---

## 4. Casos de Seguridad / Permisos

| ID | Nombre | Escenario RBAC | Resultado esperado | Estado |
|----|--------|----------------|-------------------|--------|
| TC-MED-007 | POST media anónimo | sin cookie | 401 | Pass |

---

## Referencias upstream

- ACs: `US-MEDIA-06`, `US-MEDIA-03` (CO pendiente 5→20)
- Contrato: `API-MEDIA-02`
- Bug: `fase-10/bug-reports/BUG-016.md` (**Diferido**)
- Deuda: `fase-10/deuda-tecnica/DT-F10-002-media-20mib-fe-bodysize.md`

---

## Notas

`CLOUDINARY_*` no Must. `UPLOADS_DIR` es pre-requisito.

**BUG-016 / DT-F10-002:** BE disco 20 MiB **aceptado** (`TC-MED-008` Pass 12/09). `TC-MED-009` (20 MiB+1 → 500) y `HP-MED-02` (copy 20MB) son **cobertura de DT**; pueden Fail **sin** bloquear el dictamen F10 ni el merge.
