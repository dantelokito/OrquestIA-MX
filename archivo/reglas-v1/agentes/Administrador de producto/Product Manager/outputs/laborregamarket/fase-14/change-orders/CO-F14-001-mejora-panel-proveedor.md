# Change Order — Registro de Solicitud de Cambio

> **ID:** CO-F14-001
> **Fecha:** 17/09/2026
> **Proyecto:** LaBorregaMarket
> **Solicitante:** Dante (stakeholder)

#### 1. Descripción del Cambio

Abrir **Fase 14 documental** para diseñar User Stories de **mejoras y deuda del panel PROVIDER**, a partir de `comun/MEJORA-PANEL-PROVEEDOR.md` (raíz del workspace de orquestación). **F13 no se reabre.** QA F13 permanece **APROBADO**. No hay merge de app desde este CO.

| Cambio | US | Efecto |
|--------|-----|--------|
| Pestaña Perfil (logo, portada, colores) | US-PROF-01 | Catálogo deja de ser cajón de identidad |
| Google Maps en Perfil | US-PROF-02 | Gate `isVerified` intacto |
| Datos de negocio editables post-onboarding | US-PROF-03 | Cierra D-10: PATCH acepta nombre/dirección/coords |
| Horarios | US-PROF-04 | UI sobre `openingHours` ya validado |
| Capacidades + prep/delivery | US-PROF-05 | UI sobre campos API existentes |
| Catálogo solo productos; fotos POS en POS | US-CAT-21 | Split de responsabilidades |
| Merma con motivo | US-INV-08 | Ledger **aditivo**; 400 si negativo |
| Ajuste por conteo físico | US-INV-09 | Saldo = conteo ≥ 0 |
| Listado Movimientos | US-INV-10 | Entradas + mermas + ajustes; **sin** ventas |
| Pintar series de reportes generales | US-DASH-14 | Recupera trabajo de backend ya pagado |
| Gráfica unificada en Ventas | US-DASH-15 | Tendencia, mix canal, top |
| PDF `from`/`to` | US-DASH-16 | El corte visible se puede bajar |
| Sin default $50 al activar GLOBAL | US-CAT-22 | Cierra D-24 |
| 409 sección visible | US-CAT-23 | Cierra D-27 |

**Qué no entra (swap explícito vs diagnóstico §7):** kardex completo (`BL-238`, `BL-242`), costos/margen, corte de caja, cajeros, lotes, directorio, crédito, granularidad semanal, comparativa periodo, agrupación por sección, gráficos de margen, Cloudinary, `BL-040`, Explorar rediseño, `US-ADMIN-04`.

**Cierres de decisiones abiertas del diagnóstico:** merma **bloquea** `on_hand` negativo; motivo = enum + nota; **no** reset `isVerified` al mudar coords; librería de gráficas **no** es Must.

#### 2. Evaluación de Impacto

- [x] Arquitectura
- [x] Diseño UI/UX
- [x] Base de datos

**Detalle del impacto:**

- **Arquitectura:** ampliar `patchProviderSettingsSchema` (datos de negocio + geo). Persistencia de merma/ajuste (Arch elige tabla; **no** kardex de POS). PDF de reportes en modo rango. Envelope ADR-003. IDOR F11. ADR-022 intacto **en venta**; nueva regla **estricta** solo en merma/ajuste. Formaliza Arch: riesgo de `isVerified` con pin mudado; Should `SELECT FOR UPDATE`.
- **Diseño UI/UX:** nueva pestaña Perfil; Catálogo más corto; toggle fotos en POS; Inventario gana merma/ajuste/movimientos; Reportes generales y Ventas pintan series; PDF visible. 4 estados. No rediseñar Explorar.
- **Base de datos:** Must de persistir merma y ajuste (migración aditiva). **No** exigir `createdByUserId` en histórico de entradas F13. **No** migrar `inventory_entries` a kardex completo como Must.
- **QA (posterior):** no-regresión F11 aislamiento, F12 POS blando, F13 ocultar/unidad/precio. Este CO **no** pide tests ahora.

#### 3. Matriz de Intercambio (Trade-off)

* **Opción A:** Aumentar el alcance a kardex completo + costos + caja en la misma fase (bloques 2–5 del diagnóstico).
  - Estimación adicional: una fase extra de modelo, instrumentar POS/`DELIVERED`, ADR de valuación y rol cajero.
* **Opción B:** Swap. Construir **solo** la opción A del brief (Perfil + datos editables + UI de campos existentes + gráficas de lo ya calculado + merma **aditiva** + deuda barata). A cambio **no** se construye kardex de ventas, costos, caja, cajeros, lotes ni rediseño Explorar.

#### 4. Decisión

**Opción seleccionada:** B (Must F14 = opción A del brief; merma aditiva, no kardex completo)  
**Aprobado por:** Dante (autorización humana 17/09/2026: abrir F14 **documental**; F13 cerrada; no mergear la app)  
**Fecha de aprobación:** 17/09/2026

**Efecto en decisiones previas:** F13 (`CO-F13-001`) **intacta** — no se reabren US. ADR-022 (venta blanda) **intacto** para POS/Encargar; **no** aplica a merma/ajuste (D-F14-11). `CO-F10-002` disco local **intacto**. `CO-F6-001` / `BL-040` **intactos**. A5 sigue revocada (`CO-F10-001`).
