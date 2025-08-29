import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import xss from 'xss';

@Injectable()
export class SanitizeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();

    // Función recursiva para sanitizar cualquier objeto o array
    const sanitizeObject = (obj: any): any => {
      if (typeof obj === 'string') {
        return xss(obj);
      } else if (Array.isArray(obj)) {
        return obj.map(sanitizeObject);
      } else if (obj !== null && typeof obj === 'object') {
        for (const key in obj) {
          obj[key] = sanitizeObject(obj[key]);
        }
        return obj;
      }
      return obj;
    };

    // Sanitizar body
    if (req.body) {
      sanitizeObject(req.body);
    }

    // Sanitizar query sin reasignar el objeto completo
    if (req.query) {
      sanitizeObject(req.query);
    }

    return next.handle();
  }
}
