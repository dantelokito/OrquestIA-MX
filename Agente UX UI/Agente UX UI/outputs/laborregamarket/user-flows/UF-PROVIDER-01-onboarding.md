> **Flujo:** Onboarding proveedor — wizard post-registro
> **Historia de Usuario Asociada:** US-AUTH-04 (BL-002, BL-003)
>
> **Punto de entrada:** Registro PROVIDER paso 1 exitoso → paso 2; o `/proveedor` sin entidad `Provider` → CTA wizard
>
> **Pasos del Usuario:**
> 1. `[Trigger A: registro]` → Tras crear cuenta PROVIDER, redirect automático a paso 2 wizard (no a `/proveedor` vacío).
> 2. `[Trigger B: panel vacío]` → Usuario PROVIDER sin `Provider` en `/proveedor` → EmptyState + CTA "Completar registro de negocio".
> 3. `[Pantalla: wizard paso 2]` → Completa nombre negocio, dirección, ciudad, teléfono, ubicación en mapa.
> 4. `[Condicional]` → ¿Datos válidos?
>    - **No:** → errores inline (dirección requerida, coords fuera de Monterrey).
>    - **Sí:** → `POST` crea entidad `Provider` vinculada al User → redirect `/proveedor`.
> 5. `[Pantalla: /proveedor]` → Panel catálogo con negocio configurado.
>
> **Reglas UI:**
> - No permitir acceso funcional al catálogo sin `Provider` creado.
> - Wizard reutiliza layout de `WF-registro.md` paso 2.
> - CTA dominante: "Finalizar registro".
