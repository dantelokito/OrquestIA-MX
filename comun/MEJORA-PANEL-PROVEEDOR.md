# Documento de Mejora — Panel Proveedor LaBorregaMarket

> **Tipo:** Diagnóstico de orquestación (no es entregable de fase)
> **Fecha:** 17/09/2026
> **Autor:** Orquestador OrquestIA-MX
> **Versión de la app analizada:** 0.13.0 (Fase 13 cerrada documentalmente 16/09)
> **Alcance de análisis:** módulos del usuario `PROVIDER` en `<APP_REPO>`
> **Downstream:** Discovery del Product Manager → UX/UI + Arquitecto
> **⚠️ NOTA DE PRIVACIDAD:** Este documento contiene información técnica interna. Se recomienda mantenerlo privado o usar solo en contexto de equipo autorizado.

---

## 0. Naturaleza y límites de este documento

Este documento **no promueve fase ni sustituye el Discovery del PM**. Es un diagnóstico de orquestación que vive junto a [`PROCESO.md`](./PROCESO.md) y cumple una función concreta: entregar al PM candidatos priorizados para una futura fase con impacto directo en UX del proveedor.

| Declaración | Estado |
|---|---|
| Abre `fase-14/` | **No.** El `STATUS.md` del PM declara explícitamente «No abrir fase 14» |
| Modifica los siete `STATUS.md` | **No** |
| Modifica el repo de la app (`<APP_REPO>`) | **No.** Ni código, ni migraciones, ni PR |
| Emite User Stories con Given-When-Then | **No.** Es responsabilidad del PM en su Discovery |
| Asigna IDs `BL-*` nuevos | **Sí**, desde `BL-230` (el último usado en el backlog es `BL-224`) |
| Reabre fases cerradas (F6–F13) | **No.** Las referencias a fases previas son solo lectura |

Los IDs `BL-230`+ propuestos aquí son **candidatos**. Solo el PM los promueve a Must/Should/Could en un PRD de fase.

---

## Inputs Utilizados

**Repo de la app** (`<APP_REPO>`, rama correspondiente):

- `PRODUCT.md` — visión de producto v0.13.0, roadmap F1–F14
- `prisma/schema.prisma` — contrato de datos
- `src/app/proveedor/**` — rutas del panel
- `src/components/provider/**`, `src/components/inventory/**`, `src/components/pos/**`
- `src/app/api/provider/**` — rutas de API del proveedor
- `src/lib/services/**` — servicios de negocio
- `src/lib/validators/**` — validadores
- `package.json` — dependencias

**Repo de orquestación** (este workspace):

- [`comun/PROCESO.md`](./PROCESO.md) — cadena canónica
- `Administrador de producto/Product Manager/outputs/laborregamarket/STATUS.md` — fase activa
- `Administrador de producto/Product Manager/outputs/laborregamarket/comun/backlog.md` — backlog MoSCoW
- Reglas de validación cruzada y control

---

## 1. Hallazgos estructurales principales

### Responsabilidad de la pestaña Catálogo

Actualmente acumula cuatro responsabilidades distintas:

1. **Identidad visual** (logo, portada, colores)
2. **Catálogo real** (secciones, productos, precios)
3. **Configuración de operación** (Google Maps, horarios)
4. **Configuración del negocio** (datos generales)

La reorganización propuesta separa estas responsabilidades en:
- **Catálogo:** Solo productos, secciones y precios
- **Perfil:** Identidad visual, Google Maps, datos y operación
- **POS:** Venta + configuración de imágenes

### Integridad de datos de inventario

Hallazgos críticos:

- **Ledger incompleto:** Las salidas (ventas POS, entregas de pedidos) mutan `on_hand` sin registro auditable
- **Descartes sin traza:** Cambios de unidad ponen `onHand: 0` sin dejar evidencia
- **Cancelaciones no reversibles:** Cancelar un pedido ya entregado no restaura `on_hand`
- **Sin concurrencia segura:** `increment`/`decrement` sin bloqueo de fila ni versionado optimista

### Capacidades de negocio no expuestas

Cinco campos ya aceptados por la API pero sin interfaz en la UI:

- `openingHours` — Horarios de atención
- `whatsappEnabled` — Notificaciones por WhatsApp
- `acceptsCardAtStore` — Acepta tarjeta
- `offersWholesale` — Venta mayorista
- `offersRetail` — Venta menudeo

