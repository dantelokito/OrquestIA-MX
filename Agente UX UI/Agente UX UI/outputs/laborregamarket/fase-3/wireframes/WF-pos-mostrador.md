> **Pantalla:** POS mostrador — layout (`/proveedor/pos`)
> **Objetivo Principal:** Venta en mostrador con split catálogo + ticket
>
> ```text
> +-----------------------------------------------------------------------+
> | [Header PROVIDER]                                                       |
> | [ Catálogo | POS | Órdenes | Dashboard ]  ← SubNavProveedor, POS activo|
> +-----------------------------------------------------------------------+
> |  Punto de venta — Frutas El Paraíso                                     |
> +-----------------------------------------------------------------------+
> |  CATALOGO (58%)              |  TICKET (42%)                          |
> |  ┌──────┐ ┌──────┐ ┌──────┐   |  ┌──────────────────────────────────┐ |
> |  │Mango │ │Aguac.│ │Limón │   |  │ Ticket #—                        │ |
> |  │$45/kg│ │⚡ VR │ │$12/pz│   |  │ (vacío o líneas — WF-pos-ticket) │ |
> |  └──────┘ └──────┘ └──────┘   |  │                                  │ |
> |  ┌──────┐ ┌──────┐ ┌──────┐   |  │ Total: $0.00                     │ |
> |  │ ...  │ │ ...  │ │ ...  │   |  │ [ Cobrar ]                       │ |
> |  └──────┘ └──────┘ └──────┘   |  └──────────────────────────────────┘ |
> |  scroll vertical              |  sticky top; bg slate-100              |
> +-----------------------------------------------------------------------+
> | [MOBILE] Catálogo arriba → ticket sticky bottom con total + Cobrar     |
> +-----------------------------------------------------------------------+
> ```
>
> #### Estados de la pantalla
>
> | Estado | Comportamiento UI |
> |--------|-------------------|
> | **Loading** | Skeleton grid 8 + panel ticket |
> | **Empty catálogo** | EmptyState + link `/proveedor` |
> | **Success** | Split funcional; ver sub-wireframes |
> | **Error red** | ErrorBanner catálogo |
>
> #### Componentes Requeridos para Frontend:
> * **SubNavProveedor:** 4 tabs; POS `aria-current="page"`.
> * **PosSplitLayout:** `lg:flex-row`; catálogo scroll; ticket sticky.
> * **ProductGridCell:** clic → add o panel cantidad (WF-pos-venta-rapida).
>
> #### Responsividad:
> * **Mobile:** `flex-col`; ticket `sticky bottom-0` con shadow-lg.
> * **Tablet:** 50/50 split.
> * **Desktop:** 58/42 según tokens.
>
> #### API esperada:
> * `GET /api/provider/products?active=true`
>
> #### Referencias:
> * Sub-WF: `WF-pos-venta-rapida.md`, `WF-pos-cantidad-unidad.md`, `WF-pos-ticket.md`
> * Flujo: `../user-flows/UF-POS-01-mostrador.md`
