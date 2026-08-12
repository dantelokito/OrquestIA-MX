# PRD Corto — LaBorregaMarket

> **Proyecto:** LaBorregaMarket  
> **Fecha:** 05/08/2026  
> **Versión:** 0.1.0 (MVP)  
> **Objetivo del Negocio:** Conectar clientes con fruterías, verdulerías y productores agrícolas locales en Monterrey mediante una experiencia de descubrimiento tipo Airbnb (mapa, tarjetas, contacto directo), con catálogo global comparables y operación segura por roles.  
> **Público Objetivo:** Consumidores locales (CLIENT), dueños de fruterías/verdulerías (PROVIDER) y operadores de plataforma (ADMIN).

---

## Resumen ejecutivo

LaBorregaMarket resuelve la fragmentación del mercado de productos frescos: los clientes no tienen un canal centralizado para explorar negocios cercanos y comparar precios; los proveedores dependen de WhatsApp y boca a boca; el operador carece de herramientas de curación y auditoría.

El diferenciador de producto es el **catálogo global** administrado por la plataforma, donde cada proveedor activa productos, define precio y disponibilidad — habilitando comparabilidad (ej. mismo Mango en distintos negocios).

**Fase PM actual:** documentación completa del módulo `AUTH` y visión global; implementación inmediata del resto según backlog MoSCoW.

---

## Objetivos principales del sistema

1. **Descubrimiento local:** mapa interactivo + tarjetas de fruterías en Monterrey.
2. **Catálogo comparable:** productos globales (frutas, verduras, agrícolas) con precio/disponibilidad por proveedor.
3. **Conexión directa:** contacto al negocio sin intermediarios (teléfono; pedidos en roadmap Fase 2).
4. **Operación de plataforma:** admin cura catálogo, verifica negocios, gestiona permisos y consulta bitácora.
5. **Seguridad por roles:** autenticación JWT y RBAC (`CLIENT`, `PROVIDER`, `ADMIN`).

---

## Perfiles de usuario

### CLIENT — María (cliente final)

- **Perfil:** 32 años, Monterrey. Compra frutas y verduras semanalmente.
- **Necesidad:** Encontrar fruterías cercanas con buen precio y productos frescos.
- **Journey:** Abrir app → explorar mapa → ver detalle de frutería → contactar o pedir.
- **Cuenta demo:** `cliente@demo.mx` / `Demo1234!`

### PROVIDER — Carlos (proveedor PyME)

- **Perfil:** Dueño de "Frutas El Paraíso", frutería en Centro Monterrey.
- **Necesidad:** Visibilidad digital y gestión de catálogo sobre inventario global.
- **Journey:** Registrarse → configurar negocio → activar productos → recibir contactos/pedidos.
- **Cuenta demo:** `frutas@elparaiso.mx` / `Demo1234!`

### ADMIN — Operador de plataforma

- **Perfil:** Equipo interno LaBorregaMarket.
- **Necesidad:** Curar catálogos, verificar proveedores, auditar actividad, gestionar permisos.
- **Journey:** Login admin → revisar catálogos → verificar proveedores → consultar bitácora.
- **Cuenta demo:** `admin@laborregamarket.mx` / `Demo1234!`

---

## Requerimientos funcionales (alto nivel)

| Módulo | Descripción | CLIENT | PROVIDER | ADMIN |
|--------|-------------|--------|----------|-------|
| `AUTH` | Login, registro, logout, sesión | Propio | Propio | CRUD |
| `PERMISSIONS` | Control de acceso por rol/módulo | — | — | CRUD |
| `USERS` | Cuentas de usuario | — | — | CRUD |
| `PROVIDERS` | Fruterías registradas | Ver (explorar) | Propio negocio | CRUD |
| `PRODUCTS` | Catálogo global + ProviderProduct | Ver | Ver + Editar | CRUD |
| `ORDERS` | Historial de pedidos | Ver + Crear* | Ver + Crear* | CRUD |
| `AUDIT` | Bitácora de actividad | — | — | CRUD |
| `EXPLORE` | Mapa + tarjetas tipo Airbnb | Ver | — | — |

\* Pedidos: modelo DB existente; flujo checkout en Fase 2.

### Detalle módulo AUTH (Must MVP)

| RF | Descripción | Estado |
|----|-------------|--------|
| RF-AUTH-01 | Login con email y password | ✅ Implementado |
| RF-AUTH-02 | Registro CLIENT y PROVIDER | ✅ Parcial (PROVIDER sin `Provider`) |
| RF-AUTH-03 | Logout y eliminación de cookie | ✅ Implementado |
| RF-AUTH-04 | JWT en cookie httpOnly (7 días) | ✅ Implementado |
| RF-AUTH-05 | Redirect post-login por rol | ✅ Implementado |
| RF-AUTH-06 | Protección de rutas por middleware | ✅ Páginas; APIs pendientes |
| RF-AUTH-07 | Bitácora LOGIN / LOGOUT / registro | ✅ Implementado |
| RF-AUTH-08 | Recuperación de contraseña | 🔲 Won't Fase 1 |
| RF-AUTH-09 | OAuth / SSO | 🔲 Won't Fase 1 |

