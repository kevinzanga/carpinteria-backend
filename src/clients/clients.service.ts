import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './database/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { formatClientsResponse, formatClientResponse } from '../common/helpers/client.helper';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
  ) {}

  async createClient(dto: CreateClientDto): Promise<Client> {
    const client = this.clientsRepository.create(dto);
    return this.clientsRepository.save(client);
  }

  // 🔹 Usando el helper para ocultar datos sensibles
  async findAll(): Promise<any> {
    const clients = await this.clientsRepository.find({ relations: ['orders'] });
    return formatClientsResponse(clients);
  }

  async findById(id: number): Promise<any> {
    const client = await this.clientsRepository.findOne({ where: { id }, relations: ['orders'] });
    if (!client) throw new NotFoundException('Cliente no encontrado');
    return formatClientResponse(client);
  }

  async update(id: number, dto: UpdateClientDto): Promise<Client> {
    const client = await this.findById(id);
    Object.assign(client, dto);
    return this.clientsRepository.save(client);
  }

  async remove(id: number): Promise<{ message: string }> {
    const client = await this.findById(id);
    await this.clientsRepository.remove(client);
    return { message: `Cliente con id ${id} eliminado correctamente` };
  }
}
