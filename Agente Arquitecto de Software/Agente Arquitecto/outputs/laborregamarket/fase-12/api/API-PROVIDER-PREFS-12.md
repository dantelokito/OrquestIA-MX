# API-PROVIDER-PREFS-12 — Preferencia imágenes POS por sucursal

> **Endpoints:** `GET` `/api/provider/me` (delta) · `PATCH` `/api/provider/me` (delta)  
> **Descripción:** Persistencia de `posShowImages` en el `Provider` activo. Default ON. El control UI vive en `/proveedor` (FE); no hay path POS nuevo.  
> **Autenticación:** Requerida PROVIDER + sucursal activa  
> **Versión:** 0.12.0  
> **Fecha:** 2026-09-14  
> **US:** US-POS-12  
> **ADR:** ADR-034, ADR-036  
> **Base:** settings `GET/PATCH /api/provider/me` vigentes F5+ (colores, flags). **No** `/api/v1/`.

## Inputs Utilizados

- D-F12-9; aislamiento F11

---

## GET `/api/provider/me`

Incluir en `data` (junto a campos vigentes):

```json
{
  "id": "clxprovA",
  "businessName": "El Paraíso Centro",
  "posShowImages": true
}
```

Si la columna es nueva, default DB `true`.

---

## PATCH `/api/provider/me`

### Body (delta; otros campos F5 siguen válidos)

```json
{
  "posShowImages": false
}
```

### 200 Success

Mismo recurso `me` actualizado.

### 400

`posShowImages` presente y no boolean.

```json
{
  "error": "Datos inválidos",
  "details": [{ "field": "posShowImages", "message": "Debe ser verdadero o falso" }]
}
```

### 401 / 403 / 500

Igual ISO F11. PATCH de sucursal B (id en body) → **403**. No persistir en `User`.

Fallo al guardar: 500 o 400 de red; FE muestra error recuperable. El servidor **no** “adivina” ON si el PATCH falló.

Miniaturas CAT (`imageUrl` en GET products) **ignoran** este flag.

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-12/api/API-PROVIDER-PREFS-12.md`
- **Agente Downstream:** Backend Developer
