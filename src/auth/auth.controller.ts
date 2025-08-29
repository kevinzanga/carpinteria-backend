import { Controller, Post, Body, Req, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import type { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() data: RegisterDto, @Req() req: Request) {
    const user = await this.authService.register(data);

    // Opcional: log ya está en AuthService, aquí podrías usarlo si quieres info extra de IP
    return user;
  }

  @Post('login')
  async login(@Body() data: LoginDto, @Req() req: Request) {
    const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    const location = req.originalUrl;

    return this.authService.login(data, ip.toString(), location);
  }

  @Post('logout')
  async logout(@Body() data: { userId: number }, @Req() req: Request) {
    const user = await this.authService.findUserById(data.userId); // método que devuelve User completo
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    const location = req.originalUrl;

    return this.authService.logout(user, ip.toString(), location);
  }

}
