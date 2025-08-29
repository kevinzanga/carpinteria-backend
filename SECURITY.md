# 🔒 Seguridad del Backend - Sistema de Carpintería

Este documento describe los riesgos, medidas de mitigación y decisiones de seguridad implementadas en el backend del sistema de carpintería.

---

## ⚠️ Identificación de riesgos y amenazas

1. **SQL Injection**: consultas directas a la base de datos podrían ser explotadas → mitigado usando **TypeORM** con queries parametrizadas y repositorios.
2. **XSS (Cross-site scripting)**: entradas de usuario que incluyen HTML o scripts → mitigado con **SanitizeInterceptor** en todos los endpoints.
3. **Fuerza bruta en login**: intentos de login repetidos desde la misma IP → mitigado con **express-rate-limit** (máx. 5 intentos/minuto).
4. **Acceso no autorizado**: usuarios accediendo a rutas críticas sin permisos → mitigado con **JWT + RolesGuard**.
5. **Exposición de información sensible**: contraseñas y datos privados de clientes → mitigado con **bcrypt** y logs controlados.

---

## 🛡️ Medidas de mitigación implementadas

- **Validación de inputs** con **DTOs** (`class-validator`) y transformación automática (`ValidationPipe`).
- **Sanitización de strings** con `xss` para prevenir inyección de scripts.
- **Guardias de roles** (`RolesGuard`) en endpoints críticos.
- **Contraseñas hasheadas** con **bcrypt** antes de guardar en la base de datos.
- **JWT con expiración** configurada en `.env` y verificación en cada request.
- **Cabeceras HTTP seguras** usando **Helmet**.
- **Logging de eventos importantes** (login, logout, registro, acceso denegado) usando **Winston**, con almacenamiento en archivos separados por fecha.

---

## 📌 Justificación de decisiones

- **JWT + RolesGuard**: simplifica la autorización y evita accesos no autorizados a endpoints críticos.
- **SanitizeInterceptor**: centraliza la prevención de XSS sin necesidad de limpiar cada endpoint manualmente.
- **Rate limit en login**: protege contra ataques de fuerza bruta y evita bloqueo masivo de usuarios.
- **Winston logs**: permite auditoría completa sin exponer datos sensibles (solo se registran IDs, emails y eventos).

---

## ⚠️ Limitaciones y posibles mejoras

- No se ha implementado **2FA** para usuarios críticos.
- Logs actualmente se guardan **localmente** → podría mejorarse usando un **servicio centralizado** o base de datos.
- `synchronize: true` en TypeORM solo es seguro para desarrollo; en producción se recomienda usar **migrations**.
- No hay cifrado adicional de datos sensibles de clientes más allá de contraseñas (ej: direcciones, teléfonos).
