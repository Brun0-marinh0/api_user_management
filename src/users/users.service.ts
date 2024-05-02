import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { ConflictException } from '@nestjs/common';
import { IRolesRepository } from '../roles/repositories/roles.repository.interface';
import { IUsersRepository } from './repositories/users.repository.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { validate as uuidValidate } from 'uuid';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject('IUsersRepository') private usersRepository: IUsersRepository,
    @Inject('IRolesRepository') private rolesRepository: IRolesRepository,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const newUser = new User();
    newUser.name = createUserDto.name;
    newUser.lastName = createUserDto.lastName;
    newUser.email = createUserDto.email;
    newUser.password = createUserDto.password;

    const findRole = await this.rolesRepository.findById(createUserDto.roleId);

    if (!findRole) {
      throw new NotFoundException('Role not found');
    }

    newUser.role = findRole;

    try {
      return this.usersRepository.create(newUser);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.message.includes('unique constraint')
      ) {
        throw new ConflictException(
          'A user with the same details already exists',
        );
      }

      throw error;
    }
  }

  async listUsers() {
    try {
      const allUsers = await this.usersRepository.findAll();

      return allUsers.filter((user) => user.email !== 'master@admin.com');
    } catch (error) {
      throw error;
    }
  }

  async findUserById(id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid UUID format for ID.');
    }

    try {
      const user = await this.usersRepository.findById(id);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findById(updateUserDto.id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.email === 'master@admin.com') {
      throw new NotFoundException('The master user cannot be updated!');
    }

    user.name = updateUserDto.name ?? user.name;
    user.lastName = updateUserDto.lastName ?? user.lastName;
    user.email = updateUserDto.email ?? user.email;
    user.isActivated = updateUserDto.isActivated ?? user.isActivated;

    if (updateUserDto.roleId) {
      const findRole = await this.rolesRepository.findById(
        updateUserDto.roleId,
      );
      if (!findRole) {
        throw new NotFoundException('Role not found');
      }
      user.role = findRole;
    }

    try {
      return this.usersRepository.update(user.id, user);
    } catch (error) {
      throw error;
    }
  }

  async deleteUserById(id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid UUID format for ID.');
    }

    try {
      const findUser = await this.usersRepository.findById(id);

      if (!findUser) {
        throw new NotFoundException('User not found');
      }

      if (findUser.email === 'master@admin.com') {
        throw new NotFoundException('The master user cannot be deleted!');
      }

      const deleteUser = await this.usersRepository.delete(id);

      if (!deleteUser) {
        throw new InternalServerErrorException('Failed to delete user');
      }
    } catch (error) {
      throw error;
    }
  }

  async countUsers() {
    try {
      const result = await this.usersRepository.countUsers();

      return {
        totalUsers: result[0].total_users,
        totalActivated: result[0].total_activated,
        totalDeactivated: result[0].total_deactivated,
        totalPerRole: [
          {
            role: 'admin',
            totalActivated: result[0].admin_activated,
            totalDeactivated: result[0].admin_deactivated,
          },
          {
            role: 'common',
            totalActivated: result[0].common_activated,
            totalDeactivated: result[0].common_deactivated,
          },
        ],
      };
    } catch (error) {
      throw error;
    }
  }
}
