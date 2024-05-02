import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { ICountUsersResponse } from './dto/count-users.dto';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async list(): Promise<User[]> {
    return this.usersService.listUsers();
  }

  @Get('count')
  @HttpCode(HttpStatus.OK)
  async countUsers(): Promise<ICountUsersResponse> {
    return this.usersService.countUsers();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: string): Promise<User> {
    return this.usersService.findUserById(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string): Promise<void> {
    return this.usersService.deleteUserById(id);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  async update(@Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersService.updateUser(updateUserDto);
  }
}