### Datos del negocio inmutables

Campos (`businessName`, `address`, `city`, `latitude`, `longitude`, `phone`, `description`) solo se escriben durante onboarding. No hay UI para editarlos después.

---

## 2. Propuesta de reorganización

**Nueva estructura de navegación:**

| Pestaña | Cambio | Responsabilidad |
|---|---|---|
| Inventario | Gana sub-pestaña «Movimientos» | Existencias + movimientos completos |
| Catálogo | Se reduce | Solo productos, secciones, precios |
| POS | Recibe toggle de imágenes | Venta + su configuración |
| Órdenes | Sin cambio | Pedidos |
| Ventas | Sin cambio | KPIs |
| **Perfil** | **Nueva** | Identidad visual + Google + datos |
| Reportes generales | Muestra gráficas | Consolidado multi-sucursal |

---

## 3. Módulos nuevos propuestos

### Kardex completo (CRÍTICO)

Tabla `InventoryMovement` que registra **toda** mutación de `on_hand`:

- Entrada de almacén
- Venta POS
- Entrega de pedido
- Merma o baja
- Ajuste por conteo físico
- Descarte por cambio de unidad
- Devolución o cancelación

### Costos y margen

Capturar costo unitario en movimientos de entrada → habilita costo de ventas, margen bruto y valor de inventario.

### Corte de caja y turno

Apertura, fondo, arqueo y cierre con diferencia. Requiere equipo/cajeros.

### Equipo y cajeros

Invitar empleados, asignar rol, registrar quién hace cada movimiento.

### Caducidad y lotes

Fechas de vencimiento y rotación FIFO. Depende del kardex.

### Directorio de clientes

Clientes de mostrador con histórico de compras. Base para crédito.

### Alertas accionables

Notificaciones de stock bajo vía email/WhatsApp (sin dependencias de otros módulos).

---

## 4. Candidatos priorizados

**Bloque 1 — Reorganización del panel (Frontend puro):**
- BL-230 a BL-235: Pestaña Perfil, horarios, capacidades

**Bloque 2 — Kardex (Habilitador estructural):**
- BL-236 a BL-243: Modelo, registros de movimiento, atomicidad

**Bloque 3 — Gráficas y reportes:**
- BL-244 a BL-250: Dashboard, visualizaciones, series

**Bloque 4 — Costos:**
- BL-251 a BL-253: Costo unitario, margen, merma valorizada

**Bloque 5 — Operación del mostrador:**
- BL-254 a BL-260: Equipo, corte de caja, caducidad

---

## 5. Decisiones abiertas para el Product Manager

| # | Decisión | Impacta |
|---|---|---|
| 1 | Política de inventario blando vs restricciones en merma | BL-236, BL-237 |
| 2 | Motivo de merma: enum, texto libre, o ambos | BL-237 |
| 3 | Método de valuación de costo (promedio/últimas entradas/estándar) | BL-251 |
| 4 | Cambiar coordenadas ¿re-verifica el negocio? | BL-233 |
| 5 | Librería de gráficas o SVG propio | BL-245 |
| 6 | Alcance del rol cajero | BL-254 |
| 7 | Disponible = `on_hand - reserved` | BL-262 |
| 8 | Orden y nombre de pestañas | UX |

---

## 6. Riesgos

| Riesgo | Mitigación |
|---|---|
| Migración de datos históricos sin `createdByUserId` | Documentar en ADR; admitir nulos |
| Instrumentar salidas rompe transacciones existentes | Escribir dentro de la transacción |
| Reorganización de pestañas rompe tests E2E | Inventariar selectores antes de mover |
| Alcance total intenta hacerse en una fase | Respetar secuencia por bloques |

---

## Outputs Generados

- **Archivo:** `comun/MEJORA-PANEL-PROVEEDOR.md`
- **Tipo:** Diagnóstico de orquestación (interno, no es entregable de fase)
- **Downstream:** Product Manager → UX/UI + Arquitecto
- **Contenido esperado del PM:** PRD con alcance, User Stories, criterios de aceptación

**⚠️ RECOMENDACIÓN:** Mantener este documento en repositorio privado o compartir solo con equipo autorizado. Contiene información de arquitectura interna del proyecto.
