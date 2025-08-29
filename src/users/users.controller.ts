import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { LogsService } from '../common/services/logs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from './database/users.entity';
import type{ Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private logsService: LogsService, // <-- inyectamos LogsService si quieres usar logs desde aquí
  ) {}

  //@UseGuards(JwtAuthGuard, RolesGuard)
  //@Roles(UserRole.ADMIN, UserRole.ENCARGADO) // Solo ADMIN y ENCARGADO pueden crear usuarios
  @Post()
  async create(@Body() data: any, @Req() req: Request) {
    const ip = req.ip;
    const location = req.originalUrl;
    const user = await this.usersService.createUser(data, ip, location);
    return user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ENCARGADO) // Solo ADMIN puede listar usuarios
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }
}
