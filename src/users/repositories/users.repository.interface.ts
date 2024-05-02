import { ICountUsersRepositoryResponseDto } from '../dto/count-users.dto';
import { User } from '../entities/user.entity';

export interface IUsersRepository {
  findAll(): Promise<User[]>;
  findByEmail(email: string): Promise<User>;
  findById(id: string): Promise<User | null>;
  countUsers(): Promise<ICountUsersRepositoryResponseDto[]>;
  create(item: User): Promise<User>;
  update(id: string, newUser: User): Promise<User>;
  delete(id: string): Promise<boolean>;
}
