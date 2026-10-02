# Matriz de Casos de Prueba: TC-REVIEWS-matrix

> **Proyecto:** laborregamarket  
> **Módulo / Feature:** REVIEWS + Google gate  
> **Historia / Contrato:** `US-REV-01..04`, `API-REVIEWS-01`, `API-PROVIDER-SETTINGS-01`  
> **Fecha:** 2026-08-14  
> **Ambiente:** `http://127.0.0.1:8080`

---

## Resumen de ejecución

| Métrica | Valor |
|---------|-------|
| Total de casos | 14 |
| Happy path | 4/4 |
| Negativos / edge | 7/8 |
| Seguridad | 3/3 |

---

## Tabla resumen

| ID | Nombre | Tipo | Prioridad | Auto |
|----|--------|------|-----------|------|
| TC-REV-001 | POST reseña DELIVERED → 201 | Positivo | P1 | reviews.spec.ts |
| TC-REV-002 | Segundo POST → 409 | Edge Case | P1 | reviews.spec.ts |
| TC-REV-003 | rating 0 → 400 | Negativo | P1 | reviews.spec.ts |
| TC-REV-004 | rating 6 → 400 | Negativo | P1 | reviews.spec.ts |
| TC-REV-005 | PENDING → 409 | Negativo | P1 | reviews.spec.ts |
| TC-REV-006 | POS walk-in → 403 | Seguridad | P1 | reviews.spec.ts |
| TC-REV-007 | GET reseñas públicas | Positivo | P1 | reviews.spec.ts |
| TC-REV-008 | GET reseña del pedido | Positivo | P2 | reviews.spec.ts |
| TC-REV-009 | DELETE ADMIN | Positivo | P1 | reviews.spec.ts |
| TC-REV-010 | DELETE CLIENT → 403 | Seguridad | P1 | reviews.spec.ts |
| HP-REV-01 | E2E publicar + ver en frutería | Positivo | P1 | e2e/reviews.spec.ts |
| HP-REV-04 | Banner no verificado | Positivo | P1 | e2e/provider-google.spec.ts |
| EC-01 | Rating 0 UI “Elige una calificación” | Edge Case | P2 | Manual |
| EC-10 | Doble publicar (409) | Edge Case | P1 | TC-REV-002 |

## Happy paths

| ID | Pasos | Resultado esperado |
|----|-------|-------------------|
| HP-REV-01 | Pedido DELIVERED → 1–5 + comentario → 201 → aparece en `/fruteria/[id]` | rating/reviewCount reales |
| HP-REV-04 | PROVIDER `isVerified=false` → banner + PATCH Google 403 | Encargar/Llamar intactos |

## Referencias

- READY-FOR-QA Arquitecto / UX F4
- `API-REVIEWS-01`, `API-PROVIDER-SETTINGS-01`

*Matriz Fase 4 — LaBorregaMarket v0.4.0*
