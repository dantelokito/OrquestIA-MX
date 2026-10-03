# Plantilla A: Dockerfile Multi-Stage de Producción Estandarizado

> **Componente:** `{nombre-servicio}`  
> **Stack:** Node.js 20 Alpine (adaptar según runtime del proyecto)

```dockerfile
# --- Stage 1: Build Stage ---
FROM node:20-alpine AS builder
WORKDIR /app

# Instalar dependencias reutilizando caché de capas
COPY package*.json ./
RUN npm ci --prefer-offline --no-audit

# Copiar código fuente y construir artefacto
COPY . .
RUN npm run build && npm prune --production

# --- Stage 2: Production Stage ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copiar artefactos necesarios desde la etapa de compilación
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Asignar permisos y cambiar a usuario no privilegiado
RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["node", "dist/main.js"]
```

---

## Checklist de validación

- [ ] Multi-stage build (builder + runner)
- [ ] Usuario non-root (`appuser`)
- [ ] HEALTHCHECK apuntando a `/health`
- [ ] Imagen base Alpine o Distroless
- [ ] Sin secretos hardcoded en ENV o COPY
