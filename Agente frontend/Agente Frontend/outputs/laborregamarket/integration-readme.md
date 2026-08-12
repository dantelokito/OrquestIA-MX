# Integration README — LaBorregaMarket Frontend Fase 2

## Código fuente

La UI vive en el monolito Next.js:

`C:\Users\PC GAMER\LaBorregaMarket`

Este directorio `outputs/laborregamarket/` documenta el handoff del Agente Frontend (no duplica el `src/` completo).

## Stack

- Next.js 15 / React 19 / TypeScript / Tailwind 4
- Zod (validación server + mensajes client)
- Leaflet (mapa explorar / detalle)
- Cloudinary (MEDIA), Resend (NOTIFY email)

## Comandos

```bash
cd "C:\Users\PC GAMER\LaBorregaMarket"
npm install
npm run dev
```

Build: `npm run build`  
Seed DB: `npm run db:seed` (según package.json del repo)

## Variables de entorno

Ver [`.env.example`](./.env.example). Copiar a la raíz de `LaBorregaMarket`.

Críticas Fase 2:

- `RESEND_API_KEY` / `EMAIL_FROM` — sin key el contacto registra AUDIT pero no envía email
- `CLOUDINARY_*` — sin config los uploads MEDIA fallan 500

## Flujos a verificar (QA)

1. **Sprint 0:** mapa móvil en `/explorar`; editar precio en `/proveedor`; login CLIENT → `/`; demos ocultas en production
2. **NOTIFY:** Llamar / WhatsApp en `/fruteria/[id]` abre `tel:`/`wa.me` y muestra toast; rate limit 429 no bloquea llamada
3. **MEDIA:** subir logo/portada en `/proveedor`; imagen producto en admin catálogo Productos; placeholders si falta imagen
4. **EXPLORE:** chips Frutas/Verduras/Agrícola y Verificado actualizan URL y recargan lista/mapa; empty + Limpiar filtros

## Rutas UI tocadas

| Ruta | Cambios |
|------|---------|
| `/explorar` | Filtros API + URL + empty |
| `/fruteria/[id]` | ContactCTA, hero cover/logo, thumbs producto |
| `/proveedor` | MediaUpload logo/cover |
| `/admin` | hasValidEmail, upload producto, filtro audit CONTACT |
| `/login` | (ya OK Sprint 0) |

## Downstream

- **QA:** usar handoffs `FEAT-*-handoff.md` + checklist DoD UX en handoff UX
- **DevOps:** `.env.example` + Cloudinary/Resend en secretos
