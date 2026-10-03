> **Componente / Flujo:** [Nombre del flujo técnico]
> 
> ```mermaid
> graph TD
>     Client[Cliente: Web / Mobile] -->|HTTPS / REST| Gateway[API Gateway / Server]
>     Gateway -->|Auth Check| AuthService[Servicio de Autenticación]
>     Gateway -->|CRUD Request| DB[(Base de Datos Principal)]
>     Gateway -->|Event / Job| Queue[Cola de Tareas / Async]
> ```
