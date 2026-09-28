# API-SEED-11 — Datos demo El Paraíso ×2 / Campo Verde ×1

> **Endpoint:** no hay API de seed. Contrato de **datos** para `prisma/seed.ts`  
> **Módulo:** `SEED`  
> **Versión:** 0.11.0  
> **Fecha:** 12/09/2026  
> **US:** US-SEED-01  
> **Autenticación:** N/A

## Inputs Utilizados

- PM `fase-11/seed-demo.md`

---

## Cuentas (password `Demo1234!`)

| Email | Rol | N | Must F11 |
|-------|-----|---|----------|
| `admin@laborregamarket.mx` | ADMIN | 0 | Sin cambio |
| `frutas@elparaiso.mx` | PROVIDER | **2** | Segunda sucursal nueva |
| `verduras@campoverde.mx` | PROVIDER | **1** | Ya existe; no recrear |
| `cliente@demo.mx` | CLIENT | 0 | Sin cambio |

## El Paraíso — sucursal 2

| Campo | Valor |
|-------|--------|
| `businessName` | El Paraíso Tecnológico |
| Dirección | Av. Eugenio Garza Sada 2501, Tecnológico, Monterrey |
| Geo | Distinta al Centro (Constitución 1200). Sugerido: lat `25.6514`, lng `-100.2895` (ITESM Mty) si el seed Centro no choca |
| Catálogo / secciones / pedidos | Propios; no clonar IDs de Centro |

Tras seed, `COUNT(*)` de providers de `frutas@elparaiso.mx` = 2. Campo Verde = 1.

FE: `DemoAccountsBlock` debe mostrar Campo Verde (fuera de API; higiene `NODE_ENV=production` F10 intacta).

Sin Cloudinary. Media demo si existe: disco F10 por `providerId`.

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-11/api/API-SEED-11.md`
- **Agente Downstream:** Backend (seed)
