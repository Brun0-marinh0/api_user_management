import {
  Controller,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
} from '@nestjs/common';
import { Role } from './entities/roles.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesService } from './roles.service';

@UseGuards(AuthGuard('jwt'))
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async create(): Promise<Role[]> {
    return this.rolesService.listRoles();
  }
}
