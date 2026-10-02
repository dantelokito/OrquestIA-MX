# Despliegue local — LaBorregaMarket (Windows, puerto 8080)

> Procedimiento reproducible para levantar la app en local de forma **estable** (sesiones largas, acceso PC + celular Safari).

---

## Metadatos

| Campo | Valor |
|-------|-------|
| **Producto** | LaBorregaMarket |
| **Versión** | 0.5.0 (Fase 5) |
| **Repo** | `C:\Users\PC GAMER\LaBorregaMarket` |
| **Remoto** | `https://github.com/dantelokito/BorregaMarket.git` |
| **Puerto** | 8080 |

---

## Regla de versión (obligatoria)

Antes de **cualquier deploy local** o `git push` a BorregaMarket, verificar que coincidan:

| Archivo | Campo |
|---------|--------|
| `package.json` | `"version"` |
| `README.md` | cabecera de versión |
| `PRODUCT.md` | cabecera de versión |
| `OBSERVABILITY.md` | metadatos de versión |

**Versión actual:** `0.5.0` — Fase 5 (Leaflet/OSM, catálogo inhabilitado, marca PROVIDER).

Si `package.json` difiere de la documentación, corregir **antes** de arrancar o publicar.

---

## Dependencias runtime F4/F5

Deben estar en `package.json` (no solo instaladas a mano):

| Paquete | Uso |
|---------|-----|
| `inngest` | Jobs async (`/api/inngest`, contacto, órdenes) |
| `@upstash/redis` | Rate limit contacto (prod); in-memory en local sin keys |
| `pdfkit` | Reportes PDF proveedor |
| `@types/pdfkit` | Tipos (devDependency) |

Instalación con peer deps de Inngest:

```powershell
cd C:\Users\PC GAMER\LaBorregaMarket
npm install
```

El repo incluye `.npmrc` con `legacy-peer-deps=true`.

---

## Checklist pre-arranque

1. PostgreSQL activo en `localhost:5432` (`DATABASE_URL` en `.env`).
2. `npm install`
3. `npx prisma generate`
4. `npx prisma migrate status` → schema al día
5. **`npm run build`** → debe terminar con exit 0 (gate de estabilidad)
6. Opcional: `npm run test` → suite Vitest

---

## Arranque estable (recomendado — sesiones largas)

**No usar `npm run dev` para sesiones >1 h** — el dev server de Next.js puede colgarse (HMR, memoria, múltiples pestañas).

### 1. Liberar puerto 8080 (si hay proceso colgado)

Síntoma: `netstat` muestra `LISTENING` en 8080 pero HTTP hace timeout.

```powershell
$p = (netstat -ano | findstr ":8080" | findstr "LISTENING" | ForEach-Object { ($_ -split '\s+')[-1] } | Select-Object -First 1)
if ($p) { Stop-Process -Id $p -Force }
```

### 2. Build + start producción local

```powershell
cd C:\Users\PC GAMER\LaBorregaMarket
npm run build
npm run start:lan
```

Scripts en `package.json`:

| Script | Comando | Uso |
|--------|---------|-----|
| `start:lan` | `next start -p 8080 -H 0.0.0.0` | **Estable** — PC + red local |
| `start` | `next start -p 8080` | Solo localhost |
| `dev:lan` | `next dev -p 8080 -H 0.0.0.0` | Desarrollo activo (hot reload) |
| `dev` | `next dev -p 8080` | Desarrollo solo localhost |

### 3. Smoke test

```powershell
Invoke-WebRequest http://localhost:8080 -UseBasicParsing
Invoke-WebRequest http://localhost:8080/explorar -UseBasicParsing
Invoke-WebRequest "http://localhost:8080/api/providers?page=1&limit=5" -UseBasicParsing
```

Esperado: **StatusCode 200** en las tres.

---

## Acceso desde celular (Safari)

1. PC y iPhone en la **misma Wi‑Fi**.
2. Obtener IP LAN de la PC:

```powershell
Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -eq 'Wi-Fi' } | Select-Object IPAddress
```

3. Abrir en Safari: `http://<IP>:8080` (ej. `http://192.168.1.14:8080`).
4. **No usar `localhost`** en el celular.
5. Si no carga, abrir firewall (PowerShell **como administrador**):

```powershell
netsh advfirewall firewall add rule name="LaBorregaMarket 8080" dir=in action=allow protocol=TCP localport=8080 profile=private
```

---

## Variables de entorno (local)

Referencia: `.env.example`. Sin keys opcionales → degradación controlada:

| Variable | Sin key en local |
|----------|------------------|
| `RESEND_API_KEY` | Email no-op + AUDIT |
| `UPSTASH_REDIS_*` | Rate limit in-memory |
| `INNGEST_*` | Jobs vía `/api/inngest`; `inngest.send` con try/catch |
| `CLOUDINARY_*` | Upload media falla con error claro |
| `WHATSAPP_*` | WA no-op |

---

## Troubleshooting

| Síntoma | Causa probable | Acción |
|---------|----------------|--------|
| Puerto 8080 LISTENING + HTTP timeout | Proceso Node colgado | Matar PID y reiniciar con `start:lan` |
| Error 500 `Can't resolve 'inngest'` | Dep faltante en `node_modules` | `npm install` |
| Error 500 `@upstash/redis` / `pdfkit` | Dep F4/F5 no instalada | Verificar `package.json` + `npm install` |
| `npm run build` falla Inngest | API v4: `createFunction(opts, handler)` — trigger en `triggers: [{ event }]` | Corregir `src/lib/inngest/functions/*.ts` |
| App cae tras usar contacto/frutería | Compilación lazy de rutas con deps rotas | Pasar `npm run build` antes de arrancar |
| IP celular deja de funcionar | DHCP cambió IP Wi‑Fi | Reconsultar IP con `Get-NetIPAddress` |

---

## Cuentas demo (seed)

| Rol | Email | Password |
|-----|-------|----------|
| CLIENT | `cliente@demo.mx` | `Demo1234!` |
| PROVIDER | `frutas@elparaiso.mx` | `Demo1234!` |
| ADMIN | `admin@laborregamarket.mx` | `Demo1234!` |

```powershell
npm run db:seed
```

---

## API Inngest v4 (referencia)

Formato correcto (2 argumentos):

```ts
inngest.createFunction(
  {
    id: "notify-contact-requested",
    retries: 2,
    triggers: [{ event: "notify/contact.requested" }],
    onFailure: async ({ event }) => { /* ... */ },
  },
  async ({ event }) => { /* handler */ }
);
```

**Incorrecto (v3):** tercer argumento separado `{ event: "..." }`.

---

*LaBorregaMarket v0.5.0 — Agente DevOps / Cloud Engineer.*
