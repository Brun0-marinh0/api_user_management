import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { IUsersRepository } from './users.repository.interface';
import { Repository } from 'typeorm';
import { ICountUsersRepositoryResponseDto } from '../dto/count-users.dto';

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['role'],
    });
  }

  async countUsers(): Promise<ICountUsersRepositoryResponseDto[]> {
    const query = `
        WITH filtered_users AS (
            SELECT u.*, r.description
            FROM users u
            INNER JOIN roles r ON u."roleId" = r.id
            WHERE u.email != 'master@admin.com'
        )
        SELECT
          COUNT(*) AS total_users,
          COUNT(CASE WHEN "isActivated" = TRUE THEN 1 END) AS total_activated,
          COUNT(CASE WHEN "isActivated" = FALSE THEN 1 END) AS total_deactivated,
          COUNT(CASE WHEN description = 'admin' AND "isActivated" = TRUE THEN 1 END) AS admin_activated,
          COUNT(CASE WHEN description = 'admin' AND "isActivated" = FALSE THEN 1 END) AS admin_deactivated,
          COUNT(CASE WHEN description = 'common' AND "isActivated" = TRUE THEN 1 END) AS common_activated,
          COUNT(CASE WHEN description = 'common' AND "isActivated" = FALSE THEN 1 END) AS common_deactivated
        FROM filtered_users
    `;

    return this.usersRepository.query(query);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      order: { createdAt: 'DESC' },
      select: ['email', 'name', 'id', 'isActivated', 'lastName', 'role'],
      relations: ['role'],
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async create(item: User): Promise<User> {
    const newUser = this.usersRepository.create(item);
    return this.usersRepository.save(newUser);
  }

  async update(id: string, item: User): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    const updatedUser = this.usersRepository.merge(user, item);
    return this.usersRepository.save(updatedUser);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.usersRepository.delete(id);

    return result.affected === 0 ? false : true;
  }
}
