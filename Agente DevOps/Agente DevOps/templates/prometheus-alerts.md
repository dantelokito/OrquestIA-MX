# Plantilla E: Reglas de Alerta Prometheus (Golden Signals)

> **Proyecto:** `{nombre-proyecto}`  
> **Golden Signals:** Latencia, Tráfico, Errores, Saturación

```yaml
groups:
  - name: golden-signals
    rules:
      - alert: HighLatencyP95
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket{service="app-api"}[5m])) > 1
        for: 5m
        labels:
          severity: warning
          team: platform
        annotations:
          summary: "Latencia P95 elevada en {{ $labels.service }}"
          description: "P95 > 1s durante 5 minutos en {{ $labels.service }}"

      - alert: HighErrorRate
        expr: |
          rate(http_requests_total{service="app-api", status=~"5.."}[5m])
          / rate(http_requests_total{service="app-api"}[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
          team: platform
        annotations:
          summary: "Tasa de errores HTTP 5xx elevada en {{ $labels.service }}"
          description: "Más del 5% de requests retornan 5xx durante 5 minutos"

      - alert: HighCpuUsage
        expr: avg(rate(container_cpu_usage_seconds_total{pod=~"app-api.*"}[5m])) by (pod) > 0.85
        for: 10m
        labels:
          severity: warning
          team: platform
        annotations:
          summary: "CPU > 85% en pod {{ $labels.pod }}"
          description: "Saturación de CPU sostenida por más de 10 minutos"

      - alert: HighMemoryUsage
        expr: |
          container_memory_usage_bytes{pod=~"app-api.*"}
          / container_spec_memory_limit_bytes{pod=~"app-api.*"} > 0.85
        for: 10m
        labels:
          severity: warning
          team: platform
        annotations:
          summary: "Memoria > 85% en pod {{ $labels.pod }}"
          description: "Saturación de memoria sostenida por más de 10 minutos"

      - alert: DeploymentFailed
        expr: kube_deployment_status_replicas_unavailable{deployment="app-api"} > 0
        for: 5m
        labels:
          severity: critical
          team: platform
        annotations:
          summary: "Despliegue con réplicas no disponibles"
          description: "Deployment {{ $labels.deployment }} tiene réplicas unavailable"

      - alert: PodNotReady
        expr: kube_pod_status_ready{condition="false", pod=~"app-api.*"} == 1
        for: 5m
        labels:
          severity: critical
          team: platform
        annotations:
          summary: "Pod no ready: {{ $labels.pod }}"
          description: "Pod {{ $labels.pod }} no pasa readiness probe"
```

---

## Canales de notificación recomendados

| Severidad | Canal |
|-----------|-------|
| `critical` | PagerDuty / Slack #incidents |
| `warning` | Slack #monitoring / email equipo |

---

## Checklist de validación

- [ ] Alertas para las 4 Golden Signals cubiertas
- [ ] Umbral CPU/Memoria > 85%
- [ ] Alerta de fallos de despliegue (réplicas unavailable)
- [ ] Alerta de HTTP 5xx con umbral definido
- [ ] Labels `severity` y `team` en todas las reglas
