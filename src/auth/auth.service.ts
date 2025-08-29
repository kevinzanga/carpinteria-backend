import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from '../users/database/users.entity';
import { LogsService } from '../common/services/logs.service'; // 👈 Importamos LogsService

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private logsService: LogsService, // 👈 Inyectamos LogsService
  ) {}

  // Registro de usuario
  async register(data: RegisterDto): Promise<User> {
    const user = await this.usersService.createUser(data);

    // Log del registro
    this.logsService.logRegistro(user);

    return user;
  }

  // Login y generar JWT
  async login(loginDto: LoginDto, ip: string, location: string) {
    const { email, password } = loginDto;
    const user = await this.usersService.validatePassword(email, password);

    if (!user) {
      // Log de acceso denegado
      this.logsService.logAccesoDenegado(email, ip, location);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Log de login exitoso
    this.logsService.logLoginExito(user, ip, location);

    const payload = { sub: user.id, username: user.name, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // Logout
  async logout(user: User, ip: string, location: string) {
    this.logsService.logLogout(user, ip, location);
    return { message: 'Logout exitoso' };
  }
  async findUserById(id: number): Promise<User | undefined> {
  return this.usersService.findById(id); // tu UsersService debe tener este método
}

}
