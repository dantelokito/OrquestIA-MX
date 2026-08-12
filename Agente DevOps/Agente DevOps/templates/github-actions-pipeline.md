# Plantilla B: Pipeline CI/CD Estandarizado (GitHub Actions)

> **Proyecto:** `{nombre-proyecto}`  
> **Registry:** `{container-registry}` (ej. ghcr.io, ECR, GCR)

```yaml
name: CI/CD Production Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

permissions:
  contents: read
  packages: write
  security-events: write

jobs:
  test-and-lint:
    name: Test & Static Analysis
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Run Linter
        run: npm run lint

      - name: Run Unit Tests
        run: npm run test:unit

  build-and-scan:
    name: Build & Security Vulnerability Scan
    needs: test-and-lint
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Build Local Image for Vulnerability Scan
        uses: docker/build-push-action@v5
        with:
          context: .
          load: true
          tags: app:${{ github.sha }}

      - name: Run Trivy Vulnerability Scanner
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: 'app:${{ github.sha }}'
          format: 'sarif'
          output: 'trivy-results.sarif'
          severity: 'CRITICAL,HIGH'

      - name: Upload Trivy scan results to GitHub Security tab
        uses: github/codeql-action/upload-sarif@v3
        if: always()
        with:
          sarif_file: 'trivy-results.sarif'

  deploy-staging:
    name: Deploy to Staging Environment
    needs: build-and-scan
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy Orchestration / Helm Trigger
        run: |
          echo "Deploying artifact tagged ${{ github.sha }} to Staging cluster..."
          # Insert deployment triggers (e.g., kubectl apply, Helm upgrade, or ArgoCD sync)

  e2e-tests:
    name: Run E2E Tests on Staging
    needs: deploy-staging
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Run E2E Suite
        run: npm run test:e2e
        env:
          STAGING_URL: ${{ secrets.STAGING_URL }}
```

---

## Checklist de validación

- [ ] Lint y unit tests antes del build
- [ ] Escaneo Trivy con severidad CRITICAL/HIGH bloqueante
- [ ] Imagen etiquetada con `commit_sha`
- [ ] Deploy a staging solo en `main`
- [ ] Trigger E2E post-deploy staging
- [ ] Credenciales vía GitHub Secrets / OIDC (nunca en código)
