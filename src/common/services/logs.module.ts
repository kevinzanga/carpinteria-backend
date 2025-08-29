// src/common/services/logs.module.ts
import { Module } from '@nestjs/common';
import { LogsService } from './logs.service';

@Module({
  providers: [LogsService],
  exports: [LogsService], // permite inyectarlo en otros módulos
})
export class LogsModule {}
