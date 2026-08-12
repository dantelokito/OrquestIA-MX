# Plantilla D: Kubernetes Deployment (Rolling Update + Probes)

> **Componente:** `{nombre-servicio}`  
> **Estrategia:** Rolling Update (zero-downtime)  
> **Health endpoint:** `/health` (debe coincidir con HEALTHCHECK del Dockerfile — Plantilla A)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-api
  namespace: production
  labels:
    app: app-api
    managed-by: devops
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: app-api
  template:
    metadata:
      labels:
        app: app-api
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        fsGroup: 1000
      containers:
        - name: app-api
          image: registry.example.com/app-api:${COMMIT_SHA}
          imagePullPolicy: Always
          ports:
            - name: http
              containerPort: 3000
              protocol: TCP
          resources:
            requests:
              cpu: "250m"
              memory: "256Mi"
            limits:
              cpu: "500m"
              memory: "512Mi"
          livenessProbe:
            httpGet:
              path: /health
              port: http
            initialDelaySeconds: 10
            periodSeconds: 30
            timeoutSeconds: 3
            failureThreshold: 3
          readinessProbe:
            httpGet:
              path: /health
              port: http
            initialDelaySeconds: 5
            periodSeconds: 10
            timeoutSeconds: 3
            failureThreshold: 3
          envFrom:
            - secretRef:
                name: app-api-secrets
          env:
            - name: NODE_ENV
              value: "production"
---
apiVersion: v1
kind: Service
metadata:
  name: app-api
  namespace: production
spec:
  selector:
    app: app-api
  ports:
    - port: 80
      targetPort: http
      protocol: TCP
  type: ClusterIP
```

---

## Checklist de validación

- [ ] `maxUnavailable: 0` para zero-downtime
- [ ] `runAsNonRoot: true` con UID definido
- [ ] Liveness y readiness probes en `/health`
- [ ] Resources requests/limits definidos
- [ ] Secretos vía `secretRef` (nunca en env plano)
- [ ] Imagen etiquetada con `${COMMIT_SHA}` inmutable
