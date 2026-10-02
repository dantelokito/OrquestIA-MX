# Nota — LAN móvil y smoke AUTH (Fase 7)

> **Fecha:** 24/08/2026  
> **Agente:** Product Manager  
> **No es Must de producto.** Impedimento de **entorno local** para probar Explorar y `US-AUTH-09` en un teléfono. Staging/prod HTTPS sigue siendo el AC de AUTH-09.

## BUG-012 (layout)

Inspección del código en `LaBorregaMarket` (24/08): `FilterBar` está **fuera** de `.explore-main-scroll` (`ExplorePageClient.tsx`, chrome `shrink-0`). El `sticky top-[80px]` del reporte QA **ya no está** en `FilterBar.tsx`. El colapso al scroll (BUG-013) está implementado (`useFilterBarCollapse`).

**Pendiente:** QA re-ejecuta `EC-GEO-18` (y `EC-GEO-17`) y actualiza [BUG-012.md](../../../../../QA%20Automation%20Engineer/Agente%20Tester/outputs/laborregamarket/fase-7/bug-reports/BUG-012.md). Hasta esa re-firma, el dictamen QA del 24/08 sigue **BLOQUEADO** en papel.

## Conexión local desde el móvil

`http://localhost:8080` **en el teléfono es el teléfono**, no el PC. Playwright/QA en el PC no cubren LAN.

### URLs (esta máquina, 24/08)

| Desde | URL |
|-------|-----|
| PC (mismo host) | `http://localhost:8080` |
| Teléfono (mismo Wi-Fi) | `http://192.168.1.8:8080` |
| Explorar | `http://192.168.1.8:8080/explorar` |
| Login | `http://192.168.1.8:8080/login` |

Si cambia el router, volver a `ipconfig` / `Get-NetIPAddress` y, si Next 15 bloquea el Host, añadir la IP a `allowedDevOrigins` en `LaBorregaMarket/next.config.ts` (hoy incluye `192.168.1.8`, `192.168.1.15`, `localhost`).

### Cómo levantar

En el repo de la app:

```bash
npm run dev:lan
```

Equivale a `next dev -p 8080 -H 0.0.0.0`. Producción local: `npm run start:lan`.

### Checklist si el teléfono no abre

1. Mismo SSID; no datos móviles. AP isolation del router apagado.
2. App escuchando `0.0.0.0:8080` (`dev:lan`), no solo `127.0.0.1`.
3. Firewall Windows: permitir TCP **8080** en red privada.
4. iOS: aceptar permiso de **red local**.
5. Si HTML carga y API da 400 Invalid host → `allowedDevOrigins`.
6. Login: usar **siempre la IP**. Cookie de `localhost` no vale en `192.168.1.8`. En local HTTP, ADR-025: `Secure=false`. Si `NODE_ENV=production` en el PC, la cookie **no** se guarda en HTTP.

## Smoke EC-AUTH-09 (humano, dispositivo real)

No sustituye staging HTTPS. Puente para F7:

1. `npm run dev:lan` en el PC; `NODE_ENV` **no** production.
2. En el teléfono: `http://192.168.1.8:8080/login` (ajustar IP si cambió).
3. Credenciales seed de QA (no prod).
4. **Pass:** entra a cuenta; `GET /api/auth/session` autenticado; `/explorar` usable.
5. **Fail red:** timeout / no carga → checklist LAN.
6. **Fail sesión:** carga login pero no persiste → `SessionPersistBanner` / cookies / Secure. Eso **sí** es US-AUTH-09.

Evidencia de este smoke: **pendiente de Dante** (no se puede firmar desde el agente PM sin el teléfono).

## Qué no mezclar

| Síntoma | Dueño |
|---------|--------|
| No carga nada desde el móvil | Entorno LAN (esta nota) |
| Carga y no inicia sesión | AUTH-09 / ADR-025 |
| Carga y filtros se van o layout | BUG-012/013/014 + re-prueba QA |
