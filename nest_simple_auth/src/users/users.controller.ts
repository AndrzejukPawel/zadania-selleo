import { Controller, Get, Headers, HttpException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthService } from 'src/auth/auth.service';

@Controller("users")
export class UsersController {
  constructor(private readonly userService: UserService, private readonly authService: AuthService) { }

  @Get()
  async getUsers(@Headers() headers) {
    const authorization = headers.authorization as string | undefined;
    const token = authorization?.split(' ')[1];
    if (!token) {
      throw new HttpException("Missing authorization token", 401);
    }

    const validation = await this.authService.validateAuthenticationToken(token);
    if (!validation.ok) {
      const { error } = validation;
      throw new HttpException(error.reason, error.code);
    }
    return this.userService.users({})
  }
}

