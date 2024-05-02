import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './authentication.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './authentication.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UsersRepository } from '../users/repositories/users.repository';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: 'IUsersRepository',
      useClass: UsersRepository,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
