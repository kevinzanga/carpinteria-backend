import xss from 'xss';

export function sanitizeInput(value: any): any {
  if (typeof value === 'string') {
    return xss(value.trim()); // limpia HTML/JS y recorta espacios
  }
  if (typeof value === 'object' && value !== null) {
    const sanitized: any = {};
    for (const key of Object.keys(value)) {
      sanitized[key] = sanitizeInput(value[key]);
    }
    return sanitized;
  }
  return value;
}
