import rateLimit from 'express-rate-limit';

export const loginRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 5,               // máximo 5 requests por IP
  message: 'Demasiadas solicitudes desde esta IP, intenta más tarde',
});
