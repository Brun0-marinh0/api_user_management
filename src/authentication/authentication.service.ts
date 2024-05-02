import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { IUsersRepository } from '../users/repositories/users.repository.interface';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject('IUsersRepository') private usersRepository: IUsersRepository,
  ) {}

  private async validateUser({ email, password }: LoginDto): Promise<any> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.isActivated === false) {
      throw new UnauthorizedException('User deactivated');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto);

    const payload = {
      email: user.email,
      role: user.role,
      sub: user.id,
    };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  public async validateToken(token: string): Promise<any> {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      return decoded;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
