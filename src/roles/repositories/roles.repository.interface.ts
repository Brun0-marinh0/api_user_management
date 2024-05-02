import { Role } from '../entities/roles.entity';

export interface IRolesRepository {
  findAll(): Promise<Role[]>;
  findById(id: string): Promise<Role | null>;
}
