# Seed y cuentas demo — Fase 11

> Password de todas las cuentas demo: `Demo1234!`  
> Login: `http://localhost:8080/login`  
> Código seed hoy: `LaBorregaMarket/prisma/seed.ts`

## Cuentas (Must F11 en login)

| Email | Rol | Fruterías | Login demo hoy |
|-------|-----|-----------|----------------|
| `admin@laborregamarket.mx` | ADMIN | — | Sí |
| `frutas@elparaiso.mx` | PROVIDER | **2** (Must F11) | Sí, pero seed vigente crea **1** Provider |
| `verduras@campoverde.mx` | PROVIDER | **1** (Campo Verde actual) | **No** aparece en `DemoAccountsBlock` |
| `cliente@demo.mx` | CLIENT | — | Sí |

Must FE: mostrar Campo Verde en el bloque de cuentas demo (mismo password). Must seed: segundo `Provider` para `frutas@elparaiso.mx`.

## El Paraíso (`frutas@elparaiso.mx`) — N=2

Usuario: Carlos Méndez. Debe ver **switcher** (`US-HEADER-01`) y el **módulo** de reportes globales (`US-DASH-11`).

| # | `businessName` | Dirección (seed) |
|---|----------------|------------------|
| 1 | Frutas El Paraíso | Av. Constitución 1200, Centro, Monterrey (seed vigente) |
| 2 | **El Paraíso Tecnológico** | Av. Eugenio Garza Sada 2501, Tecnológico, Monterrey (coords distintas a Centro) |

Cada sucursal: catálogo, secciones y pedidos **propios**. Explorar muestra **dos** cards.

## Campo Verde (`verduras@campoverde.mx`) — N=1

Usuario: Ana Ruiz. Negocio actual: **Campo Verde Frutería**, Calle Hidalgo 450, San Pedro.  
**No** ve switcher. **No** ve el módulo de reportes globales. Chrome y Reportes F10 **iguales a F10**. Es el control negativo del Must.

El usuario y el `Provider` **ya existen** en seed; F11 no los recrea, solo los expone en login y verifica N=1.

## Admin y cliente

Sin cambio de rol. Admin lista **N filas** de El Paraíso (dos sucursales) más Campo Verde.

## Fuera

No crear un tercer proveedor. No compartir catálogo entre las dos sucursales de El Paraíso. No usar Campo Verde como segunda sucursal de El Paraíso.

## Inputs Utilizados

- **PRD:** `outputs/laborregamarket/fase-11/prd.md`
- Decisión D-F11-5 (nombre 2ª sucursal)

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-11/seed-demo.md`
- **US:** `US-SEED-01`
