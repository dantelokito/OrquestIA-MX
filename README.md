# OrquestIA-MX

Este es un repositorio de código para **orquestación de agentes** para desarrollo de proyectos con apoyo de Agentes de IA, basado en Cursor.

## 📋 Descripción

OrquestIA-MX es un framework de orquestación que coordina múltiples agentes de IA especializados (Product Manager, Arquitecto, Frontend, Backend, QA, DevOps, UX/UI) para la ejecución de proyectos de software de manera sistemática.

## 🏗️ Estructura

```
.
├── Administrador de producto/        # Agente Product Manager
├── Agente Arquitecto de Software/    # Agente Arquitecto
├── Agente backend/                   # Agente Backend
├── Agente frontend/                  # Agente Frontend
├── Agente UX UI/                     # Agente UX/UI
├── Agente DevOps/                    # Agente DevOps / Cloud Engineer
├── QA Automation Engineer/           # Agente QA Tester
├── Notas/                            # Documentación interna de reglas y procesos
├── comun/                            # Documentos compartidos de orquestación
│   ├── PROCESO.md                    # Cadena canónica de orquestación
│   └── MEJORA-PANEL-PROVEEDOR.md    # Diagnóstico técnico (interno)
├── .cursor/                          # Configuración global de Cursor
├── .gitignore                        # Exclusiones de versionado
└── README.md                         # Este archivo
```

## 🚀 Cómo empezar

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/dantelokito/OrquestIA-MX.git
   cd OrquestIA-MX
   ```

2. **Configurar el entorno:**
   ```bash
   # Crear archivo de entorno local
   cp .env.example .env
   # Editar con tus valores (nunca commitearlo)
   ```

3. **Actualizar grafo de orquestación (opcional):**
   ```bash
   graphify update .
   ```

## 🤖 Agentes disponibles

- **Product Manager:** Descubrimiento, PRDs, historias de usuario
- **Arquitecto:** Decisiones técnicas, ADRs, contratos de API
- **Frontend:** Componentes, UI, validación de cliente
- **Backend:** Servicios, bases de datos, APIs
- **QA Tester:** Pruebas automatizadas, validación
- **DevOps:** Infraestructura, CI/CD, observabilidad
- **UX/UI:** Diseño de flujos, wireframes, especificaciones visuales

## 📖 Documentación

- [`comun/PROCESO.md`](comun/PROCESO.md) — Cadena canónica de orquestación
- `Administrador de producto/Product Manager/README.md` — Skill del PM
- `Agente Arquitecto de Software/Agente Arquitecto/README.md` — Skill del Arquitecto
- Y más en cada carpeta de agente...

## 🔒 Seguridad

Por favor, revisa [`SECURITY.md`](SECURITY.md) para información sobre:
- Reporte de vulnerabilidades
- Prácticas de seguridad
- Gestión de secretos y credenciales

## 📝 Contribuir

Este repositorio está diseñado para equipos que trabajan con agentes de IA en Cursor. Las contribuciones deben:

1. Seguir la cadena canónica de orquestación
2. Respetar los roles definidos en cada agente
3. Mantener la documentación actualizada
4. No exponer información sensible o credenciales

## ⚠️ Nota de privacidad

Este repositorio contiene información técnica interna del proyecto. Revisa `SECURITY.md` antes de hacerlo público o compartirlo fuera del equipo.

## 📄 Licencia

Ver archivo `LICENSE` para detalles.

## 📧 Contacto

Para preguntas o sugerencias sobre la orquestación, contacta al equipo de mantenimiento.

---

**Última actualización:** Octubre 2026
