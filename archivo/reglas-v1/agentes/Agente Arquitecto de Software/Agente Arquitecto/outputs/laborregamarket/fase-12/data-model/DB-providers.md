# DB-providers — Delta Fase 12 (preferencia imágenes POS)

> **Entidad:** `Provider` (`providers`)  
> **Fecha:** 2026-09-14  
> **Fase:** 12  
> **US:** US-POS-12  
> **ADR:** ADR-036

## Inputs Utilizados

- **PRD:** `fase-12/prd.md` (D-F12-9)
- **Baseline F11 (solo lectura):** `fase-11/data-model/DB-providers.md`

---

## Campo nuevo

| Campo | Tipo de Dato | Restricción | Descripción |
| :--- | :--- | :--- | :--- |
| `posShowImages` | `BOOLEAN` | NOT NULL, DEFAULT `true` | Toggle de fotos en cards POS. Por sucursal. Miniaturas de lista CAT **no** dependen de este flag. |

```prisma
posShowImages Boolean @default(true) @map("pos_show_images")
```

Filas existentes: default DB `true` (ON). Sucursal B nunca tocada = ON.

## Relación

Preferencia **por** `Provider` (sucursal activa), no por `User`. El Paraíso Centro y Tecnológico son independientes.

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-12/data-model/DB-providers.md`
- **Agente Downstream:** Backend Developer