---

## Requerimientos no funcionales

| Categoría | Requerimiento | Notas para Arquitecto |
|-----------|---------------|----------------------|
| **Seguridad** | JWT httpOnly, bcrypt, `secure` en producción, sameSite lax | Mensajes login genéricos (no revelar si email existe) |
| **Seguridad** | RBAC en DB + middleware por prefijos de ruta | APIs requieren guards en handlers |
| **Rendimiento** | Listado proveedores con filtros `city` y `q` | Explorar objetivo < 2s en 4G |
| **Disponibilidad** | PostgreSQL 15+, Node 20+ | Seed reproducible (`prisma/seed.ts`) |
| **Accesibilidad** | Formularios login/registro WCAG 2.1 AA | Handoff a UX/UI |
| **Observabilidad** | Bitácora AUDIT en DB | Sin APM en MVP; roadmap DevOps |
| **Geográfico** | Mercado inicial Monterrey | Coordenadas en entidad `Provider` |
| **Privacidad** | Password nunca en logs ni respuestas API | Hash bcrypt en DB |

---

#### 1. Alcance (MVP)

* **Incluido (Fase 1 — cerrar MVP):**
  - Landing, explorar (UI), auth JWT + roles
  - Catálogo global (15 productos) + panel proveedor activar/desactivar
  - Admin catálogos (read-only JSON)
  - API proveedores con filtros
  - Bitácora parcial (login, logout, registro, productos)
  - **Pendiente crítico:** conectar `/explorar` a API, detalle `/fruteria/[id]`, onboarding proveedor completo, área `/cuenta` cliente
  - **Esta fase PM:** documentación AUTH con historias y criterios de aceptación

* **Fuera de Alcance (Fase 1):**
  - Checkout y pagos en línea
  - Notificaciones WhatsApp/email
  - Reseñas y ratings reales
  - Upload de imágenes (Cloudinary/S3)
  - OAuth, 2FA, recuperación de password
  - App móvil nativa / PWA optimizada
  - Dashboard analytics admin

---

#### 2. Módulos Principales

1. **`AUTH`:** Autenticación JWT, registro por rol, logout, sesión en cookie httpOnly, redirects y eventos de auditoría.
2. **`PERMISSIONS`:** Matriz RBAC en DB; middleware y prefijos de ruta por rol (`ADMIN`, `PROVIDER`, `CLIENT`).
3. **`PROVIDERS`:** Negocios (fruterías) con ubicación, verificación y relación 1:1 con `User` PROVIDER.
4. **`PRODUCTS`:** Catálogo global curado por ADMIN; `ProviderProduct` con precio y disponibilidad por negocio.
5. **`EXPLORE`:** Vista split mapa (Leaflet) + tarjetas; descubrimiento público de proveedores.
6. **`ORDERS`:** Modelo de pedidos (Fase 2); sin API pública en v0.1.0.
7. **`AUDIT`:** Bitácora de acciones por módulo para trazabilidad operativa.

---

## Priorización MoSCoW (Fase 1)

| Prioridad | Item |
|-----------|------|
| **Must** | AUTH documentado y validado; fix onboarding Provider |
| **Must** | Conectar explorar → `/api/providers` |
| **Must** | Página detalle frutería `/fruteria/[id]` |
| **Must** | Área cuenta cliente `/cuenta` |
| **Should** | Guards en API routes; Header con sesión y logout |
| **Should** | Unificar validación password (min 8) |
| **Could** | Filtros avanzados backend en explorar |
| **Won't (Fase 1)** | Pedidos checkout, pagos, reseñas, notificaciones |

---

## Métricas de éxito (MVP)

| Métrica | Objetivo MVP |
|---------|--------------|
| Proveedores activos en Monterrey | 10 |
| Conversión explorar → contacto/detalle | > 15% |
| Productos activos por proveedor (media) | > 8 |
| Tiempo onboarding proveedor (registro → primer producto activo) | < 10 min |
| Retención proveedor (actualiza catálogo en 30 días) | > 60% |

---

## Mapa de rutas (referencia)

| Ruta | Acceso | Estado |
|------|--------|--------|
| `/` | Público | ✅ |
| `/explorar` | Público | ✅ (mock data) |
| `/login` | Público | ✅ |
| `/registro` | Público | ✅ |
| `/proveedor` | PROVIDER | ✅ |
| `/admin` | ADMIN | ✅ |
| `/cuenta` | CLIENT | 🔲 |
| `/fruteria/[id]` | Público | 🔲 |

---

## Referencias

| Documento | Ubicación |
|-----------|-----------|
| Visión de producto | `LaBorregaMarket/PRODUCT.md` |
| User stories AUTH | `outputs/laborregamarket/user-stories/` |
| Backlog | `outputs/laborregamarket/backlog.md` |
| Bitácora PM | `outputs/laborregamarket/OBSERVABILITY.md` |
| Handoff UX | `outputs/laborregamarket/handoff-ux-ui.md` |

---

*PRD generado por Agente Product Manager. Actualizar con cada release significativo.*
