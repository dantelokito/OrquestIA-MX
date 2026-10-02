# Política de Seguridad — OrquestIA-MX

## Reporte de Vulnerabilidades

Si descubres una vulnerabilidad de seguridad en este repositorio, **no abras un issue público**. Por favor, reporta la vulnerabilidad de forma responsable siguiendo estos pasos:

### Cómo reportar

1. **Email:** Envía los detalles a través de un email privado (consulta con el mantenedor del proyecto)
2. **Incluye:**
   - Descripción clara de la vulnerabilidad
   - Pasos para reproducirla (si aplica)
   - Posible impacto
   - Tu sugerencia de parche (si tienes una)

3. **Espera:** No publiques la vulnerabilidad hasta que el equipo haya tenido tiempo para responder y lanzar un parche

### Expectativas de respuesta

- Reconoceremos tu reporte en 48 horas
- Trabajaremos en una solución de forma responsable
- Te notificaremos cuando el parche sea lanzado

---

## Prácticas de Seguridad en este Proyecto

### ✅ Lo que hacemos bien

- ✅ Archivos `.env` excluidos del control de versiones
- ✅ Secretos y credenciales no hardcodeadas
- ✅ Archivos multimedia excluidos de contextos de LLM
- ✅ Dependencias en `package.json` (no en `node_modules/`)
- ✅ Documentación sanitizada para uso público

### 🔒 Recomendaciones para colaboradores

1. **Nunca comitees secretos:**
   - API keys, tokens, contraseñas
   - Rutas locales sensibles o información personal
   - Datos de producción o staging

2. **Mantén `.env` local:**
   ```bash
   # Usa .env.example como referencia
   cp .env.example .env
   # Edita .env con tus valores locales (nunca lo comitees)
   ```

3. **Usa archivos `.gitignore` apropiados:**
   - Revisa `.gitignore` antes de hacer commit
   - Añade nuevas rutas sensibles si es necesario

4. **Scan de secretos pre-commit:**
   ```bash
   # Instala git-secrets (opcional pero recomendado)
   npm install --save-dev git-secrets
   ```

5. **Variables de entorno:**
   - Usa `process.env` para valores sensibles
   - Mantén un archivo `.env.example` con valores dummy
   - Nunca comitees `.env` con valores reales

---

## Información Sensible a Proteger

### Nunca comitees:

- Credenciales (API keys, JWT tokens, secretos OAuth)
- Contraseñas o hashes de contraseñas
- URLs de bases de datos con credenciales
- Tokens de GitHub, Docker, AWS, Cloudinary, etc.
- Información personal identificable (PII)
- Rutas locales de máquinas de desarrollo

### Documenta siempre en `.example`:

- Variables de entorno obligatorias
- Formato esperado de secretos
- Ejemplo de configuración

---

## Control de Acceso

### Para ramas protegidas

- `main` y ramas de producción requieren:
  - [ ] Code review de al menos un mantenedor
  - [ ] Todos los checks de CI/CD en verde
  - [ ] Ningún commit directo sin PR

### Para PRs

- Revisa cuidadosamente cualquier cambio en:
  - `.env`, `.env.*`, archivos de secretos
  - Configuración de bases de datos
  - Código de autenticación/autorización
  - Cambios en `.gitignore`

---

## Dependencias y Vulnerabilidades

### Verificación regular

```bash
# Audita dependencias en busca de vulnerabilidades
npm audit

# Actualiza a versiones seguras
npm audit fix
```

### Actualización de dependencias

- Mantén dependencias actualizadas
- Revisa el changelog antes de actualizar
- Ejecuta tests después de actualizar

---

## Logging y Debugging

### Nunca loguees:

- Credenciales o tokens
- Información personal
- Datos sensibles de negocio

### Sí loguea:

- Errores y stack traces genéricos
- Eventos de negocio (sin datos sensibles)
- Información de debugging con contexto

---

## Privacidad de Datos

Este repositorio puede contener:

- Especificaciones técnicas internas
- Arquitectura de proyecto
- Decisiones de diseño

**Recomendación:** Considera mantener este repositorio privado si contiene información sensible del proyecto. Publicarlo debe ser decisión consciente del equipo/organización.

---

## Licencia

Por favor, revisa el archivo `LICENSE` para detalles de uso y distribución del código.

---

**Última actualización:** Octubre 2026

*Esta política se revisa y actualiza regularmente. Para sugerencias o mejoras, contacta al equipo de mantenimiento.*
