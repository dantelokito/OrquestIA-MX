# API-EXPLORE-11 — Una card por Provider (sin colapsar dueño)

> **Endpoint:** `GET /api/providers` y `GET /api/providers/[id]` (sin path nuevo)  
> **Módulo:** `GEO` / `PROVIDERS`  
> **Versión:** 0.11.0  
> **Fecha:** 12/09/2026  
> **US:** US-EXPLORE-11  
> **Autenticación:** Pública (filtros F9 vigentes)

## Inputs Utilizados

- **US-EXPLORE-11**, contratos GEO F8/F9 (solo lectura)

---

## Decisión

El listing **ya** es una card por fila `Provider`. F11 **prohíbe** agrupar por `userId` o `ownerEmail`. El Paraíso Centro y El Paraíso Tecnológico = dos pines, dos rutas `/fruteria/[id]`, dos fichas.

Filtros F9 (`q`, geo, `offersWholesale`, `offersDelivery`, radio) aplican **por sucursal**.

`POST /api/orders` contra `/fruteria/[id]` usa ese `providerId` (no el activo del dueño). El activo solo afecta el **panel** PROVIDER.

Sin query nueva. Sin seed en este contrato (ver `API-SEED-11.md`).

#### Errores (sin cambio)

400 coords/radio; 404 ficha si el id no existe o negocio inactivo según contrato F1/F9 vigente.

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-11/api/API-EXPLORE-11.md`
- **Agente Downstream:** Backend (no colapsar), Frontend (dos cards)
