# Retorno QA F10 — PM / UX / Arquitecto (12/09/2026)

> **Estado posterior (misma fecha, tarde):** F10 **cerrada documentalmente**. Sign-off **APROBADO CON CONDICIONES**. 015/016 **Diferidos** → [DT-F10-001](./deuda-tecnica/DT-F10-001-uuid-contexto-inseguro.md) / [DT-F10-002](./deuda-tecnica/DT-F10-002-media-20mib-fe-bodysize.md). El CO 20 MiB y copy UX **siguen pendientes** como deuda, **no** como gate de merge. F11 no arranca en esta sesión.

> **De:** QA Tester Senior  
> **Para:** @Product Manager (confirmar NFR) · @UX UI · @Arquitecto  
> **Copia:** Frontend (015 + copy 016) · Backend (`bodySizeLimit` / 400)  
> **Código:** `C:\Users\PC GAMER\LaBorregaMarket` · `http://127.0.0.1:8080`  
> **Corrida:** Playwright 12/09 — 12 passed / 4 failed (specs 015+016; cobertura DT)

---

## Pedido a PM

Confirmar por escrito el NFR **20 MiB** (`20_971_520` bytes) para logo, portada y foto de producto (local + admin GLOBAL), y emitir **CO** que actualice `US-MEDIA-03` / `US-MEDIA-01` / `US-MEDIA-06`. Hoy el **API de disco ya acepta 6 MiB** (`TC-MED-008` Pass) mientras las US y el copy UX siguen en **5 MB** — eso es un cabo suelto.

**Pedido vigente:** el NFR 20 MiB queda en [DT-F10-002](./deuda-tecnica/DT-F10-002-media-20mib-fe-bodysize.md) (backlog post-v0.10.2). **F10 ya está cerrada** con condiciones; F11 no arranca en esta sesión. Merge GitHub = DevOps.

Prompt: [`activation-prompt-pm-retorno-F10.txt`](./activation-prompt-pm-retorno-F10.txt)

---

## Qué está implementado (evidencia)

| Ítem | Resultado 12/09 |
|------|-----------------|
| Must F10 SEC/ADMIN/CAT/MEDIA/DASH (31/08) | 89/89 intacto |
| BE `MAX_IMAGE_BYTES` | `20_971_520` en `local-disk.ts`; mensaje service `límite de 20MB` |
| `TC-MED-008` JPEG 6 MiB → POST logo | **Pass 200** |
| Unit BE `MAX_IMAGE_BYTES === 20_971_520` | Presente en `tests/unit/media-disk.test.ts` |

---

## Qué NO está implementado

| Ticket | Hueco | Spec |
|--------|-------|------|
| **BUG-015** Blocker | `CartPageClient.tsx` L50 y `PosPageClient.tsx` L54/L154/L227 = `crypto.randomUUID()`. No existe helper UUID | `EC-CART-015` Fail (no llegó a `/carrito`; timeout Explorar). Código = no fix |
| **BUG-016 FE** | `MediaUpload` `MAX_BYTES = 5 * 1024 * 1024`; hints «máx 5MB» en proveedor, dropzone, admin | `HP-MED-02` Fail |
| **BUG-016 BE borde** | `next.config.ts` **sin** `bodySizeLimit`. Oversize 20 MiB+1 → **500** (esperado **400** + «20MB») | `TC-MED-009` Fail |
| **cloudinary.ts** | Sigue 5 MB (no lo usa el path disco; cabo Arch) | — |

Dictamen QA (tarde 12/09): **APROBADO CON CONDICIONES**. Tickets **Diferidos** a DT (no Verificados). Lista abiertos F10 vacía.

---

## Cabos sueltos para UX

Alinear copy y tokens al NFR que PM confirme (o revertir BE a 5 MB si PM rechaza el CO):

| Superficie | Hoy en producto | Objetivo si CO 20 MiB |
|------------|-----------------|------------------------|
| `/proveedor` logo + portada | «máx 5MB» | «máx 20MB» |
| Drawer producto local | «máx 5MB» | «máx 20MB» |
| Admin Catálogos formulario GLOBAL | «máx 5MB» | «máx 20MB» |
| Error inline | `límite de 5MB` | `límite de 20MB` |
| Wireframes F10 / `design-tokens` / `UF-MEDIA` / `WF-proveedor-media` | 5MB | 20MB |

MIME JPEG/PNG/WebP y «cero Cloudinary» **no cambian**.

Handoff: [`QA-F10-handoff-ux.md`](./QA-F10-handoff-ux.md) · prompt [`activation-prompt-ux-retorno-F10.txt`](./activation-prompt-ux-retorno-F10.txt)

---

## Cabos sueltos para Arquitecto

| Contrato / ADR | Hoy | Acción |
|----------------|-----|--------|
| `API-MEDIA-02` / `API-MEDIA-01` Max size | 5_242_880 | `20_971_520` si PM confirma |
| `ADR-032` / `ADR-006` | 5 MB | Enmienda o nota F10 |
| Body multipart Next | Sin `experimental.serverActions.bodySizeLimit` | Documentar ≥ `21mb` o el buffer Next recorta y el API responde **500** |
| `cloudinary.ts` 5 MB | Código muerto vs disco | Deprecar, alinear, o dejar Won't explícito |
| Rate 20 uploads / 10 min | Intacta | Sin cambio |

Handoff: [`QA-F10-handoff-arquitecto.md`](./QA-F10-handoff-arquitecto.md) · prompt [`activation-prompt-arquitecto-retorno-F10.txt`](./activation-prompt-arquitecto-retorno-F10.txt)

---

## Para FE / BE (código que queda en deuda, no P0 de merge)

- DT-F10-001 (ex 015): [`activation-prompt-frontend-BUG-015.txt`](./activation-prompt-frontend-BUG-015.txt)
- DT-F10-002 FE (ex 016 copy): [`activation-prompt-frontend-BUG-016.txt`](./activation-prompt-frontend-BUG-016.txt)
- DT-F10-002 BE: `bodySizeLimit: "21mb"` + oversize → 400 (no 500); opcional alinear `cloudinary.ts`

---

## DoD histórico (superado 12/09 tarde)

F10 **ya está cerrada** con condiciones. El checklist de abajo es el **backlog DT**, no un gate de merge:

1. DT-F10-001: helper UUID + `cart-uuid.spec.ts` Pass.
2. DT-F10-002: FE copy 20MB + `HP-MED-02` Pass; `TC-MED-009` → 400.
3. PM: CO registrado; UX/Arch contratos y copy alineados.
4. F11: lo abre DevOps/PM cuando toque; QA no promociona fase en esta sesión.
