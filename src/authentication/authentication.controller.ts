import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './authentication.service';
import { LoginDto } from './dto/login.dto';
import { ValidateTokenDto } from './dto/validate-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('validate')
  async validateToken(@Body() { token }: ValidateTokenDto) {
    return this.authService.validateToken(token);
  }
}
