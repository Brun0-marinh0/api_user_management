import { Module } from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from '../roles/entities/roles.entity';
import { RolesRepository } from '../roles/repositories/roles.repository';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'IUsersRepository',
      useClass: UsersRepository,
    },
    {
      provide: 'IRolesRepository',
      useClass: RolesRepository,
    },
  ],
  exports: [],
})
export class UsersModule {}
