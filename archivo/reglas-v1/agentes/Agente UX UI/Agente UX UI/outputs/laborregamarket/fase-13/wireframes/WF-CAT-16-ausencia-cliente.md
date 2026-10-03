> **Pantalla:** Cliente / POS — **sin pantallas nuevas**
> **Objetivo Principal:** Confirmar ausencia de ocultos en superficies existentes

```text
NO hay layout F13 para /explorar, mapa, reseñas, WhatsApp ni /fruteria.
Criterio visual: el SKU oculto no aparece en:
  - cards explorar / preview in-card
  - grupos de sección en /fruteria/[id] (vitrina SIN existencias F12 intacta)
  - grid POS (salvo líneas libres ADR-013)
Carrito stale: banner 409 «Producto no disponible» (patrón F5) + retirar línea.
```

#### Componentes:
* Reusar ErrorBanner F5 / ticket POS. **Cero** componentes nuevos Must en cliente.

## Inputs Utilizados

- **UF:** `UF-CAT-16`

## Outputs Generados

- **Archivo:** `fase-13/wireframes/WF-CAT-16-ausencia-cliente.md`
