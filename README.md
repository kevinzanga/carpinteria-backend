# 🛠️ Sistema de Gestión de Carpintería

Este proyecto es un backend desarrollado con **NestJS** y **MySQL**, para gestionar órdenes de trabajo, clientes, productos y usuarios en una carpintería.

---

## 🚀 Tecnologías utilizadas

- **NestJS** (Node.js framework)
- **TypeORM** para ORM con MySQL
- **MySQL** como base de datos
- **JWT** para autenticación
- **class-validator** para validación de datos
- **Winston** para logging
- **Helmet** para seguridad HTTP
- **Express Rate Limit** para protección contra fuerza bruta

---

## ⚡ Instalación
1. Clonar el repositorio:

    ```bash
    git clone <repo_url>
    cd <repo_folder>
    
2. Instalar dependencias:
    npm install
3. Crear en Xampp una base de datos en blanco
    carpinteria
4. Configurar variables de entorno: 

            DB_HOST=localhost           # Host de la base de datos
            DB_PORT=3306                # Puerto de la base de datos
            DB_USERNAME=root            # Usuario de la base de datos
            DB_PASSWORD=tu_password     # Contraseña de la base de datos (NO usar la real)
            DB_DATABASE=carpinteria     # Nombre de la base de datos
            JWT_SECRET=tu_jwt_secret    # Clave secreta para JWT
            JWT_EXPIRATION=3600s        # Tiempo de expiración del token

5. Levantar la aplicación:
      npm run start:dev

La API estará disponible en: http://localhost:3000
