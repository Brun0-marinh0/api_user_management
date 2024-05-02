import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/roles.entity';
import { User } from '../users/entities/user.entity';
import { RolesRepository } from './repositories/roles.repository';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role, User])],
  controllers: [RolesController],
  providers: [
    RolesService,
    {
      provide: 'IRolesRepository',
      useClass: RolesRepository,
    },
  ],
  exports: [],
})
export class RolesModule {}
