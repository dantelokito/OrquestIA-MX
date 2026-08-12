> **Entidad:** `[NombreTabla/Colección]`  
>  
> | Campo | Tipo de Dato | Restricción | Descripción |
> | :--- | :--- | :--- | :--- |
> | `id` | UUID / INT | PRIMARY KEY, NOT NULL | Identificador único |
> | `email` | VARCHAR(255) | UNIQUE, NOT NULL | Correo electrónico |
> | `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Fecha de creación |
