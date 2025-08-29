import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './database/users.entity';
import * as bcrypt from 'bcryptjs';
import { formatUserResponse, formatUsersResponse } from '../common/helpers/user.helper';
import { LogsService } from '../common/services/logs.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private logsService: LogsService, // <-- inyectamos LogsService
  ) {}

  /**
   * Crear un nuevo usuario con contraseña hasheada
   */
  async createUser(data: Partial<User>, ip?: string, location?: string): Promise<any> {
    if (!data.password) {
      throw new BadRequestException('Password is required');
    }

    if (data.role === UserRole.ADMIN) {
      const existingAdmin = await this.usersRepository.findOne({
        where: { role: UserRole.ADMIN },
      });
      if (existingAdmin) {
        throw new BadRequestException('Ya existe un usuario administrador');
      }
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = this.usersRepository.create({
      ...data,
      password: hashedPassword,
    });

    const savedUser = await this.usersRepository.save(user);

    // Registrar log de creación
    if (ip && location) {
      this.logsService.logRegistro(savedUser);
    }

    return formatUserResponse(savedUser);
  }

  async findById(id: number): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    return formatUserResponse(user);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { email } });
    return user ?? undefined;
  }

  async findAll(): Promise<any[]> {
    const users = await this.usersRepository.find();
    return formatUsersResponse(users);
  }

  async validatePassword(email: string, password: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    return user;
  }

  async changePassword(userId: number, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await this.usersRepository.update(userId, { password: hashedPassword });
  }
}
