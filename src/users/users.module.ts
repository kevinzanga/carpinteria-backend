import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './database/users.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { LogsModule } from '../common/services/logs.module';
@Module({
  imports: [TypeOrmModule.forFeature([User]), LogsModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
