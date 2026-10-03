# ARCH-AUTH-11 — Contexto activo 1:N

> **ID:** ARCH-AUTH-11  
> **Fecha:** 12/09/2026  
> **Versión:** 0.11.0  
> **Estado:** Aprobado  
> **US:** US-AUTH-11, US-ISO-01, US-DASH-11

## Inputs Utilizados

- ADR-034, ADR-035, DB-providers F11

```mermaid
flowchart LR
  subgraph cliente [Browser]
    FE[Panel PROVIDER]
  end
  subgraph cookies [Cookies first-party]
    JWT[JWT HttpOnly]
    ACT["lbm_active_provider"]
  end
  subgraph api [API Routes]
    SES[GET /api/auth/session]
    SW[POST /api/provider/active]
    ISO["/api/provider/* activo"]
    GLOB[GET /api/provider/reports/global]
  end
  subgraph db [PostgreSQL]
    U[User]
    P1[Provider A]
    P2[Provider B]
  end
  FE --> JWT
  FE --> ACT
  FE --> SES
  FE --> SW
  FE --> ISO
  FE --> GLOB
  U -->|1:N| P1
  U --> P2
  ISO -->|filter providerId = activo| P1
  GLOB -->|IN ids del user| P1
  GLOB --> P2
```

El header `X-Active-Provider-Id` no es fuente de verdad.

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-11/diagrams/ARCH-AUTH-11.md`
- **Agente Downstream:** Backend, Frontend
