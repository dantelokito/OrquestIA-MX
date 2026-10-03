# Handoff de Feature: FEAT-{Feature}

> **Proyecto:** `{nombre-proyecto}`  
> **Feature:** `{Feature}` (ej. AUTH, DASHBOARD, CHECKOUT)  
> **Stack UI:** `{stack-ui}`  
> **Fecha:** `{YYYY-MM-DD}`  
> **Wireframe de referencia:** `WF-{Feature}-*`  
> **Contrato de referencia:** `API-{Module}-*`, `MOD-{Module}-handoff.md`

---

## 1. Pantallas y componentes implementados

| Pantalla / Vista | Wireframe | Ruta | Estado |
|------------------|-----------|------|--------|
| `[NombrePantalla]` | `WF-{Feature}-01` | `/[ruta]` | [ ] OK |

**Componentes reutilizables creados:**

| Componente | Ubicación | Descripción |
|------------|-----------|-------------|
| `[Button]` | `src/components/ui/` | [Descripción] |

---

## 2. Integración API

| Endpoint | Método | Hook / Service | Contrato API | Estado |
|----------|--------|----------------|--------------|--------|
| `/api/v1/[recurso]` | `[GET/POST/...]` | `use[Recurso]` / `[recurso].service.ts` | `API-{Module}-01` | [ ] OK |

- [ ] Cliente HTTP con interceptor `Authorization: Bearer`
- [ ] Refresh token flow en respuesta `401`
- [ ] Sin `fetch` embebido en componentes de vista

---

## 3. Estados UI (4 estados obligatorios)

| Vista | Loading | Empty | Error | Success |
|-------|---------|-------|-------|---------|
| `[NombrePantalla]` | [ ] | [ ] | [ ] | [ ] |

---

## 4. Formularios y validación

| Formulario | Schema (Zod/Yup) | Campos validados | Mensajes inline |
|------------|------------------|------------------|-----------------|
| `[LoginForm]` | `loginSchema` | `[email, password]` | [ ] OK |

---

## 5. Responsive y accesibilidad

- [ ] Breakpoint móvil (`<640px`) verificado
- [ ] Breakpoint escritorio (`>=1024px`) verificado
- [ ] HTML semántico (`<main>`, `<nav>`, `<header>`, etc.)
- [ ] Navegación por teclado (Tab/Enter/Space)
- [ ] `aria-labels` en elementos interactivos sin texto visible
- [ ] Estados hover, focus, active, disabled en componentes interactivos

---

## 6. Pruebas

### Unit / Component tests

- [ ] Renderizado correcto
- [ ] Manejo de props
- [ ] Disparo de eventos (click, input)
- [ ] Renderizado condicional (loading, error, empty)

**Comando:** `[npm test -- tests/unit/[feature].test.tsx]`

### E2E (opcional)

- [ ] Flujo crítico documentado: `[Login -> Dashboard -> Submit]`

**Comando:** `[npx playwright test tests/e2e/[feature].spec.ts]`

---

## 7. Definition of Done (DoD Frontend)

- [ ] **Diseño Pixel-Fidelidad**
- [ ] **Responsive Design**
- [ ] **Manejo de los 4 Estados UI**
- [ ] **Consumo Limpio de APIs**
- [ ] **Validación de Formulario**
- [ ] **Accesibilidad Basal**

---

## 8. Notas para downstream

### QA Tester

- Flujos a probar: `[describir flujos críticos]`
- Datos de prueba: `[usuarios demo, fixtures]`
- Comandos:
  - Dev: `[npm run dev]`
  - Build: `[npm run build]`
  - Tests: `[npm test]`

### DevOps

- Variables requeridas: ver [env-requirements.md](env-requirements.md) del proyecto
- Comandos de despliegue: ver [integration-readme.md](../integration-readme.md)
