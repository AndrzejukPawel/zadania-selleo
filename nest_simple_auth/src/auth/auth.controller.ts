import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) { }

  @Post("signin")
  async signIn(@Body() body: { email: string, password: string }) {
    return await this.authService.signIn(body.email, body.password);
  }
}
