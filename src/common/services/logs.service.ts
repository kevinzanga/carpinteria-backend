import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LogsService {
  private logger: winston.Logger;

  constructor() {
    this.initLogger();
  }

  private initLogger() {
    const now = new Date();
    const yearMonth = now.toISOString().slice(0, 7); // "2025-08"
    const day = now.toISOString().slice(8, 10);      // "27"

    const logDir = path.join(process.cwd(), 'Logs/Users', yearMonth);
    const logFile = path.join(logDir, `${yearMonth}-${day}.log`);

    // Crear carpeta si no existe
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    // Si el logger ya existía, no lo recreamos
    if (!this.logger) {
      this.logger = winston.createLogger({
        level: 'info',
        format: winston.format.combine(
          winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          winston.format.printf(
            ({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}] ${message}`
          )
        ),
        transports: [
          new winston.transports.File({ filename: logFile, options: { flags: 'a' } }),
          //new winston.transports.Console(),
        ],
      });
    }
  }

  logLoginExito(user: any, ip: string, location: string) {
    this.logger.info(
      `\nTIPO: LOGIN_EXITO\nDESCRIPCION: Login exitoso usuario ${user.name}\nUSUARIO: (ID: ${user.id})\nIP ORIGEN: ${ip}\nUBICACION: ${location}\n-----------------------------------------------------------------------`
    );
  }

  logAccesoDenegado(email: string, ip: string, location: string) {
    this.logger.warn(
      `\nTIPO: ACCESO_DENEGADO\nDESCRIPCION: Credenciales inválidas\nUSUARIO: ${email}\nIP ORIGEN: ${ip}\nUBICACION: ${location}\n-----------------------------------------------------------------------`
    );
  }

  logLogout(user: any, ip: string, location: string) {
    this.logger.info(
      `\nTIPO: LOGOUT\nDESCRIPCION: Logout exitoso\nUSUARIO: (ID: ${user.id})\nIP ORIGEN: ${ip}\nUBICACION: ${location}\n-----------------------------------------------------------------------`
    );
  }

  logRegistro(user: any) {
    this.logger.info(
      `\nTIPO: REGISTER\nDESCRIPCION: Usuario registrado con éxito\nUSUARIO:(ID: ${user.id})\n-----------------------------------------------------------------------`
    );
  }
}
