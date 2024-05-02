import { IsEmail, IsOptional, IsUUID } from 'class-validator';

export class UpdateUserDto {
  @IsUUID()
  id: string;

  @IsOptional()
  name: string;

  @IsOptional()
  lastName: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsUUID()
  roleId: string;

  @IsOptional()
  isActivated: boolean;
}
