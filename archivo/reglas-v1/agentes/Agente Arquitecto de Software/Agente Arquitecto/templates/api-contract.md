> **Endpoint:** `[MÉTODO HTTP]` `/api/v1/[recurso]`  
> **Descripción:** [Propósito del endpoint]  
> **Autenticación:** [Requerida / Pública] -> Header: `Authorization: Bearer <token>`  
>  
> #### Body de Solicitud (Request Payload):
> ```json
> {
>   "campo_1": "string (requerido)",
>   "campo_2": 0
> }
> ```
>  
> #### Respuestas del Servidor:
> * **200 / 201 Success:**
> ```json
> {
>   "success": true,
>   "data": {
>     "id": "uuid-v4",
>     "created_at": "ISO-8601 Timestamp"
>   }
> }
> ```
> * **400 Bad Request:** Datos inválidos o faltantes.
> * **401 Unauthorized:** Token no provisto o expirado.
> * **500 Internal Error:** Error interno del servidor.
