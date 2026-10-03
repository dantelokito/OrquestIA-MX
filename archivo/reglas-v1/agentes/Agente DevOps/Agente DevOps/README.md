# Agente DevOps / Cloud Engineer Senior

Repositorio del **Agente DevOps / Cloud Engineer Senior** del ecosistema de agentes de desarrollo. Transforma requerimientos de arquitectura, repos de Backend/Frontend y sign-off de QA en infraestructura automatizada, segura, escalable y lista para producción.

## Rol en el ecosistema

```
Cliente / Stakeholder
        │
        ▼
  Agente PM ──────────────────────┐
        │                         │
        ▼                         │
  Agente UX/UI ───────────────────┤
        │                         │
        ▼                         ▼
  Agente Arquitecto ──────────────┘
        │
        ├──────────────────┐
        ▼                  ▼
  Agente Backend    Agente Frontend
        │                  │
        └────────┬─────────┘
                 ▼
           Agente QA Tester
                 │
                 ▼
         Agente DevOps (este repo)
                 │
                 ▼
        Staging / Production
```

## Inputs upstream

Este agente consume los entregables de:

| Agente upstream | Entregables | Ubicación de referencia |
|-----------------|-------------|-------------------------|
| [Agente Arquitecto de Software](../../Agente%20Arquitecto%20de%20Software/Agente%20Arquitecto/) | SAD, NFRs, topología, servicios cloud, ADRs | `architecture-diagram.md`, `adr.md` |
| [Agente Backend](../../Agente%20backend/Agente%20backend/) | Repositorio, `.env.example`, health checks | `templates/env-requirements.md` |
| [Agente Frontend](../../Agente%20frontend/Agente%20Frontend/) | Repositorio, build config, variables de entorno | `templates/env-requirements.md` |
| [Agente QA Tester](../../QA%20Automation%20Engineer/Agente%20Tester/) | Sign-off, URLs staging, comandos E2E | `templates/qa-signoff.md` |

## Cómo invocar el agente

El agente se activa **bajo demanda**. Dos formas de usarlo en Cursor:

1. **Skill:** Menciona `@devops-cloud-engineer` o pide explícitamente "actúa como DevOps / Cloud Engineer Senior".
2. **Prompt de activación:** Copia y pega el contenido de [`templates/activation-prompt.txt`](templates/activation-prompt.txt), completando el contexto del proyecto y el stack técnico.

## Flujo de trabajo

1. **Análisis de Requerimientos** — Mapeo de NFRs, topología de red y variables de entorno desde entregables upstream.
2. **Containerización** — Dockerfiles multi-stage con usuario non-root y HEALTHCHECK en `outputs/{nombre-proyecto}/docker/`.
3. **Pipeline CI/CD** — Lint, tests, build, Trivy scan, push a registry y deploy staging.
4. **Infraestructura como Código** — Terraform modular para clusters, redes, SGs y servicios cloud.
5. **Observabilidad y Handoff** — Manifiestos K8s, alertas Prometheus, OTel config e `infra-handoffs/INFRA-{Component}-handoff.md`.

## Estructura del repositorio

```
.cursor/skills/devops-cloud-engineer/
├── SKILL.md                          # Punto de entrada del skill
├── phase-1-identity.md               # Identidad, principios, I/O, inputs upstream
├── phase-2-docker-cicd-iac.md        # Docker, CI/CD, Terraform, handoff
└── phase-3-observability-dod.md      # Zero-downtime, DR, observabilidad, DoD

templates/
├── activation-prompt.txt             # Prompt de activación directa
├── dockerfile-production.md          # Plantilla A: Dockerfile multi-stage
├── github-actions-pipeline.md        # Plantilla B: Pipeline CI/CD
├── terraform-ecs-module.md           # Plantilla C: Terraform ECS
├── kubernetes-deployment.md          # Plantilla D: K8s rolling update + probes
├── prometheus-alerts.md              # Plantilla E: Alertas Golden Signals
├── opentelemetry-logging.md          # Plantilla F: OTel + logs JSON
└── infra-handoff.md                  # Handoff de infraestructura

outputs/                              # Artefactos generados por proyecto
└── {nombre-proyecto}/
    ├── docker/
    ├── .github/workflows/
    ├── terraform/
    ├── k8s/
    ├── observability/
    ├── .env.example
    └── infra-handoffs/
```

## Convención de salida

Los artefactos generados se guardan en `outputs/{nombre-proyecto}/` usando kebab-case (ej. `outputs/tienda-online/`).

| Tipo | Convención ID | Ejemplo |
|------|---------------|---------|
| Handoff de infraestructura | `INFRA-{Component}` | `INFRA-API-handoff.md` |

## Principios de infraestructura

- **Infraestructura como Código (IaC):** Toda la infraestructura reproducible y versionable con Terraform. Prohibidos cambios manuales en consola Cloud.
- **Inmutabilidad y Contenerización:** Imágenes Docker multi-stage, non-root, con HEALTHCHECK.
- **DevSecOps:** Menor privilegio IAM, secretos en Vault/Secrets Manager, escaneo Trivy en pipeline.
- **Zero-Downtime:** Rolling update, blue/green o canary en producción.
- **FinOps:** Auto-scaling, Fargate Spot donde aplique, apagar entornos de prueba no utilizados.

## Integración cross-agent

### Lo que este agente recibe

| Agente | Entregable consumido |
|--------|---------------------|
| Arquitecto | NFRs, topología, servicios cloud (RDS, Redis, S3, colas) — ver handoff en `phase-2-architecture-workflow.md` del Arquitecto |
| Backend | `.env.example`, repositorio, endpoint `/health` — ver handoff en `SKILL.md` del Backend |
| Frontend | Build config, variables de entorno, assets estáticos |
| QA | `QA-{Module}-signoff.md` obligatorio antes de deploy a producción — ver `phase-3-quality-gates-and-dod.md` del QA |

### Lo que este agente entrega

| Agente downstream | Entregable |
|-------------------|------------|
| Backend / Frontend | Dockerfiles, `.env.example`, lineamientos de health check |
| QA | URLs staging, triggers E2E en pipeline, credenciales de prueba |
| Arquitecto | Terraform para auditoría de red, subnets, SGs |
| Staging / Production | Infraestructura desplegada con observabilidad activa |

## Definition of Done — DevOps

Antes de declarar lista una infraestructura o pipeline:

- [ ] Docker inmutable: multi-stage, non-root, Trivy sin CRITICAL/HIGH
- [ ] IaC validado: `terraform fmt` + `terraform validate` + S3 backend + DynamoDB lock
- [ ] Pipeline seguro: lint, tests, SAST, credenciales en secret manager
- [ ] Health checks: liveness/readiness en manifiestos K8s/ECS
- [ ] Alertamiento activo: CPU/Mem >85%, HTTP 5xx, fallos de deploy

## Especificación fuente

La especificación completa del agente está en [`Notas/Reglas de DevOps/Agente Devops.txt`](../../Notas/Reglas%20de%20DevOps/Agente%20Devops.txt).
