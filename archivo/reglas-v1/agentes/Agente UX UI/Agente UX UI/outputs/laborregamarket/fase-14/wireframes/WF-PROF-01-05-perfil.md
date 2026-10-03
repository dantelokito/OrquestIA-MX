> **Pantalla:** SubNav + `/proveedor/perfil` (identidad, Google, datos, horarios, capacidades)
> **Objetivo Principal:** Configurar la frutería activa sin mezclarlo con el catálogo
> **Flujos:** UF-PROF-01 … UF-PROF-05

```text
SUBNAV (>=1024px)
+----------------------------------------------------------------------------------+
| Inventario | Catálogo | POS | Órdenes | Ventas | Reportes generales* | [Store] Perfil |
+----------------------------------------------------------------------------------+
* Reportes generales solo N>1. Perfil SIEMPRE último (extremo derecho).
  Móvil <640px: misma fila, overflow-x-auto, min-h-11 por tab.

PERFIL — SUCCESS (GET me 2xx)
+----------------------------------------------------------------------------------+
| [ActiveStoreEyebrow] Esta frutería: El Paraíso Centro                            |
| # Perfil                                                                         |
|   Identidad, Maps, datos y operación de esta sucursal.                           |
+----------------------------------------------------------------------------------+
| BLOQUE 1 · Identidad visual                          CTA: [ Guardar colores ]    |
|  [Logo 96px]  [Subir logo]     [Portada 2:1]  [Subir portada]                    |
|  BrandColorPicker (primario / secundario + ContrastHint F5)                      |
+----------------------------------------------------------------------------------+
| BLOQUE 2 · Google Maps                               CTA: [ Guardar Google ]     |
|  EDITABLE (isVerified): Place ID, URL Maps, switch Mostrar reseñas               |
|  LOCKED (no verificado): banner + candado; inputs disabled; copy verificación    |
+----------------------------------------------------------------------------------+
| BLOQUE 3 · Datos del negocio                         CTA: [ Guardar datos ]      |
|  Nombre*  Dirección*  Ciudad*  Teléfono*                                         |
|  Descripción (textarea)                                                          |
|  Latitud*  Longitud*   hint AMM; «el sello verificado no se quita»               |
+----------------------------------------------------------------------------------+
| BLOQUE 4 · Horarios                                  CTA: [ Guardar horarios ]   |
|  Lun … Dom | [Cerrado switch] | open HH:mm | close HH:mm                         |
|  Preview HoursTable «Así lo ve el cliente»                                       |
+----------------------------------------------------------------------------------+
| BLOQUE 5 · Capacidades y operación                   CTA: [ Guardar capacidades ]|
|  WhatsApp | Tarjeta en tienda | Mayoreo | Menudeo   (switch + ayuda)             |
|  Prep 5–120 min | Entrega a domicilio                                            |
+----------------------------------------------------------------------------------+
```

Móvil `<640px`: una columna; CTAs `w-full min-h-11`; logo sobre portada; time inputs apilados. Desktop `>=1024px`: `max-w-7xl`; identidad logo|portada en 2 columnas.

Anclas: `#identidad` `#google` `#datos` `#horarios` `#capacidades`.

#### Cuatro estados (página y bloques)

| Estado | UI |
|--------|-----|
| **Loading** | Skeletons 5 cards `h-40 animate-pulse bg-gray-200`, `aria-busy`. Sin paleta inventada. |
| **Empty** | Logo/portada: placeholder F10 + «Aún no subes…». Horarios: 7 filas vacías + «Horario no publicado en Explorar hasta que guardes». Place ID vacío (verificado): campos listos, no error. |
| **Error** | GET me: `EmptyState` CircleAlert «No pudimos cargar el perfil» + **Reintentar**. Validación: `border-red-500` + texto `text-red-600` inline (coords AMM, prep, Google URL). 403 Google locked: banner, no toast único. |
| **Success** | Valores persistidos; toast «Guardado»; preview colores/horario. |

#### Google locked vs editable

```text
LOCKED
+------------------------------------------+
| [Lock] Maps y reseñas requieren          |
| verificación a la borrega.               |
| Place ID     [##########] disabled       |
| URL Maps     [##########] disabled       |
| Reseñas      switch disabled aria-disabled
+------------------------------------------+

EDITABLE
+------------------------------------------+
| Place ID *   [ ChIJ…                 ]   |
| URL Maps     [ https://maps.app.goo… ]   |
| [Abrir en Google Maps]  (secondary, si URL válida)
| Mostrar reseñas  [switch]                |
| [ Guardar Google ]                       |
+------------------------------------------+
```

#### Horarios (fila)

| Día | Cerrado | Apertura | Cierre |
|-----|---------|----------|--------|
| Lunes | switch | `time` | `time` |
| … | | | |
| Domingo | switch | `time` | `time` |

`open >= close` → mensaje en la fila: «La apertura debe ser antes del cierre».

#### Componentes Requeridos para Frontend:

* **ProfileNavItem:** tab último; `Store` 16px; `aria-current` en `/proveedor/perfil`.
* **ProfilePageClient:** un fetch me compartido; pasa props a bloques (D-F14-19).
* **ProfileIdentityBlock:** `MediaUpload` logo/cover + `BrandColorPicker`.
* **ProfileGoogleBlock:** lock vs edit; `VerificationRequiredBanner`.
* **ProfileBusinessForm:** campos + errores inline AMM.
* **OpeningHoursEditor:** 7 días; preview `HoursTable`.
* **ProfileCapabilitiesForm:** switches + prep + delivery.
* **CTA:** un primary por bloque (`variant=primary`); resto ghost/secondary.
* Focus: `ring-2 ring-[var(--brand)]`. Hover primary: `--brand-dark`. Disabled: `opacity-60`.
* Contraste: texto `slate-900` sobre blanco ≥4.5:1; CTA texto blanco sobre `--brand` ≥4.5:1.

## Inputs Utilizados

- **UF:** `UF-PROF-01` … `UF-PROF-05`
- **QG UX:** Perfil 5 bloques, Google lock, 4 estados, ≥44px

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/wireframes/WF-PROF-01-05-perfil.md`
- **Agente Downstream:** Frontend Developer
