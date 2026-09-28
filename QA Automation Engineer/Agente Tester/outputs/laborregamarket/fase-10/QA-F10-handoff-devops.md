# Handoff QA → DevOps — merge GitHub v0.10.2

> **De:** QA Tester Senior  
> **Para:** @DevOps  
> **Proyecto:** LaBorregaMarket v0.10.2  
> **Fecha:** 2026-09-12  
> **Código producto:** `C:\Users\PC GAMER\LaBorregaMarket`  
> **Ambiente QA:** `http://127.0.0.1:8080`

---

## Metadata

- **Fase QA:** 10 **cerrada documentalmente**. **No** promover a 11 en esta sesión.
- **Agente Emisor:** QA / Tester Senior
- **Agente Receptor:** DevOps
- **Prompt:** [`activation-prompt-devops-merge-F10.txt`](./activation-prompt-devops-merge-F10.txt)
- **Sign-off:** [`qa-signoffs/QA-F10-signoff.md`](./qa-signoffs/QA-F10-signoff.md) — **APROBADO CON CONDICIONES** (12/09)

---

## Pedido

Merge / push a GitHub del código en `C:\Users\PC GAMER\LaBorregaMarket` según **tu** STATUS (hoy DevOps sigue en **F7 CI**). QA **no** ejecuta `git push`.

v0.10.2 tiene dictamen QA **APROBADO CON CONDICIONES**. Zero Blocker **PASS** para release **localhost**.

---

## Qué no hacer

- **No** reabrir F8 ni F9.
- **No** tratar [DT-F10-001](./deuda-tecnica/DT-F10-001-uuid-contexto-inseguro.md) ni [DT-F10-002](./deuda-tecnica/DT-F10-002-media-20mib-fe-bodysize.md) como **P0 de CI**. Los specs `cart-uuid.spec.ts`, `HP-MED-02` y `TC-MED-009` **pueden fallar**; son cobertura de deuda, no gate de merge.
- **No** exigir fallback UUID ni copy 20 MB ni `bodySizeLimit` para publicar esta versión.
- **No** abrir `fase-11/` desde este handoff.

---

## Condiciones del sign-off (visibles, no bloquean merge)

| ID | Tema |
|----|------|
| DT-F10-001 | `crypto.randomUUID` fuera de localhost / secure context (ex BUG-015) |
| DT-F10-002 | Copy FE 5 MB + POST >20 MiB → 500 (resto BUG-016; BE disco 20 MiB **aceptado**) |
| F9 | Sin sign-off QA |
| READY-FOR-QA | Ausente (UX/Arch) |
| US-ADMIN-04 | Should, no validado |

## Evidencia Must F10

Suite focal Playwright (31/08): **89/89**. Media disco `TC-MED-008` (6 MiB logo) **Pass** 12/09.

## STATUS DevOps de referencia

`Agente DevOps/Agente DevOps/outputs/laborregamarket/STATUS.md` — fase **7** (CI transversal). Alinear el merge/push con ese flujo (workflow `ci.yml`, no `next dev` en CI).

## DoD DevOps (este handoff)

- [ ] Leído [QA-F10-signoff.md](./qa-signoffs/QA-F10-signoff.md)
- [ ] Merge/push según STATUS DevOps
- [ ] DT-F10 **excluida** de P0 CI
- [ ] F8/F9 **no** reabiertas
