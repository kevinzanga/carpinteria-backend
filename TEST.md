# 🧪 Pruebas de Seguridad - Backend Carpintería

Este documento describe pasos manuales para probar las defensas implementadas contra los principales riesgos.

---

## 1️⃣ SQL Injection

**Objetivo:** Evitar que consultas directas puedan ser explotadas.  

**Prueba:**
1. Endpoint: `POST http://localhost:3000/auth/login` o cualquier endpoint que consulte DB.
2. Enviar como email: `' OR 1=1 --` y una contraseña cualquiera.

            {
            "email": "' OR 1=1 --",
            "password": "Encargado123aa"
            }

3. Esperado: No se loguea, devuelve error 400. "email must be an email".


**Resultado esperado:** 
- La aplicación sigue funcionando y ningún usuario no autorizado obtiene acceso.
- Las consultas usan **TypeORM** con parámetros seguros.

---

## 2️⃣ XSS (Cross-site scripting)

**Objetivo:** Evitar ejecución de scripts desde inputs del usuario.  

**Prueba:**
1. Endpoint: `POST http://localhost:3000/products`.
2. Enviar un campo `name` con: `<script>alert('xss')</script>`.

            {
            "name": "<script>alert('xss')</script>",
            "price": 300,
            "description": "Prueba XSS"
            }

3. Esperado: Texto se guarda sanitizado, no se ejecuta script en frontend o logs

            {
                "id": 22,
                "name": "&lt;script&gt;alert('xss')&lt;/script&gt;",
                "price": 300,
                "description": "Prueba XSS"
            }
**Resultado esperado:**
- Los campos con scripts se transforman en texto plano.
- Ningún HTML/JS se ejecuta.

---

## 3️⃣ Fuerza bruta en login

**Objetivo:** Limitar intentos de login repetidos.  

**Prueba:**
1. Endpoint: `POST http://localhost:3000/auth/login`.
2. Realizar más de 5 intentos de login con contraseña incorrecta desde la misma IP en 1 minuto.
3. Esperado: Respuesta con mensaje: `Demasiadas solicitudes desde esta IP, intenta más tarde`.

**Resultado esperado:** 
- La IP queda bloqueada temporalmente.
- Se previenen ataques de fuerza bruta.

---

## 4️⃣ Acceso no autorizado

**Objetivo:** Evitar que usuarios sin permisos accedan a rutas críticas.  

**Prueba:**
1. Endpoint: `POST http://localhost:3000/orders` (solo ENCARGADO permitido).
2. Usuario CARPINTERO intenta crear orden.

           {
            "detail": "desde Carpintero",
            "start_date": "2025-08-26T10:00:00",
            "end_date": "2025-08-31T18:00:00",
            "status": "pending",
            "assigned_to": 7,
            "client": 2,
            "items": []       
            } 
3. Esperado: Error 403 Forbidden.

**Resultado esperado:** 
- Roles se respetan correctamente.
- JWT + RolesGuard funcionan en todos los endpoints críticos.

---

## 5️⃣ Exposición de información sensible

**Objetivo:** Evitar que datos privados sean expuestos.  

**Prueba:**
1. Crear un usuario con password.
2. Revisar en la base de datos la contraseña del usuario aparece encriptada.
3. Intentar ver contraseña de usuarios.

**Resultado esperado:** 
- Password almacenada hasheada (**bcrypt**).
- Información sensible de users no se expone.

---

## ✅ Conclusión

- Todas las pruebas demuestran que las defensas implementadas funcionan correctamente.
- El backend está protegido contra SQL Injection, XSS, fuerza bruta, accesos no autorizados y exposición de datos sensibles.
