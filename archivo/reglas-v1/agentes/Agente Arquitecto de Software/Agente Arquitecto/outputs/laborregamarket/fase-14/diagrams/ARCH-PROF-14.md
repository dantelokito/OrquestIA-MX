# ARCH-PROF-14 — PATCH datos de negocio y sello verificado

> **Componente / Flujo:** Settings F14 vs Google lock vs Explorar

```mermaid
flowchart TD
  Perfil[Perfil /proveedor/perfil]
  Patch["PATCH /api/provider/me"]
  Zod[patchProviderSettingsSchema]
  Svc[updateProviderSettings]
  Prov[(Provider)]
  Explorar["GET /api/providers Haversine ETA"]
  Google{body toca Google?}
  Verif{"isVerified?"}

  Perfil --> Patch
  Patch --> Zod
  Zod -->|lat lng fuera AMM| E400[400 geo]
  Zod -->|isVerified en body| E400b[400 strict]
  Zod --> Svc
  Svc --> Google
  Google -->|si| Verif
  Verif -->|false| E403[403 GoogleReviewsLockedError]
  Verif -->|true| Prov
  Google -->|no| Prov
  Svc -.->|nunca escribe isVerified| Prov
  Prov --> Explorar
```

El pin nuevo alimenta Explorar de inmediato. El sello `isVerified` no se apaga (ADR-039).

## Inputs Utilizados

- ADR-039, API-PROVIDER-SETTINGS-14, ADR-018

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/diagrams/ARCH-PROF-14.md`
- **Agente Downstream:** Backend Developer
