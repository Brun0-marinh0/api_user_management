import { Inject, Injectable } from '@nestjs/common';
import { IRolesRepository } from './repositories/roles.repository.interface';

@Injectable()
export class RolesService {
  constructor(
    @Inject('IRolesRepository') private rolesRepository: IRolesRepository,
  ) {}

  async listRoles() {
    try {
      return this.rolesRepository.findAll();
    } catch (error) {
      throw error;
    }
  }
}
