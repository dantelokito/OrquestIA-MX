# API-AUTH-01 — Nota sesión portable (Fase 7)

> **Endpoints:** `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/session` (existentes)  
> **Módulo:** `AUTH`  
> **Versión:** 0.7.1  
> **Fecha:** 18/08/2026  
> **US:** US-AUTH-09  
> **Base F1:** [`../../fase-1/api/API-AUTH-01.md`](../../fase-1/api/API-AUTH-01.md)  
> **ADR:** [`../../comun/adrs/ADR-025-session-cookie-mobile.md`](../../comun/adrs/ADR-025-session-cookie-mobile.md)  
> **Autenticación:** Login público; session lee cookie

**No hay path nuevo.** Body login/register F1 intacto. Envelope ADR-003.

---

## Cookie (Must)

Tras `POST /api/auth/login` o register: `Set-Cookie` JWT `HttpOnly`, `Path=/`, `SameSite=Lax`. `Secure` **solo** HTTPS (staging/prod, `NODE_ENV=production`). No `Domain` salvo subdominio explícito. **No** JWT en querystring.

FE: same-origin + `credentials: 'include'`. No Bearer Must.

`GET /api/auth/session`: 200 con o sin cookie (F5). Tras login móvil, este GET **no** debe 401 inmediato si la cookie se seteó.

Logout: borra cookie (`Max-Age=0`, mismos Path/SameSite/Secure).

---

## Qué no hacer

- Seed QA en prod.
- Cambiar `JWT_SECRET` aquí (DEV-P1-007 / DevOps).
- `SameSite=None`.
