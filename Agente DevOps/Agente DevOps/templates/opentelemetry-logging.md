# Plantilla F: OpenTelemetry + Logs Estructurados JSON

> **Componente:** `{nombre-servicio}`  
> **Stack:** Node.js (adaptar según runtime)

## Instrumentación OpenTelemetry (Traces)

```typescript
// otel-config.ts — Instrumentación OpenTelemetry (Node.js)
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: process.env.OTEL_SERVICE_NAME || 'app-api',
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV || 'production',
  }),
  traceExporter: new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://otel-collector:4318/v1/traces',
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();

process.on('SIGTERM', () => {
  sdk.shutdown().then(() => process.exit(0));
});
```

## Variables de entorno requeridas

```env
OTEL_SERVICE_NAME=app-api
OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4318/v1/traces
OTEL_TRACES_SAMPLER=parentbased_traceidratio
OTEL_TRACES_SAMPLER_ARG=0.1
```

## Formato de log estructurado JSON

```typescript
// logger.ts — Logger estructurado para agregación centralizada
interface LogEntry {
  timestamp: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  service: string;
  traceId?: string;
  spanId?: string;
  message: string;
  [key: string]: unknown;
}

export function log(entry: Omit<LogEntry, 'timestamp' | 'service'>) {
  const output: LogEntry = {
    timestamp: new Date().toISOString(),
    service: process.env.OTEL_SERVICE_NAME || 'app-api',
    ...entry,
  };
  console.log(JSON.stringify(output));
}
```

## Ejemplo de salida de log

```json
{
  "timestamp": "2026-08-04T17:00:00.000Z",
  "level": "info",
  "service": "app-api",
  "traceId": "abc123def4567890",
  "spanId": "789ghi012",
  "message": "Request processed",
  "method": "GET",
  "path": "/api/v1/users",
  "statusCode": 200,
  "durationMs": 42,
  "userId": "usr_abc123"
}
```

## Agregación de logs (Fluent Bit → CloudWatch / Elasticsearch)

```yaml
# fluent-bit-config.yaml (fragmento)
pipeline:
  inputs:
    - name: tail
      path: /var/log/containers/*.log
      parser: docker
  filters:
    - name: parser
      match: '*'
      key_name: log
      parser: json
  outputs:
    - name: cloudwatch
      match: '*'
      region: us-east-1
      log_group_name: /app/production
      auto_create_group: true
```

---

## Checklist de validación

- [ ] Traces exportados vía OTLP (OpenTelemetry Collector / Jaeger)
- [ ] Logs en formato JSON estructurado (no texto plano)
- [ ] `traceId` y `spanId` correlacionados en logs
- [ ] Variables OTEL en secret manager (no hardcoded)
- [ ] Agregador configurado (Fluent Bit / CloudWatch / Datadog)
